from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def api_root(request):
    return JsonResponse({
        'message': 'ESG Platform Backend API is running',
        'status': 'active',
        'endpoints': {
            'admin': '/admin/',
            'api': '/api/',
            'records': '/api/records/',
            'dashboard': '/api/dashboard/summary/',
            'uploads': {
                'sap': '/api/upload/sap/',
                'utility': '/api/upload/utility/',
                'travel': '/api/upload/travel/',
            }
        }
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/', include('core.urls')),
]
