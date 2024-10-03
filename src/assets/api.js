import axios from 'axios';

const api = axios.create({
    baseURL: 'https://quiz-app-backend-kzc3.onrender.com',
});

export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);
export default api;
