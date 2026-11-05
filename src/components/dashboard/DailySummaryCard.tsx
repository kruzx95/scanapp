import { FC } from 'react';
import { formatIDR } from '../../utils/formatters';
import { Wallet, TrendingUp } from 'lucide-react';

interface DailySummaryCardProps {
  todayTotal: number;
  monthTotal: number;
  todayCount: number;
}

export const DailySummaryCard: FC<DailySummaryCardProps> = ({
  todayTotal,
  monthTotal,
  todayCount
}) => {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-800 p-5 text-white shadow-lg shadow-brand-500/20">
      <div className="flex items-center justify-between opacity-80 text-xs">
        <span className="flex items-center gap-1.5 font-semibold">
          <Wallet className="h-4 w-4" /> Pengeluaran Hari Ini
        </span>
        <span className="rounded-full bg-white/20 px-2.5 py-0.5 font-bold">
          {todayCount} Transaksi
        </span>
      </div>

      <div className="mt-2 text-3xl font-extrabold tracking-tight">
        {formatIDR(todayTotal)}
      </div>

      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
        <span className="flex items-center gap-1 text-indigo-200">
          <TrendingUp className="h-3.5 w-3.5" /> Total Bulan Ini
        </span>
        <span className="font-bold text-white">{formatIDR(monthTotal)}</span>
      </div>
    </div>
  );
};

