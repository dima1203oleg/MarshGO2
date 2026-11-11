import { buildPartnerQuery } from './adminQuery';
import type { VerificationRecord } from './verificationModeration';
import { AdminApiError } from './verificationModeration';

export { AdminApiError };

const apiOrigin = import.meta.env.VITE_API_BASE_URL ?? '';
let accessToken: string | null = null;
const devPreviewAuthAvailable = import.meta.env.DEV;
let devPreviewSessionActive = false;

export type User = { id: string; display_name: string; roles: string[] };
export type PartnerRow = {
  id: string; display_name: string; legal_name: string; organization_status: string;
  dispatch_mode: 'INTEGRATION_ONLY' | 'NATIVE_DISPATCH'; application_status: string | null;
  city: string | null; contact_email: string | null; service_modes: string[];
};
export type AdminDashboard = {
  active_partners: number; pending_applications: number; enabled_provider_operators: number;
  healthy_provider_connections: number; provider_connections_needing_attention: number; generated_at: string;
};
export type IntegrationSource = {
  id: string; name: string; city: string; provider_type: string; source_type: string; priority: number;
  status: 'enabled' | 'disabled' | 'paused'; health: 'unknown' | 'healthy' | 'degraded' | 'offline'; country: string;
  access: string; license: string | null; update_frequency: string | null; coverage: string | null; source_ref: string | null;
  commercial_use: boolean; attribution_required: boolean; discovery_status: string; last_checked_at: string | null;
  last_sync_at: string | null; last_error: string | null;
  last_report: { counts: Record<string, number>; responseMs: number | null; bbox: number[] | null; checks: Array<{ name: string; ok: boolean; detail: string | null }> };
};
export type IntegrationOperator = {
  provider_id: string; provider_name: string; provider_group: string; data_source: string; integration_status: string;
  data_freshness_seconds: number | null; booking_method: string; pricing_capability: string;
  live_availability_capability: boolean; commercial_permissions: string; attribution_requirements: string | null;
  enabled: boolean; last_successful_sync: string | null; last_sync_error: string | null; api_key_configured: boolean;
  location_count: number; live_available_count: number; status_message?: string | null;
};
export type AdminIntegrations = { sources: IntegrationSource[]; operators: IntegrationOperator[] };

async function request<T>(path: string, init: RequestInit = {}, retryAuth = true): Promise<T> {
  if (devPreviewAuthAvailable && devPreviewSessionActive) {
    throw new Error('Server API вимкнене в локальному режимі перегляду.');
  }
  const headers = new Headers(init.headers);
  if (init.body && !headers.has('content-type')) headers.set('content-type', 'application/json');
  if (accessToken) headers.set('authorization', `Bearer ${accessToken}`);
  const response = await fetch(`${apiOrigin}/api/v1${path}`, { ...init, headers, credentials: 'include' });
  const body = await response.json().catch(() => null) as { data?: T; error?: { message?: string; code?: string } } | null;
  if (response.status === 401 && retryAuth && accessToken && !path.startsWith('/auth/')) {
    try {
      const session = await request<{ user: User; accessToken: string }>('/auth/refresh', { method: 'POST' }, false);
      accessToken = session.accessToken;
      return request<T>(path, init, false);
    } catch { accessToken = null; }
  }
  if (!response.ok) throw new AdminApiError(body?.error?.code, response.status, body?.error?.message ?? `Запит не виконано (${response.status})`);
  return (body as { data: T }).data;
}

export const api = {
  isDevPreviewSession: () => devPreviewAuthAvailable && devPreviewSessionActive,
  enterDevPreviewSession: (): User | null => {
    if (!devPreviewAuthAvailable) return null;
    accessToken = null;
    devPreviewSessionActive = true;
    return { id: 'dev-preview-admin', display_name: 'Admin UI preview', roles: ['admin'] };
  },
  restore: async () => {
    const session = await request<{ user: User; accessToken: string }>('/auth/refresh', { method: 'POST' });
    accessToken = session.accessToken;
    return session.user;
  },
  login: async (email: string, password: string) => {
    const session = await request<{ user: User; accessToken: string }>('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    accessToken = session.accessToken;
    return session.user;
  },
  logout: async () => {
    if (devPreviewSessionActive) { accessToken = null; devPreviewSessionActive = false; return; }
    try { await request('/auth/logout', { method: 'POST' }); } finally { accessToken = null; }
  },
  dashboard: () => request<AdminDashboard>('/admin/dashboard'),
  partners: (search = '', status = '') => request<{ items: PartnerRow[]; total: number; page: number; pageSize: number }>(`/admin/partners${buildPartnerQuery(search, status)}`),
  decidePartner: (id: string, action: 'approve' | 'reject' | 'suspend', note: string) => request(`/admin/partners/${encodeURIComponent(id)}/${action}`, { method: 'POST', body: JSON.stringify({ note }) }),
  integrations: () => request<AdminIntegrations>('/admin/integrations'),
  testIntegrationProvider: (id: string) => request<{ provider: IntegrationSource; report: IntegrationSource['last_report'] & { health: string; error?: string } }>(`/admin/integrations/providers/${encodeURIComponent(id)}/test`, { method: 'POST' }),
  updateIntegrationProvider: (id: string, input: { status?: 'enabled' | 'disabled' | 'paused'; priority?: number }) => request<IntegrationSource>(`/admin/integrations/providers/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify(input) }),
  updateIntegrationOperator: (id: string, enabled: boolean) => request<Pick<IntegrationOperator, 'provider_id' | 'provider_name' | 'integration_status' | 'enabled'>>(`/admin/mobility/operators/${encodeURIComponent(id)}`, { method: 'PATCH', body: JSON.stringify({ enabled }) }),
  audit: () => request<unknown[]>('/admin/audit'),
  verifications: () => request<VerificationRecord[]>('/admin/verification'),
  verificationEvidence: (id: string) => request<{ url: string; expiresInSeconds: number }>(`/admin/verification/${encodeURIComponent(id)}/evidence`),
  decideVerification: (id: string, decision: 'approved' | 'rejected', note?: string) => request<{ id: string; status: string; vehicleStatus: string | null }>(
    `/admin/verification/${encodeURIComponent(id)}/decision`,
    { method: 'POST', body: JSON.stringify(note === undefined ? { decision } : { decision, note }) },
  ),
};
