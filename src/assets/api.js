import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:7080/',
});

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);
export default api;
