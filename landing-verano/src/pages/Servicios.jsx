import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
  })
};

const plans = [
  {
    id: 'basico',
    name: 'Plan Básico',
    price: '49.990',
    period: '/mes',
    desc: 'Ideal para piscinas pequeñas y uso ocasional',
    features: [
      '1 visita mensual de mantención',
      'Análisis químico del agua',
      'Limpieza de filtros',
      'Informe fotográfico',
      'Soporte vía WhatsApp',
    ],
    notIncluded: ['Productos químicos incluidos', 'Prioridad de atención', 'Visitas adicionales'],
    badge: null,
    cta: 'Contratar Plan',
    featured: false,
  },
  {
    id: 'profesional',
    name: 'Plan Profesional',
    price: '89.990',
    period: '/mes',
    desc: 'El más elegido para hogares familiares',
    features: [
      '2 visitas mensuales de mantención',
      'Análisis y balance químico completo',
      'Limpieza de fondo y paredes',
      'Productos químicos incluidos',
      'Informe detallado con fotos',
      'Atención prioritaria',
      'Soporte 24/7 vía app',
    ],
    notIncluded: ['Visitas de emergencia ilimitadas'],
    badge: 'Más Popular',
    cta: 'Contratar Plan',
    featured: true,
  },
  {
    id: 'premium',
    name: 'Plan Premium',
    price: '149.990',
    period: '/mes',
    desc: 'Para piscinas comerciales y exigentes',
    features: [
      '4 visitas mensuales de mantención',
      'Control químico premium semanal',
      'Limpieza completa fondo, paredes, borde',
      'Todos los productos incluidos',
      'Técnico asignado exclusivo',
      'Seguimiento GPS en tiempo real',
      'Visitas de emergencia ilimitadas',
      'Soporte 24/7 prioritario',
    ],
    notIncluded: [],
    badge: 'Premium',
    cta: 'Contratar Plan',
    featured: false,
  },
];

const serviceList = [
  {
    icon: '🧹',
    title: 'Limpieza General',
    desc: 'Limpieza completa de fondo, paredes, escaleras y línea de flotación. Uso de equipos profesionales de vacío y cepillo.',
    duration: '2-3 horas',
    api: 'mantencion-service · POST /api/mantenciones',
  },
  {
    icon: '🧪',
    title: 'Balance Químico',
    desc: 'Análisis y ajuste de pH, cloro, alcalinidad y dureza cálcica. Agua perfecta, segura y transparente.',
    duration: '1 hora',
    api: 'mantencion-service · PATCH /api/mantenciones/{id}/estado',
  },
  {
    icon: '⚙️',
    title: 'Mantención de Equipos',
    desc: 'Revisión y limpieza de bombas, filtros de arena, skimmers y sistema de automatización.',
    duration: '2-4 horas',
    api: 'mantencion-service · PUT /api/mantenciones/{id}',
  },
  {
    icon: '💡',
    title: 'Iluminación LED',
    desc: 'Instalación y mantención de iluminación LED sumergible. Transforma tu piscina de noche.',
    duration: '3-6 horas',
    api: 'venta-service · POST /api/ventas',
  },
  {
    icon: '🔧',
    title: 'Reparación de Fisuras',
    desc: 'Detección y reparación de fisuras en estructura, sellado de uniones y tratamiento de superficie.',
    duration: '1-2 días',
    api: 'mantencion-service · POST /api/mantenciones',
  },
  {
    icon: '🌊',
    title: 'Sistema de Recirculación',
    desc: 'Instalación y reparación de sistemas de recirculación y filtración de alta eficiencia.',
    duration: '4-8 horas',
    api: 'venta-service · GET /api/productos',
  },
];

export default function Servicios() {
  const [activePlan, setActivePlan] = useState('profesional');

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative pt-48 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/mantencion_pool.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/60 to-[#020617]" />

        <div className="container-custom relative z-10 flex flex-col items-center text-center w-full">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-4">
            <span className="badge badge-blue">Nuestros Servicios</span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl font-black font-outfit text-white mb-6"
          >
            Mantención{' '}
            <span className="gradient-text">Profesional</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed text-center"
          >
            Más de 1.200 órdenes de trabajo completadas. Técnicos certificados con seguimiento GPS.
            Cada servicio documentado y registrado en nuestro sistema ERP.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-[#0f172a]">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-white mb-4">
              Catálogo de <span className="gradient-text">Servicios</span>
            </h2>
            <p className="text-slate-400 text-center">Cada servicio es registrado con estado Pendiente → En Curso → Completado</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {serviceList.map((service, i) => (
              <motion.div
                key={service.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                whileHover={{ y: -6 }}
              >
                <div className="service-card h-full">
                  <div className="flex items-start justify-between mb-4">
                    <span className="text-3xl">{service.icon}</span>
                    <span className="badge badge-blue text-xs">{service.duration}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{service.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{service.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding water-bg">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="badge badge-gold mb-4 inline-block">Planes & Precios</span>
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-4">
              Elige tu plan de{' '}
              <span className="gradient-text">mantención</span>
            </h2>
            <p className="text-slate-400 text-lg text-center">Precios en CLP, IVA incluido. Factura automática cada mes.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActivePlan(plan.id)}
              >
                <div className={`price-card h-full cursor-pointer ${plan.featured ? 'featured' : ''} ${activePlan === plan.id ? 'ring-2 ring-sky-500' : ''}`}>
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className={`badge ${plan.featured ? 'badge-blue' : 'badge-gold'}`}>
                        ✨ {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                    <p className="text-slate-400 text-sm">{plan.desc}</p>
                  </div>

                  <div className="flex items-end gap-1 mb-8">
                    <span className="text-slate-400 text-sm self-start mt-2">$</span>
                    <span className="text-4xl font-black text-white font-outfit">{plan.price}</span>
                    <span className="text-slate-400 text-sm mb-1">{plan.period}</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                        <svg className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                    {plan.notIncluded.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-slate-600">
                        <svg className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    to="/contacto"
                    id={`plan-cta-${plan.id}`}
                    className={`w-full text-center ${plan.featured ? 'btn-primary' : 'btn-secondary'} justify-center`}
                    style={{ display: 'flex' }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="section-padding bg-[#0f172a]">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold font-outfit text-white mb-4">
              ¿Cómo <span className="gradient-text">funciona</span>?
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Solicitas', desc: 'Contáctanos o usa el formulario online. Respondemos en menos de 2 horas.' },
              { step: '02', title: 'Agendamos', desc: 'Coordinamos la visita según tu disponibilidad. Recibes confirmación por email.' },
              { step: '03', title: 'Realizamos', desc: 'Técnico certificado llega al horario acordado. Seguimiento GPS disponible.' },
              { step: '04', title: 'Reportamos', desc: 'Recibes informe detallado con fotos y recomendaciones en tu correo.' },
            ].map((step, i) => (
              <motion.div
                key={step.step}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                className="text-center"
              >
                <div className="relative inline-block mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center mx-auto">
                    <span className="text-2xl font-black text-white font-outfit">{step.step}</span>
                  </div>
                  {i < 3 && (
                    <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-cyan-400/50 to-transparent" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
