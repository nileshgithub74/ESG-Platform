from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from core.models import EmissionRecord, ReviewAction
from core.serializers import EmissionRecordSerializer, EmissionRecordDetailSerializer

class EmissionRecordViewSet(viewsets.ModelViewSet):
    queryset = EmissionRecord.objects.all()
    serializer_class = EmissionRecordSerializer
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return EmissionRecordDetailSerializer
        return EmissionRecordSerializer
    
    def get_queryset(self):
        queryset = EmissionRecord.objects.select_related('company', 'data_source')
        
        # Filter by status
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter.upper())
        
        # Filter by source type
        source_type = self.request.query_params.get('source_type')
        if source_type:
            queryset = queryset.filter(source_type=source_type.upper())
        
        # Filter by company
        company_id = self.request.query_params.get('company_id')
        if company_id:
            queryset = queryset.filter(company_id=company_id)
        
        # Filter by scope
        scope = self.request.query_params.get('scope')
        if scope:
            queryset = queryset.filter(scope_category=scope.upper())
        
        # Search
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(activity_type__icontains=search) |
                Q(source_type__icontains=search)
            )
        
        return queryset.order_by('-created_at')
    
    @action(detail=True, methods=['patch'])
    def approve(self, request, pk=None):
        """Approve a record and lock it"""
        record = self.get_object()
        
        if record.is_locked:
            return Response({'error': 'Record is locked'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update record
        previous_status = record.status
        record.status = 'APPROVED'
        record.is_locked = True
        record.save()
        
        # Create audit trail
        ReviewAction.objects.create(
            record=record,
            action_type='APPROVE',
            previous_value={'status': previous_status},
            new_value={'status': 'APPROVED'},
            comment=request.data.get('comment', ''),
            created_by=request.user.username if request.user.is_authenticated else 'anonymous'
        )
        
        serializer = self.get_serializer(record)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def reject(self, request, pk=None):
        """Reject a record"""
        record = self.get_object()
        
        if record.is_locked:
            return Response({'error': 'Record is locked'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Update record
        previous_status = record.status
        record.status = 'REJECTED'
        record.save()
        
        # Create audit trail
        ReviewAction.objects.create(
            record=record,
            action_type='REJECT',
            previous_value={'status': previous_status},
            new_value={'status': 'REJECTED'},
            comment=request.data.get('comment', ''),
            created_by=request.user.username if request.user.is_authenticated else 'anonymous'
        )
        
        serializer = self.get_serializer(record)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def edit(self, request, pk=None):
        """Edit normalized values of a record"""
        record = self.get_object()
        
        if record.is_locked:
            return Response({'error': 'Record is locked'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Capture previous values
        previous_value = {
            'normalized_quantity': str(record.normalized_quantity) if record.normalized_quantity else None,
            'normalized_unit': record.normalized_unit,
            'activity_type': record.activity_type,
            'scope_category': record.scope_category,
        }
        
        # Update allowed fields
        editable_fields = ['normalized_quantity', 'normalized_unit', 'activity_type', 'scope_category']
        new_value = {}
        
        for field in editable_fields:
            if field in request.data:
                setattr(record, field, request.data[field])
                new_value[field] = request.data[field]
        
        record.save()
        
        # Create audit trail
        ReviewAction.objects.create(
            record=record,
            action_type='EDIT',
            previous_value=previous_value,
            new_value=new_value,
            comment=request.data.get('comment', ''),
            created_by=request.user.username if request.user.is_authenticated else 'anonymous'
        )
        
        serializer = self.get_serializer(record)
        return Response(serializer.data)
