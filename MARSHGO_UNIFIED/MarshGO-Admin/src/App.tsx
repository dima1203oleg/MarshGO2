import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from 'react';
import { Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Building2, Check, CircleHelp, Clock3, FileText, LayoutDashboard, LogOut, Map, Search, ShieldCheck, Truck, X, Zap, RefreshCw, Play, Power, ExternalLink } from 'lucide-react';
import { api, type AdminDashboard, type AdminIntegrations, type IntegrationOperator, type IntegrationSource, type PartnerRow, type User } from './api';
import { hasPlatformAdminRole } from './access';
import { groupVerificationCases, missingVerificationDocuments, rejectionNoteIsIncomplete, verificationDecisionLabel, verificationDocumentLabel, verificationErrorMessage, type VerificationRecord } from './verificationModeration';

type View = 'overview' | 'partners' | 'verifications' | 'providers' | 'integrations' | 'audit';
const nav: Array<{ id: View; label: string; icon: typeof LayoutDashboard }> = [
  { id: 'overview', label: 'Огляд', icon: LayoutDashboard }, { id: 'partners', label: 'Партнери', icon: Building2 },
  { id: 'verifications', label: 'Модерація авто', icon: ShieldCheck },
  { id: 'providers', label: 'Провайдери', icon: Truck }, { id: 'integrations', label: 'Інтеграції', icon: Zap }, { id: 'audit', label: 'Журнал аудиту', icon: FileText },
];
const statusLabel: Record<string, string> = { PENDING_REVIEW: 'На перевірці', ACTIVE: 'Активний', SUSPENDED: 'Призупинений', REJECTED: 'Відхилений', SUBMITTED: 'Нова заявка', APPROVED: 'Схвалено' };
const integrationStatusLabel: Record<string, string> = { ACTIVE_LIVE: 'Live дані', ACTIVE_STATIC: 'Статичний каталог', CATALOG_ONLY: 'Каталог', AFFILIATE_LINK_ONLY: 'Партнерське посилання', SANDBOX_ONLY: 'Sandbox', AWAITING_CREDENTIALS: 'Очікує доступу', AWAITING_AGREEMENT: 'Очікує договору', DISABLED: 'Вимкнено', ERROR: 'Помилка' };
const accessLabel: Record<string, string> = { open: 'Публічне джерело', requires_credentials: 'Потрібні облікові дані', requires_partner_access: 'Потрібен партнерський доступ', insecure_endpoint: 'Небезпечний endpoint' };

function useLoad<T>(loader: () => Promise<T>, deps: unknown[] = []) {
  const [value, setValue] = useState<T | null>(null); const [error, setError] = useState(''); const [loading, setLoading] = useState(true);
  useEffect(() => { let alive = true; setLoading(true); setError(''); void loader().then((data) => { if (alive) setValue(data); }).catch((e: unknown) => { if (alive) setError(e instanceof Error ? e.message : 'Не вдалося завантажити дані'); }).finally(() => { if (alive) setLoading(false); }); return () => { alive = false; };
  }, deps);
  return { value, error, loading, reload: () => { setValue(null); setLoading(true); void loader().then(setValue).catch((e: unknown) => setError(e instanceof Error ? e.message : 'Помилка')).finally(() => setLoading(false)); } };
}

