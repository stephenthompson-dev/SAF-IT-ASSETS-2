from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ["id", "username", "first_name", "last_name", "email", "password1", "password2", "is_superuser"]
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
            "email": {"required": True},
            "is_superuser": {'required': False}
        }

    def validate(self, data):
        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError("Username already exists")
        
        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("Email already exists")

        if data['password1'] != data['password2']:
            raise serializers.ValidationError("Passwords do not match")

        return data

    def create(self, validated_data):
        password1 = validated_data.pop('password1')  # Remove password1
        validated_data.pop('password2')  # Remove password2 as it’s not needed

        user = User.objects.create_user(**validated_data)
        user.set_password(password1)  # Hash the password
        user.save()

        return user
