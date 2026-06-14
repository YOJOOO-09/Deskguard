# DeskGuard

DeskGuard is a real-time library seat-booking system that keeps shared study
spaces fair: students see live desk availability, join a virtual "Next in
Line" queue when the library is full, and can book a cluster of adjacent
desks for group study. An admin dashboard gives librarians live occupancy
stats, abandoned-desk alerts, and analytics.

Built with React 19 + Vite + Tailwind CSS v4, styled with a BMW M
motorsport-inspired dark theme. Talks to the DeskGuard backend (Express +
WebSocket) for live data.

## Features

- **Live library map** — real-time desk grid (available / occupied / away / reserved)
- **Virtual queue** — join the line when the library is full, get notified when a desk frees up
- **Smart group booking** — find and reserve a cluster of adjacent free desks
- **Active session view** — countdown timer, away/back toggle, "still here?" check
- **Admin dashboard** — occupancy charts, abandoned-desk management, activity log, analytics

## Local development

```bash
npm install
npm run dev
```

The app runs on `http://localhost:5180` by default and expects the backend at
`http://localhost:4000` / `ws://localhost:4000` (see `.env.example`).

## Configuration

Copy `.env.example` to `.env` to point the app at a different backend:

| Variable        | Description                          | Default                  |
| --------------- | ------------------------------------- | ------------------------ |
| `VITE_API_URL`  | Base URL of the DeskGuard backend API  | `http://localhost:4000`  |
| `VITE_WS_URL`   | WebSocket URL of the DeskGuard backend | `ws://localhost:4000`    |

## Deploying to Vercel

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. In Vercel, click **Add New > Project** and import the repo. Vercel
   auto-detects the Vite framework preset — no extra config needed.
3. Add environment variables in the Vercel project settings:
   - `VITE_API_URL` = your deployed backend URL (e.g. `https://deskguard-backend.onrender.com`)
   - `VITE_WS_URL` = the same host with `wss://` (e.g. `wss://deskguard-backend.onrender.com`)
4. Deploy.

The backend (Express + WebSocket + in-memory store) needs a persistent Node
server and is **not** deployed on Vercel — deploy it separately to Render or
Railway (see the backend repo's README for instructions).
