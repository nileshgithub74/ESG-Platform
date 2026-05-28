import React, { useState, useEffect } from 'react';
import { getRecordDetail, approveRecord, rejectRecord, editRecord } from '../services/api';
import SourceInfoCard from './RecordDetail/SourceInfoCard';
import StatusCard from './RecordDetail/StatusCard';
import NormalizedDataCard from './RecordDetail/NormalizedDataCard';
import ValidationFlags from './RecordDetail/ValidationFlags';
import AuditTrail from './RecordDetail/AuditTrail';
import ActionButtons from './RecordDetail/ActionButtons';

function RecordDetailModal({ recordId, onClose, onUpdate }) {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [comment, setComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recordId]);

  const loadRecord = async () => {
    try {
      const data = await getRecordDetail(recordId);
      setRecord(data);
      setEditData({
        normalized_quantity: data.normalized_quantity,
        normalized_unit: data.normalized_unit,
        activity_type: data.activity_type,
        scope_category: data.scope_category,
      });
    } catch (error) {
      console.error('Failed to load record:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      await approveRecord(recordId, comment);
      onUpdate();
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to approve');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    setActionLoading(true);
    try {
      await rejectRecord(recordId, comment);
      onUpdate();
      onClose();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to reject');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEdit = async () => {
    setActionLoading(true);
    try {
      await editRecord(recordId, { ...editData, comment });
      await loadRecord();
      setEditing(false);
      onUpdate();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to edit');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6">Loading...</div>
      </div>
    );
  }

  if (!record) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">Record Detail</h3>
            <p className="text-blue-100 text-sm">ID: {record.id}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-blue-800 rounded-lg p-2 transition"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Source & Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <SourceInfoCard record={record} />
            <StatusCard record={record} />
          </div>

          {/* Normalized Data */}
          <NormalizedDataCard 
            record={record} 
            editing={editing} 
            editData={editData} 
            setEditData={setEditData} 
          />

          {/* Validation Flags */}
          <ValidationFlags flags={record.validation_flags} />

          {/* Raw Source Data */}
          <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-gray-600">📄</span>
              Raw Source Data
            </h4>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto font-mono">
              {JSON.stringify(record.raw_payload, null, 2)}
            </pre>
          </div>

          {/* Audit Trail */}
          <AuditTrail actions={record.review_actions} />

          {/* Comment Section */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Add Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a comment about this record..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <ActionButtons
          record={record}
          editing={editing}
          actionLoading={actionLoading}
          onEdit={() => setEditing(true)}
          onSave={handleEdit}
          onCancel={() => setEditing(false)}
          onApprove={handleApprove}
          onReject={handleReject}
          onClose={onClose}
        />
      </div>
    </div>
  );
}

export default RecordDetailModal;
