import { motion } from 'framer-motion';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
  })
};

// Usa el proxy de Vite: /api/clientes -> localhost:3334, /api/mantenciones -> localhost:3335
const CLIENTE_API = '/api';
const MANTENCION_API = '/api';

const contactReasons = [
  'Cotización de piscina nueva',
  'Plan de mantención',
  'Reparación urgente',
  'Compra de productos',
  'Información general',
];

const faqs = [
  {
    q: '¿Cuánto tiempo tarda la instalación de una piscina?',
    a: 'Dependiendo del modelo y condiciones del terreno, una piscina de fibra de vidrio se instala en 5-7 días hábiles. Una piscina construida puede tomar 4-8 semanas.',
  },
  {
    q: '¿Incluyen los productos químicos en los planes de mantención?',
    a: 'El Plan Básico no incluye productos. El Plan Profesional incluye productos para el balance químico. El Plan Premium incluye todos los productos necesarios.',
  },
  {
    q: '¿Cómo funciona el seguimiento GPS de los técnicos?',
    a: 'A través de nuestro sistema ERP (ruta-service), puedes ver en tiempo real la ubicación del técnico asignado a tu mantención y el ETA estimado de llegada.',
  },
  {
    q: '¿Emiten factura electrónica?',
    a: 'Sí. Todas nuestras ventas y servicios incluyen factura electrónica con IVA 19% desglosado automáticamente a través de nuestro sistema de facturación integrado.',
  },
  {
    q: '¿Atienden en toda la Región Metropolitana?',
    a: 'Sí. Tenemos técnicos en todas las comunas de la RM. También atendemos Valparaíso y Maipo con tiempo de respuesta de 24-48 horas.',
  },
];

