from rest_framework import serializers
from ..models import Request, Asset

class RequestSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # To display the username
    asset = serializers.PrimaryKeyRelatedField(queryset=Asset.objects.all())  # Accept asset ID

    class Meta:
        model = Request
        fields = ['id', 'user', 'asset', 'for_date', 'end_date', 'further_notice', 'approved', 'approved_date', 'approved_by']
        read_only_fields = ['user', 'approved_date']  # Make some fields read-only

    def validate(self, attrs):
        further_notice = attrs.get('further_notice', False)
        end_date = attrs.get('end_date')
        user = attrs.get('user')
        approved_by = attrs.get('approved_by')

        if further_notice and end_date is not None:
            raise serializers.ValidationError({'end_date': 'End date must be None if "further_notice" is checked.'})

        if not further_notice and end_date is None:
            raise serializers.ValidationError({'end_date': 'End date must be set if "further_notice" is unchecked.'})

        if approved_by == user:
            raise serializers.ValidationError({'approved_by': 'You cannot approve your own request'})

        return attrs

    def create(self, validated_data):
        # Here we assume 'user' is being set in the view, so we shouldn't remove it
        # We assume the view provides the user as part of the validated_data
        request_instance = Request.objects.create(**validated_data)  # Create the instance with validated data
        return request_instance
