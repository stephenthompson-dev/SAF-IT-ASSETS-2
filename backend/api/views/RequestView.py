from django.contrib.auth.models import User
from rest_framework import viewsets
from ..serializers import RequestSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..models import Request

class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Restrict the queryset to only the requests created by the current user
        return Request.objects.filter(user=self.request.user)
    