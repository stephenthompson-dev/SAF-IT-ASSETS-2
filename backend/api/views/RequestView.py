from django.contrib.auth.models import User
from rest_framework import viewsets, status
from ..serializers import RequestSerializer
from rest_framework.permissions import IsAuthenticated
from ..models import Request
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from datetime import date

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
        data['user'] = request.user  # Assign the current user instance

        serializer = self.get_serializer(data=data)
        if serializer.is_valid():
            request_instance = serializer.save(user=request.user)  # Pass the user when saving
            return Response({'status': 'request created'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['put'], url_path='update-user')
    def update_request_action(self, request, pk=None):
        """
        
        """
        dRequest = get_object_or_404(Request, pk=pk)

        #checking to see if approved flag is updated
        approved_update = request.data.get('approved')
        if approved_update is not None:
            if approved_update:
                data_copy = request.data.copy()
                data_copy ['approved_by'] = request.user
                data_copy ['approved_date'] = date.today()
                serializer = RequestSerializer(dRequest, data=data_copy, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return Response({'status': 'Request Updated'},status=status.HTTP_200_OK)
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = RequestSerializer(dRequest, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'Request Updated'},status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        


