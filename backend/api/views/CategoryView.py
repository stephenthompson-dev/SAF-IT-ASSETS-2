from django.contrib.auth.models import User
from rest_framework import viewsets,status
from ..serializers import CategorySerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..models import Category
from rest_framework.decorators import action
from rest_framework.response import Response


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='create-category')
    def create_category_action(self, request):
        """
            Custom action to create an asset.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            asset = serializer.save()
            # Add any additional logic for asset creation here
            # For example, set default values or assign relationships if needed
            asset.save()

            return Response({'status': 'category created'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
