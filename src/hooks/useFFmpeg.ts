// ============================================
// SwissKnife — useFFmpeg Hook
// Lazy-loads FFmpeg WASM, exposes convert(),
// progress (0-100), and log stream for UI.
// ============================================

import { useRef, useState, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import type { Log } from '@/components/DebugConsole';
import { buildFFmpegArgs, detectFileCategory, type FileCategory } from '@/lib/formats';
import { convertImageCanvas } from '@/lib/imageConverter';

export interface ConvertResult {
    blobUrl: string;
    outputName: string;
}

// Sanitize filename for FFmpeg virtual FS (no spaces, accents, or special chars)
function sanitizeFilename(name: string): string {
    return name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // remove accents
        .replace(/[^a-zA-Z0-9._-]/g, '_'); // replace special chars with _
}

export function useFFmpeg() {
    const ffmpegRef = useRef<FFmpeg | null>(null);
    const loadingRef = useRef(false); // ref to prevent double init (StrictMode)
    const [loaded, setLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [logs, setLogs] = useState<Log[]>([]);
    const [converting, setConverting] = useState(false);
    const logIdRef = useRef(0);

    // ---- Helper: add a log entry ----
    const addLog = useCallback((type: Log['type'], message: string) => {
        const id = String(++logIdRef.current);
        const timestamp = new Date().toLocaleTimeString('fr-FR', { hour12: false });
        setLogs(prev => [...prev, { id, type, message, timestamp }]);
    }, []);

    // ---- Load FFmpeg (lazy, once) ----
    const load = useCallback(async () => {
        // Use ref to prevent double-init from React StrictMode
        if (ffmpegRef.current || loadingRef.current) return;
        loadingRef.current = true;

        setLoading(true);
        addLog('info', 'Initialisation du moteur FFmpeg WASM...');

        try {
            const ffmpeg = new FFmpeg();

            // Wire up events BEFORE loading
            ffmpeg.on('progress', ({ progress: p }) => {
                const pct = Math.min(100, Math.max(0, Math.round(p * 100)));
                setProgress(pct);
            });

            ffmpeg.on('log', ({ message }) => {
                // Filter noisy lines
                if (message && !message.startsWith('  configuration:')) {
                    addLog('info', message);
                }
            });

            // Load with CDN base URL (unpkg serves the correct CORS headers)
            const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
            await ffmpeg.load({
                coreURL: `${baseURL}/ffmpeg-core.js`,
                wasmURL: `${baseURL}/ffmpeg-core.wasm`,
            });

            ffmpegRef.current = ffmpeg;
            setLoaded(true);
            addLog('success', 'Moteur FFmpeg chargé avec succès (single-thread, compatible tous appareils)');
        } catch (err: any) {
            loadingRef.current = false;
            addLog('error', `Échec du chargement FFmpeg: ${err?.message || String(err)}`);
            throw err;
        } finally {
            setLoading(false);
        }
    }, [addLog]);

    // ---- Convert a file ----
    const convert = useCallback(async (
        file: File,
        outputFormat: string,
    ): Promise<ConvertResult> => {
        setConverting(true);
        setProgress(0);

        const category: FileCategory = detectFileCategory(file);
        const originalName = file.name;
        const inputExtension = originalName.split('.').pop()?.toLowerCase() ?? '';
        const baseName = originalName.substring(0, originalName.lastIndexOf('.')) || originalName;
        const outputDisplayName = `${baseName}.${outputFormat}`;

        addLog('info', `Début de conversion: ${originalName} → ${outputFormat.toUpperCase()}`);

        try {
            let blobUrl: string;

            if (category === 'image') {
                // ---- IMAGE: use Canvas API (fast, no memory issues) ----
                addLog('info', 'Conversion image via Canvas API (natif navigateur)');
                const result = await convertImageCanvas(file, outputFormat, (pct) => {
                    setProgress(pct);
                });
                blobUrl = result.blobUrl;
            } else {
                // ---- VIDEO / AUDIO: use FFmpeg WASM ----
                if (!ffmpegRef.current) {
                    await load();
                }
                const ffmpeg = ffmpegRef.current!;

                // Sanitize for FFmpeg virtual FS
                const safeInput = sanitizeFilename(originalName);
                const safeOutput = sanitizeFilename(`${baseName}.${outputFormat}`);

                const fileData = await fetchFile(file);
                await ffmpeg.writeFile(safeInput, fileData);
                addLog('info', `Fichier chargé en mémoire (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

                const args = buildFFmpegArgs(safeInput, safeOutput, outputFormat, category);
                addLog('info', `Commande: ffmpeg ${args.join(' ')}`);

                await ffmpeg.exec(args);

                const outputData = await ffmpeg.readFile(safeOutput);
                const blob = new Blob([outputData], { type: getMimeType(outputFormat) });
                blobUrl = URL.createObjectURL(blob);

                try { await ffmpeg.deleteFile(safeInput); } catch { /* ignore */ }
                try { await ffmpeg.deleteFile(safeOutput); } catch { /* ignore */ }
            }

            setProgress(100);
            addLog('success', `Conversion terminée: ${outputDisplayName}`);

            return { blobUrl, outputName: outputDisplayName };
        } catch (err: any) {
            const errMsg = err?.message || String(err) || 'Erreur inconnue';
            addLog('error', `Erreur de conversion: ${errMsg}`);

            throw err;
        } finally {
            setConverting(false);
        }
    }, [load, addLog]);

    // ---- Clear logs ----
    const clearLogs = useCallback(() => setLogs([]), []);

    return {
        loaded,
        loading,
        progress,
        logs,
        converting,
        load,
        convert,
        clearLogs,
    };
}

// ---- Helpers ----

function getMimeType(format: string): string {
    const map: Record<string, string> = {
        mp4: 'video/mp4', mkv: 'video/x-matroska', webm: 'video/webm',
        avi: 'video/x-msvideo', mov: 'video/quicktime', gif: 'image/gif',
        mp3: 'audio/mpeg', wav: 'audio/wav', aac: 'audio/aac',
        ogg: 'audio/ogg', flac: 'audio/flac',
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
        webp: 'image/webp', tiff: 'image/tiff', bmp: 'image/bmp',
        pdf: 'application/pdf',
    };
    return map[format] ?? 'application/octet-stream';
}
