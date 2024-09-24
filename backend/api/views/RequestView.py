from django.contrib.auth.models import User
from rest_framework import viewsets,status
from ..serializers import RequestSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..models import Request
from rest_framework.decorators import action
from rest_framework.response import Response

class RequestViewSet(viewsets.ModelViewSet):
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated]


    