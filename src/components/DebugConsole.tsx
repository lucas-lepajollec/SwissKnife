import React, { useRef, useEffect } from 'react';
import { Terminal, ChevronUp, ChevronDown, Info, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface Log {
  id: string;
  type: 'info' | 'error' | 'success' | 'warning';
  message: string;
  timestamp: string;
}

interface DebugConsoleProps {
  logs: Log[];
  onClear: () => void;
  visible: boolean;
  onToggleVisible: (visible: boolean) => void;
}

export function DebugConsole({ logs, onClear, visible, onToggleVisible }: DebugConsoleProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    if (isExpanded && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isExpanded]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-end pointer-events-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        <div className={cn(
          "bg-[#0A0A0A] border-t border-x border-white/10 rounded-t-xl overflow-hidden shadow-2xl transition-all duration-300 ease-in-out",
          isExpanded ? "h-64" : "h-10"
        )}>
          {/* Header / Toggle */}
          <div
            role="button"
            tabIndex={0}
            onClick={() => setIsExpanded(!isExpanded)}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsExpanded(!isExpanded); }}
            className="w-full h-10 flex items-center justify-between px-4 bg-[#111] hover:bg-[#161616] transition-colors border-b border-white/5 cursor-pointer select-none"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <Terminal size={14} />
              <span>CONSOLE FFMPEG</span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]">
                <Info size={10} />
                {logs.length} logs
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-red-400 transition-colors"
                title="Vider les logs"
              >
                <Trash2 size={12} />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleVisible(false); }}
                className="p-1 rounded hover:bg-white/10 text-gray-500 hover:text-gray-300 transition-colors text-[10px] font-medium"
                title="Masquer la console"
              >
                ✕
              </button>
              {isExpanded ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronUp size={14} className="text-gray-500" />}
            </div>
          </div>

          {/* Content */}
          <div
            ref={scrollRef}
            className="p-4 h-[calc(100%-40px)] overflow-y-auto font-mono text-xs space-y-1.5 bg-[#0A0A0A] scroll-smooth"
          >
            {logs.length === 0 ? (
              <div className="flex items-center gap-2 text-gray-600">
                <span>En attente de logs FFmpeg...</span>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex items-start gap-3 opacity-80 hover:opacity-100 transition-opacity">
                  <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
                  <span className={cn(
                    "shrink-0 font-bold uppercase text-[10px] px-1 rounded",
                    log.type === 'info' && "text-blue-400 bg-blue-400/10",
                    log.type === 'error' && "text-red-400 bg-red-400/10",
                    log.type === 'success' && "text-emerald-400 bg-emerald-400/10",
                    log.type === 'warning' && "text-yellow-400 bg-yellow-400/10",
                  )}>
                    {log.type}
                  </span>
                  <span className={cn(
                    "text-gray-300 break-all",
                    log.type === 'error' && "text-red-300",
                    log.type === 'success' && "text-emerald-300",
                  )}>{log.message}</span>
                </div>
              ))
            )}
            {logs.length > 0 && (
              <div className="flex items-start gap-3 animate-pulse opacity-50">
                <span className="text-gray-600">[{new Date().toLocaleTimeString('fr-FR', { hour12: false })}]</span>
                <span className="text-gray-500">_</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
