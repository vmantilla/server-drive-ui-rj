import axios from 'axios';

// Configura axios
axios.defaults.baseURL = "http://192.168.20.35:3000";
axios.interceptors.request.use(function (config) {
  const token = localStorage.getItem('token');
  config.headers.Authorization = token ? `Bearer ${token}` : '';
  return config;
});

export const getComponentsFromAPI = async (selectedPreview) => {
  const response = await axios.get(`/previews/${selectedPreview}/components`);
  return response.data;
};

export const saveComponentsToAPI = async (selectedPreview, components) => {
  const response = await axios.put(`/previews/${selectedPreview}/components`, { components });
  return response.data;
};
