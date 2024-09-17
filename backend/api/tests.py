from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth.models import User


#USER TESTS
class UserCreationTests(TestCase):
    def setUp(self):
        self.client = APIClient()  # Create an instance of the APIClient for making requests
        self.url = reverse('user-list-create')  # URL for the User creation endpoint

    def test_create_user_valid_data(self):
        # Define the valid user data
        data = {
            'username': 'testuser',
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'testuser@example.com'
        }
        # Make a POST request to the API
        response = self.client.post(self.url, data, format='json')
        
        # Assert the response status code
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Assert that the user was created
        self.assertEqual(User.objects.count(), 1)
        self.assertEqual(User.objects.get().username, 'testuser')

    def test_create_user_invalid_data(self):
        # Define invalid user data (e.g., missing username)
        data = {
            'password': 'testpassword',
            'first_name': 'Test',
            'last_name': 'User',
            'email': 'testuser@example.com'
        }
        # Make a POST request to the API
        response = self.client.post(self.url, data, format='json')
        
        # Assert the response status code
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Assert that no users were created
        self.assertEqual(User.objects.count(), 0)

    def test_create_user_duplicate_username(self):
        # Create an initial user
        User.objects.create_user(
            username='testuser',
            password='testpassword',
            first_name='Test',
            last_name='User',
            email='testuser@example.com'
        )
        
        # Define the user data with a duplicate username
        data = {
            'username': 'testuser',
            'password': 'anotherpassword',
            'first_name': 'Another',
            'last_name': 'User',
            'email': 'anotheruser@example.com'
        }
        # Make a POST request to the API
        response = self.client.post(self.url, data, format='json')
        
        # Assert the response status code
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Assert that only one user was created
        self.assertEqual(User.objects.count(), 1)
