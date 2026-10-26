# Battlexa Esports Arena

A full-stack Next.js + TypeScript starter for a Free Fire esports organisation. It includes an animated public site, tournament/scrim/results/news data APIs, MongoDB persistence, and a protected admin dashboard.

## Requirements
- Node.js 20.9+ (Node 22 recommended)
- MongoDB database (Atlas or self-hosted)

## Run locally
1. Install Node.js.
2. Copy `.env.example` to `.env.local`.
3. Fill in `MONGODB_URI`, `MONGODB_DB`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a long random `SESSION_SECRET`.
4. Install and run:
   ```bash
   npm install
   npm run dev
   ```
5. Open `http://localhost:3000`; admin panel: `http://localhost:3000/admin`.

## Admin workflow
- Sign in using `ADMIN_USERNAME` and `ADMIN_PASSWORD`.
- Add, edit, or delete items for **tournaments**, **scrims**, **results**, and **news**.
- Each item is stored in MongoDB. The admin interface accepts JSON for flexible tournament fields; see `src/lib/seed.ts` for example shapes.
- Admin session is an HTTP-only signed cookie. Credentials and session secret must stay server-side.

## API routes
- `GET /api/public/[collection]` — public list for `tournaments`, `scrims`, `results`, `news`
- `POST /api/admin/login` — admin login
- `POST /api/admin/logout` — end admin session
- `GET /api/admin/[collection]` — protected list
- `POST /api/admin/[collection]` — protected create
- `PATCH /api/admin/[collection]/[id]` — protected update
- `DELETE /api/admin/[collection]/[id]` — protected delete

## Suggested content fields
**Tournament:** `title`, `game`, `mode`, `status`, `date`, `time`, `prizePool`, `slots`, `description`, `registrationUrl`, `bannerUrl`
**Scrim:** `title`, `tier`, `mode`, `date`, `time`, `slots`, `status`, `roomInfo`, `registrationUrl`
**Result:** `title`, `date`, `winner`, `runnerUp`, `mvp`, `prizePool`, `standings` (array)
**News:** `title`, `date`, `category`, `summary`, `content`, `imageUrl`

## Before public launch
- Set `COOKIE_SECURE=true` when hosted on HTTPS.
- Use a strong unique admin password and session secret.
- Configure MongoDB Atlas network access and a least-privilege database user.
- Replace the Discord/social links and add real founder portraits in `public/images/founders/`.
- Add your organisation's official contact/support details and privacy policy.
- Run `npm run build` and test all admin CRUD flows before announcing the site.

This repository is a substantial starter foundation, not a claim that a live production deployment or domain has already been configured.
