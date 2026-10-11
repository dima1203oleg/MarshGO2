import React, { useState } from 'react';
import {
  ChevronLeft,
  MapPin,
  ChevronRight,
  Car,
  Bus,
  Train,
  Footprints,
  TramFront,
  Info,
  Star,
  Users,
} from 'lucide-react';
import { TransitRoute, ScreenId, RouteSegment } from '../../types/marshgo';
import { MOCK_CARPOOL_ANDRIY, MOCK_CARPOOL_OLENA } from '../../data/mockData';
import { triggerRatchetTick } from '../../utils/haptics';

interface ResultsScreenProps {
  routes: TransitRoute[];
  onBack: () => void;
  onSelectRoute: (route: TransitRoute) => void;
  onOpenMap: (route: TransitRoute) => void;
}

export const ResultsScreen: React.FC<ResultsScreenProps> = ({
  routes,
  onBack,
  onSelectRoute,
  onOpenMap,
}) => {
  const [activeFilter, setActiveFilter] = useState<'optimal' | 'cheapest' | 'fastest'>('optimal');

  const filteredRoutes = [...routes].sort((a, b) => {
    if (activeFilter === 'cheapest') {
      return a.totalCostUah - b.totalCostUah;
    }
    if (activeFilter === 'fastest') {
      return a.id === 'route-fast-4' ? -1 : 1;
    }
    return 0;
  });

  const renderSegmentBadge = (seg: RouteSegment) => {
    switch (seg.type) {
      case 'carpool':
        return (
          <div className="flex-1 py-1 px-1 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200/80 dark:border-sky-800 text-center">
            <Car className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 mx-auto" />
            <span className="text-[10px] font-bold text-sky-900 dark:text-sky-200 block mt-0.5">
              {seg.costUah} грн
            </span>
          </div>
        );
      case 'minibus':
        return (
          <div className="flex-1 py-1 px-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800 text-center">
            <Bus className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mx-auto" />
            <span className="text-[10px] font-bold text-amber-900 dark:text-amber-200 block mt-0.5">
              {seg.costUah} грн
            </span>
          </div>
        );
      case 'bus':
        return (
          <div className="flex-1 py-1 px-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 border border-teal-200/80 dark:border-teal-800 text-center">
            <Bus className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 mx-auto" />
            <span className="text-[10px] font-bold text-teal-900 dark:text-teal-200 block mt-0.5">
              {seg.costUah} грн
            </span>
          </div>
        );
      case 'metro':
        return (
          <div className="flex-1 py-1 px-1 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-200/80 dark:border-purple-800 text-center">
            <span className="w-3.5 h-3.5 rounded-full bg-purple-600 text-white text-[9px] font-black inline-flex items-center justify-center">
              M
            </span>
            <span className="text-[10px] font-bold text-purple-900 dark:text-purple-200 block mt-0.5">
              {seg.costUah} грн
            </span>
          </div>
        );
      case 'train':
        return (
          <div className="flex-1 py-1 px-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800 text-center">
            <Train className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 mx-auto" />
            <span className="text-[10px] font-bold text-indigo-900 dark:text-indigo-200 block mt-0.5">
              {seg.costUah} грн
            </span>
          </div>
        );
      case 'tram':
        return (
          <div className="flex-1 py-1 px-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-800 text-center">
            <TramFront className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 mx-auto" />
            <span className="text-[10px] font-bold text-rose-900 dark:text-rose-200 block mt-0.5">
              {seg.costUah} грн
            </span>
          </div>
        );
      case 'walk':
      default:
        return (
          <div className="flex-1 py-1 px-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-center">
            <Footprints className="w-3.5 h-3.5 text-slate-400 mx-auto" />
            <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">0 грн</span>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-200">
      {/* Header matching Screenshot 4 */}
      <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-slate-800 dark:text-slate-200 hover:text-blue-600 flex items-center gap-1 font-extrabold text-sm"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          <span>Результати пошуку</span>
        </button>
        <button
          onClick={() => onOpenMap(filteredRoutes[0])}
          className="p-2 rounded-full text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors"
          title="Показати на карті"
        >
          <MapPin className="w-5 h-5 stroke-[2]" />
        </button>
      </div>

      <div className="p-3.5 sm:p-4 space-y-3.5 flex-1 overflow-y-auto">
        {/* Segmented Filter Control (Оптимальні | Найдешевші | Найшвидші) */}
        <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl">
          <button
            onClick={() => {
              triggerRatchetTick('minute');
              setActiveFilter('optimal');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeFilter === 'optimal'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Оптимальні
          </button>
          <button
            onClick={() => {
              triggerRatchetTick('minute');
              setActiveFilter('cheapest');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeFilter === 'cheapest'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Найдешевші
          </button>
          <button
            onClick={() => {
              triggerRatchetTick('minute');
              setActiveFilter('fastest');
            }}
            className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeFilter === 'fastest'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Найшвидші
          </button>
        </div>

        {/* SECTION 1: Приватні попутки (MarshPass) ℹ️ - EXACT FROM SCREENSHOT 3 */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>Приватні попутки (MarshPass)</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </h3>
          </div>

          {/* Poputka Card 1: Andriy */}
          <div
            onClick={() => {
              triggerRatchetTick('minute');
              onSelectRoute(filteredRoutes[0]);
            }}
            className="cursor-pointer bg-white dark:bg-slate-850 rounded-3xl p-3.5 sm:p-4 shadow-sm border border-slate-200/90 dark:border-slate-750 hover:border-blue-400 hover:shadow-md transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  14:30 – 21:10
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  MarshPass
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="text-xs text-slate-500 font-medium -mt-1">
              6 год 40 хв • 1 пересадка
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <img
                  src={MOCK_CARPOOL_ANDRIY.driverAvatar}
                  alt={MOCK_CARPOOL_ANDRIY.driverName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {MOCK_CARPOOL_ANDRIY.driverName} ★ 4.9 (128)
                  </span>
                  <span className="text-slate-400">{MOCK_CARPOOL_ANDRIY.carModel}</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                Місць: 2 з 4
              </span>
            </div>
          </div>

          {/* Poputka Card 2: Olena */}
          <div
            onClick={() => {
              triggerRatchetTick('minute');
              onSelectRoute(filteredRoutes[1] || filteredRoutes[0]);
            }}
            className="cursor-pointer bg-white dark:bg-slate-850 rounded-3xl p-3.5 sm:p-4 shadow-sm border border-slate-200/90 dark:border-slate-750 hover:border-blue-400 hover:shadow-md transition-all space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-slate-900 dark:text-white">
                  15:20 – 22:10
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  MarshPass
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            <div className="text-xs text-slate-500 font-medium -mt-1">
              6 год 50 хв • 1 пересадка
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <img
                  src={MOCK_CARPOOL_OLENA.driverAvatar}
                  alt={MOCK_CARPOOL_OLENA.driverName}
                  className="w-7 h-7 rounded-full object-cover"
                />
                <div className="text-[11px] leading-tight">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {MOCK_CARPOOL_OLENA.driverName} ★ 4.8 (96)
                  </span>
                  <span className="text-slate-400">{MOCK_CARPOOL_OLENA.carModel}</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-[10px] font-bold">
                Місць: 1 з 3
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Інші варіанти транспорту › */}
        <div className="space-y-2.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-0.5">
              <span>Інші варіанти транспорту</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </h3>
          </div>

          {/* Cards with multi-segment cost visualization from Photo 1 & Photo 3 */}
          {filteredRoutes.map((route) => {
            const nonWalkSegments = route.segments.filter((s) => s.type !== 'walk');
            return (
              <div
                key={route.id}
                onClick={() => {
                  triggerRatchetTick('minute');
                  onSelectRoute(route);
                }}
                className="cursor-pointer bg-white dark:bg-slate-850 rounded-3xl p-3.5 sm:p-4 shadow-sm border border-slate-200/90 dark:border-slate-750 hover:border-blue-400 hover:shadow-md transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                    {route.title}
                  </span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>

                <div className="flex items-center justify-between text-slate-800 dark:text-slate-200">
                  <div className="text-xs sm:text-sm font-bold">
                    {route.departureTime} – {route.arrivalTime}
                  </div>
                  <div className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                    {route.totalCostUah} грн
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 font-medium -mt-1.5">
                  {route.durationFormatted} • {route.transfersCount} пересадки
                </div>

                {/* Segments Price Breakdown Bar */}
                <div className="flex items-center gap-1.5 pt-1">
                  {nonWalkSegments.map((seg) => (
                    <React.Fragment key={seg.id}>
                      {renderSegmentBadge(seg)}
                    </React.Fragment>
                  ))}
                  <div className="py-1 px-1 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-center min-w-[38px]">
                    <Footprints className="w-3.5 h-3.5 text-slate-400 mx-auto" />
                    <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">
                      0 грн
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
