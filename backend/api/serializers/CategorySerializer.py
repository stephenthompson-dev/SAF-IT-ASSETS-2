# serializers.py

from rest_framework import serializers
from ..models import Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category_name']

    def validate_category_name(self, value):
        # Case-insensitive uniqueness check
        if Category.objects.filter(category_name__iexact=value).exists():
            raise serializers.ValidationError("Category already exists.")
        return value

    def create(self, validated_data):
        category = Category.objects.create(**validated_data)
        return category

    def update(self, instance, validated_data):
        category_name = validated_data.get('category_name', instance.category_name)
        if Category.objects.filter(category_name__iexact=category_name).exclude(id=instance.id).exists():
            raise serializers.ValidationError({"category_name": "Category already exists."})
        instance.category_name = category_name
        instance.save()
        return instance
