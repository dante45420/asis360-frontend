import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress } from '@mui/material';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext';

const VerificarCuentaPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { handleLoginSuccess } = useAuth();

    const registrationData = location.state?.registrationData;

    const [codigo, setCodigo] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    useEffect(() => {
        // --- INICIO DE LA ZONA DE DEPURACIÓN ---
        console.log("--- DEBUG: Datos recibidos en la página de verificación ---");
        console.log("Contenido de registrationData:", registrationData);
        // --- FIN DE LA ZONA DE DEPURACIÓN ---

        if (!registrationData) {
            console.error("No se encontraron datos de registro. Redirigiendo.");
            navigate('/registro');
        }
    }, [registrationData, navigate]);


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        setLoading(true);

        if (!codigo || codigo.length !== 6) {
            setError('Por favor, ingresa un código de 6 dígitos.');
            setLoading(false);
            return;
        }

        try {
            const response = await authService.verificarCodigo(registrationData, codigo);
            
            if (response.token) {
                alert(response.message);
                handleLoginSuccess(response.token);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Error al verificar el código.');
        } finally {
            setLoading(false);
        }
    };

    if (!registrationData) {
        return <CircularProgress />;
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Verificar Cuenta</Typography>
                <Typography variant="body1" sx={{ mt: 2, textAlign: 'center' }}>
                    Hemos enviado un código a tu WhatsApp. Por favor, ingrésalo a continuación.
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="codigo"
                        label="Código de Verificación"
                        autoFocus
                        value={codigo}
                        onChange={(e) => setCodigo(e.target.value)}
                        inputProps={{ maxLength: 6 }}
                    />
                    {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Verificar y Crear Cuenta'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default VerificarCuentaPage;