import axios from 'axios';

// Default backend URL (Azure)
const DEFAULT_API_BASE_URL =
    'https://elm-backend-hmfydpb4gzgggmec.uaenorth-01.azurewebsites.net/api';

// Read env variable safely
const rawApiBaseUrl =
    import.meta.env.VITE_API_BASE_URL;

// Decide final API base URL
let API_BASE_URL = DEFAULT_API_BASE_URL;

if (
    rawApiBaseUrl &&
    rawApiBaseUrl !== '/api' &&
    rawApiBaseUrl.indexOf('/api/') !== 0
) {
    API_BASE_URL = rawApiBaseUrl;
}

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
});

// ========================
// REQUEST INTERCEPTOR
// ========================
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    config.headers = config.headers || {};

    if (token) {
        config.headers.Authorization = 'Bearer ' + token;
    }

    return config;
});

// ========================
// RESPONSE INTERCEPTOR
// ========================
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // No auto redirect here (handled in AuthContext)
        return Promise.reject(error);
    }
);

// ========================
// AUTH APIs
// ========================
export const authAPI = {
    login: (credentials) => {
        return api.post('/auth/login', credentials);
    },

    register: (userData) => {
        return api.post('/auth/register', userData);
    },
};

// ========================
// LEAVE APIs
// ========================
export const leaveAPI = {
    applyLeave: (leaveData) => {
        // If already FormData, send directly
        if (leaveData instanceof FormData) {
            return api.post('/leave/apply', leaveData);
        }

        // Convert object to FormData
        const formData = new FormData();

        for (const key in leaveData) {
            if (
                leaveData[key] !== null &&
                leaveData[key] !== undefined
            ) {
                formData.append(key, leaveData[key]);
            }
        }

        return api.post('/leave/apply', formData);
    },

    getMyLeaves: () => {
        return api.get('/leave/my');
    },

    getPendingLeaves: () => {
        return api.get('/leave/pending');
    },

    approveLeave: (id, comment) => {
        return api.put(`/leave/approve/${id}`, {
            manager_comment: comment,
        });
    },

    rejectLeave: (id, comment) => {
        return api.put(`/leave/reject/${id}`, {
            manager_comment: comment,
        });
    },
};

export default api;