import React from 'react';

function ActionButtons({ 
  record, 
  editing, 
  actionLoading, 
  onEdit, 
  onSave, 
  onCancel, 
  onApprove, 
  onReject, 
  onClose 
}) {
  return (
    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
      <div className="flex gap-2">
        {!record.is_locked && (
          <>
            {editing ? (
              <>
                <button
                  onClick={onSave}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-semibold transition"
                >
                  💾 Save Changes
                </button>
                <button
                  onClick={onCancel}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={onEdit}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-semibold transition"
              >
                ✏️ Edit
              </button>
            )}
          </>
        )}
      </div>
      <div className="flex gap-2">
        {!record.is_locked && record.status !== 'APPROVED' && (
          <button
            onClick={onApprove}
            disabled={actionLoading}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 font-semibold transition"
          >
            ✓ Approve & Lock
          </button>
        )}
        {!record.is_locked && record.status !== 'REJECTED' && (
          <button
            onClick={onReject}
            disabled={actionLoading}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 font-semibold transition"
          >
            ✗ Reject
          </button>
        )}
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default ActionButtons;
