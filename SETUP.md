# BitByBit — Setup Guide

## Prerequisites
- Node.js 18+
- MongoDB running locally OR a MongoDB Atlas URI

---

## Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env — set MONGO_URI and JWT_SECRET
npm install
npm run dev        # starts on port 5000
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm run dev        # starts on port 5173
```

The frontend Vite dev server proxies all `/api/*` requests to `http://localhost:5000`.

---

## How Everything Is Connected

### Auth Flow
| Action | Frontend | Backend |
|--------|----------|---------|
| Sign up | `LandingPage` modal → `POST /api/auth/signup` | Creates user in MongoDB |
| Log in | `LandingPage` modal or `/login` → `POST /api/auth/login` | Returns JWT token |
| Token stored | `localStorage.token` + `localStorage.user` | Used in all protected requests |
| Log out | Clears localStorage, redirects to `/` | — |

### Project Flow
| Action | Frontend | Backend |
|--------|----------|---------|
| Post project | `/post-project` → wizard → `POST /api/projects/create` | Saves to MongoDB with `employerId` |
| Browse projects | `/browse` → `GET /api/projects/` | Returns all open projects |
| Acquire project | Browse card click → `POST /api/projects/acquire/:id` | Sets `freelancerId`, status → `in-progress` |
| My projects (client) | `/MyProjects` → `GET /api/projects/employer-projects/:userId` | Projects posted by you |
| My projects (freelancer) | `/MyProjects` → `GET /api/projects/my-projects/:userId` | Projects you acquired |
| AI analyze | Wizard step 5 → `POST /api/projects/analyze` | Calls Python AI service (falls back gracefully if offline) |

---

## Routes Reference

### Backend API
- `POST /api/auth/signup` — Register
- `POST /api/auth/login` — Login, returns JWT
- `GET  /api/projects/` — All open projects
- `POST /api/projects/create` — *(auth required)* Create project
- `POST /api/projects/analyze` — AI analysis
- `POST /api/projects/acquire/:id` — *(auth required)* Acquire project
- `GET  /api/projects/my-projects/:userId` — *(auth required)* Freelancer's projects
- `GET  /api/projects/employer-projects/:userId` — *(auth required)* Employer's projects
- `GET  /api/health` — Health check

### Frontend Routes
- `/` — Landing page (login/signup modal)
- `/login` — Standalone login page
- `/signup` — Standalone signup page
- `/dashboard` — Home (protected)
- `/browse` — Browse all open projects
- `/post-project` — Post a project (protected)
- `/MyProjects` — View your projects (protected)
- `/Profile` — Freelancer profile (protected)
- `/freelancers` — Browse freelancers
