import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  Download,
  FileAudio,
  FileQuestion,
  FileVideo,
  Image as FileImage,
  Info,
  Loader2,
  Pencil,
  Play,
  Square,
  Trash2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { QueueFile } from '@/App';
import { SIZE_WARNING_BYTES, formatFileSize } from '@/lib/formats';

interface FileItemProps {
  item: QueueFile;
  onFormatChange: (id: string, format: string) => void;
  onRemove: (id: string) => void;
  onConvertOne: (id: string) => void;
  onCancel: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

const FileItem = ({ item, onFormatChange, onRemove, onConvertOne, onCancel, onRename }: FileItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const busy = item.status === 'converting' || item.status === 'queued';
  const done = item.status === 'done';

  const startEditing = () => {
    setEditValue(item.outputBase);
    setIsEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== item.outputBase) onRename(item.id, trimmed);
    setIsEditing(false);
  };

  const Icon = item.category === 'video'
    ? FileVideo
    : item.category === 'audio'
      ? FileAudio
      : item.category === 'image'
        ? FileImage
        : FileQuestion;
  const colorClass = item.category === 'video'
    ? 'text-purple-400 bg-purple-400/10'
    : item.category === 'audio'
      ? 'text-blue-400 bg-blue-400/10'
      : item.category === 'image'
        ? 'text-emerald-400 bg-emerald-400/10'
        : 'text-amber-300 bg-amber-400/10';

  const convertLabel = item.status === 'error' || item.status === 'cancelled' ? 'Réessayer' : 'Convertir';
  const tooBig = item.bytes >= SIZE_WARNING_BYTES;

  const actions = (
    <>
      <div className="relative">
        <select
          className="appearance-none rounded-lg border border-white/15 bg-[#111] py-1.5 pl-3 pr-8 text-xs font-medium text-white hover:border-white/25 focus:border-cyan-400 focus:outline-none disabled:opacity-50"
          value={item.selectedFormat}
          aria-label={`Format de sortie pour ${item.name}`}
          onChange={(e) => onFormatChange(item.id, e.target.value)}
          disabled={busy || done}
        >
          {item.formats.map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3 w-3 text-gray-400 pointer-events-none" aria-hidden="true" />
      </div>
      {!busy && (
        isEditing ? (
          <button type="button" onClick={saveEdit} className="flex h-8 px-3 items-center rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300" title="Valider">
            <Check className="h-3.5 w-3.5" />
          </button>
        ) : (
          <button type="button" onClick={startEditing} disabled={done} className="flex h-8 px-3 items-center rounded-lg border border-white/15 bg-white/5 text-gray-300 hover:text-cyan-300 disabled:opacity-40" title="Renommer">
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )
      )}
      {done && item.blobUrl ? (
        <a href={item.blobUrl} download={item.outputName} className="flex h-8 items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-4 text-xs font-semibold tracking-wide text-emerald-300 hover:bg-emerald-500/20">
          <Download className="h-3.5 w-3.5" /><span>Télécharger</span>
        </a>
      ) : item.status === 'converting' ? (
        <button type="button" onClick={() => onCancel(item.id)} className="flex h-8 items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 text-xs font-semibold text-red-300">
          <Square className="h-3 w-3 fill-current" /><span>{item.progress}%</span>
          <span className="hidden sm:inline">Annuler</span>
        </button>
      ) : item.status === 'queued' ? (
        <div className="flex h-8 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 text-xs font-semibold text-gray-300">
          <Loader2 className="h-3.5 w-3.5 animate-spin" /><span>En file</span>
        </div>
      ) : (
        <button type="button" onClick={() => onConvertOne(item.id)} className="flex h-8 items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-4 text-xs font-semibold tracking-wide text-white hover:bg-white/10">
          <Play className="h-3.5 w-3.5 fill-current" /><span>{convertLabel}</span>
        </button>
      )}
      <button type="button" onClick={() => onRemove(item.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-red-500/10 hover:text-red-400" aria-label={`Retirer ${item.name}`}>
        <X className="h-4 w-4" />
      </button>
    </>
  );

  const nameBlock = (
    <div className="flex-1 min-w-0">
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setIsEditing(false); }}
          className="w-full bg-white/5 border border-cyan-500/50 rounded-lg px-2 py-1 text-base font-medium text-white outline-none"
        />
      ) : (
        <h3 className="truncate text-sm font-medium text-white">{item.name}</h3>
      )}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-gray-400">
        <span>{item.size}</span><span>·</span><span className="uppercase">{item.category === 'unknown' ? 'inconnu' : item.category}</span>
        {item.status === 'done' && <span className="text-emerald-300 font-medium">✓</span>}
        {item.status === 'error' && <AlertTriangle className="h-3 w-3 text-red-400" />}
        {item.status === 'cancelled' && <span className="text-amber-300">annulé</span>}
        {tooBig && <span className="text-amber-300">fichier volumineux</span>}
      </div>
      {item.status === 'error' && item.errorMsg && (
        <p className="mt-1 text-xs text-red-300 leading-relaxed">{item.errorMsg}</p>
      )}
    </div>
  );

  return (
    <div className="group relative rounded-xl border border-white/10 bg-[#0A0A0A] p-3 sm:p-4 overflow-hidden">
      <div className="hidden sm:flex items-center gap-4">
        <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-white/10', colorClass)}>
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        {nameBlock}
        <div className="flex items-center gap-3 shrink-0">{actions}</div>
      </div>
      <div className="flex sm:hidden flex-col gap-2.5">
        <div className="flex items-center gap-3">
          <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10', colorClass)}>
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          {nameBlock}
        </div>
        <div className="flex items-center gap-2 flex-wrap">{actions}</div>
      </div>
      {(item.status === 'converting' || item.status === 'done') && (
        <div className={cn('absolute bottom-0 left-0 h-[2px]', item.status === 'done' ? 'bg-emerald-400' : 'bg-cyan-400')} style={{ width: `${item.progress}%` }} />
      )}
      {item.status === 'error' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-red-500" />}
    </div>
  );
};

