// Run with:  npm run setup
// 1) creates the tables   2) turns on Supabase Realtime + RLS   3) creates the Storage bucket
// 4) creates the first admin user (in Supabase Auth + admin_users table)
// (reads .env.local - see the "setup" script in package.json)
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});
const rawUrl = process.env.SUPABASE_URL || '';
const cleanUrl = rawUrl.replace(/\/rest\/v1\/?$/, '').replace(/\/$/, '');
const supabaseAdmin = createClient(cleanUrl, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});
const BUCKET = process.env.SUPABASE_BUCKET || 'hotel-images';

const readSql = (file) => fs.readFileSync(path.join(__dirname, 'migrations', file), 'utf8');

async function setup() {
  // 1) tables
  await pool.query(readSql('001_create_tables.sql'));
  console.log('Tables ready');

  // 2) Realtime + RLS (only works on Supabase - it has the "supabase_realtime" publication)
  const isSupabase = await pool.query("SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'");
  if (isSupabase.rows[0]) {
    await pool.query(readSql('002_supabase_realtime.sql'));
    console.log('Realtime + RLS ready');
  } else {
    console.log('Not a Supabase database - skipped Realtime/RLS');
  }

  // 3) Storage bucket for images (public = image links can be opened by guests)
  const bucket = await supabaseAdmin.storage.createBucket(BUCKET, { public: true });
  if (bucket.error && !/already exists/i.test(bucket.error.message)) throw new Error('Bucket: ' + bucket.error.message);
  console.log('Storage bucket ready:', BUCKET);

  // 4) first admin
  const email = (process.env.ADMIN_EMAIL || '').toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    let authUser;
    const created = await supabaseAdmin.auth.admin.createUser({ email, password, email_confirm: true });
    if (created.error) {
      // already exists in Supabase Auth -> find it and update the password
      const list = await supabaseAdmin.auth.admin.listUsers({ perPage: 1000 });
      authUser = list.data && list.data.users.find((u) => u.email === email);
      if (!authUser) throw new Error('Could not create admin: ' + created.error.message);
      await supabaseAdmin.auth.admin.updateUserById(authUser.id, { password });
    } else {
      authUser = created.data.user;
    }

    await pool.query(
      `INSERT INTO admin_users (auth_provider_id, email, name) VALUES ($1, $2, $3)
       ON CONFLICT (email) DO UPDATE SET auth_provider_id = $1`,
      [authUser.id, email, process.env.ADMIN_NAME || 'Admin']
    );
    console.log('Admin user ready:', email);
  }
  await pool.end();
}

setup().catch((err) => {
  console.error('Setup failed:', err.message);
  process.exit(1);
});
