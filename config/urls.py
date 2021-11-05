from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path('admin/', admin.site.urls),
    path('tart/', include('tart.urls')),
    path('api/tart/', include('tart_api.urls')),
    path('', include('accounts.urls'),),
    path('', include('allauth.urls')),
    path('', include('tatter.urls')),
]
