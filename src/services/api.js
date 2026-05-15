import axios from 'axios';

// Default backend URL (Azure)
const DEFAULT_API_BASE_URL =
    'https://elm-backend-hmfydpb4gzgggmec.uaenorth-01.azurewebsites.net/api';

// Read env variable safely
const rawApiBaseUrl =
    import.meta.env.VITE_API_BASE_URL?.trim();

const resolveApiBaseUrl = () => {
    if (!rawApiBaseUrl) {
        return DEFAULT_API_BASE_URL;
    }

    try {
        const resolvedUrl = new URL(rawApiBaseUrl, window.location.origin);

        // If the env value points at the same static frontend origin and uses /api,
        // ignore it and fall back to the real backend URL.
        if (
            resolvedUrl.origin === window.location.origin &&
            resolvedUrl.pathname.startsWith('/api')
        ) {
            return DEFAULT_API_BASE_URL;
        }

        return resolvedUrl.toString();
    } catch (error) {
        return DEFAULT_API_BASE_URL;
    }
};

const API_BASE_URL = resolveApiBaseUrl();

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
