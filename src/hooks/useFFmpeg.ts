import { useCallback, useEffect, useRef, useState } from 'react';
import type { Log } from '@/components/DebugConsole';
import {
    convertWithFFmpeg,
    isFFmpegLoaded,
    loadFFmpeg,
    setFFmpegListeners,
    terminateFFmpeg,
} from '@/lib/ffmpegEngine';
import { detectFileCategory, fileBaseName, needsFFmpeg } from '@/lib/formats';
import { ConversionCancelledError, convertImageCanvas } from '@/lib/imageConverter';

export interface ConvertResult {
    blobUrl: string;
    outputName: string;
}

export interface ConvertOptions {
    signal?: AbortSignal;
    onProgress?: (pct: number) => void;
    outputBaseName?: string;
}

export function useFFmpeg() {
    const [loaded, setLoaded] = useState(() => isFFmpegLoaded());
    const [loading, setLoading] = useState(false);
    const [logs, setLogs] = useState<Log[]>([]);
    const [mediaBusy, setMediaBusy] = useState(false);
    const logIdRef = useRef(0);
    const progressRef = useRef<(pct: number) => void>(() => undefined);

    const addLog = useCallback((type: Log['type'], message: string) => {
        const id = String(++logIdRef.current);
        const timestamp = new Date().toLocaleTimeString('fr-FR', { hour12: false });
        setLogs((prev) => [...prev, { id, type, message, timestamp }]);
    }, []);

    useEffect(() => {
        setFFmpegListeners({
            onLog: addLog,
            onProgress: (pct) => progressRef.current(pct),
        });
    }, [addLog]);

    const load = useCallback(async () => {
        if (isFFmpegLoaded()) {
            setLoaded(true);
            return;
        }
        setLoading(true);
        try {
            await loadFFmpeg();
            setLoaded(true);
        } finally {
            setLoading(false);
            setLoaded(isFFmpegLoaded());
        }
    }, []);

    const convert = useCallback(async (
        file: File,
        outputFormat: string,
        options: ConvertOptions = {},
    ): Promise<ConvertResult> => {
        const category = detectFileCategory(file);
        const baseName = options.outputBaseName || fileBaseName(file.name);
        const outputDisplayName = `${baseName}.${outputFormat}`;

        if (category === 'image') {
            addLog('info', `Conversion image (Canvas) : ${file.name} → ${outputFormat.toUpperCase()}`);
            const result = await convertImageCanvas(
                file,
                outputFormat,
                options.onProgress,
                options.signal,
            );
            addLog('success', `Conversion terminée : ${outputDisplayName}`);
            return { blobUrl: result.blobUrl, outputName: outputDisplayName };
        }

        if (!needsFFmpeg(category)) {
            throw new Error('Type de fichier non convertible.');
        }

        progressRef.current = options.onProgress ?? (() => undefined);
        setMediaBusy(true);
        try {
            if (!isFFmpegLoaded()) {
                setLoading(true);
                await loadFFmpeg();
                setLoaded(true);
                setLoading(false);
            }
            return await convertWithFFmpeg(file, outputFormat, options);
        } catch (err) {
            const message = err instanceof Error ? err.message : String(err);
            if (!(err instanceof ConversionCancelledError)) {
                addLog('error', `Erreur de conversion : ${message}`);
            } else {
                addLog('warning', 'Conversion annulée.');
            }
            throw err;
        } finally {
            setMediaBusy(false);
            setLoading(false);
            progressRef.current = () => undefined;
        }
    }, [addLog]);

    const cancelMediaEngine = useCallback(async () => {
        await terminateFFmpeg();
        setLoaded(false);
        setLoading(false);
        setMediaBusy(false);
    }, []);

    const clearLogs = useCallback(() => setLogs([]), []);

    return {
        loaded,
        loading,
        logs,
        mediaBusy,
        load,
        convert,
        cancelMediaEngine,
        clearLogs,
    };
}
