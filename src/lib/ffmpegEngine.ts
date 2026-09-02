import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { ConversionCancelledError } from '@/lib/imageConverter';
import { buildFFmpegArgs, detectFileCategory, outputMimeType, type FileCategory } from '@/lib/formats';
import { messages, type Messages } from '@/i18n';

const LOAD_TIMEOUT_MS = 120_000;
const CORE_BASE = '/ffmpeg';

export type EngineLogType = 'info' | 'error' | 'success' | 'warning';

type Listeners = {
    onLog: (type: EngineLogType, message: string) => void;
    onProgress: (pct: number) => void;
};

let instance: FFmpeg | null = null;
let loadPromise: Promise<FFmpeg> | null = null;
let jobChain: Promise<unknown> = Promise.resolve();
let listeners: Listeners | null = null;
let eventsBound = false;
let copy: Messages['engine'] = messages.en.engine;

export function setFFmpegCopy(next: Messages['engine']): void {
    copy = next;
}

function sanitizeFilename(name: string): string {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9._-]/g, '_');
}

function withTimeout<T>(promise: Promise<T>, ms: number, message: string): Promise<T> {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error(message)), ms);
        promise.then(
            (value) => {
                clearTimeout(timer);
                resolve(value);
            },
            (err: unknown) => {
                clearTimeout(timer);
                reject(err);
            },
        );
    });
}

export function setFFmpegListeners(next: Listeners): void {
    listeners = next;
}

function bindEvents(ffmpeg: FFmpeg): void {
    if (eventsBound) return;
    eventsBound = true;
    ffmpeg.on('progress', ({ progress: p }) => {
        const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
        listeners?.onProgress(pct);
    });
    ffmpeg.on('log', ({ message }) => {
        if (message && !message.startsWith('  configuration:')) {
            listeners?.onLog('info', message);
        }
    });
}

export function isFFmpegLoaded(): boolean {
    return instance !== null;
}

export async function loadFFmpeg(): Promise<FFmpeg> {
    if (instance) return instance;
    if (loadPromise) return loadPromise;

    loadPromise = (async () => {
        listeners?.onLog('info', copy.loadingEngine);
        const ffmpeg = new FFmpeg();
        bindEvents(ffmpeg);
        const origin = window.location.origin;
        await withTimeout(
            ffmpeg.load({
                coreURL: await toBlobURL(`${origin}${CORE_BASE}/ffmpeg-core.js`, 'text/javascript'),
                wasmURL: await toBlobURL(`${origin}${CORE_BASE}/ffmpeg-core.wasm`, 'application/wasm'),
            }),
            LOAD_TIMEOUT_MS,
            copy.engineTimeout,
        );
        instance = ffmpeg;
        listeners?.onLog('success', copy.engineReady);
        return ffmpeg;
    })();

    try {
        return await loadPromise;
    } catch (err) {
        loadPromise = null;
        instance = null;
        eventsBound = false;
        const message = err instanceof Error ? err.message : String(err);
        listeners?.onLog('error', copy.engineLoadFailed(message));
        throw err;
    }
}

export async function terminateFFmpeg(): Promise<void> {
    if (instance) {
        try {
            instance.terminate();
        } catch {
            /* ignore */
        }
    }
    instance = null;
    loadPromise = null;
    eventsBound = false;
    jobChain = Promise.resolve();
}

function enqueue<T>(job: () => Promise<T>): Promise<T> {
    const run = jobChain.then(job, job);
    jobChain = run.then(
        () => undefined,
        () => undefined,
    );
    return run;
}

export interface MediaConvertOptions {
    signal?: AbortSignal;
    onProgress?: (pct: number) => void;
    outputBaseName?: string;
}

export async function convertWithFFmpeg(
    file: File,
    outputFormat: string,
    options: MediaConvertOptions = {},
): Promise<{ blobUrl: string; outputName: string }> {
    const category: FileCategory = detectFileCategory(file);
    if (category !== 'video' && category !== 'audio') {
        throw new Error(copy.mediaOnly);
    }

    return enqueue(async () => {
        if (options.signal?.aborted) throw new ConversionCancelledError();

        const prevProgress = listeners?.onProgress;
        if (options.onProgress) {
            const current = listeners;
            listeners = {
                onLog: current?.onLog ?? (() => undefined),
                onProgress: options.onProgress,
            };
        }

        try {
            const ffmpeg = await loadFFmpeg();
            if (options.signal?.aborted) throw new ConversionCancelledError();

            const originalName = file.name;
            const baseName = options.outputBaseName
                || originalName.substring(0, originalName.lastIndexOf('.'))
                || originalName;
            const outputDisplayName = `${baseName}.${outputFormat}`;
            const safeInput = sanitizeFilename(originalName);
            const safeOutput = sanitizeFilename(`${baseName}.${outputFormat}`);

            listeners?.onLog('info', copy.conversionStart(originalName, outputFormat.toUpperCase()));
            const fileData = await fetchFile(file);
            if (options.signal?.aborted) throw new ConversionCancelledError();

            await ffmpeg.writeFile(safeInput, fileData);
            listeners?.onLog('info', copy.fileLoaded((file.size / 1024 / 1024).toFixed(2)));

            const args = buildFFmpegArgs(safeInput, safeOutput, outputFormat, category);
            listeners?.onLog('info', copy.command(`ffmpeg ${args.join(' ')}`));

            const abort = () => {
                void terminateFFmpeg();
            };
            options.signal?.addEventListener('abort', abort, { once: true });
            try {
                await ffmpeg.exec(args);
            } finally {
                options.signal?.removeEventListener('abort', abort);
            }

            if (options.signal?.aborted) throw new ConversionCancelledError();

            const outputData = await ffmpeg.readFile(safeOutput);
            const bytes = outputData instanceof Uint8Array ? outputData : new TextEncoder().encode(String(outputData));
            const blob = new Blob([bytes], { type: outputMimeType(outputFormat) });
            try { await ffmpeg.deleteFile(safeInput); } catch { /* ignore */ }
            try { await ffmpeg.deleteFile(safeOutput); } catch { /* ignore */ }

            listeners?.onLog('success', copy.conversionDone(outputDisplayName));
            return { blobUrl: URL.createObjectURL(blob), outputName: outputDisplayName };
        } catch (err) {
            if (options.signal?.aborted || (err instanceof Error && err.message.includes('terminate'))) {
                throw new ConversionCancelledError();
            }
            throw err;
        } finally {
            if (options.onProgress && prevProgress && listeners) {
                listeners = { ...listeners, onProgress: prevProgress };
            }
        }
    });
}
