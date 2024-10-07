# serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=False)
    password2 = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = [
            "id", "username", "first_name", "last_name", "email",
            "password1", "password2", "is_superuser"
        ]
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
            "email": {"required": True},
            "is_superuser": {"required": False},
            "username": {"required": True},
        }

    def validate(self, data):
        if self.instance is None:
            # Create operation
            if User.objects.filter(username=data["username"]).exists():
                raise serializers.ValidationError({"username": ["Username already exists."]})
            if User.objects.filter(email=data["email"]).exists():
                raise serializers.ValidationError({"email": ["Email already exists."]})
            if data.get('password1') != data.get('password2'):
                raise serializers.ValidationError({"password2": ["Passwords do not match."]})
        else:
            # Update operation
            if 'password1' in data or 'password2' in data:
                if data.get('password1') != data.get('password2'):
                    raise serializers.ValidationError({"password2": ["Passwords do not match."]})
        return data

    def create(self, validated_data):
        password1 = validated_data.pop('password1')
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        user.set_password(password1)
        user.save()
        return user

    def update(self, instance, validated_data):
        password1 = validated_data.pop('password1', None)
        validated_data.pop('password2', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password1:
            instance.set_password(password1)
        instance.save()
        return instance
