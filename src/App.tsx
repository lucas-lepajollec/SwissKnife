import { useCallback, useEffect, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { DemoExperience } from '@/components/DemoExperience';
import { Dropzone } from '@/components/Dropzone';
import { PrivacyCard } from '@/components/PrivacyCard';
import { FileQueue } from '@/components/FileQueue';
import { DebugConsole } from '@/components/DebugConsole';
import { BannerList, type BannerMessage } from '@/components/BannerList';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import {
  detectFileCategory,
  fileBaseName,
  fileExtension,
  formatFileSize,
  getDefaultFormat,
  getOutputFormats,
  needsFFmpeg,
  SIZE_WARNING_BYTES,
} from '@/lib/formats';
import { ConversionCancelledError } from '@/lib/imageConverter';
import { useI18n } from '@/i18n';

export interface QueueFile {
  id: string;
  file: File;
  name: string;
  outputBase: string;
  bytes: number;
  size: string;
  category: 'video' | 'audio' | 'image' | 'unknown';
  selectedFormat: string;
  formats: string[];
  status: 'pending' | 'queued' | 'converting' | 'done' | 'error' | 'cancelled';
  progress: number;
  blobUrl?: string;
  outputName?: string;
  errorMsg?: string;
}

let fileIdCounter = 0;
let bannerIdCounter = 0;

export default function App() {
  const { copy } = useI18n();
  const [queue, setQueue] = useState<QueueFile[]>([]);
  const [consoleVisible, setConsoleVisible] = useState(false);
  const [banners, setBanners] = useState<BannerMessage[]>([]);
  const queueRef = useRef(queue);
  queueRef.current = queue;
  const abortMap = useRef(new Map<string, AbortController>());
  const { loaded, loading, logs, convert, cancelMediaEngine, clearLogs } = useFFmpeg();

  const pushBanner = useCallback((text: string) => {
    const id = String(++bannerIdCounter);
    setBanners((prev) => [...prev, { id, text }]);
    window.setTimeout(() => {
      setBanners((prev) => prev.filter((b) => b.id !== id));
    }, 8000);
  }, []);

  const handleFilesAdded = useCallback((files: File[]) => {
    const accepted: QueueFile[] = [];
    const rejected: string[] = [];
    const bulky: string[] = [];

    for (const file of files) {
      const category = detectFileCategory(file);
      if (category === 'unknown') {
        rejected.push(file.name);
        continue;
      }
      if (file.size >= SIZE_WARNING_BYTES) bulky.push(`${file.name} (${formatFileSize(file.size)})`);
      const formats = getOutputFormats(category).map((f) => f.extension);
      const outputBase = fileBaseName(file.name);
      accepted.push({
        id: String(++fileIdCounter),
        file,
        name: file.name,
        outputBase,
        bytes: file.size,
        size: formatFileSize(file.size),
        category,
        selectedFormat: getDefaultFormat(category),
        formats,
        status: 'pending',
        progress: 0,
      });
    }

    if (rejected.length > 0) {
      pushBanner(copy.banners.rejected(rejected));
    }
    if (bulky.length > 0) {
      pushBanner(copy.banners.large(bulky));
    }
    if (accepted.length > 0) setQueue((prev) => [...prev, ...accepted]);
  }, [copy, pushBanner]);

  const handleFormatChange = useCallback((id: string, format: string) => {
    setQueue((prev) => prev.map((f) => f.id === id ? { ...f, selectedFormat: format } : f));
  }, []);

  const handleRemove = useCallback((id: string) => {
    abortMap.current.get(id)?.abort();
    abortMap.current.delete(id);
    setQueue((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.blobUrl) URL.revokeObjectURL(item.blobUrl);
      return prev.filter((f) => f.id !== id);
    });
  }, []);

  const handleClearAll = useCallback(() => {
    abortMap.current.forEach((ac) => ac.abort());
    abortMap.current.clear();
    setQueue((prev) => {
      prev.forEach((f) => { if (f.blobUrl) URL.revokeObjectURL(f.blobUrl); });
      return [];
    });
  }, []);

  const handleRename = useCallback((id: string, newName: string) => {
    setQueue((prev) => prev.map((f) => {
      if (f.id !== id) return f;
      const ext = fileExtension(f.file.name);
      return { ...f, outputBase: newName, name: ext ? `${newName}.${ext}` : newName };
    }));
  }, []);

  const handleConvertOne = useCallback(async (id: string) => {
    const item = queueRef.current.find((f) => f.id === id);
    if (!item || item.status === 'converting' || item.status === 'queued' || item.status === 'done') return;

    const ac = new AbortController();
    abortMap.current.set(id, ac);
    const queued = needsFFmpeg(item.category);
    setQueue((prev) => prev.map((f) => f.id === id
      ? { ...f, status: queued ? 'queued' : 'converting', progress: 0, errorMsg: undefined }
      : f));

    if (queued) {
      setQueue((prev) => prev.map((f) => f.id === id ? { ...f, status: 'converting' } : f));
    }

    try {
      const result = await convert(item.file, item.selectedFormat, {
        signal: ac.signal,
        outputBaseName: item.outputBase,
        onProgress: (pct) => {
          setQueue((prev) => prev.map((f) => f.id === id && f.status === 'converting' ? { ...f, progress: pct } : f));
        },
      });
      if (ac.signal.aborted) throw new ConversionCancelledError();
      setQueue((prev) => prev.map((f) => {
        if (f.id !== id) return f;
        if (f.blobUrl) URL.revokeObjectURL(f.blobUrl);
        return {
          ...f,
          status: 'done',
          progress: 100,
          blobUrl: result.blobUrl,
          outputName: result.outputName,
        };
      }));
    } catch (err) {
      const cancelled = err instanceof ConversionCancelledError || ac.signal.aborted;
      setQueue((prev) => prev.map((f) => f.id === id ? {
        ...f,
        status: cancelled ? 'cancelled' : 'error',
        progress: 0,
        errorMsg: cancelled ? undefined : (err instanceof Error ? err.message : String(err)),
      } : f));
    } finally {
      abortMap.current.delete(id);
    }
  }, [convert]);

  const handleConvertAll = useCallback(async () => {
    const pending = queueRef.current.filter((f) => f.status === 'pending' || f.status === 'error' || f.status === 'cancelled');
    const images = pending.filter((f) => f.category === 'image');
    const media = pending.filter((f) => f.category !== 'image');
    await Promise.all(images.map((item) => handleConvertOne(item.id)));
    for (const item of media) {
      await handleConvertOne(item.id);
    }
  }, [handleConvertOne]);

  const handleCancel = useCallback(async (id: string) => {
    const item = queueRef.current.find((f) => f.id === id);
    abortMap.current.get(id)?.abort();
    if (item && needsFFmpeg(item.category)) {
      await cancelMediaEngine();
    }
    setQueue((prev) => prev.map((f) => f.id === id && (f.status === 'converting' || f.status === 'queued')
      ? { ...f, status: 'cancelled', progress: 0 }
      : f));
  }, [cancelMediaEngine]);

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (queueRef.current.length === 0) return;
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30 selection:text-cyan-100 pb-20">
      <Header loaded={loaded} loading={loading} consoleVisible={consoleVisible} onToggleConsole={() => setConsoleVisible((v) => !v)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        <BannerList messages={banners} onDismiss={(id) => setBanners((prev) => prev.filter((b) => b.id !== id))} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:items-stretch lg:min-h-[450px]">
          <div className="lg:col-span-2 min-h-[400px]">
            <Dropzone onFilesAdded={handleFilesAdded} />
          </div>
          <div className="hidden lg:block lg:col-span-1 min-h-[400px]">
            <PrivacyCard />
          </div>
        </div>

        <FileQueue
          files={queue}
          onFormatChange={handleFormatChange}
          onRemove={handleRemove}
          onConvertOne={handleConvertOne}
          onConvertAll={handleConvertAll}
          onClearAll={handleClearAll}
          onCancel={handleCancel}
          onRename={handleRename}
        />

        <div className="lg:hidden w-full">
          <PrivacyCard />
        </div>
      </main>

      <DebugConsole logs={logs} onClear={clearLogs} visible={consoleVisible} onToggleVisible={setConsoleVisible} />
      {import.meta.env.VITE_DEMO === 'true' && <DemoExperience />}
    </div>
  );
}
