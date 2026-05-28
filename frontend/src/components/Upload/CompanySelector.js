import React from 'react';

function CompanySelector({ 
  companies, 
  companyId, 
  setCompanyId, 
  showAddCompany, 
  setShowAddCompany,
  newCompany,
  setNewCompany,
  onAddCompany 
}) {
  return (
    <div className="mb-6 bg-white rounded-lg shadow p-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Company
      </label>
      <div className="flex gap-2">
        <select
          value={companyId}
          onChange={(e) => setCompanyId(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a company...</option>
          {companies.map(company => (
            <option key={company.id} value={company.id}>
              {company.name} ({company.code})
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowAddCompany(!showAddCompany)}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          + Add Company
        </button>
      </div>

      {showAddCompany && (
        <form onSubmit={onAddCompany} className="mt-4 p-4 bg-gray-50 rounded">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                required
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., Acme Corporation"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Code
              </label>
              <input
                type="text"
                required
                value={newCompany.code}
                onChange={(e) => setNewCompany({ ...newCompany, code: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., ACME"
              />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              Create Company
            </button>
            <button
              type="button"
              onClick={() => setShowAddCompany(false)}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default CompanySelector;
