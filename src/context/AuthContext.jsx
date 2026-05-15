import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import authService from '../api/services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    /**
     * Récupérer l'utilisateur connecté au chargement
     */
    useEffect(() => {
        const loadUser = async () => {
            const storedToken = localStorage.getItem('token');
            
            if (storedToken) {
                try {
                    const userData = await authService.getCurrentUser();
                    setUser(userData);
                    setToken(storedToken);
                } catch (error) {
                    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
                    // Token invalide, nettoyer
                    localStorage.removeItem('token');
                    setToken(null);
                    setUser(null);
                }
            }
            
            setLoading(false);
        };

        loadUser();
    }, []);

    /**
     * Définir les données d'authentification (user et token)
     * Utilisé après authService.login()
     */
    const setAuthData = (userData, authToken) => {
        setUser(userData);
        setToken(authToken);
        localStorage.setItem('token', authToken);
    };

    /**
     * Déconnexion
     */
    const logout = async () => {
        try {
            await api.post('/logout');
        } catch (error) {
            console.log(error);
        } finally {
            setUser(null);
            setToken(null);
            localStorage.removeItem('token');
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, setAuthData, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);