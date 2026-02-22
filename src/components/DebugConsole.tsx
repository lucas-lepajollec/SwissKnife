import React from 'react';
import { Terminal, X, ChevronUp, ChevronDown, AlertCircle, Info, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

export interface Log {
  id: string;
  type: 'info' | 'error' | 'success' | 'warning';
  message: string;
  timestamp: string;
}

const FAKE_LOGS: Log[] = [
  { id: '1', type: 'info', message: 'Initialisation du moteur WASM...', timestamp: '10:23:45' },
  { id: '2', type: 'success', message: 'Moteur chargé avec succès (v2.4.1)', timestamp: '10:23:47' },
  { id: '3', type: 'info', message: 'Montage du système de fichiers virtuel...', timestamp: '10:23:48' },
  { id: '4', type: 'warning', message: 'Mémoire tampon limitée à 4GB', timestamp: '10:23:48' },
  { id: '5', type: 'info', message: 'Prêt à traiter les fichiers', timestamp: '10:23:49' },
];

export function DebugConsole() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [logs, setLogs] = React.useState<Log[]>(FAKE_LOGS);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex flex-col items-center justify-end pointer-events-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pointer-events-auto">
        <div className={cn(
          "bg-[#0A0A0A] border-t border-x border-white/10 rounded-t-xl overflow-hidden shadow-2xl transition-all duration-300 ease-in-out",
          isOpen ? "h-64" : "h-10"
        )}>
          {/* Header / Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full h-10 flex items-center justify-between px-4 bg-[#111] hover:bg-[#161616] transition-colors border-b border-white/5"
          >
            <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
              <Terminal size={14} />
              <span>CONSOLE SYSTÈME</span>
              <span className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]">
                <Info size={10} />
                INFO
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isOpen ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronUp size={14} className="text-gray-500" />}
            </div>
          </button>

          {/* Content */}
          <div className="p-4 h-[calc(100%-40px)] overflow-y-auto font-mono text-xs space-y-2 bg-[#0A0A0A]">
            {logs.map((log) => (
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
                <span className="text-gray-300">{log.message}</span>
              </div>
            ))}
            <div className="flex items-start gap-3 animate-pulse opacity-50">
              <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
              <span className="text-gray-500">_</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
