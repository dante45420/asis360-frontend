// src/pages/AdminCatalogoPage.jsx
import React, { useState } from 'react';
import { Typography, Box, Tabs, Tab } from '@mui/material';

// Importaremos los componentes de gestión para cada pestaña
import GestionProveedores from '../../components/admin/GestionProveedores';
import GestionProductos from '../../components/admin/GestionProductos';

const AdminCatalogoPage = () => {
    // 1. Estado para controlar la pestaña activa. '0' para Proveedores, '1' para Productos.
    const [activeTab, setActiveTab] = useState(0);

    // 2. Manejador para cambiar de pestaña
    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>Gestión de Catálogo</Typography>
            
            {/* 3. Barra de Navegación con Pestañas */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="pestañas de gestión de catálogo">
                    <Tab label="Proveedores" />
                    <Tab label="Productos" />
                    <Tab label="Reseñas" disabled /> {/* Pestaña deshabilitada para el futuro */}
                </Tabs>
            </Box>

            {/* 4. Renderizado Condicional del Contenido */}
            {activeTab === 0 && (
                <GestionProveedores />
            )}
            {activeTab === 1 && (
                <GestionProductos />
            )}
        </>
    );
};

export default AdminCatalogoPage;