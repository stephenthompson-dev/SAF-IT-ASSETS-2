
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom fields
        token['user_id'] = user.id
        token['username'] = user.username
        token['is_staff'] = user.is_staff

        return token