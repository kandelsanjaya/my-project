from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_POST
from django.utils.html import escape
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.cache import cache

from .models import (
    Project, Certificate, Education, Skill, SiteSettings, ContactMessage,
)


def get_client_ip(request):
    """Retrieve real client IP address even behind proxy/Cloudflare."""
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip or '127.0.0.1'


def home(request):
    settings_obj = SiteSettings.load()
    context = {
        "site": settings_obj,
        "web_projects": Project.objects.filter(category="web", featured=True),
        "design_projects": Project.objects.filter(category="design"),
        "certificates": Certificate.objects.all(),
        "education": Education.objects.all(),
        "core_skills": Skill.objects.filter(category="core"),
        "tool_skills": Skill.objects.filter(category="tool"),
        "learning_skills": Skill.objects.filter(category="learning"),
        "projects_completed_count": Project.objects.filter(status="completed").count(),
    }
    return render(request, "core/index.html", context)


@require_POST
def contact_submit(request):
    # 1. IP Rate Limiting Security Check (Max 5 submissions per IP every 10 minutes)
    ip_addr = get_client_ip(request)
    cache_key = f"rate_limit_contact_{ip_addr}"
    submission_count = cache.get(cache_key, 0)

    if submission_count >= 5:
        messages.error(request, "Too many messages sent. Please wait a few minutes before trying again.")
        return redirect("/#contact")

    name = request.POST.get("name", "").strip()
    email = request.POST.get("email", "").strip()
    message = request.POST.get("message", "").strip()

    if not name or not email or len(message) < 5:
        messages.error(request, "Please fill out all fields correctly.")
        return redirect("/#contact")

    # 2. Email Format Validation
    try:
        validate_email(email)
    except ValidationError:
        messages.error(request, "Please provide a valid email address.")
        return redirect("/#contact")

    # 3. Sanitize inputs to prevent Stored / Reflected XSS Attacks
    clean_name = escape(name[:120])
    clean_email = escape(email[:150])
    clean_message = escape(message[:3000])

    ContactMessage.objects.create(name=clean_name, email=clean_email, message=clean_message)
    cache.set(cache_key, submission_count + 1, timeout=600)  # Rate limit window: 10 minutes

    messages.success(request, "Message sent successfully! Thank you for contacting me.")
    return redirect("/#contact")


def cv_view(request):
    settings_obj = SiteSettings.load()
    context = {
        "site": settings_obj,
        "education": Education.objects.all(),
        "core_skills": Skill.objects.filter(category="core"),
        "tool_skills": Skill.objects.filter(category="tool"),
        "projects": Project.objects.all(),
    }
    return render(request, "core/cv.html", context)
