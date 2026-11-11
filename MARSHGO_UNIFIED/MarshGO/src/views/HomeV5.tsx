import React from 'react';
import {
  ArrowRight,
  BusFront,
  CirclePlus,
  MapPin,
  Navigation,
  QrCode,
  Search,
  Ticket,
} from 'lucide-react';

export interface HomeTrip {
  id: string;
  kind: 'booking' | 'journey';
  origin_name: string;
  destination_name: string;
  departure_at: string;
  status: string;
  priceLabel?: string;
  currentUserIsDriver?: boolean;
  driverName?: string;
  seatCount?: number;
}

export interface HomeV5Props {
  onStartNavigation: () => void;
  onSearchTrip: () => void;
  onPlanTrip: () => void;
  onOpenMap?: () => void;
  onSearchDestination?: (destination: string) => void;
  trips?: HomeTrip[];
  onOpenTrip?: (trip: HomeTrip) => void;
}

const homeActions = [
  { title: 'Навігація', description: 'Побудувати маршрут', icon: Navigation, action: 'navigation' },
  { title: 'Опублікувати поїздку', description: 'Попутка / маршрут', icon: CirclePlus, action: 'publish' },
  { title: 'Карта транспорту', description: 'Зупинки, лінії, рух', icon: BusFront, action: 'map' },
  { title: 'Знайти маршрут', description: 'Усі види транспорту', icon: Search, action: 'search' },
] as const;

const popularRoutes: ReadonlyArray<{ destination: string; image: string }> = [
  { destination: 'Київ', image: '/images/welcome-kyiv-v1.jpg' },
  { destination: 'Рівне', image: '/images/welcome-road.jpg' },
  { destination: 'Тернопіль', image: '/images/lviv_stop_banner.jpg' },
] as const;

function formatDeparture(value: string): string {
  const departure = new Date(value);
  if (!Number.isFinite(departure.getTime())) return 'Час не вказано';
  return new Intl.DateTimeFormat('uk-UA', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Kyiv',
  }).format(departure);
}

function MarshPassBarcode({ value }: { value: string }) {
  const bars = value.split('').map((_, i) => i % 2 === 0);
  return (
    <div className="flex h-6 gap-[1px] px-2 py-1">
      {bars.map((isWide, i) => (
        <div
          key={i}
          className={`bg-white ${isWide ? 'w-1.5' : 'w-0.5'} rounded-sm`}
          style={{ height: '24px' }}
        />
      ))}
    </div>
  );
}

