import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, CalendarDays, PanelRightOpen, PanelRightClose } from 'lucide-react';
import type { AppData, ShiftType, Shift } from '@/types';
import {
  loadData, saveData, createUser, addShift, removeShift,
  createExchange, acceptExchange, cancelExchange,
} from '@/lib/storage';
import { MONTHS_ES } from '@/lib/dateUtils';
import { OnboardingModal } from '@/components/OnboardingModal';
import { Header } from '@/components/Header';
import { CalendarGrid } from '@/components/CalendarGrid';
import { ShiftModal } from '@/components/ShiftModal';
import { ExchangeSidebar } from '@/components/ExchangeSidebar';
import { Toast, type ToastData } from '@/components/Toast';

export default function App() {
  const [data, setData] = useState<AppData>(() => loadData());
  const [cursor, setCursor] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState<ToastData | null>(null);

  useEffect(() => {
    saveData(data);
  }, [data]);

  const showToast = useCallback((message: string) => {
    setToast({ id: Date.now(), message, type: 'success' });
  }, []);

  const currentUser = useMemo(
    () => data.users.find((u) => u.id === data.currentUserId) ?? null,
    [data.users, data.currentUserId]
  );

  const year = cursor.getFullYear();
  const month = cursor.getMonth();

  const prevMonth = () => setCursor(new Date(year, month - 1, 1));
  const nextMonth = () => setCursor(new Date(year, month + 1, 1));
  const goToday = () => setCursor(new Date());

  // Onboarding
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50">
        <OnboardingModal
          onComplete={(name) => {
            const { data: newData } = createUser(data, name);
            setData(newData);
            showToast(`Bienvenido, ${name}`);
          }}
        />
      </div>
    );
  }

  const handleAddUser = (name: string) => {
    const { data: newData } = createUser(data, name);
    setData(newData);
    showToast(`Usuario "${name}" añadido`);
  };

  const handleSwitchUser = (id: string) => {
    setData({ ...data, currentUserId: id });
  };

  const handleAddShift = (userId: string, type: ShiftType, note?: string) => {
    const user = data.users.find((u) => u.id === userId);
    if (!user) return;
    setData(addShift(data, {
      date: selectedDate!,
      userId,
      userName: user.name,
      type,
      note,
    }));
    showToast('Guardia asignada');
    setSelectedDate(null);
  };

  const handleRemoveShift = (shiftId: string) => {
    setData(removeShift(data, shiftId));
    showToast('Guardia eliminada');
  };

  const handleRequestExchange = (shift: Shift) => {
    setData(createExchange(data, shift));
    showToast('Solicitud de intercambio enviada');
  };

  const handleAcceptExchange = (exchangeId: string) => {
    if (!currentUser) return;
    setData(acceptExchange(data, exchangeId, currentUser));
    showToast('Intercambio aceptado');
    setSelectedDate(null);
  };

  const handleCancelExchange = (exchangeId: string) => {
    setData(cancelExchange(data, exchangeId));
    showToast('Solicitud cancelada');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        users={data.users}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onAddUser={handleAddUser}
      />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Calendar section */}
          <div className="flex-1">
            {/* Month navigation */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800 sm:text-2xl">
                  {MONTHS_ES[month]} <span className="text-slate-400">{year}</span>
                </h2>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={goToday}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Hoy
                </button>
                <button
                  onClick={prevMonth}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setSidebarOpen((v) => !v)}
                  className="ml-1 flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 lg:hidden"
                >
                  {sidebarOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <CalendarGrid
              year={year}
              month={month}
              shifts={data.shifts}
              users={data.users}
              exchanges={data.exchanges}
              onDayClick={setSelectedDate}
            />

            {/* Legend */}
            <div className="mt-4 flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-4 py-3">
              <span className="flex items-center gap-1.5 text-sm text-slate-500">
                <CalendarDays className="h-4 w-4 text-slate-400" /> Leyenda:
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-600">
                <span className="h-3 w-3 rounded-full bg-amber-400" /> Día
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-600">
                <span className="h-3 w-3 rounded-full bg-indigo-400" /> Noche
              </span>
              <span className="flex items-center gap-1.5 text-sm text-slate-600">
                <span className="h-3 w-3 rounded-full bg-rose-400" /> 24h
              </span>
            </div>
          </div>

          {/* Exchange sidebar */}
          <aside
            className={`${
              sidebarOpen ? 'block' : 'hidden'
            } w-full lg:block lg:w-80 lg:flex-shrink-0`}
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-20">
              <ExchangeSidebar
                exchanges={data.exchanges}
                currentUser={currentUser}
                onAccept={handleAcceptExchange}
                onCancel={handleCancelExchange}
              />
            </div>
          </aside>
        </div>
      </main>

      {selectedDate && (
        <ShiftModal
          dateISO={selectedDate}
          shifts={data.shifts}
          users={data.users}
          currentUser={currentUser}
          exchanges={data.exchanges}
          onClose={() => setSelectedDate(null)}
          onAddShift={handleAddShift}
          onRemoveShift={handleRemoveShift}
          onRequestExchange={handleRequestExchange}
          onAcceptExchange={handleAcceptExchange}
        />
      )}

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
