from django.core.management.base import BaseCommand
from core.models import SiteSettings, Skill, Education, Project


class Command(BaseCommand):
    help = "Seed the database with Sanjaya Kandel's initial portfolio content."

    def handle(self, *args, **options):
        site = SiteSettings.load()
        site.full_name = "Sanjaya Kandel"
        site.tagline = "Full Stack Web Developer & UI/UX Designer"
        site.about_text = (
            "I'm Sanjaya Kandel — a Full Stack Web Developer, UI/UX Designer, and AI "
            "Enthusiast from Nepal. I work across product thinking, interface design, "
            "front-end implementation, backend APIs, and AI-assisted workflows.\n\n"
            "I turn ideas into usable websites and applications: clean layouts, "
            "responsive experiences, API-backed features, and visual systems that feel "
            "personal without becoming hard to maintain."
        )
        site.email = "kandelsanjaya7@gmail.com"
        site.location = "Nepal"
        site.github_url = "https://github.com/kandelsanjaya"
        site.youtube_url = "https://youtube.com/@kandelsanjaya6613"
        site.tiktok_url = "https://www.tiktok.com/@sanjaya_013"
        site.projects_completed = 5
        site.years_experience = 2
        site.client_satisfaction = 100
        site.save()
        self.stdout.write(self.style.SUCCESS("Site settings updated."))

        core_skills = [
            ("HTML / CSS", "fab fa-html5", 90),
            ("JavaScript", "fab fa-js-square", 80),
            ("Python", "fab fa-python", 75),
            ("Django / Flask", "fas fa-layer-group", 65),
            ("React", "fab fa-react", 55),
        ]
        for i, (name, icon, pct) in enumerate(core_skills):
            Skill.objects.update_or_create(
                name=name, category="core",
                defaults={"icon_class": icon, "percentage": pct, "order": i},
            )

        tools = [
            ("Git / GitHub", "fab fa-git-alt"),
            ("SQLite / MySQL", "fas fa-database"),
            ("REST APIs", "fas fa-server"),
            ("Node.js", "fab fa-node-js"),
            ("Adobe XD", "fas fa-paint-brush"),
            ("Photoshop", "fas fa-camera"),
            ("Video Editing", "fas fa-film"),
            ("AI Tools", "fas fa-robot"),
        ]
        for i, (name, icon) in enumerate(tools):
            Skill.objects.update_or_create(
                name=name, category="tool", defaults={"icon_class": icon, "order": i}
            )

        learning = [
            ("React Advanced", "fab fa-react"),
            ("AI Integrations", "fas fa-robot"),
            ("System Design", "fas fa-server"),
            ("Cloud Deployment", "fas fa-cloud"),
            ("Web Security", "fas fa-lock"),
            ("TypeScript", "fas fa-laptop-code"),
            ("PostgreSQL", "fas fa-database"),
            ("PWA / Mobile", "fas fa-mobile-alt"),
        ]
        for i, (name, icon) in enumerate(learning):
            Skill.objects.update_or_create(
                name=name, category="learning", defaults={"icon_class": icon, "order": i}
            )
        self.stdout.write(self.style.SUCCESS("Skills seeded."))

        education_rows = [
            dict(period="2023 - Present", status="pursuing",
                 title="Bachelor of Science in CSIT (BSc. CSIT)",
                 subtitle="Tribhuvan University (TU) Affiliated",
                 institution="Bharatpur, Nepal — 4th Semester",
                 skills_learned="Programming Fundamentals, Data Structures & Algorithms, Database Management, Web Development, Networking",
                 icon_class="fas fa-graduation-cap", order=0),
            dict(period="2022 - 2023", status="completed",
                 title="Higher Secondary — Science (10+2)", subtitle="12th Grade — Science Stream",
                 institution="Janak Secondary School, Gaindakot",
                 skills_learned="Computer Science, Mathematics, Physics",
                 icon_class="fas fa-laptop-code", order=1),
            dict(period="2021 - 2022", status="completed",
                 title="Higher Secondary — Science (10+2)", subtitle="11th Grade — Science Stream",
                 institution="Janak Secondary School, Gaindakot",
                 skills_learned="Computer Science, Mathematics, Physics",
                 icon_class="fas fa-school", order=2),
            dict(period="2021", status="completed",
                 title="SEE (Secondary Education Examination)", subtitle="10th Grade",
                 institution="Janak Secondary School, Gaindakot",
                 skills_learned="Computer Basics, Mathematics Foundation",
                 icon_class="fas fa-school", order=3),
            dict(period="2019", status="completed",
                 title="8th Grade — Basic Level", subtitle="Primary Education",
                 institution="Shree Bhimsen Secondary School, Baglung",
                 skills_learned="Computer Basics, Mathematics",
                 icon_class="fas fa-book", order=4),
        ]
        for row in education_rows:
            Education.objects.update_or_create(title=row["title"], period=row["period"], defaults=row)
        self.stdout.write(self.style.SUCCESS("Education seeded."))

        projects = [
            dict(title="Portfolio Website", category="web",
                 description="Personal portfolio built with Flask and Django, featuring integrated Claude AI for interactive experiences, dark/light theme, and SEO-optimized structure.",
                 live_url="https://portfolio.kandelsanjaya7.workers.dev",
                 features="Flask & Django Backend, Claude AI Integration, Dark / Light Theme, SEO Optimized",
                 status="completed", order=0),
            dict(title="Smart College ERP System", category="web",
                 description="Full-featured College ERP with role-based dashboards for Admin, Teacher, and Student — SaaS-style dark/light theming and multi-role access control.",
                 is_private=True,
                 features="Flask + SQLite, Role-Based Dashboards, SaaS-style Theming, Multi-Role Access",
                 status="completed", order=1),
            dict(title="X (Twitter) Clone", category="web",
                 description="Social networking platform inspired by X/Twitter with modern UI patterns, real-time feed, and user authentication system.",
                 features="Real-Time Feed, User Authentication, Modern UI Patterns, Full-Stack Architecture",
                 status="completed", order=2),
        ]
        for row in projects:
            Project.objects.update_or_create(title=row["title"], defaults=row)
        self.stdout.write(self.style.SUCCESS("Projects seeded."))

        self.stdout.write(self.style.SUCCESS(
            "\nDone! Upload your profile photo, project screenshots, certificate "
            "images, and design images from the admin panel to replace the "
            "generated placeholders."
        ))
