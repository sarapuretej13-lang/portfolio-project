# Portfolio Project with Custom CMS

A full-stack portfolio website with a custom CMS built from scratch — no third-party CMS.

## 🏗 Architecture

```
portfolio-backend/     ← Django + DRF + PostgreSQL (CMS API)
portfolio-cms/         ← React + Vite (Admin Panel)
portfolio-frontend/    ← Next.js 14 (Portfolio Website)
```

**Data flow:**
```
Portfolio Website (Next.js)
        │ GET (public)
        ▼
Django REST API (DRF + JWT)
        │ Django ORM
        ▼
     PostgreSQL
        ▲
        │ CRUD + Auth
CMS Admin Panel (React/Vite)
```

---

## ⚙️ Backend Setup (`portfolio-backend/`)

### 1. Create virtual environment

```bash
cd portfolio-backend
python -m venv venv
# Windows
venv\Scripts\activate
# Mac/Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure environment

```bash
cp .env.example .env
# Edit .env with your DB credentials and secrets
```

### 4. Create PostgreSQL database

```sql
CREATE DATABASE portfolio_cms;
CREATE USER portfolio_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio_cms TO portfolio_user;
```

### 5. Run migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create admin user

```bash
python manage.py create_admin --username admin --password Admin@123!
```

### 7. Start server

```bash
python manage.py runserver
```

API runs at: `http://localhost:8000`  
Swagger docs: `http://localhost:8000/api/docs/`

---

## 🖥 CMS Admin Panel Setup (`portfolio-cms/`)

### 1. Install dependencies

```bash
cd portfolio-cms
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Set VITE_API_URL=http://localhost:8000
```

### 3. Start dev server

```bash
npm run dev
```

CMS runs at: `http://localhost:5173`  
Login with the admin credentials you created above.

---

## 🌐 Portfolio Frontend Setup (`portfolio-frontend/`)

### 1. Install dependencies

```bash
cd portfolio-frontend
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Start dev server

```bash
npm run dev
```

Portfolio runs at: `http://localhost:3000`

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login/` | Login, returns JWT |
| POST | `/api/auth/logout/` | Blacklist refresh token |
| POST | `/api/auth/refresh/` | Refresh access token |
| GET  | `/api/auth/me/` | Get current user |

### Content (Public: GET, Admin: all)
| Resource | Endpoint |
|----------|----------|
| About | `/api/about/` |
| Skills | `/api/skills/` |
| Projects | `/api/projects/` |
| Blogs | `/api/blogs/` |
| Experience | `/api/experience/` |
| Testimonials | `/api/testimonials/` |
| Services | `/api/services/` |

### Other
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contact/` | Submit contact form |
| GET  | `/api/contact/messages/` | Admin: list messages |
| POST | `/api/media/upload/` | Admin: upload file |
| GET  | `/api/media/` | Admin: media library |

---

## 🗄 Database Models

| Model | Fields |
|-------|--------|
| About | name, title, bio, profile_image, resume, social links |
| Skill | name, category, proficiency, percentage, icon, status |
| Project | title, slug, description, thumbnail, tech_stack, featured, status |
| Blog | title, slug, content, cover_image, category, tags, status |
| Experience | type, position, company, dates, is_current, technologies |
| Testimonial | name, position, content, rating, avatar, status |
| Service | title, description, icon, features, status |
| ContactMessage | name, email, subject, message, status |
| MediaFile | name, file, file_type, size |

All content models have **draft/published** status — only published content is visible publicly.

---

## 🚀 Deployment

### Backend → Render / Railway
1. Set environment variables in the dashboard
2. Set `DEBUG=False`, `ALLOWED_HOSTS=yourdomain.com`
3. Add `gunicorn` start command: `gunicorn core.wsgi`
4. Run migrations on deploy

### CMS Admin → Vercel / Netlify
- Build command: `npm run build`
- Output: `dist/`
- Set `VITE_API_URL` to your deployed backend URL

### Portfolio → Vercel
- Framework: Next.js
- Set `NEXT_PUBLIC_API_URL` to your deployed backend URL

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, Django 4.2, Django REST Framework |
| Auth | SimpleJWT (access + refresh tokens) |
| Database | PostgreSQL |
| CMS UI | React 18, Vite, TanStack Query, react-hook-form |
| Portfolio | Next.js 14, Server Components, TypeScript-ready |
| Styling | Tailwind CSS |
| File Uploads | Django FileField / ImageField |
| API Docs | drf-spectacular (Swagger + ReDoc) |
