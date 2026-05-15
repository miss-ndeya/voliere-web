import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Ajoute automatiquement le token à chaque requête
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Gère les erreurs 401 (token expiré)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ne rediriger que si on n'est PAS déjà sur la page de login
        // et que l'erreur 401 vient d'une route protégée (pas de /login ou /register)
        if (error.response?.status === 401) {
            const requestUrl = error.config?.url || ''
            const isAuthRoute = requestUrl.includes('/login') || requestUrl.includes('/register')
            
            // Si ce n'est pas une route d'authentification, rediriger
            if (!isAuthRoute) {
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

export default api;