import { ArrowLeftRight, Check, X, Sun, Moon, Clock, Inbox } from 'lucide-react';
import type { ExchangeRequest, User } from '@/types';
import { formatDateShort, timeAgo } from '@/lib/dateUtils';

interface Props {
  exchanges: ExchangeRequest[];
  currentUser: User | null;
  onAccept: (exchangeId: string) => void;
  onCancel: (exchangeId: string) => void;
}

const TYPE_ICON = { day: Sun, night: Moon, '24h': Clock };
const TYPE_LABEL = { day: 'Día', night: 'Noche', '24h': '24h' };

export function ExchangeSidebar({ exchanges, currentUser, onAccept, onCancel }: Props) {
  const pending = exchanges.filter((e) => e.status === 'pending');
  const history = exchanges
    .filter((e) => e.status !== 'pending')
    .sort((a, b) => (b.acceptedAt ?? b.createdAt) - (a.acceptedAt ?? a.createdAt));

  return (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
          <ArrowLeftRight className="h-5 w-5 text-amber-600" />
        </div>
        <div>
          <h2 className="font-bold text-slate-800">Intercambios</h2>
          <p className="text-xs text-slate-400">
            {pending.length} {pending.length === 1 ? 'solicitud pendiente' : 'solicitudes pendientes'}
          </p>
        </div>
      </div>

      {/* Pending exchanges */}
      <div className="flex-1 overflow-y-auto">
        {pending.length === 0 && history.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <Inbox className="h-7 w-7 text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">Sin solicitudes</p>
            <p className="mt-1 text-xs text-slate-400">Los intercambios aparecerán aquí</p>
          </div>
        )}

        {pending.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Pendientes
            </p>
            <div className="space-y-2">
              {pending.map((ex) => {
                const Icon = TYPE_ICON[ex.shiftType];
                const isOwn = ex.fromUserId === currentUser?.id;
                return (
                  <div
                    key={ex.id}
                    className="rounded-xl border border-amber-200/60 bg-amber-50/50 p-3"
                  >
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-slate-500" />
                        <span className="text-sm font-semibold text-slate-700">
                          {formatDateShort(ex.shiftDate)}
                        </span>
                        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-500">
                          {TYPE_LABEL[ex.shiftType]}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400">{timeAgo(ex.createdAt)}</span>
                    </div>
                    <p className="mb-3 text-sm text-slate-600">
                      <span className="font-medium text-slate-800">{ex.fromUserName}</span> solicita intercambio
                    </p>
                    {isOwn ? (
                      <button
                        onClick={() => onCancel(ex.id)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                      >
                        <X className="h-4 w-4" /> Cancelar solicitud
                      </button>
                    ) : (
                      <button
                        onClick={() => onAccept(ex.id)}
                        className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-teal-500 px-3 py-2 text-sm font-semibold text-white transition hover:bg-teal-600"
                      >
                        <Check className="h-4 w-4" /> Aceptar intercambio
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div>
            <p className="mb-2 px-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
              Historial
            </p>
            <div className="space-y-2">
              {history.map((ex) => {
                const Icon = TYPE_ICON[ex.shiftType];
                return (
                  <div
                    key={ex.id}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                  >
                    <Icon className="h-4 w-4 flex-shrink-0 text-slate-400" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-600">
                        <span className="font-medium text-slate-700">{formatDateShort(ex.shiftDate)}</span>
                        {' · '}
                        {ex.fromUserName} → {ex.acceptedByUserName ?? '?'}
                      </p>
                      <p className="text-xs text-slate-400">{timeAgo(ex.acceptedAt ?? ex.createdAt)}</p>
                    </div>
                    {ex.status === 'accepted' ? (
                      <span className="flex items-center gap-1 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-600">
                        <Check className="h-3 w-3" /> Aceptado
                      </span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-400">
                        Cancelado
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
