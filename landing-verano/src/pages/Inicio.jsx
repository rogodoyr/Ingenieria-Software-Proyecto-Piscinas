import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.12, ease: 'easeOut' }
  })
};

const stats = [
  { number: '30+', label: 'Piscinas Instaladas', icon: '🏊' },
  { number: '150+', label: 'Clientes Felices', icon: '⭐' },
  { number: '2', label: 'Años de Innovación', icon: '🚀' },
  { number: '24/7', label: 'Soporte Disponible', icon: '🔧' },
];

const services = [
  {
    icon: '🔧',
    title: 'Mantención Preventiva',
    desc: 'Planes mensuales personalizados. Técnicos certificados con seguimiento GPS en tiempo real.',
    color: 'from-sky-500 to-cyan-400',
    href: '/servicios',
  },
  {
    icon: '🏊',
    title: 'Venta de Piscinas',
    desc: 'Diseño y construcción a medida. Desde piscinas residenciales hasta proyectos comerciales.',
    color: 'from-teal-500 to-emerald-400',
    href: '/productos',
  },
  {
    icon: '🧪',
    title: 'Control de Calidad',
    desc: 'Análisis y balance químico del agua. Productos profesionales con IVA incluido.',
    color: 'from-amber-500 to-yellow-400',
    href: '/servicios',
  },
];

const testimonials = [
  {
    name: 'Rodrigo Martínez',
    role: 'Propietario · Las Condes',
    text: 'Excelente servicio. El sistema de seguimiento me permite ver en tiempo real cuándo llega el técnico. ¡La piscina siempre perfecta!',
    stars: 5,
    avatar: 'RM',
  },
  {
    name: 'Carla Jiménez',
    role: 'Gerenta · Club Deportivo',
    text: 'Gestionamos 3 piscinas con ellos. La facturación automática con IVA y el portal web nos ahorran horas cada mes.',
    stars: 5,
    avatar: 'CJ',
  },
  {
    name: 'Felipe Urrutia',
    role: 'Arquitecto · Vitacura',
    text: 'Compramos la piscina y contratamos la mantención. Un solo proveedor para todo. Profesionales de verdad.',
    stars: 5,
    avatar: 'FU',
  },
];

