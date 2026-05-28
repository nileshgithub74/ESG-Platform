from django.db import models
from .company import Company
from .data_source import DataSource

class EmissionRecord(models.Model):
    """Unified normalized emission record from all sources"""
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('VALID', 'Valid'),
        ('FAILED', 'Failed Validation'),
        ('SUSPICIOUS', 'Suspicious'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
    ]
    
    SCOPE_CHOICES = [
        ('SCOPE_1', 'Scope 1 - Direct Emissions'),
        ('SCOPE_2', 'Scope 2 - Indirect Energy'),
        ('SCOPE_3', 'Scope 3 - Value Chain'),
        ('UNKNOWN', 'Unknown'),
    ]
    
    # Relationships
    company = models.ForeignKey(Company, on_delete=models.CASCADE, related_name='emission_records')
    data_source = models.ForeignKey(DataSource, on_delete=models.CASCADE, related_name='records')
    
    # Source tracking
    source_type = models.CharField(max_length=20)
    source_row_number = models.IntegerField()
    raw_payload = models.JSONField()
    
    # Normalized fields
    activity_type = models.CharField(max_length=100, blank=True, default='Unknown')
    scope_category = models.CharField(max_length=20, choices=SCOPE_CHOICES, default='UNKNOWN')
    quantity = models.DecimalField(max_digits=15, decimal_places=4, null=True, blank=True)
    original_unit = models.CharField(max_length=50, blank=True)
    normalized_quantity = models.DecimalField(max_digits=15, decimal_places=4, null=True, blank=True)
    normalized_unit = models.CharField(max_length=50, blank=True)
    
    # Time period
    period_start = models.DateField(null=True, blank=True)
    period_end = models.DateField(null=True, blank=True)
    
    # Status and validation
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    validation_flags = models.JSONField(default=list)
    is_locked = models.BooleanField(default=False)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'emission_records'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['company', 'status']),
            models.Index(fields=['source_type', 'status']),
            models.Index(fields=['scope_category']),
        ]
    
    def __str__(self):
        return f"{self.activity_type} - {self.normalized_quantity} {self.normalized_unit}"
