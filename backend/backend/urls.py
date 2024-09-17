from django.contrib import admin
from django.urls import path, include
from api.views import UserListCreateView,CategoryListCreateView, AssetListCreateView, RequestListCreateView, AssignmentListCreateView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/", UserListCreateView.as_view(), name="user-list-create"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('api/categories/', CategoryListCreateView.as_view(), name='category-list-create'),
    path('api/assets/', AssetListCreateView.as_view(), name='asset-list-create'),
    path('api/requests/', RequestListCreateView.as_view(), name='request-list-create'),
    path('api/assignments/', AssignmentListCreateView.as_view(), name='assignment-list-create'),
]