function Login({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  async function handleLogin(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('');
    try {
      const user = await api.login(email, password);
      onLogin(user);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Помилка входу');
    } finally {
      setBusy(false);
    }
  }
  return <main className="login-wrap"><section className="login-card"><div className="brand brand-large"><span className="brand-mark">M</span><span>MARSHGO <b>ADMIN</b></span></div><p className="eyebrow">ОПЕРАЦІЙНИЙ ЦЕНТР</p><h1>Увійдіть до платформи</h1><p className="muted">Використовуйте свій MARSHGO акаунт. Доступ до розділів перевіряється сервером.</p>
    {error && <div className="alert error"><AlertTriangle size={16}/>{error}</div>}
    <form onSubmit={handleLogin} className="form-stack">
      <label>Електронна пошта<input required type="email" autoComplete="email" placeholder="admin@marshgo.ua" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
      <label>Пароль<input required type="password" autoComplete="current-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      <button className="primary" disabled={busy}>{busy ? 'Входимо…' : 'Увійти'}</button>
    </form>
    {import.meta.env.DEV && <button type="button" className="link-button full" style={{ marginTop: '0.5rem' }} onClick={() => {
      const previewUser = api.enterDevPreviewSession();
      if (previewUser) onLogin(previewUser);
    }}>Офлайн-режим перегляду UI</button>}
    <div className="login-foot"><ShieldCheck size={16}/> Сесія MARSHGO · Захищений вхід</div>
  </section></main>;
}

function App() {
  const [user, setUser] = useState<User | null>(null); const [booting, setBooting] = useState(true); const [view, setView] = useState<View>('overview');
  const [search, setSearch] = useState(''); const [status, setStatus] = useState(''); const [toast, setToast] = useState('');
  useEffect(() => { void api.restore().then(setUser).catch(() => {}).finally(() => setBooting(false)); }, []);
  const allowed = user ? hasPlatformAdminRole(user.roles) : false;
  if (booting) return <div className="boot"><div className="spinner"/>Перевіряємо сесію MARSHGO…</div>;
  if (!user) return <Login onLogin={setUser}/>;
  if (!allowed) return <main className="login-wrap"><section className="login-card"><div className="brand"><span className="brand-mark">M</span><span>MARSHGO <b>ADMIN</b></span></div><div className="alert error"><ShieldCheck size={18}/> У цього акаунта немає адміністративної ролі.</div><p className="muted">Попросіть власника платформи призначити роль через захищений адміністративний процес.</p><button className="secondary full" onClick={() => void api.logout().finally(() => setUser(null))}>Вийти</button></section></main>;
  return <div className="app-shell"><aside className="sidebar"><div className="brand"><span className="brand-mark">M</span><span>MARSHGO <b>ADMIN</b></span></div><div className="workspace"><span className="workspace-dot"/> Операції платформи</div><p className="nav-caption">ПЛАТФОРМА</p><nav>{nav.map((item) => <button key={item.id} className={`nav-item ${view === item.id ? 'active' : ''}`} onClick={() => setView(item.id)}><item.icon size={18}/>{item.label}{item.id === 'partners' && <span className="nav-count">•</span>}</button>)}</nav><div className="sidebar-bottom"><div className="help-card"><CircleHelp size={18}/><span><b>Потрібна допомога?</b><small>Відкрийте довідку Admin</small></span></div><button className="profile-row" onClick={() => void api.logout().finally(() => setUser(null))}><span className="avatar">{user.display_name?.slice(0,1) ?? 'A'}</span><span className="profile-copy"><b>{user.display_name}</b><small>{api.isDevPreviewSession() ? 'Лише перегляд' : 'Адміністратор'}</small></span><LogOut size={16}/></button></div></aside>
    <main className="main-area"><header className="topbar"><div className="breadcrumbs">MARSHGO <span>/</span> <b>{nav.find((n) => n.id === view)?.label}</b></div><div className="top-actions"><span className="live-chip"><i/>{api.isDevPreviewSession() ? 'Локальний preview' : 'Система доступна'}</span><span className="avatar small">{user.display_name?.slice(0,1) ?? 'A'}</span></div></header>
      {api.isDevPreviewSession() && <div className="dev-preview-banner" role="status">Локальний режим перегляду: SMS не потрібне; Server API та адміністративні дії вимкнені.</div>}
      <div className="content">{view === 'overview' && <Overview onNavigate={setView}/ >}{view === 'partners' && <Partners search={search} setSearch={setSearch} status={status} setStatus={setStatus} notify={setToast}/ >}{view === 'verifications' && <Verifications notify={setToast}/ >}{view === 'providers' && <Providers/>}{view === 'integrations' && <Integrations notify={setToast}/ >}{view === 'audit' && <Audit/>}</div>
    </main>{toast && <div className="toast"><Check size={16}/>{toast}<button aria-label="Закрити" onClick={() => setToast('')}><X size={14}/></button></div>}</div>;
}

function PageTitle({ eyebrow, title, subtitle, action }: { eyebrow: string; title: string; subtitle: string; action?: ReactNode }) { return <div className="page-title"><div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1><p className="muted">{subtitle}</p></div>{action}</div>; }
function Overview({ onNavigate }: { onNavigate: (view: View) => void }) {
  const { value, error, loading } = useLoad(() => api.dashboard(), []); const kpis = value as AdminDashboard | null;
  return <><PageTitle eyebrow="ПЛАТФОРМА / ОГЛЯД" title="Доброго дня" subtitle="Стан партнерської мережі MARSHGO на основі фактичних даних." action={<button className="secondary" onClick={() => onNavigate('partners')}><Building2 size={16}/> Переглянути партнерів</button>}/>
    {error && <div className="alert error"><AlertTriangle size={17}/>{error}</div>}
    <div className="kpi-grid">{[
      { label: 'Активні партнери', value: kpis?.active_partners, icon: Building2, tone: 'blue', note: 'Схвалені організації' },
      { label: 'Заявки на перевірці', value: kpis?.pending_applications, icon: Clock3, tone: 'amber', note: 'Потребують рішення' },
      { label: 'Джерела провайдерів', value: kpis?.enabled_provider_operators, icon: Truck, tone: 'green', note: 'Увімкнені оператори' },
      { label: 'Інтеграції з увагою', value: kpis?.provider_connections_needing_attention, icon: AlertTriangle, tone: 'rose', note: `${kpis?.healthy_provider_connections ?? '—'} здорових підключень` },
    ].map(({ label, value, icon: Icon, tone, note }) => <article className="kpi-card" key={label}><div className="kpi-top"><span>{label}</span><span className={`kpi-icon ${tone}`}><Icon size={18}/></span></div><strong>{loading ? '—' : value ?? '—'}</strong><div className="kpi-note">{note}</div></article>)}</div>
    <div className="overview-grid"><section className="panel coverage-panel"><div className="panel-head"><div><h2>Покриття та джерела</h2><p>Відкрийте перевірені транспортні джерела</p></div><button className="text-button" onClick={() => onNavigate('providers')}>Усі джерела <ArrowUpRight size={15}/></button></div><div className="map-placeholder"><Map size={30}/><b>Географія покриття</b><span>У P0 тут відображаються лише підключені джерела з підтвердженою географією.</span><button className="secondary" onClick={() => onNavigate('providers')}>Переглянути джерела</button></div></section>
      <section className="panel attention-panel"><div className="panel-head"><div><h2>Потребують уваги</h2><p>Реальні черги для оператора платформи</p></div><span className="subtle-chip">P0</span></div><button className="attention-row" onClick={() => onNavigate('partners')}><span className="attention-icon amber"><Clock3 size={17}/></span><span><b>{loading ? '…' : kpis?.pending_applications ?? 0} заявок партнерів</b><small>Очікують перевірки</small></span><ArrowDownRight size={16}/></button><button className="attention-row" onClick={() => onNavigate('providers')}><span className="attention-icon rose"><AlertTriangle size={17}/></span><span><b>{loading ? '…' : kpis?.provider_connections_needing_attention ?? 0} підключень</b><small>Мають проблему або невідомий стан</small></span><ArrowDownRight size={16}/></button></section></div>
    <section className="panel note-panel"><div className="note-icon"><ShieldCheck size={18}/></div><div><b>Чесні показники та контроль доступу</b><p>Панель показує тільки записи з MARSHGO Server. Замовлення, дохід і GPS не відображаються, доки відповідні дані та дозволи не підключені.</p></div></section>
  </>;
}
function Partners({ search, setSearch, status, setStatus, notify }: { search: string; setSearch: (v: string) => void; status: string; setStatus: (v: string) => void; notify: (v: string) => void }) {
  const [refresh, setRefresh] = useState(0); const { value, error, loading } = useLoad(() => api.partners(search, status), [search, status, refresh]);
  const data = value as { items: PartnerRow[]; total: number } | null;
  async function decide(row: PartnerRow, action: 'approve' | 'reject' | 'suspend') {
    const prompt = action === 'approve' ? `Схвалити заявку «${row.display_name}»?` : `${action === 'reject' ? 'Відхилити' : 'Призупинити'} «${row.display_name}»? Вкажіть причину.`;
    const note = window.prompt(prompt, action === 'approve' ? 'Перевірку завершено' : '');
    if (note === null) return;
    if (action !== 'approve' && !note.trim()) { notify('Для цієї дії потрібна причина.'); return; }
    try { await api.decidePartner(row.id, action, note); notify(action === 'approve' ? 'Партнера схвалено.' : action === 'reject' ? 'Заявку відхилено.' : 'Партнера призупинено.'); setRefresh((x) => x + 1); }
    catch (e) { notify(e instanceof Error ? e.message : 'Не вдалося зберегти рішення.'); }
  }
  return <><PageTitle eyebrow="КЕРУВАННЯ / ПАРТНЕРИ" title="Партнери" subtitle="Перевіряйте заявки та керуйте статусом організацій."/><section className="panel table-panel"><div className="toolbar"><label className="search-box"><Search size={17}/><input placeholder="Назва, місто або компанія" value={search} onChange={(e) => setSearch(e.target.value)}/></label><select aria-label="Фільтр за статусом" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">Усі статуси</option><option value="PENDING_REVIEW">На перевірці</option><option value="ACTIVE">Активні</option><option value="SUSPENDED">Призупинені</option><option value="REJECTED">Відхилені</option></select><span className="result-count">{data?.total ?? 0} організацій</span></div>
    {error ? <div className="empty-state error-state"><AlertTriangle size={22}/><b>Не вдалося завантажити партнерів</b><span>{error}</span></div> : loading ? <div className="empty-state"><div className="spinner"/>Завантаження заявок…</div> : !data?.items.length ? <div className="empty-state"><Building2 size={24}/><b>Партнерів не знайдено</b><span>Змініть фільтр або дочекайтеся нової заявки.</span></div> : <div className="table-scroll"><table><thead><tr><th>Організація</th><th>Місто</th><th>Послуги</th><th>Модель</th><th>Статус</th><th><span className="sr-only">Дії</span></th></tr></thead><tbody>{data.items.map((row) => <tr key={row.id}><td><b>{row.display_name}</b><small>{row.legal_name}{row.contact_email ? ` · ${row.contact_email}` : ''}</small></td><td>{row.city ?? '—'}</td><td><div className="tag-list">{row.service_modes.map((mode) => <span className="tag" key={mode}>{modeLabel(mode)}</span>)}</div></td><td>{row.dispatch_mode === 'NATIVE_DISPATCH' ? 'MARSHGO Dispatch' : 'Власна система'}</td><td><span className={`status-pill ${row.organization_status.toLowerCase()}`}><i/>{statusLabel[row.organization_status] ?? row.organization_status}</span></td><td><div className="row-actions">{row.organization_status === 'PENDING_REVIEW' && <><button className="action approve" onClick={() => void decide(row, 'approve')}>Схвалити</button><button className="action reject" onClick={() => void decide(row, 'reject')}>Відхилити</button></>}{row.organization_status === 'ACTIVE' && <button className="action reject" onClick={() => void decide(row, 'suspend')}>Призупинити</button>}</div></td></tr>)}</tbody></table></div>}</section></>;
}
function modeLabel(mode: string) { const labels: Record<string, string> = { taxi: 'Таксі', transfer: 'Трансфер', bus: 'Автобус', carsharing: 'Каршеринг', scooter: 'Самокати', bicycle: 'Велосипеди', public_transit: 'Громадський транспорт' }; return labels[mode] ?? mode; }
function Verifications({ notify }: { notify: (message: string) => void }) {
  const [refresh, setRefresh] = useState(0);
  const { value, error, loading } = useLoad(() => api.verifications(), [refresh]);
  const [openedIds, setOpenedIds] = useState<string[]>([]);
  const [busyId, setBusyId] = useState('');
  const cases = useMemo(() => groupVerificationCases(value ?? []), [value]);
  async function openEvidence(record: VerificationRecord) {
    setBusyId(record.id);
    try {
      const evidence = await api.verificationEvidence(record.id);
      window.open(evidence.url, '_blank', 'noopener,noreferrer');
      setOpenedIds((current) => current.includes(record.id) ? current : [...current, record.id]);
      notify(`Термін дії захищеного посилання — ${Math.round(evidence.expiresInSeconds / 60)} хв. Перевірте документи та ухвалюйте рішення.`);
    } catch (e) { notify(verificationErrorMessage(e)); }
    finally { setBusyId(''); }
  }
  async function decide(record: VerificationRecord, decision: 'approved' | 'rejected') {
    const label = verificationDocumentLabel(record.verification_type);
    const note = decision === 'rejected'
      ? window.prompt(`Відхилити «${label}»? Вкажіть причину (мін. 3 символи). Разом із цим документом сервер відхилить другий документ цієї заявки.`, '')
      : window.prompt(`Схвалити «${label}»? Обидва документи потрібні, щоб автомобіль став перевіреним.`, 'Перевірку завершено');
    if (note === null) return;
    if (decision === 'rejected' && rejectionNoteIsIncomplete(note)) { notify('Для відхилення потрібна причина щонайменше 3 символи.'); return; }
    setBusyId(record.id);
    try {
      const result = await api.decideVerification(record.id, decision, decision === 'rejected' ? note.trim() : note.trim() || undefined);
      notify(`${verificationDecisionLabel(result.vehicleStatus)} · ${label}.`);
      setRefresh((v) => v + 1);
    } catch (e) { notify(verificationErrorMessage(e)); }
    finally { setBusyId(''); }
  }
  return <><PageTitle eyebrow="БЕЗПЕКА / МОДЕРАЦІЯ" title="Перевірка водіїв та автомобілів" subtitle="Заявки, які водій подає з додатка. Автомобіль стає перевіреним лише коли схвалені обидва документи." action={<button className="secondary" onClick={() => setRefresh((v) => v + 1)}><RefreshCw size={15}/>Оновити</button>}/>
    {error && <div className="alert error"><AlertTriangle size={17}/>{verificationErrorMessage(error)}</div>}
    {loading && <div className="empty-state"><div className="spinner"/>Завантаження черги модерації…</div>}
    {!loading && !error && !cases.length && <div className="empty-state"><ShieldCheck size={24}/><b>Черга порожня</b><span>Нові заявки з’являються тут одразу після того, як водій надішле документи з додатка.</span></div>}
    {!loading && cases.length > 0 && <div className="integration-grid">{cases.map((reviewCase) => {
      const missing = missingVerificationDocuments(reviewCase);
      return <article className="integration-card" key={reviewCase.key}>
        <div className="integration-card-top"><div><p className="eyebrow">{new Date(reviewCase.submittedAt).toLocaleString('uk-UA')}</p><h3>{reviewCase.driverName}</h3></div><span className={`status-pill ${missing.length ? 'pending_review' : 'healthy'}`}><i/>{missing.length ? 'Нестача документів' : 'Обидва документи'}</span></div>
        <div className="integration-facts"><span>{reviewCase.vehicleLabel}</span><span>{reviewCase.documents.length} у черзі</span></div>
        {missing.length > 0 && <p className="integration-meta">Не вистачає: {missing.join(', ')}. Доки документів менше за два, автомобіль не може отримати статус «перевірено».</p>}
        <ul className="integration-checks">{reviewCase.documents.map((document) => {
          const opened = openedIds.includes(document.id);
          const busy = busyId === document.id;
          return <li key={document.id}><span className={opened ? 'check-good' : 'check-bad'}>{opened ? '✓' : '×'}</span>{verificationDocumentLabel(document.verification_type)}
            <div className="row-actions"><button className="secondary" disabled={busy} onClick={() => void openEvidence(document)}><FileText size={14}/>Відкрити документи</button>
              <button className="action approve" disabled={busy || !opened} title={opened ? undefined : 'Спершу потрібно відкрити приватні документи'} onClick={() => void decide(document, 'approved')}>Схвалити</button>
              <button className="action reject" disabled={busy || !opened} title={opened ? undefined : 'Спершу потрібно відкрити приватні документи'} onClick={() => void decide(document, 'rejected')}>Відхилити</button>
            </div></li>;
        })}</ul>
      </article>;
    })}</div>}
  </>;
}
function Providers() { const { value, error, loading } = useLoad(() => api.integrations(), []); const entries = useMemo(() => (value as AdminIntegrations | null)?.sources ?? [], [value]); return <><PageTitle eyebrow="КЕРУВАННЯ / ДЖЕРЕЛА" title="Провайдери" subtitle="Перевірений перелік джерел без передачі URL фідів у вебклієнт."/><section className="panel table-panel">{error ? <div className="alert error"><AlertTriangle size={17}/>{error}</div> : loading ? <div className="empty-state"><div className="spinner"/>Завантаження реєстру…</div> : entries.length === 0 ? <div className="empty-state"><Truck size={24}/><b>Джерел не знайдено</b></div> : <div className="table-scroll"><table><thead><tr><th>Джерело</th><th>Транспорт</th><th>Місто</th><th>Здоров’я</th><th>Стан</th><th>Остання перевірка</th></tr></thead><tbody>{entries.map((entry) => <tr key={entry.id}><td><b>{entry.name}</b><small>{entry.source_type.toUpperCase()}</small></td><td>{entry.provider_type}</td><td>{entry.city}</td><td><span className={`status-pill ${entry.health}`}><i/>{entry.health.toUpperCase()}</span></td><td>{entry.status}</td><td>{entry.last_checked_at ? new Date(entry.last_checked_at).toLocaleString('uk-UA') : '—'}</td></tr>)}</tbody></table></div>}</section></>; }
function Integrations({ notify }: { notify: (message: string) => void }) {
  const [refresh, setRefresh] = useState(0); const [busyId, setBusyId] = useState('');
  const { value, error, loading } = useLoad(() => api.integrations(), [refresh]);
  const data = value as AdminIntegrations | null;
  async function run(id: string, action: () => Promise<unknown>, message: string) {
    setBusyId(id);
    try { await action(); notify(message); setRefresh((v) => v + 1); }
    catch (e) { notify(e instanceof Error ? e.message : 'Дію не виконано.'); }
    finally { setBusyId(''); }
  }
  return <><PageTitle eyebrow="КЕРУВАННЯ / ІНТЕГРАЦІЇ" title="Центр керування інтеграціями" subtitle="Перевіряйте конектори та керуйте лише підтвердженими джерелами. Секрети залишаються на сервері." action={<button className="secondary" onClick={() => setRefresh((v) => v + 1)}><RefreshCw size={15}/>Оновити</button>}/>
    {error && <div className="alert error"><AlertTriangle size={16}/>{error}</div>}
    {loading && <div className="empty-state"><div className="spinner"/>Завантаження стану інтеграцій…</div>}
    {!loading && data && <>
      <section className="integration-summary">
        <article className="kpi-card"><div className="kpi-top">Джерела даних <span className="kpi-icon blue"><Activity size={16}/></span></div><strong>{data.sources.length}</strong><div className="kpi-note">Технічні підключення</div></article>
        <article className="kpi-card"><div className="kpi-top">Оператори <span className="kpi-icon green"><Truck size={16}/></span></div><strong>{data.operators.length}</strong><div className="kpi-note">Окремо від джерел API</div></article>
        <article className="kpi-card"><div className="kpi-top">Live доступність <span className="kpi-icon amber"><Zap size={16}/></span></div><strong>{data.operators.filter((x) => x.integration_status === 'ACTIVE_LIVE' && x.enabled).length}</strong><div className="kpi-note">Лише підтверджені live-оператори</div></article>
        <article className="kpi-card"><div className="kpi-top">Потрібна дія <span className="kpi-icon rose"><AlertTriangle size={16}/></span></div><strong>{data.sources.filter((x) => x.health === 'offline' || x.health === 'unknown').length + data.operators.filter((x) => ['ERROR','AWAITING_CREDENTIALS','AWAITING_AGREEMENT'].includes(x.integration_status)).length}</strong><div className="kpi-note">Помилки або зовнішні залежності</div></article>
      </section>
      <section className="integration-section"><div className="panel-head"><div><h2>Технічні джерела</h2><p>Тестування виконується сервером; URL з обліковими даними не повертаються клієнту.</p></div></div>
        {!data.sources.length ? <div className="empty-state"><Activity size={23}/><b>Джерел ще немає</b><span>У реєстрі немає підключень для перевірки.</span></div> : <div className="integration-grid">{data.sources.map((source) => <IntegrationSourceCard key={source.id} source={source} busy={busyId === source.id} run={run}/>)}</div>}
      </section>
      <section className="integration-section"><div className="panel-head"><div><h2>Оператори та можливості</h2><p>Каталог, тарифи, бронювання й live availability мають окремі стани.</p></div></div>
        {!data.operators.length ? <div className="empty-state"><Truck size={23}/><b>Операторів ще немає</b></div> : <div className="integration-grid">{data.operators.map((operator) => <IntegrationOperatorCard key={operator.provider_id} operator={operator} busy={busyId === `operator:${operator.provider_id}`} run={run}/>)}</div>}
      </section>
    </>}
  </>;
}
function IntegrationSourceCard({ source, busy, run }: { source: IntegrationSource; busy: boolean; run: (id: string, action: () => Promise<unknown>, message: string) => Promise<void> }) {
  const counts = Object.entries(source.last_report.counts ?? {}).filter(([, count]) => count > 0).map(([name, count]) => `${name}: ${count}`).join(' · ');
  const status = source.health === 'healthy' ? 'Здорове' : source.health === 'degraded' ? 'Часткове' : source.health === 'offline' ? 'Недоступне' : 'Не перевірене';
  const canEnable = source.access === 'open' && source.health !== 'offline' && Boolean(source.license) && source.commercial_use && Boolean(source.last_checked_at) && ['VALIDATED','ENABLED'].includes(source.discovery_status);
  return <article className="integration-card"><div className="integration-card-top"><div><p className="eyebrow">{source.city} · {source.source_type.toUpperCase()}</p><h3>{source.name}</h3></div><span className={`status-pill ${source.health}`}><i/>{status}</span></div>
    <div className="integration-facts"><span>{source.provider_type}</span><span>{source.status === 'enabled' ? 'Увімкнене' : source.status === 'paused' ? 'Призупинене' : 'Вимкнене'}</span><span>{accessLabel[source.access] ?? source.access}</span></div>
    <p className="integration-meta">Ліцензія: {source.license ?? 'не зафіксована'} · Комерційне використання: {source.commercial_use ? 'підтверджене' : 'не підтверджене'}{source.update_frequency ? ` · оновлення ${source.update_frequency}` : ''}</p>
    {source.last_checked_at && <p className="integration-meta">Перевірено: {new Date(source.last_checked_at).toLocaleString('uk-UA')}</p>}
    {counts && <p className="integration-meta">{counts}{source.last_report.responseMs !== null ? ` · ${source.last_report.responseMs} мс` : ''}</p>}
    {source.last_error && <p className="integration-error">{source.last_error}</p>}
    {source.last_report.checks.length > 0 && <ul className="integration-checks">{source.last_report.checks.map((check) => <li key={check.name}><span className={check.ok ? 'check-good' : 'check-bad'}>{check.ok ? '✓' : '×'}</span>{check.name}{check.detail ? ` · ${check.detail}` : ''}</li>)}</ul>}
    <div className="integration-actions"><button className="secondary" disabled={busy} onClick={() => void run(source.id, () => api.testIntegrationProvider(source.id), 'Перевірку джерела завершено.')}><Play size={14}/>Перевірити</button><button className={source.status === 'enabled' ? 'danger-action' : 'secondary'} disabled={busy || (source.status !== 'enabled' && !canEnable)} title={source.status !== 'enabled' && !canEnable ? 'Потрібно підтвердити доступ, ліцензію та успішну перевірку' : undefined} onClick={() => void run(source.id, () => api.updateIntegrationProvider(source.id, { status: source.status === 'enabled' ? 'disabled' : 'enabled' }), source.status === 'enabled' ? 'Джерело вимкнено.' : 'Джерело увімкнено.')}><Power size={14}/>{source.status === 'enabled' ? 'Вимкнути' : 'Увімкнути'}</button></div>
  </article>;
}
function IntegrationOperatorCard({ operator, busy, run }: { operator: IntegrationOperator; busy: boolean; run: (id: string, action: () => Promise<unknown>, message: string) => Promise<void> }) {
  const canEnable = ['ACTIVE_LIVE','ACTIVE_STATIC'].includes(operator.integration_status);
  return <article className="integration-card"><div className="integration-card-top"><div><p className="eyebrow">{operator.provider_group} · {operator.data_source}</p><h3>{operator.provider_name}</h3></div><span className={`status-pill ${operator.integration_status === 'ACTIVE_LIVE' ? 'healthy' : operator.integration_status === 'ERROR' ? 'offline' : 'pending_review'}`}><i/>{integrationStatusLabel[operator.integration_status] ?? operator.integration_status}</span></div>
    <div className="integration-facts"><span>{operator.location_count} точок</span><span>{operator.live_available_count} live зараз</span><span>Ключ: {operator.api_key_configured ? 'налаштовано' : 'відсутній'}</span></div>
    <p className="integration-meta">Бронювання: {operator.booking_method} · ціна: {operator.pricing_capability} · live підтримка: {operator.live_availability_capability ? 'так' : 'не підтверджена'} · комерційний дозвіл: {operator.commercial_permissions}</p>
    {operator.last_successful_sync && <p className="integration-meta">Остання успішна синхронізація: {new Date(operator.last_successful_sync).toLocaleString('uk-UA')}</p>}
    {operator.status_message && <p className="integration-meta">{operator.status_message}</p>}{operator.last_sync_error && <p className="integration-error">{operator.last_sync_error}</p>}
    <div className="integration-actions"><button className={operator.enabled ? 'danger-action' : 'secondary'} disabled={busy || (!operator.enabled && !canEnable)} title={!operator.enabled && !canEnable ? 'Джерело очікує підтвердження або зовнішнього доступу' : undefined} onClick={() => void run(`operator:${operator.provider_id}`, () => api.updateIntegrationOperator(operator.provider_id, !operator.enabled), operator.enabled ? 'Оператора вимкнено.' : 'Оператора увімкнено.')}><Power size={14}/>{operator.enabled ? 'Вимкнути' : 'Увімкнути'}</button>{operator.attribution_requirements && <span className="integration-meta"><ExternalLink size={12}/>{operator.attribution_requirements}</span>}</div>
  </article>;
}
function Audit() { const { value, error, loading } = useLoad(() => api.audit(), []); const rows = Array.isArray(value) ? value as Array<Record<string, unknown>> : []; return <><PageTitle eyebrow="БЕЗПЕКА / АУДИТ" title="Журнал аудиту" subtitle="Останні адміністративні та операційні події, які зберігає Server."/><section className="panel table-panel">{error ? <div className="alert error"><AlertTriangle size={17}/>{error}</div> : loading ? <div className="empty-state"><div className="spinner"/>Завантаження журналу…</div> : !rows.length ? <div className="empty-state"><FileText size={24}/><b>Подій поки немає</b><span>Журнал не заповнюється тестовими записами.</span></div> : <div className="table-scroll"><table><thead><tr><th>Час</th><th>Дія</th><th>Об’єкт</th><th>Актор</th></tr></thead><tbody>{rows.map((row, i) => <tr key={String(row.id ?? i)}><td>{String(row.created_at ?? '—')}</td><td><b>{String(row.action ?? '—')}</b></td><td>{String(row.entity_type ?? '—')} · {String(row.entity_id ?? '—')}</td><td>{String(row.actor ?? row.actor_id ?? 'Система')}</td></tr>)}</tbody></table></div>}</section></>; }

export default App;
