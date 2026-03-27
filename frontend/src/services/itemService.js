import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const itemApi = axios.create({
  baseURL: API_BASE_URL,
});

const getToken = () => {
  const directToken = localStorage.getItem('token');
  if (directToken) {
    return directToken;
  }

  const studentRaw = localStorage.getItem('std_userInfo');
  if (studentRaw) {
    try {
      const student = JSON.parse(studentRaw);
      if (student?.token) {
        return student.token;
      }
    } catch (error) {
      return null;
    }
  }

  const adminRaw = localStorage.getItem('admin_userInfo');
  if (adminRaw) {
    try {
      const admin = JSON.parse(adminRaw);
      if (admin?.token) {
        return admin.token;
      }
    } catch (error) {
      return null;
    }
  }

  return null;
};

const withAuth = (extraHeaders = {}) => {
  const token = getToken();
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      ...extraHeaders,
    },
  };
};

export const getAllItems = async (filters = {}) => {
  const response = await itemApi.get('/items', {
    ...withAuth(),
    params: {
      ...(filters.category ? { category: filters.category } : {}),
      ...(filters.status ? { status: filters.status } : {}),
    },
  });
  return response.data;
};

export const getItemById = async (id) => {
  const response = await itemApi.get(`/items/${id}`, withAuth());
  return response.data;
};

export const getSimilarItems = async (category, excludeId) => {
  const response = await itemApi.get('/items', {
    ...withAuth(),
    params: {
      category,
      status: 'Available',
      limit: 4,
      excludeId,
    },
  });

  const data = Array.isArray(response.data) ? response.data : [];
  return data.filter((item) => item._id !== excludeId);
};

export const createItem = async (formData) => {
  const response = await itemApi.post('/items', formData, withAuth());
  return response.data;
};

export const getMyListings = async () => {
  const response = await itemApi.get('/items/my', withAuth());
  return response.data;
};

export const updateItem = async (id, formData) => {
  const response = await itemApi.put(`/items/${id}`, formData, withAuth());
  return response.data;
};

export const deleteItem = async (id) => {
  const response = await itemApi.delete(`/items/${id}`, withAuth());
  return response.data;
};
