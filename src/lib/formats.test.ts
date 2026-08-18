import { describe, expect, it } from 'vitest';
import {
    buildFFmpegArgs,
    detectFileCategory,
    fileBaseName,
    getDefaultFormat,
    getOutputFormats,
    IMAGE_FORMATS,
    needsFFmpeg,
} from './formats';

function file(name: string, type = ''): { name: string; type: string } {
    return { name, type };
}

describe('detectFileCategory', () => {
    it('classifies video, audio and image by extension', () => {
        expect(detectFileCategory(file('a.mp4'))).toBe('video');
        expect(detectFileCategory(file('a.mp3'))).toBe('audio');
        expect(detectFileCategory(file('a.png'))).toBe('image');
    });

    it('treats GIF as video even when MIME is image/gif', () => {
        expect(detectFileCategory(file('loop.gif', 'image/gif'))).toBe('video');
        expect(detectFileCategory(file('loop.gif'))).toBe('video');
    });

    it('rejects unknown types', () => {
        expect(detectFileCategory(file('notes.txt', 'text/plain'))).toBe('unknown');
        expect(detectFileCategory(file('doc.pdf', 'application/pdf'))).toBe('unknown');
    });

    it('prefers known MIME when extension is missing', () => {
        expect(detectFileCategory(file('blob', 'audio/wav'))).toBe('audio');
    });
});

describe('needsFFmpeg', () => {
    it('is true only for video and audio', () => {
        expect(needsFFmpeg('video')).toBe(true);
        expect(needsFFmpeg('audio')).toBe(true);
        expect(needsFFmpeg('image')).toBe(false);
        expect(needsFFmpeg('unknown')).toBe(false);
    });
});

describe('image outputs', () => {
    it('does not advertise TIFF or BMP as Canvas outputs', () => {
        const exts = IMAGE_FORMATS.map((f) => f.extension);
        expect(exts).toEqual(['jpg', 'png', 'webp']);
        expect(getOutputFormats('image').map((f) => f.extension)).toEqual(exts);
        expect(getDefaultFormat('image')).toBe('jpg');
    });
});

describe('buildFFmpegArgs', () => {
    it('builds mp4 and mp3 commands', () => {
        expect(buildFFmpegArgs('in.mov', 'out.mp4', 'mp4', 'video')).toContain('libx264');
        expect(buildFFmpegArgs('in.wav', 'out.mp3', 'mp3', 'audio')).toContain('libmp3lame');
    });

    it('does not attach image codecs (images use Canvas)', () => {
        const args = buildFFmpegArgs('in.png', 'out.jpg', 'jpg', 'image');
        expect(args).toEqual(['-i', 'in.png', 'out.jpg']);
    });
});

describe('fileBaseName', () => {
    it('strips the last extension only', () => {
        expect(fileBaseName('photo.final.png')).toBe('photo.final');
    });
});
