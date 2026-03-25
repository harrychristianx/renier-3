# Renier Real Estate Monorepo

Mobile-focused real estate listing platform with a customer-facing web app, admin panel, and Fastify API.

## Requirements

- Node.js 20+

## Stack

- `apps/frontend`: Vite + React (customer-facing site)
- `apps/admin`: Vite + React (admin panel)
- `apps/api`: Fastify + Prisma REST API
- `packages/db`: Prisma schema, migration, seed, and shared Prisma client

## Quick Start

1. Install dependencies

```bash
npm install
```

2. Generate Prisma client and create DB

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

3. Start everything

```bash
npm run dev
```

Apps run on:

- Frontend: `http://localhost:5173`
- Admin: `http://localhost:5174`
- API: `http://localhost:4000`

## Main Features

### Customer Frontend

- Mobile-first property browsing
- Homepage search, featured/latest listings
- Property directory with filters
- Listing detail pages with:
  - Photos
  - Availability/status
  - Embedded map and video
  - Mortgage calculator
  - Quick inquiry form
  - Book-a-viewing form
  - Agent profile

### Admin Panel

- Dashboard stats (listing and inquiry counts)
- Create/edit/delete property listings
- Toggle listing availability (`AVAILABLE`, `RESERVED`, `SOLD`)
- Manage inquiry lifecycle (`NEW`, `CONTACTED`, `CLOSED`)

### API Endpoints

- `GET /health`
- `GET /api/listings`
- `GET /api/listings/:slug`
- `POST /api/listings`
- `PUT /api/listings/:id`
- `PATCH /api/listings/:id/status`
- `DELETE /api/listings/:id`
- `GET /api/inquiries`
- `POST /api/inquiries`
- `PATCH /api/inquiries/:id/status`

## Environment

Copy env examples as needed:

- Root: `.env.example`
- API: `apps/api/.env.example`
- Frontend: `apps/frontend/.env.example`
- Admin: `apps/admin/.env.example`

Default local DB is SQLite at `packages/db/prisma/dev.db`.

## Production Deployment (Homelab)

Docker production stack:

- Frontend: `127.0.0.1:8085` -> `https://renier.harrychristian.com`
- Admin: `127.0.0.1:8086` -> `https://admin-renier.harrychristian.com`
- API: internal service (`api:4000`) proxied by frontend/admin Nginx at `/api/*`

Run on server:

```bash
cd /home/homelab/renier-real-estate
docker compose -f docker-compose.prod.yml up -d --build
```

Auto-deploy on push is configured on the server using a bare repo and `post-receive` hook:

- Bare repo: `/home/homelab/repos/renier-real-estate.git`
- Deploy hook target: `/home/homelab/renier-real-estate`
- Deploy log: `/home/homelab/renier-real-estate/deploy.log`

To trigger deployments from a local git repo:

```bash
git remote add homelab ssh://homelab@192.168.0.3/home/homelab/repos/renier-real-estate.git
git push homelab main
```
