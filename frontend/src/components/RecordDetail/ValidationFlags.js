import React from 'react';

function ValidationFlags({ flags }) {
  if (!flags || flags.length === 0) return null;

  const getFlagStyle = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'warning':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      default:
        return 'bg-blue-100 text-blue-800 border border-blue-200';
    }
  };

  return (
    <div className="bg-orange-50 rounded-lg p-5 border border-orange-200">
      <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-orange-600">⚠️</span>
        Validation Flags
      </h4>
      <div className="space-y-2">
        {flags.map((flag, idx) => (
          <div key={idx} className={`p-3 rounded-lg text-sm font-medium ${getFlagStyle(flag.type)}`}>
            {flag.message}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ValidationFlags;
