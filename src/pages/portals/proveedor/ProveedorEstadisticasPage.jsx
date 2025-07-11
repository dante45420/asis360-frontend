import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ProveedorEstadisticasPage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Estadísticas de Venta
            </Typography>
            <Paper sx={{ p: 2 }}>
                <Typography variant="body1">
                    Aquí verás gráficos y reportes sobre el rendimiento de tus productos, ventas por período y más.
                </Typography>
            </Paper>
        </Box>
    );
};

export default ProveedorEstadisticasPage;