from django.contrib.auth.models import User
from rest_framework import viewsets, status
from ..serializers import RequestSerializer
from rest_framework.permissions import IsAuthenticated
from ..models import Request
from rest_framework.decorators import action
from rest_framework.response import Response

class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'], url_path='create-request')
    def create_request_action(self, request):
        """
            Custom action to create a request.
        """
        # Create a dictionary with the request data and the current user
        data = request.data.copy()  # Use copy to avoid modifying the original request data
        data['user'] = request.user.id  # Assign the current user's ID

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            request_instance = serializer.save()  # Save the instance with the user field set
            return Response({'status': 'request created'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
