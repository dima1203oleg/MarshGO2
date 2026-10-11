import React from 'react';
import {
  ChevronLeft,
  Share2,
  Car,
  Bus,
  Footprints,
  MapPin,
  Clock,
  ExternalLink,
  ShieldCheck,
  Star,
  Users,
  Briefcase,
  Calendar,
} from 'lucide-react';
import { TransitRoute } from '../../types/marshgo';
import { MOCK_CARPOOL_ANDRIY } from '../../data/mockData';
import { triggerRatchetTick } from '../../utils/haptics';

interface RouteDetailsScreenProps {
  route: TransitRoute;
  onBack: () => void;
  onOpenRideDetails: () => void;
  onBookRoute: () => void;
  onStartNavigation?: () => void;
}

export const RouteDetailsScreen: React.FC<RouteDetailsScreenProps> = ({
  route,
  onBack,
  onOpenRideDetails,
  onBookRoute,
}) => {
  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-200">
      {/* Header matching Screenshot 6 */}
      <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-slate-800 dark:text-slate-200 hover:text-blue-600 flex items-center gap-1 font-extrabold text-sm"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          <span>Деталі маршруту</span>
        </button>
        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            triggerRatchetTick('minute');
            alert('Посилання на маршрут скопійовано!');
          }}
          className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Поділитися"
        >
          <Share2 className="w-4 h-4 stroke-[2]" />
        </button>
      </div>

      <div className="flex-1 p-3.5 sm:p-4 overflow-y-auto space-y-3.5 sm:space-y-4">
        {/* Step-by-step Itinerary Timeline matching Screenshot 6 */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-4 sm:p-5 shadow-sm border border-slate-200/80 dark:border-slate-750 space-y-5 relative">
          {/* Continuous vertical line */}
          <div className="absolute left-[3.15rem] top-7 bottom-7 w-0.5 bg-slate-200 dark:bg-slate-700 pointer-events-none" />

          {/* STEP 1: Meeting Point */}
          <div className="relative flex items-start gap-3">
            <div className="text-xs font-extrabold text-slate-500 font-mono w-10 pt-0.5">14:30</div>
            <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-850 z-10 shrink-0">
              <span className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div className="flex-1 pb-1">
              <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                Львів, вул. Стрийська, 45
              </h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Місце зустрічі</p>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 mt-1">
                <Footprints className="w-3 h-3" />
                <span>5 хв • 400 м</span>
              </div>
            </div>
          </div>

          {/* STEP 2: Carpool segment */}
          <div className="relative flex items-start gap-3">
            <div className="text-xs font-extrabold text-slate-500 font-mono w-10 pt-0.5">14:40</div>
            <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-850 z-10 shrink-0">
              <Car className="w-3 h-3" />
            </div>
            <div className="flex-1 bg-blue-50/70 dark:bg-blue-950/40 rounded-2xl p-3 border border-blue-200/70 dark:border-blue-800/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-blue-900 dark:text-blue-200">
                  Попутка (водій Андрій)
                </span>
                <span className="text-xs font-black text-blue-900 dark:text-blue-200">120 грн</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                Виїзд від вул. Стрийська, 45 до АС Житомир
              </p>
              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[10px] text-slate-400">2 год 20 хв • 145 км</span>
                <button
                  onClick={onOpenRideDetails}
                  className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Детальніше
                </button>
              </div>
            </div>
          </div>

          {/* STEP 3: Zhytomyr Stop */}
          <div className="relative flex items-start gap-3">
            <div className="text-xs font-extrabold text-slate-500 font-mono w-10 pt-0.5">17:00</div>
            <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-850 z-10 shrink-0">
              <Clock className="w-3 h-3" />
            </div>
            <div className="flex-1 pb-1">
              <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                Зупинка (АЗС ОККО, Житомир)
              </h5>
              <p className="text-[11px] text-slate-400 mt-0.5">15 хв перерва на каву та відпочинок</p>
            </div>
          </div>

          {/* STEP 4: Minibus 112 */}
          <div className="relative flex items-start gap-3">
            <div className="text-xs font-extrabold text-slate-500 font-mono w-10 pt-0.5">17:10</div>
            <div className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-850 z-10 shrink-0">
              <Bus className="w-3 h-3" />
            </div>
            <div className="flex-1 bg-amber-50/70 dark:bg-amber-950/40 rounded-2xl p-3 border border-amber-200/70 dark:border-amber-800/60 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-amber-900 dark:text-amber-200">
                  Маршрутка №112
                </span>
                <span className="text-xs font-black text-amber-900 dark:text-amber-200">35 грн</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-300">
                У напрямку: Київ (Центральний)
              </p>
              <div className="text-[10px] text-slate-400 space-y-0.5 pt-0.5">
                <div>• АС Житомир (посадка)</div>
                <div>• с. Глибочиця • м. Коростишів</div>
                <div>• ст. метро Житомирська</div>
              </div>
            </div>
          </div>

          {/* STEP 5: Destination */}
          <div className="relative flex items-start gap-3">
            <div className="text-xs font-extrabold text-slate-500 font-mono w-10 pt-0.5">21:10</div>
            <div className="w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-850 z-10 shrink-0">
              <span className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-extrabold text-slate-900 dark:text-white">
                Київ, вул. Хрещатик, 1
              </h5>
              <p className="text-[11px] text-slate-400 mt-0.5">Кінцева точка маршруту</p>
            </div>
          </div>
        </div>

        {/* SECTION: Інформація про поїздку - EXACT FROM SCREENSHOT 6 */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-4 shadow-sm border border-slate-200/80 dark:border-slate-750 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
            Інформація про поїздку
          </h4>

          {/* Driver mini card */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <img
                src={MOCK_CARPOOL_ANDRIY.driverAvatar}
                alt={MOCK_CARPOOL_ANDRIY.driverName}
                className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h5 className="text-xs font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
                  <span>{MOCK_CARPOOL_ANDRIY.driverName}</span>
                </h5>
                <div className="flex items-center gap-1.5 text-[11px] text-amber-500 font-bold mt-0.5">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{MOCK_CARPOOL_ANDRIY.driverRating} (128)</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {MOCK_CARPOOL_ANDRIY.carModel}, {MOCK_CARPOOL_ANDRIY.carPlate}
                </div>
              </div>
            </div>

            <span className="px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
              MarshPass
            </span>
          </div>

          {/* Trip Details Checklist matching Screenshot 6 */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <Users className="w-3.5 h-3.5 text-blue-600" />
                <span>Приватна попутка</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">MarshPass</span>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <span className="text-slate-400 font-mono">💺</span>
                <span>Місце</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">3 з 4</span>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <span className="text-slate-400 font-mono">💳</span>
                <span>Ціна</span>
              </span>
              <span className="font-black text-blue-600 dark:text-blue-400">320 грн</span>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Тривалість</span>
              </span>
              <span className="font-bold text-slate-900 dark:text-white">6 год 40 хв</span>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                <span>Багаж</span>
              </span>
              <span className="font-medium text-slate-600 dark:text-slate-400">1 валіза + ручна поклажа</span>
            </div>

            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300 pt-1 border-t border-slate-100 dark:border-slate-800">
              <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Надійний водій</span>
              </span>
              <span className="text-[11px] text-slate-400">Підтверджений профіль</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Booking Button: Забронювати місце */}
      <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            triggerRatchetTick('hour');
            onBookRoute();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
        >
          <span>Забронювати місце</span>
        </button>
      </div>
    </div>
  );
};
