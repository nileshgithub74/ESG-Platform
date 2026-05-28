from django.urls import path, include
from rest_framework.routers import DefaultRouter
from core.views import (
    SAPUploadView,
    UtilityUploadView,
    TravelUploadView,
    EmissionRecordViewSet,
    DashboardSummaryView,
)

router = DefaultRouter()
router.register(r'records', EmissionRecordViewSet, basename='record')

urlpatterns = [
    path('', include(router.urls)),
    path('upload/sap/', SAPUploadView.as_view(), name='upload-sap'),
    path('upload/utility/', UtilityUploadView.as_view(), name='upload-utility'),
    path('upload/travel/', TravelUploadView.as_view(), name='upload-travel'),
    path('dashboard/summary/', DashboardSummaryView.as_view(), name='dashboard-summary'),
]
