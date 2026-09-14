import { CalendarHeart, UserPlus, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import type { User } from '@/types';

interface Props {
  users: User[];
  currentUser: User | null;
  onSwitchUser: (id: string) => void;
  onAddUser: (name: string) => void;
}

export function Header({ users, currentUser, onSwitchUser, onAddUser }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [addingUser, setAddingUser] = useState(false);
  const [newName, setNewName] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      onAddUser(newName.trim());
      setNewName('');
      setAddingUser(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500 shadow-md shadow-teal-500/25">
            <CalendarHeart className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight text-slate-800">Guardias</h1>
            <p className="text-xs text-slate-400">Calendario de turnos</p>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            {currentUser && (
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: currentUser.color }}
              />
            )}
            <span className="max-w-[120px] truncate">{currentUser?.name ?? 'Sin usuario'}</span>
            <ChevronDown className={`h-4 w-4 text-slate-400 transition ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl animate-fade-in">
                <p className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Cambiar usuario
                </p>
                <div className="max-h-48 overflow-y-auto">
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        onSwitchUser(u.id);
                        setDropdownOpen(false);
                      }}
                      className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                        u.id === currentUser?.id ? 'bg-teal-50 font-medium text-teal-700' : 'text-slate-700'
                      }`}
                    >
                      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: u.color }} />
                      {u.name}
                    </button>
                  ))}
                </div>
                <div className="my-1 border-t border-slate-100" />
                {addingUser ? (
                  <form onSubmit={handleAdd} className="flex gap-1 p-1">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Nombre"
                      autoFocus
                      className="w-full rounded-lg border border-slate-200 px-2.5 py-1.5 text-sm outline-none focus:border-teal-500"
                    />
                    <button type="submit" className="rounded-lg bg-teal-500 px-3 py-1.5 text-sm font-medium text-white hover:bg-teal-600">
                      OK
                    </button>
                  </form>
                ) : (
                  <button
                    onClick={() => setAddingUser(true)}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-600 transition hover:bg-slate-50"
                  >
                    <UserPlus className="h-4 w-4" /> Añadir usuario
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
