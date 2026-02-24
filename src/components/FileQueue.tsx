import React from 'react';
import { Settings, X, FileVideo, FileAudio, Image as FileImage, Play, Check, ChevronDown, Download, Loader2, AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QueueFile } from '@/App';

// ---- Single File Item ----

interface FileItemProps {
  item: QueueFile;
  onFormatChange: (id: string, format: string) => void;
  onRemove: (id: string) => void;
  onConvertOne: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

const FileItem: React.FC<FileItemProps> = ({ item, onFormatChange, onRemove, onConvertOne, onRename }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  const startEditing = () => {
    const baseName = item.name.substring(0, item.name.lastIndexOf('.')) || item.name;
    setEditValue(baseName);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== (item.name.substring(0, item.name.lastIndexOf('.')) || item.name)) {
      onRename(item.id, trimmed);
    }
    setIsEditing(false);
  };

  const cancelEdit = () => setIsEditing(false);

  const Icon = item.category === 'video' ? FileVideo : item.category === 'audio' ? FileAudio : FileImage;
  const colorClass = item.category === 'video'
    ? 'text-purple-400 bg-purple-400/10'
    : item.category === 'audio'
      ? 'text-blue-400 bg-blue-400/10'
      : 'text-emerald-400 bg-emerald-400/10';

