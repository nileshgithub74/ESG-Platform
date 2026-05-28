import React from 'react';

function SummaryCards({ summary }) {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-600">Total Records</div>
        <div className="text-2xl font-bold text-gray-900">{summary.total_records}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-600">Pending Review</div>
        <div className="text-2xl font-bold text-orange-600">{summary.pending_review}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-600">Approved</div>
        <div className="text-2xl font-bold text-green-600">{summary.approved_locked}</div>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-sm text-gray-600">Failed</div>
        <div className="text-2xl font-bold text-red-600">
          {summary.status_breakdown?.FAILED || 0}
        </div>
      </div>
    </div>
  );
}

export default SummaryCards;
