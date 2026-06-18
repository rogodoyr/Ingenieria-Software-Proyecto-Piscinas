CREATE TABLE inventario (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre VARCHAR(255) NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 0,
    unidad VARCHAR(50) NOT NULL DEFAULT 'Unidades',
    nivel_porcentaje INTEGER NOT NULL DEFAULT 100,
    estado_critico BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_inventario_nombre ON inventario(nombre);
CREATE INDEX idx_inventario_estado_critico ON inventario(estado_critico);
