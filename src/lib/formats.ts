// ============================================
// SwissKnife — Format Detection & Mapping
// ============================================

export type FileCategory = 'video' | 'audio' | 'image' | 'unknown';

export interface FormatInfo {
    extension: string;
    label: string;
}

// ---- Format Lists ----

export const VIDEO_FORMATS: FormatInfo[] = [
    { extension: 'mp4', label: 'MP4' },
    { extension: 'mkv', label: 'MKV' },
    { extension: 'webm', label: 'WEBM' },
    { extension: 'avi', label: 'AVI' },
    { extension: 'mov', label: 'MOV' },
    { extension: 'gif', label: 'GIF' },
];

export const AUDIO_FORMATS: FormatInfo[] = [
    { extension: 'mp3', label: 'MP3' },
    { extension: 'wav', label: 'WAV' },
    { extension: 'aac', label: 'AAC' },
    { extension: 'ogg', label: 'OGG' },
    { extension: 'flac', label: 'FLAC' },
];

export const IMAGE_FORMATS: FormatInfo[] = [
    { extension: 'jpg', label: 'JPG' },
    { extension: 'png', label: 'PNG' },
    { extension: 'webp', label: 'WEBP' },
    { extension: 'tiff', label: 'TIFF' },
    { extension: 'bmp', label: 'BMP' },
];

// ---- Detection ----

const MIME_MAP: Record<string, FileCategory> = {
    'video/mp4': 'video', 'video/x-matroska': 'video', 'video/webm': 'video',
    'video/x-msvideo': 'video', 'video/quicktime': 'video', 'video/avi': 'video',
    'audio/mpeg': 'audio', 'audio/wav': 'audio', 'audio/aac': 'audio',
    'audio/ogg': 'audio', 'audio/flac': 'audio', 'audio/x-flac': 'audio',
    'audio/mp3': 'audio', 'audio/x-wav': 'audio',
    'image/jpeg': 'image', 'image/png': 'image', 'image/webp': 'image',
    'image/tiff': 'image', 'image/bmp': 'image', 'image/gif': 'image',
};

const EXT_MAP: Record<string, FileCategory> = {
    mp4: 'video', mkv: 'video', webm: 'video', avi: 'video', mov: 'video',
    mp3: 'audio', wav: 'audio', aac: 'audio', ogg: 'audio', flac: 'audio',
    jpg: 'image', jpeg: 'image', png: 'image', webp: 'image', tiff: 'image',
    tif: 'image', bmp: 'image', gif: 'video', // gif treated as video for FFmpeg
};

export function detectFileCategory(file: File): FileCategory {
    // Try MIME first
    if (file.type && MIME_MAP[file.type]) {
        return MIME_MAP[file.type];
    }
    // Fallback to extension
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    return EXT_MAP[ext] ?? 'unknown';
}

export function getOutputFormats(category: FileCategory): FormatInfo[] {
    switch (category) {
        case 'video': return VIDEO_FORMATS;
        case 'audio': return AUDIO_FORMATS;
        case 'image': return IMAGE_FORMATS;
        default: return [];
    }
}

export function getDefaultFormat(category: FileCategory): string {
    switch (category) {
        case 'video': return 'mp4';
        case 'audio': return 'mp3';
        case 'image': return 'jpg';
        default: return '';
    }
}

// ---- FFmpeg Command Args Builder ----

export function buildFFmpegArgs(
    inputName: string,
    outputName: string,
    outputFormat: string,
    category: FileCategory,
): string[] {
    const args: string[] = ['-i', inputName];

    switch (category) {
        case 'video':
            if (outputFormat === 'gif') {
                // GIF: smaller palette, lower fps for performance
                args.push('-vf', 'fps=10,scale=480:-1:flags=lanczos', '-f', 'gif');
            } else if (outputFormat === 'webm') {
                args.push('-c:v', 'libvpx', '-crf', '30', '-b:v', '0', '-c:a', 'libvorbis');
            } else if (outputFormat === 'mkv' || outputFormat === 'mp4') {
                // Use copy if possible, otherwise re-encode with low preset for slow devices
                args.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28', '-c:a', 'aac');
            } else {
                args.push('-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '28');
            }
            break;

        case 'audio':
            if (outputFormat === 'mp3') {
                args.push('-c:a', 'libmp3lame', '-q:a', '4');
            } else if (outputFormat === 'aac') {
                args.push('-c:a', 'aac', '-b:a', '128k');
            } else if (outputFormat === 'ogg') {
                args.push('-c:a', 'libvorbis', '-q:a', '4');
            } else if (outputFormat === 'flac') {
                args.push('-c:a', 'flac');
            } else if (outputFormat === 'wav') {
                args.push('-c:a', 'pcm_s16le');
            }
            break;

        case 'image':
            // For images, keep it simple — FFmpeg auto-detects codecs from extension
            // -y to overwrite, -update 1 for single image output
            if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
                args.push('-update', '1', '-q:v', '2');
            } else if (outputFormat === 'png') {
                args.push('-update', '1');
            } else if (outputFormat === 'webp') {
                args.push('-update', '1', '-q:v', '75');
            } else if (outputFormat === 'bmp') {
                args.push('-update', '1', '-pix_fmt', 'bgr24');
            } else if (outputFormat === 'tiff') {
                args.push('-update', '1');
            }
            break;
    }

    args.push(outputName);
    return args;
}

// ---- Helper: human-readable file size ----
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
