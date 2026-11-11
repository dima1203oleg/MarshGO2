import React, { useState, useEffect, useRef } from 'react';
import { ArrowDownUp, Crosshair, Map, MapPin, X } from 'lucide-react';
import type { RoutePlace } from '../model/types';
import { productionApi, type ApiPlace } from '../../../services/productionApi';

interface RouteInputsProps {
  origin: RoutePlace;
  destination: RoutePlace;
  onOriginChange: (place: RoutePlace) => void;
  onDestinationChange: (place: RoutePlace) => void;
  onOpenMapPicker?: (field: 'origin' | 'destination') => void;
  compact?: boolean;
}

const listboxId = 'route-place-suggestions';
const optionId = (index: number) => `${listboxId}-option-${index}`;

export const RouteInputs: React.FC<RouteInputsProps> = ({
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onOpenMapPicker,
  compact = false,
}) => {
  const [activeField, setActiveField] = useState<'origin' | 'destination' | null>(null);
  const [originText, setOriginText] = useState(origin.label);
  const [destText, setDestText] = useState(destination.label);
  const [suggestions, setSuggestions] = useState<ApiPlace[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [detectingGps, setDetectingGps] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setOriginText(origin.label);
  }, [origin.label]);

  useEffect(() => {
    setDestText(destination.label);
  }, [destination.label]);

  const fetchSuggestions = (query: string) => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (!query.trim() || query.trim().length < 2) {
      setSuggestions([]);
      setLoadingSuggestions(false);
      return;
    }
    setLoadingSuggestions(true);
    debounceTimer.current = setTimeout(async () => {
      try {
        const results = await productionApi.suggestPlaces(query.trim());
        setSuggestions(results);
        setHighlighted(results.length ? 0 : -1);
      } catch {
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 200);
  };

  const commitSuggestion = (place: ApiPlace) => {
    const selected: RoutePlace = {
      label: place.label,
      latitude: place.latitude,
      longitude: place.longitude,
      providerId: place.providerId,
    };
    if (activeField === 'origin') {
      setOriginText(place.label);
      onOriginChange(selected);
    } else if (activeField === 'destination') {
      setDestText(place.label);
      onDestinationChange(selected);
    }
    setActiveField(null);
    setSuggestions([]);
    setHighlighted(-1);
  };

  const handleSuggestionKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!suggestions.length) return;
      event.preventDefault();
      const next = event.key === 'ArrowDown'
        ? (highlighted + 1) % suggestions.length
        : (highlighted - 1 + suggestions.length) % suggestions.length;
      setHighlighted(next);
      return;
    }
    if (event.key === 'Enter') {
      if (!suggestions.length) return;
      event.preventDefault();
      commitSuggestion(suggestions[highlighted >= 0 ? highlighted : 0]);
      return;
    }
    if (event.key === 'Escape') {
      setActiveField(null);
      setSuggestions([]);
      setHighlighted(-1);
    }
  };

  const handleGpsCurrentLocation = () => {
    if (!navigator.geolocation) return;
    setDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const reverse = await productionApi.reverseGeocode(latitude, longitude);
          const label = reverse.label || 'Моє місцеперебування';
          setOriginText(label);
          onOriginChange({ label, latitude, longitude, providerId: reverse.providerId });
        } catch {
          setOriginText('Моє місцеперебування');
          onOriginChange({ label: 'Моє місцеперебування', latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        } finally {
          setDetectingGps(false);
        }
      },
      () => {
        setOriginText('Моє місцеперебування');
        onOriginChange({ label: 'Моє місцеперебування' });
        setDetectingGps(false);
      },
      { enableHighAccuracy: true, timeout: 6000 }
    );
  };

  const handleClearOrigin = () => {
    setOriginText('');
    onOriginChange({ label: '' });
  };

  const handleClearDestination = () => {
    setDestText('');
    onDestinationChange({ label: '' });
  };

  const handleSwap = () => {
    const prevOrigin = origin;
    const prevOriginText = originText;
    setOriginText(destText);
    setDestText(prevOriginText);
    onOriginChange(destination);
    onDestinationChange(prevOrigin);
  };

  return (
    <div className="relative">
      {/* 1. Origin Row (Звідки) */}
      <div className={`flex items-center gap-3 px-4 ${compact ? 'py-2' : 'py-3'}`}>
        <span className="h-3 w-3 rounded-full bg-[#0066FF] ring-4 ring-blue-50 dark:ring-blue-950/80 shrink-0" />
        <div className="min-w-0 flex-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
            Звідки
          </label>
          <input
            type="text"
            required
            aria-label="Звідки"
            aria-expanded={activeField === 'origin' && suggestions.length > 0}
            aria-controls={activeField === 'origin' ? listboxId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              activeField === 'origin' && highlighted >= 0 && suggestions[highlighted] ? optionId(highlighted) : undefined
            }
            value={originText}
            placeholder="Моє місцеперебування"
            onKeyDown={handleSuggestionKeyDown}
            onFocus={() => {
              setActiveField('origin');
              fetchSuggestions(originText);
            }}
            onChange={(e) => {
              setOriginText(e.target.value);
              onOriginChange({ label: e.target.value });
              fetchSuggestions(e.target.value);
            }}
            className="w-full bg-transparent pt-1 text-[14px] font-black text-[#0B1730] dark:text-white placeholder:text-slate-400 placeholder:font-medium outline-none truncate"
          />
        </div>

        {/* Right action buttons for Origin: [✕ clear] [🗺️ map] [◎ gps] [⇅ swap] */}
        <div className="flex items-center gap-1.5 shrink-0">
          {originText ? (
            <button
              type="button"
              onClick={handleClearOrigin}
              title="Очистити адресу"
              className="grid h-11 w-11 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 transition"
              aria-label="Очистити адресу звідки"
            >
              <X size={15} />
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => onOpenMapPicker?.('origin')}
            title="Показати на карті: Відкрити карту для вибору адреси"
            className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50/60 dark:bg-blue-950/40 text-[#0066FF] dark:text-blue-400 hover:bg-blue-100/70 transition"
            aria-label="Обрати точку звідки на карті"
          >
            <Map size={16} strokeWidth={2.4} />
          </button>

          <button
            type="button"
            onClick={handleGpsCurrentLocation}
            title="Геолокація: Визначити моє поточне місцеперебування"
            className={`grid h-11 w-11 place-items-center rounded-xl bg-blue-50/60 dark:bg-blue-950/40 text-[#0066FF] dark:text-blue-400 hover:bg-blue-100/70 transition ${
              detectingGps ? 'animate-spin' : ''
            }`}
            aria-label="Визначити поточну геолокацію"
          >
            <Crosshair size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-slate-100 dark:border-slate-800/80" />

      {/* 2. Destination Row (Куди) */}
      <div className={`flex items-center gap-3 px-4 ${compact ? 'py-2' : 'py-3'}`}>
        <span className="h-3 w-3 rounded-full bg-[#E73C59] ring-4 ring-rose-50 dark:ring-rose-950/80 shrink-0" />
        <div className="min-w-0 flex-1">
          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 leading-none">
            Куди
          </label>
          <input
            type="text"
            required
            aria-label="Куди"
            aria-expanded={activeField === 'destination' && suggestions.length > 0}
            aria-controls={activeField === 'destination' ? listboxId : undefined}
            aria-autocomplete="list"
            aria-activedescendant={
              activeField === 'destination' && highlighted >= 0 && suggestions[highlighted] ? optionId(highlighted) : undefined
            }
            value={destText}
            placeholder="Введіть адресу, місто або зупинку"
            onKeyDown={handleSuggestionKeyDown}
            onFocus={() => {
              setActiveField('destination');
              fetchSuggestions(destText);
            }}
            onChange={(e) => {
              setDestText(e.target.value);
              onDestinationChange({ label: e.target.value });
              fetchSuggestions(e.target.value);
            }}
            className="w-full bg-transparent pt-1 text-[14px] font-black text-[#0B1730] dark:text-white placeholder:text-slate-400 placeholder:font-medium outline-none truncate"
          />
        </div>

        {/* Right action buttons for Destination: [✕ clear] [🗺️ map] [⇅ swap] */}
        <div className="flex items-center gap-1.5 shrink-0">
          {destText ? (
            <button
              type="button"
              onClick={handleClearDestination}
              title="Очистити адресу"
              className="grid h-11 w-11 place-items-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 transition"
              aria-label="Очистити адресу куди"
            >
              <X size={15} />
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => onOpenMapPicker?.('destination')}
            title="Показати на карті: Відкрити карту для вибору адреси"
            className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50/60 dark:bg-blue-950/40 text-[#0066FF] dark:text-blue-400 hover:bg-blue-100/70 transition"
            aria-label="Обрати точку куди на карті"
          >
            <Map size={16} strokeWidth={2.4} />
          </button>

          <button
            type="button"
            onClick={handleSwap}
            title="Поміняти місцями початковий пункт і призначення"
            className="grid h-11 w-11 place-items-center rounded-xl border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-blue-50 hover:text-[#0066FF] transition active:scale-90"
            aria-label="Поміняти місцями куди і звідки"
          >
            <ArrowDownUp size={14} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* Autocomplete Suggestions Dropdown */}
      {activeField && (loadingSuggestions || suggestions.length > 0) && (
        <div
          id={listboxId}
          role="listbox"
          aria-label={activeField === 'origin' ? 'Підказки початкової точки' : 'Підказки пункту призначення'}
          aria-busy={loadingSuggestions}
          className="border-t border-slate-100 dark:border-slate-800 p-2 space-y-1 max-h-56 overflow-y-auto"
        >
          {loadingSuggestions ? (
            <p role="status" className="px-2.5 py-3 text-xs text-slate-500 dark:text-slate-400">Шукаємо адресу…</p>
          ) : suggestions.map((s, idx) => (
            <button
              key={`${s.label}-${idx}`}
              type="button"
              id={optionId(idx)}
              role="option"
              aria-selected={idx === highlighted}
              data-highlighted={idx === highlighted ? 'true' : 'false'}
              onMouseEnter={() => setHighlighted(idx)}
              onClick={() => commitSuggestion(s)}
              className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                idx === highlighted ? 'bg-blue-50/70 dark:bg-slate-800/80' : 'hover:bg-blue-50/70 dark:hover:bg-slate-800/80'
              }`}
            >
              <MapPin size={15} className="text-[#0066FF] shrink-0" />
              <div className="min-w-0 flex-1">
                <span className="block text-xs font-bold text-[#0B1730] dark:text-white truncate">
                  {s.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
