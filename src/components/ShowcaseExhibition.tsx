import React, { useState } from 'react';
import {
  Users,
  Bus,
  ShieldCheck,
  Leaf,
  Moon,
  Sun,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Maximize2,
  Sparkles,
} from 'lucide-react';
import { ScreenId, TransitRoute, MarshPassTicket, CarpoolRide } from '../types/marshgo';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { HomeScreen } from './screens/HomeScreen';
import { SearchScreen } from './screens/SearchScreen';
import { ResultsScreen } from './screens/ResultsScreen';
import { RouteDetailsScreen } from './screens/RouteDetailsScreen';
import { MarshPassScreen } from './screens/MarshPassScreen';
import { RideDetailsScreen } from './screens/RideDetailsScreen';
import { MOCK_TRANSIT_ROUTES, MOCK_CARPOOL_ANDRIY, INITIAL_MARSHPASS_TICKETS } from '../data/mockData';
import { triggerRatchetTick } from '../utils/haptics';

interface ShowcaseExhibitionProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onSelectScreenToInteract: (screen: ScreenId) => void;
}

export const ShowcaseExhibition: React.FC<ShowcaseExhibitionProps> = ({
  darkMode,
  onToggleDarkMode,
  onSelectScreenToInteract,
}) => {
  const [activeScreenIndex, setActiveScreenIndex] = useState<number | null>(null);

  const mockRoute = MOCK_TRANSIT_ROUTES[0];
  const mockRide = MOCK_CARPOOL_ANDRIY;
  const mockTicket = INITIAL_MARSHPASS_TICKETS[0];

  const showcaseScreens = [
    {
      id: 'screen-1',
      screenId: 'home' as ScreenId,
      number: '1',
      title: 'Головна (без поїздок)',
      subtitle: 'Швидкий доступ до основних можливостей',
      render: () => (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
          <Header currentCity="Львів" onCityChange={() => {}} onNavigate={() => {}} />
          <HomeScreen
            tickets={[]}
            onNavigate={onSelectScreenToInteract}
            onOpenPublish={() => onSelectScreenToInteract('home')}
            onSelectDestination={() => onSelectScreenToInteract('results')}
            onSelectTicket={() => onSelectScreenToInteract('marshpass')}
            forceState="empty"
          />
          <BottomNav activeScreen="home" onNavigate={onSelectScreenToInteract} onOpenPublish={() => {}} />
        </div>
      ),
    },
    {
      id: 'screen-2',
      screenId: 'home' as ScreenId,
      number: '2',
      title: 'Головна (з MarshPass)',
      subtitle: 'Квиток на приватну поїздку MarshPass',
      render: () => (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
          <Header currentCity="Львів" onCityChange={() => {}} onNavigate={() => {}} />
          <HomeScreen
            tickets={[mockTicket]}
            onNavigate={onSelectScreenToInteract}
            onOpenPublish={() => onSelectScreenToInteract('home')}
            onSelectDestination={() => onSelectScreenToInteract('results')}
            onSelectTicket={() => onSelectScreenToInteract('marshpass')}
            forceState="with-ticket"
          />
          <BottomNav activeScreen="home" onNavigate={onSelectScreenToInteract} onOpenPublish={() => {}} />
        </div>
      ),
    },
    {
      id: 'screen-3',
      screenId: 'search' as ScreenId,
      number: '3',
      title: 'Пошук маршруту',
      subtitle: 'Зручний пошук, вибір транспорту та дати',
      render: () => (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
          <SearchScreen
            onBack={() => onSelectScreenToInteract('home')}
            onSearchSubmit={() => onSelectScreenToInteract('results')}
          />
          <BottomNav activeScreen="search" onNavigate={onSelectScreenToInteract} onOpenPublish={() => {}} />
        </div>
      ),
    },
    {
      id: 'screen-4',
      screenId: 'results' as ScreenId,
      number: '4',
      title: 'Результати пошуку',
      subtitle: 'Пріоритет приватних попуток з MarshPass',
      render: () => (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
          <ResultsScreen
            routes={MOCK_TRANSIT_ROUTES}
            onBack={() => onSelectScreenToInteract('search')}
            onSelectRoute={() => onSelectScreenToInteract('route-details')}
            onOpenMap={() => onSelectScreenToInteract('route-map')}
          />
          <BottomNav activeScreen="search" onNavigate={onSelectScreenToInteract} onOpenPublish={() => {}} />
        </div>
      ),
    },
    {
      id: 'screen-5',
      screenId: 'route-map' as ScreenId,
      number: '5',
      title: 'Карта маршруту',
      subtitle: 'Візуальний маршрут подорожі з пересадками',
      render: () => (
        <div className="flex-1 flex flex-col h-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
          {/* Top Header matching Screenshot 5 */}
          <div className="p-3 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between z-10">
            <span className="text-xs font-black">Карта маршруту</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl text-[10px] font-bold">
              <span className="px-2 py-0.5 bg-blue-600 text-white rounded-lg">3D</span>
              <span className="px-2 py-0.5 text-slate-500">Супутник</span>
              <span className="px-2 py-0.5 text-slate-500">Транспорт</span>
            </div>
          </div>

          {/* Stylized Ukraine Route Vector Map */}
          <div className="flex-1 relative bg-gradient-to-b from-sky-50 via-slate-100 to-indigo-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-950 overflow-hidden flex items-center justify-center">
            {/* SVG stylized map of Ukraine route */}
            <svg viewBox="0 0 320 380" className="w-full h-full p-4 drop-shadow-md">
              {/* Regional outlines subtle */}
              <path
                d="M30,120 Q80,90 150,110 T280,120 Q290,200 240,260 T140,280 Q60,260 40,200 Z"
                fill={darkMode ? '#1E293B' : '#E2E8F0'}
                opacity="0.5"
              />

              {/* Connected Route Polyline */}
              <path
                d="M60,250 C90,210 130,220 160,170 C180,140 220,130 250,120"
                fill="none"
                stroke={darkMode ? '#3B82F6' : '#2563EB'}
                strokeWidth="5"
                strokeLinecap="round"
              />
              <path
                d="M160,170 C180,140 220,130 250,120"
                fill="none"
                stroke="#F59E0B"
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="6,4"
              />

              {/* Station 1: Lviv */}
              <circle cx="60" cy="250" r="14" fill="#2563EB" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="60" y="254" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">🚗</text>
              <text x="60" y="275" fill={darkMode ? '#F8FAFC' : '#0F172A'} fontSize="11" fontWeight="800" textAnchor="middle">Львів</text>

              {/* Intermediate cities */}
              <circle cx="105" cy="210" r="4" fill="#94A3B8" />
              <text x="105" y="200" fill="#64748B" fontSize="9" fontWeight="600" textAnchor="middle">Тернопіль</text>

              <circle cx="140" cy="235" r="4" fill="#94A3B8" />
              <text x="140" y="247" fill="#64748B" fontSize="9" fontWeight="600" textAnchor="middle">Вінниця</text>

              {/* Station 2: Zhytomyr */}
              <circle cx="160" cy="170" r="14" fill="#F59E0B" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="160" y="174" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">🚌</text>
              <text x="160" y="152" fill={darkMode ? '#F8FAFC' : '#0F172A'} fontSize="11" fontWeight="800" textAnchor="middle">Житомир</text>

              {/* Station 3: Metro to Kyiv */}
              <circle cx="215" cy="135" r="12" fill="#8B5CF6" stroke="#FFFFFF" strokeWidth="2" />
              <text x="215" y="139" fill="#FFFFFF" fontSize="9" fontWeight="900" textAnchor="middle">M</text>

              {/* Destination: Kyiv */}
              <circle cx="250" cy="120" r="15" fill="#EF4444" stroke="#FFFFFF" strokeWidth="2.5" />
              <text x="250" y="124" fill="#FFFFFF" fontSize="10" fontWeight="900" textAnchor="middle">📍</text>
              <text x="250" y="103" fill={darkMode ? '#F8FAFC' : '#0F172A'} fontSize="12" fontWeight="900" textAnchor="middle">Київ</text>
            </svg>

            {/* Map Controls */}
            <div className="absolute right-3 top-4 flex flex-col gap-1.5 z-10">
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-xs font-bold">
                🧭
              </div>
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-xs font-bold">
                +
              </div>
              <div className="w-7 h-7 rounded-lg bg-white dark:bg-slate-800 shadow-md flex items-center justify-center text-xs font-bold">
                −
              </div>
            </div>
          </div>

          {/* Bottom Card matching Screenshot 5 */}
          <div className="p-3.5 bg-white dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 space-y-2.5 z-10">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1">
                  <span>Попутка + Маршрутка + Метро</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                </span>
                <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                  6 год 40 хв • 2 пересадки
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  14:30 – 21:10
                </span>
                <span className="text-sm font-black text-blue-600">320 грн</span>
              </div>
            </div>

            <button
              onClick={() => onSelectScreenToInteract('route-details')}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Показати деталі</span>
              <span>→</span>
            </button>
          </div>
        </div>
      ),
    },
    {
      id: 'screen-6',
      screenId: 'route-details' as ScreenId,
      number: '6',
      title: 'Деталі маршруту',
      subtitle: 'Повна інформація про попутку та водія',
      render: () => (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
          <RouteDetailsScreen
            route={mockRoute}
            onBack={() => onSelectScreenToInteract('results')}
            onOpenRideDetails={() => onSelectScreenToInteract('ride-details')}
            onBookRoute={() => onSelectScreenToInteract('marshpass')}
          />
        </div>
      ),
    },
    {
      id: 'screen-7',
      screenId: 'marshpass' as ScreenId,
      number: '7',
      title: 'MarshPass',
      subtitle: 'Електронний квиток на приватну поїздку',
      render: () => (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
          <MarshPassScreen
            ticket={mockTicket}
            onBack={() => onSelectScreenToInteract('home')}
            onCancelTicket={() => {}}
            onNavigateToChat={() => onSelectScreenToInteract('messages')}
            initialViewMode="pass"
          />
        </div>
      ),
    },
    {
      id: 'screen-8',
      screenId: 'marshpass-details' as ScreenId,
      number: '8',
      title: 'Деталі MarshPass',
      subtitle: 'Усі деталі квитка та керування поїздкою',
      render: () => (
        <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-y-auto">
          <MarshPassScreen
            ticket={mockTicket}
            onBack={() => onSelectScreenToInteract('home')}
            onCancelTicket={() => {}}
            onNavigateToChat={() => onSelectScreenToInteract('messages')}
            initialViewMode="details"
          />
        </div>
      ),
    },
  ];

  return (
    <div className={`w-full min-h-screen ${darkMode ? 'bg-[#0B111E] text-white' : 'bg-[#F4F6F9] text-slate-900'} flex flex-col overflow-x-auto select-none transition-colors duration-200`}>
      {/* 1. TOP MARKETING BANNER - EXACT REPLICA OF THE PROMOTIONAL BANNER IN PHOTOS */}
      <section className="relative w-full overflow-hidden border-b border-slate-200/80 dark:border-slate-800 shadow-sm shrink-0">
        {/* Artistic Ukraine Scenic Background */}
        <div
          className={`absolute inset-0 ${
            darkMode
              ? 'bg-gradient-to-r from-[#0B1528] via-[#0F1E38] to-[#0A1424]'
              : 'bg-gradient-to-r from-sky-100 via-blue-50 to-indigo-100'
          }`}
        >
          {/* Subtle City Skyline Vector Silhouette */}
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <svg viewBox="0 0 1440 220" className="w-full h-full object-cover">
              {/* Rolling hills & bridges */}
              <path
                d="M0,180 Q300,120 600,160 T1200,140 Q1350,110 1440,160 L1440,220 L0,220 Z"
                fill={darkMode ? '#3B82F6' : '#0284C7'}
              />
              {/* Church domes and city towers */}
              <rect x="180" y="110" width="16" height="70" rx="3" fill="currentColor" />
              <path d="M188,85 Q180,105 188,110 Q196,105 188,85 Z" fill="#F59E0B" />
              <rect x="740" y="90" width="22" height="90" rx="3" fill="currentColor" />
              <path d="M751,60 Q740,85 751,90 Q762,85 751,60 Z" fill="#F59E0B" />
              {/* Train bridge */}
              <line x1="880" y1="140" x2="1350" y2="140" stroke="currentColor" strokeWidth="6" />
              <circle cx="950" cy="140" r="10" fill="currentColor" />
              <circle cx="1050" cy="140" r="10" fill="currentColor" />
              <circle cx="1150" cy="140" r="10" fill="currentColor" />
              <circle cx="1250" cy="140" r="10" fill="currentColor" />
            </svg>
          </div>
        </div>

        {/* Banner Content Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 md:py-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Zone: Brand Lockup */}
          <div className="flex flex-col items-start gap-1.5 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-3xl sm:text-4xl font-black italic tracking-tighter text-slate-900 dark:text-white drop-shadow-sm">
                MARSH<span className="text-blue-600">GO</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300">
              <span>Розумні поїздки</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span>Україна</span>
              <span className="text-base leading-none">🇺🇦</span>
            </div>
          </div>

          {/* Center Zone: Big Headline & Tagline */}
          <div className="text-center lg:text-left flex-1 max-w-2xl px-2">
            <h1 className="text-2xl sm:text-3xl lg:text-[34px] font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Більше можливостей для твоїх маршрутів
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 dark:text-slate-300 mt-1.5 max-w-xl">
              Попутники, міський транспорт, міжміські поїздки в одному додатку
            </p>
          </div>

          {/* Right Zone: 4 Circular Value Proposition Badges from Screenshots */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 shrink-0 flex-wrap">
            {/* Badge 1: Люди поруч */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Users className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                Люди<br />поруч
              </span>
            </div>

            {/* Badge 2: Весь транспорт */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <Bus className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                Весь<br />транспорт
              </span>
            </div>

            {/* Badge 3: Надійні подорожі */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                Надійні<br />подорожі
              </span>
            </div>

            {/* Badge 4: Чистіше міста */}
            <div className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Leaf className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                Чистіше<br />міста
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE 8 PHONES SHOWCASE RACK (Horizontal Side-by-Side Presentation) */}
      <main className="w-full flex-1 py-8 px-4 sm:px-6 flex flex-col items-center justify-start overflow-x-auto">
        <div className="flex items-start justify-start lg:justify-center gap-5 sm:gap-6 min-w-max pb-10">
          {showcaseScreens.map((item, index) => (
            <div
              key={item.id}
              className="flex flex-col items-center gap-3.5 group"
            >
              {/* iPhone 15 Pro Max Titanium Mockup Frame (430x932 aspect ratio scaled to 310px width) */}
              <div
                onClick={() => {
                  triggerRatchetTick('hour');
                  onSelectScreenToInteract(item.screenId);
                }}
                className={`relative w-[300px] sm:w-[315px] h-[645px] sm:h-[675px] rounded-[48px] p-2.5 shadow-2xl transition-all cursor-pointer ${
                  darkMode
                    ? 'bg-[#1D212A] ring-1 ring-slate-700/80 hover:ring-blue-500 hover:shadow-blue-500/20'
                    : 'bg-[#222428] ring-1 ring-slate-400/60 hover:ring-blue-500 hover:shadow-blue-500/20'
                } hover:scale-[1.015] active:scale-[0.99] flex flex-col overflow-hidden shrink-0`}
              >
                {/* Screen Chassis Inner */}
                <div className={`relative w-full h-full rounded-[40px] overflow-hidden flex flex-col ${
                  darkMode ? 'bg-slate-900 text-slate-100' : 'bg-slate-50 text-slate-900'
                }`}>
                  {/* Status Bar with Dynamic Island */}
                  <div className={`px-5 pt-2.5 pb-1 flex items-center justify-between text-[11px] font-bold select-none ${
                    darkMode ? 'bg-slate-900 text-slate-200' : 'bg-white text-slate-900'
                  } border-b border-black/5 shrink-0`}>
                    <span>9:41</span>
                    {/* Dynamic Island */}
                    <div className="w-[100px] h-[24px] rounded-full bg-black flex items-center justify-between px-2.5 shadow-sm">
                      <div className="w-2 h-2 rounded-full bg-black ring-1 ring-white/10" />
                      <div className="w-2.5 h-2.5 rounded-full bg-[#0d131f] flex items-center justify-center ring-1 ring-white/10">
                        <div className="w-1 h-1 rounded-full bg-blue-600" />
                      </div>
                    </div>
                    {/* Signal & Battery */}
                    <div className="flex items-center gap-1">
                      <span className="text-[9px]">5G</span>
                      <div className="w-4 h-2 border border-current rounded-xs p-[1px]">
                        <div className="w-full h-full bg-current rounded-xs" />
                      </div>
                    </div>
                  </div>

                  {/* Render Screen Viewport */}
                  <div className="flex-1 overflow-hidden flex flex-col relative pointer-events-auto">
                    {item.render()}
                  </div>

                  {/* Home Indicator */}
                  <div className={`h-4 w-full flex items-center justify-center pointer-events-none pb-0.5 shrink-0 ${
                    darkMode ? 'bg-slate-900' : 'bg-white'
                  }`}>
                    <div className={`w-28 h-1 rounded-full ${darkMode ? 'bg-slate-600' : 'bg-slate-800'}`} />
                  </div>
                </div>

                {/* Floating "Відкрити" hover indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity z-30">
                  <span className="p-1.5 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Numbered Caption Card Below Each Phone - EXACT TEXT FROM PHOTOS */}
              <div className="w-[300px] sm:w-[315px] text-center px-1">
                <div className="text-xs sm:text-[13px] font-extrabold text-slate-900 dark:text-white flex items-center justify-center gap-1">
                  <span>{item.number}. {item.title}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 leading-snug">
                  {item.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};
