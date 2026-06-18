-- Desactivar productos genéricos existentes
UPDATE productos SET activo = false;

-- Insertar nuevos productos de piscinas
INSERT INTO productos (id, nombre, categoria, precio, icono, descripcion, activo, stock, minimo, created_at, updated_at) VALUES 
(gen_random_uuid(), 'Cloro Granulado 10kg', 'Químicos', 25000, '🧪', 'Cloro granulado al 90% para mantención de piscinas', true, 12, 5, NOW(), NOW()),
(gen_random_uuid(), 'Alguicida 5L', 'Químicos', 12500, '🧪', 'Previene y elimina algas', true, 8, 4, NOW(), NOW()),
(gen_random_uuid(), 'Clarificante 5L', 'Químicos', 14000, '🧪', 'Agrupa partículas pequeñas para el filtro', true, 3, 5, NOW(), NOW()), -- stock crítico
(gen_random_uuid(), 'Decantador Sulfato de Aluminio 5kg', 'Químicos', 9000, '🪨', 'Decantador en polvo para limpiar agua turbia', true, 20, 10, NOW(), NOW()),
(gen_random_uuid(), 'Pastillas Triple Acción 1kg', 'Químicos', 7500, '💊', 'Cloro, alguicida y clarificante en una sola pastilla', true, 45, 15, NOW(), NOW()),

(gen_random_uuid(), 'Red Saca Hojas Plana', 'Accesorios', 5000, '🕸️', 'Red plana estándar para limpieza de superficie', true, 6, 3, NOW(), NOW()),
(gen_random_uuid(), 'Red Saca Hojas Tipo Bolsa', 'Accesorios', 8500, '🕸️', 'Red profunda para limpieza del fondo', true, 2, 4, NOW(), NOW()), -- stock crítico
(gen_random_uuid(), 'Pértiga Telescópica 4.8m', 'Accesorios', 15000, '🦯', 'Mango telescópico de aluminio', true, 10, 3, NOW(), NOW()),
(gen_random_uuid(), 'Cepillo de Pared 18"', 'Accesorios', 6500, '🧹', 'Cepillo curvo con cerdas plásticas', true, 15, 5, NOW(), NOW()),
(gen_random_uuid(), 'Cepillo Acero Inoxidable', 'Accesorios', 12000, '🧽', 'Para remover algas difíciles en concreto', true, 4, 5, NOW(), NOW()), -- stock crítico

(gen_random_uuid(), 'Manguera Flotante 10m', 'Repuestos', 22000, '🐍', 'Manguera corrugada con terminales', true, 5, 3, NOW(), NOW()),
(gen_random_uuid(), 'Canastillo Skimmer Estándar', 'Repuestos', 4500, '🧺', 'Canastillo de reemplazo para skimmer de pared', true, 25, 10, NOW(), NOW()),
(gen_random_uuid(), 'Motor Bomba 1.0 HP', 'Equipos', 185000, '⚙️', 'Bomba autocebante con prefiltro', true, 1, 2, NOW(), NOW()), -- stock crítico
(gen_random_uuid(), 'Filtro de Cuarzo Vulcano VC-50', 'Equipos', 210000, '🛢️', 'Filtro para piscinas de hasta 50m3', true, 2, 2, NOW(), NOW()),
(gen_random_uuid(), 'Arena de Cuarzo 25kg', 'Insumos', 11000, '🏖️', 'Carga filtrante granulometría mixta', true, 30, 10, NOW(), NOW());
