// ============================================================
// SCRIPT DE DATOS DEMO - Verano Perfecto ERP
// Carga datos de muestra en todos los microservicios
// Ejecutar: node seed-demo.js
// ============================================================

const AUTH    = 'http://localhost:3333/api/auth';
const CLIENTES= 'http://localhost:3334/api/clientes';
const MANT    = 'http://localhost:3335/api/mantenciones';
const PROD    = 'http://localhost:3336/api/productos';
const VENTAS  = 'http://localhost:3336/api/ventas';
const TECN    = 'http://localhost:3337/api/tecnicos';
const DASH    = 'http://localhost:3338/api/dashboard/inventario';

// ─── colores para consola ───────────────────────────────────
const OK  = (s) => `\x1b[32m✓ ${s}\x1b[0m`;
const ERR = (s) => `\x1b[31m✗ ${s}\x1b[0m`;
const INF = (s) => `\x1b[36m→ ${s}\x1b[0m`;

async function post(url, data, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(data) });
  const json = await res.json().catch(() => ({}));
  return json;
}

async function seed() {
  console.log('\n\x1b[1m\x1b[35m══════════════════════════════════════════\x1b[0m');
  console.log('\x1b[1m\x1b[35m   VERANO PERFECTO — Cargando datos demo   \x1b[0m');
  console.log('\x1b[1m\x1b[35m══════════════════════════════════════════\x1b[0m\n');

  // ── 1. Registrar usuario admin ──────────────────────────
  console.log(INF('1/6  Creando usuario admin...'));
  const regRes = await post(`${AUTH}/register`, {
    username: 'admin',
    password: 'admin123',
    nombre:   'Administrador Demo',
    email:    'admin@veranoperfecto.cl'
  });

  let token = regRes.data?.token;
  if (!token) {
    // Ya existe, hacemos login
    const loginRes = await post(`${AUTH}/login`, { username: 'admin', password: 'admin123' });
    token = loginRes.data?.token;
    if (!token) { console.log(ERR('No se pudo obtener token. ¿Están los servicios corriendo?')); process.exit(1); }
    console.log(OK('Login con admin existente'));
  } else {
    console.log(OK('Usuario admin creado'));
  }
  console.log(`   Token: ${token.substring(0,30)}...\n`);

  // ── 2. Clientes ─────────────────────────────────────────
  console.log(INF('2/6  Creando clientes...'));
  const clientesData = [
    { nombre: 'María González Rojas',  email: 'maria.gonzalez@gmail.com',   telefono: '+56 9 8123 4567', tipo: 'PERSONA_NATURAL',  rut: '12.345.678-9', notas: 'Piscina temperada 8x4m. Cliente VIP.' },
    { nombre: 'Constructora Silva SpA', email: 'operaciones@csilva.cl',      telefono: '+56 2 2345 6789', tipo: 'PERSONA_JURIDICA', rut: '76.123.456-7', notas: 'Mantención mensual 3 piscinas. Contrato anual.' },
    { nombre: 'Carlos Mendoza Vega',   email: 'c.mendoza@hotmail.com',       telefono: '+56 9 7654 3210', tipo: 'PERSONA_NATURAL',  rut: '15.987.654-3', notas: 'Piscina nueva instalada oct 2024.' },
    { nombre: 'Residencial Los Pinos', email: 'admin@lospinos.cl',           telefono: '+56 2 2987 6543', tipo: 'PERSONA_JURIDICA', rut: '78.456.789-2', notas: 'Comunidad 24 departamentos. 2 piscinas.' },
    { nombre: 'Valentina Torres Soto', email: 'valen.torres@gmail.com',      telefono: '+56 9 6543 2109', tipo: 'PERSONA_NATURAL',  rut: '18.234.567-1', notas: 'Plan Premium. Piscina 6x3m fibra vidrio.' },
    { nombre: 'Hotel Pacífico Sur',    email: 'mantencion@hotelpacifico.cl', telefono: '+56 65 234 5678', tipo: 'PERSONA_JURIDICA', rut: '80.345.678-K', notas: 'Hotel 4 estrellas. Piscina olímpica + infantil.' },
    { nombre: 'Roberto Díaz Fuentes',  email: 'roberto.diaz@yahoo.com',      telefono: '+56 9 5432 1098', tipo: 'PERSONA_NATURAL',  rut: '10.876.543-2', notas: 'Cotización para piscina nueva pendiente.' },
    { nombre: 'Clínica Santa Elena',   email: 'infraestructura@santaelena.cl',telefono: '+56 2 2567 8901', tipo: 'PERSONA_JURIDICA', rut: '82.567.890-5', notas: 'Piscina terapéutica. Mantención semanal.' },
  ];

  const clienteIds = [];
  for (const c of clientesData) {
    const r = await post(CLIENTES, c, token);
    if (r.success) {
      clienteIds.push(r.data.id);
      console.log(OK(`  Cliente: ${c.nombre}`));
    } else {
      console.log(ERR(`  Cliente: ${c.nombre} - ${JSON.stringify(r.error)}`));
    }
  }

  // ── 3. Técnicos ─────────────────────────────────────────
  console.log('\n' + INF('3/6  Creando técnicos...'));
  const tecnicosData = [
    { nombre: 'Juan Pablo Morales',  especialidad: 'Instalación y Obras Civiles', telefono: '+56 9 9876 5432', email: 'jpmorales@veranoperfecto.cl',  estado: 'DISPONIBLE' },
    { nombre: 'Andrea Sepúlveda',    especialidad: 'Química del Agua y Filtración',telefono: '+56 9 8765 4321', email: 'asepulveda@veranoperfecto.cl', estado: 'EN_RUTA'    },
    { nombre: 'Diego Ramírez Tapia', especialidad: 'Automatización y Domótica',    telefono: '+56 9 7654 3210', email: 'dramirez@veranoperfecto.cl',   estado: 'DISPONIBLE' },
    { nombre: 'Claudia Pinto Vera',  especialidad: 'Mantención General y Bombas',  telefono: '+56 9 6543 2109', email: 'cpinto@veranoperfecto.cl',     estado: 'EN_MANTENCION'},
  ];

  const tecnicoIds = [];
  for (const t of tecnicosData) {
    const r = await post(TECN, t, token);
    if (r.success) {
      tecnicoIds.push(r.data.id);
      console.log(OK(`  Técnico: ${t.nombre} (${t.estado})`));
    } else {
      console.log(ERR(`  Técnico: ${t.nombre} - ${JSON.stringify(r.error)}`));
    }
  }

  // ── 4. Órdenes de mantención ────────────────────────────
  console.log('\n' + INF('4/6  Creando órdenes de mantención...'));
  const hoy = new Date();
  const fecha = (dias) => {
    const d = new Date(hoy);
    d.setDate(d.getDate() + dias);
    return d.toISOString().split('T')[0];
  };

  const fechaHora = (dias, hora = '09:00:00') => {
    const d = new Date(hoy);
    d.setDate(d.getDate() + dias);
    return d.toISOString().split('T')[0] + 'T' + hora;
  };

  const mantenciones = [
    { clienteId: clienteIds[0], tecnicoId: tecnicoIds[0], tipo: 'PREVENTIVA', estado: 'COMPLETADA',  descripcion: 'Limpieza completa fondo y paredes + balance químico.', fechaHora: fechaHora(-5,'08:00:00'), observaciones: 'pH corregido. Cloro libre OK.' },
    { clienteId: clienteIds[1], tecnicoId: tecnicoIds[1], tipo: 'PREVENTIVA', estado: 'EN_CURSO',    descripcion: 'Mantención mensual piscina principal residencial.', fechaHora: fechaHora(0,'10:00:00'),  observaciones: 'En proceso.' },
    { clienteId: clienteIds[2], tecnicoId: tecnicoIds[2], tipo: 'CORRECTIVA', estado: 'PENDIENTE',   descripcion: 'Revisión bomba filtradora con bajo caudal.', fechaHora: fechaHora(1,'09:00:00'),  observaciones: '' },
    { clienteId: clienteIds[3], tecnicoId: tecnicoIds[3], tipo: 'PREVENTIVA', estado: 'PENDIENTE',   descripcion: 'Mantención semanal ambas piscinas del edificio.', fechaHora: fechaHora(2,'11:00:00'),  observaciones: '' },
    { clienteId: clienteIds[4], tecnicoId: tecnicoIds[0], tipo: 'PREVENTIVA', estado: 'COMPLETADA',  descripcion: 'Cambio filtro de arena y limpieza skimmer.', fechaHora: fechaHora(-3,'08:30:00'), observaciones: 'Todo correcto. Próxima en 30 días.' },
    { clienteId: clienteIds[5], tecnicoId: tecnicoIds[1], tipo: 'PREVENTIVA', estado: 'PENDIENTE',   descripcion: 'Revisión sistema de calefacción solar + química.', fechaHora: fechaHora(3,'14:00:00'),  observaciones: '' },
    { clienteId: clienteIds[7], tecnicoId: tecnicoIds[2], tipo: 'PREVENTIVA', estado: 'EN_CURSO',    descripcion: 'Mantención semanal piscina terapéutica clínica.', fechaHora: fechaHora(0,'07:00:00'),  observaciones: 'Agua a temperatura ideal 32°C.' },
  ];

  for (const m of mantenciones) {
    if (!m.clienteId || !m.tecnicoId) continue;
    const r = await post(MANT, m, token);
    if (r.success) {
      console.log(OK(`  Mantención: ${m.tipo} para cliente ${m.clienteId} (${m.estado})`));
    } else {
      console.log(ERR(`  Mantención fallida: ${JSON.stringify(r.error)}`));
    }
  }

  // ── 5. Productos ────────────────────────────────────────
  console.log('\n' + INF('5/6  Creando productos...'));
  const productos = [
    { nombre: 'Cloro Granulado 5kg',          categoria: 'QUIMICA',    precio: 18900, stock: 45, descripcion: 'Cloro granulado 90% estabilizado. Para tratamiento regular.' },
    { nombre: 'Algicida Concentrado 1L',       categoria: 'QUIMICA',    precio: 12500, stock: 30, descripcion: 'Algicida de última generación. Prevención y eliminación.' },
    { nombre: 'Clarificante Líquido 1L',       categoria: 'QUIMICA',    precio: 8900,  stock: 25, descripcion: 'Clarificante floculante. Agua cristalina garantizada.' },
    { nombre: 'pH- Reductor 5kg',              categoria: 'QUIMICA',    precio: 14500, stock: 20, descripcion: 'Ácido sulfúrico granulado. Reducción de pH rápida.' },
    { nombre: 'pH+ Elevador 5kg',              categoria: 'QUIMICA',    precio: 12000, stock: 18, descripcion: 'Bicarbonato sódico. Eleva pH de forma controlada.' },
    { nombre: 'Bomba Filtradora 1HP Astral',   categoria: 'EQUIPOS',    precio: 189000,stock: 5,  descripcion: 'Bomba centrífuga 1HP. Caudal 12m³/h. Garantía 2 años.' },
    { nombre: 'Filtro Arena 500mm con Válvula',categoria: 'EQUIPOS',    precio: 145000,stock: 4,  descripcion: 'Filtro de arena Ø500mm con válvula selectora 7 posiciones.' },
    { nombre: 'Robot Limpiafondos Dolphin E30',categoria: 'EQUIPOS',    precio: 345000,stock: 3,  descripcion: 'Robot automático con cepillo PVC y filtro fino.' },
    { nombre: 'Termómetro Digital Flotante',   categoria: 'ACCESORIOS', precio: 4900,  stock: 20, descripcion: 'Termómetro con alarma de temperatura. Resistente UV.' },
    { nombre: 'Manguera Aspiradora 9m',        categoria: 'ACCESORIOS', precio: 22000, stock: 12, descripcion: 'Manguera flexible Ø38mm para limpieza manual.' },
    { nombre: 'Cepillo Inox Fondo/Paredes',    categoria: 'ACCESORIOS', precio: 9800,  stock: 15, descripcion: 'Cepillo de acero inoxidable para algas resistentes.' },
    { nombre: 'Kit Análisis Agua (50 tests)',  categoria: 'QUIMICA',    precio: 7500,  stock: 35, descripcion: 'Kit colorimétrico: pH, Cloro libre/total, Alcalinidad.' },
    { nombre: 'Servicio Instalación Piscina',  categoria: 'SERVICIOS',  precio: 450000,stock: 99, descripcion: 'Instalación completa piscina fibra vidrio hasta 8x4m.' },
    { nombre: 'Plan Mantención Mensual Básico',categoria: 'SERVICIOS',  precio: 45000, stock: 99, descripcion: 'Visita mensual: limpieza + balance químico básico.' },
    { nombre: 'Plan Mantención Premium',       categoria: 'SERVICIOS',  precio: 89000, stock: 99, descripcion: 'Visitas semanales + productos incluidos + soporte 24/7.' },
  ];

  const productoIds = [];
  for (const p of productos) {
    const r = await post(PROD, p, token);
    if (r.success) {
      productoIds.push(r.data.id);
      console.log(OK(`  Producto: ${p.nombre} ($${p.precio.toLocaleString('es-CL')})`));
    } else {
      console.log(ERR(`  Producto: ${p.nombre} - ${JSON.stringify(r.error)}`));
    }
  }

  // ── 6. Ventas ───────────────────────────────────────────
  console.log('\n' + INF('6/6  Creando ventas...'));
  const ventasData = [
    {
      clienteId: clienteIds[0],
      estado: 'PAGADA',
      items: [
        { productoId: productoIds[0], cantidad: 2, precioUnitario: 18900 },
        { productoId: productoIds[1], cantidad: 1, precioUnitario: 12500 },
        { productoId: productoIds[3], cantidad: 1, precioUnitario: 14500 },
      ]
    },
    {
      clienteId: clienteIds[1],
      estado: 'EMITIDA',
      items: [
        { productoId: productoIds[13], cantidad: 3, precioUnitario: 45000 },
        { productoId: productoIds[11], cantidad: 5, precioUnitario: 7500  },
      ]
    },
    {
      clienteId: clienteIds[4],
      estado: 'PAGADA',
      items: [
        { productoId: productoIds[14], cantidad: 1, precioUnitario: 89000 },
        { productoId: productoIds[8],  cantidad: 1, precioUnitario: 4900  },
      ]
    },
    {
      clienteId: clienteIds[5],
      estado: 'EMITIDA',
      items: [
        { productoId: productoIds[12], cantidad: 1, precioUnitario: 450000 },
        { productoId: productoIds[5],  cantidad: 2, precioUnitario: 189000 },
      ]
    },
    {
      clienteId: clienteIds[2],
      estado: 'BORRADOR',
      items: [
        { productoId: productoIds[6], cantidad: 1, precioUnitario: 145000 },
        { productoId: productoIds[7], cantidad: 1, precioUnitario: 345000 },
      ]
    },
  ];

  for (const v of ventasData) {
    if (!v.clienteId) continue;
    const r = await post(VENTAS, v, token);
    if (r.success) {
      const total = r.data.total || '?';
      console.log(OK(`  Venta cliente ${v.clienteId}: $${Number(total).toLocaleString('es-CL')} (${v.estado})`));
    } else {
      console.log(ERR(`  Venta fallida: ${JSON.stringify(r.error)}`));
    }
  }

  // ── Inventario dashboard ────────────────────────────────
  console.log('\n' + INF('Extra: Cargando inventario en dashboard...'));
  const inventario = [
    { nombre: 'Cloro Granulado 5kg',   cantidad: 45, minimo: 10, precio: 18900,  nivelPorcentaje: 90 },
    { nombre: 'Algicida 1L',           cantidad: 30, minimo: 5,  precio: 12500,  nivelPorcentaje: 75 },
    { nombre: 'pH- Reductor 5kg',      cantidad: 4,  minimo: 8,  precio: 14500,  nivelPorcentaje: 20 }, // stock crítico
    { nombre: 'Filtro Arena 500mm',    cantidad: 2,  minimo: 3,  precio: 145000, nivelPorcentaje: 15 }, // stock crítico
    { nombre: 'Robot Dolphin E30',     cantidad: 3,  minimo: 2,  precio: 345000, nivelPorcentaje: 60 },
    { nombre: 'Bomba Filtradora 1HP',  cantidad: 5,  minimo: 3,  precio: 189000, nivelPorcentaje: 70 },
  ];

  for (const item of inventario) {
    const r = await post(DASH, item, token);
    if (r.success) {
      const alerta = item.cantidad < item.minimo ? ' ⚠️ STOCK CRÍTICO' : '';
      console.log(OK(`  ${item.nombre} (stock: ${item.cantidad})${alerta}`));
    } else {
      console.log(ERR(`  Inventario fallido: ${JSON.stringify(r.error)}`));
    }
  }

  // ── Resumen ─────────────────────────────────────────────
  console.log('\n\x1b[1m\x1b[32m══════════════════════════════════════════\x1b[0m');
  console.log('\x1b[1m\x1b[32m   ✅ DATOS DEMO CARGADOS EXITOSAMENTE     \x1b[0m');
  console.log('\x1b[1m\x1b[32m══════════════════════════════════════════\x1b[0m');
  console.log('\n  Ingresa al ERP con:');
  console.log('  👤 Usuario: \x1b[33madmin\x1b[0m');
  console.log('  🔑 Password: \x1b[33madmin123\x1b[0m');
  console.log('  🌐 URL: \x1b[36mhttp://localhost:5173\x1b[0m\n');
  console.log('  Datos cargados:');
  console.log(`  • ${clienteIds.length} clientes`);
  console.log(`  • ${tecnicoIds.length} técnicos`);
  console.log(`  • ${mantenciones.length} órdenes de mantención`);
  console.log(`  • ${productos.length} productos`);
  console.log(`  • ${ventasData.length} ventas`);
  console.log(`  • ${inventario.length} items de inventario\n`);
}

seed().catch((e) => {
  console.error(ERR('Error fatal: ' + e.message));
  process.exit(1);
});
