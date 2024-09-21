from django.contrib.auth.models import User
from rest_framework import viewsets
from ..serializers import AssetSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..models import Asset

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated]