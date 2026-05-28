import React, { useState, useEffect } from 'react';
import { getRecords, getDashboardSummary, downloadRecords } from '../services/api';
import RecordDetailModal from '../components/RecordDetailModal';

function ReviewDashboard() {
  const [records, setRecords] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState({
    status: '',
    source_type: '',
    scope: '',
    search: '',
  });

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [recordsData, summaryData] = await Promise.all([
        getRecords(filters),
        getDashboardSummary(),
      ]);
      setRecords(recordsData.results || recordsData);
      setSummary(summaryData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

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

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Analyst Review Dashboard</h2>
          <div className="flex gap-2">
            <button
              onClick={() => downloadRecords(filters)}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              📥 Download All
            </button>
            <button
              onClick={() => downloadRecords(filters, 'sap')}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
            >
              SAP
            </button>
            <button
              onClick={() => downloadRecords(filters, 'utility')}
              className="px-4 py-2 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
            >
              Utility
            </button>
            <button
              onClick={() => downloadRecords(filters, 'travel')}
              className="px-4 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
            >
              Travel
            </button>
          </div>
        </div>
        
        {summary && (
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
        )}
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="pending">Pending</option>
                <option value="valid">Valid</option>
                <option value="failed">Failed</option>
                <option value="suspicious">Suspicious</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source Type</label>
              <select
                value={filters.source_type}
                onChange={(e) => handleFilterChange('source_type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="sap">SAP</option>
                <option value="utility">Utility</option>
                <option value="travel">Travel</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
              <select
                value={filters.scope}
                onChange={(e) => handleFilterChange('scope', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="">All</option>
                <option value="scope_1">Scope 1</option>
                <option value="scope_2">Scope 2</option>
                <option value="scope_3">Scope 3</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Activity type..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No records found</div>
          ) : (
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
                    onClick={() => setSelectedRecord(record.id)}
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
          )}
        </div>
      </div>

      {selectedRecord && (
        <RecordDetailModal
          recordId={selectedRecord}
          onClose={() => setSelectedRecord(null)}
          onUpdate={loadData}
        />
      )}
    </div>
  );
}

export default ReviewDashboard;
