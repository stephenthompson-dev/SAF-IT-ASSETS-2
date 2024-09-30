from django.contrib.auth.models import User
from rest_framework import viewsets, status
from ..serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.decorators import action
from rest_framework.response import Response


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated, IsAdminUser]
    
    @action(detail=False, methods=['post'], url_path='create-user')
    def create_user_action(self, request):
        """
            Custom action to create a user.
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Assign admin privileges if provided in the request
            is_superuser = request.data.get('is_superuser', False)
            is_staff = request.data.get('is_staff', False)
            if is_superuser:
                user.is_superuser = True
                user.is_staff = True
            user.save()

            return Response({'status': 'user created'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    action(detail=True, methods=['POST'], url_path='update-user')
    def update_user_action(self, request, pk):
        """
            Update action to update user
        """
        
        return Response({'status': 'user updated'}, status=status.HTTP_200_OK)