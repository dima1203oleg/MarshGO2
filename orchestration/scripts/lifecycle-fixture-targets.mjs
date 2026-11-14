// The historical lifecycle renderer writes fixtures directly; never default to the shared stack.
export function lifecycleFixtureTargets(env) {
  if (env.MARSHGO_LIFECYCLE_FIXTURE_MODE !== 'true') {
    throw new Error('Historical fixture renderer disabled. Use an isolated disposable lifecycle harness; this script is not product E2E evidence.');
  }
  function target(key, protocols) {
    if (!env[key]) throw new Error(`${key} must explicitly identify an isolated fixture target`);
    let url;
    try { url = new URL(env[key]); } catch { throw new Error(`${key} must be a valid URL`); }
    if (!protocols.includes(url.protocol) || !['127.0.0.1', 'localhost', '[::1]'].includes(url.hostname)) {
      throw new Error(`${key} must use an allowed protocol on loopback`);
    }
    return url;
  }
  const database = target('API_TEST_DATABASE_URL', ['postgres:', 'postgresql:']);
  if (!/^\/marshgo_e2e_[a-z0-9_]+$/.test(database.pathname) || database.search || database.hash) {
    throw new Error('Fixture database must have an explicit marshgo_e2e_<run> name; shared databases are prohibited');
  }
  const preview = target('PREVIEW_URL', ['http:']);
  const api = target('API_URL', ['http:']);
  for (const url of [preview, api]) {
    if (!url.port || ['3001', '3002'].includes(url.port) || url.username || url.password || url.pathname !== '/' || url.search || url.hash) {
      throw new Error('Fixture HTTP targets require explicit non-preview ports and plain origins; shared ports 3001/3002 are prohibited');
    }
  }
  if (preview.port === api.port) throw new Error('Fixture API and frontend must be separate explicit ports');
  return { previewUrl: preview.origin, apiUrl: api.origin, databaseUrl: database.href };
}
