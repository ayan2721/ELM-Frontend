import axios from 'axios';

const api = axios.create({
    baseURL: 'https://elm-backend-hmfydpb4gzgggmec.uaenorth-01.azurewebsites.net/api',
    timeout: 10000,
});

export default api;