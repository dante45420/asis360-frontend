// src/components/ErrorBoundary.jsx

import React from 'react';
import { Box, Typography, Button, Alert, AlertTitle } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    // Este método actualiza el estado para que el siguiente renderizado muestre la UI de fallback.
    static getDerivedStateFromError(error) {
        return { hasError: true, error: error };
    }

    // Este método es para registrar la información del error en algún servicio de logging
    componentDidCatch(error, errorInfo) {
        console.error("Error atrapado por el Error Boundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // Si hay un error, renderizamos una UI de emergencia amigable
            return (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                    <Alert severity="error" variant="outlined" sx={{ p: 4 }}>
                        <AlertTitle>¡Oops! Algo salió mal</AlertTitle>
                        <Typography variant="body1">
                            Lo sentimos, ha ocurrido un error inesperado en la aplicación.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="error" 
                            onClick={() => window.location.reload()} 
                            sx={{ mt: 2 }}
                        >
                            Recargar la Página
                        </Button>
                    </Alert>
                </Box>
            );
        }

        // Si no hay error, renderizamos los componentes hijos normalmente
        return this.props.children; 
    }
}

export default ErrorBoundary;