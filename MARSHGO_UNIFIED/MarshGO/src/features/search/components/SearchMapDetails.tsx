import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  ArrowLeft,
  Compass,
  LocateFixed,
  Clock,
  ArrowRight,
  Footprints,
  BusFront,
  TramFront,
  TrainFront,
  CarFront,
  CarTaxiFront,
  Bike,
  Zap,
} from 'lucide-react';
import type { RouteSearchResultItem } from '../model/types';
import type { Coordinate } from '../../../../shared/navigation/contracts';
import { MarshGoMap } from '../../../map/MarshGoMap';
import type { MapAdapter, MapStatus } from '../../../map/MapAdapter';
import { RouteDetailsView } from './RouteDetailsView';
import { themeService } from '../../../services/theme';
import { journeySegmentColor } from '../../../domain/transportVisuals';
import { MapLayerSwitch } from '../../../components/MapLayerSwitch';
import { MapLayersControl } from '../../../components/MapLayersControl';
import { productionApi, type ApiJourneyLive } from '../../../services/productionApi';

function resultMapPadding(routeScreenOverride?: HTMLElement | null) {
  const routeScreen = routeScreenOverride ?? Array.from(document.querySelectorAll<HTMLElement>('.route-map-screen'))
    .reverse()
    .find((element) => {
      const bounds = element.getBoundingClientRect();
      const style = window.getComputedStyle(element);
      return bounds.width > 0 && bounds.height > 0 && style.display !== 'none' && style.visibility !== 'hidden';
    });
  const mapElement = routeScreen?.querySelector<HTMLElement>('.maplibregl-map');
  const mapBounds = mapElement?.getBoundingClientRect();
  const height = mapBounds?.height ?? window.visualViewport?.height ?? window.innerHeight;
  const toolbarBottom = routeScreen?.querySelector<HTMLElement>('[data-testid="map-top-toolbar"]')?.getBoundingClientRect().bottom;
  const resultSheetTop = routeScreen?.querySelector<HTMLElement>('[data-testid="route-bottom-sheet"]')?.getBoundingClientRect().top;
  const mapTop = mapBounds?.top ?? 0;
  const mapBottom = mapBounds?.bottom ?? height;
  const topInset = toolbarBottom == null
    ? Math.min(160, height * 0.25)
    : Math.min(height * 0.38, Math.max(24, toolbarBottom - mapTop + 20));
  const requestedBottomInset = resultSheetTop == null
    ? Math.min(360, height * 0.52)
    : Math.max(24, mapBottom - resultSheetTop + 12);
  // MapLibre rejects/ignores fits when padding consumes the full map. The
  // sheet can cover most of the screen, but preserve a small real map band.
  const minimumMapBand = Math.max(48, height * 0.08);
  const bottomInset = Math.min(requestedBottomInset, Math.max(24, height - topInset - minimumMapBand));
  return {
    top: topInset,
    right: 64,
    bottom: bottomInset,
    left: 24,
  };
}

function horizontalRouteBearing(points: Coordinate[]): number {
  if (points.length < 2) return 0;
  const mercator = ([longitude, latitude]: Coordinate): [number, number] => {
    const clamped = Math.max(-85.051129, Math.min(85.051129, latitude));
    const radians = clamped * Math.PI / 180;
    return [(longitude + 180) / 360, (1 - Math.log(Math.tan(radians) + 1 / Math.cos(radians)) / Math.PI) / 2];
  };
  const [startX, startY] = mercator(points[0]);
  const [endX, endY] = mercator(points.at(-1)!);
  const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
  return ((angle + 540) % 360) - 180;
}

function expandedRouteSheetHeight() {
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  // Expanded means detailed and scrollable, not a sheet that hides the map.
  return Math.min(viewportHeight - 150, viewportHeight * 0.58);
}

function formatVariantCount(count: number): string {
  const remainder100 = count % 100;
  const remainder10 = count % 10;
  const word = remainder100 >= 11 && remainder100 <= 14
    ? 'варіантів'
    : remainder10 === 1 ? 'варіант'
      : remainder10 >= 2 && remainder10 <= 4 ? 'варіанти' : 'варіантів';
  return `${count} ${word}`;
}

function RouteLegIcon({ mode }: { mode: string }) {
  const Icon = mode === 'walk' ? Footprints
    : mode === 'tram' || mode === 'trolleybus' ? TramFront
      : mode === 'metro' || mode === 'train' || mode === 'suburban_train' ? TrainFront
        : mode === 'carpool' || mode === 'carsharing' ? CarFront
          : mode === 'taxi' ? CarTaxiFront
            : mode === 'bike' ? Bike
              : mode === 'scooter' ? Zap : BusFront;
  return <Icon size={13} aria-hidden="true"/>;
}

