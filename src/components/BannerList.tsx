import { AlertTriangle, X } from 'lucide-react';

export interface BannerMessage {
  id: string;
  text: string;
}

interface BannerListProps {
  messages: BannerMessage[];
  onDismiss: (id: string) => void;
}

export function BannerList({ messages, onDismiss }: BannerListProps) {
  if (messages.length === 0) return null;
  return (
    <div className="space-y-2" role="status" aria-live="polite">
      {messages.map((msg) => (
        <div key={msg.id} className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-300" aria-hidden="true" />
          <p className="flex-1 leading-relaxed">{msg.text}</p>
          <button type="button" onClick={() => onDismiss(msg.id)} className="text-amber-200/80 hover:text-white" aria-label="Fermer">
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
