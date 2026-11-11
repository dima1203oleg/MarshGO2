import React from 'react';
import {
  ArrowLeft,
  SlidersHorizontal,
  ChevronRight,
  Heart,
  Scale,
  Timer,
  Coins,
  Footprints,
  Bus,
  TramFront,
  Train,
  MapPin,
  CarFront,
  Bike,
  Zap,
  Loader2,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import type { RouteLegItem, RouteSearchResultItem, SearchStrategyMode } from '../model/types';
import { journeySegmentColor } from '../../../domain/transportVisuals';

function formatClock(value: string): string {
  const clock = value.match(/(?:T|\s)(\d{1,2}:\d{2})/);
  if (clock) return clock[1];
  return value.match(/^\d{1,2}:\d{2}$/)?.[0] ?? '—';
}

function formatLegPrice(leg: RouteLegItem): string | null {
  const label = leg.priceLabel?.trim();
  if (label && !/не надан|не вказан|невідом|unknown/i.test(label)) {
    return label.replace(' UAH', ' грн').replace(' ₴', ' грн');
  }
  if (leg.mode !== 'walk' && leg.priceMinor != null && Number.isFinite(leg.priceMinor)) {
    return new Intl.NumberFormat('uk-UA', {
      style: 'currency', currency: 'UAH', maximumFractionDigits: 0,
    }).format(leg.priceMinor / 100);
  }
  return null;
}

function transferLabel(count: number): string {
  const remainder100 = count % 100;
  const remainder10 = count % 10;
  if (remainder100 >= 11 && remainder100 <= 14) return `${count} пересадок`;
  if (remainder10 === 1) return `${count} пересадка`;
  if (remainder10 >= 2 && remainder10 <= 4) return `${count} пересадки`;
  return `${count} пересадок`;
}

function segmentIcon(mode: string) {
  const LegIcon = mode === 'walk' ? Footprints
    : mode === 'tram' || mode === 'trolleybus' ? TramFront
      : mode === 'metro' || mode === 'train' || mode === 'suburban_train' ? Train
        : mode === 'carpool' || mode === 'taxi' || mode === 'carsharing' || mode === 'transfer' ? CarFront
          : mode === 'bike' ? Bike
            : mode === 'scooter' ? Zap : Bus;
  return <LegIcon size={13} aria-hidden="true"/>;
}

function routeTitle(item: RouteSearchResultItem): string {
  const labels = (item.legs ?? [])
    .filter((leg) => leg.mode !== 'walk')
    .map((leg) => leg.modeLabel)
    .filter((label, index, all) => Boolean(label) && all.indexOf(label) === index);
  return labels.join(' + ') || item.modeLabel;
}

interface SearchResultsListProps {
  originTitle: string;
  destTitle: string;
  dateStr: string;
  timeStr: string;
  passengers: number;
  isLoading: boolean;
  error: string | null;
  notice?: string | null;
  onRetry: () => void;
  items: RouteSearchResultItem[];
  selectedStrategy?: SearchStrategyMode;
  availableStrategies?: SearchStrategyMode[];
  onSelectStrategy?: (strategy: SearchStrategyMode) => void;
  onOpenFiltersModal: () => void;
  onSelectResultItem: (item: RouteSearchResultItem) => void;
  onBackToSearchForm: () => void;
  onOpenReverseMarketplace?: () => void;
}

export const SearchResultsList: React.FC<SearchResultsListProps> = ({
  originTitle,
  destTitle,
  dateStr,
  timeStr,
  passengers,
  isLoading,
  error,
  notice,
  onRetry,
  items,
  selectedStrategy = 'BALANCED',
  availableStrategies,
  onSelectStrategy,
  onOpenFiltersModal,
  onSelectResultItem,
  onBackToSearchForm,
  onOpenReverseMarketplace,
}) => {
  const activeStrategy = selectedStrategy;
  const [savedJourneyIds, setSavedJourneyIds] = React.useState<string[]>(() => {
    try {
      const value = typeof window === 'undefined' ? null : window.localStorage.getItem('mg_saved_journeys');
      const parsed: unknown = value ? JSON.parse(value) : [];
      return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
    } catch {
      return [];
    }
  });
  const [scrolledSegments, setScrolledSegments] = React.useState<Record<string, boolean>>({});
  const [overflowingSegments, setOverflowingSegments] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    const updateOverflow = () => {
      const next: Record<string, boolean> = {};
      document.querySelectorAll<HTMLElement>('[data-testid="journey-result-segments"]').forEach((scroller) => {
        const card = scroller.closest<HTMLElement>('[data-journey-id]');
        const journeyId = card?.dataset.journeyId;
        if (journeyId) next[journeyId] = scroller.scrollWidth > scroller.clientWidth + 1;
      });
      setOverflowingSegments((current) => {
        const keys = new Set([...Object.keys(current), ...Object.keys(next)]);
        for (const key of keys) if (current[key] !== next[key]) return next;
        return current;
      });
    };

    updateOverflow();
    const animationFrame = window.requestAnimationFrame(updateOverflow);
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(updateOverflow);
    document.querySelectorAll<HTMLElement>('[data-testid="journey-result-segments"]').forEach((scroller) => observer?.observe(scroller));
    window.addEventListener('resize', updateOverflow);
    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer?.disconnect();
      window.removeEventListener('resize', updateOverflow);
    };
  }, [items]);

  const cleanOrigin = originTitle.split(',')[0].trim() || 'Малого Голоска';
  const cleanDest = destTitle.split(',')[0].trim() || 'вул. Сихівська';
  const displayDate = (() => {
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) return 'Дата не вказана';
    return new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'long', timeZone: 'UTC' })
      .format(new Date(Date.UTC(year, month - 1, day)));
  })();

  const handleStrategyChange = (st: SearchStrategyMode) => {
    if (onSelectStrategy) {
      onSelectStrategy(st);
    }
  };

  const toggleSavedJourney = (journeyId: string) => {
    setSavedJourneyIds((current) => {
      const next = current.includes(journeyId)
        ? current.filter((id) => id !== journeyId)
        : [...current, journeyId];
      try {
        window.localStorage.setItem('mg_saved_journeys', JSON.stringify(next));
      } catch {
        // Saving is best-effort when browser storage is unavailable or full.
      }
      return next;
    });
  };

  const strategyPresentation = activeStrategy === 'FASTEST'
    ? { label: 'Найшвидший', Icon: Timer }
    : activeStrategy === 'CHEAPEST'
      ? { label: 'Найдешевший', Icon: Coins }
      : { label: 'Оптимальний', Icon: Scale };

  return (
    <div role="region" aria-label="Результати мультимодального пошуку" className="search-results-screen mx-auto flex min-h-[100svh] w-full max-w-3xl flex-col overflow-x-hidden bg-[#F4F8FD] text-[#0B1730] dark:bg-[#070E1B] pb-20">
      {/* Canonical results header */}
      <header className="journey-results-header sticky top-0 z-30 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-white/95 dark:bg-[#0B1730]/95 backdrop-blur-md px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))]">
        <button
          type="button"
          onClick={onBackToSearchForm}
          aria-label="Назад до пошуку"
          className="grid h-11 w-11 place-items-center rounded-full text-slate-700 dark:text-slate-200 transition active:scale-95"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="min-w-0 flex-1 text-center">
          <h1 className="truncate text-sm font-extrabold text-[#0B1730] dark:text-white">Результати пошуку</h1>
          <p className="truncate text-[10px] font-semibold text-slate-500 dark:text-slate-400" title={`${originTitle} → ${destTitle}`}>{cleanOrigin} → {cleanDest}</p>
          <p className="sr-only">{originTitle} → {destTitle} · {displayDate} · {timeStr || 'Час не вказано'} · {passengers} {passengers === 1 ? 'пасажир' : 'пасажири'}</p>
        </div>

        <button
          type="button"
          onClick={onOpenFiltersModal}
          aria-label="Фільтри"
          className="grid h-11 w-11 place-items-center rounded-full text-slate-700 dark:text-slate-200 transition active:scale-95"
        >
          <SlidersHorizontal size={18} />
        </button>
      </header>

      {/* Main Content */}
      <div className="search-results-content mx-auto w-full max-w-2xl flex-1 space-y-3 px-4 pt-3">
        {/* Sort tabs from the MarshGO2 reference */}
        <div role="group" aria-label="Режим пошуку маршрутів" className="flex items-center gap-2">
          <button
            type="button"
            aria-pressed={activeStrategy === 'BALANCED'}
            onClick={() => handleStrategyChange('BALANCED')}
            disabled={isLoading || (availableStrategies != null && !availableStrategies.includes('BALANCED'))}
            title={availableStrategies != null && !availableStrategies.includes('BALANCED') ? 'Для цього пошуку немає повного маршруту з перевіреними даними' : undefined}
            className={`min-h-10 flex-1 rounded-2xl px-2 py-2 text-xs font-black transition ${
              activeStrategy === 'BALANCED'
                ? 'bg-[#007AFF] text-white shadow-xs'
                : 'bg-white dark:bg-[#101E38] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            Оптимальний
          </button>
          <button
            type="button"
            aria-pressed={activeStrategy === 'FASTEST'}
            onClick={() => handleStrategyChange('FASTEST')}
            disabled={isLoading || (availableStrategies != null && !availableStrategies.includes('FASTEST'))}
            title={availableStrategies != null && !availableStrategies.includes('FASTEST') ? 'Для цього пошуку немає маршруту з перевіреним часом у дорозі' : undefined}
            className={`min-h-10 flex-1 rounded-2xl px-2 py-2 text-xs font-black transition ${
              activeStrategy === 'FASTEST'
                ? 'bg-[#007AFF] text-white shadow-xs'
                : 'bg-white dark:bg-[#101E38] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            Найшвидший
          </button>
          <button
            type="button"
            aria-pressed={activeStrategy === 'CHEAPEST'}
            onClick={() => handleStrategyChange('CHEAPEST')}
            disabled={isLoading || (availableStrategies != null && !availableStrategies.includes('CHEAPEST'))}
            title={availableStrategies != null && !availableStrategies.includes('CHEAPEST') ? 'Немає підтверджених тарифів, щоб порівняти вартість' : undefined}
            className={`min-h-10 flex-1 rounded-2xl px-2 py-2 text-xs font-black transition ${
              activeStrategy === 'CHEAPEST'
                ? 'bg-[#007AFF] text-white shadow-xs'
                : 'bg-white dark:bg-[#101E38] text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-800 hover:bg-slate-50'
            }`}
          >
            Найдешевший
          </button>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Loader2 size={36} className="animate-spin text-[#007AFF]" />
            <p className="mt-4 text-sm font-extrabold text-[#0B1730] dark:text-white">
              Шукаємо найкращі маршрути…
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Аналізуємо громадський транспорт та пересадки
            </p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="rounded-3xl bg-rose-50 dark:bg-rose-950/40 p-5 text-center border border-rose-200/80 dark:border-rose-900">
            <AlertCircle size={32} className="mx-auto text-rose-500 mb-2" />
            <p className="text-xs font-bold text-rose-700 dark:text-rose-300 mb-3">
              {error}
            </p>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#007AFF] px-4 py-2 text-xs font-black text-white shadow-sm"
            >
              <RefreshCw size={13} />
              <span>Спробувати знову</span>
            </button>
          </div>
        )}

        {notice && !isLoading && !error && (
          <details role="status" aria-live="polite" className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] leading-4 text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            <summary className="flex min-h-6 cursor-pointer list-none items-center gap-2 font-bold marker:content-none">
              <span className="shrink-0 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black dark:bg-amber-900/60">Частково</span>
              <span className="min-w-0 flex-1 truncate">{notice}</span>
              <ChevronRight size={14} className="shrink-0 text-amber-700 dark:text-amber-300" aria-hidden="true"/>
            </summary>
            <p className="mt-2 border-t border-amber-200 pt-2 dark:border-amber-800">{notice}</p>
          </details>
        )}

        {/* Itinerary Cards List matching Screen 2 */}
        {!isLoading && !error && (
        <div className="space-y-2 pt-1 sm:space-y-3">
            {items.map((realItem, itemIdx) => {
              const durationLabel = realItem.durationLabel || 'Час не вказано';
              const hasDistance = realItem.distanceMeters != null && realItem.distanceMeters > 0
                && realItem.distanceLabel && !/не надана|не вказана|невідом/i.test(realItem.distanceLabel);
              const itemPrice = realItem.priceLabel && !/не надан|не вказан|невідом|unknown/i.test(realItem.priceLabel)
                ? realItem.priceLabel.replace(' UAH', ' грн').replace(' ₴', ' грн')
                : null;
              const transitLegCount = realItem.legs?.filter((leg) => leg.mode !== 'walk').length ?? 1;
              const transfersCount = realItem.transfers ?? Math.max(0, transitLegCount - 1);
              const isFirst = itemIdx === 0;

              return (
                <article
                  key={realItem.id}
                  aria-label={`Відкрити маршрут: ${routeTitle(realItem)} · ${durationLabel} · ${itemPrice ?? 'ціна не надана'} · ${hasDistance ? realItem.distanceLabel : 'відстань не надана'} · ${transferLabel(transfersCount)}`}
                  data-testid="journey-result-card"
                  data-journey-id={realItem.id}
                  tabIndex={0}
                  onClick={() => onSelectResultItem(realItem)}
                  onKeyDown={(e) => {
                    if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                      e.preventDefault();
                      onSelectResultItem(realItem);
                    }
                  }}
                  className={`journey-result-card group flex w-full flex-col rounded-[22px] bg-white p-2.5 sm:p-3.5 text-left shadow-[0_2px_10px_rgba(26,73,133,.05)] transition duration-200 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 active:scale-[0.99] dark:bg-[#101E38] ${
                    isFirst
                      ? 'border-2 border-[#007AFF] shadow-blue-500/10'
                      : 'border border-[#E3EBF4] dark:border-slate-800'
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <button type="button" aria-label={`Відкрити маршрут: ${routeTitle(realItem)}`} onClick={(event) => { event.stopPropagation(); onSelectResultItem(realItem); }} className="flex min-w-0 flex-1 items-center gap-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
      <span className="journey-result-duration min-w-0 flex-1 text-[20px] font-black leading-none text-[#0B1730] dark:text-[#F5F9FF]">
                      {durationLabel}
                      <span className="mt-1 block truncate text-[10px] font-semibold leading-tight text-slate-500 dark:text-slate-400">
                        {formatClock(realItem.departureTime)} → {formatClock(realItem.arrivalTime)}{realItem.badge || isFirst ? ` · ${realItem.badge || 'Оптимальний'}` : ''}
                      </span>
                    </span>
                    <span className={`journey-result-total-price shrink-0 text-[20px] font-black leading-none ${itemPrice ? 'text-[#0B1730] dark:text-white' : 'text-slate-400'}`}>
                      {itemPrice ?? '—'}
                      <span className="mt-1 block text-right text-[10px] font-semibold leading-tight text-slate-400">{itemPrice ? realItem.priceUnit : 'Ціну не надано'}</span>
                    </span>
                    </button>
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300" title={`Критерій сортування: ${strategyPresentation.label}`} aria-label={`Критерій сортування: ${strategyPresentation.label}`}>
                      <strategyPresentation.Icon size={15} aria-hidden="true" />
                    </span>
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-slate-100 px-2.5 py-2 text-[11px] font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300" aria-label={transferLabel(transfersCount)}>
                      <span aria-hidden="true">↔</span>{transfersCount}
                    </span>
                    <button type="button" aria-pressed={savedJourneyIds.includes(realItem.id)} aria-label={savedJourneyIds.includes(realItem.id) ? 'Видалити маршрут зі збережених' : 'Зберегти маршрут'} onClick={(event) => { event.stopPropagation(); toggleSavedJourney(realItem.id); }} className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-slate-600 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-slate-300 dark:hover:bg-rose-950/40" >
                      <Heart size={17} aria-hidden="true" className={savedJourneyIds.includes(realItem.id) ? 'fill-rose-500 text-rose-500' : ''} />
                    </button>
                    <ChevronRight size={18} aria-hidden="true" className="shrink-0 text-blue-600"/>
                  </div>
                  <span className="sr-only">{routeTitle(realItem)}</span>

                  <div className="journey-segment-ribbon mt-2 flex h-[11px] w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" aria-label="Частка часу за етапами маршруту">
                    {realItem.legs?.length ? realItem.legs.map((leg) => {
                      const totalDuration = realItem.legs?.reduce((sum, candidate) => sum + Math.max(0, candidate.durationSeconds), 0) || 1;
                      const legColor = leg.mode === 'walk' ? '#94A3B8' : journeySegmentColor(leg.mode);
                      return <span key={leg.id} data-segment-mode={leg.mode.toUpperCase()} title={`${leg.modeLabel}: ${leg.durationLabel || 'час не вказано'}`} className="h-full min-w-[4px]" style={{ width: `${Math.max(4, leg.durationSeconds / totalDuration * 100)}%`, backgroundColor: legColor }} />;
                    }) : <span data-segment-mode={realItem.type.toUpperCase()} className="h-full w-full" style={{ backgroundColor: journeySegmentColor(realItem.type) }} />}
                  </div>

                  {realItem.legs?.length ? (
                    <div className="relative mt-2">
                      <div className="journey-result-segments no-scrollbar flex gap-1 overflow-x-auto scroll-smooth" data-testid="journey-result-segments" onScroll={(event) => {
                        // React may run the functional state updater after the
                        // synthetic event has been released; capture the DOM
                        // value synchronously instead of reading currentTarget
                        // inside that deferred updater.
                        const hasScrolled = event.currentTarget.scrollLeft > 2;
                        setScrolledSegments(current => ({ ...current, [realItem.id]: hasScrolled }));
                      }}>
                        {realItem.legs.map((leg) => {
                          const isWalk = leg.mode === 'walk';
                          const price = isWalk ? null : formatLegPrice(leg);
                          const label = isWalk ? 'Пішки' : leg.modeLabel;
                          return <div key={leg.id} data-segment-tile-id={leg.id} className="journey-segment-tile min-w-[76px] flex-1 overflow-hidden px-1 py-1 text-center" title={`${label} · ${leg.durationLabel || leg.modeLabel} · ${price ?? (isWalk ? 'Пішки' : 'Ціну не надано')}`}>
                            <span className="journey-segment-tile-label mb-0.5 flex items-center justify-center gap-1 truncate text-[10px] font-bold text-slate-600 dark:text-slate-300" title={label}>{segmentIcon(leg.mode)}{label}</span>
                            <span className="journey-segment-tile-meta block truncate text-[10px] text-slate-600 dark:text-slate-300"><span className="journey-segment-tile-meta-value font-bold">{leg.durationLabel || 'Час не вказано'}</span><span aria-hidden="true"> · </span><span className={`font-bold ${price ? '' : 'text-slate-400'}`}>{price ?? (isWalk ? '0 грн' : '—')}</span></span>
                          </div>;
                        })}
                      </div>
                      {overflowingSegments[realItem.id] && <button type="button" aria-label={scrolledSegments[realItem.id] ? 'Повернутися до початку етапів маршруту' : 'Прокрутити до наступних етапів маршруту'} onClick={(event) => { event.stopPropagation(); const scroller = event.currentTarget.parentElement?.querySelector<HTMLElement>('[data-testid="journey-result-segments"]'); if (!scroller) return; const direction = scrolledSegments[realItem.id] ? -1 : 1; scroller.scrollBy({ left: direction * Math.max(150, scroller.clientWidth * 0.72), behavior: 'smooth' }); }} className="absolute right-0 top-0 grid h-full w-8 place-items-center text-blue-600" ><span data-testid="segment-scroll-cue-surface" aria-hidden="true" className="segment-scroll-cue-surface absolute inset-0 bg-white dark:bg-[#111820]"/><span className="sr-only">{scrolledSegments[realItem.id] ? 'Повернутися до початку етапів маршруту' : 'Прокрутити до наступних етапів маршруту'}</span>{scrolledSegments[realItem.id] ? <ArrowLeft size={17} className="relative z-10"/> : <ChevronRight size={17} className="relative z-10"/>}</button>}
                    </div>
                  ) : null}

                  <div className="mt-1 flex min-w-0 items-center gap-2 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
                    <span className="truncate">{hasDistance ? realItem.distanceLabel : `${cleanOrigin} → ${cleanDest}`}</span>
                    <span className="ml-auto shrink-0">{transfersCount === 0 ? 'Без пересадок' : transferLabel(transfersCount)}</span>
                  </div>
                </article>
              );
            })}
            {items.length > 0 && onOpenReverseMarketplace && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 px-4 py-3 dark:border-blue-900/50 dark:bg-blue-950/30">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Не знайшли зручний варіант?
                </p>
                <button
                  type="button"
                  onClick={onOpenReverseMarketplace}
                  className="min-h-10 rounded-xl border border-[#0066FF] px-4 text-xs font-bold text-[#0066FF] transition hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-slate-900"
                >
                  Створити запит пасажира
                </button>
              </div>
            )}
            {items.length === 0 && (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center dark:border-slate-800 dark:bg-[#101E38]">
                <MapPin size={28} className="mx-auto text-slate-300" />
                <p className="mt-2 text-sm font-bold">Маршрутів за цими умовами не знайдено</p>
                <p className="mt-1 text-xs text-slate-500">Змініть час або вибрані види транспорту й повторіть пошук.</p>
                {onOpenReverseMarketplace && <button type="button" onClick={onOpenReverseMarketplace} className="mt-4 min-h-10 rounded-xl border border-[#0066FF] px-4 text-xs font-bold text-[#0066FF]">Створити запит пасажира</button>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
