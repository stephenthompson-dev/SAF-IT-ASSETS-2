from django.contrib.auth import authenticate, login, logout
from django.middleware.csrf import get_token
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

class AuthViewSet(viewsets.ViewSet):
    """
    A ViewSet for handling user authentication: login, logout, and CSRF token retrieval.
    """

    permission_classes = [AllowAny]

    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        """
        Handles user login via username and password.
        """
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({"detail": "Username and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate the user by username
        user = authenticate(username=username, password=password)

        if user is not None:
            # Log in the user using Django's session-based login
            login(request, user)
            
            # Return success response
            response = Response({"detail": "Logged in successfully."}, status=status.HTTP_200_OK)
            return response
        else:
            return Response({"detail": "Invalid username or password."}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], url_path='logout')
    def logout(self, request):
        """
        Handles user logout.
        """
        logout(request)
        return Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='csrf')
    def csrf(self, request):
        """
        Retrieves a CSRF token for use in subsequent requests.
        """
        csrf_token = get_token(request)
        return Response({"csrfToken": csrf_token}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], url_path='me')
    def me(self, request):
        """
        Retrieves the authenticated user's information.
        """
        if request.user.is_authenticated:
            user = request.user
            role = "admin" if user.is_staff or user.is_superuser else "regular"
            return Response({
                "email": user.email,
                "username": user.username,
                "role": role,
            }, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
