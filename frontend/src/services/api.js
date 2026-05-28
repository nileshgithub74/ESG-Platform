import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const uploadFile = async (sourceType, file, companyId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('company_id', companyId);
  
  const response = await api.post(`/upload/${sourceType}/`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getRecords = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      // Map 'company' to 'company_id' for backend
      const paramKey = key === 'company' ? 'company_id' : key;
      params.append(paramKey, value);
    }
  });
  
  const response = await api.get(`/records/?${params.toString()}`);
  return response.data;
};

export const getRecordDetail = async (id) => {
  const response = await api.get(`/records/${id}/`);
  return response.data;
};

export const approveRecord = async (id, comment = '') => {
  const response = await api.patch(`/records/${id}/approve/`, { comment });
  return response.data;
};

export const rejectRecord = async (id, comment = '') => {
  const response = await api.patch(`/records/${id}/reject/`, { comment });
  return response.data;
};

export const editRecord = async (id, data) => {
  const response = await api.patch(`/records/${id}/edit/`, data);
  return response.data;
};

export const getDashboardSummary = async () => {
  const response = await api.get('/dashboard/summary/');
  return response.data;
};

export const getCompanies = async () => {
  const response = await api.get('/companies/');
  return response.data;
};

export const createCompany = async (data) => {
  const response = await api.post('/companies/', data);
  return response.data;
};

export const deleteCompany = async (id) => {
  const response = await api.delete(`/companies/${id}/`);
  return response.data;
};

export const downloadRecords = (filters = {}, sourceType = null) => {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  
  if (sourceType) {
    params.append('source_type', sourceType);
  }
  
  params.append('format', 'csv');
  
  window.open(`${API_BASE_URL}/records/export/?${params.toString()}`, '_blank');
};

export default api;
