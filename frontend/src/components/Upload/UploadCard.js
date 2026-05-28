import React from 'react';

function UploadCard({ title, sourceType, description, uploading, result, onUpload }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      
      <input
        type="file"
        accept=".csv"
        onChange={(e) => onUpload(sourceType, e.target.files[0])}
        disabled={uploading}
        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 disabled:opacity-50"
      />

      {uploading && (
        <div className="mt-3 text-sm text-blue-600">Uploading...</div>
      )}

      {result && (
        <div className={`mt-3 p-3 rounded text-sm ${
          result.error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {result.error ? (
            <p>{result.error}</p>
          ) : (
            <div>
              <p className="font-semibold">Upload successful!</p>
              <p>Total rows: {result.row_count}</p>
              <p>Processed: {result.processed_count}</p>
              <p>Failed: {result.failed_count}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default UploadCard;
