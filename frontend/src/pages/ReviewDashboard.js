import React, { useState, useEffect } from 'react';
import { getRecords, getDashboardSummary } from '../services/api';
import RecordDetailModal from '../components/RecordDetailModal';
import DownloadMenu from '../components/Dashboard/DownloadMenu';
import SummaryCards from '../components/Dashboard/SummaryCards';
import FilterBar from '../components/Dashboard/FilterBar';
import RecordsTable from '../components/Dashboard/RecordsTable';

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

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Analyst Review Dashboard</h2>
          <DownloadMenu filters={filters} />
        </div>
        
        <SummaryCards summary={summary} />
      </div>

      <div className="bg-white rounded-lg shadow">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />

        <div className="overflow-x-auto">
          <RecordsTable 
            records={records} 
            loading={loading} 
            onRecordClick={setSelectedRecord} 
          />
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
