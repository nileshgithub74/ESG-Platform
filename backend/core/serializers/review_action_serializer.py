from rest_framework import serializers
from core.models import ReviewAction

class ReviewActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReviewAction
        fields = [
            'id', 'record', 'action_type', 'previous_value', 'new_value',
            'comment', 'created_by', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
