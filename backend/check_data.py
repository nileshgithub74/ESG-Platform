import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from core.models import Company, EmissionRecord

companies = Company.objects.all()
records = EmissionRecord.objects.all()

print(f"Companies: {companies.count()}")
print(f"Records: {records.count()}")

for company in companies:
    print(f"  - {company.name} (ID: {company.id})")

for record in records[:5]:
    print(f"  - Record {record.id}: {record.activity_type} - {record.status}")
