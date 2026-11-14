export function buildPartnerQuery(search = '', status = ''): string {
  const params = new URLSearchParams();
  if (search.trim()) params.set('search', search.trim());
  if (status) params.set('status', status);
  const query = params.toString();
  return query ? `?${query}` : '';
}
