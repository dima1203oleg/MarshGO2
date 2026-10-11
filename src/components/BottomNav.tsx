import React from 'react';
import { Home, Search, Plus, Ticket, User } from 'lucide-react';
import { MainTab, ScreenId } from '../types/marshgo';
import { triggerRatchetTick } from '../utils/haptics';

interface BottomNavProps {
  activeScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  onOpenPublish: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeScreen,
  onNavigate,
  onOpenPublish,
}) => {
  const isTabActive = (tab: MainTab) => {
    if (tab === 'home' && activeScreen === 'home') return true;
    if (tab === 'search' && (activeScreen === 'search' || activeScreen === 'results' || activeScreen === 'route-map' || activeScreen === 'route-details')) return true;
    if (tab === 'rides' && (activeScreen === 'marshpass' || activeScreen === 'marshpass-details' || activeScreen === 'ride-details')) return true;
    if (tab === 'profile' && activeScreen === 'profile') return true;
    return false;
  };

  return (
    <nav className="sticky bottom-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))] select-none">
      <div className="grid grid-cols-5 items-center justify-items-center max-w-lg mx-auto">
        {/* Tab 1: Головна */}
        <button
          onClick={() => {
            triggerRatchetTick('minute');
            onNavigate('home');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            isTabActive('home')
              ? 'text-blue-600 dark:text-blue-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Home className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] mt-0.5 tracking-tight">Головна</span>
        </button>

        {/* Tab 2: Пошук */}
        <button
          onClick={() => {
            triggerRatchetTick('minute');
            onNavigate('search');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            isTabActive('search')
              ? 'text-blue-600 dark:text-blue-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Search className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] mt-0.5 tracking-tight">Пошук</span>
        </button>

        {/* Tab 3: Center Plus Action Button */}
        <button
          onClick={() => {
            triggerRatchetTick('hour');
            onOpenPublish();
          }}
          className="relative -top-2 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-blue-600 to-sky-400 text-white shadow-lg shadow-blue-500/35 hover:shadow-blue-500/50 hover:scale-105 active:scale-95 transition-all"
          title="Опублікувати поїздку"
        >
          <Plus className="w-6 h-6 stroke-[2.5]" />
        </button>

        {/* Tab 4: Поїздки */}
        <button
          onClick={() => {
            triggerRatchetTick('minute');
            onNavigate('marshpass-details');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            isTabActive('rides')
              ? 'text-blue-600 dark:text-blue-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <Ticket className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] mt-0.5 tracking-tight">Поїздки</span>
        </button>

        {/* Tab 5: Профіль */}
        <button
          onClick={() => {
            triggerRatchetTick('minute');
            onNavigate('profile');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all ${
            isTabActive('profile')
              ? 'text-blue-600 dark:text-blue-400 font-extrabold'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
        >
          <User className="w-5 h-5 stroke-[2]" />
          <span className="text-[10px] mt-0.5 tracking-tight">Профіль</span>
        </button>
      </div>
    </nav>
  );
};
