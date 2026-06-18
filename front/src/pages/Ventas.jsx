import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getProductos, createVenta, getVentas, updateProducto } from '../api/ventas';
import { getClientes } from '../api/clientes';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatCLP(n) {
  if (n == null) return '$0';
  return '$' + Number(n).toLocaleString('es-CL');
}

function truncateId(id) {
  return (id || '').toString().slice(0, 8);
}

const CATEGORIAS_ALL = 'Todas';

const ESTADO_VENTA = {
  BORRADOR: { color: '#94a3b8', bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.25)' },
  EMITIDA:  { color: '#22d3ee', bg: 'rgba(6,182,212,0.12)',   border: 'rgba(6,182,212,0.3)'   },
  PAGADA:   { color: '#4ade80', bg: 'rgba(34,197,94,0.12)',   border: 'rgba(34,197,94,0.3)'   },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '9px 22px',
        borderRadius: '8px 8px 0 0',
        border: 'none',
        borderBottom: active ? '2px solid #22d3ee' : '2px solid transparent',
        background: active ? 'rgba(6,182,212,0.1)' : 'transparent',
        color: active ? '#22d3ee' : '#64748b',
        fontWeight: active ? 700 : 500,
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}
    >
      {children}
    </button>
  );
}

function ProductCard({ product, onAdd }) {
  const isAgotado = product.stock !== undefined && product.stock <= 0;
  return (
    <div
      className={`bg-surface-high border border-outline/20 ${isAgotado ? 'opacity-60 grayscale' : ''}`}
      style={{ borderRadius: 10, padding: 14, display: 'flex', flexDirection: 'column', gap: 8, cursor: isAgotado ? 'not-allowed' : 'pointer', transition: 'border-color 0.15s' }}
      onClick={() => { if (!isAgotado) onAdd(product); }}
      onMouseEnter={(e) => { if (!isAgotado) e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'; }}
      onMouseLeave={(e) => { if (!isAgotado) e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)'; }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6 }}>
        <span className="text-primary" style={{ fontWeight: 600, fontSize: '0.88rem', lineHeight: 1.3 }}>{product.icono} {product.nombre}</span>
        <span
          style={{ fontSize: '0.65rem', padding: '2px 7px', borderRadius: 4, background: 'rgba(6,182,212,0.12)', color: '#22d3ee', border: '1px solid rgba(6,182,212,0.25)', whiteSpace: 'nowrap' }}
        >
          {product.categoria || 'General'}
        </span>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.95rem' }}>
          {formatCLP(product.precio)}
        </span>
        <span style={{ fontSize: '0.72rem', color: isAgotado ? '#f87171' : '#64748b', fontWeight: isAgotado ? 700 : 400 }}>
          {isAgotado ? 'Agotado' : `Stock: ${product.stock ?? '∞'}`}
        </span>
      </div>
      <div style={{ background: isAgotado ? 'rgba(148,163,184,0.1)' : 'rgba(6,182,212,0.1)', border: isAgotado ? '1px solid rgba(148,163,184,0.2)' : '1px solid rgba(6,182,212,0.2)', color: isAgotado ? '#94a3b8' : '#22d3ee', borderRadius: 6, padding: '4px 0', textAlign: 'center', fontSize: '0.78rem', fontWeight: 600 }}>
        {isAgotado ? 'Sin stock' : '+ Agregar al carro'}
      </div>
    </div>
  );
}

function CartItem({ item, onChangeQty, onRemove }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="text-primary" style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {item.nombre}
        </div>
        <div className="text-secondary" style={{ fontSize: '0.75rem' }}>
          {formatCLP(item.precio)} c/u
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button
          onClick={() => onChangeQty(item.productoId, item.cantidad - 1)}
          style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(148,163,184,0.08)', color: '#94a3b8', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          −
        </button>
        <span className="text-primary" style={{ fontWeight: 700, minWidth: 22, textAlign: 'center', fontSize: '0.88rem' }}>
          {item.cantidad}
        </span>
        <button
          onClick={() => onChangeQty(item.productoId, item.cantidad + 1)}
          style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(148,163,184,0.2)', background: 'rgba(148,163,184,0.08)', color: '#94a3b8', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          +
        </button>
      </div>
      <div style={{ minWidth: 70, textAlign: 'right', fontWeight: 700, color: '#4ade80', fontSize: '0.85rem' }}>
        {formatCLP(item.precio * item.cantidad)}
      </div>
      <button
        onClick={() => onRemove(item.productoId)}
        style={{ width: 26, height: 26, borderRadius: 6, border: '1px solid rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        title="Eliminar"
      >
        ✕
      </button>
    </div>
  );
}

// ─── Restock Modal ────────────────────────────────────────────────────────────

function RestockModal({ isOpen, onClose, productos, token, onRestockSuccess }) {
  const [selectedId, setSelectedId] = useState('');
  const [addQty, setAddQty] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) return setError('Selecciona un producto');
    if (addQty <= 0) return setError('Cantidad debe ser mayor a 0');
    
    setLoading(true);
    setError(null);
    try {
      const prod = productos.find(p => (p._id || p.id) === selectedId);
      const newStock = (prod.stock || 0) + addQty;
      await updateProducto(token, selectedId, { 
        nombre: prod.nombre,
        categoria: prod.categoria,
        precio: prod.precio,
        icono: prod.icono,
        descripcion: prod.descripcion,
        stock: newStock,
        minimo: prod.minimo || 0
      });
      onRestockSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Error reponiendo stock');
    } finally {
      setLoading(false);
    }
  };

  const inventoryProducts = productos;

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.8)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
      <div className="bg-surface border border-outline/20" style={{ padding: 24, borderRadius: 16, width: 400, maxWidth: '90%' }}>
        <h3 className="text-primary" style={{ margin: '0 0 16px', fontSize: '1.2rem', fontWeight: 700 }}>📦 Reponer Stock</h3>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Producto</label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="bg-surface-high border border-outline/20 text-primary"
              style={{ padding: '10px 12px', borderRadius: 8, outline: 'none' }}
              required
            >
              <option value="">Seleccionar producto...</option>
              {inventoryProducts.map(p => (
                <option key={p._id || p.id} value={p._id || p.id}>
                  {p.nombre} (Stock actual: {p.stock || 0})
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 600 }}>Cantidad a Sumar</label>
            <input
              type="number"
              min="1"
              value={addQty}
              onChange={(e) => setAddQty(Number(e.target.value))}
              className="bg-surface-high border border-outline/20 text-primary"
              style={{ padding: '10px 12px', borderRadius: 8, outline: 'none' }}
              required
            />
          </div>
          {error && <div style={{ color: '#f87171', fontSize: '0.85rem' }}>⚠️ {error}</div>}
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            <button
              type="button"
              onClick={onClose}
              className="text-secondary"
              style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'rgba(148,163,184,0.1)', border: 'none', cursor: 'pointer' }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{ flex: 1, padding: '10px', borderRadius: 8, background: 'rgba(34,197,94,0.2)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.4)', cursor: loading ? 'wait' : 'pointer', fontWeight: 600 }}
            >
              {loading ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Historia Tab ─────────────────────────────────────────────────────────────

function HistorialTab({ token, clientes }) {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getVentas(token)
      .then((data) => setVentas(Array.isArray(data) ? data : (data?.data ?? [])))
      .catch((err) => setError(err?.message || 'Error al cargar historial'))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}>
      <div style={{ width: 24, height: 24, border: '3px solid rgba(6,182,212,0.3)', borderTopColor: '#22d3ee', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  if (error) return (
    <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '16px 20px', color: '#fca5a5' }}>
      ⚠️ {error}
    </div>
  );

  if (ventas.length === 0) return (
    <div className="text-secondary" style={{ textAlign: 'center', padding: 48, opacity: 0.5 }}>Sin ventas registradas</div>
  );

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
        <thead>
          <tr>
            {['ID', 'Cliente', 'Ítems', 'Total', 'Tipo Doc.', 'Estado'].map((h) => (
              <th key={h} className="text-secondary" style={{ textAlign: 'left', padding: '6px 12px', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ventas.map((v) => {
            const estadoStyle = ESTADO_VENTA[v.estado] || ESTADO_VENTA.BORRADOR;
            const clienteNombre = v.cliente?.nombre || v.clienteNombre || clientes.find(c => (c.id || c._id) === v.clienteId)?.nombre || '—';
            const itemsCount = v.items?.length ?? 0;
            const total = v.total ?? v.items?.reduce((s, i) => s + (i.precioUnitario || 0) * (i.cantidad || 1), 0) ?? 0;
            return (
              <tr key={v._id || v.id} className="bg-surface-high">
                <td style={{ padding: '10px 12px', borderRadius: '8px 0 0 8px', fontFamily: 'monospace', fontSize: '0.8rem', color: '#94a3b8' }}>
                  #{truncateId(v._id || v.id)}
                </td>
                <td className="text-primary" style={{ padding: '10px 12px', fontWeight: 600, fontSize: '0.85rem' }}>
                  {clienteNombre}
                </td>
                <td className="text-secondary" style={{ padding: '10px 12px', textAlign: 'center' }}>
                  {itemsCount}
                </td>
                <td style={{ padding: '10px 12px', color: '#4ade80', fontWeight: 700 }}>
                  {formatCLP(total)}
                </td>
                <td className="text-secondary" style={{ padding: '10px 12px', fontSize: '0.8rem' }}>
                  {v.tipoDocumento || '—'}
                </td>
                <td style={{ padding: '10px 12px', borderRadius: '0 8px 8px 0' }}>
                  <span style={{ background: estadoStyle.bg, color: estadoStyle.color, border: `1px solid ${estadoStyle.border}`, borderRadius: 20, padding: '2px 10px', fontSize: '0.72rem', fontWeight: 700 }}>
                    {v.estado || 'BORRADOR'}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Ventas() {
  const { token } = useAuth();

  // Data
  const [productos, setProductos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // UI
  const [activeTab, setActiveTab] = useState('nueva'); // 'nueva' | 'historial'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoria, setSelectedCategoria] = useState(CATEGORIAS_ALL);

  // Cart
  const [cart, setCart] = useState([]);

  // Client
  const [selectedClient, setSelectedClient] = useState(null);

  // Billing
  const [tipoDocumento, setTipoDocumento] = useState('Boleta Electrónica');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [ventaId, setVentaId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  // Modals
  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  // ─ Load ─
  useEffect(() => {
    setLoading(true);
    Promise.all([getProductos(token), getClientes(token)])
      .then(([prods, cls]) => {
        setProductos(Array.isArray(prods) ? prods : (prods?.data ?? []));
        setClientes(Array.isArray(cls) ? cls : (cls?.data ?? []));
      })
      .catch((err) => setError(err?.message || 'Error al cargar datos'))
      .finally(() => setLoading(false));
  }, [token]);

  // ─ Categorías ─
  const categorias = [CATEGORIAS_ALL, ...Array.from(new Set(productos.map((p) => p.categoria).filter(Boolean)))];

  // ─ Filtered productos ─
  const filteredProds = productos.filter((p) => {
    const matchSearch = !searchTerm || p.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategoria === CATEGORIAS_ALL || p.categoria === selectedCategoria;
    return matchSearch && matchCat;
  });

  // ─ Cart handlers ─
  const addToCart = (product) => {
    const id = product._id || product.id;
    setCart((prev) => {
      const existing = prev.find((i) => i.productoId === id);
      if (existing) {
        if (product.stock !== undefined && existing.cantidad >= product.stock) {
          setSubmitError(`No puedes agregar más. Stock disponible: ${product.stock}`);
          return prev;
        }
        return prev.map((i) => i.productoId === id ? { ...i, cantidad: i.cantidad + 1 } : i);
      }
      return [...prev, { productoId: id, nombre: product.nombre, precio: product.precio, cantidad: 1, stock: product.stock, categoria: product.categoria }];
    });
    setSuccessMsg(null);
    setVentaId(null);
  };

  const changeQty = (productoId, qty) => {
    if (qty < 1) return;
    setCart((prev) => prev.map((i) => {
      if (i.productoId === productoId) {
        if (i.stock !== undefined && qty > i.stock) {
          setSubmitError(`No puedes exceder el stock disponible de ${i.stock}`);
          return i;
        }
        return { ...i, cantidad: qty };
      }
      return i;
    }));
  };

  const removeItem = (productoId) => {
    setCart((prev) => prev.filter((i) => i.productoId !== productoId));
  };

  // ─ Totals ─
  const subtotal = cart.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const iva = Math.round(subtotal * 0.19);
  const total = subtotal + iva;

  // ─ Submit ─
  const handleGenerar = async () => {
    if (!selectedClient) return;
    if (cart.length === 0) { setSubmitError('El carro está vacío.'); return; }
    setSubmitting(true);
    setSubmitError(null);
    setSuccessMsg(null);
    setVentaId(null);
    try {
      const result = await createVenta(token, {
        clienteId: selectedClient._id || selectedClient.id,
        tipoDocumento,
        items: cart.map((i) => ({ productoId: i.productoId, cantidad: i.cantidad, precioUnitario: i.precio })),
      });
      const id = result?._id || result?.id || result?.ventaId;
      setVentaId(id);
      setSuccessMsg(`Venta registrada exitosamente para ${selectedClient.nombre}`);
      setCart([]);
      setSelectedClient(null);
      
      // Refresh products to show updated stock
      getProductos(token).then((prods) => setProductos(Array.isArray(prods) ? prods : (prods?.data ?? [])));
    } catch (err) {
      setSubmitError(err?.message || 'Error al generar venta');
    } finally {
      setSubmitting(false);
    }
  };

  // ─ Render loading/error ─
  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
        <div style={{ width: 28, height: 28, border: '3px solid rgba(6,182,212,0.3)', borderTopColor: '#22d3ee', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <span className="text-secondary">Cargando productos…</span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: 12 }}>
        <div style={{ fontSize: '2rem' }}>⚠️</div>
        <div className="text-primary" style={{ fontWeight: 700 }}>{error}</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid rgba(148,163,184,0.15)', marginBottom: 20 }}>
        <TabButton active={activeTab === 'nueva'} onClick={() => setActiveTab('nueva')}>🛒 Nueva Venta</TabButton>
        <TabButton active={activeTab === 'historial'} onClick={() => setActiveTab('historial')}>📋 Historial</TabButton>
      </div>

      {activeTab === 'historial' && (
        <div style={{ flex: 1 }}>
          <h2 className="text-primary" style={{ margin: '0 0 18px', fontSize: '1.1rem', fontWeight: 700 }}>📋 Historial de Ventas</h2>
          <HistorialTab token={token} clientes={clientes} />
        </div>
      )}

      {activeTab === 'nueva' && (
        <div style={{ display: 'flex', gap: 18, flex: 1, minHeight: 0 }}>
          {/* ── Left Panel: Catalog 60% ── */}
          <div style={{ flex: '0 0 60%', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              <input
                type="text"
                placeholder="🔍 Buscar producto…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-surface-high border border-outline/20 text-primary"
                style={{ flex: 1, minWidth: 160, padding: '8px 12px', borderRadius: 8, fontSize: '0.87rem', outline: 'none' }}
              />
              <select
                value={selectedCategoria}
                onChange={(e) => setSelectedCategoria(e.target.value)}
                className="bg-surface-high border border-outline/20 text-primary"
                style={{ padding: '8px 12px', borderRadius: 8, fontSize: '0.87rem', outline: 'none' }}
              >
                {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                onClick={() => setIsRestockModalOpen(true)}
                style={{ padding: '8px 16px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.4)', color: '#4ade80', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.87rem' }}
              >
                📦 Reponer Stock
              </button>
            </div>

            <div
              style={{ flex: 1, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 12, alignContent: 'start' }}
            >
              {filteredProds.length === 0 && (
                <div className="text-secondary" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, opacity: 0.5 }}>
                  Sin productos encontrados
                </div>
              )}
              {filteredProds.map((p) => (
                <ProductCard key={p._id || p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          </div>

          {/* ── Right Panel: Cart 40% ── */}
          <div
            className="bg-surface border border-outline/20"
            style={{ flex: '0 0 calc(40% - 18px)', borderRadius: 14, padding: '18px 18px 16px', display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}
          >
            {/* ── CLIENTE SELECTOR ── */}
            <div style={{ background: 'rgba(6,182,212,0.06)', border: '1px solid rgba(6,182,212,0.2)', borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Cliente *
              </label>
              <select
                value={selectedClient ? (selectedClient._id || selectedClient.id) : ''}
                onChange={(e) => {
                  const found = clientes.find((c) => (c._id || c.id) === e.target.value);
                  setSelectedClient(found || null);
                  setSuccessMsg(null);
                  setSubmitError(null);
                }}
                className="bg-surface-high border border-outline/20 text-primary"
                style={{ padding: '8px 12px', borderRadius: 8, fontSize: '0.87rem', outline: 'none', width: '100%' }}
              >
                <option value="">Seleccionar cliente *</option>
                {clientes.map((c) => (
                  <option key={c._id || c.id} value={c._id || c.id}>{c.nombre}</option>
                ))}
              </select>
              {selectedClient && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(6,182,212,0.2)', border: '1px solid rgba(6,182,212,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>
                    👤
                  </div>
                  <div>
                    <div className="text-primary" style={{ fontWeight: 700, fontSize: '0.88rem' }}>{selectedClient.nombre}</div>
                    {selectedClient.tipo && (
                      <div style={{ fontSize: '0.7rem', color: '#22d3ee' }}>{selectedClient.tipo}</div>
                    )}
                  </div>
                </div>
              )}
              {!selectedClient && (
                <div style={{ fontSize: '0.73rem', color: '#f87171', display: 'flex', alignItems: 'center', gap: 5 }}>
                  ⚠️ Debes seleccionar un cliente para emitir documento
                </div>
              )}
            </div>

            {/* Cart items */}
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <span className="text-secondary" style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Carro ({cart.length})
                </span>
                {cart.length > 0 && (
                  <button
                    onClick={() => setCart([])}
                    style={{ background: 'none', border: 'none', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Vaciar
                  </button>
                )}
              </div>

              {cart.length === 0 && (
                <div className="text-secondary" style={{ textAlign: 'center', padding: '30px 0', opacity: 0.5, fontSize: '0.85rem' }}>
                  Haz clic en un producto para agregarlo
                </div>
              )}

              {cart.map((item) => (
                <CartItem key={item.productoId} item={item} onChangeQty={changeQty} onRemove={removeItem} />
              ))}
            </div>

            {/* Totals */}
            <div
              className="bg-surface-high border border-outline/20"
              style={{ borderRadius: 10, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 6 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem' }}>
                <span className="text-secondary">Subtotal neto</span>
                <span className="text-primary">{formatCLP(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.83rem' }}>
                <span className="text-secondary">IVA (19%)</span>
                <span className="text-primary">{formatCLP(iva)}</span>
              </div>
              <div style={{ height: 1, background: 'rgba(148,163,184,0.15)', margin: '4px 0' }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1rem', fontWeight: 800 }}>
                <span className="text-primary">TOTAL</span>
                <span style={{ color: '#4ade80' }}>{formatCLP(total)}</span>
              </div>
            </div>

            {/* Tipo documento */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="text-secondary" style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Tipo de documento</span>
              <div style={{ display: 'flex', gap: 8 }}>
                {['Boleta Electrónica', 'Factura Electrónica'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTipoDocumento(t)}
                    style={{
                      flex: 1, padding: '7px 0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: '0.75rem',
                      background: tipoDocumento === t ? 'rgba(6,182,212,0.18)' : 'rgba(148,163,184,0.06)',
                      border: tipoDocumento === t ? '1px solid rgba(6,182,212,0.45)' : '1px solid rgba(148,163,184,0.15)',
                      color: tipoDocumento === t ? '#22d3ee' : '#64748b',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Errors / Success */}
            {submitError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '9px 12px', color: '#fca5a5', fontSize: '0.8rem' }}>
                ⚠️ {submitError}
              </div>
            )}
            {successMsg && (
              <div style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 8, padding: '9px 12px', color: '#4ade80', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span>✅ {successMsg}</span>
                {ventaId && <span style={{ fontFamily: 'monospace', fontSize: '0.72rem', color: '#86efac' }}>ID: #{truncateId(ventaId)}</span>}
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerar}
              disabled={submitting || !selectedClient || cart.length === 0}
              style={{
                padding: '12px 0', borderRadius: 9, fontWeight: 800, fontSize: '0.95rem', cursor: (submitting || !selectedClient || cart.length === 0) ? 'not-allowed' : 'pointer',
                background: (!selectedClient || cart.length === 0) ? 'rgba(148,163,184,0.08)' : 'rgba(34,197,94,0.2)',
                border: (!selectedClient || cart.length === 0) ? '1px solid rgba(148,163,184,0.15)' : '1px solid rgba(34,197,94,0.4)',
                color: (!selectedClient || cart.length === 0) ? '#475569' : '#4ade80',
                transition: 'all 0.15s',
              }}
            >
              {submitting ? 'Generando…' : !selectedClient ? 'Selecciona un cliente' : '🧾 Generar Documento'}
            </button>
          </div>
        </div>
      )}

      <RestockModal
        isOpen={isRestockModalOpen}
        onClose={() => setIsRestockModalOpen(false)}
        productos={productos}
        token={token}
        onRestockSuccess={() => {
          getProductos(token).then((prods) => setProductos(Array.isArray(prods) ? prods : (prods?.data ?? [])));
        }}
      />

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
