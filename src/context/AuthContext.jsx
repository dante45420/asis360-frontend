// src/context/AuthContext.jsx

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const handleLoginSuccess = (token) => {
        // 1. Decodificar el token para obtener los datos del usuario
        const decodedToken = jwtDecode(token);
        const userData = {
            id: decodedToken.sub,
            nombre: decodedToken.nombre,
            rol: decodedToken.rol,
        };

        // 2. Actualizar el estado global y el localStorage
        localStorage.setItem('userToken', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userData);

        // 3. Redirigir según el rol
        if (userData.rol === 'admin') {
            navigate('/admin/dashboard');
        } else if (userData.rol === 'cliente') {
            navigate('/portal/cliente/panel');
        } else if (userData.rol === 'proveedor') {
            navigate('/portal/proveedor/estadisticas');
        } else {
            navigate('/'); // Fallback a la página de inicio
        }
    };

    useEffect(() => {
        // Revisa si hay un token al cargar la aplicación
        const token = localStorage.getItem('userToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                if (decoded.exp * 1000 > Date.now()) {
                    handleLoginSuccess(token); // Reutilizamos la lógica para establecer la sesión
                } else {
                    localStorage.removeItem('userToken');
                }
            } catch (e) {
                localStorage.removeItem('userToken');
            }
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const { token } = await authService.login(email, password);
        handleLoginSuccess(token);
    };

    const logout = () => {
        localStorage.removeItem('userToken');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
        navigate('/login');
    };

    const value = { user, loading, login, logout, handleLoginSuccess };

    if (loading && !user) {
        return <h1>Cargando aplicación...</h1>;
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};