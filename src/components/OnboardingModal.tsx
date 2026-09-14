import { useState } from 'react';
import { Stethoscope, ArrowRight } from 'lucide-react';

interface Props {
  onComplete: (name: string) => void;
}

export function OnboardingModal({ onComplete }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onComplete(name.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl animate-scale-in">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500 shadow-lg shadow-teal-500/30">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Bienvenido</h2>
          <p className="mt-2 text-sm text-slate-500">
            Introduce tu nombre para empezar a gestionar las guardias del equipo.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre"
            autoFocus
            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-3 font-semibold text-white shadow-lg shadow-teal-500/30 transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Comenzar <ArrowRight className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
