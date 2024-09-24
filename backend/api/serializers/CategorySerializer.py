from rest_framework import serializers
from ..models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category_name']

    def validate(self, data):
        # Check for existing category
        if Category.objects.filter(category_name=data["category_name"]).exists():
            raise serializers.ValidationError(
                {"category_name": ["Category already exists."]})

        
        return data
