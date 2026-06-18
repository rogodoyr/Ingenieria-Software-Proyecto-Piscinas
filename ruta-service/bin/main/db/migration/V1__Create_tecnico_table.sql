CREATE TABLE tecnicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(255) NOT NULL,
    comuna VARCHAR(100),
    estado VARCHAR(30) NOT NULL DEFAULT 'Disponible',
    lat DOUBLE PRECISION DEFAULT -33.456940,
    lng DOUBLE PRECISION DEFAULT -70.648270,
    telefono VARCHAR(50),
    ruta_progreso INTEGER DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tecnicos_codigo ON tecnicos(codigo);
CREATE INDEX idx_tecnicos_estado ON tecnicos(estado);
CREATE INDEX idx_tecnicos_comuna ON tecnicos(comuna);
