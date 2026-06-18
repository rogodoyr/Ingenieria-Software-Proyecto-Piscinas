import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMetricas, getMantencionesProximas, getAlertasInventario } from '../api/dashboard';
import { getMantenciones, createMantencion } from '../api/mantenciones';
import { getClientes } from '../api/clientes';
import { getTecnicos } from '../api/rutas';

// ── helpers ──────────────────────────────────────────────────────────────────

const formatoCLP = (amount) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount ?? 0);

const formatFecha = (raw) => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('es-CL', { month: 'short' });
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month} ${hh}:${mm}`;
};

// ── sub-components ────────────────────────────────────────────────────────────

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-primary-container text-primary px-5 py-3 rounded-xl shadow-lg border border-outline/20 flex items-center gap-3 animate-fade-in">
      <span>✅</span>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100 text-lg leading-none">×</button>
    </div>
  );
}

function TipoBadge({ tipo }) {
  const styles =
    tipo === 'PREVENTIVA'
      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
      : 'bg-orange-500/20 text-orange-300 border border-orange-500/30';
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles}`}>
      {tipo}
    </span>
  );
}

function EstadoBadge({ estado }) {
  const map = {
    PENDIENTE: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
    EN_CURSO: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    COMPLETADA: 'bg-green-500/20 text-green-300 border border-green-500/30',
    CANCELADA: 'bg-red-500/20 text-red-300 border border-red-500/30',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${map[(estado || 'PENDIENTE').toUpperCase().replace(' ', '_')] ?? 'bg-surface-high text-secondary border border-outline/20'}`}>
      {estado ?? '—'}
    </span>
  );
}

function PrioridadBadge({ prioridad }) {
  const map = {
    Urgente: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', icon: '🔴' },
    Alta: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', icon: '🟠' },
    Normal: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', icon: '🟡' },
    Baja: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', icon: '🟢' },
  };
  const style = map[prioridad] || map.Normal;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.7rem] font-bold px-2.5 py-1 rounded-full ${style.bg} ${style.text} ${style.border} uppercase tracking-wider`}>
      <span>{style.icon}</span> {prioridad || 'Normal'}
    </span>
  );
}

