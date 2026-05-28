import React, { useState } from 'react';
import { downloadRecords } from '../../services/api';

function DownloadMenu({ filters }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDownload = (sourceType = null) => {
    downloadRecords(filters, sourceType);
    setShowMenu(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center gap-2"
      >
        📥 Download Records
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {showMenu && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
          <button
            onClick={() => handleDownload()}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 rounded-t-lg"
          >
            📊 All Records
          </button>
          <button
            onClick={() => handleDownload('sap')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-t"
          >
            🏭 SAP Data
          </button>
          <button
            onClick={() => handleDownload('utility')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-t"
          >
            ⚡ Utility Data
          </button>
          <button
            onClick={() => handleDownload('travel')}
            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-gray-700 border-t rounded-b-lg"
          >
            ✈️ Travel Data
          </button>
        </div>
      )}
    </div>
  );
}

export default DownloadMenu;
