# gk-india-solar-tech

A monorepo with two independently deployable apps:

- `client/` — React + Vite frontend → deploy to **Vercel**
- `server/` — Express + MongoDB API → deploy to **Render**

## Deploying the backend (Render)

1. New **Web Service** on Render, pointed at this repo.
   - Root directory: `server`
   - Build command: `npm install && npm run build`
   - Start command: `npm run start`
   - Health check path: `/health`
   - (A `server/render.yaml` blueprint is included if you prefer "New Blueprint Instance".)
2. Set environment variables (see `server/.env.example`):
   - `NODE_ENV=production`
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `CLIENT_ORIGIN` — comma-separated list of allowed frontend origins, e.g. `https://your-app.vercel.app`
   - `JWT_ACCESS_SECRET` — random secret (`openssl rand -base64 48`)
   - `JWT_ACCESS_EXPIRES_IN`, `REFRESH_TOKEN_TTL_DAYS` — optional, have defaults
3. Note the deployed URL, e.g. `https://gk-india-solartech-server.onrender.com`.

## Deploying the frontend (Vercel)

1. New Project on Vercel, pointed at this repo, with **root directory set to `client`**. Vercel auto-detects Vite.
2. Set environment variable (see `client/.env.example`):
   - `VITE_API_BASE_URL=https://<your-render-service>.onrender.com/api`
3. Deploy. `client/vercel.json` handles SPA rewrites so client-side routes (React Router) don't 404 on refresh.
4. Once you know the Vercel URL (and any custom domain), add it to `CLIENT_ORIGIN` on Render and redeploy the backend.

## Local development

```bash
# backend
cd server && cp .env.example .env   # fill in the values
npm install && npm run dev          # http://localhost:4000

# frontend
cd client && npm install && npm run dev   # http://localhost:5173
```

The client defaults to `http://localhost:4000/api` when `VITE_API_BASE_URL` is unset.
