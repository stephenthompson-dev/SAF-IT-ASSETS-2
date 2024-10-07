# views.py

from rest_framework import viewsets
from ..models import Category
from ..serializers import CategorySerializer
from ..permissions import IsAdminOrReadOnly
from rest_framework.permissions import IsAuthenticated

class CategoryViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing category instances.
    """
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    # Optional: Add filtering, searching, and ordering
    # filterset_fields = ['category_name']
    # search_fields = ['category_name']
    # ordering_fields = ['category_name']
