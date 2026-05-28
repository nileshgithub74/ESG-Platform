from django.db import models
from .company import Company

class DataSource(models.Model):
    """Tracks uploaded source files for traceability"""
    SOURCE_TYPES = [
        ('SAP', 'SAP Fuel/Procurement'),
        ('UTILITY', 'Utility Electricity'),
        ('TRAVEL', 'Corporate Travel'),
    ]
    
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='data_sources')
    source_type = models.CharField(max_length=20, choices=SOURCE_TYPES)
    filename = models.CharField(max_length=255)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.CharField(max_length=255, blank=True)
    row_count = models.IntegerField(default=0)
    processed_count = models.IntegerField(default=0)
    failed_count = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'data_sources'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.source_type} - {self.filename} ({self.uploaded_at.date()})"
