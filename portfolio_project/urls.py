from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include

from core.admin import portfolio_admin_site

urlpatterns = [
    path('admin/', portfolio_admin_site.urls),
    path('', include('core.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
