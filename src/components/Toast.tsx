import { useEffect } from 'react';
import { CheckCircle2, X } from 'lucide-react';

export interface ToastData {
  id: number;
  message: string;
  type: 'success' | 'info';
}

interface Props {
  toast: ToastData | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: Props) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 animate-slide-up">
      <div className="flex items-center gap-2.5 rounded-xl bg-slate-800 px-4 py-3 shadow-xl">
        <CheckCircle2 className="h-5 w-5 text-teal-400" />
        <span className="text-sm font-medium text-white">{toast.message}</span>
        <button onClick={onDismiss} className="ml-1 text-slate-400 transition hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
