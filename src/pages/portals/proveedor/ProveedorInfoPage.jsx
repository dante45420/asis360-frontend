import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ProveedorInfoPage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Información de mi Empresa
            </Typography>
            <Paper sx={{ p: 2 }}>
                <Typography variant="body1">
                    Aquí podrás ver y editar la información de tu perfil de proveedor, como datos de contacto y calidad de servicio.
                </Typography>
            </Paper>
        </Box>
    );
};

export default ProveedorInfoPage;