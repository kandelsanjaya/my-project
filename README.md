# Sanjaya Kandel — Portfolio (Django Edition)

A Django rebuild of the portfolio site, with every section (Projects, Education,
Skills, Certificates, Contact) backed by the database and editable from a
custom-themed admin panel — including a built-in **visitor counter**.

## ✨ What's included

- **Dynamic content** — projects, certificates, education timeline, and skills
  are all `Model`s. Edit them from `/admin/`, no code changes needed.
- **Visitor counter** — a lightweight middleware logs one visit per browser
  session. The admin dashboard shows Total / Today / Last 7 Days at a glance,
  plus a dedicated **Visitor Stats** page with a 14-day bar chart and a table
  of recent visits (IP, path, user agent, timestamp).
- **Custom admin theme** — a neon-green / dark theme matching the site's own
  brand color (`#00ff00`), not the default Django admin look.
- **Contact form** — posts to a real Django view, saves messages to the
  `ContactMessage` model (visible + markable "read" in the admin), and shows a
  success/error banner back on the page. (The old EmailJS integration — which
  was still pointed at a different developer's inbox — has been removed.)
- **Clean folder structure** (see below).

## 📁 Folder structure

```
portfolio_project/
├── manage.py
├── requirements.txt
├── .gitignore
├── portfolio_project/          # Django project config
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── core/                       # Main app
│   ├── models.py               # Project, Certificate, Education, Skill,
│   │                           #   SiteSettings, ContactMessage, SiteVisit
│   ├── admin.py                # Custom PortfolioAdminSite + visitor stats
│   ├── middleware.py           # VisitorTrackingMiddleware
│   ├── views.py                # home, contact_submit
│   ├── urls.py
│   ├── management/
│   │   └── commands/
│   │       └── seed_portfolio.py   # populates your real details
│   ├── static/core/
│   │   ├── css/                # style.css, responsive.css, animations.css
│   │   ├── js/                 # main.js, hero.js, animations.js, contact.js
│   │   ├── images/             # logo, favicon, profile photo (placeholders)
│   │   └── admin/               # admin-theme.css
│   └── templates/core/
│       └── index.html          # the whole one-page site
└── templates/admin/            # admin theme overrides
    ├── base_site.html
    ├── custom_index.html       # dashboard with visitor cards
    └── visitor_stats.html      # full stats page + chart
```

## 🚀 Getting started

```bash
python -m venv venv
source venv/bin/activate        # venv\Scripts\activate on Windows
pip install -r requirements.txt

python manage.py migrate
python manage.py seed_portfolio     # loads your name, education, skills, projects
python manage.py createsuperuser    # your admin login
python manage.py runserver
```

Visit `http://127.0.0.1:8000/` for the site and
`http://127.0.0.1:8000/admin/` for the admin panel.

## 🖼️ Replacing placeholder images

`seed_portfolio` fills in your text content, but a few images are generated
placeholders (logo, favicon, profile photo, business card) since the original
image files weren't part of this handoff. Replace them either by:

- Swapping the files directly in `core/static/core/images/`, **or**
- Uploading real project screenshots / certificates / design images through
  the admin (`Projects`, `Certificates` — these use `ImageField` and are
  served from `/media/`).

## 🔐 Before deploying

The dev server is fine for local testing, but for production:

1. Set a real `DJANGO_SECRET_KEY` environment variable (don't use the
   auto-generated one).
2. Set `DJANGO_DEBUG=False`.
3. Set `DJANGO_ALLOWED_HOSTS` to your actual domain(s).
4. Serve over HTTPS and switch `EMAIL_BACKEND` in `settings.py` to a real SMTP
   backend if you want message notifications by email in addition to the
   admin panel.
5. Run `python manage.py collectstatic` and serve `staticfiles/` + `media/`
   via your web server (nginx, WhiteNoise, etc.) — Django's built-in static
   serving is dev-only.

## 🧭 Managing content

Everything editable lives under `/admin/`:

| Model | What it controls |
|---|---|
| **Site Settings** | Name, tagline, about text, email, socials, stats |
| **Projects** | Web app + design portfolio cards |
| **Certificates** | Achievements section |
| **Education** | Timeline entries |
| **Skills** | Core progress bars, tools grid, "currently learning" tags |
| **Contact Messages** | Inbox of form submissions |
| **Visitor Log** | Raw visit records (read-only) |
