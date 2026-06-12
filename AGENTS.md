# AGENTS.md

## Project Structure

Two independent apps (no monorepo tooling). Each has its own `package.json` and `node_modules`.

- **backend/** — Express + TypeScript + MongoDB + Gemini API
- **frontend/** — Vite + React + TypeScript + Vanilla CSS

## Commands

### Backend (`backend/`)
```bash
npm run dev      # ts-node-dev, port 5000
npm run build    # tsc
npm start        # node dist/index.js
```

### Frontend (`frontend/`)
```bash
npm run dev      # vite dev server, port 5173
npm run build    # tsc -b && vite build
npm run lint     # eslint .
```

No test framework is configured in either app.

## Environment Setup

Backend requires `backend/.env` with:
- `GEMINI_API_KEY` — Google Gemini API key
- `MONGODB_URI` — MongoDB connection string (defaults to `mongodb://localhost:27017/ai-google-reviews`)
- `GEMINI_MODEL` — optional, defaults to `gemini-3.1-flash-lite`

Without `GEMINI_API_KEY`, the backend falls back to hardcoded review templates (useful for local dev).

## Key Architecture Notes

- **Frontend routing is custom** (no react-router). Routes are parsed from `window.location.pathname` in `App.tsx`:
  - `/login` → Login page (admin + merchant)
  - `/register` → Merchant self-registration
  - `/admin` → Merchant Dashboard
  - `/review/:businessId` → Customer review view (public)
  - `/super-admin` → Super admin panel (admin only)
- **API base URL** is hardcoded to `http://localhost:5000/api` in `App.tsx` (`API_BASE` constant). Change this for production.
- **Backend is a single file** (`backend/src/index.ts`) — all routes defined inline.
- **Auth system**: JWT + httpOnly cookies. Default admin seeded on startup: `admin@aireviews.com` / `admin123`. Merchant accounts created via admin or self-registration.
- **Business approval gate**: A business must have `isApproved: true` for customers to submit reviews or feedback.
- **Models**: `Business.ts`, `Feedback.ts`, `Scan.ts`, `User.ts`, `Registration.ts`, `Subscription.ts` in `backend/src/models/`.
- **Middleware**: `backend/src/middleware/auth.ts` — `authMiddleware`, `requireRole`, `generateToken`.

## API Endpoints (backend)

### Auth
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/login` | Login (admin/merchant) |
| POST | `/api/auth/logout` | Clear auth cookie |
| GET | `/api/auth/me` | Get current user from cookie |
| POST | `/api/auth/register-merchant` | Public merchant registration |

### Merchant
| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/business` | Create or update business |
| GET | `/api/business/:id` | Fetch business by ID |
| POST | `/api/business/:id/feedback` | Submit low-rating feedback (private) |
| GET | `/api/business/:id/feedbacks` | List feedbacks + today's scan count |
| POST | `/api/business/:id/scan` | Log QR code scan event |
| POST | `/api/business/:id/generate-reviews` | Generate AI review drafts |
| PUT | `/api/business/:id/qr-settings` | Update QR code colors |
| PUT | `/api/business/:id/profile` | Update merchant profile (QR, location) |
| GET | `/api/business/:id/feedbacks/csv` | Export feedbacks as CSV |
| GET | `/api/business/:id/contacts/csv` | Export contacts as CSV |

### Admin (requires auth + admin role)
| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/admin/businesses` | List all businesses |
| POST | `/api/admin/business` | Create business + merchant account |
| PUT | `/api/admin/business/:id` | Edit business details |
| PUT | `/api/admin/business/:id/approve` | Toggle approval status |
| DELETE | `/api/admin/business/:id` | Delete business + cascade feedbacks |
| GET | `/api/admin/feedbacks` | All feedbacks system-wide |
| GET | `/api/admin/users` | List all users |
| DELETE | `/api/admin/users/:id` | Delete a user |
| GET | `/api/admin/registrations` | List merchant registrations |
| PUT | `/api/admin/registrations/:id/approve` | Approve registration → create business + user |
| PUT | `/api/admin/registrations/:id/reject` | Reject registration |
| POST | `/api/admin/subscribe` | Assign subscription plan to business |
| GET | `/api/admin/subscriptions` | List all subscriptions |
| GET | `/api/admin/revenue` | Revenue metrics + monthly breakdown |

## Offline / Demo Mode

Frontend gracefully falls back to `localStorage` when backend is unreachable. Business data and feedbacks are cached locally under keys like `demo_biz_<id>` and `feedbacks_<id>`. This is intentional for demo purposes — do not "fix" the localStorage fallbacks.

## Gotchas

- `AI_CONTEXT.md` is an older reference doc; its file structure section is outdated. Trust the actual directory listing over that doc.
- The Gemini response parser handles both JSON arrays and markdown-wrapped responses. Don't simplify the parsing logic without understanding the Gemini output format quirks.
- `recharts` was installed with `--legacy-peer-deps` due to lucide-react peer dep conflicts.
- `lucide-react` and `qrcode.react` were upgraded to latest for React 19 support.
