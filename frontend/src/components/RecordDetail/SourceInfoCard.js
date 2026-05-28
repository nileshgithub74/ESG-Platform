import React from 'react';

function SourceInfoCard({ record }) {
  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <h4 className="font-bold text-gray-900 mb-4">
        Source Information
      </h4>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Company:</span>
          <span className="text-gray-900 font-semibold">{record.company_name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Source File:</span>
          <span className="text-gray-900 text-sm">{record.source_filename}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Source Type:</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            {record.source_type}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Row Number:</span>
          <span className="text-gray-900 font-mono">#{record.source_row_number}</span>
        </div>
      </div>
    </div>
  );
}

export default SourceInfoCard;
