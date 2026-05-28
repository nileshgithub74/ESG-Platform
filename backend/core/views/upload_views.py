import csv
import io
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from core.models import Company, DataSource, EmissionRecord
from core.services import SAPNormalizer, UtilityNormalizer, TravelNormalizer
from core.validators import RecordValidator

class BaseUploadView(APIView):
    """Base class for CSV upload endpoints"""
    source_type = None
    normalizer_class = None
    
    def post(self, request):
        # Get company
        company_id = request.data.get('company_id')
        if not company_id:
            return Response({'error': 'company_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Get uploaded file
        csv_file = request.FILES.get('file')
        if not csv_file:
            return Response({'error': 'No file uploaded'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create data source record
        data_source = DataSource.objects.create(
            company=company,
            source_type=self.source_type,
            filename=csv_file.name,
            uploaded_by=request.user.username if request.user.is_authenticated else 'anonymous'
        )
        
        # Process CSV
        try:
            decoded_file = csv_file.read().decode('utf-8')
            csv_reader = csv.DictReader(io.StringIO(decoded_file))
            
            row_count = 0
            processed_count = 0
            failed_count = 0
            
            for row_number, row in enumerate(csv_reader, start=1):
                row_count += 1
                
                # Normalize data
                try:
                    normalized_data = self.normalizer_class.normalize(row)
                    
                    # Validate
                    validation_status, validation_flags = RecordValidator.validate(normalized_data, row)
                    
                    # Create emission record
                    EmissionRecord.objects.create(
                        company=company,
                        data_source=data_source,
                        source_type=self.source_type,
                        source_row_number=row_number,
                        raw_payload=row,
                        status=validation_status,
                        validation_flags=validation_flags,
                        **normalized_data
                    )
                    
                    if validation_status == 'FAILED':
                        failed_count += 1
                    else:
                        processed_count += 1
                        
                except Exception as e:
                    failed_count += 1
                    # Create failed record
                    EmissionRecord.objects.create(
                        company=company,
                        data_source=data_source,
                        source_type=self.source_type,
                        source_row_number=row_number,
                        raw_payload=row,
                        status='FAILED',
                        validation_flags=[{'type': 'error', 'message': f'Processing error: {str(e)}'}],
                        activity_type='Unknown'
                    )
            
            # Update data source stats
            data_source.row_count = row_count
            data_source.processed_count = processed_count
            data_source.failed_count = failed_count
            data_source.save()
            
            return Response({
                'message': 'File uploaded successfully',
                'data_source_id': data_source.id,
                'row_count': row_count,
                'processed_count': processed_count,
                'failed_count': failed_count
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({'error': f'File processing error: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


class SAPUploadView(BaseUploadView):
    source_type = 'SAP'
    normalizer_class = SAPNormalizer


class UtilityUploadView(BaseUploadView):
    source_type = 'UTILITY'
    normalizer_class = UtilityNormalizer


class TravelUploadView(BaseUploadView):
    source_type = 'TRAVEL'
    normalizer_class = TravelNormalizer
