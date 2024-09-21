from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "password", 'is_superuser']
        extra_kwargs = {
            "password": {"write_only": True},
            "first_name": {"required": True},
            "last_name": {"required": True},
            "email": {"required": True},
            'is_superuser': {'required': False}
        }
        
    def validate(self, data):
        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError("Username alaredy exists")
        
        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("email already exists")
    
    
    def create(self, validated_data):
        # Use create_user to hash password and create user
        user = User.objects.create_user(**validated_data)
        return user