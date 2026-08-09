from .models import SiteVisit


class VisitorTrackingMiddleware:
    """Logs one SiteVisit per session for real page views (skips admin, static, media, api)."""

    SKIP_PREFIXES = ("/admin", "/static", "/media", "/favicon")

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        try:
            path = request.path
            if (
                request.method == "GET"
                and response.status_code == 200
                and not path.startswith(self.SKIP_PREFIXES)
            ):
                if not request.session.session_key:
                    request.session.save()
                session_key = request.session.session_key or ""
                already_logged = request.session.get("visit_logged")
                if not already_logged:
                    SiteVisit.objects.create(
                        ip_address=self.get_client_ip(request),
                        user_agent=request.META.get("HTTP_USER_AGENT", "")[:300],
                        path=path,
                        session_key=session_key,
                    )
                    request.session["visit_logged"] = True
        except Exception:
            # Visitor tracking must never break the site.
            pass
        return response

    @staticmethod
    def get_client_ip(request):
        xff = request.META.get("HTTP_X_FORWARDED_FOR")
        if xff:
            return xff.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")
