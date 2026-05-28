import csv
import os
from django.core.management.base import BaseCommand
from core.models import Company, DataSource, EmissionRecord
from core.services import SAPNormalizer, UtilityNormalizer, TravelNormalizer
from core.validators import RecordValidator


class Command(BaseCommand):
    help = 'Load sample CSV data into the database'

    def handle(self, *args, **options):
        # Ensure company exists
        company, created = Company.objects.get_or_create(
            code='ACME',
            defaults={'name': 'Acme Corporation', 'is_active': True}
        )
        
        if created:
            self.stdout.write(self.style.SUCCESS(f'Created company: {company.name}'))
        else:
            self.stdout.write(f'Using existing company: {company.name}')

        # Define upload configurations
        uploads = [
            {
                'file': 'sample_data/sap_sample.csv',
                'source_type': 'SAP',
                'normalizer': SAPNormalizer
            },
            {
                'file': 'sample_data/utility_sample.csv',
                'source_type': 'UTILITY',
                'normalizer': UtilityNormalizer
            },
            {
                'file': 'sample_data/travel_sample.csv',
                'source_type': 'TRAVEL',
                'normalizer': TravelNormalizer
            }
        ]

        total_loaded = 0

        for upload_config in uploads:
            file_path = upload_config['file']
            source_type = upload_config['source_type']
            normalizer_class = upload_config['normalizer']

            if not os.path.exists(file_path):
                self.stdout.write(self.style.WARNING(f'File not found: {file_path}'))
                continue

            # Create data source
            data_source = DataSource.objects.create(
                company=company,
                source_type=source_type,
                filename=os.path.basename(file_path),
                uploaded_by='system'
            )

            # Process CSV
            with open(file_path, 'r') as csvfile:
                reader = csv.DictReader(csvfile)
                row_count = 0
                processed_count = 0
                failed_count = 0

                for row_number, row in enumerate(reader, start=1):
                    row_count += 1

                    try:
                        # Normalize data
                        normalized_data = normalizer_class.normalize(row)
                        
                        # Validate
                        validation_status, validation_flags = RecordValidator.validate(
                            normalized_data, row
                        )
                        
                        # Create emission record
                        EmissionRecord.objects.create(
                            company=company,
                            data_source=data_source,
                            source_type=source_type,
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
                        # Create failed record even on exception
                        EmissionRecord.objects.create(
                            company=company,
                            data_source=data_source,
                            source_type=source_type,
                            source_row_number=row_number,
                            raw_payload=row,
                            status='FAILED',
                            validation_flags=[{
                                'type': 'error',
                                'message': f'Processing error: {str(e)}'
                            }],
                            activity_type='Unknown'
                        )
                        self.stdout.write(
                            self.style.WARNING(f'Row {row_number} saved as FAILED: {str(e)}')
                        )

                # Update data source stats
                data_source.row_count = row_count
                data_source.processed_count = processed_count
                data_source.failed_count = failed_count
                data_source.save()

                total_loaded += row_count

                self.stdout.write(
                    self.style.SUCCESS(
                        f'Loaded {source_type}: {row_count} rows '
                        f'({processed_count} processed, {failed_count} failed)'
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(f'\nTotal records loaded: {total_loaded}')
        )
        self.stdout.write(
            self.style.SUCCESS('Sample data loaded successfully!')
        )
