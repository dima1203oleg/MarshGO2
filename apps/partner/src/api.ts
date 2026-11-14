const apiOrigin = import.meta.env.VITE_API_BASE_URL ?? '';
let accessToken: string | null = null;
const devPreviewAuthAvailable = import.meta.env.DEV;
let devPreviewSessionActive = false;
export type User = { id: string; display_name: string; roles: string[] };
export type Organization = {
  id: string; display_name: string; legal_name: string; organization_status: string;
  dispatch_mode: 'INTEGRATION_ONLY'|'NATIVE_DISPATCH'; membership_status: string; role: string;
  application_id: string|null; application_status: string|null; city: string|null; application_created_at: string|null;
  service_modes: string[];
};
export type ApplicationInput = {
  displayName: string; legalName: string; city: string; contactEmail?: string; contactPhone?: string;
  website?: string; serviceModes: string[]; dispatchMode: 'INTEGRATION_ONLY'|'NATIVE_DISPATCH';
};

async function request<T>(path: string, init: RequestInit = {}, retryAuth = true): Promise<T> {
  if (devPreviewAuthAvailable && devPreviewSessionActive) {
    throw new Error('Server API вимкнене в локальному режимі перегляду.');
  }
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('content-type')) headers.set('content-type','application/json');
  if (accessToken) headers.set('authorization',`Bearer ${accessToken}`);
  const response = await fetch(`${apiOrigin}/api/v1${path}`, { ...init, headers, credentials: 'include' });
  const body = await response.json().catch(() => null) as { data?: T; error?: { message?: string } } | null;
  if (response.status === 401 && retryAuth && accessToken && !path.startsWith('/auth/')) {
    try { const session=await request<{user:User;accessToken:string}>('/auth/refresh',{method:'POST'},false); accessToken=session.accessToken; return request<T>(path,init,false); }
    catch { accessToken=null; }
  }
  if (!response.ok) throw new Error(body?.error?.message ?? `Запит не виконано (${response.status})`);
  return (body as {data:T}).data;
}
export const api = {
  isDevPreviewSession: () => devPreviewAuthAvailable && devPreviewSessionActive,
  enterDevPreviewSession: (): User | null => {
    if (!devPreviewAuthAvailable) return null;
    accessToken = null;
    devPreviewSessionActive = true;
    return { id: 'dev-preview-partner', display_name: 'Partner UI preview', roles: ['partner'] };
  },
  restore: async () => { const session=await request<{user:User;accessToken:string}>('/auth/refresh',{method:'POST'}); accessToken=session.accessToken; return session.user; },
  login: async (email: string, password: string) => { const session=await request<{user:User;accessToken:string}>('/auth/login',{method:'POST',body:JSON.stringify({email,password})}); accessToken=session.accessToken; return session.user; },
  logout: async () => {
    if (devPreviewSessionActive) { accessToken = null; devPreviewSessionActive = false; return; }
    try { await request('/auth/logout',{method:'POST'}); } finally { accessToken=null; }
  },
  organizations: () => request<Organization[]>('/partner/organizations'),
  apply: (input:ApplicationInput) => request<{organization:Organization;application:{id:string;status:string};serviceModes:string[]}>('/partner/applications',{method:'POST',body:JSON.stringify(input)}),
  permissions: (id:string) => request<{organizationId:string;role:string;organizationStatus:string;canManageIntegrations:boolean;canViewFinance:boolean}>(`/partner/organizations/${encodeURIComponent(id)}/permissions`),
};
