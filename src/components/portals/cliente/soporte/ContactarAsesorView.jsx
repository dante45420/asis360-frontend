// src/components/portals/cliente/soporte/ContactarAsesorView.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, FormControl, FormControlLabel, Radio, RadioGroup, TextField, CircularProgress, Alert, Select, MenuItem, InputLabel } from '@mui/material';
import portalService from '../../../../services/portalService';

const ContactarAsesorView = () => {
    const [metodo, setMetodo] = useState('whatsapp');
    const [detalles, setDetalles] = useState('');
    const [disponibilidad, setDisponibilidad] = useState([]);
    const [loadingDisponibilidad, setLoadingDisponibilidad] = useState(false);
    const [selectedSlotId, setSelectedSlotId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        if (metodo === 'reunion') {
            const fetchDisponibilidad = async () => {
                setLoadingDisponibilidad(true);
                try {
                    const data = await portalService.getDisponibilidadReuniones();
                    setDisponibilidad(data);
                } catch (err) {
                    setError('No se pudieron cargar los horarios disponibles.');
                } finally {
                    setLoadingDisponibilidad(false);
                }
            };
            fetchDisponibilidad();
        }
    }, [metodo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (metodo === 'reunion' && !selectedSlotId) {
            setError('Por favor, selecciona un horario para la reunión.');
            return;
        }
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const payload = {
                metodo,
                detalles,
                disponibilidad_id: metodo === 'reunion' ? selectedSlotId : null
            };
            const response = await portalService.solicitarAsesor(payload);
            setSuccess(response.message);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al enviar la solicitud.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" gutterBottom>Contactar a un Asesor</Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                Si necesitas ayuda personalizada, elige un método de contacto y envíanos tu solicitud.
            </Typography>

            <FormControl component="fieldset" margin="normal">
                <RadioGroup row name="metodo" value={metodo} onChange={(e) => setMetodo(e.target.value)}>
                    <FormControlLabel value="whatsapp" control={<Radio />} label="WhatsApp" />
                    <FormControlLabel value="email" control={<Radio />} label="Email" />
                    <FormControlLabel value="telefono" control={<Radio />} label="Llamada Telefónica" />
                    <FormControlLabel value="reunion" control={<Radio />} label="Reunión Virtual" />
                </RadioGroup>
            </FormControl>

            <TextField
                margin="normal"
                fullWidth
                label="Cuéntanos brevemente tu consulta (opcional)"
                multiline
                rows={3}
                value={detalles}
                onChange={(e) => setDetalles(e.target.value)}
            />

            {metodo === 'reunion' && (
                <FormControl fullWidth margin="normal">
                    <InputLabel id="horario-reunion-label">Selecciona un horario disponible</InputLabel>
                    <Select
                        labelId="horario-reunion-label"
                        value={selectedSlotId}
                        label="Selecciona un horario disponible"
                        onChange={(e) => setSelectedSlotId(e.target.value)}
                        disabled={loadingDisponibilidad}
                    >
                        {loadingDisponibilidad ? (
                            <MenuItem disabled>Cargando horarios...</MenuItem>
                        ) : disponibilidad.length > 0 ? (
                            disponibilidad.map(slot => (
                                <MenuItem key={slot.id} value={slot.id}>
                                    {new Date(slot.fecha_hora).toLocaleString('es-CL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>No hay horarios disponibles por el momento.</MenuItem>
                        )}
                    </Select>
                </FormControl>
            )}

            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
            {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}

            <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={loading || !!success}
            >
                {loading ? <CircularProgress size={24} /> : 'Enviar Solicitud'}
            </Button>
        </Box>
    );
};

export default ContactarAsesorView;