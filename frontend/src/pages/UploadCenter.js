import React, { useState, useEffect } from 'react';
import { uploadFile, getCompanies, createCompany } from '../services/api';

function UploadCenter() {
  const [companies, setCompanies] = useState([]);
  const [companyId, setCompanyId] = useState('');
  const [uploading, setUploading] = useState({});
  const [results, setResults] = useState({});
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', code: '' });

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
    setResults(prev => ({ ...prev, [sourceType]: null }));

    try {
      const result = await uploadFile(sourceType, file, companyId);
      setResults(prev => ({ ...prev, [sourceType]: result }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [sourceType]: { error: error.response?.data?.error || 'Upload failed' }
      }));
    } finally {
      setUploading(prev => ({ ...prev, [sourceType]: false }));
    }
  };

  const UploadCard = ({ title, sourceType, description }) => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <input
        type="file"
        accept=".csv"
        onChange={(e) => handleUpload(sourceType, e.target.files[0])}
        disabled={uploading[sourceType]}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />

      {uploading[sourceType] && (
        <div className="mt-3 text-sm text-blue-600">Uploading...</div>
      )}

      {results[sourceType] && (
        <div className={`mt-3 p-3 rounded text-sm ${
          results[sourceType].error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {results[sourceType].error ? (
            <p>{results[sourceType].error}</p>
          ) : (
            <div>
              <p className="font-semibold">Upload successful!</p>
              <p>Total rows: {results[sourceType].row_count}</p>
              <p>Processed: {results[sourceType].processed_count}</p>
              <p>Failed: {results[sourceType].failed_count}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Data</h2>
        <p className="text-gray-600">Upload CSV files from different data sources</p>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Company
        </label>
        <div className="flex gap-2">
          <select
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a company...</option>
            {companies.map(company => (
              <option key={company.id} value={company.id}>
                {company.name} ({company.code})
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAddCompany(!showAddCompany)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            + Add Company
          </button>
        </div>

        {showAddCompany && (
          <form onSubmit={handleAddCompany} className="mt-4 p-4 bg-gray-50 rounded">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </label>
                <input
                  type="text"
                  required
                  value={newCompany.name}
                  onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., Acme Corporation"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Code
                </label>
                <input
                  type="text"
                  required
                  value={newCompany.code}
                  onChange={(e) => setNewCompany({ ...newCompany, code: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., ACME"
                />
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                type="submit"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Create Company
              </button>
              <button
                type="button"
                onClick={() => setShowAddCompany(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <UploadCard
          title="SAP Data"
          sourceType="sap"
          description="Fuel and procurement data from SAP systems"
        />
        <UploadCard
          title="Utility Data"
          sourceType="utility"
          description="Electricity consumption from utility providers"
        />
        <UploadCard
          title="Travel Data"
          sourceType="travel"
          description="Corporate travel and accommodation records"
        />
      </div>
    </div>
  );
}

export default UploadCenter;
