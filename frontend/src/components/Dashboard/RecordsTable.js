import React from 'react';

function RecordsTable({ records, loading, onRecordClick }) {
  const getStatusBadge = (status) => {
    const colors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      VALID: 'bg-green-100 text-green-800',
      FAILED: 'bg-red-100 text-red-800',
      SUSPICIOUS: 'bg-orange-100 text-orange-800',
      APPROVED: 'bg-blue-100 text-blue-800',
      REJECTED: 'bg-gray-100 text-gray-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  }

  if (records.length === 0) {
    return <div className="p-8 text-center text-gray-500">No records found</div>;
  }

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Activity</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scope</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {records.map((record) => (
          <tr
            key={record.id}
            onClick={() => onRecordClick(record.id)}
            className="hover:bg-gray-50 cursor-pointer"
          >
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.source_type}</td>
            <td className="px-6 py-4 text-sm text-gray-900">{record.activity_type}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {record.scope_category?.replace('SCOPE_', 'Scope ')}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {record.normalized_quantity} {record.normalized_unit}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(record.status)}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {record.period_start || 'N/A'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default RecordsTable;
