import React from 'react';
import { Lock, Cpu, ShieldCheck } from 'lucide-react';

export function PrivacyCard() {
  return (
    <div className="relative h-full min-h-[400px] w-full rounded-3xl border border-white/5 bg-[#0A0A0A] p-8 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-64 w-64 rounded-full bg-purple-500/5 blur-3xl" />

      <div className="relative z-10 flex h-full flex-col justify-center">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/20 text-blue-400 border border-blue-500/20">
          <Lock className="h-6 w-6" />
        </div>

        <h3 className="text-2xl font-semibold text-white mb-4 tracking-tight">
          Vie Privée Totale
        </h3>

        <div className="space-y-6">
          <p className="text-gray-400 text-sm leading-relaxed">
            Propulsé par <span className="text-white font-medium">FFmpeg.wasm</span>. 
            Le traitement s'effectue <span className="text-white font-medium">localement</span> sur votre processeur. 
            Confidentialité garantie.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <Cpu className="h-4 w-4" />
              <span>Pas d'upload serveur</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Sécurisé & Offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
