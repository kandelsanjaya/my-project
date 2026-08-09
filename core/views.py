from django.shortcuts import render, redirect
from django.contrib import messages
from django.views.decorators.http import require_POST

from .models import (
    Project, Certificate, Education, Skill, SiteSettings, ContactMessage,
)


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
    name = request.POST.get("name", "").strip()
    email = request.POST.get("email", "").strip()
    message = request.POST.get("message", "").strip()

    if not name or not email or len(message) < 5:
        messages.error(request, "Please fill out all fields correctly.")
        return redirect("/#contact")

    ContactMessage.objects.create(name=name, email=email, message=message)
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
