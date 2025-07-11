import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ProveedorPedidosPage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Pedidos Recibidos
            </Typography>
            <Paper sx={{ p: 2 }}>
                <Typography variant="body1">
                    Aquí verás la lista de pedidos que han realizado los clientes para tus productos.
                </Typography>
            </Paper>
        </Box>
    );
};

export default ProveedorPedidosPage;