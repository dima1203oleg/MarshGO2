import React, { useState } from 'react';
import {
  Navigation,
  Map,
  Search,
  Plus,
  Ticket,
  User,
  MessageSquare,
  Bell,
  MapPin,
  ChevronDown,
  ChevronRight,
  Car,
  Bus,
  Train,
  Check,
  Phone,
  Moon,
  Sun,
  Maximize2,
  Wallet,
  Share2,
  Calendar,
  Clock,
  Radio,
  Play,
  RotateCw,
  X,
  ShieldCheck,
  Star,
  Send,
  Sliders,
  ExternalLink,
  Info,
  CheckCircle2,
  AlertTriangle,
  Volume2,
} from 'lucide-react';
import {
  ScreenId,
  TransitRoute,
  CarpoolRide,
  MarshPassTicket,
  TransportType,
} from '../types/marshgo';
import {
  TRANSPORT_CATEGORIES,
  POPULAR_DESTINATIONS,
  CURRENT_USER,
  MOCK_CARPOOL_ANDRIY,
} from '../data/mockData';
import { QRCodeSvg } from './QRCodeSvg';
import { RouteMapScreen } from './screens/RouteMapScreen';
import { IOSDateTimePickerModal } from './IOSDateTimePickerModal';
import { triggerRatchetTick } from '../utils/haptics';

interface DesktopTabletLayoutProps {
  currentCity: string;
  onCityChange: (city: string) => void;
  routes: TransitRoute[];
  selectedRoute: TransitRoute;
  onSelectRoute: (route: TransitRoute) => void;
  tickets: MarshPassTicket[];
  selectedTicket: MarshPassTicket;
  onSelectTicket: (ticket: MarshPassTicket) => void;
  activeRide: CarpoolRide;
  onBookRoute: () => void;
  onBookSeat: (ride: CarpoolRide) => void;
  onCancelTicket: (ticketId: string) => void;
  onOpenPublish: () => void;
  onNavigateToChat: () => void;
  onNavigateToProfile: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onShowToast: (message: string) => void;
}

