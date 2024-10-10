# ../../api/views.py

from rest_framework import viewsets
from ..models import Assignment
from ..serializers import AssignmentSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import permissions

class AssignmentViewSet(viewsets.ModelViewSet):

    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated]
