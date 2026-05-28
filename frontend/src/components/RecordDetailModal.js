import React, { useState, useEffect } from 'react';
import { getRecordDetail, approveRecord, rejectRecord, editRecord } from '../services/api';

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
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-semibold text-gray-900">Record #{record.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Basic Info */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Source Information</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Company:</span>
                <span className="ml-2 text-gray-900">{record.company_name}</span>
              </div>
              <div>
                <span className="text-gray-500">Source Type:</span>
                <span className="ml-2 text-gray-900">{record.source_type}</span>
              </div>
              <div>
                <span className="text-gray-500">File:</span>
                <span className="ml-2 text-gray-900">{record.source_filename}</span>
              </div>
              <div>
                <span className="text-gray-500">Row:</span>
                <span className="ml-2 text-gray-900">#{record.source_row_number}</span>
              </div>
              <div>
                <span className="text-gray-500">Status:</span>
                <span className={`ml-2 px-2 py-1 text-xs rounded ${
                  record.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                  record.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                  record.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {record.status}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Locked:</span>
                <span className="ml-2 text-gray-900">{record.is_locked ? 'Yes' : 'No'}</span>
              </div>
            </div>
          </div>

          {/* Emission Data */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Emission Data</h4>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Activity Type</label>
                  <input
                    type="text"
                    value={editData.activity_type}
                    onChange={(e) => setEditData({ ...editData, activity_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Quantity</label>
                    <input
                      type="number"
                      step="0.0001"
                      value={editData.normalized_quantity}
                      onChange={(e) => setEditData({ ...editData, normalized_quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Unit</label>
                    <input
                      type="text"
                      value={editData.normalized_unit}
                      onChange={(e) => setEditData({ ...editData, normalized_unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Scope</label>
                    <select
                      value={editData.scope_category}
                      onChange={(e) => setEditData({ ...editData, scope_category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    >
                      <option value="SCOPE_1">Scope 1</option>
                      <option value="SCOPE_2">Scope 2</option>
                      <option value="SCOPE_3">Scope 3</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Activity:</span>
                  <span className="ml-2 text-gray-900">{record.activity_type}</span>
                </div>
                <div>
                  <span className="text-gray-500">Scope:</span>
                  <span className="ml-2 text-gray-900">{record.scope_category?.replace('SCOPE_', 'Scope ')}</span>
                </div>
                <div>
                  <span className="text-gray-500">Original:</span>
                  <span className="ml-2 text-gray-900">{record.quantity} {record.original_unit}</span>
                </div>
                <div>
                  <span className="text-gray-500">Normalized:</span>
                  <span className="ml-2 text-gray-900">{record.normalized_quantity} {record.normalized_unit}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-500">Period:</span>
                  <span className="ml-2 text-gray-900">{record.period_start} to {record.period_end}</span>
                </div>
              </div>
            )}
          </div>

          {/* Validation Flags */}
          {record.validation_flags && record.validation_flags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Validation Issues</h4>
              <div className="space-y-2">
                {record.validation_flags.map((flag, idx) => (
                  <div key={idx} className={`p-2 rounded text-sm ${
                    flag.type === 'error' ? 'bg-red-50 text-red-700' :
                    flag.type === 'warning' ? 'bg-orange-50 text-orange-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {flag.message}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Raw Source Data */}
          <div className="mb-6">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Raw Source Data</h4>
            <div className="bg-gray-50 border border-gray-200 rounded p-3">
              <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(record.raw_payload, null, 2)}
              </pre>
            </div>
          </div>

          {/* Audit Trail */}
          {record.review_actions && record.review_actions.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Audit Trail</h4>
              <div className="space-y-2">
                {record.review_actions.map((action) => (
                  <div key={action.id} className="border-l-2 border-gray-300 pl-3 py-1 text-sm">
                    <div className="font-medium text-gray-900">
                      {action.action_type} by {action.created_by}
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(action.created_at).toLocaleString()}
                    </div>
                    {action.comment && (
                      <div className="text-gray-700 mt-1">{action.comment}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
              placeholder="Add a comment..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between">
          <div className="flex gap-2">
            {!record.is_locked && (
              editing ? (
                <>
                  <button
                    onClick={handleEdit}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditing(false)}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="px-4 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                >
                  Edit
                </button>
              )
            )}
          </div>
          <div className="flex gap-2">
            {!record.is_locked && record.status !== 'APPROVED' && (
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 disabled:opacity-50"
              >
                Approve
              </button>
            )}
            {!record.is_locked && record.status !== 'REJECTED' && (
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecordDetailModal;
