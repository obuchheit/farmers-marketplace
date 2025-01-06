"""
URL configuration for marketplace_proj project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from django.conf.urls.static import static
from .settings import MEDIA_URL, MEDIA_ROOT
from django.contrib import admin
from .views import MapboxTokenView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/users/', include('user_app.urls')),
    path('api/v1/posts/', include('post_app.urls')),
    path('api/v1/groups/', include('group_app.urls')),
    path('api/v1/map/', include('map_app.urls')),
    path('api/v1/garden/', include('garden_app.urls')),
    path('api/v1/get-all-data/', include('static.api.urls')),
    path('api/v1/searchfarms/', include('searchfarms_app.urls')),
    # path('api/vi/chat/', include("chat_app.routing")),
    path("mapbox-token/", MapboxTokenView.as_view(), name="mapbox-token"),
] + static(MEDIA_URL, document_root=MEDIA_ROOT)

