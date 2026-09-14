import type { AppData, User, Shift, ExchangeRequest } from '@/types';

const STORAGE_KEY = 'guardias-app-data';

const DEFAULT_DATA: AppData = {
  users: [],
  shifts: [],
  exchanges: [],
  currentUserId: null,
};

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_DATA };
    const parsed = JSON.parse(raw) as AppData;
    return {
      users: parsed.users ?? [],
      shifts: parsed.shifts ?? [],
      exchanges: parsed.exchanges ?? [],
      currentUserId: parsed.currentUserId ?? null,
    };
  } catch {
    return { ...DEFAULT_DATA };
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function genId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const USER_COLORS = [
  '#0d9488',
  '#2563eb',
  '#dc2626',
  '#7c3aed',
  '#ea580c',
  '#0891b2',
  '#65a30d',
  '#db2777',
];

export function pickUserColor(existing: User[]): string {
  const used = new Set(existing.map((u) => u.color));
  return USER_COLORS.find((c) => !used.has(c)) ?? USER_COLORS[0];
}

export function createUser(data: AppData, name: string): { data: AppData; user: User } {
  const user: User = {
    id: genId(),
    name: name.trim(),
    color: pickUserColor(data.users),
  };
  return {
    data: { ...data, users: [...data.users, user], currentUserId: user.id },
    user,
  };
}

export function addShift(data: AppData, shift: Omit<Shift, 'id' | 'createdAt'>): AppData {
  const newShift: Shift = { ...shift, id: genId(), createdAt: Date.now() };
  return { ...data, shifts: [...data.shifts, newShift] };
}

export function removeShift(data: AppData, shiftId: string): AppData {
  return {
    ...data,
    shifts: data.shifts.filter((s) => s.id !== shiftId),
    exchanges: data.exchanges.filter((e) => e.shiftId !== shiftId),
  };
}

export function createExchange(
  data: AppData,
  shift: Shift
): AppData {
  const exchange: ExchangeRequest = {
    id: genId(),
    shiftId: shift.id,
    shiftDate: shift.date,
    shiftType: shift.type,
    fromUserId: shift.userId,
    fromUserName: shift.userName,
    status: 'pending',
    createdAt: Date.now(),
  };
  return { ...data, exchanges: [...data.exchanges, exchange] };
}

export function acceptExchange(
  data: AppData,
  exchangeId: string,
  user: User
): AppData {
  const exchange = data.exchanges.find((e) => e.id === exchangeId);
  if (!exchange || exchange.status !== 'pending') return data;

  const updatedExchanges = data.exchanges.map((e) =>
    e.id === exchangeId
      ? {
          ...e,
          status: 'accepted' as const,
          acceptedByUserId: user.id,
          acceptedByUserName: user.name,
          acceptedAt: Date.now(),
        }
      : e
  );

  const updatedShifts = data.shifts.map((s) =>
    s.id === exchange.shiftId
      ? { ...s, userId: user.id, userName: user.name }
      : s
  );

  return { ...data, exchanges: updatedExchanges, shifts: updatedShifts };
}

export function cancelExchange(data: AppData, exchangeId: string): AppData {
  return {
    ...data,
    exchanges: data.exchanges.map((e) =>
      e.id === exchangeId ? { ...e, status: 'cancelled' as const } : e
    ),
  };
}
