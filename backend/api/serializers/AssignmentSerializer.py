from rest_framework import serializers
from ..models import Assignment

class AssignmentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # To display the username
    asset = serializers.StringRelatedField()  # To display the asset name
    request = serializers.StringRelatedField()  # To display the request details

    class Meta:
        model = Assignment
        fields = ['id', 'user', 'asset', 'request', 'assignment_date', 'return_date', 'returned']
