# NIVORA

The repository contains the guest/admin frontend at the root and the API backend in `backend/`.

## Run locally

1. Configure Supabase and backend environment variables in `backend/.env.local` using `backend/.env.example`.
   Set `CORS_ORIGINS=http://localhost:3000` and `GUEST_BASE_URL=http://localhost:3000`.
2. In `backend/`, install dependencies, run `npm run setup`, then start the API on port 3001:

   ```powershell
   npm install
   npm run setup
   npm run dev -- -p 3001
   ```

3. In the repository root, install frontend dependencies and run the frontend:

   ```powershell
   npm install
   npm run dev
   ```

The frontend calls `http://localhost:3001/api` by default. Set `NEXT_PUBLIC_API_URL` to another backend URL when deploying or using a different port; include `/api` or the frontend appends it. The backend must allow the frontend origin in `CORS_ORIGINS`.

Staff sign in with the account created by the backend setup. Guests enter through the room QR URL at `/g/<token>`.
