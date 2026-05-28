import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import UploadCenter from './pages/UploadCenter';
import ReviewDashboard from './pages/ReviewDashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <h1 className="text-xl font-bold text-gray-900">ESG Data Platform</h1>
                </div>
                <div className="ml-6 flex space-x-8">
                  <Link
                    to="/"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-gray-700"
                  >
                    Review Dashboard
                  </Link>
                  <Link
                    to="/upload"
                    className="inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Upload Data
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<ReviewDashboard />} />
            <Route path="/upload" element={<UploadCenter />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