export const HomeV5: React.FC<HomeV5Props> = ({
  onStartNavigation,
  onSearchTrip,
  onPlanTrip,
  onOpenMap,
  onSearchDestination,
  trips = [],
  onOpenTrip,
}) => {
  const marshPasses = trips.filter((trip) => trip.kind === 'booking'
    && !trip.currentUserIsDriver
    && ['confirmed', 'boarding', 'in_progress'].includes(trip.status));
  const activePass = marshPasses[0];

  const runAction = (action: (typeof homeActions)[number]['action']) => {
    if (action === 'search') onSearchTrip();
    if (action === 'publish') onPlanTrip();
    if (action === 'navigation') onStartNavigation();
    if (action === 'map') (onOpenMap ?? onStartNavigation)();
  };

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col px-4 pb-4 pt-4 transition-colors duration-200 min-h-[100svh] bg-[#0B1730]">
      {/* Header */}
      <header className="flex items-center justify-between mb-6 px-1">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/30">
            <Ticket size={20} className="text-white" />
          </div>
          <span className="text-[18px] font-black tracking-tight text-white">MARSHGO</span>
        </div>
        <button type="button" className="flex items-center gap-2 rounded-full bg-[#101E38] px-3 py-1.5 text-xs font-bold text-slate-200 border border-slate-700/50">
          <MapPin size={14} className="text-blue-400" /> Chernivsi
          <ArrowRight size={12} className="text-slate-400" />
        </button>
        <div className="flex items-center gap-3">
          <button type="button" className="h-10 w-10 rounded-full bg-[#101E38] flex items-center justify-center text-slate-300 hover:text-white border border-slate-700/50">
            <span className="relative"> <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-[#0B1730]" /> <span className="text-[18px]">💬</span> </span>
          </button>
          <button type="button" className="h-10 w-10 rounded-full bg-[#101E38] flex items-center justify-center text-slate-300 hover:text-white border border-slate-700/50">
            <span className="relative"> <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 border-2 border-[#0B1730]" /> <span className="text-[18px]">🔔</span> </span>
          </button>
        </div>
      </header>

      {/* MARSH PASS Card */}
      <section className="mb-6 relative overflow-hidden rounded-[24px] bg-gradient-to-br from-blue-900/80 via-blue-950/90 to-[#0B1730] border border-blue-500/20 shadow-2xl shadow-blue-900/20 p-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cmFkaWFsR3JhZGllbnQgaWQ9ImEiIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjUwJSI+PHN0b3Agb2Zmc2V0PSIwIiBzdG9wLWNvbG9yPSIjMDA3MEZGIiBzdG9wLW9wYWNpdHk9IjAuMDUiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiMwMDcwRkYiIHN0b3Atb3BhY2l0eT0iMCIvPjwvcmFkaWFsR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkvPjwvc3ZnPg=='] opacity-30 pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-white/20 flex items-center justify-center border border-white/30">
                <Ticket size={16} className="text-blue-300" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-blue-300/80 font-semibold">MARSH PASS</p>
                <p className="text-[28px] font-extrabold text-white leading-tight">Твій шлях.<br/>Один квиток.</p>
              </div>
            </div>
            <div className="w-20 h-14 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center p-1">
              <QrCode size={64} className="text-white" />
            </div>
          </div>
          <div className="mt-2 pt-3 border-t border-white/20">
            <p className="text-[11px] font-semibold text-slate-300 mb-3">Увесь міський і міжміський транспорт в одному квитку.</p>
            <MarshPassBarcode value="MARSHGO-2026-0001" />
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6" aria-label="Швидкі дії">
        {homeActions.map(({ title, description, icon: Icon, action }) => (
          <button
            key={action}
            type="button"
            onClick={() => runAction(action)}
            className={`flex min-h-[100px] flex-col items-center justify-center gap-2 overflow-hidden rounded-[20px] border border-white/10 bg-[#101E38]/50 p-3 text-center transition-all duration-200 active:scale-[0.98] backdrop-blur-sm`}
          >
            <div className="h-11 w-11 rounded-xl bg-blue-600/20 flex items-center justify-center text-blue-400 border border-blue-500/30 shadow-lg shadow-blue-600/20">
              <Icon size={24} strokeWidth={2.5} />
            </div>
            <span className="min-w-0">
              <span className="block text-[15px] font-bold text-white leading-tight">{title}</span>
              <span className="mt-0.5 block text-[11px] font-medium text-slate-400 leading-snug">{description}</span>
            </span>
          </button>
        ))}
      </div>

      {/* Popular Routes */}
      <section className="mb-8" aria-labelledby="home-routes-title">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 id="home-routes-title" className="text-sm font-black text-white">Популярні напрямки</h2>
          <button type="button" onClick={onSearchTrip} className="text-[11px] font-bold text-blue-400">Показати всі <ArrowRight className="inline" size={12}/></button>
        </div>
        <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2">
          {popularRoutes.map(({ destination, image }) => (
            <button
              key={destination}
              type="button"
              onClick={() => onSearchDestination?.(destination)}
              className="relative h-[112px] min-w-[120px] flex-1 overflow-hidden rounded-[20px] border border-white/10 bg-[#101E38]/30 transition-all duration-200 active:scale-[0.98] backdrop-blur-sm"
            >
              <img src={image} alt={destination} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
              <span className="absolute inset-0 bg-gradient-to-t from-[#0B1730]/90 via-[#0B1730]/30 to-transparent" />
              <span className="absolute inset-x-3 bottom-3 flex items-end justify-between gap-1 text-[12px] font-extrabold leading-tight text-white">Львів → {destination}<ArrowRight size={14} className="shrink-0" /></span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
};
