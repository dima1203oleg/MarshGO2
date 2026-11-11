import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CarFront, Flag, UserRound } from 'lucide-react';
import { MarshGoMap } from '../map/MarshGoMap';
import type { MapAdapter } from '../map/MapAdapter';
import { getMapLayer, setMapLayer } from '../map/mapMode';
import { productionApi, type ApiBooking, type ApiRendezvous, type ApiRendezvousApproaches } from '../services/productionApi';
import { approachStage, formatEta, formatMeters, stageText } from '../navigation/meeting';
import { distanceBetween } from '../navigation/guidance';
import type { RouteSegment } from '../map/MapAdapter';

type Point = [number, number];
const SEND_EVERY_MS = 5_000;
const POLL_EVERY_MS = 5_000;
const LOCATION_FRESH_MS = 90_000;

function isFreshLocation(location: ApiRendezvous['locations']['driver']): location is NonNullable<ApiRendezvous['locations']['driver']> {
  if (!location || location.freshness !== 'LIVE') return false;
  const ageMs = Date.now() - Date.parse(location.capturedAt);
  return Number.isFinite(ageMs) && ageMs >= -10_000 && ageMs <= LOCATION_FRESH_MS;
}

/**
 * Live meeting: the pickup point (start of the route), the driver and the passenger on one map, moving in real time,
 * with distance and time-to-arrive for each side. Both people share location only after explicit, revocable consent.
 * The server keeps positions ephemerally and pushes fresh updates to the other participant.
 */
