// src/services/api.js
import axios from 'axios';

// Leemos la URL base desde las variables de entorno de Vite
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/api',
});

// --- INTERCEPTOR MEJORADO ---
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Ahora solo actuamos si el error es 401 Y el mensaje es sobre la expiración
        if (
            error.response &&
            error.response.status === 401 &&
            error.response.data.message === 'El token ha expirado'
        ) {
            console.log("Interceptor detectó token expirado. Cerrando sesión.");
            localStorage.removeItem('userToken');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;