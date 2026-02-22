import React from 'react';
import { Zap, Crown } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-black font-bold text-xl tracking-tighter">
            SK
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white leading-none tracking-tight">SwissKnife</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-1">Universal Local Processor</span>
          </div>
        </div>

        {/* Status & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-[#111] border border-white/5 px-3 py-1.5">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide">WASM Engine Online</span>
          </div>
          
          <button className="flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black transition-transform hover:scale-105 active:scale-95">
            <span>Pro Version</span>
            <Crown className="h-3 w-3" />
          </button>
        </div>
      </div>
    </header>
  );
}
