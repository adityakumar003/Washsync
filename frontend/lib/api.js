import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    verify: () => api.get('/auth/verify'),
};

// Machines API
export const machinesAPI = {
    getAll: () => api.get('/machines'),
    getOne: (id) => api.get(`/machines/${id}`),
    occupy: (id, duration) => api.post(`/machines/${id}/occupy`, { duration }),
    release: (id) => api.post(`/machines/${id}/release`),
    joinQueue: (id) => api.post(`/machines/${id}/queue/join`),
    leaveQueue: (id) => api.post(`/machines/${id}/queue/leave`),
};

// Admin API
export const adminAPI = {
    addMachine: (name, branchId) => api.post('/admin/machines', { name, branchId }),
    deleteMachine: (id) => api.delete(`/admin/machines/${id}`),
    updateStatus: (id, status) => api.patch(`/admin/machines/${id}/status`, { status }),
    getUsers: () => api.get('/admin/users'),
    overrideMachine: (id) => api.post(`/admin/machines/${id}/override`),
    assignUserBranch: (userId, branchId) => api.patch(`/admin/users/${userId}/branch`, { branchId }),
};

// Branches API
export const branchesAPI = {
    getAll: () => api.get('/branches'),
    getActive: () => api.get('/branches/active'),
    getOne: (id) => api.get(`/branches/${id}`),
    create: (data) => api.post('/branches', data),
    update: (id, data) => api.patch(`/branches/${id}`, data),
    delete: (id) => api.delete(`/branches/${id}`),
};

// Notifications API
export const notificationsAPI = {
    getAll: () => api.get('/notifications'),
    getUnreadCount: () => api.get('/notifications/unread-count'),
    markAsRead: (id) => api.patch(`/notifications/${id}/read`),
    markAllAsRead: () => api.post('/notifications/read-all'),
};

// Weather API
export const weatherAPI = {
    getWeather: () => api.get('/weather/weather'),
    getAIRecommendation: () => api.get('/weather/ai-recommendation'),
};

export default api;
