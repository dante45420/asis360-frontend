// src/components/portals/cliente/panel/PerfilView.jsx
import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, CircularProgress, Alert, Grid, Paper, Typography } from '@mui/material';
import portalService from '../../../../services/portalService';

const PerfilView = () => {
    const [profile, setProfile] = useState({ nombre: '', rut: '', direccion: '' });
    const [initialProfile, setInitialProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        portalService.getMiPerfil()
            .then(data => {
                setProfile(data);
                setInitialProfile(data);
            })
            .catch(() => setError('No se pudo cargar tu perfil.'))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setError('');
        setSuccess('');
        try {
            const dataToUpdate = {
                nombre: profile.nombre,
                rut: profile.rut,
                direccion: profile.direccion
            };
            const response = await portalService.updateMiPerfil(dataToUpdate);
            setSuccess(response.message);
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar el perfil.');
        }
    };

    const handleCancel = () => {
        setProfile(initialProfile);
        setIsEditing(false);
    }

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4}}><CircularProgress /></Box>;
    if (error && !isEditing) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper sx={{ p: { xs: 2, sm: 3, md: 4 }, borderRadius: 3, maxWidth: '800px', width: '100%' }}>
                <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3 }}>
                    Mi Perfil de Empresa
                </Typography>
                <Grid container spacing={3}>
                    <Grid item xs={12}><TextField label="Nombre o Razón Social" name="nombre" value={profile.nombre} onChange={handleChange} fullWidth disabled={!isEditing} variant="outlined" /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="RUT" name="rut" value={profile.rut || ''} onChange={handleChange} fullWidth disabled={!isEditing} variant="outlined" /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Email" name="email" value={profile.email || ''} fullWidth disabled variant="outlined" helperText="Campo no editable" /></Grid>
                    <Grid item xs={12} sm={6}><TextField label="Teléfono" name="telefono" value={profile.telefono || ''} fullWidth disabled variant="outlined" helperText="Campo no editable" /></Grid>
                    <Grid item xs={12}><TextField label="Dirección de Despacho Principal" name="direccion" value={profile.direccion || ''} onChange={handleChange} fullWidth multiline rows={2} disabled={!isEditing} variant="outlined" /></Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-start' }}>
                    {isEditing ? (
                        <>
                            <Button variant="contained" onClick={handleSave}>Guardar Cambios</Button>
                            <Button variant="outlined" onClick={handleCancel}>Cancelar</Button>
                        </>
                    ) : (
                        <Button variant="contained" onClick={() => setIsEditing(true)}>Editar Perfil</Button>
                    )}
                </Box>
                {success && <Alert severity="success" sx={{mt: 2}}>{success}</Alert>}
                {error && isEditing && <Alert severity="error" sx={{mt: 2}}>{error}</Alert>}
            </Paper>
        </Box>
    );
};

export default PerfilView;