from django.contrib import admin
from core.models import Company, DataSource, EmissionRecord, ReviewAction

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'is_active', 'created_at']
    search_fields = ['name', 'code']
    list_filter = ['is_active']

@admin.register(DataSource)
class DataSourceAdmin(admin.ModelAdmin):
    list_display = ['filename', 'source_type', 'company', 'uploaded_at', 'row_count', 'processed_count', 'failed_count']
    list_filter = ['source_type', 'uploaded_at']
    search_fields = ['filename', 'company__name']

@admin.register(EmissionRecord)
class EmissionRecordAdmin(admin.ModelAdmin):
    list_display = ['id', 'company', 'source_type', 'activity_type', 'scope_category', 'status', 'is_locked', 'created_at']
    list_filter = ['status', 'source_type', 'scope_category', 'is_locked']
    search_fields = ['activity_type', 'company__name']
    readonly_fields = ['raw_payload', 'validation_flags', 'created_at', 'updated_at']

@admin.register(ReviewAction)
class ReviewActionAdmin(admin.ModelAdmin):
    list_display = ['id', 'record', 'action_type', 'created_by', 'created_at']
    list_filter = ['action_type', 'created_at']
    search_fields = ['created_by', 'comment']
    readonly_fields = ['created_at']
