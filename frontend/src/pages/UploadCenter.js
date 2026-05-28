import React, { useState } from 'react';
import { uploadFile } from '../services/api';

function UploadCenter() {
  const [companyId, setCompanyId] = useState('1');
  const [uploading, setUploading] = useState({});
  const [results, setResults] = useState({});

  const handleUpload = async (sourceType, file) => {
    if (!file) return;

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

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company ID
        </label>
        <input
          type="number"
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="w-48 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Create companies in Django admin first
        </p>
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
