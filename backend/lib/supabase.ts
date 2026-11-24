// Supabase clients (supabase-js): Auth (staff login), Storage (images). Realtime is set up in the database (see README).
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// backend does not keep any browser-like session
const options = { auth: { persistSession: false, autoRefreshToken: false } };

export const BUCKET = process.env.SUPABASE_BUCKET || 'hotel-images';

let adminClient: SupabaseClient | undefined;

// "admin" client: uses the SERVICE ROLE key = full power. Only used on the server.
function getCleanUrl(): string {
  let url = process.env.SUPABASE_URL || '';
  return url.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
}

export function supabaseAdmin(): SupabaseClient {
  if (!adminClient) adminClient = createClient(getCleanUrl(), process.env.SUPABASE_SERVICE_ROLE_KEY!, options);
  return adminClient;
}

// client with the public ANON key - used only to check a staff email + password
export function newAnonClient(): SupabaseClient {
  return createClient(getCleanUrl(), process.env.SUPABASE_ANON_KEY!, options);
}
