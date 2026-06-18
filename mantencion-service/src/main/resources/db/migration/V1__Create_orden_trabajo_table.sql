CREATE TABLE ordenes_trabajo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    cliente_id VARCHAR(50),
    cliente_nombre VARCHAR(255),
    comuna VARCHAR(100),
    tecnico_id VARCHAR(50),
    tecnico_nombre VARCHAR(255),
    fecha_hora TIMESTAMP NOT NULL,
    servicio VARCHAR(255),
    prioridad VARCHAR(20) NOT NULL DEFAULT 'Normal',
    estado VARCHAR(20) NOT NULL DEFAULT 'Pendiente',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_ot_codigo ON ordenes_trabajo(codigo);
CREATE INDEX idx_ot_estado ON ordenes_trabajo(estado);
CREATE INDEX idx_ot_tecnico ON ordenes_trabajo(tecnico_id);
CREATE INDEX idx_ot_cliente ON ordenes_trabajo(cliente_id);
CREATE INDEX idx_ot_fecha ON ordenes_trabajo(fecha_hora);
CREATE INDEX idx_ot_prioridad ON ordenes_trabajo(prioridad);
