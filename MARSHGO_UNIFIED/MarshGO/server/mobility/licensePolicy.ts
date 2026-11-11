/**
 * A provider's public URL or a non-empty license label does not by itself
 * establish commercial reuse. Return null when the supplied label is not a
 * license identifier whose terms can be recognized here.
 */
export function commercialUseFromLicense(license: string | null | undefined): boolean | null {
  if (!license?.trim()) return null;
  const value = license.trim().replaceAll('_', ' ').toLocaleLowerCase('en');
  if (/\bnon[ -]?commercial\b|\bcc[ -]?by[ -]?nc(?:[ -]?(?:sa|nd))?\b/.test(value)) return false;
  if (/\bcommercial use permitted\b/.test(value)) return true;
  if (/\bcc[ -]?0\b|\bcc[ -]?by(?:[ -]?(?:sa|nd))?(?:\s*\d(?:\.\d)?)?\b/.test(value)) return true;
  if (/\bodbl\b|open database license|\bodc[ -]?by\b|open data commons attribution license|\bpddl\b/.test(value)) return true;
  return null;
}
