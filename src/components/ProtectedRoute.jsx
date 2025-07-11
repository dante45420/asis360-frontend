// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();
    const location = useLocation();

    if (!user) {
        // Si no hay usuario, lo redirigimos a la página de login
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.rol)) {
        // Si el usuario está logueado pero no tiene el rol permitido,
        // lo redirigimos a una página de "No Autorizado" o al inicio.
        // Por ahora, lo mandamos al inicio.
        return <Navigate to="/" replace />;
    }

    // Si el usuario está logueado y tiene el rol correcto, mostramos la página.
    return children;
};

export default ProtectedRoute;