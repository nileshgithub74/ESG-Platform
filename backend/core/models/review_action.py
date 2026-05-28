from django.db import models
from .emission_record import EmissionRecord

class ReviewAction(models.Model):
    """Immutable audit trail of all review actions"""
    ACTION_TYPES = [
        ('APPROVE', 'Approved'),
        ('REJECT', 'Rejected'),
        ('EDIT', 'Edited'),
        ('COMMENT', 'Comment Added'),
    ]
    
    record = models.ForeignKey(EmissionRecord, on_delete=models.CASCADE, related_name='review_actions')
    action_type = models.CharField(max_length=20, choices=ACTION_TYPES)
    previous_value = models.JSONField(null=True, blank=True)
    new_value = models.JSONField(null=True, blank=True)
    comment = models.TextField(blank=True)
    created_by = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'review_actions'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.action_type} - {self.record.id} by {self.created_by}"
