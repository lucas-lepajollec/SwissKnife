export type FileCategory = 'video' | 'audio' | 'image' | 'unknown';

export interface FormatInfo {
    extension: string;
    label: string;
}

export const SIZE_WARNING_BYTES = 50 * 1024 * 1024;

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

/** Canvas can encode these reliably. TIFF/BMP are not offered as outputs. */
export const IMAGE_FORMATS: FormatInfo[] = [
    { extension: 'jpg', label: 'JPG' },
    { extension: 'png', label: 'PNG' },
    { extension: 'webp', label: 'WEBP' },
];

const MIME_MAP: Record<string, FileCategory> = {
    'video/mp4': 'video', 'video/x-matroska': 'video', 'video/webm': 'video',
    'video/x-msvideo': 'video', 'video/quicktime': 'video', 'video/avi': 'video',
    'image/gif': 'video',
    'audio/mpeg': 'audio', 'audio/wav': 'audio', 'audio/aac': 'audio',
    'audio/ogg': 'audio', 'audio/flac': 'audio', 'audio/x-flac': 'audio',
    'audio/mp3': 'audio', 'audio/x-wav': 'audio', 'audio/wave': 'audio',
    'image/jpeg': 'image', 'image/png': 'image', 'image/webp': 'image',
    'image/tiff': 'image', 'image/bmp': 'image', 'image/x-ms-bmp': 'image',
};

const EXT_MAP: Record<string, FileCategory> = {
    mp4: 'video', mkv: 'video', webm: 'video', avi: 'video', mov: 'video', gif: 'video',
    mp3: 'audio', wav: 'audio', aac: 'audio', ogg: 'audio', flac: 'audio', m4a: 'audio',
    jpg: 'image', jpeg: 'image', png: 'image', webp: 'image', tiff: 'image',
    tif: 'image', bmp: 'image',
};

export function fileExtension(name: string): string {
    const i = name.lastIndexOf('.');
    return i === -1 ? '' : name.slice(i + 1).toLowerCase();
}

export function fileBaseName(name: string): string {
    const i = name.lastIndexOf('.');
    return i === -1 ? name : name.slice(0, i);
}

export function detectFileCategory(file: { name: string; type: string }): FileCategory {
    const ext = fileExtension(file.name);
    // GIF: always video (FFmpeg). MIME image/gif must not win as Canvas image.
    if (ext === 'gif' || file.type === 'image/gif') return 'video';
    if (file.type && MIME_MAP[file.type]) return MIME_MAP[file.type];
    return EXT_MAP[ext] ?? 'unknown';
}

export function needsFFmpeg(category: FileCategory): boolean {
    return category === 'video' || category === 'audio';
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
                args.push('-vf', 'fps=10,scale=480:-1:flags=lanczos', '-f', 'gif');
            } else if (outputFormat === 'webm') {
                args.push('-c:v', 'libvpx', '-crf', '30', '-b:v', '0', '-c:a', 'libvorbis');
            } else if (outputFormat === 'mkv' || outputFormat === 'mp4') {
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
    }

    args.push(outputName);
    return args;
}

export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(sizes.length - 1, Math.floor(Math.log(bytes) / Math.log(k)));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function outputMimeType(format: string): string {
    const map: Record<string, string> = {
        mp4: 'video/mp4', mkv: 'video/x-matroska', webm: 'video/webm',
        avi: 'video/x-msvideo', mov: 'video/quicktime', gif: 'image/gif',
        mp3: 'audio/mpeg', wav: 'audio/wav', aac: 'audio/aac',
        ogg: 'audio/ogg', flac: 'audio/flac',
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp',
    };
    return map[format] ?? 'application/octet-stream';
}
