import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

const ProveedorContactoPage = () => {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Contacto de Soporte
            </Typography>
            <Paper sx={{ p: 2 }}>
                <Typography variant="body1">
                    Utiliza este espacio para contactar a nuestro equipo de soporte si tienes algún problema o consulta.
                </Typography>
            </Paper>
        </Box>
    );
};

export default ProveedorContactoPage;