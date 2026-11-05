import { FC } from 'react';
import { Lock, Wifi, WifiOff } from 'lucide-react';

interface HeaderProps {
  activeUser: 'user_1' | 'user_2';
  isOnline: boolean;
  onLock: () => void;
}

export const Header: FC<HeaderProps> = ({ activeUser, isOnline, onLock }) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 bg-white/90 px-4 py-3.5 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white font-black text-lg shadow-sm">
          S
        </div>
        <div>
          <h1 className="text-base font-extrabold tracking-tight text-slate-800">ScanApp</h1>
          <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400">
            {isOnline ? (
              <span className="flex items-center gap-1 text-emerald-600">
                <Wifi className="h-3 w-3" /> Online
              </span>
            ) : (
              <span className="flex items-center gap-1 text-amber-600">
                <WifiOff className="h-3 w-3" /> Offline
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
          👤 {activeUser === 'user_1' ? 'User 1' : 'User 2'}
        </div>
        <button
          type="button"
          aria-label="Kunci akun"
          onClick={onLock}
          className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition"
        >
          <Lock className="h-4 w-4" />
        </button>
      </div>
    </header>
  );
};

