import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../api/clientes';

// ── helpers ──────────────────────────────────────────────────────────────────

const formatFechaLarga = (raw) => {
  if (!raw) return '—';
  const d = new Date(raw);
  if (isNaN(d)) return raw;
  return d.toLocaleDateString('es-CL', { day: '2-digit', month: 'long', year: 'numeric' });
};

const tipoLabel = (tipo) =>
  tipo === 'PERSONA_JURIDICA' ? 'Jurídica' : tipo === 'PERSONA_NATURAL' ? 'Natural' : tipo ?? '—';

const truncate = (str, n = 30) =>
  str && str.length > n ? str.slice(0, n) + '…' : str ?? '—';

export const formatRUT = (value) => {
  if (!value) return '';
  let clean = value.replace(/[^0-9kK]/g, '').toUpperCase();
  if (clean.length === 0) return '';
  let dv = clean.slice(-1);
  let rut = clean.slice(0, -1);
  if (rut.length === 0) return clean;
  rut = rut.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${rut}-${dv}`;
};

export const formatPhone = (value) => {
  if (!value) return '';
  let nums = value.replace(/\D/g, '');
  if (nums.startsWith('56')) nums = nums.slice(2);
  if (nums.length > 0 && !nums.startsWith('9') && nums.length === 8) nums = '9' + nums;
  nums = nums.slice(0, 9);
  if (nums.length === 0) return '';
  if (nums.length <= 1) return `+56 ${nums}`;
  if (nums.length <= 5) return `+56 ${nums.slice(0, 1)} ${nums.slice(1)}`;
  return `+56 ${nums.slice(0, 1)} ${nums.slice(1, 5)} ${nums.slice(5)}`;
};

// ── badges ────────────────────────────────────────────────────────────────────

function EstadoBadge({ estado }) {
  const est = (estado || '').toUpperCase();
  const map = {
    ACTIVO: 'bg-green-500/20 text-green-300 border-green-500/30',
    PENDIENTE: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
    INACTIVO: 'bg-red-500/20 text-red-300 border-red-500/30',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${map[est] ?? 'bg-surface-high text-secondary border-outline/20'}`}>
      {estado ?? '—'}
    </span>
  );
}

