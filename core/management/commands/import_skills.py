from django.core.management.base import BaseCommand
from core.models import Skill

class Command(BaseCommand):
    help = "Imports skills based on kandelsanjaya.com.np into the database."

    def handle(self, *args, **options):
        # 1. Core Skills
        core_skills = [
            {"name": "HTML/CSS", "percentage": 95, "order": 1},
            {"name": "JavaScript", "percentage": 90, "order": 2},
            {"name": "Python", "percentage": 88, "order": 3},
            {"name": "Django", "percentage": 85, "order": 4},
            {"name": "React", "percentage": 75, "order": 5},
        ]

        # 2. Tools
        tools = [
            {"name": "Git / GitHub", "percentage": 90, "order": 1},
            {"name": "Photoshop", "percentage": 85, "order": 2},
            {"name": "Adobe XD", "percentage": 80, "order": 3},
            {"name": "UI/UX Design", "percentage": 85, "order": 4},
            {"name": "Video Editing", "percentage": 80, "order": 5},
            {"name": "AI Tools", "percentage": 90, "order": 6},
            {"name": "Node.js", "percentage": 70, "order": 7},
            {"name": "Flask", "percentage": 75, "order": 8},
        ]

        # 3. Learning (Since none are listed on the live site, adding a few logical ones)
        learning = [
            {"name": "Docker & Containers", "percentage": 50, "order": 1},
            {"name": "Advanced Next.js", "percentage": 60, "order": 2},
            {"name": "Machine Learning", "percentage": 40, "order": 3},
        ]

        Skill.objects.all().delete()
        self.stdout.write("Deleted existing skills.")

        for skill in core_skills:
            Skill.objects.create(name=skill["name"], percentage=skill["percentage"], category="core", order=skill["order"])
        for skill in tools:
            Skill.objects.create(name=skill["name"], percentage=skill["percentage"], category="tool", order=skill["order"])
        for skill in learning:
            Skill.objects.create(name=skill["name"], percentage=skill["percentage"], category="learning", order=skill["order"])

        self.stdout.write(self.style.SUCCESS("Successfully imported all skills!"))
