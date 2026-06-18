CREATE TABLE clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    tipo VARCHAR(20) NOT NULL DEFAULT 'Natural',
    rut VARCHAR(20),
    comuna VARCHAR(100),
    telefono VARCHAR(50),
    email VARCHAR(255),
    direccion VARCHAR(500),
    estado VARCHAR(20) NOT NULL DEFAULT 'Activo',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_clientes_codigo ON clientes(codigo);
CREATE INDEX idx_clientes_nombre ON clientes(nombre);
CREATE INDEX idx_clientes_comuna ON clientes(comuna);
CREATE INDEX idx_clientes_estado ON clientes(estado);
CREATE INDEX idx_clientes_tipo ON clientes(tipo);
