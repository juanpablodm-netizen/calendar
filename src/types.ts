export type ShiftType = 'day' | 'night' | '24h';

export interface User {
  id: string;
  name: string;
  color: string;
}

export interface Shift {
  id: string;
  date: string; // ISO date YYYY-MM-DD
  userId: string;
  userName: string;
  type: ShiftType;
  note?: string;
  createdAt: number;
}

export type ExchangeStatus = 'pending' | 'accepted' | 'cancelled';

export interface ExchangeRequest {
  id: string;
  shiftId: string;
  shiftDate: string;
  shiftType: ShiftType;
  fromUserId: string;
  fromUserName: string;
  status: ExchangeStatus;
  acceptedByUserId?: string;
  acceptedByUserName?: string;
  createdAt: number;
  acceptedAt?: number;
}

export interface AppData {
  users: User[];
  shifts: Shift[];
  exchanges: ExchangeRequest[];
  currentUserId: string | null;
}
