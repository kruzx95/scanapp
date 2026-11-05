import { FC } from 'react';
import { LayoutDashboard, Camera, PlusCircle, Settings } from 'lucide-react';

export type NavTab = 'dashboard' | 'scan' | 'manual' | 'settings';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
}

export const BottomNav: FC<BottomNavProps> = ({ activeTab, onChangeTab }) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Beranda', icon: LayoutDashboard },
    { id: 'scan' as NavTab, label: 'Scan', icon: Camera, highlight: true },
    { id: 'manual' as NavTab, label: 'Manual', icon: PlusCircle },
    { id: 'settings' as NavTab, label: 'Setelan', icon: Settings }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-slate-100 bg-white/95 px-4 py-2 backdrop-blur-lg">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1 transition ${
                isActive ? 'text-brand-600 font-bold' : 'text-slate-400 font-medium hover:text-slate-600'
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-2xl transition ${
                  tab.highlight && isActive
                    ? 'bg-brand-600 text-white shadow-md'
                    : isActive
                    ? 'bg-brand-50 text-brand-600'
                    : 'bg-transparent'
                }`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-[11px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

