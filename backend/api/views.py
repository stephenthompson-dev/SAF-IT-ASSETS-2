from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer,AssetSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Asset
# Create your views here.

class AssetListCreate(generics.ListCreateAPIView):
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
