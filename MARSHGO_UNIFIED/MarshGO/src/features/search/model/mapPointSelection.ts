import type { ApiPlace } from '../../../services/productionApi';

/** A map-selected coordinate remains usable when reverse geocoding is offline. */
export function coordinateMapPlace(latitude: number, longitude: number): ApiPlace {
  return {
    label: `Точка на мапі (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
    latitude,
    longitude,
    providerId: 'map-pin',
  };
}

/** Do not misreport device/signal failures as a denied browser permission. */
export function geolocationFailureMessage(code?: number): string {
  if (code === 1) return 'Браузер або налаштування пристрою відхилили доступ до геолокації.';
  if (code === 2) return 'Пристрій не повернув координати. Перевірте системні служби геолокації та спробуйте ще раз.';
  if (code === 3) return 'Не вдалося отримати координати вчасно. Спробуйте ще раз.';
  return 'Не вдалося отримати координати. Перевірте доступ сайту й системні служби геолокації.';
}
