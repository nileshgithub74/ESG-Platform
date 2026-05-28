import React from 'react';

function StatusCard({ record }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
      <h4 className="font-bold text-gray-900 mb-4">
        Status
      </h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Status:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(record.status)}`}>
            {record.status}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">Locked:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            record.is_locked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {record.is_locked ? 'Yes' : 'No'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 font-medium">Created:</span>
          <span className="text-gray-900 text-sm">{new Date(record.created_at).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default StatusCard;
