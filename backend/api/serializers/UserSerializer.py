from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(write_only=True, required=False, allow_blank=True)
    password2 = serializers.CharField(write_only=True, required=False, allow_blank=True)

    class Meta:
        model = User
        fields = [
            "id", "username", "first_name", "last_name", "email",
            "password1", "password2", "is_staff"
        ]
        extra_kwargs = {
            "first_name": {"required": True},
            "last_name": {"required": True},
            "email": {"required": True},
            "is_staff": {"required": False},
            "username": {"required": True},
        }

    def validate(self, data):
        # Create operation
        if self.instance is None:
            if User.objects.filter(username=data["username"]).exists():
                raise serializers.ValidationError({"username": ["Username already exists."]})
            if User.objects.filter(email=data["email"]).exists():
                raise serializers.ValidationError({"email": ["Email already exists."]})
            if data.get('password1') != data.get('password2'):
                raise serializers.ValidationError({"password2": ["Passwords do not match."]})
        else:
            # Update operation
            password1 = data.get('password1')
            password2 = data.get('password2')

            # Check for password update
            if password1 or password2:
                if password1 != password2:
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
        # Extract passwords
        password1 = validated_data.pop('password1', None)
        validated_data.pop('password2', None)

        # If password1 is an empty string or None, don't update the password
        if password1 == "" or password1 is None:
            password1 = None

        # Update other fields (if provided)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        # If password1 is provided and is not empty, update it
        if password1:
            instance.set_password(password1)

        instance.save()
        return instance
