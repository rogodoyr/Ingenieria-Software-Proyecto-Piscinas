import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
  })
};

const categories = ['Todos', 'Piscinas', 'Equipos', 'Químicos', 'Accesorios', 'LED'];

const products = [
  {
    id: 1,
    name: 'Piscina Infinity Edge Premium',
    category: 'Piscinas',
    price: '18.500.000',
    oldPrice: '21.000.000',
    desc: 'Piscina de desborde con acabado en microcemento. Diseño arquitectónico personalizado. Incluye sistema de recirculación.',
    badge: 'Más Vendida',
    badgeType: 'badge-blue',
    specs: ['8×4m estándar', 'Profundidad 1.5m', 'Garantía 10 años'],
    icon: '🏊',
  },
  {
    id: 2,
    name: 'Piscina Familiar Clásica',
    category: 'Piscinas',
    price: '8.900.000',
    oldPrice: null,
    desc: 'Piscina rectangular de fibra de vidrio de alta resistencia. Instalación en 5-7 días hábiles.',
    badge: null,
    badgeType: null,
    specs: ['6×3m estándar', 'Profundidad 1.3m', 'Garantía 15 años'],
    icon: '🌊',
  },
  {
    id: 3,
    name: 'Bomba de Filtración Inverter',
    category: 'Equipos',
    price: '245.000',
    oldPrice: '320.000',
    desc: 'Bomba de velocidad variable con tecnología inverter. Ahorra hasta 80% de energía vs bombas tradicionales.',
    badge: 'Eco-friendly',
    badgeType: 'badge-green',
    specs: ['0.75HP / 1.5HP', 'Bajo ruido 48dB', 'Control digital'],
    icon: '⚙️',
  },
  {
    id: 4,
    name: 'Kit de Iluminación LED RGB',
    category: 'LED',
    price: '89.990',
    oldPrice: null,
    desc: '6 focos LED sumergibles con control por app. 16 millones de colores, modos automáticos y sincronización musical.',
    badge: 'Nuevo',
    badgeType: 'badge-gold',
    specs: ['12W cada uno', 'IP68 sumergible', 'App iOS & Android'],
    icon: '💡',
  },
  {
    id: 5,
    name: 'Cloro Granulado Premium 10kg',
    category: 'Químicos',
    price: '45.990',
    oldPrice: '55.000',
    desc: 'Cloro dicloro de alta pureza (90%). Disolución rápida, no enturbia el agua. Para piscinas de hasta 100.000L.',
    badge: null,
    badgeType: null,
    specs: ['90% dicloro', 'Disolución rápida', 'pH neutro'],
    icon: '🧪',
  },
  {
    id: 6,
    name: 'Robot Limpiador Automático',
    category: 'Accesorios',
    price: '399.000',
    oldPrice: '480.000',
    desc: 'Robot limpiador de fondo con navegación inteligente. Limpia fondo, paredes y línea de flotación en 2 horas.',
    badge: 'Premium',
    badgeType: 'badge-gold',
    specs: ['2h ciclo completo', 'Cepillo doble', 'Cable 18m'],
    icon: '🤖',
  },
  {
    id: 7,
    name: 'Filtro de Arena High-Rate',
    category: 'Equipos',
    price: '125.000',
    oldPrice: null,
    desc: 'Filtro multicapa de arena de cuarzo. Caudal hasta 14 m³/h. Válvula selectora de 6 vías incluida.',
    badge: null,
    badgeType: null,
    specs: ['14 m³/h caudal', 'Ø600mm casco', 'Válvula 6 vías'],
    icon: '🔄',
  },
  {
    id: 8,
    name: 'Kit Análisis Profesional',
    category: 'Químicos',
    price: '24.990',
    oldPrice: null,
    desc: 'Maleta completa de análisis para pH, cloro, alcalinidad, cianúrico y dureza cálcica. 300 tests incluidos.',
    badge: null,
    badgeType: null,
    specs: ['300 tests', '6 parámetros', 'Estuche rígido'],
    icon: '🧫',
  },
  {
    id: 9,
    name: 'Cobertor Solar Automático',
    category: 'Accesorios',
    price: '289.000',
    oldPrice: '340.000',
    desc: 'Cobertor con enrollador motorizado. Aísla hasta 70% de pérdida calórica. Motor silencioso 230V.',
    badge: 'Ahorra energía',
    badgeType: 'badge-green',
    specs: ['Motor silencioso', 'Hasta 8×4m', 'Control remoto'],
    icon: '🌡️',
  },
];

