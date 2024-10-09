# ../../api/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from ..models import Request, Asset

class RequestSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Displays the username
    asset = serializers.PrimaryKeyRelatedField(queryset=Asset.objects.all())  # Accepts asset ID
    approved_by = serializers.SerializerMethodField()

    class Meta:
        model = Request
        fields = [
            'id',
            'user',
            'asset',
            'for_date',
            'end_date',
            'further_notice',
            'approved',
            'approved_date',
            'approved_by'
        ]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        
        # Make 'approved', 'approved_date', and 'approved_by' read-only for non-admin users
        request = self.context.get('request', None)
        if request and not request.user.is_staff:
            self.fields['approved'].read_only = True
            self.fields['approved_date'].read_only = True
            self.fields['approved_by'].read_only = True

    def validate(self, attrs):
        further_notice = attrs.get('further_notice', False)
        end_date = attrs.get('end_date')

        if further_notice and end_date is not None:
            raise serializers.ValidationError({
                'end_date': 'End date must be None if "further_notice" is checked.'
            })

        if not further_notice and end_date is None:
            raise serializers.ValidationError({
                'end_date': 'End date must be set if "further_notice" is unchecked.'
            })

        return attrs

    def validate_approved_by(self, value):
        # Prevent admins from approving their own requests
        if self.instance and value == self.instance.user:
            raise serializers.ValidationError('You cannot approve your own request.')
        return value

    def create(self, validated_data):
        # Automatically set the requesting user as the 'user' field
        request = self.context.get('request')
        if request and hasattr(request, 'user'):
            validated_data['user'] = request.user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user if request else None

        # If an admin is trying to set 'approved_by', ensure it's not themselves
        if user and user.is_staff:
            approved_by = validated_data.get('approved_by', None)
            if approved_by and approved_by == instance.user:
                raise serializers.ValidationError({
                    'approved_by': 'You cannot approve your own request.'
                })
        else:
            # Non-admin users cannot modify 'approved' fields
            validated_data.pop('approved', None)
            validated_data.pop('approved_date', None)
            validated_data.pop('approved_by', None)

        return super().update(instance, validated_data)

    def get_approved_by(self, obj):
         # Check if approved_by is set and return the username or 'N/A'
        return obj.approved_by.username if obj.approved_by else 'N/A'