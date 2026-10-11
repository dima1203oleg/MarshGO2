import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Calendar, Clock, ChevronUp, ChevronDown, Check, X, Sparkles, Volume2 } from 'lucide-react';
import { triggerRatchetTick } from '../utils/haptics';

interface IOSDateTimePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: string;
  initialTime?: string;
  onApply: (date: string, time: string) => void;
}

const DATES_LIST = [
  'Сьогодні, 30 жовтня',
  'Завтра, 31 жовтня',
  'Пт, 1 листопада',
  'Сб, 2 листопада',
  'Нд, 3 листопада',
  'Пн, 4 листопада',
  'Вт, 5 листопада',
  'Ср, 6 листопада',
  'Чт, 7 листопада',
  'Пт, 8 листопада',
];

const HOURS_LIST = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
const MINUTES_LIST = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

export const IOSDateTimePickerModal: React.FC<IOSDateTimePickerModalProps> = ({
  isOpen,
  onClose,
  initialDate = 'Сьогодні, 30 жовтня',
  initialTime = '18:30',
  onApply,
}) => {
  const [selectedDateIndex, setSelectedDateIndex] = useState(() => {
    const idx = DATES_LIST.indexOf(initialDate);
    return idx >= 0 ? idx : 0;
  });

  const [selectedHour, setSelectedHour] = useState(() => {
    const parts = initialTime.split(':');
    return parts[0] || '18';
  });

  const [selectedMinute, setSelectedMinute] = useState(() => {
    const parts = initialTime.split(':');
    const min = parts[1] || '30';
    const found = MINUTES_LIST.find((m) => m === min);
    return found || '30';
  });

  // Track touch/drag start for swipe ratchet
  const dragStartYRef = useRef<number | null>(null);

  if (!isOpen) return null;

  const handleDateChange = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < DATES_LIST.length && newIndex !== selectedDateIndex) {
      setSelectedDateIndex(newIndex);
      triggerRatchetTick('date');
    }
  };

  const handleHourChange = (newHour: string) => {
    if (newHour !== selectedHour) {
      setSelectedHour(newHour);
      triggerRatchetTick('hour');
    }
  };

  const handleMinuteChange = (newMinute: string) => {
    if (newMinute !== selectedMinute) {
      setSelectedMinute(newMinute);
      triggerRatchetTick('minute');
    }
  };

  // Wheel scroll handlers for natural ratchet ticking
  const handleDateWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY > 15) {
      if (selectedDateIndex < DATES_LIST.length - 1) handleDateChange(selectedDateIndex + 1);
    } else if (e.deltaY < -15) {
      if (selectedDateIndex > 0) handleDateChange(selectedDateIndex - 1);
    }
  };

  const handleHourWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const currIdx = HOURS_LIST.indexOf(selectedHour);
    if (e.deltaY > 15) {
      const nextIdx = (currIdx + 1) % HOURS_LIST.length;
      handleHourChange(HOURS_LIST[nextIdx]);
    } else if (e.deltaY < -15) {
      const prevIdx = (currIdx - 1 + HOURS_LIST.length) % HOURS_LIST.length;
      handleHourChange(HOURS_LIST[prevIdx]);
    }
  };

  const handleMinuteWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const currIdx = MINUTES_LIST.indexOf(selectedMinute);
    if (e.deltaY > 15) {
      const nextIdx = (currIdx + 1) % MINUTES_LIST.length;
      handleMinuteChange(MINUTES_LIST[nextIdx]);
    } else if (e.deltaY < -15) {
      const prevIdx = (currIdx - 1 + MINUTES_LIST.length) % MINUTES_LIST.length;
      handleMinuteChange(MINUTES_LIST[prevIdx]);
    }
  };

  // Touch drag handlers for smooth iOS drum swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    dragStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchMoveDate = (e: React.TouchEvent) => {
    if (dragStartYRef.current === null) return;
    const diff = e.touches[0].clientY - dragStartYRef.current;
    if (diff < -28) {
      dragStartYRef.current = e.touches[0].clientY;
      if (selectedDateIndex < DATES_LIST.length - 1) handleDateChange(selectedDateIndex + 1);
    } else if (diff > 28) {
      dragStartYRef.current = e.touches[0].clientY;
      if (selectedDateIndex > 0) handleDateChange(selectedDateIndex - 1);
    }
  };

  const handleTouchMoveHour = (e: React.TouchEvent) => {
    if (dragStartYRef.current === null) return;
    const diff = e.touches[0].clientY - dragStartYRef.current;
    const currIdx = HOURS_LIST.indexOf(selectedHour);
    if (diff < -24) {
      dragStartYRef.current = e.touches[0].clientY;
      handleHourChange(HOURS_LIST[(currIdx + 1) % HOURS_LIST.length]);
    } else if (diff > 24) {
      dragStartYRef.current = e.touches[0].clientY;
      handleHourChange(HOURS_LIST[(currIdx - 1 + HOURS_LIST.length) % HOURS_LIST.length]);
    }
  };

  const handleTouchMoveMinute = (e: React.TouchEvent) => {
    if (dragStartYRef.current === null) return;
    const diff = e.touches[0].clientY - dragStartYRef.current;
    const currIdx = MINUTES_LIST.indexOf(selectedMinute);
    if (diff < -24) {
      dragStartYRef.current = e.touches[0].clientY;
      handleMinuteChange(MINUTES_LIST[(currIdx + 1) % MINUTES_LIST.length]);
    } else if (diff > 24) {
      dragStartYRef.current = e.touches[0].clientY;
      handleMinuteChange(MINUTES_LIST[(currIdx - 1 + MINUTES_LIST.length) % MINUTES_LIST.length]);
    }
  };

  const handleSave = () => {
    const finalDate = DATES_LIST[selectedDateIndex];
    const finalTime = `${selectedHour}:${selectedMinute}`;
    onApply(finalDate, finalTime);
    onClose();
  };

  const hourIdx = HOURS_LIST.indexOf(selectedHour);
  const minIdx = MINUTES_LIST.indexOf(selectedMinute);

  return (
    <div
      className="fixed inset-0 z-[1200] bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 rounded-t-[36px] sm:rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col border border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* iOS UIDatePicker Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Скасувати
          </button>
          <div className="text-center">
            <h3 className="text-xs font-black tracking-tight text-slate-900 dark:text-white uppercase flex items-center justify-center gap-1.5">
              <span>Вибір дати та часу</span>
            </h3>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold flex items-center justify-center gap-1 mt-0.5">
              <Volume2 className="w-3 h-3" />
              <span>Звукова тріскачка & тактильний відгук</span>
            </span>
          </div>
          <button
            onClick={handleSave}
            className="text-xs font-black text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Готово
          </button>
        </div>

        {/* Selected preview bar */}
        <div className="px-5 py-2.5 bg-blue-50/70 dark:bg-blue-950/40 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between text-xs font-bold text-blue-900 dark:text-blue-200">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="truncate">{DATES_LIST[selectedDateIndex]}</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <Clock className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>{selectedHour}:{selectedMinute}</span>
          </div>
        </div>

        {/* 3 iOS Drum Wheel Columns with 3D mechanical cylinder illusion */}
        <div className="p-4 grid grid-cols-12 gap-2 relative bg-white dark:bg-slate-900 select-none items-center">
          {/* Central selection lens overlay */}
          <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-11 rounded-2xl bg-blue-500/10 border-y border-blue-500/30 dark:bg-blue-500/15 pointer-events-none z-0" />

          {/* COLUMN 1: DATE (6 cols) */}
          <div
            className="col-span-6 flex flex-col items-center z-10 touch-none cursor-ns-resize"
            onWheel={handleDateWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMoveDate}
          >
            <button
              onClick={() => handleDateChange(selectedDateIndex - 1)}
              disabled={selectedDateIndex === 0}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 active:scale-95 transition-all"
              title="Попередня дата"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            <div className="h-32 w-full flex flex-col items-center justify-center py-2 space-y-1 text-center">
              {/* Prev - 1 */}
              {selectedDateIndex > 0 ? (
                <div
                  onClick={() => handleDateChange(selectedDateIndex - 1)}
                  className="cursor-pointer text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 truncate w-full transition-opacity opacity-60 hover:opacity-100"
                >
                  {DATES_LIST[selectedDateIndex - 1]}
                </div>
              ) : (
                <div className="h-4" />
              )}

              {/* Active Center */}
              <div className="text-xs font-black text-slate-900 dark:text-white px-2 py-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/90 dark:border-slate-700 w-full truncate text-center scale-105 transition-transform">
                {DATES_LIST[selectedDateIndex]}
              </div>

              {/* Next + 1 */}
              {selectedDateIndex < DATES_LIST.length - 1 ? (
                <div
                  onClick={() => handleDateChange(selectedDateIndex + 1)}
                  className="cursor-pointer text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 truncate w-full transition-opacity opacity-60 hover:opacity-100"
                >
                  {DATES_LIST[selectedDateIndex + 1]}
                </div>
              ) : (
                <div className="h-4" />
              )}
            </div>

            <button
              onClick={() => handleDateChange(selectedDateIndex + 1)}
              disabled={selectedDateIndex === DATES_LIST.length - 1}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20 active:scale-95 transition-all"
              title="Наступна дата"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase mt-0.5 tracking-wider">Дата</span>
          </div>

          {/* COLUMN 2: HOURS (3 cols) */}
          <div
            className="col-span-3 flex flex-col items-center z-10 border-l border-slate-100 dark:border-slate-800 pl-1 touch-none cursor-ns-resize"
            onWheel={handleHourWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMoveHour}
          >
            <button
              onClick={() => {
                const prev = (hourIdx - 1 + HOURS_LIST.length) % HOURS_LIST.length;
                handleHourChange(HOURS_LIST[prev]);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:scale-95 transition-all"
              title="Година назад"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            <div className="h-32 w-full flex flex-col items-center justify-center py-2 space-y-1 text-center font-mono">
              {/* Prev */}
              <div
                onClick={() => {
                  const prev = (hourIdx - 1 + 24) % 24;
                  handleHourChange(HOURS_LIST[prev]);
                }}
                className="cursor-pointer text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 opacity-60"
              >
                {HOURS_LIST[(hourIdx - 1 + 24) % 24]}
              </div>

              {/* Active */}
              <div className="text-base font-black text-slate-900 dark:text-white px-3 py-1 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/90 dark:border-slate-700 w-full scale-105 transition-transform">
                {selectedHour}
              </div>

              {/* Next */}
              <div
                onClick={() => {
                  const next = (hourIdx + 1) % 24;
                  handleHourChange(HOURS_LIST[next]);
                }}
                className="cursor-pointer text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 opacity-60"
              >
                {HOURS_LIST[(hourIdx + 1) % 24]}
              </div>
            </div>

            <button
              onClick={() => {
                const next = (hourIdx + 1) % 24;
                handleHourChange(HOURS_LIST[next]);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:scale-95 transition-all"
              title="Година вперед"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase mt-0.5 tracking-wider">Год</span>
          </div>

          {/* COLUMN 3: MINUTES (3 cols) */}
          <div
            className="col-span-3 flex flex-col items-center z-10 border-l border-slate-100 dark:border-slate-800 pl-1 touch-none cursor-ns-resize"
            onWheel={handleMinuteWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMoveMinute}
          >
            <button
              onClick={() => {
                const prev = (minIdx - 1 + MINUTES_LIST.length) % MINUTES_LIST.length;
                handleMinuteChange(MINUTES_LIST[prev]);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:scale-95 transition-all"
              title="Хвилини назад"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            <div className="h-32 w-full flex flex-col items-center justify-center py-2 space-y-1 text-center font-mono">
              {/* Prev */}
              <div
                onClick={() => {
                  const prev = (minIdx - 1 + MINUTES_LIST.length) % MINUTES_LIST.length;
                  handleMinuteChange(MINUTES_LIST[prev]);
                }}
                className="cursor-pointer text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 opacity-60"
              >
                {MINUTES_LIST[(minIdx - 1 + MINUTES_LIST.length) % MINUTES_LIST.length]}
              </div>

              {/* Active */}
              <div className="text-base font-black text-slate-900 dark:text-white px-3 py-1 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/90 dark:border-slate-700 w-full scale-105 transition-transform">
                {selectedMinute}
              </div>

              {/* Next */}
              <div
                onClick={() => {
                  const next = (minIdx + 1) % MINUTES_LIST.length;
                  handleMinuteChange(MINUTES_LIST[next]);
                }}
                className="cursor-pointer text-[11px] font-medium text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300 opacity-60"
              >
                {MINUTES_LIST[(minIdx + 1) % MINUTES_LIST.length]}
              </div>
            </div>

            <button
              onClick={() => {
                const next = (minIdx + 1) % MINUTES_LIST.length;
                handleMinuteChange(MINUTES_LIST[next]);
              }}
              className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 active:scale-95 transition-all"
              title="Хвилини вперед"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
            <span className="text-[10px] font-extrabold text-slate-400 uppercase mt-0.5 tracking-wider">Хв</span>
          </div>
        </div>

        {/* Quick presets footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-1.5 overflow-x-auto no-scrollbar">
          <button
            onClick={() => {
              setSelectedDateIndex(0);
              triggerRatchetTick('date');
            }}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 shrink-0 transition-colors"
          >
            Сьогодні
          </button>
          <button
            onClick={() => {
              setSelectedDateIndex(1);
              triggerRatchetTick('date');
            }}
            className="px-2.5 py-1 rounded-xl bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-600 shrink-0 transition-colors"
          >
            Завтра
          </button>
          <button
            onClick={() => {
              const now = new Date();
              const h = String(now.getHours()).padStart(2, '0');
              const m = String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, '0');
              setSelectedHour(h);
              setSelectedMinute(m);
              triggerRatchetTick('hour');
            }}
            className="px-2.5 py-1 rounded-xl bg-blue-50 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 text-[11px] font-bold text-blue-700 dark:text-blue-300 hover:bg-blue-100 shrink-0 transition-colors"
          >
            Зараз ⚡
          </button>
          <button
            onClick={handleSave}
            className="ml-auto px-4 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-black shadow-xs hover:bg-blue-700 shrink-0 transition-all active:scale-95"
          >
            Застосувати
          </button>
        </div>
      </div>
    </div>
  );
};