export function MeetingMapView({ booking, initial, onClose }: { booking: ApiBooking; initial: ApiRendezvous; onClose: () => void }) {
  const [rendezvous, setRendezvous] = useState(initial);
  const [approaches, setApproaches] = useState<ApiRendezvousApproaches | null>(null);
  const [mine, setMine] = useState<Point | null>(null);
  const [other, setOther] = useState<Point | null>(null);
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const adapter = useRef<MapAdapter | null>(null);
  const lastSent = useRef(0);
  const iAmDriver = booking.current_user_is_driver;
  const sharing = rendezvous.locationSharingEnabled;
  const pickup = rendezvous.pickup.coordinates as Point;

  useEffect(() => {
    const previous = getMapLayer();
    if (previous !== 'standard') setMapLayer('standard');
    return () => { if (previous !== 'standard') setMapLayer(previous); };
  }, []);

  // The other person's position: from the canonical REST state every few seconds, and instantly from realtime pushes.
  useEffect(() => {
    let alive = true;
    const apply = (session: ApiRendezvous) => {
      setRendezvous(session);
      const location = session.locations[iAmDriver ? 'passenger' : 'driver'];
      setOther(session.locationSharingEnabled && isFreshLocation(location) ? location.coordinates as Point : null);
    };
    apply(initial);
    const poll = () => { void productionApi.bookingRendezvous(booking.id).then((session) => { if (alive) apply(session); }).catch(() => undefined); };
    poll();
    const timer = window.setInterval(poll, POLL_EVERY_MS);
    const unsubscribe = productionApi.subscribeRealtime((event) => {
      if (!event.type.startsWith('rendezvous.')) return;
      const data = (event as { data: { rendezvous_id?: string; participant?: 'driver' | 'passenger'; coordinates?: [number, number] } }).data;
      if (data.rendezvous_id !== initial.id) return;
      if (event.type === 'rendezvous.location.updated' && data.coordinates && data.participant === (iAmDriver ? 'passenger' : 'driver')) setOther(data.coordinates as Point);
      else poll();
    }, () => undefined);
    return () => { alive = false; window.clearInterval(timer); unsubscribe(); };
  }, [booking.id, initial.id, iAmDriver]);

  // The server returns actual routed approaches only while both participants
  // have consented and their coordinates are fresh. Never draw straight-line
  // substitutes or derive an ETA from a guessed walking/driving speed.
  useEffect(() => {
    if (!sharing) { setApproaches(null); return; }
    let alive = true;
    const refresh = () => { void productionApi.rendezvousApproaches(rendezvous.id)
      .then((value) => { if (alive) setApproaches(value); })
      .catch(() => { if (alive) setApproaches(null); }); };
    refresh();
    const timer = window.setInterval(refresh, POLL_EVERY_MS);
    return () => { alive = false; window.clearInterval(timer); };
  }, [sharing, rendezvous.id]);

  // Do not start location collection until both people have consented.
  useEffect(() => {
    if (!sharing) { setMine(null); return; }
    if (!('geolocation' in navigator)) { setMessage('Цей пристрій не надає геолокацію.'); return; }
    const watch = navigator.geolocation.watchPosition((position) => {
      const point: Point = [position.coords.longitude, position.coords.latitude];
      setMine(point);
      const now = Date.now();
      if (sharing && now - lastSent.current >= SEND_EVERY_MS) {
        lastSent.current = now;
        void productionApi.sendRendezvousLocation(rendezvous.id, { longitude: point[0], latitude: point[1], accuracyMeters: Math.min(1000, position.coords.accuracy || 50), capturedAt: new Date(position.timestamp).toISOString() }).catch(() => undefined);
      }
    }, (error) => setMessage(error.code === 1 ? 'Дозвольте геолокацію, щоб друга людина бачила вас на карті.' : 'Не вдалося визначити ваше місце.'), { enableHighAccuracy: true, maximumAge: 2000, timeout: 20_000 });
    return () => navigator.geolocation.clearWatch(watch);
  }, [sharing, rendezvous.id, iAmDriver]);

  const driverPoint = iAmDriver ? mine : other;
  const passengerPoint = iAmDriver ? other : mine;
  const routeSegments = useMemo<RouteSegment[]>(() => {
    if (!sharing || !approaches) return [];
    const validGeometry = (geometry: [number, number][] | null) => Array.isArray(geometry) && geometry.length >= 2
      && geometry.every((point) => Array.isArray(point) && point.length === 2 && Number.isFinite(point[0]) && Number.isFinite(point[1])
        && Math.abs(point[0]) <= 180 && Math.abs(point[1]) <= 90);
    const legs: RouteSegment[] = [];
    if (approaches.driver.approach.status === 'ROUTED' && validGeometry(approaches.driver.approach.geometry)) {
      legs.push({ coordinates: approaches.driver.approach.geometry!, color: '#1687FF', dashed: false });
    }
    if (approaches.passenger.approach.status === 'ROUTED' && validGeometry(approaches.passenger.approach.geometry)) {
      legs.push({ coordinates: approaches.passenger.approach.geometry!, color: '#10B981', dashed: false });
    }
    return legs;
  }, [approaches, sharing]);
  useEffect(() => { adapter.current?.setMeetingPoints({ pickup, driver: driverPoint, passenger: passengerPoint }); }, [pickup[0], pickup[1], driverPoint?.[0], driverPoint?.[1], passengerPoint?.[0], passengerPoint?.[1]]);
  const snapshot = useMemo(() => {
    const betweenM = driverPoint && passengerPoint ? distanceBetween(driverPoint, passengerPoint) : null;
    const driverRoute = approaches?.driver.approach;
    const passengerRoute = approaches?.passenger.approach;
    const driverToPickupM = driverRoute?.status === 'ROUTED' ? driverRoute.distanceMeters : null;
    const passengerToPickupM = passengerRoute?.status === 'ROUTED' ? passengerRoute.distanceMeters : null;
    const routeEta = (duration: number | null | undefined, distance: number | null) => distance === null || duration == null
      ? null : distance < 20 ? 0 : Math.max(1, Math.ceil(duration / 60));
    return {
      driverToPickupM, passengerToPickupM, betweenM,
      driverEtaMin: routeEta(driverRoute?.durationSeconds, driverToPickupM),
      passengerEtaMin: routeEta(passengerRoute?.durationSeconds, passengerToPickupM),
      stage: approachStage(betweenM),
    };
  }, [approaches, driverPoint?.[0], driverPoint?.[1], passengerPoint?.[0], passengerPoint?.[1]]);

  const act = async (action: 'arrived' | 'will_arrive') => {
    setBusy(true); setMessage('');
    try {
      await productionApi.rendezvousStatus(rendezvous.id, action, action === 'will_arrive' ? 2 : undefined);
      setRendezvous(await productionApi.bookingRendezvous(booking.id));
      setMessage(action === 'arrived' ? 'Повідомили, що ви на місці.' : 'Повідомили, що будете через 2 хв.');
    } catch (error) { setMessage(error instanceof Error ? error.message : 'Не вдалося надіслати статус.'); }
    finally { setBusy(false); }
  };
  const setConsent = async (enabled: boolean) => {
    setBusy(true); setMessage('');
    try {
      const updated = await productionApi.setRendezvousConsent(rendezvous.id, enabled);
      setRendezvous(updated);
      if (!enabled) setMessage('Обмін місцем зупинено.');
    }
    catch (error) { setMessage(error instanceof Error ? error.message : 'Не вдалося зберегти згоду на обмін місцем.'); }
    finally { setBusy(false); }
  };
  const notYet = Date.now() < Date.parse(rendezvous.activationAt);
  const who = iAmDriver ? booking.passenger_name : booking.driver_name;

  return <main data-testid="rendezvous-location-map" className="fixed inset-0 z-[80] overflow-hidden bg-[#dbeafe] text-[#17243a]" aria-label="Карта зустрічі">
    <div role="group" aria-label="Карта точки зустрічі" className="absolute inset-0">
      <MarshGoMap route={[]} routeSegments={routeSegments} theme="MARSHGO_LIGHT" onStatus={() => undefined} onAdapter={(next) => { adapter.current = next; next?.setMeetingPoints({ pickup, driver: driverPoint, passenger: passengerPoint }); }}/>
    </div>
    <div className="pointer-events-none absolute inset-x-4 top-[max(3.5rem,calc(env(safe-area-inset-top)+0.85rem))] z-[500] space-y-2">
      <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-white p-2 shadow-xl">
        <button type="button" onClick={onClose} aria-label="Назад" className="grid h-10 w-10 place-items-center rounded-full bg-slate-100"><ArrowLeft size={18}/></button>
        <div className="min-w-0 flex-1 px-1"><h1 className="truncate text-sm font-extrabold">Зустріч із {who}</h1><p className="truncate text-[11px] text-slate-500">Точка посадки · {rendezvous.pickup.label}</p></div>
      </div>
    </div>
    <section aria-label="Стан зустрічі" className="absolute inset-x-0 bottom-0 z-[500] rounded-t-[1.8rem] bg-white px-5 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4 shadow-[0_-12px_35px_rgba(14,37,70,.18)]">
      <p data-testid="meeting-stage" className="text-center text-sm font-extrabold">{snapshot.stage ? stageText[snapshot.stage] : sharing ? `Чекаємо, поки ${iAmDriver ? 'пасажир' : 'водій'} поділиться місцем…` : 'Обмін місцем ще не увімкнено'}</p>
      {snapshot.betweenM !== null && <p data-testid="meeting-between" className="mt-0.5 text-center text-xs text-slate-500">Між вами по прямій {formatMeters(snapshot.betweenM)}</p>}
      {sharing && <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-2xl bg-[#EAF3FF] p-3" data-testid="meeting-driver-card"><p className="flex items-center gap-1.5 text-[11px] font-bold text-[#1789F4]"><CarFront size={14}/>{iAmDriver ? 'Ви (водій)' : 'Водій'}{' '}<span className="ml-auto rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-800">{driverPoint ? '· наживо' : '· GPS очікується'}</span></p>
          <p className="mt-1 text-xl font-extrabold">{formatEta(snapshot.driverEtaMin)}</p><p className="text-[11px] text-slate-500">{!driverPoint ? 'місце ще не надійшло' : approaches?.driver.approach.status === 'ROUTED' ? `До посадки · ${formatMeters(snapshot.driverToPickupM)} маршрутом` : 'Маршрут до посадки недоступний'}</p></div>
        <div className="rounded-2xl bg-emerald-50 p-3" data-testid="meeting-passenger-card"><p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-700"><UserRound size={14}/>{iAmDriver ? 'Пасажир' : 'Ви (пасажир)'}{' '}<span className="ml-auto rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">{passengerPoint ? '· наживо' : '· GPS очікується'}</span></p>
          <p className="mt-1 text-xl font-extrabold">{formatEta(snapshot.passengerEtaMin)}</p><p className="text-[11px] text-slate-500">{!passengerPoint ? 'місце ще не надійшло' : approaches?.passenger.approach.status === 'ROUTED' ? `До посадки · ${formatMeters(snapshot.passengerToPickupM)} маршрутом` : 'Маршрут до посадки недоступний'}</p></div>
      </div>}
      {sharing && <p className="mt-2 flex items-center justify-center gap-1.5 text-[11px] text-slate-500"><Flag size={12} className="text-rose-600"/>Місце зустрічі — початок маршруту поїздки</p>}
      {message && <p role="status" className="mt-2 rounded-xl bg-amber-50 p-2.5 text-xs text-amber-900">{message}</p>}
      {!sharing ? <div className="mt-3">
        {rendezvous.currentParticipantConsent
          ? <><p role="status" className="mb-2 text-center text-xs font-semibold text-slate-600">Вашу згоду збережено. Очікуємо окрему згоду другого учасника.</p><button type="button" disabled={busy} onClick={() => void setConsent(false)} className="w-full rounded-2xl border border-slate-200 bg-white py-3 text-sm font-bold text-slate-700 disabled:opacity-50">Скасувати мою згоду</button></>
          : <button type="button" disabled={busy || notYet} onClick={() => void setConsent(true)} className="w-full rounded-2xl bg-[#1789F4] py-3.5 text-sm font-bold text-white disabled:opacity-50">{notYet ? `Обмін місцем стане доступним о ${new Intl.DateTimeFormat('uk-UA', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Kyiv' }).format(new Date(rendezvous.activationAt))}` : 'Дозволити короткочасний обмін GPS'}</button>}
      </div> : <div className="mt-3 space-y-2"><div className="grid grid-cols-2 gap-2"><button type="button" disabled={busy} onClick={() => void act('arrived')} className="rounded-2xl bg-emerald-600 py-3.5 text-sm font-bold text-white disabled:opacity-50">Я на місці</button><button type="button" disabled={busy} onClick={() => void act('will_arrive')} className="rounded-2xl border border-slate-200 bg-white py-3.5 text-sm font-bold text-slate-700 disabled:opacity-50">Буду через 2 хв</button></div><button type="button" disabled={busy} onClick={() => void setConsent(false)} className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 disabled:opacity-50">Припинити обмін GPS</button></div>}
    </section>
  </main>;
}