interface SearchMapDetailsProps {
  item: RouteSearchResultItem;
  originTitle: string;
  destTitle: string;
  notice?: string | null;
  onOpenNotifications?: () => void;
  unreadNotificationCount?: number;
  dateStr?: string;
  timeStr?: string;
  passengers?: number;
  resultCount?: number;
  onBackToResults: () => void;
  onBook?: (item: RouteSearchResultItem) => void;
  initialMode?: 'details' | 'map';
}

export const SearchMapDetails: React.FC<SearchMapDetailsProps> = ({
  item,
  originTitle,
  destTitle,
  dateStr,
  timeStr,
  passengers = 1,
  resultCount = 1,
  onBackToResults,
  onBook,
  initialMode = 'details',
}) => {
  // Screen mode: 'details' (Screen 3: Stepper Timeline) or 'map' (Screen 1: Map View with floating cards)
  const [currentMode, setCurrentMode] = useState<'details' | 'map'>(initialMode);
  const [mapStatus, setMapStatus] = useState<MapStatus>('loading');
  const [mapAdapter, setMapAdapter] = useState<MapAdapter | null>(null);
  const [isDark, setIsDark] = useState(() => themeService.isDark());
  const [selectedLegId, setSelectedLegId] = useState<string | null>(null);
  const [liveJourney, setLiveJourney] = useState<ApiJourneyLive | null>(null);
  const [sheetState, setSheetState] = useState<'collapsed' | 'half' | 'expanded'>('half');
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const routeMapScreenRef = useRef<HTMLElement | null>(null);
  const sheetDrag = useRef<{ startY: number; startHeight: number; moved: boolean } | null>(null);
  const suppressSheetClick = useRef(false);

  useEffect(() => themeService.subscribe((_theme, dark) => setIsDark(dark)), []);

  const cleanOrigin = originTitle.split(',')[0].trim() || 'Початок маршруту';
  const cleanDest = destTitle.split(',')[0].trim() || 'Пункт призначення';

  const durationText = item.durationLabel || 'Час не вказано';
  const distanceText = item.distanceMeters == null || item.distanceMeters <= 0 || /не надана|невідом/i.test(item.distanceLabel)
    ? null
    : item.distanceLabel;
  const priceText = item.priceMinor == null || /не надано|невідом/i.test(item.priceLabel)
    ? null
    : item.priceLabel.replace(' UAH', ' грн').replace(' ₴', ' грн');
  const departureTime = item.departureTime.match(/\d{1,2}:\d{2}/)?.[0] ?? '—';
  const arrivalTime = item.arrivalTime.match(/\d{1,2}:\d{2}/)?.[0] ?? '—';
  const routeTitle = [...new Set((item.legs ?? [])
    .filter((leg) => leg.mode !== 'walk')
    .map((leg) => [leg.modeLabel, leg.routeName].filter(Boolean).join(' ')))].join(' + ') || item.modeLabel;

  const routeCoordinates: Coordinate[] = useMemo(() => {
    if (item.routeGeometry && item.routeGeometry.length >= 2) return item.routeGeometry;
    if (item.legs && item.legs.length > 0) {
      const flattened = item.legs.flatMap((l) => l.coordinates || []);
      if (flattened.length >= 2) return flattened;
    }
    return [];
  }, [item.routeGeometry, item.legs]);

  const routeSegments = useMemo<import('../../../map/MapAdapter').RouteSegment[]>(() => {
    if (item.legs && item.legs.length > 0) {
      // Keep each provider-supplied leg independent. Missing geometry should
      // omit that leg, never connect adjacent segments with an invented line.
      return item.legs.flatMap((leg) => leg.coordinates && leg.coordinates.length >= 2
        ? [{ coordinates: leg.coordinates, color: journeySegmentColor(leg.mode), dashed: leg.mode === 'walk' }]
        : []);
    }

    if (routeCoordinates.length >= 2) {
      return [{
        coordinates: routeCoordinates,
        color: journeySegmentColor(item.type),
        dashed: false,
      }];
    }
    return [];
  }, [item.legs, routeCoordinates]);

  const selectedLeg = item.legs?.find((leg) => leg.id === selectedLegId) ?? null;
  const isScheduledTransitLeg = (leg: typeof selectedLeg) => Boolean(leg && ['bus', 'minibus', 'marshrutka', 'tram', 'trolleybus', 'metro', 'train', 'suburban_train'].includes(leg.mode));
  const displayedRouteCoordinates = selectedLegId
    ? selectedLeg?.coordinates ?? []
    : routeCoordinates;
  const displayedRouteSegments = selectedLegId
    ? selectedLeg?.coordinates && selectedLeg.coordinates.length >= 2
      ? [{ coordinates: selectedLeg.coordinates, color: journeySegmentColor(selectedLeg.mode), dashed: selectedLeg.mode === 'walk' }]
      : []
    : routeSegments;
  const routeCameraBearing = sheetState === 'expanded' ? horizontalRouteBearing(displayedRouteCoordinates) : 0;

  const missingLegGeometry = Boolean(item.legs?.some((leg) => !leg.coordinates || leg.coordinates.length < 2));
  const routeGeometryWarning = displayedRouteCoordinates.length < 2
    ? selectedLegId
      ? 'Для вибраного відрізка джерело не надало геометрію. На карті не домальовуємо маршрут.'
      : 'Провайдер не надав геометрію цього маршруту. На карті показано лише підкладку без вигаданої лінії чи руху транспорту.'
    : missingLegGeometry
      ? 'Джерело не надало геометрію для кожної ділянки. Показані лише підтверджені відрізки маршруту.'
      : null;
  const mapWarnings = [
    routeGeometryWarning,
    mapStatus === 'failed' || mapStatus === 'degraded'
      ? 'Підкладка карти завантажилася частково. Дані маршруту збережені.'
      : null,
  ].filter((warning): warning is string => Boolean(warning));

  // Offer geometry can arrive after this view mounts. Refit when that real
  // provider geometry becomes available so the route does not stay off-screen
  // at the map's default camera position.
  useEffect(() => {
    if (!mapAdapter || displayedRouteCoordinates.length < 2) return;
    mapAdapter.setRoute(displayedRouteCoordinates);
    if (mapAdapter.setRouteSegments) {
      mapAdapter.setRouteSegments(displayedRouteSegments);
    }
    mapAdapter.fitRoute(resultMapPadding(routeMapScreenRef.current), routeCameraBearing);
  }, [mapAdapter, displayedRouteCoordinates, displayedRouteSegments, routeCameraBearing]);
  useEffect(() => {
    if (!mapAdapter || displayedRouteCoordinates.length < 2) return;
    // The sheet's height animates after state updates. Fitting immediately
    // would use its previous bounds and leave the selected route under it.
    const fitAfterSheetTransition = () => mapAdapter.fitRoute(resultMapPadding(routeMapScreenRef.current), routeCameraBearing);
    const timeout = window.setTimeout(fitAfterSheetTransition, 500);
    return () => window.clearTimeout(timeout);
  }, [mapAdapter, routeCameraBearing, sheetState]);

  const customMarkers = useMemo<import('../../../map/MapAdapter').CustomMapMarker[]>(() => {
    if (displayedRouteCoordinates.length < 2) return [];

    const startCoord = displayedRouteCoordinates[0];
    const endCoord = displayedRouteCoordinates[displayedRouteCoordinates.length - 1];
    const markerOrigin = selectedLeg?.originName ?? cleanOrigin;
    const markerDest = selectedLeg?.destinationName ?? cleanDest;

    const markers: import('../../../map/MapAdapter').CustomMapMarker[] = [];

    // Origin Marker A with label bubble matching Screen 1
    markers.push({
      coordinate: startCoord,
      html: `<div style="display:flex;align-items:center;gap:6px;transform:translate(-14px,-14px);pointer-events:auto;"><div style="width:28px;height:28px;border-radius:9999px;background:#0066FF;color:#ffffff;font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center;border:2.5px solid #ffffff;box-shadow:0 4px 10px rgba(0,0,0,0.25);">A</div><div style="background:rgba(255,255,255,0.96);backdrop-filter:blur(8px);padding:4px 9px;border-radius:12px;font-size:11px;font-weight:800;color:#0B1730;box-shadow:0 3px 8px rgba(0,0,0,0.18);white-space:nowrap;border:1px solid rgba(0,0,0,0.06);">${markerOrigin}</div></div>`,
      anchor: 'center',
    });

    // Destination Marker B with label bubble matching Screen 1
    markers.push({
      coordinate: endCoord,
      html: `<div style="display:flex;align-items:center;gap:6px;transform:translate(-14px,-14px);pointer-events:auto;"><div style="width:28px;height:28px;border-radius:9999px;background:#EF4444;color:#ffffff;font-weight:900;font-size:12px;display:flex;align-items:center;justify-content:center;border:2.5px solid #ffffff;box-shadow:0 4px 10px rgba(0,0,0,0.25);">B</div><div style="background:rgba(255,255,255,0.96);backdrop-filter:blur(8px);padding:4px 9px;border-radius:12px;font-size:11px;font-weight:800;color:#0B1730;box-shadow:0 3px 8px rgba(0,0,0,0.18);white-space:nowrap;border:1px solid rgba(0,0,0,0.06);">${markerDest}</div></div>`,
      anchor: 'center',
    });

    // Add segment icons at midpoints and transfer nodes
    if (displayedRouteSegments.length > 0) {
      displayedRouteSegments.forEach((seg, idx) => {
        if (seg.coordinates.length >= 2) {
          const midIdx = Math.floor(seg.coordinates.length / 2);
          const midCoord = seg.coordinates[midIdx];
          const isWalk = seg.dashed === true;
          const segmentColor = seg.color;

          let iconHtml: string;
          if (isWalk) {
            iconHtml = `<div style="width:26px;height:26px;border-radius:9999px;background:${segmentColor};color:#ffffff;display:flex;align-items:center;justify-content:center;border:2px solid #ffffff;box-shadow:0 3px 8px rgba(0,0,0,0.22);transform:translate(-13px,-13px);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m19 17-1.5-3-3.5 1-1-4 3-2"/><circle cx="13" cy="4" r="2"/><path d="m5 17 2-4 3 1 1-4-2.5-1.5"/></svg></div>`;
          } else {
            iconHtml = `<div style="width:28px;height:28px;border-radius:9999px;background:${segmentColor};color:#ffffff;display:flex;align-items:center;justify-content:center;border:2px solid #ffffff;box-shadow:0 3px 8px rgba(0,0,0,0.22);transform:translate(-14px,-14px);"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"/><path d="M15 6v6"/><path d="M2 12h19.6"/><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.6-.4-1-1-1H3c-.6 0-1 .4-1 1 0 .4.1.8.2 1.2.3 1.1.8 2.8.8 2.8h3"/><circle cx="7" cy="18" r="2"/><path d="M9 18h5"/><circle cx="16" cy="18" r="2"/></svg></div>`;
          }

          markers.push({
            coordinate: midCoord,
            html: iconHtml,
            anchor: 'center',
          });

          // Add transfer stop nodes between segments
          if (idx > 0) {
            markers.push({
              coordinate: seg.coordinates[0],
              html: `<div style="width:12px;height:12px;border-radius:9999px;background:#ffffff;border:3px solid ${segmentColor};box-shadow:0 2px 6px rgba(0,0,0,0.25);transform:translate(-6px,-6px);"></div>`,
              anchor: 'center',
            });
          }
        }
      });
    }

    return markers;
  }, [cleanOrigin, cleanDest, displayedRouteCoordinates, displayedRouteSegments, item.legs, selectedLeg]);

  useEffect(() => {
    if (mapAdapter?.setCustomMarkers) mapAdapter.setCustomMarkers(customMarkers);
  }, [mapAdapter, customMarkers]);

  useEffect(() => {
    if (!selectedLeg || !isScheduledTransitLeg(selectedLeg) || !item.id) {
      setLiveJourney(null);
      mapAdapter?.setTransitLineOverlay?.(null);
      return;
    }
    let stopped = false;
    let timer: number | undefined;
    let controller: AbortController | null = null;
    const poll = async () => {
      controller = new AbortController();
      try {
        const live = await productionApi.journeyLive(item.id, controller.signal, selectedLeg.id);
        if (!stopped) setLiveJourney(live);
      } catch {
        if (!stopped) {
          setLiveJourney(null);
          mapAdapter?.setTransitLineOverlay?.(null);
        }
      } finally {
        if (!stopped) timer = window.setTimeout(() => void poll(), 15_000);
      }
    };
    setLiveJourney(null);
    mapAdapter?.setTransitLineOverlay?.(null);
    void poll();
    return () => {
      stopped = true;
      controller?.abort();
      if (timer !== undefined) window.clearTimeout(timer);
    };
  }, [item.id, mapAdapter, selectedLeg?.id, selectedLeg?.mode]);

  useEffect(() => {
    if (!mapAdapter) return;
    const segment = liveJourney?.segments.find((candidate) => candidate.legId === selectedLegId);
    if (!selectedLeg || !isScheduledTransitLeg(selectedLeg) || !segment) {
      mapAdapter.setTransitLineOverlay?.(null);
      return;
    }
    mapAdapter.setTransitLineOverlay?.({
      modeColor: journeySegmentColor(selectedLeg.mode),
      transportType: selectedLeg.mode.toUpperCase(),
      lines: (segment.lineRoutes ?? []).map((line) => ({ id: line.id, direction: line.direction, coordinates: line.coordinates })),
      vehicles: (segment.vehicles ?? []).map((vehicle) => ({
        id: vehicle.id,
        coordinates: vehicle.coordinates,
        updatedAt: vehicle.updatedAt,
        emphasized: vehicle.emphasized,
        etaSeconds: vehicle.etaSeconds,
        remainingStops: vehicle.remainingStops,
      })),
    });
  }, [liveJourney, mapAdapter, selectedLeg, selectedLegId]);

  const sheetHeight = dragHeight ?? (sheetState === 'collapsed' ? 188 : sheetState === 'expanded'
    ? expandedRouteSheetHeight()
    : 310);
  const beginSheetDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    sheetDrag.current = { startY: event.clientY, startHeight: sheetHeight, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveSheetDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = sheetDrag.current;
    if (!drag) return;
    if (Math.abs(event.clientY - drag.startY) > 6) drag.moved = true;
    const maximum = Math.max(250, (window.visualViewport?.height ?? window.innerHeight) - 150);
    setDragHeight(Math.max(168, Math.min(maximum, drag.startHeight + drag.startY - event.clientY)));
  };
  const finishSheetDrag = (event: React.PointerEvent<HTMLButtonElement>) => {
    const drag = sheetDrag.current;
    sheetDrag.current = null;
    if (!drag) return;
    const targetHeight = Math.max(168, Math.min(
      Math.max(250, (window.visualViewport?.height ?? window.innerHeight) - 150),
      drag.startHeight + drag.startY - event.clientY,
    ));
    const snaps = [
      { state: 'collapsed' as const, height: 188 },
      { state: 'half' as const, height: 310 },
      { state: 'expanded' as const, height: expandedRouteSheetHeight() },
    ];
    const nearest = snaps.reduce((best, candidate) => Math.abs(candidate.height - targetHeight) < Math.abs(best.height - targetHeight) ? candidate : best);
    const wasDragged = drag.moved;
    suppressSheetClick.current = wasDragged;
    setDragHeight(null);
    if (wasDragged) setSheetState(nearest.state);
    return wasDragged;
  };

  const handleLocateMe = () => {
    if ('geolocation' in navigator && mapAdapter) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapAdapter.focus([pos.coords.longitude, pos.coords.latitude], 14.5);
        },
        () => {
          if (displayedRouteCoordinates.length >= 2) mapAdapter.fitRoute(resultMapPadding(routeMapScreenRef.current), routeCameraBearing);
        }
      );
    } else if (mapAdapter && displayedRouteCoordinates.length >= 2) {
      mapAdapter.fitRoute(resultMapPadding(routeMapScreenRef.current), routeCameraBearing);
    }
  };

  // If in Details Stepper Timeline mode, render Screen 3
  if (currentMode === 'details') {
    return (
      <RouteDetailsView
        item={item}
        originTitle={cleanOrigin}
        destTitle={cleanDest}
        onBackToResults={onBackToResults}
        onOpenMap={() => setCurrentMode('map')}
        onBook={() => onBook?.(item)}
      />
    );
  }

  // SCREEN 1: MAP VIEW WITH FLOATING CARDS
  return (
    <main ref={routeMapScreenRef} aria-label="Побудований маршрут" data-theme={isDark ? 'dark' : 'light'} data-route-camera-bearing={routeCameraBearing} className="route-map-screen relative h-[100svh] w-full overflow-hidden bg-[#eaf3fc] dark:bg-[#070E1B] text-[#081B35] dark:text-white select-none">
      {/* Map Canvas */}
      <div
        data-testid="route-map-canvas"
        data-route-segment-count={displayedRouteSegments.length}
        data-route-point-count={displayedRouteCoordinates.length}
        data-active-route-segment-id={displayedRouteSegments.length > 0 ? selectedLegId ?? undefined : undefined}
        data-selected-route-segment-count={selectedLegId && displayedRouteSegments.length > 0 ? 1 : displayedRouteSegments.length}
        data-dimmed-route-segment-count={0}
        className="absolute inset-0 z-0"
      >
        <MarshGoMap
          route={displayedRouteCoordinates}
          routeSegments={displayedRouteSegments}
          customMarkers={customMarkers}
          activeRouteSegmentId={selectedLegId}
          activeRouteSegmentColor={selectedLeg ? journeySegmentColor(selectedLeg.mode) : null}
          overlays={false}
          theme={isDark ? 'MARSHGO_DARK' : 'MARSHGO_LIGHT'}
          onStatus={setMapStatus}
          onAdapter={(adapter: MapAdapter | null) => {
            setMapAdapter(adapter);
            if (adapter && displayedRouteCoordinates.length >= 2) {
              adapter.setRoute(displayedRouteCoordinates);
              if (adapter.setRouteSegments) adapter.setRouteSegments(displayedRouteSegments);
              if (adapter.setCustomMarkers) adapter.setCustomMarkers(customMarkers);
              adapter.fitRoute(resultMapPadding(routeMapScreenRef.current), routeCameraBearing);
            }
          }}
        />
      </div>

      {/* Map modes and transport overlays stay available while the route remains visible. */}
      <div data-testid="map-top-toolbar" className="pointer-events-none absolute inset-x-3 sm:inset-x-5 top-[max(0.75rem,calc(env(safe-area-inset-top)+0.5rem))] z-30">
        <div className="pointer-events-auto mx-auto flex max-w-md items-center justify-between gap-1.5 rounded-[22px] border border-slate-200/80 bg-white/95 p-1.5 shadow-[0_12px_36px_rgba(15,35,65,0.16)] backdrop-blur-xl dark:border-slate-800 dark:bg-[#0B1730]/95">
          <button type="button" onClick={onBackToResults} aria-label="Назад до результатів" className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"><ArrowLeft size={19}/></button>
          <MapLayerSwitch layout="horizontal" className="min-w-0 flex-1 justify-center" />
          <MapLayersControl overlays compact showModes={false} label="Транспорт" />
        </div>
        <p role="group" aria-label={`Звідки: ${originTitle} Куди: ${destTitle}`} className="mx-auto mt-1 w-fit max-w-full truncate rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-700 shadow-sm backdrop-blur dark:bg-slate-900/90 dark:text-slate-200">{originTitle} → {destTitle}</p>
      </div>

      {/* Floating map controls use direct actions; zoom remains available through map gestures. */}
      <div className="pointer-events-none absolute right-3 sm:right-5 top-[calc(max(0.75rem,calc(env(safe-area-inset-top)+0.5rem))+7rem)] z-20 flex flex-col gap-2 items-end">
        {/* Compass / Direction Arrow */}
        <button
          type="button"
          onClick={() => {
            if (mapAdapter) mapAdapter.fitRoute(resultMapPadding(routeMapScreenRef.current), routeCameraBearing);
          }}
          aria-label="Компас"
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-2xl bg-white/95 dark:bg-[#0B1730]/95 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200/80 dark:border-slate-800 transition active:scale-95"
        >
          <Compass size={18} />
        </button>

        {/* GPS Locate Me Target */}
        <button
          type="button"
          onClick={handleLocateMe}
          aria-label="Моє місцезнаходження"
          className="pointer-events-auto grid h-10 w-10 place-items-center rounded-2xl bg-white/95 dark:bg-[#0B1730]/95 text-slate-700 dark:text-slate-200 shadow-xl border border-slate-200/80 dark:border-slate-800 transition active:scale-95 hover:bg-slate-50"
        >
          <LocateFixed size={18} />
        </button>
      </div>

      {/* Selected route summary, color-matched to its real transport legs. */}
      <div className="route-map-result-anchor pointer-events-none absolute inset-x-3 sm:inset-x-5 bottom-[calc(5.25rem+env(safe-area-inset-bottom))] z-30 flex justify-center">
        <div data-testid="route-bottom-sheet" data-sheet-state={sheetState} data-theme={isDark ? 'dark' : 'light'} className="pointer-events-auto w-full max-w-md overflow-y-auto rounded-[26px] border border-slate-200/80 bg-white/95 p-3.5 shadow-[0_12px_36px_rgba(15,35,65,0.18)] backdrop-blur-xl dark:border-slate-800 dark:bg-[#0B1730]/95" style={{ height: sheetHeight, transition: dragHeight === null ? 'height 220ms ease' : 'none' }} onTransitionEnd={(event) => {
          if (event.target === event.currentTarget && event.propertyName === 'height' && mapAdapter && displayedRouteCoordinates.length >= 2) {
            mapAdapter.fitRoute(resultMapPadding(routeMapScreenRef.current), routeCameraBearing);
          }
        }}>
          <button type="button" aria-label={sheetState === 'expanded' ? 'Згорнути деталі маршруту' : 'Розгорнути деталі маршруту'} aria-expanded={sheetState === 'expanded'} className="route-sheet-grabber mx-auto mb-2 flex h-7 w-24 touch-none items-center justify-center" onPointerDown={beginSheetDrag} onPointerMove={moveSheetDrag} onPointerUp={finishSheetDrag} onPointerCancel={() => { sheetDrag.current = null; setDragHeight(null); }} onClick={() => { if (suppressSheetClick.current) { suppressSheetClick.current = false; return; } if (sheetState === 'collapsed') setSheetState('half'); else if (sheetState === 'half') setSheetState('expanded'); else setSheetState('collapsed'); }}><span className="h-1.5 w-11 rounded-full bg-slate-300 dark:bg-slate-700"/></button>
          <div className="route-sheet-summary">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="mb-0.5 block text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Вибраний маршрут</span>
              <h3 className="truncate text-base font-black text-[#0B1730] dark:text-white">{routeTitle}</h3>
              <p className="truncate text-[11px] font-semibold text-slate-500 dark:text-slate-400">{cleanOrigin} → {cleanDest}</p>
            </div>
            <button type="button" onClick={onBackToResults} aria-label={`Показати всі ${formatVariantCount(resultCount)}`} className="shrink-0 rounded-xl bg-slate-100 px-2.5 py-2 text-[11px] font-extrabold text-slate-700 transition hover:bg-blue-50 hover:text-[#0066FF] dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-blue-950/60">
              Усі варіанти
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold text-slate-600 dark:text-slate-300">
            <span className="inline-flex items-center gap-1"><Clock size={13} className="text-[#0066FF]"/><time>{departureTime} → {arrivalTime}</time></span>
            <span>{durationText}</span>
            <span>{item.transfers ?? 0} {item.transfers === 1 ? 'пересадка' : 'пересадки'}</span>
            {distanceText && <span>{distanceText}</span>}
            {priceText && <span className="font-extrabold text-amber-700 dark:text-amber-300">{priceText}</span>}
          </div>

          {mapWarnings.length > 0 && (
            <p role="status" aria-live="polite" className="mt-2 rounded-xl border border-amber-200 bg-amber-50/90 px-3 py-2 text-[11px] font-semibold leading-snug text-amber-950 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-100">
              {mapWarnings.join(' ')}
            </p>
          )}

          <p aria-live="polite" data-testid="route-map-selection" className="mt-1 text-[10px] font-semibold text-slate-500 dark:text-slate-400">
            {selectedLeg
              ? `На карті: ${selectedLeg.modeLabel}${selectedLeg.routeName ? ` ${selectedLeg.routeName}` : ''} · вибраний відрізок`
              : 'На карті: весь маршрут'}
          </p>

          {item.legs?.length ? (
            <div role="group" aria-label="Послідовність відрізків маршруту" className="journey-segment-strip mt-2 overflow-x-auto pb-1">
              <div className="journey-segment-ribbon mb-2 flex h-[10px] min-w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700" aria-label="Частка часу за етапами маршруту">
                {item.legs.map((leg) => {
                  const isFocused = selectedLegId === leg.id;
                  const isDimmed = selectedLegId !== null && !isFocused;
                  return <span key={`ribbon-${leg.id}`} data-segment-mode={leg.mode.toUpperCase()} data-journey-strip-segment-id={leg.id} title={`${leg.modeLabel}: ${leg.durationLabel || 'час не вказано'}`} className="h-full min-w-[4px] transition-[filter,opacity] duration-200" style={{ flex: `${Math.max(1, leg.durationSeconds)} 1 0%`, backgroundColor: journeySegmentColor(leg.mode), filter: isFocused ? 'brightness(1.16)' : isDimmed ? 'brightness(0.55)' : undefined }}/>
                })}
              </div>
              <button
                type="button"
                aria-pressed={selectedLegId === null}
                aria-label="Показати маршрут цілком"
                data-testid="map-route-overview"
                onClick={() => setSelectedLegId(null)}
                className={`mb-2 min-h-11 shrink-0 rounded-lg border px-2.5 py-1 text-[11px] font-black ${selectedLegId === null ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-950/50 dark:text-blue-200' : 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'}`}
              >Огляд</button>
              <div role="list" aria-label="Вибір відрізка на карті" className="flex items-center gap-1.5 overflow-x-auto">
              {item.legs.map((leg, legIdx) => {
                const isWalk = leg.mode === 'walk';
                return <React.Fragment key={leg.id || legIdx}>
                  {legIdx > 0 && <ArrowRight aria-hidden="true" size={13} className="shrink-0 text-slate-400 dark:text-slate-500"/>}
                  <div role="listitem" className="shrink-0"><button
                    type="button"
                    aria-pressed={selectedLegId === leg.id}
                    data-testid={`map-route-segment-${leg.id}`}
                    onClick={() => {
                      setSelectedLegId(leg.id);
                      setSheetState('expanded');
                    }}
                    className={`journey-segment-tile flex min-h-11 shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-black transition ${selectedLegId === leg.id ? 'is-active opacity-100 ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-[#0B1730]' : selectedLegId !== null ? 'opacity-50' : ''} ${isWalk ? 'border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200' : 'border-transparent text-white shadow-sm'}`}
                    style={isWalk ? undefined : { backgroundColor: journeySegmentColor(leg.mode) }}
                  >
                    <RouteLegIcon mode={leg.mode}/>{[leg.modeLabel, leg.routeName].filter(Boolean).join(' ') || (isWalk ? 'Пішки' : 'Транспорт')}
                  </button></div>
                </React.Fragment>;
              })}
              </div>
            </div>
          ) : <p className="mt-2 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Деталі сегментів для цього варіанта не надані джерелом.</p>}

          {sheetState === 'expanded' && <div data-testid="route-segment-list" className="mt-3 space-y-2">
            {(item.legs ?? []).map((leg) => <article key={leg.id} data-segment-id={leg.id} data-active={selectedLegId === leg.id} className="journey-route-segment-card rounded-2xl border border-slate-200/80 bg-white/80 p-3 dark:border-slate-800 dark:bg-[#111820]">
              <button type="button" aria-label={`Вибрати сегмент: ${leg.modeLabel}${leg.routeName ? ` ${leg.routeName}` : ''}`} aria-pressed={selectedLegId === leg.id} onClick={() => setSelectedLegId(leg.id)} className="flex min-h-11 w-full items-center justify-between gap-3 text-left font-extrabold">
              <span>{leg.modeLabel}{leg.routeName ? ` ${leg.routeName}` : ''}</span><span className="text-xs font-bold text-slate-500">{leg.durationLabel || 'Час не вказано'} · {leg.priceLabel || (leg.priceMinor == null ? 'Ціну не надано' : `${new Intl.NumberFormat('uk-UA', { maximumFractionDigits: 0 }).format(leg.priceMinor / 100)} грн`)}</span>
              </button>
              <p className="mt-1 text-xs text-slate-500">{leg.originName || 'Початок сегмента'} → {leg.destinationName || 'Кінець сегмента'}</p>
              {leg.stops?.length ? <ol className="mt-2 space-y-1 border-l border-slate-300 pl-3 text-xs dark:border-slate-700">{leg.stops.map((stop) => <li key={stop.id} className="flex justify-between gap-2"><span>{stop.name}</span><time>{(stop.arrivalAt || stop.departureAt || '').match(/\d{2}:\d{2}/)?.[0] ?? ''}</time></li>)}</ol> : null}
            </article>)}
          </div>}

          {item.offerId && onBook && <button type="button" aria-label="Забронювати" onClick={() => onBook(item)} className="mt-2 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#E91E83] px-4 py-3 text-sm font-black text-white shadow-md shadow-pink-500/20 transition hover:bg-[#D21673] active:scale-[0.99]">
            Забронювати попутку <ArrowRight size={17}/>
          </button>}
          <button type="button" onClick={() => setCurrentMode('details')} className="mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl bg-[#087CF0] px-4 py-2.5 text-sm font-black text-white shadow-md shadow-blue-500/20 transition hover:bg-[#0066D6] active:scale-[0.99]">
            Показати деталі <ArrowRight size={17}/>
          </button>
          <p className="mt-1 text-center text-[10px] font-medium text-slate-400 dark:text-slate-500">{dateStr || 'Дата не вказана'} · {timeStr || 'Час не вказано'} · {passengers} {passengers === 1 ? 'пасажир' : 'пасажири'}</p>
          </div>
        </div>
      </div>

    </main>
  );
};
