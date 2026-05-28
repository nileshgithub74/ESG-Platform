import React from 'react';

function AuditTrail({ actions }) {
  if (!actions || actions.length === 0) return null;

  const getActionStyle = (actionType) => {
    switch (actionType) {
      case 'APPROVE':
        return 'bg-green-100 text-green-800';
      case 'REJECT':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
      <h4 className="font-bold text-gray-900 mb-4">
        Audit Trail
      </h4>
      <div className="space-y-3">
        {actions.map((action) => (
          <div key={action.id} className="bg-white border-l-4 border-purple-500 p-4 rounded-r-lg shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${getActionStyle(action.action_type)}`}>
                {action.action_type}
              </span>
              <span className="text-xs text-gray-500">{new Date(action.created_at).toLocaleString()}</span>
            </div>
            <p className="text-sm text-gray-700 font-medium">by {action.created_by}</p>
            {action.comment && (
              <p className="text-sm text-gray-600 mt-2 italic">"{action.comment}"</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuditTrail;
