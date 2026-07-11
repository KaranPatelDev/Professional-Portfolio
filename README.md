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
- **Backend → Railway or Render.** Import the repo, set root directory to `backend`, it will pick up `Procfile` and `requirements.txt` automatically. Set all the env vars from `.env` in the platform's dashboard (never commit `.env`). Update `CORS_ORIGINS` to include the production frontend domain (`https://karanpateldev.indevs.in`).
- After both are live, update `NEXT_PUBLIC_API_URL` in Vercel to the backend's production URL and redeploy the frontend.

These steps require your own Vercel/Railway/Render account login, which I can't do on your behalf — the configs above are ready to go once you connect the repo.
