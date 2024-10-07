from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import Request, Assignment, Asset
from ..serializers import RequestSerializer, AssignmentSerializer
from ..permissions import IsAdminOrReadOnly
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

class RequestViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing request instances.
    """
    queryset = Request.objects.all()
    serializer_class = RequestSerializer
    permission_classes = [IsAuthenticated, IsAdminOrReadOnly]

    def perform_create(self, serializer):
        # The 'user' field is set in the serializer's create method
        serializer.save()

    def perform_update(self, serializer):
        previous_instance = self.get_object()
        previous_approved = previous_instance.approved
        instance = serializer.save()

        # Check if 'approved' has been changed to True
        if not previous_approved and instance.approved:
            # Prevent admins from approving their own requests
            if instance.user == self.request.user:
                # Revert the approval
                instance.approved = False
                instance.save()
                raise serializer.ValidationError("You cannot approve your own request.")

            # Create an Assignment
            Assignment.objects.create(
                user=instance.user,
                asset=instance.asset,
                request=instance,
                assignment_date=timezone.now().date(),
                return_date=instance.end_date,
                returned=False
            )