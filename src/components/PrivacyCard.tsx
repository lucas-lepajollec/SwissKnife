import { Cpu, Lock, ShieldCheck, WifiOff } from 'lucide-react';
import { useI18n } from '@/i18n';

export function PrivacyCard() {
  const { copy } = useI18n();
  return (
    <div className="relative h-full min-h-[200px] lg:min-h-0 w-full rounded-3xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-8 overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />
      <div className="relative z-10 flex h-full flex-col justify-center">
        <div className="flex items-start gap-4 lg:flex-col lg:items-stretch lg:gap-0">
          <div className="mb-0 lg:mb-6 inline-flex h-10 w-10 lg:h-14 lg:w-14 items-center justify-center rounded-xl lg:rounded-2xl bg-cyan-600/20 text-cyan-300 border border-cyan-500/20 shrink-0">
            <Lock className="h-4 w-4 lg:h-6 lg:w-6" aria-hidden="true" />
          </div>

          <div className="flex-1">
            <h2 className="text-lg lg:text-2xl font-semibold text-white mb-2 lg:mb-4 tracking-tight">
              {copy.privacy.title}
            </h2>

            <p className="text-gray-300 text-xs sm:text-sm leading-relaxed mb-3 lg:mb-6">
              {copy.privacy.beforeBrowser}<span className="text-white font-medium">{copy.privacy.browser}</span>{copy.privacy.afterBrowser}
            </p>

            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-3">
              <li className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs text-gray-300 bg-white/5 lg:bg-transparent rounded-full lg:rounded-none px-2.5 py-1 lg:p-0">
                <Cpu className="h-3 w-3 lg:h-4 lg:w-4 shrink-0" aria-hidden="true" />
                <span>{copy.privacy.localCpu}</span>
              </li>
              <li className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs text-gray-300 bg-white/5 lg:bg-transparent rounded-full lg:rounded-none px-2.5 py-1 lg:p-0">
                <WifiOff className="h-3 w-3 lg:h-4 lg:w-4 shrink-0" aria-hidden="true" />
                <span>{copy.privacy.noUpload}</span>
              </li>
              <li className="flex items-center gap-2 lg:gap-3 text-[10px] lg:text-xs text-gray-300 bg-white/5 lg:bg-transparent rounded-full lg:rounded-none px-2.5 py-1 lg:p-0">
                <ShieldCheck className="h-3 w-3 lg:h-4 lg:w-4 shrink-0" aria-hidden="true" />
                <span>{copy.privacy.localEngine}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