export default function Inicio() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  return (
    <main>
      {/* =================== HERO =================== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax BG */}
        <motion.div style={{ y: imgY }} className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 40, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: 'url(/hero_pool.png)', filter: 'brightness(0.4)' }}
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-transparent to-[#020617]" />
        </motion.div>

        {/* Animated particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="particle absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Hero content */}
        <motion.div style={{ y: textY }} className="relative z-10 container-custom text-center px-4">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-6">
            <span className="badge badge-blue">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
              Instalación · Mantención · Equipamiento
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-6 font-outfit"
          >
            Tu{' '}
            <span className="gradient-text">Verano</span>
            <br />
            <span className="text-white">Perfecto</span>
            <br />
            <span className="text-3xl md:text-4xl font-light text-slate-300">comienza aquí</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Expertos en <strong className="text-cyan-400">venta, instalación y mantención</strong> de piscinas en Chile.
            Más de 50 proyectos completados con tecnología y profesionalismo de primer nivel.
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/contacto" id="hero-cta-cotizar" className="btn-primary text-lg px-8 py-4">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Solicitar cotización
            </Link>
            <Link to="/servicios" id="hero-cta-servicios" className="btn-secondary text-lg px-8 py-4">
              Ver servicios
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-cyan-400 rounded-full animate-bounce" />
          </div>
        </motion.div>
      </section>

      {/* =================== STATS =================== */}
      <section className="py-16 bg-[#0f172a] border-y border-white/5">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="text-4xl mb-2">{stat.icon}</div>
                <div className="stat-number">{stat.number}</div>
                <div className="text-slate-400 text-sm mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== SERVICES =================== */}
      <section className="section-padding water-bg">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-16 w-full"
          >
            <span className="badge badge-blue mb-4 inline-block">Nuestros Servicios</span>
            <h2 className="text-4xl md:text-5xl font-bold font-outfit mb-4">
              Todo lo que necesita tu{' '}
              <span className="gradient-text">piscina</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto text-center">
              Desde la instalación hasta el mantenimiento diario, cubrimos cada aspecto con tecnología y experiencia.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, i) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ scale: 1.02 }}
              >
                <div className="service-card h-full">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-2xl mb-6`}>
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-slate-400 leading-relaxed mb-6">{service.desc}</p>
                  <Link to={service.href} className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-2 group">
                    Saber más
                    <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== SPLIT PROMO =================== */}
      <section className="section-padding bg-[#0f172a]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="badge badge-blue mb-4 inline-block">Mantención Profesional</span>
              <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-6">
                Tu piscina siempre{' '}
                <span className="gradient-text">impecable</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                Nuestros técnicos certificados visitan tu propiedad según tu plan contratado.
                Cada visita queda registrada en el sistema con reporte fotográfico y análisis químico.
              </p>
              <ul className="space-y-4 mb-8">
                {[
                  'Seguimiento GPS de técnicos en tiempo real',
                  'Historial completo de mantenciones',
                  'Alertas automáticas de inventario',
                  'Facturación con IVA 19% automático',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0">
                      <svg className="w-3 h-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/servicios" id="promo-mantencion-cta" className="btn-primary">
                Ver planes de mantención
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="img-overlay">
                <img
                  src="/mantencion_pool.png"
                  alt="Técnico realizando mantención de piscina"
                  className="w-full h-96 object-cover"
                />
              </div>
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 glass rounded-2xl p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-xl">🔧</div>
                  <div>
                    <div className="text-white font-semibold text-sm">Técnico en camino</div>
                    <div className="text-cyan-400 text-xs">ETA: 12 min · GPS activo</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =================== GALLERY =================== */}
      <section className="py-24 bg-[#0f172a]">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-16 w-full"
          >
            <span className="badge badge-blue mb-4 inline-block">Portafolio</span>
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-4">
              Proyectos <span className="gradient-text">Destacados</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto text-center">
              Una pequeña muestra de los resultados que entregamos a nuestros clientes.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { id: 1, title: 'Borde Infinito', subtitle: 'Piscina de hormigón armado con borde infinito.', img: '/proyecto_infinity.png' },
              { id: 2, title: 'Automatización y Filtración', subtitle: 'Instalación de cuartos de bombas de alta tecnología.', img: '/proyecto_tech.png' },
              { id: 3, title: 'Diseño Residencial Moderno', subtitle: 'Proyectos llave en mano para patios y jardines.', img: '/proyecto_residencial.png' },
              { id: 4, title: 'Iluminación Inteligente LED', subtitle: 'Control por WiFi y luces submarinas RGB.', img: '/proyecto_nocturna.png' }
            ].map((proj, i) => (
              <motion.div
                key={proj.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.2}
                className="group relative overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer"
              >
                <img
                  src={proj.img}
                  alt={proj.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#020617]/95 via-[#020617]/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                  <div className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-2xl font-bold font-outfit text-white mb-2">{proj.title}</h3>
                    <p className="text-cyan-400 text-sm font-medium">{proj.subtitle}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== TESTIMONIALS =================== */}
      <section className="section-padding water-bg">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col items-center text-center mb-16 w-full"
          >
            <span className="badge badge-gold mb-4 inline-block">Testimonios</span>
            <h2 className="text-4xl md:text-5xl font-bold font-outfit">
              Lo que dicen{' '}
              <span className="gradient-text-gold">nuestros clientes</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
              >
                <div className="testimonial-card h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.stars)].map((_, j) => (
                      <span key={j} className="text-amber-400 text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-slate-300 leading-relaxed flex-1 italic">"{t.text}"</p>
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center text-sm font-bold text-white">
                      {t.avatar}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{t.name}</div>
                      <div className="text-slate-400 text-xs">{t.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* =================== CTA FINAL =================== */}
      <section className="py-24 relative overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-sky-900/30 via-transparent to-teal-900/30" />
        </div>
        <div className="container-custom relative z-10 flex flex-col items-center text-center w-full">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-6xl font-black font-outfit text-white mb-6">
              ¿Listo para tu{' '}
              <span className="gradient-text">verano perfecto?</span>
            </h2>
            <p className="text-slate-400 text-xl mb-10 max-w-2xl mx-auto text-center">
              Contáctanos hoy y recibe una cotización sin compromiso en menos de 24 horas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contacto" id="final-cta-contacto" className="btn-gold text-lg px-10 py-4">
                🏊 Quiero mi piscina ahora
              </Link>
              <a href="tel:+56912345678" id="final-cta-phone" className="btn-secondary text-lg px-10 py-4">
                📞 Llamar ahora
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
