import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTecnicos, createTecnico, deleteTecnico } from '../api/rutas';

// ── badges ────────────────────────────────────────────────────────────────────

function EstadoBadge({ estado }) {
  const est = (estado || '').toUpperCase();
  const map = {
    DISPONIBLE: 'bg-green-500/20 text-green-300 border-green-500/30',
    'EN RUTA': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    'EN MANTENCIÓN': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${map[est] ?? 'bg-surface-high text-secondary border-outline/20'}`}>
      {estado ?? '—'}
    </span>
  );
}

// ── empty state ───────────────────────────────────────────────────────────────

function EmptyState({ filtered }) {
  return (
    <tr>
      <td colSpan={6} className="py-16 text-center text-secondary">
        <span className="text-4xl block mb-3">👷</span>
        {filtered ? 'Sin resultados para la búsqueda.' : 'No hay técnicos registrados aún.'}
      </td>
    </tr>
  );
}

// ── Tecnico Form Modal (Crear) ───────────────────────────────────────

const BLANK_FORM = {
  nombre: '',
  comuna: '',
  telefono: ''
};

function TecnicoFormModal({ onClose, onSaved, title }) {
  const { token } = useAuth();
  const [form, setForm] = useState(BLANK_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = (e) => {
    let { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createTecnico(token, form);
      onSaved();
      onClose();
    } catch (err) {
      setError(err?.message ?? 'Error al guardar el técnico.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-outline/20 rounded-2xl w-full max-w-lg shadow-2xl pool-glow flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline/20 shrink-0">
          <h2 className="text-primary font-bold text-lg">{title}</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary text-2xl leading-none transition-colors">×</button>
        </div>

        <form onSubmit={submit} className="px-6 py-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm px-4 py-2 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-medium uppercase tracking-wide">Nombre Completo *</label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handle}
              required
              placeholder="Ej. Juan Pérez"
              className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-medium uppercase tracking-wide">Comuna</label>
            <input
              name="comuna"
              value={form.comuna}
              onChange={handle}
              placeholder="Ej. Providencia"
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
            {loading ? 'Creando…' : 'Crear Técnico'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Tecnicos Page ────────────────────────────────────────────────────────

export default function Tecnicos() {
  const { token } = useAuth();
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalNuevo, setModalNuevo] = useState(false);

  const loadTecnicos = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getTecnicos(token);
      setTecnicos(Array.isArray(data) ? data : []);
    } catch {
      setTecnicos([]);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) loadTecnicos();
  }, [token, loadTecnicos]);

  const handleDelete = async (tecnico) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al técnico ${tecnico.nombre}?`)) return;
    try {
      await deleteTecnico(token, tecnico.id);
      loadTecnicos();
    } catch (err) {
      window.alert(`Error al eliminar: ${err?.message ?? 'Error desconocido'}`);
    }
  };

  const filtered = tecnicos.filter((t) => {
    const q = search.toLowerCase();
    return !q ||
      (t.nombre ?? '').toLowerCase().includes(q) ||
      (t.codigo ?? '').toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-surface text-primary p-6 space-y-6">
      {modalNuevo && (
        <TecnicoFormModal
          title="👷 Nuevo Técnico"
          onClose={() => setModalNuevo(false)}
          onSaved={loadTecnicos}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Técnicos</h1>
          <p className="text-secondary text-sm mt-0.5">Gestión de personal de terreno</p>
        </div>
        <button
          onClick={() => setModalNuevo(true)}
          className="bg-primary-container text-primary font-semibold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 active:scale-95 transition-all pool-glow self-start sm:self-auto"
        >
          + Nuevo Técnico
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o código…"
            className="w-full bg-surface-high border border-outline/20 text-primary rounded-xl pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary/60"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-high rounded-2xl border border-outline/20 overflow-hidden">
        <div className="px-5 py-4 border-b border-outline/20 flex items-center justify-between">
          <h2 className="font-semibold text-primary text-sm">
            {filtered.length} técnico{filtered.length !== 1 ? 's' : ''}
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-xs text-secondary uppercase tracking-wide border-b border-outline/20">
                <th className="px-5 py-3 text-left">Código</th>
                <th className="px-5 py-3 text-left">Nombre</th>
                <th className="px-5 py-3 text-left">Comuna</th>
                <th className="px-5 py-3 text-left">Teléfono</th>
                <th className="px-5 py-3 text-left">Estado</th>
                <th className="px-5 py-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-outline/10">
                    {Array.from({ length: 6 }).map((__, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-4 bg-surface rounded animate-pulse" style={{ width: `${40 + Math.random() * 40}%` }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <EmptyState filtered={!!search} />
              ) : (
                filtered.map((t, idx) => (
                  <tr key={t.id ?? idx} className="border-b border-outline/10 hover:bg-surface/50 transition-colors group">
                    <td className="px-5 py-3 text-secondary font-mono text-xs">{t.codigo}</td>
                    <td className="px-5 py-3 text-primary font-medium">{t.nombre}</td>
                    <td className="px-5 py-3 text-secondary text-xs">{t.comuna || '—'}</td>
                    <td className="px-5 py-3 text-secondary text-xs">{t.telefono || '—'}</td>
                    <td className="px-5 py-3">
                      <EstadoBadge estado={t.estado} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(t)}
                        className="text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                        title="Eliminar técnico"
                      >
                        🗑 Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
