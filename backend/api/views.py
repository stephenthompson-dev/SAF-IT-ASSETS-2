from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer,AssetSerializer, CategorySerializer, AssignmentSerializer, RequestSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Asset, Category, Request, Assignment
# Create your views here.

# === UserView Region ===

class UserListCreateView(generics.ListCreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        user = serializer.save()
        # Assign admin privileges if needed, e.g., based on request data or conditions
        is_superuser = self.request.data.get('is_superuser', False)
        is_staff = self.request.data.get('is_staff', False)
        if is_superuser:
            user.is_superuser = True
        if is_staff:
            user.is_staff = True
        user.save()

# === AssetView Region ===

class AssetListCreateView(generics.ListCreateAPIView):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated] 

# === CategoryView Region ===

class CategoryListCreateView(generics.ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

# === RequestView Region ===

class RequestListCreateView(generics.ListCreateAPIView):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Restrict the queryset to only the requests created by the current user
        return Request.objects.filter(user=self.request.user)

# === AssignmentView Region ===

class AssignmentListCreateView(generics.ListCreateAPIView):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]