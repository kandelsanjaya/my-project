from django.db import models
from django.utils import timezone


class SiteVisit(models.Model):
    """Logs a single page visit — powers the admin visitor counter."""
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.CharField(max_length=300, blank=True)
    path = models.CharField(max_length=300, blank=True)
    session_key = models.CharField(max_length=60, blank=True, db_index=True)
    visited_at = models.DateTimeField(default=timezone.now, db_index=True)

    class Meta:
        ordering = ["-visited_at"]
        verbose_name = "Site Visit"
        verbose_name_plural = "Visitor Log"

    def __str__(self):
        return f"{self.ip_address or 'unknown'} @ {self.visited_at:%Y-%m-%d %H:%M}"


class Skill(models.Model):
    CATEGORY_CHOICES = [
        ("core", "Core Technology (progress bar)"),
        ("tool", "Tool / Technology"),
        ("learning", "Currently Learning"),
    ]
    name = models.CharField(max_length=80)
    icon_class = models.CharField(max_length=80, help_text="Font Awesome class, e.g. fab fa-python")
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default="tool")
    percentage = models.PositiveSmallIntegerField(default=0, help_text="Only used for Core Technology (0-100)")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class Education(models.Model):
    STATUS_CHOICES = [("pursuing", "Pursuing"), ("completed", "Completed")]
    period = models.CharField(max_length=60)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="completed")
    title = models.CharField(max_length=150)
    subtitle = models.CharField(max_length=150, blank=True)
    institution = models.CharField(max_length=200)
    skills_learned = models.CharField(max_length=400, blank=True, help_text="Comma-separated list")
    icon_class = models.CharField(max_length=80, default="fas fa-graduation-cap")
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def skills_list(self):
        return [s.strip() for s in self.skills_learned.split(",") if s.strip()]

    def __str__(self):
        return self.title


class Certificate(models.Model):
    title = models.CharField(max_length=150)
    provider = models.CharField(max_length=150, blank=True)
    date_text = models.CharField(max_length=80, blank=True)
    image = models.ImageField(upload_to="certificates/")
    # Static image path for production (used with {% static %})
    @property
    def static_image(self):
        """Path relative to STATICFILES_DIRS for this certificate image."""
        if not self.image:
            return ''
        filename = self.image.name.split('/')[-1]
        return f'core/images/certificates/{filename}'

    @property
    def image_url(self):
        if self.image:
            return self.image.url
        return f'/static/{self.static_image}'

    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ["order"]

    def __str__(self):
        return self.title


class Project(models.Model):
    CATEGORY_CHOICES = [("web", "Web Application"), ("design", "Design")]
    STATUS_CHOICES = [
        ("completed", "Completed"),
        ("in_progress", "In Progress"),
        ("private", "Private"),
    ]
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=10, choices=CATEGORY_CHOICES, default="web")
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="projects/", blank=True, null=True)
    @property
    def static_image(self):
        if not self.image:
            return None
        filename = self.image.name.split('/')[-1]
        return f'core/images/projects/{filename}'

    @property
    def image_url(self):
        if self.image:
            return self.image.url
        if self.static_image:
            return f'/static/{self.static_image}'
        return None

    live_url = models.URLField(blank=True)
    video_file = models.FileField(
        upload_to="projects/videos/",
        blank=True,
        null=True,
        help_text="Upload demo video (MP4/WebM) for this project"
    )
    video_url = models.URLField(
        blank=True,
        help_text="Or paste external video link (YouTube, Vimeo, or MP4 URL)"
    )

    @property
    def get_video_url(self):
        if self.video_file:
            return self.video_file.url
        return self.video_url or None

    is_private = models.BooleanField(default=False)
    features = models.CharField(max_length=400, blank=True, help_text="Comma-separated, shown with check icons")
    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default="completed")
    order = models.PositiveSmallIntegerField(default=0)
    featured = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "-id"]

    def features_list(self):
        return [f.strip() for f in self.features.split(",") if f.strip()]

    def __str__(self):
        return self.title


class Document(models.Model):
    CATEGORY_CHOICES = [
        ("cv", "CV / Resume"),
        ("certificate", "Certificate / Diploma"),
        ("transcript", "Academic Transcript"),
        ("project", "Project Document"),
        ("video", "Video Showcase"),
        ("other", "Other Document"),
    ]
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default="cv")
    file = models.FileField(upload_to="documents/", help_text="Upload your PDF, DOCX, or image document")
    video_file = models.FileField(
        upload_to="documents/videos/",
        blank=True,
        null=True,
        help_text="Upload optional video file for this document"
    )
    video_url = models.URLField(
        blank=True,
        help_text="Or paste external video link"
    )
    description = models.TextField(blank=True, help_text="Optional document details or notes")
    uploaded_at = models.DateTimeField(default=timezone.now)
    order = models.PositiveSmallIntegerField(default=0)

    @property
    def get_video_url(self):
        if self.video_file:
            return self.video_file.url
        return self.video_url or None

    class Meta:
        ordering = ["order", "-uploaded_at"]
        verbose_name = "Uploaded Document"
        verbose_name_plural = "Uploaded Documents"

    def __str__(self):
        return f"{self.title} ({self.get_category_display()})"


class ContactMessage(models.Model):
    name = models.CharField(max_length=120)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(default=timezone.now)
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} <{self.email}>"


class SiteSettings(models.Model):
    """Singleton-style model holding editable site-wide content."""
    full_name = models.CharField(max_length=120, default="Sanjaya Kandel")
    tagline = models.CharField(max_length=200, default="Full Stack Web Developer & UI/UX Designer")
    about_text = models.TextField(blank=True)
    profile_photo = models.ImageField(
        upload_to="profile/",
        blank=True,
        null=True,
        help_text="Upload your featured hero/profile photo here. Replaces the default photo on the homepage."
    )
    hero_video = models.FileField(
        upload_to="profile/videos/",
        blank=True,
        null=True,
        help_text="Upload your intro/showcase video (MP4/WebM)"
    )
    hero_video_url = models.URLField(
        blank=True,
        help_text="Or paste video URL for intro showcase"
    )
    email = models.EmailField(default="kandelsanjaya7@gmail.com")
    phone = models.CharField(max_length=40, blank=True)
    whatsapp_link = models.URLField(blank=True)
    location = models.CharField(max_length=100, default="Nepal")
    github_url = models.URLField(blank=True)
    youtube_url = models.URLField(blank=True)
    tiktok_url = models.URLField(blank=True)
    cv_url = models.CharField(max_length=300, blank=True, help_text="External URL to your CV (if no file uploaded)")
    cv_file = models.FileField(
        upload_to="documents/",
        blank=True,
        null=True,
        help_text="Upload your CV/Resume PDF or document here. Takes priority over cv_url."
    )
    projects_completed = models.PositiveSmallIntegerField(default=5)
    years_experience = models.PositiveSmallIntegerField(default=2)
    client_satisfaction = models.PositiveSmallIntegerField(default=100)

    @property
    def get_hero_video_url(self):
        if self.hero_video:
            return self.hero_video.url
        return self.hero_video_url or None

    class Meta:
        verbose_name = "Site Setting"
        verbose_name_plural = "Site Settings"

    def __str__(self):
        return "Site Settings"

    def save(self, *args, **kwargs):
        self.pk = 1
        super().save(*args, **kwargs)

    @classmethod
    def load(cls):
        obj, _ = cls.objects.get_or_create(pk=1)
        return obj


