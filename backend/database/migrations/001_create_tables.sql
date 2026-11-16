-- Room Service & Food QR System - tables (PostgreSQL)
-- Safe to run more than once (IF NOT EXISTS).

-- Staff accounts. Login (email + password) is handled by Supabase Auth;
-- this table says WHO is hotel staff and stores their name/role.
CREATE TABLE IF NOT EXISTS admin_users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_provider_id UUID NOT NULL UNIQUE,   -- id of the user in Supabase Auth (auth.users)
  email         TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'admin',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- only ONE row in this table (single hotel in V1)
CREATE TABLE IF NOT EXISTS hotel_settings (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hotel_name               TEXT NOT NULL DEFAULT 'My Hotel',
  logo_url                 TEXT,
  cover_image_url          TEXT,
  welcome_message          TEXT,
  primary_color            TEXT NOT NULL DEFAULT '#1F2937',
  secondary_color          TEXT NOT NULL DEFAULT '#C9A24D',
  phone                    TEXT,
  whatsapp                 TEXT,
  address                  TEXT,
  -- module on/off switches
  module_food_ordering     BOOLEAN NOT NULL DEFAULT TRUE,
  module_room_service      BOOLEAN NOT NULL DEFAULT TRUE,
  module_contact_reception BOOLEAN NOT NULL DEFAULT TRUE,
  module_hotel_information BOOLEAN NOT NULL DEFAULT TRUE,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS rooms (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_number TEXT NOT NULL UNIQUE,
  floor       INTEGER,
  status      TEXT NOT NULL DEFAULT 'ACTIVE',      -- ACTIVE or INACTIVE
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS qr_codes (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id    UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
  token      TEXT NOT NULL UNIQUE,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  description TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id   UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name          TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10,2) NOT NULL,
  image_url     TEXT,
  is_vegetarian BOOLEAN NOT NULL DEFAULT TRUE,
  is_available  BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order    INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- add-ons of a menu item (e.g. Extra Cheese)
CREATE TABLE IF NOT EXISTS menu_item_options (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id UUID NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  price        NUMERIC(10,2) NOT NULL DEFAULT 0,
  is_active    BOOLEAN NOT NULL DEFAULT TRUE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001;

CREATE TABLE IF NOT EXISTS orders (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number         TEXT NOT NULL UNIQUE,
  room_id              UUID NOT NULL REFERENCES rooms(id),
  status               TEXT NOT NULL DEFAULT 'NEW',
  subtotal             NUMERIC(12,2) NOT NULL,
  total                NUMERIC(12,2) NOT NULL,
  special_instructions TEXT,
  idempotency_key      TEXT,     -- sent by the frontend to stop double submit
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Item name + price are COPIED here when the order is placed (snapshot),
-- so later menu price changes never change old orders.
CREATE TABLE IF NOT EXISTS order_items (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id             UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id         UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  item_name_snapshot   TEXT NOT NULL,
  unit_price           NUMERIC(10,2) NOT NULL,
  quantity             INTEGER NOT NULL,
  special_instructions TEXT,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_item_options (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id        UUID NOT NULL REFERENCES order_items(id) ON DELETE CASCADE,
  option_name_snapshot TEXT NOT NULL,
  option_price         NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS service_categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  description TEXT,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE SEQUENCE IF NOT EXISTS request_number_seq START 1001;

CREATE TABLE IF NOT EXISTS service_requests (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_number      TEXT NOT NULL UNIQUE,
  room_id             UUID NOT NULL REFERENCES rooms(id),
  service_category_id UUID NOT NULL REFERENCES service_categories(id),
  custom_request      TEXT,
  status              TEXT NOT NULL DEFAULT 'NEW',
  idempotency_key     TEXT,      -- sent by the frontend to stop double submit
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- for databases created before idempotency_key existed
ALTER TABLE orders ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
ALTER TABLE service_requests ADD COLUMN IF NOT EXISTS idempotency_key TEXT;
-- the same key can be used only once per room
CREATE UNIQUE INDEX IF NOT EXISTS uq_orders_idempotency ON orders (room_id, idempotency_key) WHERE idempotency_key IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS uq_requests_idempotency ON service_requests (room_id, idempotency_key) WHERE idempotency_key IS NOT NULL;

-- default data: one hotel row + the 7 default request types
INSERT INTO hotel_settings (hotel_name, welcome_message)
SELECT 'My Hotel', 'Welcome! Order food or request a service from your room.'
WHERE NOT EXISTS (SELECT 1 FROM hotel_settings);

INSERT INTO service_categories (name, sort_order) VALUES
  ('Extra Towels', 1), ('Drinking Water', 2), ('Toiletries', 3), ('Housekeeping', 4),
  ('Laundry', 5), ('Maintenance', 6), ('Other Request', 7)
ON CONFLICT (name) DO NOTHING;

-- counters used by the rate limit (see lib/rateLimit.ts)
CREATE TABLE IF NOT EXISTS rate_limits (
  key          TEXT NOT NULL,
  window_start BIGINT NOT NULL,
  hits         INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (key, window_start)
);
