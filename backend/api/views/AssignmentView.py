from django.contrib.auth.models import User
from rest_framework import viewsets
from ..serializers import AssignmentSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from ..models import Assignment

class AssignmentViewSet(viewsets.ModelViewSet):
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]