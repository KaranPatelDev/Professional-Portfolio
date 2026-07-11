# Karan Patel Portfolio

Full-stack portfolio with a custom admin panel (CMS). See `IMPLEMENTATION-PLAN.md` for the architecture and `karan-patel-portfolio-plan.md` for the content strategy.

## Local development

**Backend** (FastAPI + Postgres):
```
cd backend
./venv/Scripts/python.exe -m uvicorn app.main:app --port 8123 --reload
```
Copy `.env.example` to `.env` and fill in real credentials (Neon DB URL, admin login, Cloudinary, Gmail SMTP) first.

To (re)seed real starter content (D&D Purchase, Magenta Connects experience, homepage copy, services):
```
./venv/Scripts/python.exe scripts/seed.py
```

**Frontend** (Next.js):
```
cd frontend
npm install
npm run dev
```
Copy `.env.example` to `.env.local` and point `NEXT_PUBLIC_API_URL` at the backend.

Visit `http://localhost:3000` for the site, `http://localhost:3000/admin/login` for the admin panel.

## Deployment

- **Frontend → Vercel.** Import the repo, set root directory to `frontend`, add env var `NEXT_PUBLIC_API_URL` pointing at the deployed backend URL. Add `karanpateldev.indevs.in` as a custom domain in Vercel's project settings, then add the CNAME record it gives you wherever `indevs.in`'s DNS is managed.
- **Backend → Render.** New Web Service, connect the repo, set root directory to `backend`. Render doesn't auto-read the `Procfile`, so set these manually:
  - Build command: `pip install -r requirements.txt`
  - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - Python version is pinned via `.python-version` (3.13), picked up automatically.
  - Health check path: `/api/health`
  Set all the env vars from `.env` in the dashboard (never commit `.env`). Update `CORS_ORIGINS` to include the production frontend domain (`https://karanpateldev.indevs.in`, plus the `*.vercel.app` preview URL if you want previews to hit the API too).
- After both are live, update `NEXT_PUBLIC_API_URL` in Vercel to the backend's production `onrender.com` URL and redeploy the frontend.

These steps require your own Vercel/Railway/Render account login, which I can't do on your behalf — the configs above are ready to go once you connect the repo.
