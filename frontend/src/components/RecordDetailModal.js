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
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900">Record Detail - ID {record.id}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Source Information</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-600">Company:</span> {record.company_name}</div>
                <div><span className="text-gray-600">Source File:</span> {record.source_filename}</div>
                <div><span className="text-gray-600">Source Type:</span> {record.source_type}</div>
                <div><span className="text-gray-600">Row Number:</span> {record.source_row_number}</div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Status</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-600">Status:</span> {record.status}</div>
                <div><span className="text-gray-600">Locked:</span> {record.is_locked ? 'Yes' : 'No'}</div>
                <div><span className="text-gray-600">Created:</span> {new Date(record.created_at).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Normalized Data</h4>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Activity Type</label>
                  <input
                    type="text"
                    value={editData.activity_type}
                    onChange={(e) => setEditData({ ...editData, activity_type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                      type="number"
                      value={editData.normalized_quantity}
                      onChange={(e) => setEditData({ ...editData, normalized_quantity: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                    <input
                      type="text"
                      value={editData.normalized_unit}
                      onChange={(e) => setEditData({ ...editData, normalized_unit: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
                  <select
                    value={editData.scope_category}
                    onChange={(e) => setEditData({ ...editData, scope_category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="SCOPE_1">Scope 1</option>
                    <option value="SCOPE_2">Scope 2</option>
                    <option value="SCOPE_3">Scope 3</option>
                  </select>
                </div>
              </div>
            ) : (
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-600">Activity Type:</span> {record.activity_type}</div>
                <div><span className="text-gray-600">Scope:</span> {record.scope_category}</div>
                <div><span className="text-gray-600">Original:</span> {record.quantity} {record.original_unit}</div>
                <div><span className="text-gray-600">Normalized:</span> {record.normalized_quantity} {record.normalized_unit}</div>
                <div><span className="text-gray-600">Period:</span> {record.period_start} to {record.period_end}</div>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Validation Flags</h4>
            <div className="space-y-2">
              {record.validation_flags?.map((flag, idx) => (
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

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">Raw Source Data</h4>
            <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
              {JSON.stringify(record.raw_payload, null, 2)}
            </pre>
          </div>

          {record.review_actions && record.review_actions.length > 0 && (
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Audit Trail</h4>
              <div className="space-y-2">
                {record.review_actions.map((action) => (
                  <div key={action.id} className="border-l-4 border-blue-500 pl-3 py-2 text-sm">
                    <div className="font-medium">{action.action_type} by {action.created_by}</div>
                    <div className="text-gray-600 text-xs">{new Date(action.created_at).toLocaleString()}</div>
                    {action.comment && <div className="text-gray-700 mt-1">{action.comment}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Add a comment..."
            />
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-between">
          <div className="flex gap-2">
            {!record.is_locked && (
              <>
                {editing ? (
                  <>
                    <button
                      onClick={handleEdit}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditing(false)}
                      disabled={actionLoading}
                      className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
          <div className="flex gap-2">
            {!record.is_locked && record.status !== 'APPROVED' && (
              <button
                onClick={handleApprove}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
              >
                Approve & Lock
              </button>
            )}
            {!record.is_locked && record.status !== 'REJECTED' && (
              <button
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
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
