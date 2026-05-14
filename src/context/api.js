import axios from 'axios';

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    'https://elm-backend-hmfydpb4gzgggmec.uaenorth-01.azurewebsites.net/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
});

export default api;