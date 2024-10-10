# ../../api/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Assignment, Request, Asset

class AssignmentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)       # Displays the username
    asset = serializers.StringRelatedField(read_only=True)     # Displays the asset name
    request = serializers.StringRelatedField(read_only=True)   # Displays the request details

    class Meta:
        model = Assignment
        fields = ['id', 'user', 'asset', 'request', 'assignment_date', 'return_date', 'returned']
        read_only_fields = ['id', 'user', 'asset', 'request', 'assignment_date', 'return_date'] # Make all fields read-only