  return (
    <div className="group relative rounded-xl border border-white/5 bg-[#0A0A0A] p-3 sm:p-4 transition-all hover:border-white/10 hover:bg-white/[0.02] overflow-hidden">

      {/* ===== DESKTOP: single row ===== */}
      <div className="hidden sm:flex items-center gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/5", colorClass)}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              ref={inputRef}
              type="text"
              value={editValue}
              onChange={e => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
              className="w-full bg-white/5 border border-blue-500/50 rounded-lg px-2 py-1 text-base font-medium text-white outline-none focus:border-blue-500"
            />
          ) : (
            <h4 className="truncate text-sm font-medium text-white">{item.name}</h4>
          )}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <span>{item.size}</span><span>·</span><span className="uppercase">{item.category}</span>
            {item.status === 'done' && <span className="text-emerald-400 font-medium">✓</span>}
            {item.status === 'error' && <AlertTriangle className="h-3 w-3 text-red-400" />}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            <select className="appearance-none rounded-lg border border-white/10 bg-[#111] py-1.5 pl-3 pr-8 text-xs font-medium text-white hover:border-white/20 focus:border-blue-500 focus:outline-none" value={item.selectedFormat} onChange={(e) => onFormatChange(item.id, e.target.value)} disabled={item.status === 'converting' || item.status === 'done'}>
              {item.formats.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-500 pointer-events-none" />
          </div>
          {item.status !== 'converting' && (
            isEditing ? (
              <button onClick={saveEdit} className="flex h-8 px-3 items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 active:scale-95" title="Valider">
                <Check className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button onClick={startEditing} className="flex h-8 px-3 items-center rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400 active:scale-95" title="Renommer">
                <Pencil className="h-3.5 w-3.5" />
              </button>
            )
          )}
          {item.status === 'done' && item.blobUrl ? (
            <a href={item.blobUrl} download={item.outputName} className="flex h-8 items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 text-xs font-semibold uppercase tracking-wide text-emerald-400 hover:bg-emerald-500/20 active:scale-95">
              <Download className="h-3.5 w-3.5" /><span>Télécharger</span>
            </a>
          ) : item.status === 'converting' ? (
            <div className="flex h-8 items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-4 text-xs font-semibold uppercase text-blue-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /><span>{item.progress}%</span>
            </div>
          ) : (
            <button onClick={() => onConvertOne(item.id)} className="flex h-8 items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 text-xs font-semibold uppercase tracking-wide text-white hover:bg-white/10 hover:border-white/20 active:scale-95">
              <Play className="h-3.5 w-3.5 fill-current" /><span>Convertir</span>
            </button>
          )}
          <button onClick={() => onRemove(item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-600 hover:bg-red-500/10 hover:text-red-400">
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* ===== MOBILE: info row + buttons row ===== */}
      <div className="flex sm:hidden flex-col gap-2.5">
        {/* Top row: icon + file info */}
        <div className="flex items-center gap-3">
          <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/5", colorClass)}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={e => setEditValue(e.target.value)}
                onBlur={saveEdit}
                onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                className="w-full bg-white/5 border border-blue-500/50 rounded-lg px-2 py-1 text-base font-medium text-white outline-none focus:border-blue-500"
              />
            ) : (
              <h4 className="truncate text-sm font-medium text-white">{item.name}</h4>
            )}
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>{item.size}</span><span>·</span><span className="uppercase">{item.category}</span>
              {item.status === 'done' && <span className="text-emerald-400 font-medium">✓</span>}
              {item.status === 'error' && <AlertTriangle className="h-3 w-3 text-red-400" />}
            </div>
          </div>
        </div>

        {/* Bottom row: all buttons on one line */}
        <div className="flex items-center gap-2">
          {/* Format — left */}
          <div className="relative">
            <select className="appearance-none rounded-lg border border-white/10 bg-[#111] h-7 pl-2.5 pr-7 text-[11px] font-medium text-white focus:outline-none" value={item.selectedFormat} onChange={(e) => onFormatChange(item.id, e.target.value)} disabled={item.status === 'converting' || item.status === 'done'}>
              {item.formats.map(f => <option key={f} value={f}>{f.toUpperCase()}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-2.5 w-2.5 text-gray-500 pointer-events-none" />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Rename + Action + Remove — right */}
          {item.status !== 'converting' && (
            isEditing ? (
              <button onClick={saveEdit} className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 active:scale-95" title="Valider">
                <Check className="h-3 w-3" />
              </button>
            ) : (
              <button onClick={startEditing} className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-400 hover:text-blue-400 active:scale-95" title="Renommer">
                <Pencil className="h-3 w-3" />
              </button>
            )
          )}
          {item.status === 'done' && item.blobUrl ? (
            <a href={item.blobUrl} download={item.outputName} className="flex h-7 items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 text-[11px] font-semibold text-emerald-400 active:scale-95">
              <Download className="h-3 w-3" /><span>Télécharger</span>
            </a>
          ) : item.status === 'converting' ? (
            <div className="flex h-7 items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-2.5 text-[11px] font-semibold text-blue-400">
              <Loader2 className="h-3 w-3 animate-spin" /><span>{item.progress}%</span>
            </div>
          ) : (
            <button onClick={() => onConvertOne(item.id)} className="flex h-7 items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 text-[11px] font-semibold text-white hover:bg-white/10 active:scale-95">
              <Play className="h-3 w-3 fill-current" /><span>Convertir</span>
            </button>
          )}
          <button onClick={() => onRemove(item.id)} className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-600 hover:bg-red-500/10 hover:text-red-400">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {(item.status === 'converting' || item.status === 'done') && (
        <div className={cn("absolute bottom-0 left-0 h-[2px] transition-all duration-300", item.status === 'done' ? 'bg-emerald-500' : 'bg-blue-500')} style={{ width: `${item.progress}%` }} />
      )}
      {item.status === 'error' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500" />}
    </div>
  );
};

// ---- Queue ----

interface FileQueueProps {
  files: QueueFile[];
  converting: boolean;
  onFormatChange: (id: string, format: string) => void;
  onRemove: (id: string) => void;
  onConvertOne: (id: string) => void;
  onConvertAll: () => void;
  onClearAll: () => void;
  onRename: (id: string) => void;
}

