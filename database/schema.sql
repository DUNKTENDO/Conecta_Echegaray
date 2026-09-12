CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS publications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL CHECK (char_length(description) BETWEEN 1 AND 1000),
    business_name VARCHAR(100),
    category VARCHAR(50),
    hours VARCHAR(100),
    location VARCHAR(150),
    contact VARCHAR(150),
    image_path VARCHAR(255),
    event_date DATE,
    event_time TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'pendiente'
        CHECK (status IN ('pendiente', 'aprobada', 'rechazada')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    reviewed_at TIMESTAMPTZ
);

-- La aplicación admite estas categorías. Conservamos una migración segura para
-- instalaciones que ya se hubieran creado con la versión inicial del esquema.
ALTER TABLE publications DROP CONSTRAINT IF EXISTS publications_type_check;
ALTER TABLE publications
    ADD CONSTRAINT publications_type_check CHECK (
        type IN ('noticia', 'evento', 'aviso', 'servicio', 'comercio',
                 'compra-venta', 'iniciativa')
    );
ALTER TABLE publications ADD COLUMN IF NOT EXISTS image_path VARCHAR(255);
ALTER TABLE publications ADD COLUMN IF NOT EXISTS event_date DATE;
ALTER TABLE publications ADD COLUMN IF NOT EXISTS event_time TIME;

CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    publication_id UUID UNIQUE NOT NULL REFERENCES publications(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    description TEXT,
    location VARCHAR(150),
    address VARCHAR(150),
    schedule VARCHAR(100),
    contact VARCHAR(150),
    image_path VARCHAR(255),
    services JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE businesses ADD COLUMN IF NOT EXISTS image_path VARCHAR(255);
ALTER TABLE businesses ADD COLUMN IF NOT EXISTS services JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(254) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_publications_status ON publications(status);
CREATE INDEX IF NOT EXISTS idx_publications_created_at ON publications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_businesses_category ON businesses(category);
