import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
  })
};

const team = [
  {
    name: 'Carlos Vidal',
    role: 'Fundador & CEO',
    desc: 'Visión tecnológica aplicada a la industria de piscinas. Apasionado por la optimización de servicios.',
    initials: 'CV',
    color: 'from-sky-500 to-cyan-400',
  },
  {
    name: 'Ana Muñoz',
    role: 'Jefa de Operaciones',
    desc: 'Ingeniería civil con especialización en gestión de servicios. Lidera el equipo de 5 técnicos certificados en terreno.',
    initials: 'AM',
    color: 'from-teal-500 to-emerald-400',
  },
  {
    name: 'Diego Fernández',
    role: 'Líder Técnico Senior',
    desc: 'Técnico certificado con destacada experiencia. Especialista en sistemas de filtración y automatización de piscinas.',
    initials: 'DF',
    color: 'from-violet-500 to-purple-400',
  },
  {
    name: 'Sofía Torres',
    role: 'Diseñadora de Proyectos',
    desc: 'Arquitecta de interiores reconvertida al diseño de espacios acuáticos. Ha diseñado más de 20 piscinas residenciales.',
    initials: 'ST',
    color: 'from-rose-500 to-pink-400',
  },
  {
    name: 'Pablo Herrera',
    role: 'Desarrollador Backend',
    desc: 'Ingeniero en software. Creó el sistema ERP de microservicios que gestiona toda la operación de Verano Perfecto.',
    initials: 'PH',
    color: 'from-amber-500 to-yellow-400',
  },
  {
    name: 'Laura Castillo',
    role: 'Ejecutiva Comercial',
    desc: 'MBA especialista en empresas de servicios. Gestiona relaciones con todos nuestros clientes y empresas del rubro.',
    initials: 'LC',
    color: 'from-indigo-500 to-blue-400',
  },
];

const milestones = [
  { year: '2024', event: 'Fundación de Verano Perfecto con un enfoque 100% digital y transparente.' },
  { year: '2025', event: 'Crecimiento exponencial. Implementación de nuestro propio sistema ERP y tracking GPS.' },
  { year: '2026', event: 'Consolidación de operaciones y rápida expansión en la Región Metropolitana.' },
];

const values = [
  { icon: '🎯', title: 'Excelencia', desc: 'Cada piscina tratada como si fuera nuestra propia.' },
  { icon: '🔬', title: 'Tecnología', desc: 'ERP propio, GPS tracking y facturación digital.' },
  { icon: '🤝', title: 'Confianza', desc: 'Construyendo relaciones basadas en resultados y transparencia.' },
  { icon: '🌿', title: 'Sostenibilidad', desc: 'Productos eco-amigables y bajo consumo energético.' },
];

export default function Nosotros() {
  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative pt-48 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/equipo_tecnico.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/50 to-[#020617]" />
        <div className="container-custom relative z-10 flex flex-col items-center text-center w-full">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-4">
            <span className="badge badge-blue">Sobre Nosotros</span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl font-black font-outfit text-white mb-6"
          >
            Pasión por el{' '}
            <span className="gradient-text">agua</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed text-center"
          >
            Somos una empresa tecnológica chilena fundada en 2024 con la misión de hacer de cada verano
            una experiencia perfecta. Combinamos artesanía, tecnología y pasión por el servicio.
          </motion.p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-[#0f172a]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="img-overlay">
                <img
                  src="/equipo_tecnico.png"
                  alt="Equipo de Verano Perfecto"
                  className="w-full h-96 object-cover"
                />
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-6 -right-6 glass rounded-2xl p-4"
              >
                <div className="text-center">
                  <div className="text-3xl font-black gradient-text font-outfit">2+</div>
                  <div className="text-slate-400 text-xs">años liderando innovación</div>
                </div>
              </motion.div>
            </motion.div>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <span className="badge badge-blue mb-4 inline-block">Nuestra Misión</span>
              <h2 className="text-4xl font-bold font-outfit text-white mb-6">
                Líderes en la{' '}
                <span className="gradient-text">industria acuática</span>{' '}
                de Chile
              </h2>
              <p className="text-slate-400 leading-relaxed mb-6">
                Nació como una startup moderna en Santiago. Hoy, gracias a nuestro crecimiento exponencial,
                somos la empresa tecnológica líder en gestión integral de piscinas en la Región Metropolitana,
                con más de 150 clientes activos y 5 técnicos certificados en terreno.
              </p>
              <p className="text-slate-400 leading-relaxed mb-8">
                Desarrollamos nuestro propio sistema ERP con microservicios en Spring Boot,
                que gestiona desde la autenticación JWT hasta el tracking GPS de nuestros técnicos
                en tiempo real, pasando por facturación con IVA y gestión de inventario.
              </p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Clientes activos', value: '150+' },
                  { label: 'Técnicos certificados', value: '5' },
                  { label: 'Piscinas instaladas', value: '30+' },
                  { label: 'Servicios al año', value: '850+' },
                ].map((stat) => (
                  <div key={stat.label} className="glass rounded-xl p-4 text-center">
                    <div className="text-2xl font-black gradient-text font-outfit">{stat.value}</div>
                    <div className="text-slate-400 text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding water-bg">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-4">
              Nuestros <span className="gradient-text">Valores</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i}
                whileHover={{ scale: 1.05, y: -4 }}
              >
                <div className="service-card text-center">
                  <div className="text-5xl mb-4">{v.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{v.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding bg-[#0f172a]">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-4">
              Nuestro <span className="gradient-text">Equipo</span>
            </h2>
            <p className="text-slate-400 text-lg text-center">Las personas detrás de cada piscina perfecta</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.5}
                whileHover={{ y: -8 }}
              >
                <div className="service-card text-center">
                  <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${member.color} flex items-center justify-center text-2xl font-black text-white mx-auto mb-4 font-outfit`}>
                    {member.initials}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{member.name}</h3>
                  <p className="text-cyan-400 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-slate-400 text-sm leading-relaxed">{member.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding water-bg">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-4">
              Nuestra <span className="gradient-text">Historia</span>
            </h2>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-400/50 via-sky-500/30 to-transparent hidden md:block" />

            <div className="space-y-12">
              {milestones.map((m, i) => (
                <motion.div
                  key={m.year}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i * 0.3}
                  className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 1 ? 'md:flex-row-reverse' : ''}`}
                >
                  <div className={`flex-1 ${i % 2 === 1 ? 'md:text-left' : 'md:text-right'}`}>
                    <div className="service-card inline-block text-left max-w-md">
                      <p className="text-slate-300 leading-relaxed">{m.event}</p>
                    </div>
                  </div>

                  <div className="flex-shrink-0 relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center">
                      <span className="text-sm font-black text-white">{m.year}</span>
                    </div>
                  </div>

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#0f172a] text-center">
        <div className="container-custom">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold font-outfit text-white mb-6">
              ¿Quieres ser parte de{' '}
              <span className="gradient-text">nuestra historia</span>?
            </h2>
            <Link to="/contacto" id="nosotros-cta" className="btn-primary text-lg px-10 py-4">
              Contáctanos hoy
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
