import React, { useState, useEffect } from 'react';
import { uploadFile, getCompanies, createCompany } from '../services/api';
import CompanySelector from '../components/Upload/CompanySelector';
import UploadCard from '../components/Upload/UploadCard';

function UploadCenter() {
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [uploading, setUploading] = useState({});
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', code: '' });
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    loadCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadCompanies = async () => {
    try {
      const data = await getCompanies();
      setCompanies(data);
      if (data.length > 0 && !companyId) {
        setCompanyId(data[0].id.toString());
      }
    } catch (error) {
      console.error('Failed to load companies:', error);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      const company = await createCompany(newCompany);
      setCompanies([...companies, company]);
      setCompanyId(company.id.toString());
      setNewCompany({ name: '', code: '' });
      setShowAddCompany(false);
    } catch (error) {
      alert('Failed to create company: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  const handleUpload = async (sourceType, file) => {
    if (!file || !companyId) {
      alert('Please select a company first');
      return;
    }

    setUploading(prev => ({ ...prev, [sourceType]: true }));

    try {
      const result = await uploadFile(sourceType, file, companyId);
      setUploadResult(result);
    } catch (error) {
      alert('Upload failed: ' + (error.response?.data?.error || 'Unknown error'));
    } finally {
      setUploading(prev => ({ ...prev, [sourceType]: false }));
    }
  };

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Data</h2>
        <p className="text-gray-600">Upload CSV files from different data sources</p>
      </div>

      <CompanySelector
        companies={companies}
        companyId={companyId}
        setCompanyId={setCompanyId}
        showAddCompany={showAddCompany}
        setShowAddCompany={setShowAddCompany}
        newCompany={newCompany}
        setNewCompany={setNewCompany}
        onAddCompany={handleAddCompany}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UploadCard
          title="SAP Data"
          sourceType="sap"
          description="Fuel and procurement data from SAP systems"
          uploading={uploading.sap}
          onUpload={handleUpload}
        />
        <UploadCard
          title="Utility Data"
          sourceType="utility"
          description="Electricity consumption from utility providers"
          uploading={uploading.utility}
          onUpload={handleUpload}
        />
        <UploadCard
          title="Travel Data"
          sourceType="travel"
          description="Corporate travel and accommodation records"
          uploading={uploading.travel}
          onUpload={handleUpload}
        />
      </div>

      {uploadResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="bg-white rounded-full p-2">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white">Upload Complete</h3>
              </div>
            </div>

            {/* Content */}
            <div className="px-6 py-6">
              <div className="space-y-4">
                {/* Total Rows */}
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Total Rows</span>
                  <span className="text-2xl font-bold text-gray-900">{uploadResult.row_count}</span>
                </div>

                {/* Processed */}
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">Processed</span>
                  </div>
                  <span className="text-2xl font-bold text-green-600">{uploadResult.processed_count}</span>
                </div>

                {/* Failed */}
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-red-700 font-medium">Failed</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{uploadResult.failed_count}</span>
                </div>
              </div>

              {/* Success Message */}
              {uploadResult.processed_count > 0 && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-700 text-center">
                    Records are now available in the Review Dashboard
                  </p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-6">
              <button
                onClick={() => setUploadResult(null)}
                className="w-full px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadCenter;
