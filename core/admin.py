from django.contrib import admin
from django.contrib.admin import AdminSite
from django.urls import path
from django.shortcuts import render
from django.utils import timezone
from django.utils.html import format_html, mark_safe
from datetime import timedelta

from .models import (
    SiteVisit, Skill, Education, Certificate, Project,
    ContactMessage, SiteSettings, Document,
)


class PortfolioAdminSite(AdminSite):
    site_header = "Sanjaya Kandel — Portfolio Admin"
    site_title = "Portfolio Admin"
    index_title = "Dashboard"
    index_template = "admin/custom_index.html"
    login_template = "admin/login.html"

    def logout(self, request, extra_context=None):
        from django.contrib.auth import logout
        from django.shortcuts import redirect
        logout(request)
        return redirect("portfolio_admin:login")

    def get_urls(self):
        urls = super().get_urls()
        custom = [
            path("visitor-stats/", self.admin_view(self.visitor_stats), name="visitor-stats"),
            path("messages-inbox/", self.admin_view(self.messages_inbox), name="messages-inbox"),
        ]
        return custom + urls

    def each_context(self, request):
        context = super().each_context(request)
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)
        week_start = today_start - timedelta(days=7)

        context["visitor_total"] = SiteVisit.objects.count()
        context["visitor_today"] = SiteVisit.objects.filter(visited_at__gte=today_start).count()
        context["visitor_week"] = SiteVisit.objects.filter(visited_at__gte=week_start).count()
        context["visitor_month"] = SiteVisit.objects.filter(visited_at__gte=month_start).count()
        context["visitor_year"] = SiteVisit.objects.filter(visited_at__gte=year_start).count()

        context["unread_messages"] = ContactMessage.objects.filter(is_read=False).count()
        context["recent_messages"] = ContactMessage.objects.order_by("-created_at")[:5]
        context["document_count"] = Document.objects.count()

        # 14-day chart for dashboard
        days = []
        for i in range(13, -1, -1):
            day = (now - timedelta(days=i)).date()
            count = SiteVisit.objects.filter(visited_at__date=day).count()
            days.append({"date": day.strftime("%b %d"), "count": count})
        context["days"] = days
        context["max_count"] = max([d["count"] for d in days] + [1])
        return context

    def visitor_stats(self, request):
        from django.db.models import Count
        now = timezone.now()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday_date = (now - timedelta(days=1)).date()
        month_start = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        year_start = now.replace(month=1, day=1, hour=0, minute=0, second=0, microsecond=0)

        visitor_total = SiteVisit.objects.count()
        visitor_today = SiteVisit.objects.filter(visited_at__gte=today_start).count()
        visitor_yesterday = SiteVisit.objects.filter(visited_at__date=yesterday_date).count()
        visitor_month = SiteVisit.objects.filter(visited_at__gte=month_start).count()
        visitor_year = SiteVisit.objects.filter(visited_at__gte=year_start).count()

        unique_ips_total = SiteVisit.objects.values("ip_address").distinct().count()
        unique_ips_today = SiteVisit.objects.filter(visited_at__gte=today_start).values("ip_address").distinct().count()
        unique_ips_month = SiteVisit.objects.filter(visited_at__gte=month_start).values("ip_address").distinct().count()
        unique_ips_year = SiteVisit.objects.filter(visited_at__gte=year_start).values("ip_address").distinct().count()

        # 30-day daily trend
        days_30 = []
        for i in range(29, -1, -1):
            day = (now - timedelta(days=i)).date()
            count = SiteVisit.objects.filter(visited_at__date=day).count()
            days_30.append({"date": day.strftime("%b %d"), "count": count})

        # 12-month monthly trend
        monthly_trend = []
        for i in range(11, -1, -1):
            # Calculate month year
            m_date = now - timedelta(days=i*30)
            cnt = SiteVisit.objects.filter(
                visited_at__year=m_date.year,
                visited_at__month=m_date.month
            ).count()
            monthly_trend.append({"month": m_date.strftime("%b %Y"), "count": cnt})

        # 5-year yearly trend
        yearly_trend = []
        current_yr = now.year
        for yr in range(current_yr - 4, current_yr + 1):
            cnt = SiteVisit.objects.filter(visited_at__year=yr).count()
            yearly_trend.append({"year": str(yr), "count": cnt})

        # Top pages
        top_pages = (
            SiteVisit.objects.values("path")
            .annotate(visits=Count("id"))
            .order_by("-visits")[:8]
        )

        # Hourly heatmap (0-23)
        hourly = []
        for h in range(24):
            cnt = SiteVisit.objects.filter(visited_at__hour=h).count()
            hourly.append({"hour": f"{h:02d}:00", "count": cnt})

        # Browser & Device breakdown
        all_agents = SiteVisit.objects.values_list("user_agent", flat=True)
        browser_counts = {"Chrome": 0, "Firefox": 0, "Edge": 0, "Safari": 0, "Other": 0}
        device_counts = {"Desktop": 0, "Mobile": 0, "Tablet": 0}
        for ua in all_agents:
            ua_lower = ua.lower()
            if "edg/" in ua_lower or "edge" in ua_lower:
                browser_counts["Edge"] += 1
            elif "chrome" in ua_lower:
                browser_counts["Chrome"] += 1
            elif "firefox" in ua_lower:
                browser_counts["Firefox"] += 1
            elif "safari" in ua_lower:
                browser_counts["Safari"] += 1
            else:
                browser_counts["Other"] += 1
            if "mobile" in ua_lower or "android" in ua_lower:
                device_counts["Mobile"] += 1
            elif "tablet" in ua_lower or "ipad" in ua_lower:
                device_counts["Tablet"] += 1
            else:
                device_counts["Desktop"] += 1

        total = visitor_total or 1
        browser_pct = {k: round(v / total * 100) for k, v in browser_counts.items()}
        device_pct = {k: round(v / total * 100) for k, v in device_counts.items()}

        context = {
            **self.each_context(request),
            "title": "Visitor Analytics",
            "visitor_total": visitor_total,
            "visitor_today": visitor_today,
            "visitor_yesterday": visitor_yesterday,
            "visitor_month": visitor_month,
            "visitor_year": visitor_year,
            "unique_ips_total": unique_ips_total,
            "unique_ips_today": unique_ips_today,
            "unique_ips_month": unique_ips_month,
            "unique_ips_year": unique_ips_year,
            "days_30": days_30,
            "monthly_trend": monthly_trend,
            "yearly_trend": yearly_trend,
            "max_count_30": max([d["count"] for d in days_30] + [1]),
            "max_monthly": max([m["count"] for m in monthly_trend] + [1]),
            "max_yearly": max([y["count"] for y in yearly_trend] + [1]),
            "recent_visits": SiteVisit.objects.all()[:100],
            "top_pages": top_pages,
            "hourly": hourly,
            "max_hourly": max([h["count"] for h in hourly] + [1]),
            "browser_pct": browser_pct,
            "device_pct": device_pct,
        }
        return render(request, "admin/visitor_stats.html", context)

    def messages_inbox(self, request):
        if "mark_read" in request.GET:
            ContactMessage.objects.filter(pk=request.GET["mark_read"]).update(is_read=True)
        elif "mark_unread" in request.GET:
            ContactMessage.objects.filter(pk=request.GET["mark_unread"]).update(is_read=False)
        elif "delete" in request.GET:
            ContactMessage.objects.filter(pk=request.GET["delete"]).delete()

        msg_filter = request.GET.get("filter", "all")
        messages = ContactMessage.objects.all()
        if msg_filter == "unread":
            messages = messages.filter(is_read=False)

        context = {
            **self.each_context(request),
            "title": "Messages Inbox",
            "messages_list": messages,
            "filter": msg_filter,
            "unread_count": ContactMessage.objects.filter(is_read=False).count()
        }
        return render(request, "admin/messages_inbox.html", context)


