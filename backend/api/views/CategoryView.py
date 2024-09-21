from django.contrib.auth.models import User
from rest_framework import viewsets
from ..serializers import CategorySerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..models import Category

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]