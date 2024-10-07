from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import UserViewSet, CategoryViewSet, AssetViewSet, RequestViewSet, AssignmentViewSet, AuthViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Create a router and register the viewsets
router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'assets', AssetViewSet, basename='asset')
router.register(r'requests', RequestViewSet, basename='request')
router.register(r'assignments', AssignmentViewSet, basename='assignment')
router.register(r'auth', AuthViewSet, basename='auth')


urlpatterns = [
    path('', include(router.urls)),
    
    path('admin/', admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
]
