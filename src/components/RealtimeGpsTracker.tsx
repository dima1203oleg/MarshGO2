import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import {
  Navigation,
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Radio,
  Clock,
  MapPin,
  Volume2,
  VolumeX,
  Gauge,
  Compass,
  CheckCircle2,
  Crosshair,
} from 'lucide-react';
import {
  Coordinate,
  ScheduledStop,
  GpsTelemetry,
  DEFAULT_POLYLINE_COORDINATES,
  DEFAULT_SCHEDULED_STOPS,
  calculatePolylineTotalDistance,
  getInterpolatedPositionAtDistance,
  findNextScheduledStop,
  calculateHaversineDistance,
} from '../services/gpsSimulationService';
import { triggerRatchetTick } from '../utils/haptics';
import { TransitRoute } from '../types/marshgo';

interface RealtimeGpsTrackerProps {
  map: L.Map | null;
  polylineCoordinates?: Coordinate[];
  scheduledStops?: ScheduledStop[];
  route: TransitRoute;
  isNavigating?: boolean;
  onTelemetryUpdate?: (telemetry: GpsTelemetry) => void;
  className?: string;
}

export const RealtimeGpsTracker: React.FC<RealtimeGpsTrackerProps> = ({
  map,
  polylineCoordinates = DEFAULT_POLYLINE_COORDINATES,
  scheduledStops = DEFAULT_SCHEDULED_STOPS,
  route,
  isNavigating = false,
  onTelemetryUpdate,
  className = '',
}) => {
  // Total scheduled route distance
  const totalRouteDistKm = useRef(calculatePolylineTotalDistance(polylineCoordinates)).current;

  // Simulation controls state
  const [isPlaying, setIsPlaying] = useState(true);
  const [speedMultiplier, setSpeedMultiplier] = useState<1 | 2 | 5 | 10>(1);
  const [autoFollow, setAutoFollow] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Traveled distance in km (starts at ~85 km along the route to show mid-journey progress, or 0)
  const [traveledDistKm, setTraveledDistKm] = useState(92);
  const [currentSpeed, setCurrentSpeed] = useState(76); // km/h
  const [pingCountdown, setPingCountdown] = useState(3); // 3-second cycle countdown
  const [lastPingTime, setLastPingTime] = useState<string>('щойно');
  const [pingPulse, setPingPulse] = useState(false);

  // Map layer references
  const busMarkerRef = useRef<L.Marker | null>(null);
  const traveledPolylineRef = useRef<L.Polyline | null>(null);
  const pulseCircleRef = useRef<L.CircleMarker | null>(null);
  const pingIntervalRef = useRef<any>(null);
  const countdownIntervalRef = useRef<any>(null);

  // Calculate current telemetry from traveled distance
  const currentInterpolation = getInterpolatedPositionAtDistance(
    polylineCoordinates,
    traveledDistKm
  );
  const currentCoords = currentInterpolation.coords;
  const currentBearing = currentInterpolation.bearing;
  const traveledPath = currentInterpolation.traveledPath;

  const nextStopInfo = findNextScheduledStop(
    currentCoords,
    scheduledStops,
    traveledDistKm,
    totalRouteDistKm
  );

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.round((traveledDistKm / totalRouteDistKm) * 100))
  );

  // Sync telemetry upward if callback provided
  useEffect(() => {
    if (onTelemetryUpdate) {
      onTelemetryUpdate({
        currentCoords,
        bearing: currentBearing,
        speedKmh: currentSpeed,
        distanceTraveledKm: Math.round(traveledDistKm * 10) / 10,
        totalDistanceKm: Math.round(totalRouteDistKm * 10) / 10,
        progressPercent,
        nextStop: nextStopInfo.nextStop,
        nextStopDistanceKm: nextStopInfo.nextStopDistKm,
        nextStopEtaMinutes: nextStopInfo.nextStopEtaMinutes,
        timeRemainingMinutes: Math.round(((totalRouteDistKm - traveledDistKm) / Math.max(40, currentSpeed)) * 60),
        lastPingTimestamp: Date.now(),
        pingCountdownSeconds: pingCountdown,
        satelliteCount: 11,
        accuracyMeters: 2.8,
        status: isPlaying ? 'active' : 'paused',
        traveledPath,
      });
    }
  }, [traveledDistKm, currentSpeed, isPlaying, pingCountdown]);

  // Center on bus helper
  const handleCenterOnBus = useCallback(() => {
    if (!map) return;
    map.flyTo(currentCoords, Math.max(map.getZoom(), 11), {
      duration: 1.2,
      easeLinearity: 0.25,
    });
    if (soundEnabled) {
      triggerRatchetTick('minute');
    }
  }, [map, currentCoords, soundEnabled]);

  // Create or update Leaflet layers for moving bus
  useEffect(() => {
    if (!map) return;

    // 1. Traveled polyline layer (active traversed path with emerald glow)
    if (!traveledPolylineRef.current) {
      const line = L.polyline(traveledPath, {
        color: '#10B981', // Emerald green
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);
      traveledPolylineRef.current = line;
    } else {
      traveledPolylineRef.current.setLatLngs(traveledPath as L.LatLngExpression[]);
    }

    // 2. Bus Marker with heading rotation & radar pulse
    const iconHtml = `
      <div class="relative flex items-center justify-center" style="width: 48px; height: 48px;">
        <!-- Pulsing radar wave -->
        <div class="absolute inset-0 rounded-full bg-blue-500/30 animate-ping pointer-events-none"></div>
        <div class="absolute inset-1 rounded-full bg-emerald-500/20 animate-pulse pointer-events-none"></div>

        <!-- Rotated Bus Vehicle Vessel -->
        <div 
          class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 text-white shadow-xl border-2 border-white flex items-center justify-center transition-transform duration-1000 ease-out"
          style="transform: rotate(${currentBearing - 90}deg); box-shadow: 0 4px 16px rgba(37, 99, 235, 0.45);"
        >
          <span style="font-size: 19px; line-height: 1; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4));">🚌</span>
        </div>

        <!-- Floating live speed badge -->
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-slate-700 shadow-md whitespace-nowrap pointer-events-none">
          ${currentSpeed} км/г
        </div>

        <!-- Bearing arrow pointer -->
        <div 
          class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-500 rounded-full border border-white shadow-xs pointer-events-none"
        ></div>
      </div>
    `;

    const busIcon = L.divIcon({
      html: iconHtml,
      className: 'marshgo-gps-bus-marker',
      iconSize: [48, 48],
      iconAnchor: [24, 24],
    });

    if (!busMarkerRef.current) {
      const marker = L.marker(currentCoords as L.LatLngExpression, {
        icon: busIcon,
        zIndexOffset: 1000,
      }).addTo(map);

      // Popup with telemetry
      marker.bindPopup(`
        <div style="font-family: system-ui, -apple-system, sans-serif; padding: 4px; min-width: 190px;">
          <div style="font-weight: 800; font-size: 13px; color: #1e293b; margin-bottom: 2px;">
            🚌 ${route.title || 'Автобус М-06'}
          </div>
          <div style="font-size: 11px; color: #059669; font-weight: 700; margin-bottom: 6px;">
            ● GPS-сигнал активний (кожні 3с)
          </div>
          <div style="font-size: 11px; color: #475569; display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span>Швидкість:</span>
            <strong>${currentSpeed} км/год</strong>
          </div>
          <div style="font-size: 11px; color: #475569; display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span>Пройдено:</span>
            <strong>${Math.round(traveledDistKm)} / ${Math.round(totalRouteDistKm)} км</strong>
          </div>
          <div style="font-size: 11px; color: #475569; display: flex; justify-content: space-between; margin-bottom: 3px;">
            <span>Наступна зупинка:</span>
            <strong>${nextStopInfo.nextStop.city}</strong>
          </div>
          <div style="font-size: 10px; color: #64748b; margin-top: 6px; padding-top: 4px; border-top: 1px solid #e2e8f0;">
            Координати: ${currentCoords[0].toFixed(4)}°, ${currentCoords[1].toFixed(4)}°
          </div>
        </div>
      `);

      busMarkerRef.current = marker;
    } else {
      busMarkerRef.current.setLatLng(currentCoords as L.LatLngExpression);
      busMarkerRef.current.setIcon(busIcon);
    }

    // Auto-follow map pan if enabled
    if ((autoFollow || isNavigating) && map) {
      map.panTo(currentCoords as L.LatLngExpression, {
        animate: true,
        duration: 1.0,
      });
    }
  }, [
    map,
    currentCoords,
    currentBearing,
    currentSpeed,
    traveledDistKm,
    autoFollow,
    isNavigating,
    route.title,
    traveledPath,
  ]);

  // Clean up Leaflet layers on unmount
  useEffect(() => {
    return () => {
      if (busMarkerRef.current && map) {
        map.removeLayer(busMarkerRef.current);
      }
      if (traveledPolylineRef.current && map) {
        map.removeLayer(traveledPolylineRef.current);
      }
      if (pulseCircleRef.current && map) {
        map.removeLayer(pulseCircleRef.current);
      }
    };
  }, [map]);

  // 3-SECOND GPS SIMULATION TIMER LOOP
  useEffect(() => {
    if (!isPlaying) return;

    // GPS telemetry tick interval: exactly 3000 ms (3 seconds)
    const tickInterval = 3000;

    const runGpsTick = () => {
      setTraveledDistKm((prevDist) => {
        // Distance covered in 3 seconds at current speed (km/h) * multiplier
        // distance (km) = speed (km/h) * (time (s) / 3600)
        const stepSeconds = (tickInterval / 1000) * speedMultiplier;
        const deltaKm = (currentSpeed * stepSeconds) / 3600;
        const nextDist = prevDist + deltaKm;

        // Loop back to start if finished
        if (nextDist >= totalRouteDistKm) {
          return 0;
        }
        return nextDist;
      });

      // Fluctuate speed realistically (68 - 84 km/h)
      setCurrentSpeed((prevSpeed) => {
        const jitter = (Math.random() - 0.5) * 5;
        const updated = Math.round(prevSpeed + jitter);
        return Math.min(88, Math.max(62, updated));
      });

      // Pulse visual indicator
      setPingPulse(true);
      setTimeout(() => setPingPulse(false), 600);

      const now = new Date();
      setLastPingTime(
        `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString()
          .padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`
      );

      // Sound / Ratchet tick if unmuted
      if (soundEnabled) {
        triggerRatchetTick('minute');
      }

      setPingCountdown(3);
    };

    pingIntervalRef.current = setInterval(runGpsTick, tickInterval);

    // 1-second countdown sub-timer for the UI progress bar (3... 2... 1...)
    countdownIntervalRef.current = setInterval(() => {
      setPingCountdown((prev) => (prev > 1 ? prev - 1 : 3));
    }, 1000);

    return () => {
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
    };
  }, [isPlaying, speedMultiplier, currentSpeed, totalRouteDistKm, soundEnabled]);

  // Reset simulation to start
  const handleReset = () => {
    setTraveledDistKm(0);
    setCurrentSpeed(74);
    setPingCountdown(3);
    if (soundEnabled) {
      triggerRatchetTick('hour');
    }
    if (map) {
      map.flyTo(polylineCoordinates[0], 12);
    }
  };

  return (
    <div
      className={`marshgo-gps-tracker-hud pointer-events-auto transition-all duration-300 ${className}`}
    >
      {/* HUD Container Card */}
      <div className="bg-slate-900/92 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl p-3 shadow-2xl space-y-2.5 max-w-[360px] w-full">
        {/* Top Header: GPS Live Status & Pulse */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  isPlaying ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  isPlaying ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </span>
            <div>
              <div className="text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <span>GPS ТРЕКІНГ (3с)</span>
                {pingPulse && (
                  <span className="text-[9px] bg-emerald-500 text-slate-950 px-1 py-0.2 rounded-xs font-black animate-pulse">
                    PING!
                  </span>
                )}
              </div>
              <div className="text-[9px] text-slate-400 font-medium">
                {isPlaying ? `Оновлено: ${lastPingTime} • 11 супутників` : 'Симуляція призупинена'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {/* Center on bus button */}
            <button
              onClick={handleCenterOnBus}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-all active:scale-95"
              title="Перейти до автобуса"
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>

            {/* Mute/Sound toggle */}
            <button
              onClick={() => {
                const nextSound = !soundEnabled;
                setSoundEnabled(nextSound);
                if (nextSound) triggerRatchetTick('minute');
              }}
              className={`p-1.5 rounded-lg border transition-all active:scale-95 ${
                soundEnabled
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}
              title={soundEnabled ? 'Вимкнути звук тріскачки' : 'Увімкнути звук тріскачки при GPS-пінгах'}
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5" />
              ) : (
                <VolumeX className="w-3.5 h-3.5" />
              )}
            </button>

            {/* Collapse / Expand toggle */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold border border-slate-700"
            >
              {isCollapsed ? 'Розгорнути' : 'Згорнути'}
            </button>
          </div>
        </div>

        {/* 3-Second Heartbeat Progress Bar */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[10px] text-slate-400">
            <span className="flex items-center gap-1">
              <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
              <span>Наступний GPS-пінг:</span>
            </span>
            <span className="font-mono font-bold text-emerald-400">
              {isPlaying ? `${pingCountdown}с` : 'Пауза'}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-teal-400 to-emerald-400 transition-all duration-1000 ease-linear rounded-full"
              style={{
                width: isPlaying ? `${((4 - pingCountdown) / 3) * 100}%` : '0%',
              }}
            />
          </div>
        </div>

        {/* Expandable Telemetry Details */}
        {!isCollapsed && (
          <>
            {/* Live Telemetry Grid */}
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-[9px] text-slate-400 font-bold uppercase flex items-center justify-center gap-1">
                  <Gauge className="w-3 h-3 text-blue-400" />
                  <span>Швидкість</span>
                </div>
                <div className="text-sm font-black text-white mt-0.5">
                  {currentSpeed}{' '}
                  <span className="text-[9px] font-normal text-slate-400">км/г</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-[9px] text-slate-400 font-bold uppercase flex items-center justify-center gap-1">
                  <Compass className="w-3 h-3 text-amber-400" />
                  <span>Азимут</span>
                </div>
                <div className="text-sm font-black text-white mt-0.5">
                  {Math.round(currentBearing)}°
                </div>
              </div>

              <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-center">
                <div className="text-[9px] text-slate-400 font-bold uppercase flex items-center justify-center gap-1">
                  <Clock className="w-3 h-3 text-emerald-400" />
                  <span>ETA</span>
                </div>
                <div className="text-sm font-black text-emerald-400 mt-0.5">
                  {nextStopInfo.nextStopEtaMinutes}{' '}
                  <span className="text-[9px] font-normal text-slate-400">хв</span>
                </div>
              </div>
            </div>

            {/* Route Progress Bar (against scheduled path) */}
            <div className="p-2.5 rounded-xl bg-slate-800/70 border border-slate-700 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <div className="font-bold text-slate-200 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Прогрес маршруту:</span>
                </div>
                <div className="font-black text-blue-400">
                  {progressPercent}%{' '}
                  <span className="text-[9px] text-slate-400 font-normal">
                    ({Math.round(traveledDistKm)} / {Math.round(totalRouteDistKm)} км)
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-700/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Next stop indicator */}
              <div className="flex items-center justify-between text-[10px] text-slate-300 pt-0.5">
                <span className="truncate">
                  Наступна зупинка: <strong>{nextStopInfo.nextStop.name}</strong>
                </span>
                <span className="text-slate-400 shrink-0 font-mono">
                  {nextStopInfo.nextStopDistKm} км
                </span>
              </div>
            </div>

            {/* Simulation Controls Row */}
            <div className="flex items-center justify-between gap-1.5 pt-1">
              {/* Play / Pause */}
              <button
                onClick={() => {
                  setIsPlaying(!isPlaying);
                  if (soundEnabled) triggerRatchetTick('minute');
                }}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3.5 h-3.5" />
                    <span>Пауза</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Продовжити</span>
                  </>
                )}
              </button>

              {/* Speed Multiplier */}
              <div className="flex items-center bg-slate-800 rounded-xl p-0.5 border border-slate-700">
                {([1, 2, 5, 10] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      setSpeedMultiplier(m);
                      if (soundEnabled) triggerRatchetTick('minute');
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-black transition-all ${
                      speedMultiplier === m
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {m}x
                  </button>
                ))}
              </div>

              {/* Reset to Start */}
              <button
                onClick={handleReset}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-all active:scale-95"
                title="Перезапустити з початку"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
