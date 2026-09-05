import { ChevronDown, Loader2, Terminal } from 'lucide-react';
import { useI18n, type Locale } from '@/i18n';

interface HeaderProps {
  loaded: boolean;
  loading: boolean;
  consoleVisible: boolean;
  onToggleConsole: () => void;
}

export function Header({ loaded, loading, consoleVisible, onToggleConsole }: HeaderProps) {
  const { copy, locale, setLocale } = useI18n();

  return (
    <header className="w-full py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.svg?v=2" alt="" width={44} height={44} className="w-[44px] h-[44px] shrink-0" />
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-white leading-none tracking-tight">SwissKnife</h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1 hidden sm:block">{copy.header.tagline}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <label className="relative inline-flex h-8 items-center">
            <span className="sr-only">{copy.language.label}</span>
            <select
              value={locale}
              onChange={(event) => setLocale(event.target.value as Locale)}
              aria-label={copy.language.label}
              className="h-8 min-w-[64px] appearance-none rounded-full border border-white/10 bg-[#111] pl-3 pr-8 text-[10px] font-semibold tracking-wide text-white transition-colors hover:border-white/20 focus:border-cyan-400 focus:outline-none"
            >
              <option value="en">EN</option><option value="fr">FR</option><option value="es">ES</option><option value="de">DE</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-2.5 h-3 w-3 text-gray-400" aria-hidden="true" />
          </label>
          <div className="hidden md:flex items-center gap-2 rounded-full bg-[#111] border border-white/10 px-3 py-1.5" aria-live="polite">
            {loading ? (
              <>
                <Loader2 className="h-3 w-3 text-amber-300 animate-spin" aria-hidden="true" />
                <span className="text-[10px] font-medium text-amber-300 uppercase tracking-wide">{copy.header.loading}</span>
              </>
            ) : loaded ? (
              <>
                <div className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                <span className="text-[10px] font-medium text-gray-300 uppercase tracking-wide whitespace-nowrap">
                  {copy.header.engineReady}
                </span>
              </>
            ) : (
              <>
                <div className="h-2 w-2 rounded-full bg-gray-500 shrink-0" />
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wide whitespace-nowrap">
                  {copy.header.engineInactive}
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onToggleConsole}
            aria-pressed={consoleVisible}
            className={`flex items-center justify-center gap-2 rounded-full border px-2 sm:px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${consoleVisible
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20'
              : 'bg-[#111] border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20'
              }`}
          >
            <Terminal className="h-3 w-3" aria-hidden="true" />
            <span className="hidden sm:inline">{copy.header.console}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
