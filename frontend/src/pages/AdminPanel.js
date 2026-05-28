import React, { useState, useEffect } from 'react';
import api from '../services/api';

function AdminPanel() {
  const [companies, setCompanies] = useState([]);
  const [dataSources, setDataSources] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('companies');
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({ name: '', code: '' });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [companiesRes, sourcesRes, statsRes] = await Promise.all([
        api.get('/companies/'),
        api.get('/data-sources/'),
        api.get('/dashboard/summary/'),
      ]);
      setCompanies(companiesRes.data.results || companiesRes.data);
      setDataSources(sourcesRes.data.results || sourcesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCompany = async (e) => {
    e.preventDefault();
    try {
      await api.post('/companies/', newCompany);
      setNewCompany({ name: '', code: '' });
      setShowAddCompany(false);
      loadData();
    } catch (error) {
      alert('Failed to create company: ' + (error.response?.data?.detail || 'Unknown error'));
    }
  };

  const handleDeleteCompany = async (id) => {
    if (!window.confirm('Are you sure you want to delete this company?')) return;
    try {
      await api.delete(`/companies/${id}/`);
      loadData();
    } catch (error) {
      alert('Failed to delete company');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Panel</h2>
        <p className="text-gray-600">Manage companies, view data sources, and system statistics</p>
      </div>

      {/* Statistics Cards */}
      {stats && (
