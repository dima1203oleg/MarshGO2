import React, { useState } from 'react';
import { MapPin, ChevronDown, MessageSquare, Bell, Check } from 'lucide-react';
import { ScreenId } from '../types/marshgo';
import { triggerRatchetTick } from '../utils/haptics';

interface HeaderProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  onNavigate: (screen: ScreenId) => void;
  unreadMessagesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentCity,
  onCityChange,
  onNavigate,
  unreadMessagesCount = 2,
}) => {
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const cities = ['Львів', 'Київ', 'Тернопіль', 'Житомир', 'Івано-Франківськ', 'Одеса', 'Рівне'];

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3.5 sm:px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
      {/* Brand & City Picker matching Screenshots */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Exact Brand Logo styling from screenshot */}
        <button
          onClick={() => {
            triggerRatchetTick('minute');
            onNavigate('home');
          }}
          className="flex items-center gap-1 group text-left"
        >
          <span className="text-xl font-black italic tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
            MARSH<span className="text-blue-600">GO</span>
          </span>
        </button>

        {/* City selector pill */}
        <div className="relative">
          <button
            onClick={() => {
              triggerRatchetTick('minute');
              setIsCityDropdownOpen(!isCityDropdownOpen);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-all border border-slate-200/60 dark:border-slate-700"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>{currentCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* City Dropdown Menu */}
          {isCityDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-48 bg-white dark:bg-slate-850 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-750 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Оберіть місто
              </div>
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    onCityChange(city);
                    setIsCityDropdownOpen(false);
                    triggerRatchetTick('date');
                  }}
                  className={`w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                    city === currentCity ? 'text-blue-600 font-bold bg-blue-50/50 dark:bg-blue-950/40' : 'text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span>{city}</span>
                  {city === currentCity && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Icons matching Screenshots: Chat & Bell */}
      <div className="flex items-center gap-1 relative">
        {/* Messages */}
        <button
          onClick={() => {
            triggerRatchetTick('minute');
            onNavigate('messages');
          }}
          className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Повідомлення"
        >
          <MessageSquare className="w-5 h-5 stroke-[1.8]" />
          {unreadMessagesCount > 0 && (
            <span className="absolute top-1 right-1 min-w-[16px] h-4 px-1 rounded-full bg-blue-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white dark:ring-slate-900">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => {
            triggerRatchetTick('minute');
            setShowNotifications(!showNotifications);
          }}
          className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          title="Сповіщення"
        >
          <Bell className="w-5 h-5 stroke-[1.8]" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 ring-2 ring-white dark:ring-slate-900" />
        </button>

        {/* Notifications Popover */}
        {showNotifications && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-850 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-750 p-3 z-50 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Сповіщення</span>
              <span className="text-[10px] text-blue-600 font-medium">Всі прочитані</span>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              <div className="py-2.5">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Попутка підтверджена</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Водій Андрій Коваленко очікує вас о 14:30 на вул. Стрийська, 45.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">5 хв тому</span>
              </div>
              <div className="py-2.5">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Маршрутка №112 курсує за розкладом</p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px]">Наступне відправлення з АС Житомир о 17:10.</p>
                <span className="text-[10px] text-slate-400 mt-1 block">20 хв тому</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
