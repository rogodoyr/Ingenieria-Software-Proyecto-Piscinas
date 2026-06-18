import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getMantenciones, createMantencion, updateMantencion, cambiarEstadoMantencion, deleteMantencion } from '../api/mantenciones';
import { getClientes } from '../api/clientes';
import { getTecnicos } from '../api/rutas';

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatFecha(dateStr) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const mon = months[d.getMonth()];
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${day} ${mon} ${hh}:${mm}`;
  } catch {
    return dateStr;
  }
}

function now1h() {
  const d = new Date(Date.now() + 60 * 60 * 1000);
  return d.toISOString().slice(0, 16);
}

const ESTADO_COLS = [
  { key: 'PENDIENTE',  label: 'Pendiente',  borderColor: '#ef4444' },
  { key: 'EN_CURSO',   label: 'En Curso',   borderColor: '#06b6d4' },
  { key: 'COMPLETADA', label: 'Completada', borderColor: '#3b82f6' },
];

const EMPTY_FORM = {
  clienteId: '',
  tecnicoId: '',
  tipo: 'PREVENTIVA',
  descripcion: '',
  prioridad: 'Normal',
  observaciones: '',
  fechaHora: now1h(),
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function TipoBadge({ tipo }) {
  const isCyan = tipo === 'PREVENTIVA';
  return (
    <span
      style={{
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.05em',
        padding: '2px 7px',
        borderRadius: 4,
        background: isCyan ? 'rgba(6,182,212,0.18)' : 'rgba(249,115,22,0.18)',
        color: isCyan ? '#22d3ee' : '#fb923c',
        border: `1px solid ${isCyan ? 'rgba(6,182,212,0.35)' : 'rgba(249,115,22,0.35)'}`,
        textTransform: 'uppercase',
      }}
    >
      {tipo}
    </span>
  );
}

function OTCard({ orden, onIniciar, onCompletar, onEditar, onEliminar }) {
  const shortId = (orden._id || orden.id || '').slice(0, 8);
  const clienteNombre = orden.cliente?.nombre || orden.clienteNombre || 'Sin cliente';
  const tecnicoNombre = orden.tecnico?.nombre || orden.tecnicoNombre || null;
  const desc = orden.descripcion || orden.servicio || '';
  const descTrunc = desc.length > 60 ? desc.slice(0, 60) + '…' : desc;

  return (
    <div
      className="bg-surface-high border border-outline/20"
      style={{
        borderRadius: 10,
        padding: '14px 14px 10px',
        marginBottom: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        borderLeft: (orden.prioridad === 'Urgente' || orden.prioridad === 'Alta') ? '3px solid #ef4444' : undefined,
        boxShadow: orden.prioridad === 'Urgente' ? '0 0 12px rgba(239,68,68,0.2)' : undefined
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(148,163,184,0.1)', padding: '2px 6px', borderRadius: 4 }}>
          #{shortId}
          {(orden.prioridad === 'Urgente' || orden.prioridad === 'Alta') && <span style={{ marginLeft: 4 }}>⚠️</span>}
        </span>
        <TipoBadge tipo={orden.tipo || orden.prioridad || 'PREVENTIVA'} />
      </div>

      {/* Cliente */}
      <div className="text-primary" style={{ fontWeight: 700, fontSize: '0.9rem', lineHeight: 1.2 }}>
        {clienteNombre}
      </div>

      {/* Técnico */}
      <div style={{ fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 4, color: tecnicoNombre ? '#94a3b8' : '#ef4444' }}>
        <span>👷</span>
        <span>{tecnicoNombre || 'Sin técnico asignado'}</span>
      </div>

      {/* Descripción */}
      <div className="text-secondary" style={{ fontSize: '0.8rem', lineHeight: 1.4 }}>
        {descTrunc}
      </div>

      {/* Fecha */}
      <div style={{ fontSize: '0.73rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 5 }}>
        <span>🕐</span>
        <span>{formatFecha(orden.fechaHora || orden.fecha)}</span>
      </div>

      {/* Observaciones */}
      {orden.observaciones && (
        <div style={{ fontSize: '0.75rem', color: '#78716c', borderLeft: '2px solid #44403c', paddingLeft: 8, fontStyle: 'italic' }}>
          {orden.observaciones}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
        { (orden.estado || 'PENDIENTE').toUpperCase().replace(' ', '_') === 'PENDIENTE' && (
          <button
            onClick={() => onIniciar(orden._id || orden.id)}
            style={{ flex: 1, padding: '6px 10px', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)', color: '#22d3ee', borderRadius: 6, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
          >
            ▶ Iniciar
          </button>
        )}
        { (orden.estado || 'PENDIENTE').toUpperCase().replace(' ', '_') === 'EN_CURSO' && (
          <button
            onClick={() => onCompletar(orden._id || orden.id)}
            style={{ flex: 1, padding: '6px 10px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#4ade80', borderRadius: 6, cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}
          >
            ✓ Completar
          </button>
        )}
        { (orden.estado || 'PENDIENTE').toUpperCase().replace(' ', '_') === 'COMPLETADA' && (
          <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 4, color: '#4ade80', fontSize: '0.78rem', fontWeight: 600 }}>
            ✅ Completada
          </span>
        )}
        <button
          onClick={() => onEditar(orden)}
          style={{ padding: '6px 10px', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', borderRadius: 6, cursor: 'pointer', fontSize: '0.78rem' }}
        >
          ✏️ Editar
        </button>
        <button
          onClick={() => { if (window.confirm('¿Eliminar esta Orden de Trabajo?')) onEliminar(orden._id || orden.id); }}
          style={{ padding: '6px 10px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171', borderRadius: 6, cursor: 'pointer', fontSize: '0.78rem' }}
          title="Eliminar orden"
        >
          🗑
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({ col, ordenes, onIniciar, onCompletar, onEditar, onEliminar }) {
  return (
    <div
      className="bg-surface"
      style={{
        flex: 1,
        minWidth: 0,
        borderRadius: 12,
        border: '1px solid rgba(148,163,184,0.12)',
        borderTop: `3px solid ${col.borderColor}`,
        padding: '14px 12px',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        maxHeight: 'calc(100vh - 220px)',
        overflowY: 'auto',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <span className="text-primary" style={{ fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
          {col.label}
        </span>
        <span
          style={{ background: `${col.borderColor}22`, color: col.borderColor, border: `1px solid ${col.borderColor}44`, borderRadius: 20, padding: '1px 9px', fontSize: '0.75rem', fontWeight: 700 }}
        >
          {ordenes.length}
        </span>
      </div>

      {ordenes.length === 0 && (
        <div className="text-secondary" style={{ textAlign: 'center', padding: '30px 0', fontSize: '0.8rem', opacity: 0.5 }}>
          Sin órdenes
        </div>
      )}

      {ordenes.map((o) => (
        <OTCard key={o._id || o.id} orden={o} onIniciar={onIniciar} onCompletar={onCompletar} onEditar={onEditar} onEliminar={onEliminar} />
      ))}
    </div>
  );
}

// ─── Modal ───────────────────────────────────────────────────────────────────

function OTModal({ mode, formData, setFormData, clientes, tecnicos, onClose, onSubmit, error, loading }) {
  const isEdit = mode === 'edit';
  return (
    <div
      style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="bg-surface border border-outline/20"
        style={{ borderRadius: 14, width: '100%', maxWidth: 520, padding: '28px 28px 24px', display: 'flex', flexDirection: 'column', gap: 0, maxHeight: '90vh', overflowY: 'auto' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
          <h2 className="text-primary" style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
            {isEdit ? '✏️ Editar Orden de Trabajo' : '+ Nueva Orden de Trabajo'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>✕</button>
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Cliente */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Cliente *</span>
            <select
              required
              className="bg-surface-high border border-outline/20 text-primary"
              style={{ padding: '9px 12px', borderRadius: 8, fontSize: '0.88rem', outline: 'none' }}
              value={formData.clienteId}
              onChange={(e) => setFormData(f => ({ ...f, clienteId: e.target.value }))}
            >
              <option value="">Seleccionar cliente…</option>
              {clientes.map((c) => (
                <option key={c._id || c.id} value={c._id || c.id}>{c.nombre}</option>
              ))}
            </select>
          </label>

          {/* Técnico */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Técnico</span>
            <select
              className="bg-surface-high border border-outline/20 text-primary"
              style={{ padding: '9px 12px', borderRadius: 8, fontSize: '0.88rem', outline: 'none' }}
              value={formData.tecnicoId}
              onChange={(e) => setFormData(f => ({ ...f, tecnicoId: e.target.value }))}
            >
              <option value="">Sin técnico asignado</option>
              {tecnicos.map((t) => (
                <option key={t._id || t.id} value={t._id || t.id}>{t.nombre} — {t.especialidad}</option>
              ))}
            </select>
          </label>

          {/* Tipo */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Tipo</span>
            <div style={{ display: 'flex', gap: 10 }}>
              {['PREVENTIVA', 'CORRECTIVA'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFormData(f => ({ ...f, tipo: t }))}
                  style={{
                    flex: 1, padding: '9px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem',
                    background: formData.tipo === t
                      ? (t === 'PREVENTIVA' ? 'rgba(6,182,212,0.22)' : 'rgba(249,115,22,0.22)')
                      : 'rgba(148,163,184,0.06)',
                    border: formData.tipo === t
                      ? `1px solid ${t === 'PREVENTIVA' ? 'rgba(6,182,212,0.5)' : 'rgba(249,115,22,0.5)'}`
                      : '1px solid rgba(148,163,184,0.15)',
                    color: formData.tipo === t
                      ? (t === 'PREVENTIVA' ? '#22d3ee' : '#fb923c')
                      : '#94a3b8',
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </label>

          {/* Descripción */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Descripción *</span>
            <textarea
              required
              rows={3}
              className="bg-surface-high border border-outline/20 text-primary"
              style={{ padding: '9px 12px', borderRadius: 8, fontSize: '0.88rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Detalle de la mantención…"
              value={formData.descripcion}
              onChange={(e) => setFormData(f => ({ ...f, descripcion: e.target.value }))}
            />
          </label>

          {/* Prioridad */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Prioridad</span>
            <select
              className="bg-surface-high border border-outline/20 text-primary"
              style={{ padding: '9px 12px', borderRadius: 8, fontSize: '0.88rem', outline: 'none' }}
              value={formData.prioridad}
              onChange={(e) => setFormData(f => ({ ...f, prioridad: e.target.value }))}
            >
              <option value="Baja">🟢 Baja</option>
              <option value="Normal">🟡 Normal</option>
              <option value="Alta">🟠 Alta</option>
              <option value="Urgente">🔴 Urgente</option>
            </select>
          </label>

          {/* Observaciones */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Observaciones</span>
            <textarea
              rows={2}
              className="bg-surface-high border border-outline/20 text-primary"
              style={{ padding: '9px 12px', borderRadius: 8, fontSize: '0.88rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
              placeholder="Notas adicionales…"
              value={formData.observaciones}
              onChange={(e) => setFormData(f => ({ ...f, observaciones: e.target.value }))}
            />
          </label>

          {/* Fecha */}
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Fecha y Hora</span>
            <input
              type="datetime-local"
              className="bg-surface-high border border-outline/20 text-primary"
              style={{ padding: '9px 12px', borderRadius: 8, fontSize: '0.88rem', outline: 'none', colorScheme: 'dark' }}
              value={formData.fechaHora}
              onChange={(e) => setFormData(f => ({ ...f, fechaHora: e.target.value }))}
            />
          </label>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.4)', borderRadius: 8, padding: '10px 14px', color: '#fca5a5', fontSize: '0.83rem' }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
            <button
              type="button"
              onClick={onClose}
              style={{ flex: 1, padding: '10px 0', borderRadius: 8, background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.2)', color: '#94a3b8', cursor: 'pointer', fontWeight: 600 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 2, padding: '10px 0', borderRadius: 8, background: loading ? 'rgba(6,182,212,0.3)' : 'rgba(6,182,212,0.25)', border: '1px solid rgba(6,182,212,0.5)', color: '#22d3ee', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 700, fontSize: '0.9rem' }}
            >
              {loading ? 'Guardando…' : isEdit ? 'Guardar Cambios' : 'Crear Orden'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Mantenciones() {
  const { token } = useAuth();
  const [ordenes, setOrdenes] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  // ─ Load data ─
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [ots, cls, techs] = await Promise.all([
        getMantenciones(token),
        getClientes(token),
        getTecnicos(token),
      ]);
      setOrdenes(Array.isArray(ots) ? ots : (ots?.data ?? []));
      setClientes(Array.isArray(cls) ? cls : (cls?.data ?? []));
      setTecnicos(Array.isArray(techs) ? techs : (techs?.data ?? []));
    } catch (err) {
      setError(err?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [token]);

  // ─ Filtered ordenes ─
  const filtered = ordenes;

  const counts = {
    total: filtered.length,
    pendiente: filtered.filter((o) => (o.estado || 'PENDIENTE').toUpperCase().replace(' ', '_') === 'PENDIENTE').length,
    en_curso: filtered.filter((o) => (o.estado || 'PENDIENTE').toUpperCase().replace(' ', '_') === 'EN_CURSO').length,
    completada: filtered.filter((o) => (o.estado || 'PENDIENTE').toUpperCase().replace(' ', '_') === 'COMPLETADA').length,
  };

  // ─ State transitions ─
  const handleIniciar = async (id) => {
    try {
      await cambiarEstadoMantencion(token, id, 'En Curso');
      await loadData();
    } catch (err) {
      alert(err?.message || 'Error al iniciar OT');
    }
  };

  const handleCompletar = async (id) => {
    try {
      await cambiarEstadoMantencion(token, id, 'Completada');
      await loadData();
    } catch (err) {
      alert(err?.message || 'Error al completar OT');
    }
  };

  const handleEliminar = async (id) => {
    try {
      await deleteMantencion(token, id);
      await loadData();
    } catch (err) {
      alert(err?.message || 'Error al eliminar OT');
    }
  };

  // ─ Modal handlers ─
  const openCreate = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData(EMPTY_FORM);
    setFormError(null);
    setShowModal(true);
  };

  const openEdit = (orden) => {
    setModalMode('edit');
    setEditingId(orden._id || orden.id);
    setFormData({
      clienteId: orden.cliente?._id || orden.clienteId || '',
      tecnicoId: orden.tecnico?._id || orden.tecnicoId || '',
      tipo: orden.tipo || 'PREVENTIVA',
      descripcion: orden.descripcion || orden.servicio || '',
      prioridad: orden.prioridad || 'Normal',
      observaciones: orden.observaciones || '',
      fechaHora: (orden.fechaHora || '').slice(0, 16) || now1h(),
    });
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);
    setFormLoading(true);
    try {
      const payload = {
        clienteId: formData.clienteId,
        clienteNombre: clientes.find(c => (c.id || c._id) === formData.clienteId)?.nombre,
        tecnicoId: formData.tecnicoId || undefined,
        tecnicoNombre: formData.tecnicoId ? tecnicos.find(t => (t.id || t._id) === formData.tecnicoId)?.nombre : undefined,
        tipo: formData.tipo,
        prioridad: formData.prioridad,
        descripcion: formData.descripcion,
        servicio: formData.descripcion,
        observaciones: formData.observaciones || undefined,
        fechaHora: formData.fechaHora.length === 16 ? `${formData.fechaHora}:00` : formData.fechaHora,
      };
      if (modalMode === 'edit') {
        await updateMantencion(token, editingId, payload);
      } else {
        await createMantencion(token, payload);
      }
      setShowModal(false);
      await loadData();
    } catch (err) {
      setFormError(err?.message || 'Error al guardar la orden');
    } finally {
      setFormLoading(false);
    }
  };

  // ─ Render ─

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
        <div style={{ width: 28, height: 28, border: '3px solid rgba(6,182,212,0.3)', borderTopColor: '#22d3ee', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span className="text-secondary">Cargando órdenes…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 16 }}>
        <div style={{ fontSize: '2.5rem' }}>⚠️</div>
        <div className="text-primary" style={{ fontWeight: 700 }}>Error al cargar</div>
        <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{error}</div>
        <button onClick={loadData} style={{ padding: '9px 22px', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)', color: '#22d3ee', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <h1 className="text-primary pool-glow" style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
            🔧 Órdenes de Trabajo
          </h1>
          {/* Badges */}
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(148,163,184,0.12)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
              TOTAL {counts.total}
            </span>
            <span style={{ background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
              PENDIENTE {counts.pendiente}
            </span>
            <span style={{ background: 'rgba(6,182,212,0.12)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.3)', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
              EN CURSO {counts.en_curso}
            </span>
            <span style={{ background: 'rgba(59,130,246,0.12)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
              COMPLETADA {counts.completada}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={openCreate}
            style={{ padding: '8px 18px', background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.5)', color: '#22d3ee', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem', whiteSpace: 'nowrap' }}
          >
            + Nueva OT
          </button>
        </div>
      </div>

      {/* Kanban */}
      <div style={{ display: 'flex', gap: 16, flex: 1, minHeight: 0 }}>
        {ESTADO_COLS.map((col) => (
          <KanbanColumn
            key={col.key}
            col={col}
            ordenes={filtered.filter((o) => (o.estado || 'PENDIENTE').toUpperCase().replace(' ', '_') === col.key)}
            onIniciar={handleIniciar}
            onCompletar={handleCompletar}
            onEditar={openEdit}
            onEliminar={handleEliminar}
          />
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <OTModal
          mode={modalMode}
          formData={formData}
          setFormData={setFormData}
          clientes={clientes}
          tecnicos={tecnicos}
          onClose={closeModal}
          onSubmit={handleSubmit}
          error={formError}
          loading={formLoading}
        />
      )}
    </div>
  );
}