function MetricCard({ icon, label, value, sub, accent, onClick }) {
  return (
    <div 
      onClick={onClick} 
      className={`bg-surface-high rounded-2xl p-5 border border-outline/20 flex flex-col gap-2 pool-glow ${onClick ? 'cursor-pointer hover:bg-surface/80 hover:-translate-y-0.5 transition-all duration-200 shadow-lg' : ''}`}
    >
      <div className="flex items-center gap-2 text-secondary text-sm">
        <span className="text-lg">{icon}</span>
        <span>{label}</span>
      </div>
      <div className={`text-2xl font-bold ${accent ?? 'text-primary'}`}>{value}</div>
      {sub && <div className="text-xs text-secondary">{sub}</div>}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

function NuevaMantencionModal({ clientes, tecnicos, onClose, onCreated }) {
  const { token } = useAuth();
  const [form, setForm] = useState({
    clienteId: '',
    tecnicoId: '',
    tipo: 'PREVENTIVA',
    prioridad: 'Normal',
    descripcion: '',
    observaciones: '',
    fechaHora: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.clienteId || !form.tecnicoId || !form.fechaHora) {
      setError('Por favor completa todos los campos obligatorios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createMantencion(token, {
        clienteId: form.clienteId,
        clienteNombre: clientes.find(c => String(c.id || c._id) === String(form.clienteId))?.nombre,
        tecnicoId: form.tecnicoId,
        tecnicoNombre: form.tecnicoId ? tecnicos.find(t => String(t.id || t._id) === String(form.tecnicoId))?.nombre : undefined,
        tipo: form.tipo,
        prioridad: form.prioridad,
        descripcion: form.descripcion,
        servicio: form.descripcion,
        observaciones: form.observaciones || undefined,
        fechaHora: form.fechaHora.length === 16 ? `${form.fechaHora}:00` : form.fechaHora,
      });
      onCreated();
      onClose();
    } catch (err) {
      setError(err?.message ?? 'Error al crear la mantención.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-outline/20 rounded-2xl w-full max-w-lg shadow-2xl pool-glow">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline/20">
          <h2 className="text-primary font-bold text-lg">🔧 Nueva Mantención</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary text-xl leading-none transition-colors">×</button>
        </div>
        {/* body */}
        <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-medium uppercase tracking-wide">Cliente *</label>
            <select
              name="clienteId"
              value={form.clienteId}
              onChange={handle}
              required
              className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            >
              <option value="">Seleccionar cliente…</option>
              {clientes.map((c) => (
                <option key={c.id} value={c.id}>{c.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-medium uppercase tracking-wide">Técnico *</label>
            <select
              name="tecnicoId"
              value={form.tecnicoId}
              onChange={handle}
              required
              className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            >
              <option value="">Seleccionar técnico…</option>
              {tecnicos.map((t) => (
                <option key={t.id} value={t.id}>{t.nombre}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-medium uppercase tracking-wide">Tipo</label>
            <div style={{ display: 'flex', gap: 10 }}>
              {['PREVENTIVA', 'CORRECTIVA'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, tipo: t }))}
                  style={{
                    flex: 1, padding: '9px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
                    background: form.tipo === t
                      ? (t === 'PREVENTIVA' ? 'rgba(6,182,212,0.22)' : 'rgba(249,115,22,0.22)')
                      : 'rgba(148,163,184,0.06)',
                    border: form.tipo === t
                      ? `1px solid ${t === 'PREVENTIVA' ? 'rgba(6,182,212,0.5)' : 'rgba(249,115,22,0.5)'}`
                      : '1px solid rgba(148,163,184,0.15)',
                    color: form.tipo === t
                      ? (t === 'PREVENTIVA' ? '#22d3ee' : '#fb923c')
                      : '#94a3b8',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-medium uppercase tracking-wide">Prioridad</label>
            <select
              name="prioridad"
              value={form.prioridad}
              onChange={handle}
              className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            >
              <option value="Baja">🟢 Baja</option>
              <option value="Normal">🟡 Normal</option>
              <option value="Alta">🟠 Alta</option>
              <option value="Urgente">🔴 Urgente</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-medium uppercase tracking-wide">Observaciones</label>
            <textarea
              name="observaciones"
              value={form.observaciones}
              onChange={handle}
              rows={2}
              placeholder="Notas adicionales…"
              className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60 resize-none"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-medium uppercase tracking-wide">Fecha y Hora *</label>
            <input
              type="datetime-local"
              name="fechaHora"
              value={form.fechaHora}
              onChange={handle}
              required
              className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-medium uppercase tracking-wide">Descripción</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handle}
              rows={3}
              placeholder="Detalles de la mantención…"
              className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-outline/20 text-secondary py-2 rounded-lg text-sm font-medium hover:bg-surface-high transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-container text-primary py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Guardando…' : 'Crear Mantención'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Main Dashboard ─────────────────────────────────────────────────────────────

export default function Dashboard({ onNavigate }) {
  const { token } = useAuth();

  const [metricas, setMetricas] = useState(null);
  const [proximas, setProximas] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);

  const [loadingMetricas, setLoadingMetricas] = useState(true);
  const [loadingProximas, setLoadingProximas] = useState(true);
  const [loadingAlertas, setLoadingAlertas] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');

  // ── load data ────────────────────────────────────────────────────────────────

  const loadMetricas = async () => {
    setLoadingMetricas(true);
    try {
      const data = await getMetricas(token);
      setMetricas(data);
    } catch {
      setMetricas({ ingresosMes: 0, mantencionesHoy: 0, clientesActivos: 0, alertasStock: 0 });
    } finally {
      setLoadingMetricas(false);
    }
  };

  const loadProximas = async () => {
    setLoadingProximas(true);
    try {
      let data = await getMantencionesProximas(token);
      if (!data || data.length === 0) {
        const all = await getMantenciones(token);
        data = Array.isArray(all) ? all.slice(0, 8) : [];
      }
      setProximas(Array.isArray(data) ? data : []);
    } catch {
      setProximas([]);
    } finally {
      setLoadingProximas(false);
    }
  };

  const loadAlertas = async () => {
    setLoadingAlertas(true);
    try {
      const data = await getAlertasInventario(token);
      setAlertas(Array.isArray(data) ? data : []);
    } catch {
      setAlertas([]);
    } finally {
      setLoadingAlertas(false);
    }
  };

  const loadFormData = async () => {
    try {
      const [c, t] = await Promise.all([getClientes(token), getTecnicos(token)]);
      setClientes(Array.isArray(c) ? c : (c?.data ?? []));
      setTecnicos(Array.isArray(t) ? t : (t?.data ?? []));
    } catch {
      // non-blocking
    }
  };

  useEffect(() => {
    if (!token) return;
    loadMetricas();
    loadProximas();
    loadAlertas();
    loadFormData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleCreated = () => {
    setToast('Mantención creada correctamente ✅');
    loadProximas();
    loadMetricas();
  };

  // ── render ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface text-primary p-6 space-y-8">

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast('')} />}

      {/* Modal */}
      {showModal && (
        <NuevaMantencionModal
          clientes={clientes}
          tecnicos={tecnicos}
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}

      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary">Dashboard</h1>
        <p className="text-secondary text-sm mt-0.5">Resumen operacional · {new Date().toLocaleDateString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loadingMetricas ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-surface-high rounded-2xl p-5 border border-outline/20 h-28 animate-pulse" />
          ))
        ) : (
          <>
            <MetricCard icon="💵" label="Ingresos del Mes" value={formatoCLP(metricas?.ingresosMes)} sub="Periodo actual" accent="text-green-300" onClick={() => onNavigate && onNavigate('Ventas')} />
            <MetricCard icon="🔧" label="Mantenciones Hoy" value={metricas?.mantencionesHoy ?? 0} sub="Programadas" accent="text-blue-300" onClick={() => onNavigate && onNavigate('Mantenciones')} />
            <MetricCard icon="👥" label="Clientes Activos" value={clientes.length > 0 ? clientes.length : (metricas?.clientesActivos ?? 0)} sub="Ver todos los clientes ↗" accent="text-primary" onClick={() => onNavigate && onNavigate('Clientes')} />
            <MetricCard
              icon="💧"
              label="Salud Promedio"
              value={`${metricas?.nivelQuimicos || 85}%`}
              sub="Estado de piscinas"
              accent={(metricas?.nivelQuimicos || 85) >= 80 ? 'text-cyan-400' : 'text-orange-300'}
              onClick={() => onNavigate && onNavigate('Mantenciones')}
            />
          </>
        )}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Mantenciones Próximas – 2/3 */}
        <div className="xl:col-span-2 bg-surface-high rounded-2xl border border-outline/20 overflow-hidden">
          <div className="px-5 py-4 border-b border-outline/20 flex items-center justify-between">
            <h2 className="font-bold text-primary">📅 Mantenciones Próximas</h2>
            <span className="text-xs text-secondary">{proximas.length} registros</span>
          </div>

          {loadingProximas ? (
            <div className="p-6 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-10 bg-surface rounded-lg animate-pulse" />
              ))}
            </div>
          ) : proximas.length === 0 ? (
            <div className="p-10 text-center text-secondary text-sm">No hay mantenciones próximas registradas.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[0.65rem] text-secondary uppercase tracking-widest border-b border-outline/20 bg-surface/30">
                    <th className="px-5 py-3.5 text-left font-bold">Prioridad / Tipo</th>
                    <th className="px-5 py-3.5 text-left font-bold">Cliente</th>
                    <th className="px-5 py-3.5 text-left font-bold">Técnico</th>
                    <th className="px-5 py-3.5 text-left font-bold">Fecha</th>
                    <th className="px-5 py-3.5 text-left font-bold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {proximas.map((m, i) => {
                    const cName = m.cliente?.nombre ?? m.clienteNombre ?? (clientes.find(c => String(c.id || c._id) === String(m.clienteId))?.nombre) ?? '—';
                    const tName = m.tecnico?.nombre ?? m.tecnicoNombre ?? (tecnicos.find(t => String(t.id || t._id) === String(m.tecnicoId))?.nombre) ?? '—';
                    return (
                      <tr key={m.id ?? i} className="border-b border-outline/10 hover:bg-surface-high/40 transition-colors">
                        <td className="px-5 py-3.5 flex flex-col gap-1.5 items-start">
                          <PrioridadBadge prioridad={m.prioridad} />
                          <TipoBadge tipo={m.tipo || 'PREVENTIVA'} />
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs uppercase shadow-inner">
                              {cName !== '—' ? cName.charAt(0) : '?'}
                            </div>
                            <span className="text-primary font-bold text-sm tracking-tight">{cName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="text-base opacity-70">👷</span>
                            <span className="text-secondary font-medium text-sm">{tName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-secondary whitespace-nowrap text-xs font-medium flex items-center gap-1.5">
                          <span>🕒</span> {formatFecha(m.fechaHora ?? m.fecha)}
                        </td>
                        <td className="px-5 py-3.5">
                          <EstadoBadge estado={m.estado} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">

          {/* Acciones Rápidas */}
          <div className="bg-surface-high rounded-2xl border border-outline/20 p-5">
            <h2 className="font-bold text-primary mb-4">⚡ Acciones Rápidas</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="w-full bg-primary-container text-primary font-semibold py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all pool-glow"
              >
                🔧 + Nueva Mantención
              </button>
              <button
                onClick={() => onNavigate && onNavigate('Clientes')}
                className="w-full bg-secondary-container text-secondary font-semibold py-3 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all border border-outline/20"
              >
                👥 Ver Clientes
              </button>
            </div>
          </div>

          {/* Alertas Inventario */}
          <div className="bg-surface-high rounded-2xl border border-outline/20 overflow-hidden flex-1">
            <div className="px-5 py-4 border-b border-outline/20 flex items-center justify-between">
              <h2 className="font-bold text-primary">⚠️ Alertas Inventario</h2>
              {alertas.length > 0 && (
                <span className="bg-orange-500/20 text-orange-300 text-xs font-bold px-2 py-0.5 rounded-full border border-orange-500/30">
                  {alertas.length}
                </span>
              )}
            </div>

            {loadingAlertas ? (
              <div className="p-5 space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="h-14 bg-surface rounded-lg animate-pulse" />
                ))}
              </div>
            ) : alertas.length === 0 ? (
              <div className="p-8 text-center text-secondary text-sm">
                <span className="text-2xl block mb-2">✅</span>
                Stock en niveles normales
              </div>
            ) : (
              <div className="p-4 space-y-4 max-h-[700px] overflow-y-auto custom-scrollbar">
                {alertas.map((a, i) => {
                  const minimo = a.minimo ?? 5;
                  const pct = Math.min(100, Math.max(0, ((a.cantidad ?? 0) / minimo) * 100));
                  const isAgotado = (a.cantidad ?? 0) <= 0;
                  const barColor = isAgotado ? 'bg-red-500' : pct < 30 ? 'bg-red-400' : pct < 60 ? 'bg-orange-400' : 'bg-yellow-400';
                  
                  return (
                    <div key={a.id ?? i} className="space-y-1.5 pb-2 border-b border-outline/5 last:border-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary font-medium truncate max-w-[60%]">{a.nombre ?? a.producto ?? '—'}</span>
                        <div className="flex items-center gap-2">
                          {isAgotado && (
                            <span className="text-red-500 font-bold text-xs animate-pulse tracking-wide uppercase">Reponer</span>
                          )}
                          <span className={`text-xs ${isAgotado ? 'text-red-400 font-bold' : 'text-secondary'}`}>{a.cantidad} / {minimo} unid.</span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-surface rounded-full overflow-hidden">
                        <div className={`h-full ${barColor} rounded-full transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
