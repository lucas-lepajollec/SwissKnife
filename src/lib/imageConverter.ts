export interface CanvasConvertResult {
    blob: Blob;
    blobUrl: string;
}

const MIME_MAP: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
};

const QUALITY_MAP: Record<string, number> = {
    jpg: 0.92,
    jpeg: 0.92,
    png: 1,
    webp: 0.85,
};

const CANVAS_OUTPUTS = new Set(['jpg', 'jpeg', 'png', 'webp']);

export class ConversionCancelledError extends Error {
    constructor(message = 'Conversion annulée') {
        super(message);
        this.name = 'ConversionCancelledError';
    }
}

function throwIfAborted(signal?: AbortSignal): void {
    if (signal?.aborted) throw new ConversionCancelledError();
}

/**
 * Convert an image with the Canvas API.
 * Outputs: JPG, PNG, WEBP only.
 */
export async function convertImageCanvas(
    file: File,
    outputFormat: string,
    onProgress?: (pct: number) => void,
    signal?: AbortSignal,
): Promise<CanvasConvertResult> {
    throwIfAborted(signal);
    const format = outputFormat.toLowerCase();
    if (!CANVAS_OUTPUTS.has(format)) {
        throw new Error(`Sortie image non supportée : ${format.toUpperCase()}. Utilisez JPG, PNG ou WEBP.`);
    }

    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    onProgress?.(10);

    const imgUrl = URL.createObjectURL(file);
    try {
        const img = await loadImage(imgUrl, signal);
        throwIfAborted(signal);
        onProgress?.(40);

        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Impossible de créer un contexte Canvas 2D');

        if (format === 'jpg' || format === 'jpeg') {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);
        onProgress?.(70);
        throwIfAborted(signal);

        const mimeType = MIME_MAP[format];
        const quality = QUALITY_MAP[format] ?? 1;
        const blob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob(
                (b) => {
                    if (b) resolve(b);
                    else reject(new Error(`Échec de l'export en ${format.toUpperCase()}`));
                },
                mimeType,
                quality,
            );
        });

        onProgress?.(100);
        return { blob, blobUrl: URL.createObjectURL(blob) };
    } catch (err) {
        if (err instanceof ConversionCancelledError) throw err;
        if (ext === 'tif' || ext === 'tiff') {
            throw new Error('Ce navigateur ne peut pas lire le TIFF. Exportez d’abord en PNG ou JPG.', { cause: err });
        }
        if (err instanceof Error && err.message.includes('charger')) {
            throw new Error(`Impossible de lire cette image (${ext || 'format inconnu'}).`, { cause: err });
        }
        throw err;
    } finally {
        URL.revokeObjectURL(imgUrl);
    }
}

function loadImage(src: string, signal?: AbortSignal): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const onAbort = () => {
            img.src = '';
            reject(new ConversionCancelledError());
        };
        if (signal?.aborted) {
            onAbort();
            return;
        }
        signal?.addEventListener('abort', onAbort, { once: true });
        img.onload = () => {
            signal?.removeEventListener('abort', onAbort);
            resolve(img);
        };
        img.onerror = () => {
            signal?.removeEventListener('abort', onAbort);
            reject(new Error('Impossible de charger l\'image'));
        };
        img.src = src;
    });
}
