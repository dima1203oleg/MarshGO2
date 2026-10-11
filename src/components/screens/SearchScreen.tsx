import React, { useState } from 'react';
import {
  ChevronLeft,
  X,
  MapPin,
  LocateFixed,
  ArrowUpDown,
  Calendar,
  Clock,
  Car,
  Bus,
  Train,
  Bike,
  Footprints,
  CableCar,
  TramFront,
  Navigation2,
  ChevronDown,
} from 'lucide-react';
import { TransportType } from '../../types/marshgo';
import { TRANSPORT_CATEGORIES } from '../../data/mockData';
import { IOSDateTimePickerModal } from '../IOSDateTimePickerModal';
import { triggerRatchetTick } from '../../utils/haptics';

interface SearchScreenProps {
  onBack: () => void;
  onSearchSubmit: (origin: string, destination: string, selectedModes: TransportType[]) => void;
  defaultOrigin?: string;
  defaultDestination?: string;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  onBack,
  onSearchSubmit,
  defaultOrigin = 'Львів, вул. Стрийська, 45',
  defaultDestination = 'Київ, вул. Хрещатик, 1',
}) => {
  const [origin, setOrigin] = useState(defaultOrigin);
  const [destination, setDestination] = useState(defaultDestination);
  const [date, setDate] = useState('Сьогодні, 30 жовтня');
  const [time, setTime] = useState('18:30');
  const [isNow, setIsNow] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [selectedModes, setSelectedModes] = useState<TransportType[]>(
    TRANSPORT_CATEGORIES.map((c) => c.id)
  );

  const toggleMode = (id: TransportType) => {
    triggerRatchetTick('minute');
    if (selectedModes.includes(id)) {
      if (selectedModes.length > 1) {
        setSelectedModes(selectedModes.filter((m) => m !== id));
      }
    } else {
      setSelectedModes([...selectedModes, id]);
    }
  };

  const toggleAllModes = () => {
    triggerRatchetTick('date');
    if (selectedModes.length === TRANSPORT_CATEGORIES.length) {
      setSelectedModes(['carpool', 'minibus', 'bus', 'metro']);
    } else {
      setSelectedModes(TRANSPORT_CATEGORIES.map((c) => c.id));
    }
  };

  const swapLocations = () => {
    triggerRatchetTick('minute');
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const renderTransportIcon = (id: TransportType) => {
    switch (id) {
      case 'carpool':
        return <Car className="w-5 h-5 text-blue-500" />;
      case 'minibus':
        return <Bus className="w-5 h-5 text-amber-500" />;
      case 'bus':
        return <Bus className="w-5 h-5 text-teal-500" />;
      case 'taxi':
        return <Car className="w-5 h-5 text-yellow-500" />;
      case 'trolleybus':
        return <CableCar className="w-5 h-5 text-emerald-500" />;
      case 'metro':
        return <span className="font-black text-sm text-purple-600">M</span>;
      case 'tram':
        return <TramFront className="w-5 h-5 text-rose-500" />;
      case 'train':
        return <Train className="w-5 h-5 text-indigo-500" />;
      case 'bike':
        return <Bike className="w-5 h-5 text-emerald-500" />;
      case 'scooter':
        return <Footprints className="w-5 h-5 text-purple-500" />;
      case 'carshare':
        return <Car className="w-5 h-5 text-sky-500" />;
      case 'transfer':
        return <Navigation2 className="w-5 h-5 text-blue-600" />;
      default:
        return <Car className="w-5 h-5 text-slate-600" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-900 animate-in fade-in duration-200">
      {/* Top Header matching Screenshot 3 */}
      <div className="sticky top-0 z-20 bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={onBack}
          className="p-1 -ml-1 text-slate-800 dark:text-slate-200 hover:text-blue-600 flex items-center gap-1 font-extrabold text-sm transition-colors"
        >
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          <span>Пошук маршруту</span>
        </button>
      </div>

      <div className="flex-1 p-3.5 sm:p-4 space-y-3 sm:space-y-3.5 overflow-y-auto">
        {/* Origin & Destination Card */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-3.5 sm:p-4 shadow-sm border border-slate-200/80 dark:border-slate-750 space-y-2.5">
          {/* Origin */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 ring-4 ring-blue-100 dark:ring-blue-950" />
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                placeholder="Звідки (місто, адреса)"
                className="w-full text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 pr-14 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {origin && (
                  <button
                    onClick={() => setOrigin('')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setOrigin('Львів, вул. Стрийська, 45')}
                  className="p-1 text-blue-600 hover:text-blue-800"
                  title="Моя локація"
                >
                  <LocateFixed className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Swap Divider */}
          <div className="flex items-center justify-between px-3">
            <div className="h-4 w-0.5 bg-slate-200 dark:bg-slate-700 ml-1" />
            <button
              onClick={swapLocations}
              className="p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 active:scale-95 transition-all shadow-xs"
              title="Поміняти місцями"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Destination */}
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shrink-0 ring-4 ring-rose-100 dark:ring-rose-950" />
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Куди (місто, адреса)"
                className="w-full text-xs sm:text-[13px] font-semibold text-slate-800 dark:text-white bg-slate-50 dark:bg-slate-800 rounded-xl px-3 py-2.5 pr-14 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
              <div className="absolute right-2 flex items-center gap-1">
                {destination && (
                  <button
                    onClick={() => setDestination('')}
                    className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setDestination('Київ, вул. Хрещатик, 1')}
                  className="p-1 text-rose-600 hover:text-rose-800"
                  title="Вибрати на карті"
                >
                  <MapPin className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Date Row */}
        <button
          type="button"
          onClick={() => {
            triggerRatchetTick('date');
            setIsPickerOpen(true);
          }}
          className="w-full bg-white dark:bg-slate-850 rounded-2xl p-3 shadow-sm border border-slate-200/80 dark:border-slate-750 flex items-center justify-between text-left hover:border-blue-300 transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{date}</span>
          </div>
          <Calendar className="w-4 h-4 text-slate-400" />
        </button>

        {/* Time Row with 'Зараз' button */}
        <div className="bg-white dark:bg-slate-850 rounded-2xl p-3 shadow-sm border border-slate-200/80 dark:border-slate-750 flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              triggerRatchetTick('hour');
              setIsPickerOpen(true);
            }}
            className="flex items-center gap-2.5 text-left"
          >
            <Clock className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 font-mono">{time}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              const now = new Date();
              const h = String(now.getHours()).padStart(2, '0');
              const m = String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, '0');
              setTime(`${h}:${m}`);
              setIsNow(true);
              triggerRatchetTick('minute');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
              isNow
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
            }`}
          >
            <span>⚡ Зараз</span>
          </button>
        </div>

        {/* 12 Transport Modes Grid matching Screenshot 3 */}
        <div className="bg-white dark:bg-slate-850 rounded-3xl p-3.5 sm:p-4 shadow-sm border border-slate-200/80 dark:border-slate-750 space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold text-slate-900 dark:text-white">
              Види транспорту
            </h3>
            <button
              onClick={toggleAllModes}
              className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-0.5"
            >
              <span>Усі</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4x3 Grid of 12 transportation types */}
          <div className="grid grid-cols-4 gap-2">
            {TRANSPORT_CATEGORIES.map((cat) => {
              const isSelected = selectedModes.includes(cat.id);
              return (
                <button
                  key={cat.id}
                  onClick={() => toggleMode(cat.id)}
                  className={`p-2 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border ${
                    isSelected
                      ? 'bg-blue-50/80 dark:bg-blue-950/50 border-blue-300 dark:border-blue-700 text-slate-900 dark:text-white shadow-xs'
                      : 'bg-slate-50/60 dark:bg-slate-800/40 border-slate-200/60 dark:border-slate-700/60 text-slate-400'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                      isSelected ? 'bg-white dark:bg-slate-800 shadow-xs' : 'bg-slate-100 dark:bg-slate-800/80'
                    }`}
                  >
                    {renderTransportIcon(cat.id)}
                  </div>
                  <span className="text-[10px] sm:text-[11px] font-semibold tracking-tight truncate w-full">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Big Blue Bottom Button: Знайти маршрут ➔ */}
      <div className="sticky bottom-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-3.5 sm:p-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            triggerRatchetTick('hour');
            onSearchSubmit(origin, destination, selectedModes);
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold text-sm shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 transition-all"
        >
          <span>Знайти маршрут</span>
          <span>→</span>
        </button>
      </div>

      {/* Date & Time Picker Modal */}
      <IOSDateTimePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        initialDate={date}
        initialTime={time}
        onApply={(newDate, newTime) => {
          setDate(newDate);
          setTime(newTime);
          setIsNow(false);
        }}
      />
    </div>
  );
};