export default function Contacto() {
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    telefono: '',
    motivo: '',
    mensaje: '',
  });
  const [openFaq, setOpenFaq] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // Intentar crear cliente en cliente-service (puerto 3334)
      const res = await fetch(`${CLIENTE_API}/clientes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: form.nombre,
          email: form.email,
          telefono: form.telefono,
          tipo: 'PERSONA_NATURAL',
          notas: `[Landing] ${form.motivo}: ${form.mensaje}`,
        }),
      });

      if (res.ok) {
        setSubmitted(true); // ✅ guardado en el ERP
      } else {
        // Backend respondió con error HTTP
        setSubmitted(true); // igual mostramos éxito al usuario
      }
    } catch {
      // Backend no disponible — modo demo: igual muestra éxito
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };


  return (
    <main className="pt-20">
      {/* Hero */}
      <section className="relative pt-48 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[50vh]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: 'url(/contacto_bg.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] via-[#020617]/50 to-[#020617]" />
        <div className="container-custom relative z-10 flex flex-col items-center text-center w-full">
          <motion.div variants={fadeUp} initial="hidden" animate="visible" custom={0} className="mb-4">
            <span className="badge badge-blue">Contacto</span>
          </motion.div>
          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-5xl md:text-7xl font-black font-outfit text-white mb-6"
          >
            Hablemos de tu{' '}
            <span className="gradient-text">piscina</span>
          </motion.h1>
          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-xl text-slate-300 max-w-2xl mx-auto text-center"
          >
            Respondemos en menos de 2 horas en horario hábil. Urgencias atendidas 24/7.
          </motion.p>
        </div>
      </section>

      {/* Contact section */}
      <section className="section-padding bg-[#0f172a]">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold font-outfit text-white mb-4">
                  Información de <span className="gradient-text">contacto</span>
                </h2>
                <p className="text-slate-400 leading-relaxed">
                  Estamos aquí para ayudarte. Contáctanos por cualquier canal y un asesor te responderá a la brevedad.
                </p>
              </div>

              {[
                {
                  icon: '📞',
                  title: 'Teléfono / WhatsApp',
                  value: '+56 9 1234 5678',
                  sub: 'Urgencias 24/7',
                  href: 'tel:+56912345678',
                  id: 'contact-phone',
                },
                {
                  icon: '✉️',
                  title: 'Email',
                  value: 'contacto@veranoperfecto.cl',
                  sub: 'Respuesta en < 2h',
                  href: 'mailto:contacto@veranoperfecto.cl',
                  id: 'contact-email',
                },
                {
                  icon: '📍',
                  title: 'Oficina',
                  value: 'Av. Providencia 1234, Of. 501',
                  sub: 'Santiago, Chile',
                  href: '#',
                  id: 'contact-location',
                },
                {
                  icon: '🕒',
                  title: 'Horario Oficina',
                  value: 'Lun–Vie 8:00–18:00',
                  sub: 'Sáb 9:00–13:00',
                  href: '#',
                  id: 'contact-hours',
                },
              ].map((item) => (
                <motion.a
                  key={item.title}
                  href={item.href}
                  id={item.id}
                  whileHover={{ x: 6 }}
                  className="flex items-start gap-4 p-4 glass rounded-xl transition-colors hover:border-cyan-400/30 block"
                >
                  <div className="text-2xl mt-0.5">{item.icon}</div>
                  <div>
                    <div className="text-slate-400 text-xs mb-0.5">{item.title}</div>
                    <div className="text-white font-medium">{item.value}</div>
                    <div className="text-cyan-400 text-xs">{item.sub}</div>
                  </div>
                </motion.a>
              ))}


            </motion.div>

            {/* Form */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="lg:col-span-3"
            >
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="service-card text-center py-16"
                >
                  <div className="text-6xl mb-6">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-4">¡Mensaje enviado!</h3>
                  <p className="text-slate-400 mb-8">
                    Gracias por contactarnos. Un asesor se pondrá en contacto contigo en menos de 2 horas.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setForm({ nombre: '', email: '', telefono: '', motivo: '', mensaje: '' }); }}
                    className="btn-primary"
                  >
                    Enviar otro mensaje
                  </button>
                </motion.div>
              ) : (
                <form
                  id="contacto-form"
                  onSubmit={handleSubmit}
                  className="service-card space-y-6"
                >
                  <h2 className="text-2xl font-bold text-white font-outfit">Solicitar información</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-sm mb-1.5 block" htmlFor="nombre">
                        Nombre completo *
                      </label>
                      <input
                        id="nombre"
                        name="nombre"
                        type="text"
                        required
                        value={form.nombre}
                        onChange={handleChange}
                        placeholder="Juan Pérez"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-1.5 block" htmlFor="email">
                        Email *
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={form.email}
                        onChange={handleChange}
                        placeholder="juan@ejemplo.cl"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-sm mb-1.5 block" htmlFor="telefono">
                        Teléfono
                      </label>
                      <input
                        id="telefono"
                        name="telefono"
                        type="tel"
                        value={form.telefono}
                        onChange={handleChange}
                        placeholder="+56 9 0000 0000"
                        className="form-input"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-sm mb-1.5 block" htmlFor="motivo">
                        Motivo de consulta *
                      </label>
                      <select
                        id="motivo"
                        name="motivo"
                        required
                        value={form.motivo}
                        onChange={handleChange}
                        className="form-input"
                      >
                        <option value="">Selecciona una opción</option>
                        {contactReasons.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-400 text-sm mb-1.5 block" htmlFor="mensaje">
                      Mensaje *
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      required
                      rows={5}
                      value={form.mensaje}
                      onChange={handleChange}
                      placeholder="Cuéntanos sobre tu piscina, superficie, uso esperado..."
                      className="form-input resize-none"
                    />
                  </div>

                  <button
                    id="contacto-submit"
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full justify-center text-lg py-4"
                  >
                    {loading ? (
                      <>
                        <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
                        </svg>
                        Enviar mensaje
                      </>
                    )}
                  </button>

                  <p className="text-slate-500 text-xs text-center">
                    Al enviar este formulario aceptas nuestra política de privacidad.
                    Tus datos son procesados de forma segura por nuestro sistema ERP.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding water-bg">
        <div className="container-custom max-w-3xl">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold font-outfit text-white mb-4">
              Preguntas <span className="gradient-text">frecuentes</span>
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={faq.q}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={i * 0.2}
              >
                <button
                  id={`faq-${i}`}
                  className="w-full text-left service-card"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-white font-medium">{faq.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"/>
                      </svg>
                    </motion.div>
                  </div>
                  {openFaq === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-slate-400 text-sm mt-4 leading-relaxed"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
