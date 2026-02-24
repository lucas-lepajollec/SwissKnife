import React, { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Dropzone } from '@/components/Dropzone';
import { PrivacyCard } from '@/components/PrivacyCard';
import { FileQueue } from '@/components/FileQueue';
import { DebugConsole } from '@/components/DebugConsole';
import { useFFmpeg } from '@/hooks/useFFmpeg';
import { detectFileCategory, getOutputFormats, getDefaultFormat, formatFileSize } from '@/lib/formats';

export interface QueueFile {
  id: string;
  file: File;
  name: string;
  size: string;
  category: 'video' | 'audio' | 'image' | 'unknown';
  selectedFormat: string;
  formats: string[];
  status: 'pending' | 'converting' | 'done' | 'error';
  progress: number;
  blobUrl?: string;
  outputName?: string;
  errorMsg?: string;
}

let fileIdCounter = 0;

export default function App() {
  const [queue, setQueue] = useState<QueueFile[]>([]);
  const [consoleVisible, setConsoleVisible] = useState(false);
  const { loaded, loading, progress, logs, converting, load, convert, clearLogs } = useFFmpeg();

  // ---- Add files to queue ----
  const handleFilesAdded = useCallback((files: File[]) => {
    const newItems: QueueFile[] = files.map(file => {
      const category = detectFileCategory(file);
      const formats = getOutputFormats(category).map(f => f.extension);
      return {
        id: String(++fileIdCounter),
        file,
        name: file.name,
        size: formatFileSize(file.size),
        category,
        selectedFormat: getDefaultFormat(category),
        formats,
        status: 'pending' as const,
        progress: 0,
      };
    });
    setQueue(prev => [...prev, ...newItems]);
  }, []);

  // ---- Change output format for a file ----
  const handleFormatChange = useCallback((id: string, format: string) => {
    setQueue(prev => prev.map(f => f.id === id ? { ...f, selectedFormat: format } : f));
  }, []);

  // ---- Remove file from queue ----
  const handleRemove = useCallback((id: string) => {
    setQueue(prev => {
      const item = prev.find(f => f.id === id);
      if (item?.blobUrl) URL.revokeObjectURL(item.blobUrl);
      return prev.filter(f => f.id !== id);
    });
  }, []);

  // ---- Clear all files from queue ----
  const handleClearAll = useCallback(() => {
    setQueue(prev => {
      prev.forEach(f => { if (f.blobUrl) URL.revokeObjectURL(f.blobUrl); });
      return [];
    });
  }, []);

  // ---- Rename output file ----
  const handleRename = useCallback((id: string, newName: string) => {
    setQueue(prev => prev.map(f => {
      if (f.id !== id) return f;
      const ext = f.name.split('.').pop() || '';
      return { ...f, name: `${newName}.${ext}`, outputName: `${newName}.${f.selectedFormat}` };
    }));
  }, []);

  // ---- Convert a single file ----
  const handleConvertOne = useCallback(async (id: string) => {
    const item = queue.find(f => f.id === id);
    if (!item || item.status === 'converting') return;

    // Ensure FFmpeg is loaded
    if (!loaded && !loading) {
      await load();
    }

    setQueue(prev => prev.map(f => f.id === id ? { ...f, status: 'converting', progress: 0 } : f));

    try {
      const result = await convert(item.file, item.selectedFormat);
      setQueue(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'done',
        progress: 100,
        blobUrl: result.blobUrl,
        outputName: result.outputName,
      } : f));
    } catch (err: any) {
      setQueue(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'error',
        progress: 0,
        errorMsg: err.message,
      } : f));
    }
  }, [queue, loaded, loading, load, convert]);

  // ---- Convert all pending files ----
  const handleConvertAll = useCallback(async () => {
    const pending = queue.filter(f => f.status === 'pending' || f.status === 'error');
    for (const item of pending) {
      await handleConvertOne(item.id);
    }
  }, [queue, handleConvertOne]);

  // ---- Update progress on the currently converting file ----
  React.useEffect(() => {
    setQueue(prev => prev.map(f =>
      f.status === 'converting' ? { ...f, progress } : f
    ));
  }, [progress]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30 selection:text-blue-200 pb-20">
      <Header loaded={loaded} loading={loading} consoleVisible={consoleVisible} onToggleConsole={() => setConsoleVisible(v => !v)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Desktop: Bento Grid (Dropzone + Privacy side by side) */}
        {/* Mobile: Dropzone only, Privacy moves below queue */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto lg:h-[450px]">
          <div className="lg:col-span-2 h-full">
            <Dropzone onFilesAdded={handleFilesAdded} />
          </div>
          <div className="hidden lg:block lg:col-span-1 h-full">
            <PrivacyCard />
          </div>
        </div>

        {/* Queue Section */}
        <div className="w-full">
          <FileQueue
            files={queue}
            converting={converting}
            onFormatChange={handleFormatChange}
            onRemove={handleRemove}
            onConvertOne={handleConvertOne}
            onConvertAll={handleConvertAll}
            onClearAll={handleClearAll}
            onRename={handleRename}
          />
        </div>

        {/* Privacy Card — mobile only, below queue */}
        <div className="lg:hidden w-full">
          <PrivacyCard />
        </div>
      </main>

      <DebugConsole logs={logs} onClear={clearLogs} visible={consoleVisible} onToggleVisible={setConsoleVisible} />
    </div>
  );
}
