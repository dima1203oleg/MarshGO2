import { z } from 'zod';

export const mapAssetManifestSchema = z.object({
  schemaVersion: z.literal(1), mapDataVersion: z.string().min(1), styleVersion: z.string().min(1),
  mapDataUrl: z.string().url(),
  // Manifests may publish additional versioned themes (for example 3D or
  // satellite variants). Rejecting unknown keys made the whole map fail even
  // when the active 2D style was valid.
  styles: z.record(z.string().min(1), z.string().url()),
}).superRefine((manifest, context) => {
  for (const [name, url] of Object.entries(manifest.styles)) {
    if (!/(?:\/v\d+\.\d+\.\d+\/|\/20\d{2}-\d{2}-\d{2}\/)/.test(new URL(url).pathname)) {
      context.addIssue({ code: 'custom', path: ['styles', name], message: 'Map style URLs must be immutable and versioned' });
    }
  }
  if (!/(?:\/v\d+\.\d+\.\d+\/|\/20\d{2}-\d{2}-\d{2}\/)/.test(new URL(manifest.mapDataUrl).pathname)) {
    context.addIssue({ code: 'custom', path: ['mapDataUrl'], message: 'Map data URL must be immutable and versioned' });
  }
});
export type MapAssetManifest = z.infer<typeof mapAssetManifestSchema>;

/** Navigation can reuse the city theme's base map when a manifest does not publish a dedicated navigation variant. */
export function styleForMapTheme(styles: Record<string, string>, theme: string): string | undefined {
  const exact = styles[theme];
  if (exact) return exact;
  const navigationTheme = theme.match(/^MARSHGO_NAVIGATION_(LIGHT|DARK)$/);
  if (!navigationTheme) return undefined;
  return styles[`MARSHGO_${navigationTheme[1]}`];
}

export function styleForMapLayer(
  styles: Record<string, string>,
  theme: string,
  layer: 'standard' | 'navigation',
): string | undefined {
  const palette = theme.endsWith('_DARK') ? 'DARK' : 'LIGHT';
  if (layer === 'navigation') return styles[`MARSHGO_3D_${palette}`] ?? styleForMapTheme(styles, theme);
  return styleForMapTheme(styles, theme);
}

export function parseMapAssetManifest(value: unknown): MapAssetManifest { return mapAssetManifestSchema.parse(value); }
