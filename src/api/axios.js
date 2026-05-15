import axios from 'axios';

const PRODUCTION_API = 'https://voliere-api-production.up.railway.app/api'
const LOCAL_API = 'http://localhost:8000/api'

const baseURL =
    import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? PRODUCTION_API : LOCAL_API)

const api = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
})

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || ''
            const isAuthRoute = requestUrl.includes('/login') || requestUrl.includes('/register')

            if (!isAuthRoute) {
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api;
