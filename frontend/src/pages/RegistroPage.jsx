// src/pages/RegistroPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Container, Box, Typography, TextField, Button, Alert, CircularProgress, Link as MuiLink } from '@mui/material';
import authService from '../services/authService';
import { useAuth } from '../context/AuthContext'; // Importamos el contexto

const RegistroPage = () => {
    const navigate = useNavigate();
    const { handleLoginSuccess } = useAuth(); // Usamos la nueva función del contexto
    const [formData, setFormData] = useState({
        nombre: '', email: '', telefono: '', password: '', confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Las contraseñas no coinciden.');
        }
        
        setLoading(true);
        try {
            // Hacemos la llamada al servicio de registro
            const response = await authService.register(formData);
            
            // --- LÓGICA FINAL Y CORRECTA ---
            // Ahora, dentro del 'try', revisamos qué tipo de respuesta exitosa recibimos.

            if (response.token) {
                // CASO 1: Éxito con auto-login (el backend devolvió un token)
                alert(response.message);
                handleLoginSuccess(response.token);

            } else if (response.requires_verification) {
                // CASO 2: Éxito con verificación requerida (el backend devolvió el flag)
                alert(response.message);
                navigate('/verificar-cuenta', { state: { registrationData: formData } });
            
            } else {
                // Caso inesperado: respuesta exitosa pero sin token ni flag de verificación.
                throw new Error("Respuesta inesperada del servidor.");
            }

        } catch (err) {
            // El bloque 'catch' ahora solo manejará errores reales (ej. 409, 500).
            console.error("Error en el registro:", err);
            setError(err.response?.data?.message || 'Error al intentar registrarse.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">Crear Cuenta</Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField margin="normal" required fullWidth name="nombre" label="Nombre Completo" value={formData.nombre} onChange={handleChange} />
                    <TextField margin="normal" required fullWidth name="email" label="Correo Electrónico" value={formData.email} onChange={handleChange} />
                    <TextField margin="normal" required fullWidth name="telefono" label="Teléfono (ej: 56912345678)" value={formData.telefono} onChange={handleChange} />
                    <TextField margin="normal" required fullWidth name="password" label="Contraseña" type="password" value={formData.password} onChange={handleChange} />
                    <TextField margin="normal" required fullWidth name="confirmPassword" label="Confirmar Contraseña" type="password" value={formData.confirmPassword} onChange={handleChange} />
                    
                    {error && <Alert severity="error" sx={{ mt: 2, width: '100%' }}>{error}</Alert>}
                    
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={loading}>
                        {loading ? <CircularProgress size={24} /> : 'Registrarse'}
                    </Button>

                    <Box textAlign="center">
                        <MuiLink component={RouterLink} to="/login" variant="body2">
                            {"¿Ya tienes una cuenta? Inicia sesión"}
                        </MuiLink>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default RegistroPage;