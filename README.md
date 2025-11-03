## Project overview

This project is a full-stack application intended as a portfolio-grade SaaS-style platform for an agency or company. It contains:

- Public marketing pages (Home, About, Pricing), built in Next.js.
- Authentication: Email/password sign-up, email verification, Google OAuth.
- Secure authentication using JWT stored in **HttpOnly cookies** (recommended).
- Dashboard (protected) — analytics, charts, user profile.
- Chatbot backend (Django) supporting document upload, embeddings, and retrieval (FAISS or other vector stores).
- Admin endpoints for uploading company docs & managing FAQs.
- CI/CD-ready for Vercel (frontend) + Render (backend).

---

##  Screenshot

<img width="1902" height="903" alt="NeuraStack" src="https://github.com/user-attachments/assets/6216f00f-5692-46a6-82e4-bdcccfb9d97c" />

---

## Repository structure

```bash
agency-website/
├── backend/
│   ├── backend/
│   │   ├── __init__.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── wsgi.py
│   │   └── asgi.py
│   ├── users/
│   ├── projects/
│   ├── chatbot/
│   ├── api/
│   │   └── urls.py
│   ├── documents/
│   ├── manage.py
│   ├── requirements.txt
│   └── venv/ (ignored)
│
├── frontend/                # Next.js 14 (App Router)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── public/
│   │   └── screenshots/     
│   ├── .env.example
│   ├── package.json
│   ├── next.config.js
│   └── tsconfig.json
│
├── .gitignore
├── README.md
└── LICENSE
```


> Note: The repo intentionally keeps frontend and backend inside one monorepo for convenience and portfolio presentation.

---

## Quick local setup (Windows / PowerShell)

These are the essential steps to get both frontend and backend running locally.

### 1) Fix nested git (if you see `warning: adding embedded git repository: frontend`)
If your `frontend/` already has a `.git` folder (common if you `git init`-ed inside frontend previously), run:

```powershell
# from the repo root
cd frontend
# Remove inner .git so frontend becomes normal folder in the main repo
rm -r -fo .git
cd ..
# Remove cached submodule reference (if present) and re-add properly
git rm --cached frontend || echo "no cached submodule"
git add frontend
git commit -m "Fix: include frontend files in monorepo"

### 2) Create Python virtualenv & install backend dep

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install -r requirements.txt
```

### 3) Create frontend env & install deps

```powershell
cd ../frontend
# Node 18+ recommended
npm install
```

### 4) Run database migrations & create superuser (backend)

```powershell
cd ../backend
.\venv\Scripts\Activate.ps1
python manage.py migrate
python manage.py createsuperuser
# Create superuser to access Django admin
```

### 5) Run backend & frontend (in separate terminals)

#### Backend:

```powershell
cd backend
.\venv\Scripts\Activate.ps1
python manage.py runserver
# default: http://127.0.0.1:8000/
```

#### Frontend:
```powershell
cd frontend
npm run dev
# default: http://localhost:3000/
```


## Key endpoints

| Method | Endpoint | Description |
|:-------|:----------|:-------------|
| `POST` | `/login/` | Login (cookie-based JWT) |
| `POST` | `/register/` | Register (sends verification email) |
| `GET`  | `/verify-email/?token=...` | Verify account (redirects to frontend success page) |
| `POST` | `/google/` | Google Sign-In (`id_token`) |
| `POST` | `/logout/` | Logout (clears cookies) |
| `GET`  | `/me/` | Get current user profile *(protected)* |

---


## Email (SMTP)

```py
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "your_email@gmail.com"
EMAIL_HOST_PASSWORD = "your_generated_app_password"
DEFAULT_FROM_EMAIL = "YourApp <your_email@gmail.com>"
```

## Frontend (Next.js)

```dotenv
NEXT_PUBLIC_API_BASE=http://127.0.0.1:8000   # local backend
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID
```
---

## Production security & best practices

- Set `DEBUG = False` in production.  
- Use **HTTPS** — cookies must be `secure=True` for `SameSite=None`.
- Store secrets in **environment variables** (Render / Vercel dashboard).
- Rotate **JWT refresh tokens** and consider **blacklisting** on logout.
- Implement:
  - **CSP (Content Security Policy)**
  - **Rate Limiting**
  - **Proper CORS Configuration**
- For email, use a reliable provider like **SendGrid** or **Mailgun** for better deliverability.
- Use a **managed PostgreSQL** service (Render Add-on, Heroku Postgres, AWS RDS) for your production database.

---

##  License
This project is open-source and available under the MIT License

##  Author
**Sameer Shah** — AI & Full-Stack Developer  
[Portfolio](https://sameershah-portfolio.vercel.app/) 










