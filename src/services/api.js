import axios from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'https://elm-backend-hmfydpb4gzgggmec.uaenorth-01.azurewebsites.net/api';

// Create axios instance (don't set token here - let AuthContext handle it)
const api = axios.create({
    baseURL: API_BASE_URL,
});

// ✅ Request interceptor: Attach token from localStorage
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    config.headers = config.headers || {};
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// ✅ Response interceptor: Only reject, don't auto-redirect
// AuthContext will handle logout on invalid token
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Don't redirect here - let the component handle auth errors
        // This prevents redirect loops during auth flows
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    login: (credentials) =>
        api.post('/auth/login', credentials),

    register: (userData) =>
        api.post('/auth/register', userData),
};

// Leave APIs
export const leaveAPI = {
    applyLeave: (leaveData) => {
        // If already FormData, use it directly
        if (leaveData instanceof FormData) {
            return api.post('/leave/apply', leaveData);
        }

        // Otherwise, wrap in FormData
        const formData = new FormData();

        Object.keys(leaveData).forEach((key) => {
            if (
                leaveData[key] !== null &&
                leaveData[key] !== undefined
            ) {
                formData.append(key, leaveData[key]);
            }
        });

        return api.post('/leave/apply', formData);
    },

    getMyLeaves: () =>
        api.get('/leave/my'),

    getPendingLeaves: () =>
        api.get('/leave/pending'),

    approveLeave: (id, comment) =>
        api.put(`/leave/approve/${id}`, {
            manager_comment: comment,
        }),

    rejectLeave: (id, comment) =>
        api.put(`/leave/reject/${id}`, {
            manager_comment: comment,
        }),
};

export default api;