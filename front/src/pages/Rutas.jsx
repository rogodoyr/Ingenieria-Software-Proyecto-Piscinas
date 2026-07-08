import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTecnicos, cambiarEstadoTecnico, actualizarUbicacion } from '../api/rutas';
import { getMantenciones } from '../api/mantenciones';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ─── Constants ────────────────────────────────────────────────────────────────

// Coord central de despacho
const DESPACHO_COORDS = { lat: -33.4489, lng: -70.6693 }; // Centro de Santiago

// Mapeo aproximado de comunas de la RM
const COMUNAS_COORDS = {
  'las condes': { lat: -33.418, lng: -70.587 },
  'vitacura': { lat: -33.386, lng: -70.576 },
  'providencia': { lat: -33.437, lng: -70.615 },
  'ñuñoa': { lat: -33.455, lng: -70.596 },
  'santiago': { lat: -33.4489, lng: -70.6693 },
  'santiago centro': { lat: -33.4489, lng: -70.6693 },
  'maipu': { lat: -33.512, lng: -70.764 },
  'maipú': { lat: -33.512, lng: -70.764 },
  'la florida': { lat: -33.522, lng: -70.598 },
  'huechuraba': { lat: -33.375, lng: -70.638 },
  'lo barnechea': { lat: -33.353, lng: -70.516 },
  'peñalolén': { lat: -33.486, lng: -70.551 },
  'peñalolen': { lat: -33.486, lng: -70.551 },
  'san miguel': { lat: -33.497, lng: -70.650 },
  'macul': { lat: -33.495, lng: -70.596 },
  'puente alto': { lat: -33.612, lng: -70.575 },
  'la reina': { lat: -33.443, lng: -70.540 },
  'independencia': { lat: -33.414, lng: -70.662 },
  'recoleta': { lat: -33.400, lng: -70.640 },
  'cerrillos': { lat: -33.493, lng: -70.718 },
  'cerro navia': { lat: -33.424, lng: -70.743 },
  'conchalí': { lat: -33.386, lng: -70.676 },
  'conchali': { lat: -33.386, lng: -70.676 },
  'el bosque': { lat: -33.565, lng: -70.676 },
  'estación central': { lat: -33.458, lng: -70.702 },
  'estacion central': { lat: -33.458, lng: -70.702 },
  'la cisterna': { lat: -33.530, lng: -70.665 },
  'la granja': { lat: -33.538, lng: -70.627 },
  'la pintana': { lat: -33.585, lng: -70.632 },
  'lo espejo': { lat: -33.516, lng: -70.692 },
  'lo prado': { lat: -33.444, lng: -70.718 },
  'pedro aguirre cerda': { lat: -33.489, lng: -70.678 },
  'pudahuel': { lat: -33.440, lng: -70.768 },
  'quilicura': { lat: -33.360, lng: -70.730 },
  'quinta normal': { lat: -33.433, lng: -70.697 },
  'renca': { lat: -33.405, lng: -70.722 },
  'san joaquín': { lat: -33.494, lng: -70.623 },
  'san joaquin': { lat: -33.494, lng: -70.623 },
  'san ramón': { lat: -33.535, lng: -70.644 },
  'san ramon': { lat: -33.535, lng: -70.644 },
  'san bernardo': { lat: -33.592, lng: -70.699 },
};

const COMUNAS_LISTA = Object.keys(COMUNAS_COORDS).filter((item, index, arr) => 
  // Filtrar acentos duplicados para la UI
  !['maipu', 'peñalolen', 'conchali', 'estacion central', 'san joaquin', 'san ramon'].includes(item)
).sort();

const ESTADO_COLORS = {
  DISPONIBLE:   { dot: '#3b82f6', ring: 'rgba(59,130,246,0.35)',  badge: '#3b82f6',  badgeBg: 'rgba(59,130,246,0.14)'  },
  EN_RUTA:      { dot: '#22d3ee', ring: 'rgba(6,182,212,0.4)',    badge: '#22d3ee',  badgeBg: 'rgba(6,182,212,0.14)'   }
};

function getEstadoStyle(estado) {
  return ESTADO_COLORS[estado] || ESTADO_COLORS.DISPONIBLE;
}

function formatTime(date) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' });
}

