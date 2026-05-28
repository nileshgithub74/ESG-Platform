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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Upload Successful!</h3>
            <div className="space-y-2 text-sm text-gray-700 mb-6">
              <p>Total rows: <span className="font-semibold">{uploadResult.row_count}</span></p>
              <p>Processed: <span className="font-semibold text-green-600">{uploadResult.processed_count}</span></p>
              <p>Failed: <span className="font-semibold text-red-600">{uploadResult.failed_count}</span></p>
            </div>
            <button
              onClick={() => setUploadResult(null)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default UploadCenter;
