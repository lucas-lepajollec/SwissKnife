import React from 'react';
import { Lock, Cpu, WifiOff, ShieldCheck } from 'lucide-react';

export function PrivacyCard() {
  return (
    <div className="relative h-full min-h-[200px] lg:min-h-[400px] w-full rounded-3xl border border-white/5 bg-[#0A0A0A] p-6 sm:p-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-center">
        {/* Mobile: compact horizontal layout / Desktop: vertical layout */}
        <div className="flex items-start gap-4 lg:flex-col lg:items-stretch lg:gap-0">
          {/* Icon — smaller on mobile */}
          <div className="mb-0 lg:mb-6 inline-flex h-10 w-10 lg:h-14 lg:w-14 items-center justify-center rounded-xl lg:rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/20 shrink-0">
            <Lock className="h-4 w-4 lg:h-6 lg:w-6" />
          </div>

          <div className="flex-1">
            <h3 className="text-lg lg:text-2xl font-semibold text-white mb-2 lg:mb-4 tracking-tight">
              Vie Privée Totale
            </h3>

            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-3 lg:mb-6">
              Propulsé par <span className="text-white font-medium">FFmpeg.wasm</span> et
              l'<span className="text-white font-medium">API Canvas</span>.
              <span className="hidden sm:inline"> Tout le traitement s'effectue <span className="text-white font-medium">100% localement</span> sur votre machine. Rien ne quitte votre navigateur.</span>
              <span className="sm:hidden"> Traitement <span className="text-white font-medium">100% local</span>.</span>
            </p>

            {/* Mobile: inline badges / Desktop: vertical list */}
            <div className="flex flex-wrap gap-2 lg:flex-col lg:gap-3">
              <div className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs text-gray-500 bg-white/5 lg:bg-transparent rounded-full lg:rounded-none px-2.5 py-1 lg:p-0">
                <Cpu className="h-3 w-3 lg:h-4 lg:w-4 shrink-0" />
                <span>CPU local</span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs text-gray-500 bg-white/5 lg:bg-transparent rounded-full lg:rounded-none px-2.5 py-1 lg:p-0">
                <WifiOff className="h-3 w-3 lg:h-4 lg:w-4 shrink-0" />
                <span>Aucun upload</span>
              </div>
              <div className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs text-gray-500 bg-white/5 lg:bg-transparent rounded-full lg:rounded-none px-2.5 py-1 lg:p-0">
                <ShieldCheck className="h-3 w-3 lg:h-4 lg:w-4 shrink-0" />
                <span>Fonctionne offline</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
