import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  Monitor,
  Tablet,
  RotateCcw,
  Moon,
  Sun,
  LayoutGrid,
  Check,
  ChevronDown,
} from 'lucide-react';
import { ScreenId } from '../types/marshgo';
import { triggerRatchetTick } from '../utils/haptics';

export type DeviceViewMode = 'showcase' | 'iphone' | 'tablet' | 'desktop';

interface DeviceFrameProps {
  children: React.ReactNode;
  desktopLayout?: React.ReactNode;
  showcaseLayout?: React.ReactNode;
  deviceMode: DeviceViewMode;
  setDeviceMode: (mode: DeviceViewMode) => void;
  onResetData: () => void;
  hasActiveTickets: boolean;
  onToggleDemoTicket: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  toastMessage?: string | null;
  onCloseToast?: () => void;
  isNavigating?: boolean;
  currentScreen?: ScreenId;
  onSelectScreen?: (screen: ScreenId) => void;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({
  children,
  desktopLayout,
  showcaseLayout,
  deviceMode,
  setDeviceMode,
  onResetData,
  hasActiveTickets,
  onToggleDemoTicket,
  darkMode = false,
  onToggleDarkMode,
  toastMessage,
  onCloseToast,
  isNavigating = false,
  currentScreen,
  onSelectScreen,
}) => {
  const [isRealMobileDevice, setIsRealMobileDevice] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsRealMobileDevice(window.innerWidth <= 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const screenOptions: { id: ScreenId; label: string }[] = [
    { id: 'home', label: '1. Головна' },
    { id: 'search', label: '3. Пошук' },
    { id: 'results', label: '4. Результати' },
    { id: 'route-map', label: '5. Карта' },
    { id: 'route-details', label: '6. Деталі маршруту' },
    { id: 'ride-details', label: '7. Деталі попутки' },
    { id: 'marshpass', label: '8. MarshPass Квиток' },
    { id: 'marshpass-details', label: '9. Керування квитком' },
  ];

  // Real mobile phone screen edge-to-edge
  if (isRealMobileDevice) {
    return (
      <div className={`min-h-screen w-full ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'} flex flex-col pt-safe pb-safe pl-safe pr-safe relative`}>
        {toastMessage && (
          <div className="fixed top-3 left-4 right-4 z-[999] bg-slate-900/95 dark:bg-white/95 text-white dark:text-slate-900 text-xs font-bold py-2.5 px-4 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10 animate-in fade-in slide-in-from-top-2 backdrop-blur-md">
            <span>{toastMessage}</span>
            <button onClick={onCloseToast} className="p-1 -mr-1 text-slate-400 hover:text-white dark:hover:text-black">
              ✕
            </button>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#0f172a] text-slate-100'} flex flex-col select-none relative`}>
      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-[1500] max-w-md w-full px-4 animate-in fade-in slide-in-from-top-3">
          <div className="bg-slate-900/95 text-white text-xs font-bold py-3 px-4 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              <span>{toastMessage}</span>
            </div>
            <button onClick={onCloseToast} className="text-slate-400 hover:text-white font-mono text-sm ml-2">
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Top Controls Toolbar matching screenshots presentation */}
      <header className="w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 px-3 sm:px-6 py-2.5 sticky top-0 z-50 shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2.5 text-xs">
          {/* Logo & Platform Tag */}
          <div className="flex items-center gap-3">
            <span className="font-black text-base tracking-tight text-white flex items-center gap-1">
              MARSH<span className="text-blue-500">GO</span>
            </span>
            <span className="hidden md:inline-block px-2.5 py-0.5 rounded-full bg-blue-950 text-blue-300 border border-blue-800/60 font-semibold text-[11px]">
              Розумні поїздки • Україна 🇺🇦
            </span>
          </div>

          {/* Quick Jump between all 8 screens when on interactive iPhone */}
          {deviceMode === 'iphone' && onSelectScreen && (
            <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 rounded-xl p-1 border border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 px-2 uppercase tracking-wider">
                Екран:
              </span>
              <div className="flex items-center gap-1">
                {screenOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      triggerRatchetTick('minute');
                      onSelectScreen(opt.id);
                    }}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all ${
                      currentScreen === opt.id
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    {opt.label.split('.')[1]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controls: Mode Switcher & Theme */}
          <div className="flex items-center gap-2">
            {/* Dark/Light Theme Toggle */}
            {onToggleDarkMode && (
              <button
                onClick={() => {
                  triggerRatchetTick('minute');
                  onToggleDarkMode();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 flex items-center gap-1.5 font-bold transition-all"
                title="Перемкнути між Світлою (Фото 1-3) та Темною (Фото 4) темою"
              >
                {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
                <span className="hidden sm:inline">{darkMode ? 'Світла' : 'Темна'}</span>
              </button>
            )}

            {/* Toggle Tickets */}
            <button
              onClick={() => {
                triggerRatchetTick('minute');
                onToggleDemoTicket();
              }}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                hasActiveTickets
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
            >
              {hasActiveTickets ? '🎟️ З квитком' : '🚗 Без поїздок'}
            </button>

            {/* View Mode Switcher: Showcase vs iPhone vs Desktop */}
            <div className="flex items-center bg-slate-900 rounded-xl p-0.5 border border-slate-800">
              <button
                onClick={() => {
                  triggerRatchetTick('hour');
                  setDeviceMode('showcase');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  deviceMode === 'showcase'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Шоукейс усіх екранів (як на фото)"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Шоукейс (як на фото)</span>
              </button>

              <button
                onClick={() => {
                  triggerRatchetTick('hour');
                  setDeviceMode('iphone');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  deviceMode === 'iphone'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Інтерактивний iPhone"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">iPhone 15</span>
              </button>

              <button
                onClick={() => {
                  triggerRatchetTick('hour');
                  setDeviceMode('desktop');
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
                  deviceMode === 'desktop'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title="Десктоп"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Десктоп</span>
              </button>
            </div>

            {/* Reset */}
            <button
              onClick={() => {
                triggerRatchetTick('date');
                onResetData();
              }}
              className="p-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 hover:bg-slate-700 transition-colors"
              title="Скинути демо дані"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full flex-1 flex flex-col items-center justify-start overflow-auto">
        {deviceMode === 'showcase' && (showcaseLayout || children)}

        {deviceMode === 'iphone' && (
          <div className="w-full flex-1 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
            {/* Exact iPhone 15 Pro Max: Natural Titanium Chassis, Dynamic Island */}
            <div className={`relative my-auto w-[min(430px,94vw)] h-[min(910px,calc(100vh-84px))] max-h-[932px] aspect-[430/932] ${
              darkMode ? 'bg-[#181B22]' : 'bg-[#1C1B1F]'
            } rounded-[54px] p-2.5 sm:p-3 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] ring-1 ring-slate-600/50 flex flex-col overflow-hidden shrink-0`}>
              {/* Screen Body */}
              <div className={`relative w-full h-full ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'} rounded-[46px] overflow-hidden flex flex-col shadow-inner`}>
                {/* iOS 17/18 Status Bar with Dynamic Island */}
                <div className={`sticky top-0 z-40 ${darkMode ? 'bg-slate-900/95 border-slate-800' : 'bg-white/95 border-slate-100'} backdrop-blur-md px-6 pt-3 pb-2 flex items-center justify-between text-xs font-semibold select-none border-b shrink-0`}>
                  <span className="font-black tracking-tight text-[13px] pl-1">9:41</span>

                  {/* Dynamic Island */}
                  <div
                    className={`transition-all duration-300 ${
                      isNavigating
                        ? 'w-[185px] h-[34px] px-3 bg-black text-white'
                        : hasActiveTickets
                        ? 'w-[155px] h-[33px] px-3 bg-black text-white'
                        : 'w-[124px] h-[33px] px-3 bg-black'
                    } rounded-full flex items-center justify-between shadow-md relative overflow-hidden select-none`}
                  >
                    {isNavigating ? (
                      <div className="flex items-center justify-between w-full text-[11px] font-bold">
                        <div className="flex items-center gap-1 text-blue-400">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          <span className="text-[10px] text-white font-mono">78 км/г</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                          <span>320м</span>
                          <span>↗</span>
                        </div>
                      </div>
                    ) : hasActiveTickets ? (
                      <div className="flex items-center justify-between w-full text-[10px] font-bold text-white">
                        <div className="flex items-center gap-1 text-amber-400">
                          <span>🎟️</span>
                          <span className="text-[10px] text-slate-200">MarshPass</span>
                        </div>
                        <span className="text-emerald-400 font-mono text-[9px] animate-pulse">LIVE</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#0a0a0a] ring-1 ring-white/10" />
                        <div className="w-3 h-3 rounded-full bg-[#0d131f] flex items-center justify-center ring-1 ring-white/15">
                          <div className="w-1 h-1 rounded-full bg-blue-600/80" />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Status Cluster */}
                  <div className="flex items-center gap-1.5 pr-1">
                    <span className="text-[11px] font-black tracking-tighter">5G</span>
                    <div className={`w-5 h-2.5 border ${darkMode ? 'border-slate-100' : 'border-slate-900'} rounded-[3px] p-[1.5px] flex items-center relative`}>
                      <div className={`w-full h-full ${darkMode ? 'bg-slate-100' : 'bg-slate-900'} rounded-[1px]`} />
                      <div className={`w-0.5 h-1 ${darkMode ? 'bg-slate-100' : 'bg-slate-900'} rounded-r-xs absolute -right-[2.5px]`} />
                    </div>
                  </div>
                </div>

                {/* Viewport Content */}
                <div className={`flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                  {children}
                </div>

                {/* iOS Home Indicator Bar */}
                <div className={`sticky bottom-0 z-40 w-full h-5 ${darkMode ? 'bg-slate-900/90' : 'bg-white/90'} backdrop-blur-sm flex items-center justify-center pointer-events-none pb-1 shrink-0`}>
                  <div className={`w-36 h-1 ${darkMode ? 'bg-slate-600' : 'bg-slate-800/80'} rounded-full`} />
                </div>
              </div>
            </div>
          </div>
        )}

        {deviceMode === 'tablet' && (
          <div className="relative my-auto w-[min(880px,96vw)] h-[min(900px,calc(100vh-84px))] bg-[#232326] rounded-[40px] p-3 sm:p-4 shadow-2xl flex flex-col overflow-hidden shrink-0">
            <div className={`relative w-full h-full ${darkMode ? 'bg-slate-950' : 'bg-slate-100'} rounded-[30px] overflow-hidden flex flex-col shadow-inner`}>
              <div className="flex-1 overflow-y-auto">
                {desktopLayout || children}
              </div>
            </div>
          </div>
        )}

        {deviceMode === 'desktop' && (
          <div className="w-full h-full flex-1 flex flex-col overflow-y-auto">
            {desktopLayout || children}
          </div>
        )}
      </main>
    </div>
  );
};
