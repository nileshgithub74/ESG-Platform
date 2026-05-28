from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    """
    Root endpoint providing API information and available routes.
    Returns JSON response with service status and endpoint documentation.
    """
    return JsonResponse({
        'message': 'ESG Platform Backend API is running',
        'version': '1.0.0',
        'status': 'active',
        'endpoints': {
            'admin_panel': '/admin/',
            'api_base': '/api/',
            'emission_records': '/api/records/',
            'dashboard_metrics': '/api/dashboard/summary/',
            'data_uploads': {
                'sap_upload': '/api/upload/sap/',
                'utility_upload': '/api/upload/utility/',
                'travel_upload': '/api/upload/travel/',
            }
        },
        'documentation': 'Visit /api/ for interactive API documentation'
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
]
