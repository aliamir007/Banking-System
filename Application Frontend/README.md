# Ledger — Bank Account Management (Frontend)

A React + Vite frontend for the Bank Account Management System backend
(Express + MongoDB, JWT auth, rule-based fraud detection).

## Local development

```bash
npm install
cp .env.example .env   # then edit VITE_API_URL if needed
npm run dev
```

The app expects the backend running at the URL in `VITE_API_URL`
(defaults to `http://localhost:8000/api/v1`).

## What's included

- Email/password auth (JWT stored in localStorage, attached as `Authorization: Bearer <token>`)
- Customer flows: dashboard, accounts, open account, transfer, transaction history, profile
- Admin flows: overview, fraud alert review, audit log viewer
- Role-based routing (`ProtectedRoute`) so customers and admins land on the right area automatically

## Deployment

See the deployment guide provided alongside this project for the full
Render (backend) + Vercel (frontend) walkthrough, including the CORS step.

Quick version:
1. Deploy `frontend/` to Vercel, set env var `VITE_API_URL=https://<your-backend>.onrender.com/api/v1`.
2. On the Render backend, set `CORS_ORIGIN=https://<your-vercel-app>.vercel.app`.
3. Redeploy both after setting env vars.
