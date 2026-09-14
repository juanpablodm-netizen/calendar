import { useState, useEffect } from 'react';
import { X, Sun, Moon, Clock, Trash2, Repeat, Check } from 'lucide-react';
import type { Shift, ShiftType, User, ExchangeRequest } from '@/types';
import { formatDateLong } from '@/lib/dateUtils';

interface Props {
  dateISO: string;
  shifts: Shift[];
  users: User[];
  currentUser: User | null;
  exchanges: ExchangeRequest[];
  onClose: () => void;
  onAddShift: (userId: string, type: ShiftType, note?: string) => void;
  onRemoveShift: (shiftId: string) => void;
  onRequestExchange: (shift: Shift) => void;
  onAcceptExchange: (exchangeId: string) => void;
}

const SHIFT_META: Record<ShiftType, { label: string; icon: typeof Sun; bg: string; text: string; dot: string }> = {
  day: { label: 'Día', icon: Sun, bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400' },
  night: { label: 'Noche', icon: Moon, bg: 'bg-indigo-50', text: 'text-indigo-700', dot: 'bg-indigo-400' },
  '24h': { label: '24h', icon: Clock, bg: 'bg-rose-50', text: 'text-rose-700', dot: 'bg-rose-400' },
};

export function ShiftModal({
  dateISO,
  shifts,
  users,
  currentUser,
  exchanges,
  onClose,
  onAddShift,
  onRemoveShift,
  onRequestExchange,
  onAcceptExchange,
}: Props) {
  const [selectedUserId, setSelectedUserId] = useState(currentUser?.id ?? '');
  const [shiftType, setShiftType] = useState<ShiftType>('24h');
  const [note, setNote] = useState('');

  useEffect(() => {
    setSelectedUserId(currentUser?.id ?? '');
  }, [currentUser]);

  const dayShifts = shifts.filter((s) => s.date === dateISO);
  const pendingExchange = exchanges.find(
    (e) => e.shiftDate === dateISO && e.status === 'pending'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;
    onAddShift(selectedUserId, shiftType, note.trim() || undefined);
    setNote('');
  };

  const canAccept = (ex: ExchangeRequest) =>
    currentUser && ex.fromUserId !== currentUser.id;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in sm:items-center" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-t-3xl bg-white p-6 shadow-2xl animate-slide-up sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-teal-500">Turno del día</p>
            <h2 className="mt-0.5 text-xl font-bold text-slate-800">{formatDateLong(dateISO)}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Existing shifts */}
        {dayShifts.length > 0 && (
          <div className="mb-5 space-y-2">
            {dayShifts.map((shift) => {
              const meta = SHIFT_META[shift.type];
              const Icon = meta.icon;
              const exchange = exchanges.find((e) => e.shiftId === shift.id && e.status === 'pending');
              return (
                <div
                  key={shift.id}
                  className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/50 p-3"
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${meta.bg}`}>
                    <Icon className={`h-5 w-5 ${meta.text}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: users.find((u) => u.id === shift.userId)?.color }} />
                      <span className="font-semibold text-slate-800">{shift.userName}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.bg} ${meta.text}`}>
                        {meta.label}
                      </span>
                    </div>
                    {shift.note && <p className="mt-0.5 text-sm text-slate-500">{shift.note}</p>}
                    {exchange && (
                      <p className="mt-1 flex items-center gap-1 text-xs font-medium text-amber-600">
                        <Repeat className="h-3 w-3" /> Intercambio solicitado por {exchange.fromUserName}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {shift.userId === currentUser?.id && !exchange && (
                      <button
                        onClick={() => onRequestExchange(shift)}
                        className="flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-100"
                      >
                        <Repeat className="h-3.5 w-3.5" /> Intercambio
                      </button>
                    )}
                    {exchange && canAccept(exchange) && (
                      <button
                        onClick={() => onAcceptExchange(exchange.id)}
                        className="flex items-center gap-1 rounded-lg bg-teal-500 px-2.5 py-1.5 text-xs font-medium text-white transition hover:bg-teal-600"
                      >
                        <Check className="h-3.5 w-3.5" /> Aceptar
                      </button>
                    )}
                    <button
                      onClick={() => onRemoveShift(shift.id)}
                      className="flex items-center justify-center rounded-lg p-1.5 text-slate-300 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {dayShifts.length === 0 && (
          <p className="mb-5 rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            No hay guardias asignadas para este día.
          </p>
        )}

        {/* Add new shift */}
        <form onSubmit={handleSubmit} className="space-y-3 border-t border-slate-100 pt-4">
          <p className="text-sm font-semibold text-slate-700">Asignar nueva guardia</p>

          <div className="flex gap-2">
            {(Object.keys(SHIFT_META) as ShiftType[]).map((type) => {
              const meta = SHIFT_META[type];
              const Icon = meta.icon;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setShiftType(type)}
                  className={`flex flex-1 flex-col items-center gap-1 rounded-xl border-2 py-2.5 transition ${
                    shiftType === type
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${shiftType === type ? meta.text : 'text-slate-400'}`} />
                  <span className={`text-xs font-medium ${shiftType === type ? 'text-teal-700' : 'text-slate-500'}`}>
                    {meta.label}
                  </span>
                </button>
              );
            })}
          </div>

          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          >
            <option value="">Selecciona usuario…</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Nota (opcional)"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
          />

          <button
            type="submit"
            disabled={!selectedUserId}
            className="w-full rounded-xl bg-slate-800 px-4 py-3 font-semibold text-white transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Asignar guardia
          </button>
        </form>
      </div>
    </div>
  );
}
