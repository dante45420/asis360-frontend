// src/components/portals/cliente/SolicitarProducto.jsx
import React, { useState } from 'react';
import { Box, Button, Paper, Typography } from '@mui/material';
import SolicitarProductoModal from './SolicitarProductoModal';
import portalService from '../../../services/portalService';

const SolicitarProducto = ({ setSnackbar }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const handleSave = async (formData) => {
        try {
            const response = await portalService.solicitarProducto(formData.nombre_producto, formData.descripcion);
            setSnackbar({ open: true, message: response.message });
            setModalOpen(false);
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.message || 'Error al enviar la solicitud.' });
        }
    };

    return (
        <>
            <Paper sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">¿Necesitas algo que no está en el catálogo?</Typography>
                <Button variant="contained" onClick={() => setModalOpen(true)}>
                    Solicitar un Producto
                </Button>
            </Paper>
            <SolicitarProductoModal
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />
        </>
    );
};

export default SolicitarProducto;