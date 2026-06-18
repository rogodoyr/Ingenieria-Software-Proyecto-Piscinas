INSERT INTO productos (id, nombre, categoria, precio, icono, descripcion, activo, stock, minimo, created_at, updated_at) VALUES 
(gen_random_uuid(), 'Servicio de Mantención Básica', 'Servicios', 45000, '🧹', 'Limpieza y aspirado de fondo', true, 999, 0, NOW(), NOW()),
(gen_random_uuid(), 'Servicio de Instalación Motor', 'Servicios', 85000, '🔧', 'Instalación de bomba y conexiones', true, 999, 0, NOW(), NOW()),
(gen_random_uuid(), 'Recuperación Aguas Verdes', 'Servicios', 120000, '🧪', 'Tratamiento de shock químico y decantación', true, 999, 0, NOW(), NOW());
