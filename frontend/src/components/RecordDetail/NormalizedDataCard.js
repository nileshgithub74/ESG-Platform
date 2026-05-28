import React from 'react';

function NormalizedDataCard({ record, editing, editData, setEditData }) {
  if (editing) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
        <h4 className="font-bold text-gray-900 mb-4">
          Normalized Data (Editing)
        </h4>
        <div className="space-y-4 bg-white p-4 rounded-lg">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Activity Type</label>
            <input
              type="text"
              value={editData.activity_type}
              onChange={(e) => setEditData({ ...editData, activity_type: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Quantity</label>
              <input
                type="number"
                step="0.0001"
                value={editData.normalized_quantity}
                onChange={(e) => setEditData({ ...editData, normalized_quantity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Unit</label>
              <input
                type="text"
                value={editData.normalized_unit}
                onChange={(e) => setEditData({ ...editData, normalized_unit: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Scope</label>
            <select
              value={editData.scope_category}
              onChange={(e) => setEditData({ ...editData, scope_category: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="SCOPE_1">Scope 1 - Direct Emissions</option>
              <option value="SCOPE_2">Scope 2 - Indirect Emissions</option>
              <option value="SCOPE_3">Scope 3 - Value Chain</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
      <h4 className="font-bold text-gray-900 mb-4">
        Normalized Data
      </h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Activity Type</p>
          <p className="text-gray-900 font-semibold">{record.activity_type}</p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Scope</p>
          <p className="text-gray-900 font-semibold">{record.scope_category?.replace('SCOPE_', 'Scope ')}</p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Original Value</p>
          <p className="text-gray-900 font-semibold">{record.quantity} {record.original_unit}</p>
        </div>
        <div className="bg-white p-4 rounded-lg">
          <p className="text-xs text-gray-500 mb-1">Normalized Value</p>
          <p className="text-gray-900 font-semibold">{record.normalized_quantity} {record.normalized_unit}</p>
        </div>
        <div className="bg-white p-4 rounded-lg col-span-2">
          <p className="text-xs text-gray-500 mb-1">Period</p>
          <p className="text-gray-900 font-semibold">{record.period_start} to {record.period_end}</p>
        </div>
      </div>
    </div>
  );
}

export default NormalizedDataCard;
