# MERN Portfolio + Todo App

A full-stack project combining a personal **portfolio site** with an authenticated **Todo list app**, built on the MERN stack with a custom dark, IDE-inspired design.

## Features

- Portfolio (Hero, About, Skills, Projects, Experience, Future Plans, Achievements, Certifications, Contact)
- Experience, Projects, and Future Plans are **stored in MongoDB and editable from an admin dashboard** — no more editing code to update your portfolio
- User registration/login with JWT auth (passwords hashed with bcrypt)
- Role-based access: a portfolio "admin" account manages content; everyone else just gets the todo app
- Full CRUD todo list, scoped per logged-in user
- Security middleware: Helmet, CORS, rate limiting, NoSQL-injection sanitization
- Custom dark, IDE-inspired design system (no UI framework) with a terminal-style scroll progress bar

## Tech stack

- **Frontend:** React (Vite), React Router, Axios, custom CSS design system
- **Backend:** Node.js, Express
- **Database:** MongoDB (via Mongoose) — MongoDB Atlas recommended
- **Auth:** JSON Web Tokens (JWT)

---

## 1. Prerequisites

- [Node.js](https://nodejs.org/) v18+ installed
- A MongoDB database — easiest is a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster (already gives you a TLS-encrypted connection string)

---

## 2. Get a MongoDB connection string

1. Sign up / log in at MongoDB Atlas.
2. Create a free (M0) cluster.
3. Under **Database Access**, create a DB user with a password.
4. Under **Network Access**, add your IP (or `0.0.0.0/0` for testing only).
5. Click **Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/mern-portfolio-todo?retryWrites=true&w=majority
   ```

---

## 3. Backend setup

```bash
cd backend
npm install
cp .env.example .env
```

Open `.env` and fill in:
```
PORT=5000
NODE_ENV=development
MONGO_URI=<your connection string from step 2>
JWT_SECRET=<any long random string>
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

> Generate a strong `JWT_SECRET` quickly with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

Run the backend:
```bash
npm run dev
```
You should see:
```
MongoDB connected: cluster0.xxxxx.mongodb.net
Server running in development mode on port 5000
```

Test it's alive: open `http://localhost:5000/api/health` in your browser — you should see `{"status":"ok"}`.

---

## 4. Frontend setup

Open a **new terminal** (keep the backend running):

```bash
cd frontend
npm install
cp .env.example .env
```

The default `.env` already points at `http://localhost:5000/api`, which matches the backend above — no changes needed for local dev.

Run the frontend:
```bash
npm run dev
```

Open the URL it prints (usually `http://localhost:5173`).

---

## 5. Try it out

1. Go to `/register`, create an account.
2. You'll be redirected to `/todos` — add, complete, and delete todos.
3. Visit `/` to see the portfolio homepage.
4. Log out and log back in — your todos persist (they're stored in MongoDB, scoped to your user).

---

## 6. Set up the admin dashboard

Experience, Projects, and Future Plans are stored in MongoDB and rendered live on the portfolio —
you manage them from `/admin` instead of editing code. Only one role can access it: `admin`.

1. **Register a normal account first** at `/register` (this is the account you'll use to manage the site).
2. **Promote it to admin** by running this from the `backend/` folder:
   ```bash
   npm run create-admin -- you@example.com
   ```
   (use the same email you registered with)
3. **Log out and log back in** on the site — your JWT is refreshed with the new `admin` role.
4. An **Admin** link now appears in the navbar. Visit `/admin` to manage:
   - **Experience** — your work history timeline
   - **Projects** — the "Stuff I Built" showcase (title, tagline, bullet highlights, tech tags, live URL)
   - **Future Plans** — a new "What's Next" section on the homepage for goals in progress or planned

Changes save straight to MongoDB and appear on the homepage immediately — no rebuild or redeploy needed.

Anyone who registers without being promoted is a regular user — they can use the Todo app, but
`/admin` and its API routes are inaccessible to them (the backend rejects non-admin requests with
a 403, and the frontend redirects them away from `/admin`).

### API reference

All three resources follow the same pattern — public reads, admin-only writes:

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/experience` | Public |
| POST / PUT / DELETE | `/api/experience(/:id)` | Admin only |
| GET | `/api/projects` | Public |
| POST / PUT / DELETE | `/api/projects(/:id)` | Admin only |
| GET | `/api/goals` | Public |
| POST / PUT / DELETE | `/api/goals(/:id)` | Admin only |

---

## 7. Project structure

```
mern-portfolio-todo/
├── backend/
│   ├── config/db.js                  # MongoDB connection
│   ├── models/                       # Mongoose schemas (User, Todo, Project, Experience, Goal)
│   ├── controllers/                  # Route logic
│   ├── routes/                       # Express routers
│   ├── middleware/
│   │   ├── authMiddleware.js         # JWT protect middleware
│   │   └── adminMiddleware.js        # Blocks non-admin requests to content routes
│   ├── scripts/createAdmin.js        # Promotes a registered user to admin
│   ├── server.js                     # App entry point + security middleware
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx, ScrollProgressBar.jsx, ChatBubble.jsx
    │   │   ├── Portfolio/             # Hero, About, Skills, Projects, Experience, Goals, ...
    │   │   ├── Todo/                  # TodoForm, TodoItem, TodoList
    │   │   ├── ProtectedRoute.jsx     # Requires login (todo app)
    │   │   ├── AdminRoute.jsx         # Requires the admin role
    │   │   └── AdminResourcePanel.jsx # Generic CRUD UI used by the admin dashboard
    │   ├── pages/                     # Home, Login, Register, TodoApp, AdminDashboard
    │   ├── context/AuthContext.jsx
    │   ├── services/api.js           # Axios instance with JWT interceptor
    │   └── App.jsx                   # Routes
    └── .env.example
```

---

## 8. HTTPS & security notes

- **Local dev** runs over plain HTTP — that's normal and fine.
- **In production**, HTTPS should be handled by your hosting platform (Vercel/Netlify auto-provide it for the frontend; Render/Railway/Fly.io auto-provide it for the backend) or by Nginx + Let's Encrypt if you self-host.
- MongoDB Atlas connections are TLS-encrypted by default via the `mongodb+srv://` connection string — nothing extra to configure.
- The backend already includes: `helmet` (secure headers), `cors` (restricted to your frontend origin), `express-rate-limit` (brute-force protection, tighter on `/api/auth`), `express-mongo-sanitize` (blocks NoSQL injection), and bcrypt password hashing.

---

## 9. Deploying (optional next step)

| Piece | Suggested host |
|---|---|
| Frontend | Vercel or Netlify (`npm run build` → deploy `dist/`) |
| Backend | Render or Railway (set env vars from `.env` in their dashboard) |
| Database | MongoDB Atlas (already cloud-hosted) |

When deploying, update:
- Backend `.env` → `CLIENT_URL` to your deployed frontend URL
- Frontend `.env` → `VITE_API_URL` to your deployed backend's `https://.../api` URL

---

## 10. Customizing the portfolio

**Experience, Projects, and Future Plans** are managed from `/admin` (see §6) — no code edits needed.

Everything else still lives in small data arrays at the top of each component:
- `frontend/src/components/Navbar.jsx` — your name/brand
- `frontend/src/components/Portfolio/Hero.jsx` — name, tagline, social links
- `frontend/src/components/Portfolio/About.jsx` — bio, core areas, education history
- `frontend/src/components/Portfolio/Skills.jsx` — skill categories and tools
- `frontend/src/components/Portfolio/Achievements.jsx` — awards/hackathon wins timeline
- `frontend/src/components/Portfolio/Certifications.jsx` — certifications grid
- `frontend/src/components/Portfolio/Contact.jsx` — email, phone, location

All colors, fonts, spacing, and the terminal scroll-progress bar live in `frontend/src/styles/theme.css` — edit the `:root` variables at the top to retheme the whole site (e.g. change `--accent` and `--accent-2` for a different color scheme).
