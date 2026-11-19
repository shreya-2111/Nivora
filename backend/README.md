# Room Service & Food QR System - V1 Backend (Next.js + Supabase)

Backend of the NIVORA spec. Next.js API routes (TypeScript) + Supabase (**PostgreSQL, Auth, Storage, Realtime**) + `qrcode` library. The guest/admin frontend is in the repository root and connects to this API.

## 1. Supabase setup (once)
1. Create a project on supabase.com
2. Project Settings > API: copy `Project URL`, `anon key`, `service_role key`
3. Project Settings > Database > Connection string (URI): copy it and put your DB password
4. Copy `.env.example` to `.env.local` and fill the values (keep `DB_SSL=true`). Locally, set `CORS_ORIGINS=http://localhost:3000` and `GUEST_BASE_URL=http://localhost:3000`.

## 2. Run
```
npm install
npm run setup     # creates tables, Realtime + RLS, Storage bucket "hotel-images", first admin (ADMIN_EMAIL / ADMIN_PASSWORD)
npm run dev -- -p 3001   # API at http://localhost:3001/api/...
```
`npm run setup` is safe to run again. To add another staff member: change ADMIN_EMAIL / ADMIN_PASSWORD in `.env.local` and run it again.
Run the frontend from the repository root on port 3000. It uses `http://localhost:3001/api` by default; configure `NEXT_PUBLIC_API_URL` if the backend is hosted elsewhere.

## 3. Folders (spec section 6)
```
app/api/        every API route  (one folder = one URL, route.ts = the code)
lib/            shared code: db.ts, supabase.ts, auth.ts, storage.ts, rateLimit.ts, qr.ts, menu.ts, orders.ts ...
types/          small shared types
database/       migrations/*.sql (tables, Realtime + RLS) and setup.js
proxy.ts        CORS for /api (only needed when the frontend is on another domain)
```
The frontend screens live in the repository root under `src/app` and use the `/api` endpoints above.

## 4. How each Supabase part is used
| Spec | Where |
|---|---|
| PostgreSQL | all data; `lib/db.ts`, tables in `database/migrations/001_create_tables.sql` |
| Auth | `app/api/auth/*` - Supabase checks email+password. `admin_users.auth_provider_id` = Supabase user id, so only people in `admin_users` are staff |
| Storage | `lib/storage.ts` - images go to public bucket `hotel-images`, DB stores the public URL |
| Realtime | `database/migrations/002_supabase_realtime.sql` - `orders` and `service_requests` are in Supabase Realtime. Only logged-in staff can listen (RLS) |

RLS is ON for all tables, so nobody can read the database through Supabase's public API with the anon key. This app connects with `DATABASE_URL` (postgres user), which is not affected by RLS.

## 5. Login
- Staff: `POST /api/auth/login {email,password}` returns `token`, `refresh_token`. Send `Authorization: Bearer <token>` (a cookie is also set).
  Supabase tokens expire (1 hour by default): call `POST /api/auth/refresh {refresh_token}`.
- Guest: `GET /api/guest/:qrToken` returns `session.token`; send it as header `X-Guest-Session` on guest calls (no account).

## 6. Realtime in the frontend (staff dashboard)
```js
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);   // anon key only, never the service key
supabase.realtime.setAuth(token);                                  // token from /api/auth/login

supabase.channel('staff')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, (p) => { /* new order: play sound, GET /api/orders/:id */ })
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'orders' }, (p) => {})
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'service_requests' }, (p) => {})
  .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'service_requests' }, (p) => {})
  .subscribe();
```
Guests do not use Realtime (no login); the guest page polls `GET /api/orders/:id` for the progress bar.

## 7. APIs (spec section 17)
Auth: POST /api/auth/login, POST /api/auth/logout, GET /api/auth/me
Hotel: GET /api/hotel, PATCH /api/hotel (form-data: logo, cover_image)
Rooms: GET, POST /api/rooms ; PATCH, DELETE /api/rooms/:id
QR: GET, POST /api/qr ; PATCH /api/qr/:id
Menu: GET /api/menu ; POST /api/menu/categories ; PATCH, DELETE /api/menu/categories/:id ; POST /api/menu/items (form-data: image) ; PATCH, DELETE /api/menu/items/:id
Guest: GET /api/guest/:token
Orders: POST, GET /api/orders ; GET /api/orders/:id ; PATCH /api/orders/:id/status
Requests: POST, GET /api/requests ; GET /api/requests/:id ; PATCH /api/requests/:id/status

Extra (needed by the spec text): GET /api/dashboard, GET + PATCH /api/service-categories, POST /api/auth/refresh,
PATCH /api/menu/categories/reorder and PATCH /api/menu/items/reorder (body: `{ "ids": [ ...ids in the new order ] }`)

## Status flow
- Order: NEW -> ACCEPTED -> PREPARING -> READY -> DELIVERED (or REJECTED / CANCELLED)
- Request: NEW -> ACCEPTED -> IN_PROGRESS -> COMPLETED (or REJECTED / CANCELLED)

## Double submit protection
Frontend should send a random `Idempotency-Key` header (create once per checkout, reuse on retry) on `POST /api/orders` and `POST /api/requests`.
Same key = same order is returned again (`duplicate: true`). Without the header, a fallback blocks the same room + same total/request type for 10 seconds.

## Rate limits (per IP, counted in the database)
Failed logins: 10 per 15 min | refresh: 30 per 15 min | QR scan (/api/guest): 60/min | guest orders and requests: 20 per 10 min. When blocked: HTTP 429.