interface FileQueueProps {
  files: QueueFile[];
  onFormatChange: (id: string, format: string) => void;
  onRemove: (id: string) => void;
  onConvertOne: (id: string) => void;
  onConvertAll: () => void;
  onClearAll: () => void;
  onCancel: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export function FileQueue({
  files,
  onFormatChange,
  onRemove,
  onConvertOne,
  onConvertAll,
  onClearAll,
  onCancel,
  onRename,
}: FileQueueProps) {
  const pendingCount = files.filter((f) => f.status === 'pending' || f.status === 'error' || f.status === 'cancelled').length;
  const doneCount = files.filter((f) => f.status === 'done').length;
  const busy = files.some((f) => f.status === 'converting' || f.status === 'queued');
  const [confirmClear, setConfirmClear] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const helpText = `Les images peuvent être converties en parallèle. L’audio et la vidéo partagent un seul moteur FFmpeg et passent l’un après l’autre. Au-delà de ${formatFileSize(SIZE_WARNING_BYTES)}, la mémoire du navigateur peut saturer.`;

  useEffect(() => {
    if (!confirmClear) return;
    const t = setTimeout(() => setConfirmClear(false), 3000);
    return () => clearTimeout(t);
  }, [confirmClear]);

  return (
    <div className="w-full rounded-3xl border border-white/10 bg-[#050505] p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-[#111] border border-white/10 text-cyan-300 shrink-0">
            <Play className="h-4 w-4 sm:h-5 sm:w-5 fill-current" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h2 className="text-base sm:text-lg font-semibold text-white leading-tight">File d&apos;attente</h2>
              <span className="relative inline-flex">
                <button
                  type="button"
                  className="flex h-6 w-6 items-center justify-center rounded-full text-gray-400 hover:text-cyan-300 hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
                  aria-label="Informations sur la file d’attente"
                  aria-expanded={helpOpen}
                  aria-describedby={helpOpen ? 'queue-help' : undefined}
                  onMouseEnter={() => setHelpOpen(true)}
                  onMouseLeave={() => setHelpOpen(false)}
                  onFocus={() => setHelpOpen(true)}
                  onBlur={() => setHelpOpen(false)}
                  onClick={() => {
                    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
                    setHelpOpen((open) => !open)
                  }}
                >
                  <Info className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                {helpOpen && (
                  <span
                    id="queue-help"
                    role="tooltip"
                    className="absolute left-0 top-full z-30 mt-2 w-72 max-w-[min(18rem,calc(100vw-3rem))] rounded-xl border border-white/15 bg-[#111] px-3 py-2 text-[11px] font-normal normal-case tracking-normal text-gray-200 leading-relaxed shadow-xl"
                  >
                    {helpText}
                  </span>
                )}
              </span>
            </div>
            <p className="text-[10px] sm:text-xs font-medium text-gray-400 uppercase tracking-wide">
              {files.length} fichier{files.length > 1 ? 's' : ''} · {doneCount} terminé{doneCount > 1 ? 's' : ''} · {pendingCount} en attente
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          {doneCount >= 2 && (
            <button
              type="button"
              onClick={() => {
                files.filter((f) => f.status === 'done' && f.blobUrl).forEach((f, i) => {
                  window.setTimeout(() => {
                    const a = document.createElement('a');
                    a.href = f.blobUrl!;
                    a.download = f.outputName || 'converted';
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }, i * 200);
                });
              }}
              className="flex items-center gap-2 rounded-xl px-3 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-emerald-300 border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Tout télécharger</span>
              <span className="sm:hidden">Tout</span>
            </button>
          )}
          <button
            type="button"
            onClick={onConvertAll}
            disabled={busy || pendingCount === 0}
            className={cn(
              'flex items-center gap-2 rounded-xl px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold transition-colors',
              busy || pendingCount === 0
                ? 'bg-white/5 border border-white/10 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-cyan-700 to-indigo-600 text-white hover:from-cyan-600',
            )}
          >
            {busy ? (
              <><Loader2 className="h-4 w-4 animate-spin" /><span>Conversion…</span></>
            ) : (
              <><span>Tout convertir</span><Play className="h-3.5 w-3.5 fill-current" /></>
            )}
          </button>
          {files.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (confirmClear) {
                  onClearAll();
                  setConfirmClear(false);
                } else setConfirmClear(true);
              }}
              disabled={busy}
              className={cn(
                'flex items-center gap-1.5 rounded-xl px-2.5 py-2 sm:p-2.5 text-xs font-medium',
                busy ? 'text-gray-600 cursor-not-allowed' : confirmClear
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'text-gray-400 hover:bg-red-500/10 hover:text-red-300',
              )}
              title="Tout supprimer"
            >
              <Trash2 className="h-4 w-4 shrink-0" />
              {confirmClear && <span>OK ?</span>}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-dashed border-white/15 bg-white/[0.01]">
            <p className="text-sm text-gray-300 font-medium">Aucun fichier dans la file</p>
            <p className="text-xs text-gray-400 mt-1">Déposez des fichiers ci-dessus pour commencer</p>
          </div>
        ) : (
          files.map((item) => (
            <FileItem
              key={item.id}
              item={item}
              onFormatChange={onFormatChange}
              onRemove={onRemove}
              onConvertOne={onConvertOne}
              onCancel={onCancel}
              onRename={onRename}
            />
          ))
        )}
      </div>
    </div>
  );
}
