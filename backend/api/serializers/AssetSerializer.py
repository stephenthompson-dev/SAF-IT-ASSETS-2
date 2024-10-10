# serializers.py

from rest_framework import serializers
from ..models import Asset, Category

class AssetSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all())  # Accepts category ID

    class Meta:
        model = Asset
        fields = ['id', 'asset_name', 'purchase_date', 'category']  # Keep 'category' in fields

    def create(self, validated_data):
        # Directly create asset with validated data including category as ID
        asset = Asset.objects.create(**validated_data)  # Create asset with validated data
        return asset

    def update(self, instance, validated_data):
        # Update asset with validated data
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
