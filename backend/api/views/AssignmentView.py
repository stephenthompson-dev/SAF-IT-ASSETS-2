# ../../api/views.py

from rest_framework import viewsets
from ..models import Assignment
from ..serializers import AssignmentSerializer
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import permissions

class ReadOnly(permissions.BasePermission):
    """
    Custom permission to allow only read operations.
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS and request.user and request.user.is_authenticated

class AssignmentViewSet(viewsets.ReadOnlyModelViewSet):
    """
    A viewset for viewing assignment instances.
    """
    queryset = Assignment.objects.all()
    serializer_class = AssignmentSerializer
    permission_classes = [IsAuthenticated, ReadOnly]