function normalizeStr(str) {
  if (!str) return '';
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

// ─── Map Helpers ─────────────────────────────────────────────────────────────

function createCustomIcon(tecnico, isSelected) {
  const estado = tecnico.estado || 'DISPONIBLE';
  const sc = getEstadoStyle(estado);
  const size = isSelected ? 26 : 20;

  const pulseHtml = estado === 'EN_RUTA' 
    ? `<span style="position: absolute; width: ${size+14}px; height: ${size+14}px; border-radius: 50%; background: ${sc.ring}; animation: ping 1.2s cubic-bezier(0,0,0.2,1) infinite; top: 50%; left: 50%; transform: translate(-50%, -50%);"></span>`
    : estado === 'EN_MANTENCION'
    ? `<span style="position: absolute; width: ${size+10}px; height: ${size+10}px; border-radius: 50%; border: 2px solid ${sc.dot}; animation: pulse 1.5s ease-in-out infinite; top: 50%; left: 50%; transform: translate(-50%, -50%);"></span>`
    : '';

  const html = `
    <div style="position: relative; display: flex; flex-direction: column; items-align: center; justify-content: center; width: 100%; height: 100%;">
      ${pulseHtml}
      <div style="width: ${size}px; height: ${size}px; border-radius: 50%; background: ${sc.dot}; border: ${isSelected ? '3px solid white' : `2px solid ${sc.ring}`}; box-shadow: ${isSelected ? `0 0 12px ${sc.dot}` : `0 0 6px ${sc.ring}`}; position: relative; z-index: 1; display: flex; align-items: center; justify-content: center; font-size: 0.6rem; color: #fff;">
         ${estado === 'EN_RUTA' ? '➤' : ''}
      </div>
      <div style="position: absolute; top: ${size + 4}px; left: 50%; transform: translateX(-50%); background: rgba(15,23,42,0.85); border: 1px solid ${sc.dot}44; border-radius: 5px; padding: 2px 6px; font-size: 0.65rem; color: ${sc.dot}; font-weight: 700; white-space: nowrap; backdrop-filter: blur(4px);">
        ${tecnico.nombre?.split(' ')[0] || 'Téc'}
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: '', 
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size/2],
  });
}

// ─── Asignar Ruta Modal ──────────────────────────────────────────────────────

function AsignarRutaModal({ onClose, tecnicos, onAsignar }) {
  const [techId, setTechId] = useState('');
  const [comuna, setComuna] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!techId || !comuna) {
      alert('Por favor selecciona un técnico y una comuna de destino.');
      return;
    }
    setLoading(true);
    await onAsignar(techId, comuna);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-surface border border-outline/20 rounded-2xl w-full max-w-sm shadow-2xl pool-glow flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline/20 shrink-0">
          <h2 className="text-primary font-bold text-lg">📍 Asignar / Reasignar Ruta</h2>
          <button onClick={onClose} className="text-secondary hover:text-primary text-2xl leading-none transition-colors">×</button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-medium uppercase tracking-wide">Técnico</label>
            <select
              value={techId}
              onChange={(e) => setTechId(e.target.value)}
              required
              className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            >
              <option value="">-- Seleccionar --</option>
              {tecnicos.map(t => (
                <option key={t.id || t._id} value={t.id || t._id}>{t.nombre} ({t.estadoSeguro?.replace('_', ' ')})</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-secondary text-xs font-medium uppercase tracking-wide">Comuna de Destino</label>
            <select
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              required
              className="bg-surface-high border border-outline/20 text-primary rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary/60"
            >
              <option value="">-- Seleccionar Comuna --</option>
              {COMUNAS_LISTA.map(c => (
                <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
              ))}
            </select>
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
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 bg-primary-container text-primary py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Asignando…' : 'Asignar'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Technician card (left panel) ─────────────────────────────────────────────

function TechCard({ tecnico, isSelected, mantenciones, onSelect, onDespachar, onLiberar, onLlegada }) {
  const estado = tecnico.estado || 'DISPONIBLE';
  const sc = getEstadoStyle(estado);
  const id = tecnico._id || tecnico.id;

  const activaOT = estado === 'EN_RUTA'
    ? mantenciones.find((m) => {
        const techId = m.tecnico?._id || m.tecnico?.id || m.tecnicoId;
        return techId === id && (m.estado === 'EN_CURSO' || m.estado === 'PENDIENTE');
      })
    : null;

  return (
    <div
      onClick={() => onSelect(id)}
      className="bg-surface-high border border-outline/20 hover:bg-surface/50"
      style={{
        borderRadius: 10,
        padding: '12px 14px',
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        cursor: 'pointer',
        borderColor: isSelected ? sc.dot : undefined,
        boxShadow: isSelected ? `0 0 0 1px ${sc.dot}` : undefined,
        transition: 'all 0.15s',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <div className="text-primary" style={{ fontWeight: 700, fontSize: '0.88rem' }}>{tecnico.nombre}</div>
          {tecnico.especialidad && (
            <div className="text-secondary" style={{ fontSize: '0.72rem' }}>{tecnico.especialidad}</div>
          )}
        </div>
        <span style={{
          background: sc.badgeBg,
          color: sc.badge,
          border: `1px solid ${sc.dot}44`,
          borderRadius: 20,
          padding: '2px 9px',
          fontSize: '0.68rem',
          fontWeight: 700,
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
        }}>
          {estado === 'EN_RUTA' && (
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22d3ee', animation: 'ping 1s infinite', display: 'inline-block' }} />
          )}
          {estado.replace('_', ' ')}
        </span>
      </div>

      {/* EN_RUTA: ETA */}
      {estado === 'EN_RUTA' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#22d3ee' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#22d3ee', animation: 'ping 1.2s infinite', display: 'inline-block' }} />
          En trayecto a destino
        </div>
      )}

      {/* OT info */}
      {estado === 'EN_RUTA' && activaOT && (
        <div style={{ fontSize: '0.72rem', color: '#fb923c', background: 'rgba(249,115,22,0.08)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 6, padding: '5px 8px', marginTop: 4 }}>
          <div>🔧 OT #{(activaOT._id || activaOT.id || '').slice(0, 8)}</div>
          <div style={{ color: '#fdba74', marginTop: 2, fontWeight: 600 }}>{activaOT.cliente?.nombre || activaOT.clienteNombre || 'Cliente'}</div>
          {(activaOT.cliente?.comuna || activaOT.comuna) && (
            <div style={{ color: '#fdba74', marginTop: 1 }}>📍 {activaOT.cliente?.comuna || activaOT.comuna}</div>
          )}
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 7, marginTop: 4 }}>
        {estado === 'DISPONIBLE' && (
          <button
            onClick={(e) => { e.stopPropagation(); onDespachar(id); }}
            style={{ flex: 1, padding: '6px 0', borderRadius: 7, background: 'rgba(6,182,212,0.14)', border: '1px solid rgba(6,182,212,0.35)', color: '#22d3ee', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem' }}
          >
            🚀 Despachar
          </button>
        )}
        {estado === 'EN_RUTA' && (
          <button
            onClick={(e) => { e.stopPropagation(); onLiberar(id); }}
            style={{ flex: 1, padding: '6px 0', borderRadius: 7, background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.25)', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem' }}
          >
            🔓 Liberar
          </button>
        )}
      </div>
    </div>
  );
}

// Map Updater Component to change center when tech selected
function MapUpdater({ selectedCoords }) {
  const map = useMap();
  useEffect(() => {
    if (selectedCoords) {
      map.setView(selectedCoords, 14, { animate: true, duration: 1.5 });
    }
  }, [selectedCoords, map]);
  return null;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Rutas() {
  const { token } = useAuth();
  const [tecnicos, setTecnicos] = useState([]);
  const [mantenciones, setMantenciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTechId, setSelectedTechId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // States for new functionality
  const [filtroEstado, setFiltroEstado] = useState(null); // null, DISPONIBLE, EN_RUTA
  const [modalAsignar, setModalAsignar] = useState(false);

  const intervalRef = useRef(null);

  // ─ Load ─
  const loadData = async () => {
    try {
      const [techs, ots] = await Promise.all([
        getTecnicos(token),
        getMantenciones(token),
      ]);
      setTecnicos(Array.isArray(techs) ? techs : (techs?.data ?? []));
      setMantenciones(Array.isArray(ots) ? ots : (ots?.data ?? []));
      setCurrentTime(new Date());
      setError(null);
    } catch (err) {
      setError(err?.message || 'Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    intervalRef.current = setInterval(() => { loadData(); }, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [token]);

  // ─ Counts ─
  const getEstadoSeguro = (t) => {
    if (!t.estado) return 'DISPONIBLE';
    const e = t.estado.toUpperCase();
    if (e === 'EN RUTA' || e === 'EN_RUTA') return 'EN_RUTA';
    return e;
  };
  const counts = {
    disponible:    tecnicos.filter((t) => getEstadoSeguro(t) === 'DISPONIBLE').length,
    en_ruta:       tecnicos.filter((t) => getEstadoSeguro(t) === 'EN_RUTA').length
  };

  // ─ Calc Real Coords for Tech ─
  const getTechCoords = (t) => {
    const estado = getEstadoSeguro(t);
    // Si esta disponible, usar su comuna o dispersar
    if (estado === 'DISPONIBLE') {
      const comunaPropia = t.comuna || (t.direccion && t.direccion.includes(',') ? t.direccion.split(',')[1] : null);
      if (comunaPropia) {
        const key = normalizeStr(comunaPropia);
        if (COMUNAS_COORDS[key]) {
           const jitterLat = (Math.random() - 0.5) * 0.01;
           const jitterLng = (Math.random() - 0.5) * 0.01;
           return { lat: COMUNAS_COORDS[key].lat + jitterLat, lng: COMUNAS_COORDS[key].lng + jitterLng };
        }
      }
      
      const jitterLat = (Math.random() - 0.5) * 0.06;
      const jitterLng = (Math.random() - 0.5) * 0.06;
      return { lat: DESPACHO_COORDS.lat + jitterLat, lng: DESPACHO_COORDS.lng + jitterLng };
    }

    // Si esta en ruta o mantencion, intentar buscar la OT activa
    const id = t._id || t.id;
    const activaOT = mantenciones.find((m) => {
      const techId = m.tecnico?._id || m.tecnico?.id || m.tecnicoId;
      return techId === id && (m.estado === 'EN_CURSO' || m.estado === 'PENDIENTE');
    });

    if (activaOT) {
      const comuna = activaOT.cliente?.comuna || activaOT.comuna;
      if (comuna) {
        const key = normalizeStr(comuna);
        if (COMUNAS_COORDS[key]) {
           const jitterLat = (Math.random() - 0.5) * 0.005;
           const jitterLng = (Math.random() - 0.5) * 0.005;
           return { lat: COMUNAS_COORDS[key].lat + jitterLat, lng: COMUNAS_COORDS[key].lng + jitterLng };
        }
      }
    }

    // Default to last known or dispatch
    if (t.lat && t.lng) return { lat: t.lat, lng: t.lng };
    return DESPACHO_COORDS;
  };

  // Pre-calculate coords
  const techLocations = tecnicos.map(t => ({
    ...t,
    estadoSeguro: getEstadoSeguro(t),
    coords: getTechCoords(t)
  }));

  const filteredTechs = filtroEstado 
    ? techLocations.filter(t => t.estadoSeguro === filtroEstado)
    : techLocations;

  const selectedTechCoords = selectedTechId 
    ? techLocations.find(t => (t._id || t.id) === selectedTechId)?.coords 
    : null;

  // ─ Actions ─
  const handleDespachar = async (id) => {
    try {
      await cambiarEstadoTecnico(token, id, 'En Ruta');
      const tData = techLocations.find((t) => (t._id || t.id) === id);
      if (tData) {
         await actualizarUbicacion(token, id, tData.coords.lat, tData.coords.lng);
      }
      await loadData();
    } catch (err) {
      alert(err?.message || 'Error al despachar técnico');
    }
  };

  const handleLiberar = async (id) => {
    try {
      await cambiarEstadoTecnico(token, id, 'Disponible');
      await actualizarUbicacion(token, id, DESPACHO_COORDS.lat, DESPACHO_COORDS.lng);
      await loadData();
    } catch (err) {
      alert(err?.message || 'Error al liberar técnico');
    }
  };

  const handleAsignarManual = async (techId, comunaNombre) => {
    const key = normalizeStr(comunaNombre);
    const coords = COMUNAS_COORDS[key] || DESPACHO_COORDS;
    
    // Add jitter so they don't land exactly on top of each other
    const jitterLat = (Math.random() - 0.5) * 0.005;
    const jitterLng = (Math.random() - 0.5) * 0.005;
    
    try {
      await cambiarEstadoTecnico(token, techId, 'En Ruta');
      await actualizarUbicacion(token, techId, coords.lat + jitterLat, coords.lng + jitterLng);
      setModalAsignar(false);
      await loadData();
      setSelectedTechId(techId); // Auto-focus in map
    } catch (err) {
      alert(err?.message || 'Error asignando la ruta manualmente');
    }
  };

  const handleFiltroClick = (estado) => {
    setFiltroEstado(prev => prev === estado ? null : estado);
  };

  // ─ Loading ─
  if (loading && tecnicos.length === 0) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
        <div style={{ width: 28, height: 28, border: '3px solid rgba(6,182,212,0.3)', borderTopColor: '#22d3ee', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span className="text-secondary">Cargando centro de despacho y mapas…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 14 }}>
        <div style={{ fontSize: '2rem' }}>⚠️</div>
        <div className="text-primary" style={{ fontWeight: 700 }}>{error}</div>
        <button onClick={loadData} style={{ padding: '8px 20px', background: 'rgba(6,182,212,0.15)', border: '1px solid rgba(6,182,212,0.4)', color: '#22d3ee', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20, height: '100%' }}>
      {/* Animations */}
      <style>{`
        @keyframes spin  { to { transform: rotate(360deg); } }
        @keyframes ping  { 0% { opacity: 1; transform: translate(-50%,-50%) scale(0.8); } 75%, 100% { opacity: 0; transform: translate(-50%,-50%) scale(2); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        /* Make leaflet map fit container */
        .leaflet-container { height: 100%; width: 100%; border-radius: 14px; background: #0f172a; z-index: 10; }
        /* Dark mode tiles styling using CSS filter to invert map tiles */
        .dark-tiles {
          filter: invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%);
        }
      `}</style>

      {/* Modals */}
      {modalAsignar && (
        <AsignarRutaModal 
          onClose={() => setModalAsignar(false)} 
          tecnicos={techLocations}
          onAsignar={handleAsignarManual}
        />
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="text-primary pool-glow" style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
            🗺️ Rutas & Despacho
          </h1>
          <p className="text-secondary" style={{ margin: '2px 0 0', fontSize: '0.8rem' }}>
            Localización GPS y gestión en tiempo real
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setModalAsignar(true)}
            className="bg-primary-container text-primary font-semibold px-4 py-2 rounded-xl text-sm hover:opacity-90 transition-all pool-glow"
          >
            📍 Asignar Ruta Manual
          </button>
          <button
            onClick={loadData}
            style={{ padding: '7px 16px', background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.3)', color: '#22d3ee', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
          >
            ↺ Actualizar Mapas
          </button>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'flex', gap: 18, flex: 1, minHeight: 0 }}>

        {/* ── Left Panel 35% ── */}
        <div style={{ flex: '0 0 35%', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
          {/* Dispatch header */}
          <div
            className="bg-surface border border-outline/20"
            style={{ borderRadius: 12, padding: '14px 16px' }}
          >
            <div className="text-primary flex justify-between items-center" style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 4 }}>
              <span>🏢 Centro de Despacho</span>
              {filtroEstado && (
                <button onClick={() => setFiltroEstado(null)} className="text-xs text-secondary hover:text-primary underline">
                  Quitar filtro
                </button>
              )}
            </div>
            <div className="text-secondary" style={{ fontSize: '0.78rem', marginBottom: 14 }}>
              Base Operaciones (Santiago)
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <div 
                onClick={() => handleFiltroClick('DISPONIBLE')}
                style={{ flex: 1, background: 'rgba(59,130,246,0.1)', border: filtroEstado === 'DISPONIBLE' ? '1px solid #60a5fa' : '1px solid rgba(59,130,246,0.25)', borderRadius: 8, padding: '8px 10px', textAlign: 'center', cursor: 'pointer', opacity: filtroEstado && filtroEstado !== 'DISPONIBLE' ? 0.4 : 1, transition: 'all 0.2s' }}
              >
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#60a5fa' }}>{counts.disponible}</div>
                <div style={{ fontSize: '0.65rem', color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Disponible</div>
              </div>
              <div 
                onClick={() => handleFiltroClick('EN_RUTA')}
                style={{ flex: 1, background: 'rgba(6,182,212,0.1)', border: filtroEstado === 'EN_RUTA' ? '1px solid #22d3ee' : '1px solid rgba(6,182,212,0.25)', borderRadius: 8, padding: '8px 10px', textAlign: 'center', cursor: 'pointer', opacity: filtroEstado && filtroEstado !== 'EN_RUTA' ? 0.4 : 1, transition: 'all 0.2s' }}
              >
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#22d3ee' }}>{counts.en_ruta}</div>
                <div style={{ fontSize: '0.65rem', color: '#22d3ee', textTransform: 'uppercase', letterSpacing: '0.04em' }}>En Ruta</div>
              </div>
            </div>
          </div>

          {/* Technician list */}
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingRight: 4 }} className="custom-scrollbar">
            {filteredTechs.length === 0 && (
              <div className="text-secondary" style={{ textAlign: 'center', padding: 30, opacity: 0.5, fontSize: '0.85rem' }}>
                {techLocations.length === 0 ? 'Sin técnicos registrados' : 'Ningún técnico coincide con este filtro'}
              </div>
            )}
            {filteredTechs.map((t) => (
              <TechCard
                key={t._id || t.id}
                tecnico={t}
                isSelected={selectedTechId === (t._id || t.id)}
                mantenciones={mantenciones}
                onSelect={(id) => setSelectedTechId((prev) => prev === id ? null : id)}
                onDespachar={handleDespachar}
                onLiberar={handleLiberar}
              />
            ))}
          </div>
        </div>

        {/* ── Right Panel: Leaflet Map 65% ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0, minHeight: 0, position: 'relative' }}>
          <div
            style={{
              flex: 1,
              borderRadius: 14,
              overflow: 'hidden',
              border: '1px solid rgba(6,182,212,0.3)',
              boxShadow: '0 0 20px rgba(0,0,0,0.4)',
            }}
          >
            <MapContainer 
               center={DESPACHO_COORDS} 
               zoom={11} 
               scrollWheelZoom={true}
               zoomControl={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                className="dark-tiles"
              />
              <MapUpdater selectedCoords={selectedTechCoords} />

              {/* Office Marker */}
              <Marker position={DESPACHO_COORDS} icon={L.divIcon({
                  html: `<div style="font-size:1.8rem; transform:translate(-10px, -15px);">🏢</div>`,
                  className: '',
                  iconSize: [30, 30]
              })}>
                <Popup>
                   <b style={{ color: '#0f172a' }}>Centro de Despacho</b><br/>
                   Base Operaciones VeranoPerfecto
                </Popup>
              </Marker>

              {/* Technicians Markers */}
              {filteredTechs.map(t => {
                const isSelected = selectedTechId === (t._id || t.id);
                const activaOT = t.estadoSeguro === 'EN_RUTA'
                  ? mantenciones.find((m) => {
                      const techId = m.tecnico?._id || m.tecnico?.id || m.tecnicoId;
                      return techId === (t._id || t.id) && (m.estado === 'EN_CURSO' || m.estado === 'PENDIENTE');
                    })
                  : null;

                return (
                  <Marker 
                    key={t._id || t.id} 
                    position={t.coords} 
                    icon={createCustomIcon(t, isSelected)}
                    zIndexOffset={isSelected ? 1000 : 0}
                    ref={(ref) => {
                      if (ref && isSelected && !ref.isPopupOpen()) {
                        ref.openPopup();
                      }
                    }}
                    eventHandlers={{
                      click: () => setSelectedTechId(t._id || t.id),
                    }}
                  >
                    <Popup autoPan={false}>
                       <b style={{ color: '#0f172a' }}>{t.nombre}</b><br/>
                       Estado: {t.estadoSeguro?.replace('_', ' ')}<br/>
                       {activaOT && (
                         <div style={{ marginTop: 4, padding: 4, background: '#f1f5f9', borderRadius: 4, fontSize: '0.8rem', color: '#334155' }}>
                           <b>OT #{(activaOT._id || activaOT.id || '').slice(0, 8)}</b><br/>
                           Cliente: {activaOT.cliente?.nombre || activaOT.clienteNombre}<br/>
                           📍 {activaOT.cliente?.comuna || activaOT.comuna}
                         </div>
                       )}
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Bottom info bar overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0, left: 0, right: 0,
              background: 'rgba(15,23,42,0.85)',
              borderTop: '1px solid rgba(6,182,212,0.2)',
              padding: '6px 14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backdropFilter: 'blur(8px)',
              zIndex: 1000 // Above map
            }}>
              <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em' }}>
                Conexión Satelital Activa (OpenStreetMap)
              </span>
              <span style={{ fontSize: '0.7rem', color: '#22d3ee', fontWeight: 600 }}>
                🕐 Actualizado: {formatTime(currentTime)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
