from rest_framework import serializers
from ..models import Request, Asset
from django.contrib.auth.models import User

class RequestSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()  # To display the username
    asset = serializers.StringRelatedField()  # To display the asset name

    class Meta:
        model = Request
        fields = ['id', 'user', 'asset', 'for_date', 'end_date', 'further_notice', 'approved', 'approved_date', 'approved_by']