function TipoBadge({ tipo }) {
  const styles =
    tipo === 'PERSONA_JURIDICA'
      ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
      : 'bg-sky-500/20 text-sky-300 border border-sky-500/30';
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles}`}>
      {tipoLabel(tipo)}
    </span>
  );
}

// ── empty state ───────────────────────────────────────────────────────────────

function EmptyState({ filtered }) {
  return (
    <tr>
      <td colSpan={8} className="py-16 text-center text-secondary">
        <span className="text-4xl block mb-3">🏊</span>
        {filtered ? 'Sin resultados para la búsqueda.' : 'No hay clientes registrados aún.'}
      </td>
    </tr>
  );
}

// ── Ver Detalles Modal ────────────────────────────────────────────────────────

function VerDetallesModal({ cliente, onClose }) {
  if (!cliente) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-outline/20 rounded-2xl w-full max-w-lg shadow-2xl pool-glow max-h-[90vh] flex flex-col">
        {/* header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline/20 shrink-0">
          <div>
            <h2 className="text-primary font-bold text-lg">👁 Detalles del Cliente</h2>
            <p className="text-secondary text-xs mt-0.5">ID #{cliente.id}</p>
          </div>
          <button onClick={onClose} className="text-secondary hover:text-primary text-2xl leading-none transition-colors">×</button>
        </div>

        {/* body */}
        <div className="px-6 py-5 overflow-y-auto space-y-5">
          {/* Nombre & tipo */}
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-secondary uppercase tracking-wide mb-1">Nombre / Razón Social</p>
              <p className="text-primary font-semibold text-lg">{cliente.nombre}</p>
            </div>
            <TipoBadge tipo={cliente.tipo} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-secondary uppercase tracking-wide mb-1">RUT</p>
              <p className="text-primary font-mono">{cliente.rut ? formatRUT(cliente.rut) : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-secondary uppercase tracking-wide mb-1">Estado</p>
              <EstadoBadge estado={cliente.estado} />
            </div>
            <div>
              <p className="text-xs text-secondary uppercase tracking-wide mb-1">Email</p>
              <p className="text-primary break-all">{cliente.email ?? '—'}</p>
            </div>
            <div>
              <p className="text-xs text-secondary uppercase tracking-wide mb-1">Teléfono</p>
              <p className="text-primary font-mono">{cliente.telefono ? formatPhone(cliente.telefono) : '—'}</p>
            </div>
          </div>

          <div>
            <p className="text-xs text-secondary uppercase tracking-wide mb-1">Dirección</p>
            <p className="text-primary">{cliente.direccion ?? '—'}</p>
          </div>

          <div>
            <p className="text-xs text-secondary uppercase tracking-wide mb-1">Fecha de Registro</p>
            <p className="text-primary">{formatFechaLarga(cliente.fechaCreacion ?? cliente.createdAt)}</p>
          </div>

          {/* Notas / Mensaje del cliente – highlighted */}
          <div className="bg-surface-high border border-outline/20 rounded-xl p-4">
            <p className="text-xs text-secondary uppercase tracking-wide mb-2 flex items-center gap-1.5">
              <span>📄</span> Mensaje / Notas del cliente
            </p>
            {cliente.notas ? (
              <p className="text-primary text-sm leading-relaxed whitespace-pre-wrap">{cliente.notas}</p>
            ) : (
              <p className="text-secondary text-sm italic">Sin notas registradas.</p>
            )}
          </div>
        </div>

        <div className="px-6 py-4 border-t border-outline/20 shrink-0">
          <button
            onClick={onClose}
            className="w-full border border-outline/20 text-secondary py-2.5 rounded-xl text-sm font-medium hover:bg-surface-high transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Cliente Form Modal (Crear / Editar) ───────────────────────────────────────

const BLANK_FORM = {
  nombre: '',
  rut: '',
  email: '',
  telefono: '',
  tipo: 'PERSONA_NATURAL',
  direccion: '',
  notas: '',
};

function ClienteFormModal({ initial, onClose, onSaved, title }) {
  const { token } = useAuth();
  const [form, setForm] = useState(initial ?? BLANK_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => {
    let { name, value } = e.target;
    if (name === 'rut') value = formatRUT(value);
    if (name === 'telefono') value = formatPhone(value);
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim() || !form.email.trim()) {
      setError('Nombre y email son obligatorios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      if (initial?.id) {
        await updateCliente(token, initial.id, form);
      } else {
        await createCliente(token, form);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err?.message ?? 'Error al guardar el cliente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-outline/20 rounded-2xl w-full max-w-lg shadow-2xl pool-glow max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline/20 shrink-0">
          <h2 className="text-primary font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary text-2xl leading-none transition-colors">×</button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 overflow-y-auto flex flex-col gap-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-secondary text-xs font-medium uppercase tracking-wide">Nombre / Razón Social *</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handle}
                required
                placeholder="Nombre completo o razón social"
                className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-secondary text-xs font-medium uppercase tracking-wide">RUT</label>
              <input
                name="rut"
                value={form.rut}
                onChange={handle}
                placeholder="12.345.678-9"
                className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-secondary text-xs font-medium uppercase tracking-wide">Tipo</label>
              <select
                name="tipo"
                value={form.tipo}
                onChange={handle}
                className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
              >
                <option value="PERSONA_NATURAL">Persona Natural</option>
                <option value="PERSONA_JURIDICA">Persona Jurídica</option>
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-secondary text-xs font-medium uppercase tracking-wide">Email *</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handle}
                required
                placeholder="correo@ejemplo.cl"
                className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-secondary text-xs font-medium uppercase tracking-wide">Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handle}
                placeholder="+56 9 1234 5678"
                className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-secondary text-xs font-medium uppercase tracking-wide">Dirección</label>
              <input
                name="direccion"
                value={form.direccion}
                onChange={handle}
                placeholder="Calle, número, ciudad"
                className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
              />
            </div>

            <div className="col-span-2 flex flex-col gap-1">
              <label className="text-secondary text-xs font-medium uppercase tracking-wide flex items-center gap-1.5">
                <span>📄</span> Mensaje / Notas del cliente
              </label>
              <textarea
                name="notas"
                value={form.notas}
                onChange={handle}
                rows={3}
                placeholder="Mensaje enviado desde el sitio web, preferencias, observaciones…"
                className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60 resize-none"
              />
            </div>
          </div>
        </form>

        <div className="px-6 py-4 border-t border-outline/20 shrink-0 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border border-outline/20 text-secondary py-2.5 rounded-xl text-sm font-medium hover:bg-surface-high transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="flex-1 bg-primary-container text-primary py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Guardando…' : initial?.id ? 'Guardar Cambios' : 'Crear Cliente'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Clientes Page ────────────────────────────────────────────────────────

export default function Clientes() {
  const { token } = useAuth();

  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState('');

  const [modalVer, setModalVer] = useState(null);      // cliente object
  const [modalEditar, setModalEditar] = useState(null); // cliente object
  const [modalNuevo, setModalNuevo] = useState(false);

  // ── load ──────────────────────────────────────────────────────────────────

  const loadClientes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getClientes(token);
      setClientes(Array.isArray(data) ? data : []);
    } catch {
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadClientes();
  }, [token, loadClientes]);

  // ── delete ────────────────────────────────────────────────────────────────

  const handleDelete = async (cliente) => {
    if (!window.confirm(`¿Eliminar a ${cliente.nombre}?`)) return;
    try {
      await deleteCliente(token, cliente.id || cliente._id);
      loadClientes();
    } catch (err) {
      window.alert(`Error al eliminar: ${err?.message ?? 'Error desconocido'}`);
    }
  };

  // ── filter ────────────────────────────────────────────────────────────────

  const filtered = clientes.filter((c) => {
    if ((c.estado || '').toUpperCase() === 'INACTIVO') return false; // Hide deleted
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      (c.nombre ?? '').toLowerCase().includes(q) ||
      (c.email ?? '').toLowerCase().includes(q) ||
      (c.rut ?? '').toLowerCase().includes(q);
    const matchTipo = !tipoFilter || c.tipo === tipoFilter;
    return matchSearch && matchTipo;
  });

  // ── render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-surface text-primary p-6 space-y-6">

      {/* Modals */}
      {modalVer && (
        <VerDetallesModal cliente={modalVer} onClose={() => setModalVer(null)} />
      )}
      {modalNuevo && (
        <ClienteFormModal
          title="👥 Nuevo Cliente"
          onClose={() => setModalNuevo(false)}
          onSaved={loadClientes}
        />
      )}
      {modalEditar && (
        <ClienteFormModal
          title="✏️ Editar Cliente"
          initial={modalEditar}
          onClose={() => setModalEditar(null)}
          onSaved={loadClientes}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Clientes</h1>
          <p className="text-secondary text-sm mt-0.5">Gestión de clientes del sistema</p>
        </div>
        <button
          onClick={() => setModalNuevo(true)}
          className="bg-primary-container text-primary font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all pool-glow self-start sm:self-auto"
        >
          + Nuevo Cliente
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, email o RUT…"
            className="w-full bg-surface-high border border-outline/20 text-primary rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/60"
          />
        </div>
        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          className="bg-surface-high border border-outline/20 text-primary rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary/60 min-w-[180px]"
        >
          <option value="">Todos los tipos</option>
          <option value="PERSONA_NATURAL">Persona Natural</option>
          <option value="PERSONA_JURIDICA">Persona Jurídica</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-surface-high rounded-2xl border border-outline/20 overflow-hidden">
        <div className="px-5 py-4 border-b border-outline/20 flex items-center justify-between">
          <h2 className="font-semibold text-primary text-sm">
            {filtered.length} cliente{filtered.length !== 1 ? 's' : ''}
          </h2>
          {(search || tipoFilter) && (
            <button
              onClick={() => { setSearch(''); setTipoFilter(''); }}
              className="text-xs text-secondary hover:text-primary underline underline-offset-2 transition-colors"
            >
              Limpiar filtros
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-secondary uppercase tracking-wide border-b border-outline/20">
                <th className="px-5 py-3 text-left">#</th>
                <th className="px-5 py-3 text-left">Nombre / Razón Social</th>
                <th className="px-5 py-3 text-left">RUT</th>
                <th className="px-5 py-3 text-left">Tipo</th>
                <th className="px-5 py-3 text-left">Email</th>
                <th className="px-5 py-3 text-left">Teléfono</th>
                <th className="px-5 py-3 text-left">Estado</th>
                <th className="px-5 py-3 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-outline/10">
                    {Array.from({ length: 8 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-surface rounded animate-pulse" style={{ width: `${40 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <EmptyState filtered={!!search || !!tipoFilter} />
              ) : (
                filtered.map((c, idx) => (
                  <tr key={c.id ?? idx} className="border-b border-outline/10 hover:bg-surface/50 transition-colors group">
                    <td className="px-5 py-3 text-secondary text-xs">{idx + 1}</td>
                    <td className="px-5 py-3">
                      <span className="text-primary font-medium">{c.nombre}</span>
                      {c.notas && (
                        <span className="block text-xs text-secondary mt-0.5 italic">
                          {truncate(c.notas, 30)}
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-secondary font-mono text-xs">{c.rut ? formatRUT(c.rut) : '—'}</td>
                    <td className="px-5 py-3">
                      <TipoBadge tipo={c.tipo} />
                    </td>
                    <td className="px-5 py-3 text-secondary text-xs">{c.email ?? '—'}</td>
                    <td className="px-5 py-3 text-secondary text-xs font-mono">{c.telefono ? formatPhone(c.telefono) : '—'}</td>
                    <td className="px-5 py-3">
                      <EstadoBadge estado={c.estado} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModalVer(c)}
                          className="text-xs bg-surface border border-outline/20 text-secondary hover:text-primary hover:border-primary/40 px-2.5 py-1 rounded-lg transition-all"
                          title="Ver detalles"
                        >
                          👁 Ver
                        </button>
                        <button
                          onClick={() => setModalEditar(c)}
                          className="text-xs bg-surface border border-outline/20 text-secondary hover:text-primary hover:border-primary/40 px-2.5 py-1 rounded-lg transition-all"
                          title="Editar cliente"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(c)}
                          className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-2.5 py-1 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                          title="Eliminar cliente"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-outline/20 text-xs text-secondary">
            Mostrando {filtered.length} de {clientes.length} clientes
          </div>
        )}
      </div>
    </div>
  );
}