portfolio_admin_site = PortfolioAdminSite(name="portfolio_admin")


@admin.register(Document, site=portfolio_admin_site)
class DocumentAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "file_link", "video_link", "uploaded_at", "order")
    list_filter = ("category", "uploaded_at")
    search_fields = ("title", "description")
    list_editable = ("order",)
    readonly_fields = ("file_preview", "video_preview", "uploaded_at")

    def file_link(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank" style="color:var(--accent);font-weight:600;">📥 View File</a>', obj.file.url)
        return "No file"
    file_link.short_description = "Document Link"

    def video_link(self, obj):
        url = obj.get_video_url
        if url:
            return format_html('<a href="{}" target="_blank" style="color:#00f3ff;font-weight:600;">🎬 Watch Video</a>', url)
        return "No video"
    video_link.short_description = "Video Demo"

    def file_preview(self, obj):
        if obj.file:
            return format_html('<a href="{}" target="_blank" style="display:inline-block;padding:8px 18px;background:var(--accent-btn);color:#fff!important;border-radius:8px;text-decoration:none;font-weight:600;">🔗 Open Uploaded Document</a>', obj.file.url)
        return "No document uploaded yet"
    file_preview.short_description = "Uploaded Document Preview"

    def video_preview(self, obj):
        url = obj.get_video_url
        if url:
            if obj.video_file:
                return format_html(
                    '<video src="{}" controls style="max-width:320px; border-radius:10px; border:2px solid #00f3ff;"></video>',
                    url
                )
            return format_html('<a href="{}" target="_blank" style="color:#00f3ff;font-weight:700;">🔗 Open External Video Link</a>', url)
        return "No video uploaded/linked"
    video_preview.short_description = "Video Preview"


@admin.register(SiteVisit, site=portfolio_admin_site)
class SiteVisitAdmin(admin.ModelAdmin):
    list_display = ("ip_address", "path", "visited_at")
    list_filter = ("visited_at",)
    search_fields = ("ip_address", "path", "user_agent")
    readonly_fields = [f.name for f in SiteVisit._meta.fields]

    def has_add_permission(self, request):
        return False


@admin.register(Skill, site=portfolio_admin_site)
class SkillAdmin(admin.ModelAdmin):
    list_display = ("name", "category", "percentage", "order")
    list_editable = ("percentage", "order")
    list_filter = ("category",)


@admin.register(Education, site=portfolio_admin_site)
class EducationAdmin(admin.ModelAdmin):
    list_display = ("title", "period", "status", "institution", "order")
    list_editable = ("order",)
    list_filter = ("status",)


@admin.register(Certificate, site=portfolio_admin_site)
class CertificateAdmin(admin.ModelAdmin):
    list_display = ("title", "provider", "date_text", "file_link", "order")
    list_editable = ("order",)

    def file_link(self, obj):
        if obj.image:
            return format_html('<a href="{}" target="_blank" style="color:var(--accent);font-weight:600;">🖼️ View Certificate</a>', obj.image_url)
        return "Default"
    file_link.short_description = "Certificate Image"


@admin.register(Project, site=portfolio_admin_site)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ("title", "category", "status", "featured", "file_link", "video_link", "order")
    list_editable = ("order", "featured")
    list_filter = ("category", "status", "featured")
    search_fields = ("title", "description")
    readonly_fields = ("video_preview",)

    def file_link(self, obj):
        if obj.image:
            return format_html('<a href="{}" target="_blank" style="color:var(--accent);font-weight:600;">🖼️ View Image</a>', obj.image_url)
        return "Default"
    file_link.short_description = "Project Image"

    def video_link(self, obj):
        url = obj.get_video_url
        if url:
            return format_html('<a href="{}" target="_blank" style="color:#00f3ff;font-weight:600;">🎬 Watch Video</a>', url)
        return "None"
    video_link.short_description = "Video Demo"

    def video_preview(self, obj):
        url = obj.get_video_url
        if url:
            if obj.video_file:
                return format_html(
                    '<video src="{}" controls style="max-width:320px; border-radius:10px; border:2px solid #00f3ff;"></video>',
                    url
                )
            return format_html('<a href="{}" target="_blank" style="color:#00f3ff;font-weight:700;">🔗 Open External Video Link</a>', url)
        return "No video attached"
    video_preview.short_description = "Video Preview"


@admin.register(ContactMessage, site=portfolio_admin_site)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ("name", "email", "created_at", "is_read")
    list_filter = ("is_read", "created_at")
    search_fields = ("name", "email", "message")
    list_editable = ("is_read",)
    readonly_fields = ("name", "email", "message", "created_at")


@admin.register(SiteSettings, site=portfolio_admin_site)
class SiteSettingsAdmin(admin.ModelAdmin):
    readonly_fields = ("profile_photo_preview", "cv_file_preview", "hero_video_preview")

    fieldsets = (
        ("👤 Profile Photo", {
            "fields": ("profile_photo", "profile_photo_preview"),
            "description": "Upload or change your featured hero photo shown on the homepage and CV."
        }),
        ("🎬 Intro Showcase Video", {
            "fields": ("hero_video", "hero_video_url", "hero_video_preview"),
            "description": "Upload or link an intro showcase video for your portfolio."
        }),
        ("✏️ Basic Info", {
            "fields": ("full_name", "tagline", "about_text"),
        }),
        ("📞 Contact Details", {
            "fields": ("email", "phone", "whatsapp_link", "location"),
        }),
        ("🔗 Social Links", {
            "fields": ("github_url", "youtube_url", "tiktok_url"),
        }),
        ("📊 Stats", {
            "fields": ("projects_completed", "years_experience", "client_satisfaction"),
        }),
        ("📄 CV & Resume", {
            "fields": ("cv_file", "cv_file_preview", "cv_url"),
            "description": "Upload your CV/Resume PDF or document here. Uploaded file takes priority over cv_url."
        }),
    )

    def profile_photo_preview(self, obj):
        if obj.profile_photo:
            return format_html(
                '<img src="{}" style="max-height:200px; max-width:200px; border-radius:12px; '
                'border:3px solid #00ff88; box-shadow:0 4px 20px rgba(0,255,136,0.3);" />',
                obj.profile_photo.url
            )
        return mark_safe(
            '<span style="color:#888;">No photo uploaded yet. Upload a photo above to set your featured hero image.</span>'
        )
    profile_photo_preview.short_description = "Current Photo Preview"

    def cv_file_preview(self, obj):
        if obj.cv_file:
            return format_html(
                '<a href="{}" target="_blank" style="display:inline-block; padding:8px 16px; '
                'background:var(--accent-btn); color:#fff!important; border-radius:8px; text-decoration:none; font-weight:600;">'
                '📄 View / Download Current CV File</a>',
                obj.cv_file.url
            )
        return mark_safe(
            '<span style="color:#888;">No CV file uploaded yet. Upload a PDF/document above or use CV URL.</span>'
        )
    cv_file_preview.short_description = "Current CV File Preview"

    def hero_video_preview(self, obj):
        url = obj.get_hero_video_url
        if url:
            if obj.hero_video:
                return format_html(
                    '<video src="{}" controls style="max-width:320px; border-radius:10px; border:2px solid #00f3ff;"></video>',
                    url
                )
            return format_html('<a href="{}" target="_blank" style="color:#00f3ff;font-weight:700;">🔗 Open External Video Link</a>', url)
        return mark_safe('<span style="color:#888;">No hero intro video uploaded or linked yet.</span>')
    hero_video_preview.short_description = "Hero Video Preview"

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


