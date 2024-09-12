from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Asset

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "password"]
        extra_kwargs = {
            "password": {"write_only": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
class AssetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asset
        fields = ["id", "asset_name", "category_id", "purchase_date", "warrenty_end"]
        extra_kwargs = {"category": {"read_only": True}}