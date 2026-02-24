import React from 'react';
import { Loader2, Terminal } from 'lucide-react';

interface HeaderProps {
  loaded: boolean;
  loading: boolean;
  consoleVisible: boolean;
  onToggleConsole: () => void;
}

export function Header({ loaded, loading, consoleVisible, onToggleConsole }: HeaderProps) {
  return (
    <header className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold text-xl tracking-tighter shrink-0">
            SK
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white leading-none tracking-tight">SwissKnife</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1 hidden sm:block">Universal Local Processor</span>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* WASM Status — visible on all devices */}
          <div className="flex items-center gap-2 rounded-full bg-[#111] border border-white/5 px-3 py-1.5">
            {loading ? (
              <>
                <Loader2 className="h-3 w-3 text-yellow-400 animate-spin" />
                <span className="text-[10px] font-medium text-yellow-400 uppercase tracking-wide">WASM...</span>
              </>
            ) : loaded ? (
              <>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">
                  <span className="hidden sm:inline">WASM Engine </span>Online
                </span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-gray-600 shrink-0" />
                <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  <span className="hidden sm:inline">WASM </span>Standby
                </span>
              </>
            )}
          </div>

          {/* Console Toggle */}
          <button
            onClick={onToggleConsole}
            className={`flex items-center justify-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide transition-all active:scale-95 ${consoleVisible
              ? 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
              : 'bg-[#111] border-white/5 text-gray-500 hover:text-gray-300 hover:border-white/10'
              }`}
            title={consoleVisible ? 'Masquer la console' : 'Afficher la console'}
          >
            <Terminal className="h-3 w-3" />
            <span className="hidden sm:inline">Console</span>
          </button>
        </div>
      </div>
    </header>
  );
}
