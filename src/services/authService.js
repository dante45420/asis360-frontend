// src/services/authService.js
import api from './api';

const login = async (email, password) => {
    try {
        // Usamos la instancia 'api' centralizada en lugar de 'axios' directamente
        const response = await api.post('/auth/login', {
            email,
            password,
        });
        
        // Si el login es exitoso, guardamos el token en el almacenamiento local del navegador
        if (response.data.token) {
            localStorage.setItem('userToken', response.data.token);
        }
        
        // Devolvemos los datos del backend para que el contexto los use
        return response.data;
    } catch (error) {
        // El interceptor en 'api.js' manejará los errores 401.
        // Aquí solo nos preocupamos de otros posibles errores de login.
        console.error("Error en el inicio de sesión:", error.response?.data?.message || error.message);
        throw new Error(error.response?.data?.message || 'Error al intentar iniciar sesión.');
    }
};

const register = async (userData) => {
    try {
        const response = await api.post('/auth/registro', {
            nombre: userData.nombre,
            email: userData.email,
            telefono: userData.telefono,
            password: userData.password,
        });
        return response.data;
    } catch (error) {
        // Logueamos el error para depuración, como ya lo haces.
        console.error("Error en el registro:", error.response?.data?.message || error.message);
        
        // --- CAMBIO MÍNIMO Y CRUCIAL ---
        // En lugar de crear un nuevo error, lanzamos el error original.
        // Esto preserva todos los detalles, como el código de estado 202.
        throw error;
    }
};

const verificarCodigo = async (registrationData, codigo) => {
    // --- LÓGICA CORREGIDA ---
    // Combinamos los datos originales del formulario con el código de verificación.
    const payload = {
        nombre: registrationData.nombre,
        email: registrationData.email,
        telefono: registrationData.telefono,
        password: registrationData.password,
        codigo: codigo,
    };

    try {
        // Hacemos la llamada a la API con el payload completo.
        const response = await api.post('/auth/verificar', payload);
        
        // Si la verificación es exitosa, guardamos el nuevo token.
        if (response.data.token) {
            localStorage.setItem('userToken', response.data.token);
        }
        return response.data;

    } catch (error) {
        console.error("Error al verificar el código:", error.response?.data?.message || error.message);
        // Lanzamos el error original para que el componente muestre el mensaje correcto.
        throw error;
    }
};
const authService = {
    login,
    register,
    verificarCodigo,
};

export default authService;