export const DesktopTabletLayout: React.FC<DesktopTabletLayoutProps> = ({
  currentCity,
  onCityChange,
  routes,
  selectedRoute,
  onSelectRoute,
  tickets,
  selectedTicket,
  onSelectTicket,
  activeRide,
  onBookRoute,
  onBookSeat,
  onCancelTicket,
  onOpenPublish,
  onNavigateToChat,
  onNavigateToProfile,
  darkMode,
  onToggleDarkMode,
  onShowToast,
}) => {
  const [activeTab, setActiveTab] = useState<'routes' | 'carpool' | 'tickets'>('routes');
  const [filterType, setFilterType] = useState<'optimal' | 'cheapest' | 'fastest'>('optimal');
  const [selectedModes, setSelectedModes] = useState<TransportType[]>(
    TRANSPORT_CATEGORIES.map((c) => c.id)
  );

  const [origin, setOrigin] = useState(`${currentCity}, вул. Стрийська, 45`);
  const [destination, setDestination] = useState('Київ, вул. Хрещатик, 1');
  const [date, setDate] = useState('Сьогодні, 30 жовтня');
  const [time, setTime] = useState('18:30');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [isLiveNavigating, setIsLiveNavigating] = useState(false);

  // In-place modals for Desktop Experience
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      id: 'm1',
      sender: 'driver',
      text: 'Доброго дня! Я водій Андрій, чекатиму на вул. Стрийська, 45 (АЗС WOG). Skoda Octavia AA 1254 AB.',
      time: '14:15',
    },
    {
      id: 'm2',
      sender: 'user',
      text: 'Вітаю! Буду рівно о 14:30. У мене один невеликий рюкзак.',
      time: '14:18',
    },
  ]);

  const cities = ['Львів', 'Київ', 'Тернопіль', 'Житомир', 'Івано-Франківськ', 'Одеса', 'Рівне', 'Вінниця'];

  const sortedRoutes = [...routes].sort((a, b) => {
    if (filterType === 'cheapest') return a.totalCostUah - b.totalCostUah;
    if (filterType === 'fastest') return a.id === 'route-fast-4' ? -1 : 1;
    return 0;
  });

  const toggleMode = (id: TransportType) => {
    triggerRatchetTick('minute');
    if (selectedModes.includes(id)) {
      if (selectedModes.length > 1) setSelectedModes(selectedModes.filter((m) => m !== id));
    } else {
      setSelectedModes([...selectedModes, id]);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const newMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, newMsg]);
    setChatInput('');
    triggerRatchetTick('minute');
    setTimeout(() => {
      setChatMessages((prev) => [
        ...prev,
        {
          id: `msg-rep-${Date.now()}`,
          sender: 'driver',
          text: 'Дякую, прийняв! До зустрічі біля авто.',
          time: new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className={`min-h-screen w-full flex flex-col ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-100 text-slate-900'} transition-colors duration-150`}>
      {/* 1. DESKTOP & TABLET TOP NAVIGATION BAR */}
      <header className={`w-full sticky top-0 z-40 border-b backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4 md:gap-8 ${
        darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'
      }`}>
        {/* Zone 1: Brand Wordmark + City Selector */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('routes')}
            className="flex items-center gap-2 group text-left"
          >
            <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
              MARSH<span className="text-blue-600">GO</span>
            </span>
          </button>

          {/* City selector dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCityDropdownOpen(!isCityDropdownOpen)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                darkMode
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{currentCity}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isCityDropdownOpen && (
              <div className={`absolute top-full left-0 mt-2 w-48 rounded-2xl shadow-2xl border py-1.5 z-50 ${
                darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'
              }`}>
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      onCityChange(city);
                      setOrigin(`${city}, Центральний вокзал`);
                      setIsCityDropdownOpen(false);
                      triggerRatchetTick('date');
                      onShowToast(`Місто змінено на ${city}`);
                    }}
                    className={`w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-blue-50/50 dark:hover:bg-slate-700/50 transition-colors ${
                      city === currentCity ? 'text-blue-600 font-bold bg-blue-50/20' : ''
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

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('routes')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'routes' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Мультимодальні Маршрути</span>
          </button>

          <button
            onClick={() => setActiveTab('carpool')}
            className={`whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'carpool' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Car className="w-3.5 h-3.5 text-blue-500" />
            <span>Попутки та Водії</span>
          </button>

          <button
            onClick={() => setActiveTab('tickets')}
            className={`whitespace-nowrap flex items-center gap-1.5 transition-colors ${
              activeTab === 'tickets' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Ticket className="w-3.5 h-3.5 text-amber-500" />
            <span>Квитки MarshPass</span>
            {tickets.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px]">
                {tickets.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setIsChatModalOpen(true)}
            className="whitespace-nowrap text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Чат з водієм</span>
          </button>

          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="whitespace-nowrap text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors flex items-center gap-1"
          >
            <User className="w-3.5 h-3.5" />
            <span>Профіль</span>
          </button>
        </nav>

        {/* Zone 3: Actions Cluster */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            onClick={onToggleDarkMode}
            className={`p-2 rounded-xl border transition-colors ${
              darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
            title="Перемкнути темну тему"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onOpenPublish}
            className="py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Опублікувати поїздку</span>
            <span className="sm:hidden">Публікація</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN 2-COLUMN WORKSPACE (Responsive Tablet & Desktop) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden max-w-[1680px] w-full mx-auto p-3 sm:p-5 md:p-6 gap-4 sm:gap-6">
        {/* LEFT PANE: Search, 12 Modes, Route Cards, and Tickets */}
        <div className="w-full lg:w-[480px] xl:w-[530px] flex flex-col gap-4 overflow-y-auto shrink-0 pr-1">
          {/* Quick Search & Filters Card */}
          <div className={`p-4 rounded-3xl border shadow-sm space-y-3 ${
            darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Пошук та фільтрація поїздок
              </h2>
              {/* Tab selector */}
              <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-xl">
                <button
                  onClick={() => {
                    setActiveTab('routes');
                    triggerRatchetTick('minute');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'routes'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Маршрути
                </button>
                <button
                  onClick={() => {
                    setActiveTab('carpool');
                    triggerRatchetTick('minute');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'carpool'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Попутки
                </button>
                <button
                  onClick={() => {
                    setActiveTab('tickets');
                    triggerRatchetTick('minute');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'tickets'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Квитки ({tickets.length})
                </button>
              </div>
            </div>

            {/* Origin & Destination inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                <input
                  type="text"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  placeholder="Звідки"
                  className="w-full bg-transparent font-bold focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Куди"
                  className="w-full bg-transparent font-bold focus:outline-none"
                />
              </div>
            </div>

            {/* Date & Time with Ratchet */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  triggerRatchetTick('date');
                  setIsPickerOpen(true);
                }}
                className="flex-1 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-2 text-left hover:border-blue-300 transition-colors"
                title="Вибрати дату (колесо з тріскачкою)"
              >
                <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{date}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  triggerRatchetTick('hour');
                  setIsPickerOpen(true);
                }}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:border-blue-300 transition-colors font-mono"
                title="Вибрати час (колесо з тріскачкою)"
              >
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{time}</span>
              </button>
            </div>

            {/* 12 Transport Modes Bar */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
                <span>Види транспорту ({selectedModes.length}/12):</span>
                <button
                  onClick={() => {
                    triggerRatchetTick('date');
                    if (selectedModes.length === TRANSPORT_CATEGORIES.length) {
                      setSelectedModes(['carpool', 'bus', 'metro']);
                    } else {
                      setSelectedModes(TRANSPORT_CATEGORIES.map((c) => c.id));
                    }
                  }}
                  className="text-blue-600 hover:underline"
                >
                  {selectedModes.length === TRANSPORT_CATEGORIES.length ? 'Скинути' : 'Усі 12 ✓'}
                </button>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-6 gap-1.5">
                {TRANSPORT_CATEGORIES.map((cat) => {
                  const isSelected = selectedModes.includes(cat.id);
                  return (
                    <button
                      key={cat.id}
                      onClick={() => toggleMode(cat.id)}
                      className={`p-1.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isSelected
                          ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-400 text-blue-900 dark:text-blue-200 shadow-xs'
                          : 'bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-slate-400'
                      }`}
                      title={cat.name}
                    >
                      <span className="text-xs font-bold">{cat.name.slice(0, 3)}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* TAB 1: Multimodal Routes */}
          {activeTab === 'routes' && (
            <div className="space-y-3">
              {/* Filter tabs */}
              <div className="flex items-center gap-1 p-1 bg-slate-200/80 dark:bg-slate-800 rounded-2xl">
                <button
                  onClick={() => {
                    setFilterType('optimal');
                    triggerRatchetTick('minute');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    filterType === 'optimal'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Оптимальні
                </button>
                <button
                  onClick={() => {
                    setFilterType('cheapest');
                    triggerRatchetTick('minute');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    filterType === 'cheapest'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Найдешевші
                </button>
                <button
                  onClick={() => {
                    setFilterType('fastest');
                    triggerRatchetTick('minute');
                  }}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    filterType === 'fastest'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400'
                  }`}
                >
                  Найшвидші
                </button>
              </div>

              {/* List of route cards */}
              {sortedRoutes.map((route) => {
                const isSelected = route.id === selectedRoute.id;
                return (
                  <div
                    key={route.id}
                    onClick={() => {
                      onSelectRoute(route);
                      triggerRatchetTick('minute');
                    }}
                    className={`cursor-pointer p-4 rounded-3xl border transition-all ${
                      isSelected
                        ? 'bg-white dark:bg-slate-900 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                        : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-slate-900 dark:text-white">
                        {route.title}
                      </span>
                      <span className="text-base font-black text-blue-600">
                        {route.totalCostUah} грн
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {route.departureTime} – {route.arrivalTime}
                      </span>
                      <span>•</span>
                      <span>{route.durationFormatted}</span>
                      <span>•</span>
                      <span>{route.transfersCount} пересадки</span>
                    </div>

                    {/* Segment breakdown */}
                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {route.segments.filter((s) => s.type !== 'walk').map((s) => (
                        <div
                          key={s.id}
                          className="px-2 py-1 rounded-lg bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1 border border-slate-200 dark:border-slate-700"
                        >
                          {s.type === 'carpool' && <Car className="w-3.5 h-3.5 text-blue-500" />}
                          {s.type === 'bus' && <Bus className="w-3.5 h-3.5 text-amber-500" />}
                          {s.type === 'metro' && <span className="text-purple-500 font-black">M</span>}
                          {s.type === 'train' && <Train className="w-3.5 h-3.5 text-indigo-500" />}
                          <span>{s.costUah} грн</span>
                        </div>
                      ))}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRoute(route);
                          onBookRoute();
                          triggerRatchetTick('hour');
                        }}
                        className="ml-auto px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all active:scale-95 shadow-xs"
                      >
                        Забронювати
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: Carpool / Direct Poputka Rides */}
          {activeTab === 'carpool' && (
            <div className="space-y-3">
              <div className="p-3 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-900/40 text-xs text-blue-900 dark:text-blue-200 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Усі водії верифіковані через Дія.Підпис та мають підтверджені відгуки.</span>
              </div>

              {/* Driver 1: Andriy */}
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={MOCK_CARPOOL_ANDRIY.driverAvatar}
                      alt={MOCK_CARPOOL_ANDRIY.driverName}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-500"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          {MOCK_CARPOOL_ANDRIY.driverName}
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center text-amber-500 font-bold">
                          ★ {MOCK_CARPOOL_ANDRIY.driverRating}
                        </span>
                        <span>•</span>
                        <span>{MOCK_CARPOOL_ANDRIY.driverReviewsCount} відгуків</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-blue-600">
                      {MOCK_CARPOOL_ANDRIY.costPerSeatUah} грн
                    </div>
                    <span className="text-[11px] font-bold text-emerald-600">
                      {MOCK_CARPOOL_ANDRIY.availableSeats} місця вільні
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-blue-500" />
                    <span>{MOCK_CARPOOL_ANDRIY.carModel} • {MOCK_CARPOOL_ANDRIY.carPlate}</span>
                  </div>
                  <div className="text-slate-500">
                    Виїзд: {MOCK_CARPOOL_ANDRIY.departureDate} о {MOCK_CARPOOL_ANDRIY.departureTime} з {MOCK_CARPOOL_ANDRIY.fromAddress}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setIsChatModalOpen(true);
                      triggerRatchetTick('minute');
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Написати</span>
                  </button>
                  <button
                    onClick={() => {
                      onBookSeat(MOCK_CARPOOL_ANDRIY);
                      triggerRatchetTick('hour');
                    }}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Забронювати місце</span>
                  </button>
                </div>
              </div>

              {/* Driver 2: Oksana */}
              <div className="p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-xl font-bold border-2 border-amber-400">
                      👩‍💼
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">
                          Оксана Шевченко
                        </span>
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center text-amber-500 font-bold">
                          ★ 4.98
                        </span>
                        <span>•</span>
                        <span>84 поїздки</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-base font-black text-blue-600">320 грн</div>
                    <span className="text-[11px] font-bold text-emerald-600">2 місця вільні</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs space-y-1">
                  <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-amber-500" />
                    <span>Volkswagen Passat B8 • BC 4490 EK</span>
                  </div>
                  <div className="text-slate-500">
                    Виїзд: Сьогодні о 16:00 з Львів, ТРЦ Victoria Gardens
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      setIsChatModalOpen(true);
                      triggerRatchetTick('minute');
                    }}
                    className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    <span>Написати</span>
                  </button>
                  <button
                    onClick={() => {
                      onBookSeat({
                        ...MOCK_CARPOOL_ANDRIY,
                        id: 'carpool-oksana',
                        driverName: 'Оксана Шевченко',
                        carModel: 'Volkswagen Passat B8',
                        carPlate: 'BC 4490 EK',
                        costPerSeatUah: 320,
                        availableSeats: 2,
                      });
                      triggerRatchetTick('hour');
                    }}
                    className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Забронювати місце</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MarshPass Tickets */}
          {activeTab === 'tickets' && (
            <div className="space-y-3">
              {tickets.length === 0 ? (
                <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
                  <Ticket className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-500">Немає збережених квитків</p>
                  <button
                    onClick={() => setActiveTab('routes')}
                    className="mt-3 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold"
                  >
                    Знайти поїздку
                  </button>
                </div>
              ) : (
                tickets.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      onSelectTicket(t);
                      setIsTicketModalOpen(true);
                      triggerRatchetTick('date');
                    }}
                    className="cursor-pointer p-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-300 transition-all space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-500">{t.date}</span>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 font-mono text-[10px] font-bold">
                        {t.bookingCode}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-extrabold">{t.fromCity} → {t.toCity}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{t.departureTime} – {t.arrivalTime}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-blue-600">{t.totalCostUah} грн</div>
                        <span className="text-[10px] font-bold text-emerald-600">Місце: {t.seatNumber}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center gap-2">
                        <QRCodeSvg value={t.qrPayload} size={42} className="p-0.5 shadow-none" />
                        <div className="text-xs">
                          <span className="font-bold block">{t.carModel}</span>
                          <span className="font-mono text-slate-400 text-[11px]">{t.carPlate}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectTicket(t);
                            setIsTicketModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 text-xs font-bold"
                        >
                          Деталі
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCancelTicket(t.id);
                            onShowToast(`Квиток ${t.bookingCode} скасовано.`);
                            triggerRatchetTick('minute');
                          }}
                          className="px-2.5 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 text-xs font-bold hover:bg-rose-100 transition-colors"
                        >
                          Скасувати
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* RIGHT PANE: Massive Leaflet Transit Map & Route Control */}
        <div className="flex-1 flex flex-col min-h-[500px] lg:min-h-[700px] rounded-3xl overflow-hidden border shadow-xl relative bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          {/* Desktop/Tablet Top Map Bar */}
          <div className="p-3.5 bg-slate-900/90 backdrop-blur-md text-white border-b border-slate-800 flex items-center justify-between flex-wrap gap-2.5 z-20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <div>
                <div className="text-xs font-black flex items-center gap-2">
                  <span>{selectedRoute.title}</span>
                  <span className="text-blue-400 font-mono font-black">{selectedRoute.totalCostUah} грн</span>
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedRoute.departureTime} – {selectedRoute.arrivalTime} ({selectedRoute.durationFormatted}) • {selectedRoute.transfersCount} пересадки
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  triggerRatchetTick('hour');
                  const nextState = !isLiveNavigating;
                  setIsLiveNavigating(nextState);
                  onShowToast(nextState ? 'GPS Навігацію запущено!' : 'Навігацію зупинено');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isLiveNavigating
                    ? 'bg-rose-600 hover:bg-rose-700 text-white animate-pulse'
                    : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{isLiveNavigating ? 'Зупинити GPS' : 'Старт GPS'}</span>
              </button>

              <button
                onClick={() => {
                  triggerRatchetTick('minute');
                  onShowToast('🔊 Звукова тріскачка & тактильний імпульс активовано!');
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 flex items-center gap-1.5"
                title="Перевірити звук тріскачки"
              >
                <Volume2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">Тріскачка</span>
              </button>

              <button
                onClick={() => {
                  onBookRoute();
                  triggerRatchetTick('hour');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
              >
                Забронювати
              </button>
            </div>
          </div>

          <div className="flex-1 relative">
            <RouteMapScreen
              route={selectedRoute}
              onBack={() => setIsLiveNavigating(false)}
              onShowDetails={() => {
                onBookRoute();
                triggerRatchetTick('hour');
              }}
              initialNavigating={isLiveNavigating}
            />
          </div>
        </div>
      </div>

      {/* MODAL 1: MarshPass Digital Ticket Inspection */}
      {isTicketModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                Квиток MarshPass #{selectedTicket.bookingCode}
              </span>
              <button
                onClick={() => setIsTicketModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col items-center text-center py-2">
              <QRCodeSvg value={selectedTicket.qrPayload} size={160} className="p-3 shadow-md" />
              <div className="mt-3 font-mono font-black text-lg text-slate-900 dark:text-white">
                {selectedTicket.bookingCode}
              </div>
              <span className="text-xs text-slate-500">Покажіть цей QR-код водію або контролеру</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Маршрут:</span>
                <span className="font-bold">{selectedTicket.fromCity} → {selectedTicket.toCity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Час виїзду:</span>
                <span className="font-bold">{selectedTicket.date}, {selectedTicket.departureTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Автомобіль:</span>
                <span className="font-bold">{selectedTicket.carModel} ({selectedTicket.carPlate})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Водій:</span>
                <span className="font-bold">{selectedTicket.driverName} ({selectedTicket.driverPhone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Місце:</span>
                <span className="font-bold text-emerald-600">{selectedTicket.seatNumber}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => {
                  onShowToast('Квиток успішно додано до Apple Wallet!');
                  triggerRatchetTick('minute');
                  setIsTicketModalOpen(false);
                }}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-black font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Wallet className="w-4 h-4" />
                <span>Apple Wallet</span>
              </button>
              <button
                onClick={() => {
                  onCancelTicket(selectedTicket.id);
                  onShowToast(`Квиток ${selectedTicket.bookingCode} скасовано.`);
                  triggerRatchetTick('hour');
                  setIsTicketModalOpen(false);
                }}
                className="py-2.5 px-4 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 text-xs font-bold hover:bg-rose-100"
              >
                Скасувати
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Desktop Chat with Driver */}
      {isChatModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full h-[520px] shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/80 dark:bg-slate-800/80">
              <div className="flex items-center gap-3">
                <img
                  src={MOCK_CARPOOL_ANDRIY.driverAvatar}
                  alt={MOCK_CARPOOL_ANDRIY.driverName}
                  className="w-10 h-10 rounded-xl object-cover border border-blue-500"
                />
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {MOCK_CARPOOL_ANDRIY.driverName}
                  </h4>
                  <span className="text-[11px] text-emerald-600 font-medium">Онлайн • Водій Skoda Octavia</span>
                </div>
              </div>
              <button
                onClick={() => setIsChatModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/50">
              {chatMessages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium leading-relaxed ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 px-1">{m.time}</span>
                </div>
              ))}
            </div>

            {/* Quick replies */}
            <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-white dark:bg-slate-900">
              {['Я на місці 📍', 'Де ви зараз?', 'Затримаюсь на 5 хв'].map((chip) => (
                <button
                  key={chip}
                  onClick={() => {
                    setChatInput(chip);
                    triggerRatchetTick('minute');
                  }}
                  className="px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-blue-50 transition-colors whitespace-nowrap"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 bg-white dark:bg-slate-900">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Повідомлення водію..."
                className="flex-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: User Profile & Security */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-xs font-black uppercase text-blue-600 tracking-wider">
                Мій профіль MARSHGO
              </span>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={CURRENT_USER.avatar}
                alt={CURRENT_USER.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-blue-500"
              />
              <div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  {CURRENT_USER.name}
                </h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                  <span className="text-amber-500 font-bold">★ {CURRENT_USER.rating}</span>
                  <span>•</span>
                  <span>{CURRENT_USER.completedRides} завершених поїздок</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Верифіковано в Дія 🇺🇦</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Телефон:</span>
                <span className="font-bold">{CURRENT_USER.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Автомобіль:</span>
                <span className="font-bold">
                  {CURRENT_USER.car ? `${CURRENT_USER.car.model} (${CURRENT_USER.car.plate})` : 'Не вказано'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Мова інтерфейсу:</span>
                <span className="font-bold">Українська 🇺🇦</span>
              </div>
            </div>

            <button
              onClick={() => {
                onShowToast('Дані профілю синхронізовано!');
                triggerRatchetTick('minute');
                setIsProfileModalOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors"
            >
              Закрити профіль
            </button>
          </div>
        </div>
      )}

      {/* iOS Wheel Date Picker Modal */}
      <IOSDateTimePickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        initialDate={date}
        initialTime={time}
        onApply={(newDate, newTime) => {
          setDate(newDate);
          setTime(newTime);
          onShowToast(`Час поїздки оновлено: ${newDate}, ${newTime}`);
        }}
      />
    </div>
  );
};
