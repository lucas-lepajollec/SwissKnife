// ============================================
// SwissKnife — Image Converter (Canvas API)
// Uses the native browser Canvas API for
// image-to-image conversion. Much faster and
// more reliable than FFmpeg WASM for images.
// ============================================

export interface CanvasConvertResult {
    blob: Blob;
    blobUrl: string;
}

const MIME_MAP: Record<string, string> = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
    bmp: 'image/bmp',
    tiff: 'image/tiff',
};

const QUALITY_MAP: Record<string, number> = {
    jpg: 0.92,
    jpeg: 0.92,
    png: 1,
    webp: 0.85,
};

/**
 * Convert an image file to another format using the Canvas API.
 * Supports: JPG, PNG, WEBP natively.
 * BMP and TIFF: falls back to PNG with the correct extension.
 */
export async function convertImageCanvas(
    file: File,
    outputFormat: string,
    onProgress?: (pct: number) => void,
): Promise<CanvasConvertResult> {
    onProgress?.(10);

    // 1. Load the image into an HTMLImageElement
    const imgUrl = URL.createObjectURL(file);
    const img = await loadImage(imgUrl);
    URL.revokeObjectURL(imgUrl);

    onProgress?.(40);

    // 2. Draw onto a canvas
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Impossible de créer un contexte Canvas 2D');

    // White background for JPEG (which doesn't support transparency)
    if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.drawImage(img, 0, 0);

    onProgress?.(70);

    // 3. Export to the target format
    const mimeType = MIME_MAP[outputFormat] ?? 'image/png';
    const quality = QUALITY_MAP[outputFormat] ?? 1;

    const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
            (b) => {
                if (b) resolve(b);
                else reject(new Error(`Échec de l'export en ${outputFormat.toUpperCase()}`));
            },
            mimeType,
            quality,
        );
    });

    onProgress?.(100);

    const blobUrl = URL.createObjectURL(blob);
    return { blob, blobUrl };
}

// ---- Helper: load image from URL ----
function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error('Impossible de charger l\'image'));
        img.src = src;
    });
}
