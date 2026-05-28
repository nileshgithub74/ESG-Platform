from rest_framework import serializers
from core.models import EmissionRecord, ReviewAction

class EmissionRecordSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    source_filename = serializers.CharField(source='data_source.filename', read_only=True)
    
    class Meta:
        model = EmissionRecord
        fields = [
            'id', 'company', 'company_name', 'data_source', 'source_filename',
            'source_type', 'activity_type', 'scope_category',
            'normalized_quantity', 'normalized_unit',
            'period_start', 'period_end', 'status', 'validation_flags',
            'is_locked', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'is_locked']


class EmissionRecordDetailSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    source_filename = serializers.CharField(source='data_source.filename', read_only=True)
    review_actions = serializers.SerializerMethodField()
    
    class Meta:
        model = EmissionRecord
        fields = [
            'id', 'company', 'company_name', 'data_source', 'source_filename',
            'source_type', 'source_row_number', 'raw_payload',
            'activity_type', 'scope_category',
            'quantity', 'original_unit', 'normalized_quantity', 'normalized_unit',
            'period_start', 'period_end', 'status', 'validation_flags',
            'is_locked', 'created_at', 'updated_at', 'review_actions'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_review_actions(self, obj):
        from .review_action_serializer import ReviewActionSerializer
        actions = obj.review_actions.all()[:10]
        return ReviewActionSerializer(actions, many=True).data
