import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  Navigation,
  Locate,
  Plus,
  Minus,
  Play,
  Pause,
  RotateCcw,
  Radio,
  Clock,
  Compass,
  Volume2,
  VolumeX,
  Gauge,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Activity,
  Layers,
} from 'lucide-react';
import L from 'leaflet';
import { TransitRoute } from '../../types/marshgo';
import { DraggableBottomSheet } from '../DraggableBottomSheet';
import { ActiveNavigationOverlay } from '../ActiveNavigationOverlay';
import {
  LiveVehiclePosition,
  INITIAL_LIVE_VEHICLES,
} from '../../services/gtfsRealtimeService';
import {
  GpsBusTelemetry,
  ROUTE_HIGHWAY_WAYPOINTS,
  createInitialBusTelemetry,
  tickBusTelemetry,
  getStopsWithDistances,
  interpolatePositionAtDistance,
} from '../../services/gpsSimulationService';
import { triggerRatchetTick } from '../../utils/haptics';

interface RouteMapScreenProps {
  route: TransitRoute;
  onBack: () => void;
  onShowDetails: () => void;
  initialNavigating?: boolean;
}

export const RouteMapScreen: React.FC<RouteMapScreenProps> = ({
  route,
  onBack,
  onShowDetails,
  initialNavigating = false,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const mainPolylineRef = useRef<L.Polyline | null>(null);
  const runnerPolylineRef = useRef<L.Polyline | null>(null);
  const traveledPolylineRef = useRef<L.Polyline | null>(null);
  const busMarkerRef = useRef<L.Marker | null>(null);
  const stopMarkersRef = useRef<L.Marker[]>([]);
  const otherVehMarkersRef = useRef<Map<string, L.Marker>>(new Map());

  // Navigation & View Mode
  const [mapMode, setMapMode] = useState<'standard' | 'satellite' | 'transit'>('standard');
  const [isNavigating, setIsNavigating] = useState(initialNavigating);
  const [otherVehicles, setOtherVehicles] = useState<LiveVehiclePosition[]>(INITIAL_LIVE_VEHICLES);

  // GPS Simulation State (3-second cadence)
  const [busTelemetry, setBusTelemetry] = useState<GpsBusTelemetry>(createInitialBusTelemetry);
  const [isSimActive, setIsSimActive] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<number>(1);
  const [soundOnPing, setSoundOnPing] = useState(false);
  const [autoFollowBus, setAutoFollowBus] = useState(false);
  const [secondsToNextPing, setSecondsToNextPing] = useState<number>(3);
  const [pingPulseFlash, setPingPulseFlash] = useState(false);

  useEffect(() => {
    setIsNavigating(initialNavigating);
    if (initialNavigating) {
      setAutoFollowBus(true);
    }
  }, [initialNavigating]);

  // Gentle subtle sound for GPS ping
  const playGpsPingSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1318.5, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.035, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch (e) {}
  };

  // 1. Initialize Leaflet Map with Route and Stops
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [50.25, 27.8],
        zoom: 7,
        zoomControl: false,
        attributionControl: false,
      });
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Switch Tile Layer based on mapMode
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    let tileUrl = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    if (mapMode === 'satellite') {
      tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{v}';
    } else if (mapMode === 'transit') {
      tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }

    const tileLayer = L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);
    tileLayerRef.current = tileLayer;

    // Draw Complete Route Highway Polyline
    if (mainPolylineRef.current) map.removeLayer(mainPolylineRef.current);
    if (runnerPolylineRef.current) map.removeLayer(runnerPolylineRef.current);

    const fullPolyline = L.polyline(ROUTE_HIGHWAY_WAYPOINTS, {
      color: '#2563EB',
      weight: 6,
      opacity: 0.85,
    }).addTo(map);
    mainPolylineRef.current = fullPolyline;

    // Dashed Glowing Accent Runner
    const runner = L.polyline(ROUTE_HIGHWAY_WAYPOINTS, {
      color: '#93C5FD',
      weight: 2.5,
      opacity: 0.95,
      dashArray: '8, 10',
    }).addTo(map);
    runnerPolylineRef.current = runner;

    // Traveled path layer (cyan/emerald glowing trail behind bus)
    if (!traveledPolylineRef.current) {
      const traveled = L.polyline([], {
        color: '#10B981',
        weight: 6,
        opacity: 0.9,
      }).addTo(map);
      traveledPolylineRef.current = traveled;
    }

    // Initialize Stops Markers
    stopMarkersRef.current.forEach((m) => map.removeLayer(m));
    stopMarkersRef.current = [];

    const stops = getStopsWithDistances();
    stops.forEach((stop) => {
      const iconHtml = `
        <div style="background-color: ${
          stop.type === 'origin'
            ? '#2563EB'
            : stop.type === 'destination'
            ? '#EF4444'
            : '#F59E0B'
        }; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 800; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3);">
          ${stop.type === 'origin' ? 'А' : stop.type === 'destination' ? 'Б' : 'M'}
        </div>
      `;
      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-leaflet-marker',
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
      const marker = L.marker(stop.coords, { icon: customIcon })
        .addTo(map)
        .bindTooltip(
          `<strong>${stop.name}</strong><br/><span style="color:#64748B;">Розклад: ${stop.scheduledTime} • ${stop.distanceKm} км</span>`,
          { direction: 'top', offset: [0, -10] }
        );
      stopMarkersRef.current.push(marker);
    });

    map.fitBounds(fullPolyline.getBounds(), { padding: [45, 45] });
  }, [mapMode]);

  // 2. High-Precision 3-Second GPS Simulation Loop
  useEffect(() => {
    if (!isSimActive) return;

    // Countdown timer for next 3-second ping (updates every 100ms)
    const countdownInterval = setInterval(() => {
      setSecondsToNextPing((prev) => {
        const next = Math.max(0, Math.round((prev - 0.1) * 10) / 10);
        return next <= 0 ? 3 : next;
      });
    }, 100);

    // Primary 3-second GPS telemetry update ping
    const gpsInterval = setInterval(() => {
      setBusTelemetry((prev) => {
        const updated = tickBusTelemetry(prev, speedMultiplier);
        return updated;
      });

      // Visual heartbeat ping flash
      setPingPulseFlash(true);
      setTimeout(() => setPingPulseFlash(false), 450);

      // Sound & Haptic on GPS ping
      if (soundOnPing) {
        playGpsPingSound();
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          try {
            navigator.vibrate(10);
          } catch (e) {}
        }
      }
      setSecondsToNextPing(3);
    }, 3000);

    return () => {
      clearInterval(countdownInterval);
      clearInterval(gpsInterval);
    };
  }, [isSimActive, speedMultiplier, soundOnPing]);

  // 3. Sync Simulated Bus Marker & Trail on Map whenever telemetry updates
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const { latitude, longitude, bearing, speedKmh, busNumber, busModel, routeTitle, nextStopName, accuracyMeters, satellites, lastPingTimestamp, traveledDistanceKm, totalDistanceKm } =
      busTelemetry;

    // Custom High-Tech GPS Bus Marker HTML
    const busHtml = `
      <div class="relative flex items-center justify-center gps-bus-marker-node">
        <!-- Concentric Radar Beacon Pulse -->
        <div class="absolute -inset-3.5 rounded-full bg-blue-500/25 gps-beacon-pulse pointer-events-none"></div>
        <div class="absolute -inset-1.5 rounded-full bg-emerald-400/40 animate-ping pointer-events-none"></div>

        <!-- Bus Body with directional indicator -->
        <div style="background: linear-gradient(135deg, #1D4ED8 0%, #2563EB 60%, #3B82F6 100%); box-shadow: 0 4px 18px rgba(37, 99, 235, 0.6); border: 2.5px solid #FFFFFF;" class="relative w-11 h-11 rounded-full flex items-center justify-center text-white z-10">
          <div style="transform: rotate(${Math.round(bearing - 90)}deg); transition: transform 0.6s cubic-bezier(0.2, 0.8, 0.2, 1);" class="flex items-center justify-center text-xl select-none">
            🚌
          </div>
        </div>

        <!-- Floating Live Speed Badge -->
        <div class="absolute -bottom-5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-slate-900/95 backdrop-blur-md text-white text-[10px] font-black border border-slate-700 shadow-lg whitespace-nowrap flex items-center gap-1 z-20">
          <span class="w-1.5 h-1.5 rounded-full ${speedKmh > 0 ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}"></span>
          <span>${speedKmh} км/г</span>
        </div>
      </div>
    `;

    const busIcon = L.divIcon({
      html: busHtml,
      className: 'custom-bus-leaflet-marker',
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const popupHtml = `
      <div style="font-family: inherit; min-width: 200px; padding: 4px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <strong style="color: #0F172A; font-size: 13px;">🚌 ${busNumber}</strong>
          <span style="background: #DCFCE7; color: #15803D; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 999px;">GPS ONLINE</span>
        </div>
        <div style="font-size: 11px; color: #475569; margin-bottom: 6px;">
          ${busModel} • ${routeTitle}
        </div>
        <div style="background: #F1F5F9; border-radius: 8px; padding: 8px; font-size: 11px; display: grid; gap: 4px;">
          <div>📡 <strong>Сигнал:</strong> ${satellites} супутників (±${accuracyMeters}м)</div>
          <div>⚡ <strong>Швидкість:</strong> ${speedKmh} км/год</div>
          <div>⏱ <strong>Останній пінг:</strong> ${lastPingTimestamp} (кожні 3с)</div>
          <div>📍 <strong>Наступна зупинка:</strong> ${nextStopName}</div>
          <div>🛣 <strong>Прогрес:</strong> ${traveledDistanceKm} / ${totalDistanceKm} км</div>
        </div>
      </div>
    `;

    if (busMarkerRef.current) {
      busMarkerRef.current.setLatLng([latitude, longitude]);
      busMarkerRef.current.setIcon(busIcon);
      busMarkerRef.current.setPopupContent(popupHtml);
    } else {
      const marker = L.marker([latitude, longitude], { icon: busIcon })
        .addTo(map)
        .bindPopup(popupHtml);
      busMarkerRef.current = marker;
    }

    // Update traveled trail polyline up to current bus position
    if (traveledPolylineRef.current) {
      // Build traversed points from start of route to current coordinates
      const traversedPoints: [number, number][] = [];
      const { cumulative } = {
        cumulative: ROUTE_HIGHWAY_WAYPOINTS.map((_, idx) => idx * 15), // approximated mapping
      };

      for (let i = 0; i < ROUTE_HIGHWAY_WAYPOINTS.length; i++) {
        const pt = ROUTE_HIGHWAY_WAYPOINTS[i];
        // If waypoint is behind current bus progress
        if (i * 15.5 <= traveledDistanceKm) {
          traversedPoints.push(pt);
        } else {
          break;
        }
      }
      traversedPoints.push([latitude, longitude]);
      traveledPolylineRef.current.setLatLngs(traversedPoints);
    }

    // Auto-center camera on bus if navigating or requested
    if ((isNavigating || autoFollowBus) && map) {
      map.panTo([latitude, longitude], {
        animate: true,
        duration: 0.9,
      });
    }
  }, [busTelemetry, isNavigating, autoFollowBus]);

  // Zoom and locate actions
  const handleZoom = (delta: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom(mapInstanceRef.current.getZoom() + delta);
    }
  };

  const handleLocateBus = () => {
    if (mapInstanceRef.current) {
      triggerRatchetTick('hour');
      setAutoFollowBus(true);
      mapInstanceRef.current.flyTo(
        [busTelemetry.latitude, busTelemetry.longitude],
        13,
        { duration: 1.2 }
      );
    }
  };

  const handleResetBusToStart = () => {
    triggerRatchetTick('minute');
    const reset = createInitialBusTelemetry();
    reset.traveledDistanceKm = 0;
    const startPos = interpolatePositionAtDistance(0);
    reset.latitude = startPos.latitude;
    reset.longitude = startPos.longitude;
    reset.bearing = startPos.bearing;
    reset.historyTrail = [[startPos.latitude, startPos.longitude]];
    reset.progressPercent = 0;
    setBusTelemetry(reset);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([startPos.latitude, startPos.longitude], 12);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative bg-slate-100 overflow-hidden animate-in fade-in duration-200">
      {/* Turn-by-Turn Navigation Overlay when active */}
      {isNavigating ? (
        <ActiveNavigationOverlay
          onStopNavigation={() => {
            setIsNavigating(false);
            setAutoFollowBus(false);
          }}
          currentSpeed={busTelemetry.speedKmh}
        />
      ) : (
        /* Top Navigation Header & Layer Mode Switcher matching Screenshot 5 */
        <div className="absolute top-3 left-3 right-3 z-[1000] flex items-center justify-between gap-2 pointer-events-auto">
          <button
            onClick={onBack}
            className="p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-100 shadow-md border border-slate-200/80 dark:border-slate-800 active:scale-95 transition-all flex items-center gap-1 font-extrabold text-xs"
            title="Назад"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
            <span className="hidden sm:inline">Карта маршруту</span>
          </button>

          {/* 3D / Satellite / Transit Switcher matching Screenshot 5 */}
          <div className="flex items-center gap-1 p-1 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-md border border-slate-200/80 dark:border-slate-800">
            <button
              onClick={() => setMapMode('standard')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mapMode === 'standard'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              3D
            </button>
            <button
              onClick={() => setMapMode('satellite')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mapMode === 'satellite'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Супутник
            </button>
            <button
              onClick={() => setMapMode('transit')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                mapMode === 'transit'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Транспорт
            </button>
          </div>

          <button
            onClick={() => setMapMode((prev) => (prev === 'standard' ? 'transit' : 'standard'))}
            className="p-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md text-slate-800 dark:text-slate-100 shadow-md border border-slate-200/80 dark:border-slate-800 transition-all"
            title="Шари карти"
          >
            <Layers className="w-4 h-4 text-slate-700 dark:text-slate-300" />
          </button>
        </div>
      )}

      {/* Floating GPS Realtime Simulation HUD Banner */}
      <div
        className={`absolute left-3 right-3 ${
          isNavigating ? 'top-32' : 'top-16'
        } z-[1000] pointer-events-auto transition-all`}
      >
        <div className="p-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl text-white shadow-xl flex flex-col gap-2">
          {/* Top line: Real-time status, 3s ticker, and speed */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span
                  className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    isSimActive ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span
                  className={`relative inline-flex rounded-full h-3 w-3 ${
                    isSimActive ? 'bg-emerald-500' : 'bg-amber-500'
                  }`}
                />
              </span>
              <div>
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span>GPS ТЕЛЕМЕТРІЯ ОНЛАЙН</span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono transition-all duration-300 ${
                      pingPulseFlash
                        ? 'bg-emerald-500 text-slate-950 font-black scale-110'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    3s PING
                  </span>
                </span>
                <div className="text-[10px] text-slate-300 font-medium">
                  {busTelemetry.busNumber} • {busTelemetry.nextStopName}
                </div>
              </div>
            </div>

            {/* 3-Second Countdown & Speed badge */}
            <div className="flex items-center gap-2">
              <div className="flex flex-col items-end">
                <span className="text-sm font-black text-white font-mono flex items-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-blue-400" />
                  <span>{busTelemetry.speedKmh}</span>
                  <span className="text-[10px] text-slate-400 font-normal">км/г</span>
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  пінг через {secondsToNextPing.toFixed(1)}с
                </span>
              </div>
            </div>
          </div>

          {/* Progress bar along the route */}
          <div className="space-y-1">
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
              <div
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${busTelemetry.progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between items-center text-[9px] text-slate-400 font-mono">
              <span>Пройдено {busTelemetry.traveledDistanceKm} км</span>
              <span>{busTelemetry.progressPercent}% маршруту</span>
              <span>Залишилось {busTelemetry.remainingDistanceKm} км</span>
            </div>
          </div>

          {/* Simulation Controls Strip */}
          <div className="flex items-center justify-between gap-1 pt-1 border-t border-slate-800/80">
            {/* Play/Pause & Speed toggles */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  triggerRatchetTick('minute');
                  setIsSimActive(!isSimActive);
                }}
                className={`p-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                  isSimActive
                    ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                }`}
                title={isSimActive ? 'Призупинити симуляцію' : 'Запустити симуляцію'}
              >
                {isSimActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="text-[10px]">{isSimActive ? 'Пауза' : 'Пуск'}</span>
              </button>

              {/* Speed Multiplier */}
              <div className="flex items-center gap-1 bg-slate-800/90 rounded-xl p-0.5 border border-slate-700">
                {[1, 2, 5].map((mult) => (
                  <button
                    key={mult}
                    onClick={() => {
                      triggerRatchetTick('minute');
                      setSpeedMultiplier(mult);
                    }}
                    className={`px-2 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                      speedMultiplier === mult
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {mult}x
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions: Audio tick, Reset, Focus */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  triggerRatchetTick('minute');
                  setSoundOnPing(!soundOnPing);
                }}
                className={`p-1.5 rounded-xl border transition-all ${
                  soundOnPing
                    ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                }`}
                title={soundOnPing ? 'Звук пінгу увімкнено' : 'Увімкнути звук GPS-пінгу'}
              >
                {soundOnPing ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={handleResetBusToStart}
                className="p-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white transition-all"
                title="Перезапустити маршрут спочатку"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={handleLocateBus}
                className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold shadow-md flex items-center gap-1 transition-all active:scale-95"
                title="Фокус на автобусі"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Автобус</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Map Canvas */}
      <div ref={mapContainerRef} className="w-full flex-1 z-0" />

      {/* Floating Map Zoom & Navigation Controls */}
      <div
        className={`absolute right-4 ${
          isNavigating ? 'bottom-80' : 'bottom-72'
        } z-[1000] flex flex-col gap-2 pointer-events-auto transition-all`}
      >
        <button
          onClick={handleLocateBus}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md text-blue-600 shadow-md border border-slate-200 flex items-center justify-center hover:bg-blue-50 active:scale-95 transition-all"
          title="Стежити за автобусом"
        >
          <Navigation className="w-4 h-4 fill-current stroke-0" />
        </button>
        <button
          onClick={() => handleZoom(1)}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
          title="Збільшити"
        >
          <Plus className="w-5 h-5 stroke-[2.5]" />
        </button>
        <button
          onClick={() => handleZoom(-1)}
          className="w-10 h-10 rounded-2xl bg-white/95 backdrop-blur-md text-slate-800 shadow-md border border-slate-200 flex items-center justify-center hover:bg-slate-50 active:scale-95 transition-all"
          title="Зменшити"
        >
          <Minus className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>

      {/* Gesture-driven Draggable Bottom Sheet with Live Telemetry */}
      <DraggableBottomSheet initialSnap="peek" peekHeight={280} collapsedHeight={110}>
        <div className="space-y-3 pt-1">
          {/* Main Route summary */}
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1">
                <span>{route.title}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </h4>
              <div className="text-xs text-slate-500 font-medium mt-0.5">
                {route.durationFormatted} • {busTelemetry.busModel}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-800">
                {route.departureTime} – {route.arrivalTime}
              </div>
              <div className="text-base font-black text-blue-600">
                {route.totalCostUah} грн
              </div>
            </div>
          </div>

          {/* Real-time GPS Telemetry Status Pill */}
          <div className="p-3 rounded-2xl bg-blue-50/90 border border-blue-200/80 flex items-center justify-between text-xs shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-slate-900 block text-xs">
                  {busTelemetry.busNumber} • {busTelemetry.driverName}
                </span>
                <span className="text-[11px] text-slate-600">
                  До зупинки: {busTelemetry.nextStopName} (~{busTelemetry.nextStopEtaMinutes} хв)
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full block">
                {busTelemetry.satellites} GPS
              </span>
              <span className="text-[9px] text-slate-500 font-mono mt-0.5 block">
                ±{busTelemetry.accuracyMeters}м
              </span>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                triggerRatchetTick('hour');
                const nextState = !isNavigating;
                setIsNavigating(nextState);
                if (nextState) setAutoFollowBus(true);
              }}
              className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm shadow-md flex items-center justify-center gap-1.5 transition-all ${
                isNavigating
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
              }`}
            >
              <Navigation className="w-4 h-4 fill-current stroke-0" />
              <span>{isNavigating ? 'Зупинити навігацію' : 'Стежити в 3D'}</span>
            </button>

            <button
              onClick={() => {
                triggerRatchetTick('minute');
                onShowDetails();
              }}
              className="py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-1.5 transition-all"
            >
              <span>Всі деталі</span>
              <span>→</span>
            </button>
          </div>

          {/* Dynamic Stops along the route with live status */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <h5 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center justify-between">
              <span>Зупинки на маршруті (GPS):</span>
              <span className="text-[10px] text-slate-500 font-mono">
                Оновлення що 3 сек
              </span>
            </h5>
            <div className="space-y-1.5 text-xs">
              {getStopsWithDistances().map((stop, idx) => {
                const isPassed = busTelemetry.traveledDistanceKm >= stop.distanceKm;
                const isNext = !isPassed && busTelemetry.nextStopName.includes(stop.city);

                return (
                  <div
                    key={stop.id}
                    className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                      isNext
                        ? 'bg-blue-50 border-blue-300 shadow-xs'
                        : isPassed
                        ? 'bg-slate-50 border-slate-200/80 text-slate-600'
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                          isPassed
                            ? 'bg-emerald-500 text-white'
                            : isNext
                            ? 'bg-blue-600 text-white animate-pulse'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {isPassed ? '✓' : idx + 1}
                      </span>
                      <div>
                        <span
                          className={`block font-semibold ${
                            isNext ? 'text-blue-900 font-bold' : 'text-slate-800'
                          }`}
                        >
                          {stop.name}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {stop.distanceKm} км від старту
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {isPassed ? (
                        <span className="text-emerald-600 font-bold text-[11px]">
                          Пройдено ✓
                        </span>
                      ) : isNext ? (
                        <span className="text-blue-700 font-bold text-[11px]">
                          Очікується ~{busTelemetry.nextStopEtaMinutes} хв
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[11px]">
                          {stop.scheduledTime}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DraggableBottomSheet>
    </div>
  );
};

export { RealtimeGpsTracker } from '../RealtimeGpsTracker';