export default function Productos() {
  const [activeCategory, setActiveCategory] = useState('Todos');
  const [search, setSearch] = useState('');

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === 'Todos' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative pt-48 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-25"
          style={{ backgroundImage: 'url(/venta_pool.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/50 to-[#020617]" />
        <div className="container-custom relative z-10 flex flex-col items-center text-center w-full">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-4">
            <span className="badge badge-gold">Catálogo de Productos</span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl font-black font-outfit text-white mb-6"
          >
            Venta de{' '}
            <span className="gradient-text">Piscinas</span>
            <br />
            <span className="text-3xl font-light text-slate-300">&amp; Equipamiento</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-xl text-slate-300 max-w-2xl mx-auto text-center"
          >
            Catálogo completo con IVA 19% calculado automáticamente.
            Financiamiento disponible en hasta 36 cuotas.
          </motion.p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-[#0f172a] border-y border-white/5 sticky top-20 z-30">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full md:w-80">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <input
                id="productos-search"
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>

            {/* Category pills */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((cat) => (
                <button
                  key={cat}
                  id={`filter-${cat.toLowerCase()}`}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/30'
                      : 'glass text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-padding water-bg">
        <div className="container-custom">
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-slate-400 text-sm mb-8"
          >
            Mostrando <strong className="text-white">{filtered.length}</strong> productos
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((product, i) => (
              <motion.div
                key={product.id}
                layout
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                custom={i * 0.1}
                whileHover={{ y: -8 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <div className="service-card h-full relative overflow-hidden">
                  {product.badge && (
                    <div className="absolute top-4 right-4">
                      <span className={`badge ${product.badgeType}`}>{product.badge}</span>
                    </div>
                  )}

                  {/* Product icon / visual */}
                  <div className="w-full h-40 rounded-xl bg-gradient-to-br from-sky-900/40 to-teal-900/40 border border-sky-500/10 flex items-center justify-center mb-6 relative overflow-hidden">
                    <span className="text-6xl">{product.icon}</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e293b]/80 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-xs text-slate-400">{product.category}</div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{product.name}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{product.desc}</p>

                  {/* Specs */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {product.specs.map((spec) => (
                      <span key={spec} className="text-xs px-2 py-1 rounded-md bg-white/5 text-slate-400 border border-white/5">
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      {product.oldPrice && (
                        <span className="text-slate-500 line-through text-sm block">${product.oldPrice}</span>
                      )}
                      <span className="text-2xl font-black gradient-text font-outfit">${product.price}</span>
                      <span className="text-slate-500 text-xs ml-1">+ IVA 19%</span>
                    </div>
                    <Link
                      to="/contacto"
                      id={`producto-cta-${product.id}`}
                      className="btn-primary text-sm py-2 px-4"
                    >
                      Cotizar
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="text-5xl mb-4">🔍</div>
              <p className="text-slate-400 text-lg">No se encontraron productos para "{search}"</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Finance banner */}
      <section className="py-16 bg-[#0f172a]">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="gradient-border p-8 md:p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-white mb-4">
              Financiamiento disponible
            </h2>
            <p className="text-slate-400 text-lg mb-8 max-w-2xl mx-auto">
              Hasta 36 cuotas sin interés. Factura electrónica con desglose de IVA 19% automático.
              Aceptamos todas las tarjetas y transferencia bancaria.
            </p>
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {['Visa', 'Mastercard', 'Débito', 'Transferencia'].map((method) => (
                <span key={method} className="glass px-4 py-2 rounded-lg text-slate-300 text-sm font-medium">
                  {method}
                </span>
              ))}
            </div>
            <Link to="/contacto" id="finance-cta" className="btn-gold">
              💰 Solicitar financiamiento
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
