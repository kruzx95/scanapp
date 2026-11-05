import { useState, FC } from 'react';
import { Lock, Delete } from 'lucide-react';
import { getStoredPin } from '../../services/storage';

interface ProfilePinModalProps {
  activeUser: 'user_1' | 'user_2';
  onUnlock: () => void;
  onSwitchUser: (newUser: 'user_1' | 'user_2') => void;
}

export const ProfilePinModal: FC<ProfilePinModalProps> = ({
  activeUser,
  onUnlock,
  onSwitchUser
}) => {
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const correctPin = getStoredPin(activeUser);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const nextPin = pin + digit;
    setPin(nextPin);
    setErrorMessage('');

    if (nextPin.length === 4) {
      if (nextPin === correctPin) {
        onUnlock();
      } else {
        setErrorMessage('PIN salah, silakan coba lagi');
        setTimeout(() => setPin(''), 500);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
          <Lock className="h-7 w-7" />
        </div>

        <h2 className="text-xl font-bold text-slate-800">Buka Kunci Akun</h2>
        <p className="mt-1 text-xs text-slate-500">Pilih akun dan masukkan 4-digit PIN Anda</p>

        {/* User Switcher */}
        <div className="my-5 flex rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => {
              setPin('');
              setErrorMessage('');
              onSwitchUser('user_1');
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              activeUser === 'user_1' ? 'bg-white text-brand-600 shadow' : 'text-slate-500'
            }`}
          >
            User 1
          </button>
          <button
            type="button"
            onClick={() => {
              setPin('');
              setErrorMessage('');
              onSwitchUser('user_2');
            }}
            className={`flex-1 rounded-lg py-2 text-sm font-semibold transition ${
              activeUser === 'user_2' ? 'bg-white text-brand-600 shadow' : 'text-slate-500'
            }`}
          >
            User 2
          </button>
        </div>

        {/* PIN Indicators */}
        <div className="my-6 flex justify-center gap-3">
          {[0, 1, 2, 3].map(idx => (
            <div
              key={idx}
              className={`h-4 w-4 rounded-full border-2 transition-all ${
                idx < pin.length
                  ? 'border-brand-600 bg-brand-600 scale-110'
                  : 'border-slate-300 bg-transparent'
              }`}
            />
          ))}
        </div>

        {errorMessage && (
          <p className="mb-4 text-xs font-semibold text-rose-500 animate-pulse">{errorMessage}</p>
        )}

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(digit => (
            <button
              key={digit}
              type="button"
              onClick={() => handleDigit(digit)}
              className="flex h-14 items-center justify-center rounded-2xl bg-slate-50 text-xl font-bold text-slate-700 active:bg-slate-200 transition"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className="flex h-14 items-center justify-center rounded-2xl bg-slate-50 text-xl font-bold text-slate-700 active:bg-slate-200 transition"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex h-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 active:bg-slate-200 transition"
          >
            <Delete className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

