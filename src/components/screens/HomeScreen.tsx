import React, { useState } from 'react';
import {
  Navigation,
  Map,
  Search,
  PlusCircle,
  ChevronRight,
  Car,
  Bus,
  ArrowRight,
  ShieldCheck,
  Star,
  Sparkles,
} from 'lucide-react';
import { ScreenId, MarshPassTicket } from '../../types/marshgo';
import { POPULAR_DESTINATIONS, MOCK_CARPOOL_ANDRIY } from '../../data/mockData';
import { QRCodeSvg } from '../QRCodeSvg';

interface HomeScreenProps {
  tickets: MarshPassTicket[];
  onNavigate: (screen: ScreenId) => void;
  onOpenPublish: () => void;
  onSelectDestination: (destName: string) => void;
  onSelectTicket: (ticket: MarshPassTicket) => void;
  forceState?: 'empty' | 'with-ticket';
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  tickets,
  onNavigate,
  onOpenPublish,
  onSelectDestination,
  onSelectTicket,
  forceState,
}) => {
  const [activeTicketIndex, setActiveTicketIndex] = useState(0);
  const activeTickets = tickets.filter((t) => t.status === 'active');
  const currentTicket = activeTickets[activeTicketIndex] || activeTickets[0];

  const hasTicket = forceState === 'empty' ? false : forceState === 'with-ticket' ? true : activeTickets.length > 0;

  return (
    <div className="flex-1 flex flex-col p-3.5 sm:p-4 space-y-3.5 sm:space-y-4 pb-6 animate-in fade-in duration-200">
      {/* 1. HERO ZONE (Empty vs Active MarshPass) */}
      {!hasTicket ? (
        /* SCREEN 1: Головна (без поїздок) - Hero Card */
        <div className="relative rounded-3xl bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-slate-800 dark:via-slate-850 dark:to-blue-950/40 border border-blue-200/90 dark:border-slate-700/80 p-4 sm:p-5 overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-[240px] sm:max-w-[270px]">
            <h2 className="text-[15px] sm:text-base font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
              Використовуй навігацію — вас попутники знайдуть.
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-300 mt-1.5 font-medium leading-normal">
              Всі види транспорту в одному додатку.
            </p>
          </div>

          {/* Car illustration with travelers */}
          <div className="relative mt-2 pt-1 flex items-end justify-between">
            {/* Styled Sedan Car Graphic */}
            <div className="relative w-44 sm:w-48 h-18">
              <svg viewBox="0 0 240 95" className="w-full h-full drop-shadow-md">
                <ellipse cx="120" cy="85" rx="105" ry="7" fill="rgba(15, 23, 42, 0.15)" />
                {/* Modern car body */}
                <path
                  d="M18 68 Q 18 58, 32 54 L 62 48 L 100 24 Q 118 18, 160 18 L 188 32 L 218 50 Q 228 56, 228 68 L 18 68 Z"
                  fill="#FFFFFF"
                  stroke="#94A3B8"
                  strokeWidth="2"
                />
                {/* Windows glass */}
                <path
                  d="M68 46 L 105 26 L 155 26 L 176 45 Z"
                  fill="#0284C7"
                  fillOpacity="0.88"
                />
                <path d="M122 26 L 122 46" stroke="#FFFFFF" strokeWidth="2.5" />
                {/* Lights */}
                <polygon points="218,52 227,55 218,60" fill="#38BDF8" />
                <polygon points="18,58 24,58 22,64 16,64" fill="#EF4444" />
                {/* Wheels */}
                <circle cx="62" cy="70" r="14" fill="#1E293B" stroke="#CBD5E1" strokeWidth="3" />
                <circle cx="62" cy="70" r="6" fill="#F8FAFC" />
                <circle cx="178" cy="70" r="14" fill="#1E293B" stroke="#CBD5E1" strokeWidth="3" />
                <circle cx="178" cy="70" r="6" fill="#F8FAFC" />
                {/* Door handles */}
                <rect x="132" y="50" width="10" height="2" rx="1" fill="#64748B" />
              </svg>
            </div>

            {/* Travelers silhouette cluster */}
            <div className="flex items-center -space-x-2 pb-1.5">
              <div className="w-7 h-7 rounded-full border-2 border-white bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                🧑‍✈️
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                🧳
              </div>
              <div className="w-7 h-7 rounded-full border-2 border-white bg-amber-500 text-white flex items-center justify-center text-[10px] font-bold shadow-sm">
                🎒
              </div>
            </div>

            {/* Right arrow circular button */}
            <button
              onClick={() => onNavigate('search')}
              className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md hover:bg-blue-700 active:scale-95 transition-all mb-1 shrink-0 ml-1"
              title="Шукати маршрут"
            >
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <span className="w-3.5 h-1.5 rounded-full bg-blue-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300 dark:bg-slate-600" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-300 dark:bg-slate-600" />
          </div>
        </div>
      ) : (
        /* SCREEN 2: Головна (з поїздками / MarshPass) */
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Мої поїздки</span>
            </h2>
            <button
              onClick={() => {
                if (currentTicket) onSelectTicket(currentTicket);
                onNavigate('marshpass-details');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-0.5"
            >
              <span>Всі поїздки</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* MarshPass Interactive Card Matching Screenshot 2 & 3 */}
          <div
            onClick={() => {
              if (currentTicket) onSelectTicket(currentTicket);
              onNavigate('marshpass');
            }}
            className="group cursor-pointer rounded-3xl bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 shadow-md p-3.5 sm:p-4 transition-all hover:border-blue-400 hover:shadow-lg relative overflow-hidden"
          >
            {/* Header with MarshPass and Badge */}
            <div className="flex items-center justify-between text-xs pb-2.5 border-b border-slate-100 dark:border-slate-700/80">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-blue-600 dark:text-blue-400 font-extrabold">
                  <Car className="w-4 h-4" />
                  <span className="text-xs tracking-tight">MarshPass</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  Активна поїздка
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>

            {/* Route, Time & QR preview */}
            <div className="py-2.5 flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 text-base font-black text-slate-900 dark:text-white">
                  <span>{currentTicket?.fromCity || 'Львів'}</span>
                  <ArrowRight className="w-4 h-4 text-blue-600 stroke-[2.5]" />
                  <span>{currentTicket?.toCity || 'Київ'}</span>
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                  {currentTicket?.date || 'Сьогодні, 30 жовтня'}
                </div>
                <div className="text-sm font-extrabold text-slate-800 dark:text-slate-200 mt-0.5">
                  {currentTicket?.departureTime || '14:30'} – {currentTicket?.arrivalTime || '21:10'}
                </div>
              </div>

              {/* QR Preview Snippet */}
              <div className="flex flex-col items-center">
                <QRCodeSvg
                  value={currentTicket?.qrPayload || 'MARSHGO://TICKET/MG-7X4P-9K2L'}
                  size={52}
                  className="p-1 rounded-xl shadow-none"
                />
                <span className="text-[9px] font-mono text-slate-400 font-bold mt-1">
                  {currentTicket?.bookingCode || 'MG-7X4P-9K2L'}
                </span>
              </div>
            </div>

            {/* Driver Profile snippet row */}
            <div className="mt-1 pt-2 border-t border-slate-100 dark:border-slate-700/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <img
                  src={MOCK_CARPOOL_ANDRIY.driverAvatar}
                  alt={currentTicket?.driverName || 'Андрій Коваленко'}
                  className="w-7 h-7 rounded-full object-cover border border-slate-200"
                />
                <div className="text-[11px] leading-tight">
                  <div className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                    <span>{currentTicket?.driverName || 'Андрій Коваленко'}</span>
                    <span className="text-amber-500 font-bold">★ 4.9 (128)</span>
                  </div>
                  <div className="text-slate-400 text-[10px]">
                    {currentTicket?.carModel || 'Skoda Octavia'}, {currentTicket?.carPlate || 'AA 1254 AB'}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-sm font-black text-blue-600 dark:text-blue-400">
                  {currentTicket?.totalCostUah || 320} грн
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  Місце: {currentTicket?.seatNumber || '3 з 4'}
                </span>
              </div>
            </div>

            {/* Pagination dots */}
            <div className="flex items-center justify-center gap-1 mt-2.5">
              <span className="w-3 h-1 rounded-full bg-blue-600" />
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>
          </div>
        </div>
      )}

      {/* 2. FOUR BIG ACTION TILES (2x2 GRID) - EXACT FROM SCREENSHOTS */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Tile 1: Навігація (Blue) */}
        <button
          onClick={() => onNavigate('route-map')}
          className="group text-left p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-[#0ea5e9] to-[#2563eb] text-white shadow-md shadow-blue-500/25 hover:shadow-lg hover:shadow-blue-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between min-h-[115px] sm:min-h-[120px]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Navigation className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight leading-snug">Навігація</h3>
            <p className="text-[11px] text-blue-100 font-medium">Побудувати маршрут</p>
          </div>
        </button>

        {/* Tile 2: Карта транспорту (Green) */}
        <button
          onClick={() => onNavigate('route-map')}
          className="group text-left p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-[#10b981] to-[#059669] text-white shadow-md shadow-emerald-500/25 hover:shadow-lg hover:shadow-emerald-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between min-h-[115px] sm:min-h-[120px]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Map className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight leading-snug">Карта транспорту</h3>
            <p className="text-[11px] text-emerald-100 font-medium">Зупинки, лінії, рух</p>
          </div>
        </button>

        {/* Tile 3: Знайти маршрут (Purple) */}
        <button
          onClick={() => onNavigate('search')}
          className="group text-left p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between min-h-[115px] sm:min-h-[120px]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Search className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight leading-snug">Знайти маршрут</h3>
            <p className="text-[11px] text-purple-100 font-medium">Усі види транспорту</p>
          </div>
        </button>

        {/* Tile 4: Опублікувати поїздку (Orange) */}
        <button
          onClick={onOpenPublish}
          className="group text-left p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-[#f97316] to-[#ea580c] text-white shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-[0.98] transition-all flex flex-col justify-between min-h-[115px] sm:min-h-[120px]"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <PlusCircle className="w-5 h-5 text-white stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold tracking-tight leading-snug">Опублікувати</h3>
            <p className="text-[11px] text-orange-100 font-medium">Попутники поруч</p>
          </div>
        </button>
      </div>

      {/* 3. ПОПУЛЯРНІ НАПРЯМКИ - EXACT FROM SCREENSHOTS */}
      <div className="space-y-2 pt-1">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold text-slate-900 dark:text-slate-100">
            Популярні напрямки
          </h3>
          <button
            onClick={() => onNavigate('search')}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5"
          >
            <span>Показати всі</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 3 Popular City Cards with Cityscape Photos/Illustrations */}
        <div className="grid grid-cols-3 gap-2 sm:gap-2.5">
          {/* Kyiv */}
          <button
            onClick={() => onSelectDestination('Київ')}
            className="group text-left rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 p-2 sm:p-2.5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Visual Header */}
            <div className="w-full h-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-700 relative overflow-hidden flex items-center justify-center text-white mb-2">
              <div className="absolute inset-0 bg-black/15" />
              <span className="text-xl select-none z-10">🏛️</span>
              <span className="absolute bottom-1 left-1.5 text-[9px] font-black tracking-wider uppercase text-blue-100 z-10">
                Столиця
              </span>
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Київ
              </div>
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                від 320 грн
              </div>
            </div>
          </button>

          {/* Ternopil */}
          <button
            onClick={() => onSelectDestination('Тернопіль')}
            className="group text-left rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 p-2 sm:p-2.5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="w-full h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 relative overflow-hidden flex items-center justify-center text-white mb-2">
              <div className="absolute inset-0 bg-black/15" />
              <span className="text-xl select-none z-10">🌊</span>
              <span className="absolute bottom-1 left-1.5 text-[9px] font-black tracking-wider uppercase text-emerald-100 z-10">
                Озеро
              </span>
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Тернопіль
              </div>
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                від 180 грн
              </div>
            </div>
          </button>

          {/* Ivano-Frankivsk */}
          <button
            onClick={() => onSelectDestination('Івано-Франківськ')}
            className="group text-left rounded-2xl bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-750 p-2 sm:p-2.5 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            <div className="w-full h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-700 relative overflow-hidden flex items-center justify-center text-white mb-2">
              <div className="absolute inset-0 bg-black/15" />
              <span className="text-xl select-none z-10">🏔️</span>
              <span className="absolute bottom-1 left-1.5 text-[9px] font-black tracking-wider uppercase text-amber-100 z-10">
                Карпати
              </span>
            </div>
            <div>
              <div className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Івано-Франківськ
              </div>
              <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                від 260 грн
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