export function FileQueue({ files, converting, onFormatChange, onRemove, onConvertOne, onConvertAll, onClearAll, onRename }: FileQueueProps) {
  const pendingCount = files.filter(f => f.status === 'pending' || f.status === 'error').length;
  const doneCount = files.filter(f => f.status === 'done').length;
  const [confirmClear, setConfirmClear] = React.useState(false);

  // Auto-reset confirm after 3s
  React.useEffect(() => {
    if (confirmClear) {
      const t = setTimeout(() => setConfirmClear(false), 3000);
      return () => clearTimeout(t);
    }
  }, [confirmClear]);

  return (
    <div className="w-full rounded-3xl border border-white/5 bg-[#050505] p-4 sm:p-6">
      {/* Header — stacks on mobile */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        {/* Title row */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#111] border border-white/5 text-blue-400 shrink-0">
            <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
          </div>
          <div className="min-w-0">
            <h3 className="text-base sm:text-lg font-semibold text-white leading-tight">File d'attente</h3>
            <p className="text-[10px] sm:text-xs font-medium text-gray-500 uppercase tracking-wide">
              {files.length} fichier{files.length > 1 ? 's' : ''} · {doneCount} terminé{doneCount > 1 ? 's' : ''} · {pendingCount} en attente
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Download All — only when 2+ files are done */}
          {doneCount >= 2 && (
            <button
              onClick={() => {
                const doneFiles = files.filter(f => f.status === 'done' && f.blobUrl);
                doneFiles.forEach((f, i) => {
                  setTimeout(() => {
                    const a = document.createElement('a');
                    a.href = f.blobUrl!;
                    a.download = f.outputName || 'converted';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }, i * 200);
                });
              }}
              className="group flex items-center gap-2 rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 transition-all hover:bg-emerald-500/20 active:scale-[0.98]"
            >
              <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">Tout Télécharger</span>
              <span className="sm:hidden">Tout</span>
            </button>
          )}

          {/* Convert All */}
          <button
            onClick={onConvertAll}
            disabled={converting || pendingCount === 0}
            className={cn(
              "group relative flex items-center gap-2 sm:gap-2.5 rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold overflow-hidden transition-all duration-200",
              converting || pendingCount === 0
                ? "bg-white/5 border border-white/5 text-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:scale-[1.03] active:scale-[0.97]"
            )}
          >
            {converting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
                <span>Conversion...</span>
              </>
            ) : (
              <>
                <span>Tout Convertir</span>
                <Play className="h-3 w-3 sm:h-3.5 sm:w-3.5 fill-current" />
              </>
            )}
          </button>

          {/* Clear All — double-click to confirm */}
          {files.length > 0 && (
            <button
              onClick={() => {
                if (confirmClear) {
                  onClearAll();
                  setConfirmClear(false);
                } else {
                  setConfirmClear(true);
                }
              }}
              disabled={converting}
              className={cn(
                "flex items-center gap-1.5 rounded-xl px-2.5 py-2 sm:p-2.5 transition-all text-xs font-medium",
                converting
                  ? "text-gray-700 cursor-not-allowed"
                  : confirmClear
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse"
                    : "text-gray-500 hover:bg-red-500/10 hover:text-red-400 active:scale-95"
              )}
              title="Tout supprimer"
            >
              <Trash2 className="h-4 w-4 shrink-0" />
              {confirmClear && <span className="sm:hidden">OK?</span>}
            </button>
          )}
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-white/10 bg-white/[0.01]">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#111] border border-white/5 text-gray-600 mb-4">
              <Play className="h-6 w-6" />
            </div>
            <p className="text-sm text-gray-500 font-medium">Aucun fichier dans la file</p>
            <p className="text-xs text-gray-600 mt-1">Déposez des fichiers ci-dessus pour commencer</p>
          </div>
        ) : (
          files.map(item => (
            <FileItem
              key={item.id}
              item={item}
              onFormatChange={onFormatChange}
              onRemove={onRemove}
              onConvertOne={onConvertOne}
              onRename={onRename}
            />
          ))
        )}
      </div>
    </div>
  );
}
