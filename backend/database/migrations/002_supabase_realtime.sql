-- Supabase only (runs automatically by `npm run setup` when the database is Supabase).
-- 1) Turns on Realtime for orders and service_requests, so the staff dashboard gets live updates.
-- 2) Turns on Row Level Security (RLS) on every table.
--    Supabase exposes tables to the internet through its own API, so RLS = "nobody can read
--    anything unless a policy allows it". Our Express backend connects directly to the database
--    with the postgres user, which is NOT affected by RLS, so the backend keeps working as before.

-- true only if the logged-in Supabase user is in admin_users.
-- (SECURITY DEFINER = runs with owner rights, so RLS on admin_users does not block this check)
CREATE OR REPLACE FUNCTION is_staff() RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE auth_provider_id = auth.uid())
$$;
REVOKE ALL ON FUNCTION is_staff() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_staff() TO authenticated;

ALTER TABLE admin_users         ENABLE ROW LEVEL SECURITY;
ALTER TABLE hotel_settings      ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms               ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories     ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items          ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_options   ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items         ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_item_options  ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_requests    ENABLE ROW LEVEL SECURITY;
ALTER TABLE rate_limits         ENABLE ROW LEVEL SECURITY;

-- only logged-in hotel staff may listen to orders / requests
DROP POLICY IF EXISTS staff_can_read_orders ON orders;
CREATE POLICY staff_can_read_orders ON orders FOR SELECT TO authenticated USING (is_staff());

DROP POLICY IF EXISTS staff_can_read_requests ON service_requests;
CREATE POLICY staff_can_read_requests ON service_requests FOR SELECT TO authenticated USING (is_staff());

-- add the two tables to the Realtime publication (skip if already added)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'orders') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'service_requests') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE service_requests;
  END IF;
END $$;
