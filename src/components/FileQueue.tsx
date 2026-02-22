import React from 'react';
import { Settings, X, FileVideo, FileAudio, Image as FileImage, Play, Check, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileItemProps {
  name: string;
  size: string;
  type: 'video' | 'audio' | 'image';
  format: string;
  formats: string[];
  progress?: number;
}

const FileItem: React.FC<FileItemProps> = ({ name, size, type, format, formats, progress }) => {
  const Icon = type === 'video' ? FileVideo : type === 'audio' ? FileAudio : FileImage;
  const colorClass = type === 'video' ? 'text-purple-400 bg-purple-400/10' : type === 'audio' ? 'text-blue-400 bg-blue-400/10' : 'text-emerald-400 bg-emerald-400/10';

  return (
    <div className="group relative flex items-center gap-4 rounded-xl border border-white/5 bg-[#0A0A0A] p-4 transition-all hover:border-white/10 hover:bg-white/[0.02]">
      {/* Icon */}
      <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/5", colorClass)}>
        <Icon className="h-6 w-6" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="truncate text-sm font-medium text-white">{name}</h4>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{size}</span>
          <span>•</span>
          <span className="uppercase">{type}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Format Selector */}
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-600">Format</span>
          <div className="relative">
            <select 
              className="appearance-none rounded-lg border border-white/10 bg-[#111] py-1.5 pl-3 pr-8 text-xs font-medium text-white transition-colors hover:border-white/20 focus:border-blue-500 focus:outline-none"
              defaultValue={format}
            >
              {formats.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Settings */}
        <button className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-white/5 hover:text-white">
          <Settings className="h-4 w-4" />
        </button>

        {/* Action Button */}
        <button className="hidden sm:flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-xs font-semibold uppercase tracking-wide text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95">
          <span>Convertir</span>
        </button>

        {/* Remove */}
        <button className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-red-500/10 hover:text-red-400">
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progress Bar (if active) */}
      {progress !== undefined && (
        <div className="absolute bottom-0 left-0 h-[2px] bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
      )}
    </div>
  );
};

export function FileQueue() {
  const files: FileItemProps[] = [
    {
      name: "vacances_ete_2024.mov",
      size: "43.11 MB",
      type: "video",
      format: "MP4",
      formats: ["MP4", "MKV", "WEBM", "AVI", "MOV", "GIF"],
      progress: 45
    },
    {
      name: "interview_podcast_final.wav",
      size: "11.83 MB",
      type: "audio",
      format: "MP3",
      formats: ["MP3", "AAC", "OGG", "WAV", "FLAC", "M4A"],
    },
    {
      name: "scan_contrat_signé.png",
      size: "2.00 MB",
      type: "image",
      format: "WEBP",
      formats: ["WEBP", "JPG", "PNG", "AVIF", "TIFF", "PDF"],
    }
  ];

  return (
    <div className="w-full rounded-3xl border border-white/5 bg-[#050505] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#111] border border-white/5 text-blue-400">
            <Play className="h-5 w-5 fill-current" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">File d'attente intelligente</h3>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">3 Fichiers prêts</p>
          </div>
        </div>

        <button className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 transition-all hover:shadow-blue-900/40 hover:scale-[1.02] active:scale-[0.98]">
          <span>Tout Convertir</span>
          <Check className="h-4 w-4" />
        </button>
      </div>

      {/* List */}
      <div className="space-y-3">
        {files.map((file, i) => (
          <FileItem 
            key={i}
            name={file.name}
            size={file.size}
            type={file.type}
            format={file.format}
            formats={file.formats}
            progress={file.progress}
          />
        ))}
      </div>
    </div>
  );
}
