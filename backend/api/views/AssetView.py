# views.py

from rest_framework import viewsets
from ..models import Asset
from ..serializers import AssetSerializer
from ..permissions import IsAdminOrReadOnly
from rest_framework.permissions import IsAuthenticated

class AssetViewSet(viewsets.ModelViewSet):
    queryset = Asset.objects.all()
    serializer_class = AssetSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    # Optionally, you can add filtering, searching, and ordering here
    # For example:
    # filterset_fields = ['category']
    # search_fields = ['asset_name']
    # ordering_fields = ['purchase_date']
