from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from core.models import Company
from core.serializers import CompanySerializer


class CompanyViewSet(viewsets.ModelViewSet):
    """API endpoint for managing companies"""
    queryset = Company.objects.all()
    serializer_class = CompanySerializer
    
    def list(self, request):
        """List all companies"""
        companies = Company.objects.all().order_by('name')
        serializer = self.get_serializer(companies, many=True)
        return Response(serializer.data)
    
    def create(self, request):
        """Create a new company"""
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def retrieve(self, request, pk=None):
        """Get a specific company"""
        try:
            company = Company.objects.get(pk=pk)
            serializer = self.get_serializer(company)
            return Response(serializer.data)
        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def update(self, request, pk=None):
        """Update a company"""
        try:
            company = Company.objects.get(pk=pk)
            serializer = self.get_serializer(company, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
    
    def destroy(self, request, pk=None):
        """Delete a company"""
        try:
            company = Company.objects.get(pk=pk)
            company.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Company.DoesNotExist:
            return Response({'error': 'Company not found'}, status=status.HTTP_404_NOT_FOUND)
