import { useReducedMotion } from 'motion/react';
import { motion } from 'motion/react';
import { useCallback, useRef, useState, type ChangeEvent, type DragEvent, type KeyboardEvent } from 'react';
import { Image as ImageIcon, Music, Upload, Video } from 'lucide-react';
import { useI18n } from '@/i18n';

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
}

export function Dropzone({ onFilesAdded }: DropzoneProps) {
  const { copy } = useI18n();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const reduceMotion = useReducedMotion();

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files: File[] = Array.from(e.dataTransfer.files);
    if (files.length > 0) onFilesAdded(files);
  }, [onFilesAdded]);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragOver(false), []);

  const openPicker = useCallback(() => inputRef.current?.click(), []);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files: File[] = Array.from(e.target.files ?? []);
    if (files.length > 0) onFilesAdded(files);
    e.target.value = '';
  }, [onFilesAdded]);

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openPicker();
    }
  }, [openPicker]);

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={copy.dropzone.aria}
      className={`relative h-full min-h-[400px] w-full rounded-3xl border border-dashed bg-[#0A0A0A] p-8 transition-colors group overflow-hidden cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400
        ${isDragOver ? 'border-cyan-500/50 bg-cyan-500/5' : 'border-white/15 hover:bg-white/[0.02]'}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onClick={openPicker}
      onKeyDown={onKeyDown}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="sr-only"
        accept="video/*,audio/*,image/*"
        aria-hidden="true"
        tabIndex={-1}
        onChange={handleInputChange}
      />

      <div className="relative z-10 flex h-full flex-col items-center justify-center text-center">
        <div className="flex gap-4 mb-8">
          {[
            { icon: Music, color: "text-blue-400", bg: "bg-blue-400/10", label: copy.dropzone.audio },
            { icon: Video, color: "text-purple-400", bg: "bg-purple-400/10", label: copy.dropzone.video },
            { icon: ImageIcon, color: "text-emerald-400", bg: "bg-emerald-400/10", label: copy.dropzone.image },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: i * 0.1 }}
              className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.bg} border border-white/5`}
              title={item.label}
            >
              <item.icon className={`h-5 w-5 ${item.color}`} aria-hidden="true" />
            </motion.div>
          ))}
        </div>

        <h2 className="text-2xl font-semibold text-white mb-2 tracking-tight">
          {isDragOver ? copy.dropzone.release : copy.dropzone.title}
        </h2>
        <p className="text-gray-300 mb-8 max-w-md text-sm leading-relaxed">
          {copy.dropzone.body}
        </p>

        <span
          className="group/btn relative inline-flex items-center justify-center rounded-full bg-white/5 px-8 py-3 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/10 border border-white/15"
        >
          <span className="mr-2">{copy.dropzone.browse}</span>
          <Upload className="h-4 w-4 opacity-50" aria-hidden="true" />
        </span>
      </div>
    </div>
  );
}
