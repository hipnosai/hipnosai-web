-- Hipnos AI · Tiendas — esquema inicial (multi-negocio).
-- Montos en CENTAVOS (enteros). Fechas de negocio 'YYYY-MM-DD' en hora de Ecuador (UTC-5).

CREATE TABLE IF NOT EXISTS negocios (
  id INTEGER PRIMARY KEY,
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  telefono TEXT,
  redes TEXT,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS miembros (
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  tg_user_id INTEGER NOT NULL,
  nombre TEXT,
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'miembro')),
  creado TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (negocio_id, tg_user_id)
);
CREATE INDEX IF NOT EXISTS miembros_usuario ON miembros (tg_user_id);

CREATE TABLE IF NOT EXISTS chats (
  tg_chat_id INTEGER PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  titulo TEXT,
  vinculado_por INTEGER,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS invitaciones (
  codigo TEXT PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  rol TEXT NOT NULL CHECK (rol IN ('admin', 'miembro')),
  usos_max INTEGER NOT NULL DEFAULT 1,
  usos INTEGER NOT NULL DEFAULT 0,
  expira TEXT NOT NULL,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS caja (
  id INTEGER PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  fecha TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('inicio', 'cierre')),
  monto INTEGER NOT NULL,
  autor INTEGER,
  creado TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (negocio_id, fecha, tipo)
);

CREATE TABLE IF NOT EXISTS pagos (
  id INTEGER PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  proveedor TEXT NOT NULL,
  proveedor_norm TEXT NOT NULL,
  monto INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente' CHECK (estado IN ('pendiente', 'pagado')),
  pagado_en TEXT,
  pagado_por INTEGER,
  autor INTEGER,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS pagos_pendientes ON pagos (negocio_id, estado, fecha);

CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  nombre TEXT NOT NULL,
  nombre_norm TEXT NOT NULL,
  telefono TEXT,
  cedula TEXT,
  correo TEXT,
  consentimiento TEXT,
  consentimiento_por INTEGER,
  autor INTEGER,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS clientes_nombre ON clientes (negocio_id, nombre_norm);

CREATE TABLE IF NOT EXISTS comprobantes (
  id INTEGER PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  numero INTEGER NOT NULL,
  codigo TEXT NOT NULL UNIQUE,
  cliente_id INTEGER REFERENCES clientes(id),
  items TEXT NOT NULL,
  total INTEGER NOT NULL,
  fecha TEXT NOT NULL,
  mensaje TEXT,
  estado TEXT NOT NULL DEFAULT 'emitido' CHECK (estado IN ('emitido', 'anulado')),
  autor INTEGER,
  creado TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE (negocio_id, numero)
);

CREATE TABLE IF NOT EXISTS ventas (
  id INTEGER PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  fecha TEXT NOT NULL,
  monto INTEGER NOT NULL,
  origen TEXT NOT NULL CHECK (origen IN ('rapida', 'comprobante')),
  comprobante_id INTEGER REFERENCES comprobantes(id),
  autor INTEGER,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS ventas_fecha ON ventas (negocio_id, fecha);

CREATE TABLE IF NOT EXISTS productos (
  id INTEGER PRIMARY KEY,
  negocio_id INTEGER NOT NULL REFERENCES negocios(id),
  codigo TEXT NOT NULL,
  nombre TEXT NOT NULL,
  precio INTEGER NOT NULL,
  stock INTEGER,
  creado TEXT NOT NULL DEFAULT (datetime('now')),
  actualizado TEXT,
  UNIQUE (negocio_id, codigo)
);

-- Historial para "borrar último" (deshacer lo último que registró cada persona).
CREATE TABLE IF NOT EXISTS registros (
  id INTEGER PRIMARY KEY,
  negocio_id INTEGER NOT NULL,
  autor INTEGER NOT NULL,
  tabla TEXT NOT NULL,
  fila_id INTEGER NOT NULL,
  datos TEXT,
  deshecho INTEGER NOT NULL DEFAULT 0,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS registros_autor ON registros (negocio_id, autor, deshecho, id);

-- Evita procesar dos veces el mismo mensaje si Telegram lo reenvía.
CREATE TABLE IF NOT EXISTS updates (
  update_id INTEGER PRIMARY KEY,
  creado TEXT NOT NULL DEFAULT (datetime('now'))
);
