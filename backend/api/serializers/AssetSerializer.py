from rest_framework import serializers
from ..models import Asset, Category
from .CategorySerializer import CategorySerializer

class AssetSerializer(serializers.ModelSerializer):
    category = CategorySerializer()  # To display category details in the asset

    class Meta:
        model = Asset
        fields = ['id', 'asset_name', 'purchase_date', 'warrenty_end', 'category']

    def create(self, validated_data):
        category_data = validated_data.pop('category')
        category, created = Category.objects.get_or_create(**category_data)
        asset = Asset.objects.create(category=category, **validated_data)
        return asset
