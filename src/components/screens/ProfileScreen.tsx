import React, { useState } from 'react';
import {
  ChevronLeft,
  ShieldCheck,
  Star,
  Car,
  CreditCard,
  Bell,
  Moon,
  Globe,
  HelpCircle,
  LogOut,
  ChevronRight,
  Plus,
  Check,
} from 'lucide-react';
import { UserProfile, MarshPassTicket, ScreenId } from '../../types/marshgo';
import { CURRENT_USER } from '../../data/mockData';

interface ProfileScreenProps {
  onBack: () => void;
  tickets: MarshPassTicket[];
  onSelectTicket: (ticket: MarshPassTicket) => void;
  onNavigate: (screen: ScreenId) => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  onBack,
  tickets,
  onSelectTicket,
  onNavigate,
  darkMode = false,
  onToggleDarkMode,
}) => {
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [isDriverMode, setIsDriverMode] = useState(user.isDriver);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 animate-in fade-in duration-200">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white px-4 py-3 border-b border-slate-100 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-slate-700 hover:text-slate-900 flex items-center gap-1 font-semibold text-sm"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Профіль користувача</span>
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* User Card */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-100 overflow-hidden border-2 border-white shadow-sm shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                <span>{user.name}</span>
                <span title="Верифікований Дія">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">{user.phone}</p>
              <div className="flex items-center gap-2 text-xs mt-1">
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{user.rating}</span>
                </span>
                <span className="text-slate-400">• {user.completedRides} поїздок</span>
              </div>
            </div>
          </div>

          {/* Diia Verified Status Banner */}
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between text-xs text-emerald-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Верифіковано через Дія.Підпис</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-200/60 px-2 py-0.5 rounded-full text-emerald-900">
              Активно
            </span>
          </div>

          {/* Role Mode Switcher (Passenger vs Driver) */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl">
            <button
              onClick={() => setIsDriverMode(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                !isDriverMode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Режим пасажира
            </button>
            <button
              onClick={() => setIsDriverMode(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                isDriverMode
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Режим водія
            </button>
          </div>
        </div>

        {/* Driver Vehicle Card (when in Driver mode) */}
        {isDriverMode && (
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Мій автомобіль
              </h4>
              <span className="text-xs font-bold text-blue-600">Змінити</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs">
              <div className="flex items-center gap-2.5">
                <Car className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="font-bold text-slate-900 block">
                    {user.car?.model || 'Volkswagen Passat B8'}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {user.car?.color || 'Чорний'} • {user.car?.year || 2019}
                  </span>
                </div>
              </div>
              <span className="font-mono font-bold text-slate-800 bg-white px-2 py-1 rounded-lg border border-slate-200">
                {user.car?.plate || 'BC 9988 EK'}
              </span>
            </div>
          </div>
        )}

        {/* Tickets History */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Мої квитки MarshPass ({tickets.length})
            </h4>
          </div>
          <div className="space-y-2">
            {tickets.map((t) => (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTicket(t);
                  onNavigate('marshpass');
                }}
                className="cursor-pointer p-3 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 hover:border-blue-300 transition-all flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">
                    {t.fromCity} → {t.toCity}
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    {t.date} • {t.departureTime} • Код: {t.bookingCode}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-black text-blue-600 block">{t.totalCostUah} грн</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">Активний</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings list */}
        <div className="bg-white rounded-3xl p-2 shadow-sm border border-slate-200/80 divide-y divide-slate-100 text-xs font-semibold text-slate-800">
          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Moon className="w-4 h-4 text-slate-600" />
              <span>Темна тема (Нічний режим)</span>
            </div>
            <button
              onClick={onToggleDarkMode}
              className={`w-10 h-6 rounded-full transition-colors relative p-0.5 ${
                darkMode ? 'bg-blue-600' : 'bg-slate-300'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-slate-600" />
              <span>Мова інтерфейсу</span>
            </div>
            <span className="text-slate-500 font-normal">Українська 🇺🇦</span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-slate-600" />
              <span>Сповіщення про маршрути</span>
            </div>
            <span className="text-blue-600 font-bold">Увімкнено</span>
          </div>

          <div className="p-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <HelpCircle className="w-4 h-4 text-slate-600" />
              <span>Служба підтримки MARSHGO</span>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
