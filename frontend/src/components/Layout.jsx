// src/components/Layout.jsx
import React from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom'; // <-- IMPORTACIÓN CLAVE
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = () => {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Container maxWidth="lg" component="main" sx={{ flexGrow: 1, py: 4 }}>
                {/* Outlet es el "espacio reservado" que renderizará el componente 
                  de la ruta anidada que esté activa (ej: ClientePanelPage).
                */}
                <Outlet />
            </Container>
            <Footer />
        </Box>
    );
};

export default Layout;