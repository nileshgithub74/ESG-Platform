from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Sum
from core.models import EmissionRecord

class DashboardSummaryView(APIView):
    """Dashboard statistics and summary"""
    
    def get(self, request):
        # Overall counts by status
        status_counts = EmissionRecord.objects.values('status').annotate(count=Count('id'))
        
        # Counts by source type
        source_counts = EmissionRecord.objects.values('source_type').annotate(count=Count('id'))
        
        # Counts by scope
        scope_counts = EmissionRecord.objects.values('scope_category').annotate(count=Count('id'))
        
        # Recent records needing review
        pending_count = EmissionRecord.objects.filter(
            status__in=['PENDING', 'SUSPICIOUS', 'FAILED']
        ).count()
        
        # Approved and locked count
        approved_count = EmissionRecord.objects.filter(status='APPROVED', is_locked=True).count()
        
        return Response({
            'status_breakdown': {item['status']: item['count'] for item in status_counts},
            'source_breakdown': {item['source_type']: item['count'] for item in source_counts},
            'scope_breakdown': {item['scope_category']: item['count'] for item in scope_counts},
            'pending_review': pending_count,
            'approved_locked': approved_count,
            'total_records': EmissionRecord.objects.count(),
        })
