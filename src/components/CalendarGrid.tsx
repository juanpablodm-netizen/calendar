import { Sun, Moon, Clock, Repeat } from 'lucide-react';
import type { Shift, ExchangeRequest, User } from '@/types';
import { getCalendarDays, WEEKDAYS_ES, type CalendarDay } from '@/lib/dateUtils';

interface Props {
  year: number;
  month: number;
  shifts: Shift[];
  users: User[];
  exchanges: ExchangeRequest[];
  onDayClick: (iso: string) => void;
}

const SHIFT_DOT: Record<string, string> = {
  day: 'bg-amber-400',
  night: 'bg-indigo-400',
  '24h': 'bg-rose-400',
};

const SHIFT_ICON = { day: Sun, night: Moon, '24h': Clock };

export function CalendarGrid({ year, month, shifts, users, exchanges, onDayClick }: Props) {
  const days = getCalendarDays(year, month);
  const userMap = new Map(users.map((u) => [u.id, u]));
  const pendingSet = new Set(exchanges.filter((e) => e.status === 'pending').map((e) => e.shiftId));

  const shiftsByDate = new Map<string, Shift[]>();
  for (const s of shifts) {
    const arr = shiftsByDate.get(s.date) ?? [];
    arr.push(s);
    shiftsByDate.set(s.date, arr);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Weekday header */}
      <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
        {WEEKDAYS_ES.map((day, i) => (
          <div
            key={day}
            className={`px-1 py-2.5 text-center text-xs font-semibold uppercase tracking-wide ${
              i >= 5 ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div className="grid grid-cols-7">
        {days.map((day: CalendarDay, idx) => {
          const dayShifts = shiftsByDate.get(day.iso) ?? [];
          const hasPending = dayShifts.some((s) => pendingSet.has(s.id));

          return (
            <button
              key={idx}
              onClick={() => onDayClick(day.iso)}
              className={`
                relative flex min-h-[88px] flex-col border-b border-r border-slate-50 p-1.5 text-left transition
                sm:min-h-[112px] sm:p-2.5
                ${day.isCurrentMonth ? 'bg-white' : 'bg-slate-50/30'}
                ${day.isCurrentMonth ? 'hover:bg-teal-50/40' : 'hover:bg-slate-50'}
              `}
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={`
                    flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold
                    ${day.isToday ? 'bg-teal-500 text-white' : ''}
                    ${!day.isToday && day.isCurrentMonth && day.isWeekend ? 'text-slate-400' : ''}
                    ${!day.isToday && day.isCurrentMonth && !day.isWeekend ? 'text-slate-700' : ''}
                    ${!day.isCurrentMonth ? 'text-slate-300' : ''}
                  `}
                >
                  {day.date.getDate()}
                </span>
                {hasPending && (
                  <Repeat className="h-3 w-3 text-amber-500" />
                )}
              </div>

              <div className="flex-1 space-y-1 overflow-hidden">
                {dayShifts.slice(0, 3).map((shift) => {
                  const user = userMap.get(shift.userId);
                  const Icon = SHIFT_ICON[shift.type];
                  return (
                    <div
                      key={shift.id}
                      className="flex items-center gap-1 rounded-md px-1 py-0.5 text-xs"
                      style={{
                        backgroundColor: user ? `${user.color}15` : '#f1f5f9',
                      }}
                    >
                      <span
                        className="h-2 w-2 flex-shrink-0 rounded-full"
                        style={{ backgroundColor: user?.color ?? '#94a3b8' }}
                      />
                      <span className="flex-shrink-0">
                        <Icon className="h-3 w-3 text-slate-500" />
                      </span>
                      <span className="truncate font-medium text-slate-700">
                        {shift.userName}
                      </span>
                    </div>
                  );
                })}
                {dayShifts.length > 3 && (
                  <p className="px-1 text-xs font-medium text-slate-400">
                    +{dayShifts.length - 3} más
                  </p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
