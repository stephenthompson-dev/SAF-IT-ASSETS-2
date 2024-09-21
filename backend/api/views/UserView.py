from django.contrib.auth.models import User
from rest_framework import viewsets
from ..serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]

    def perform_create(self, serializer):
        user = serializer.save()
        # Assign admin privileges if needed
        is_superuser = self.request.data.get('is_superuser', False)
        is_staff = self.request.data.get('is_staff', False)
        if is_superuser:
            user.is_superuser = True
        if is_staff:
            user.is_staff = True
        user.save()