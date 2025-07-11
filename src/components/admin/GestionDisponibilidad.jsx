// src/components/admin/GestionDisponibilidad.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, IconButton, CircularProgress, Alert, Paper, Divider, FormGroup, FormControlLabel, Checkbox, TextField, Grid } from '@mui/material';
import { DateTimePicker, DatePicker, TimePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import adminService from '../../services/adminService';

const diasSemanaMap = [ {label: 'L', value: 0}, {label: 'M', value: 1}, {label: 'X', value: 2}, {label: 'J', value: 3}, {label: 'V', value: 4}, {label: 'S', value: 5}, {label: 'D', value: 6} ];

const FormularioLote = ({ onAddLote, loading }) => {
    const [formState, setFormState] = useState({
        fecha_inicio: new Date(),
        fecha_fin: new Date(),
        dias_semana: [0,1,2,3,4], // Lunes a Viernes por defecto
        hora_inicio: '09:00',
        hora_fin: '18:00',
        duracion_slot_minutos: 30
    });

    const handleDiasChange = (dayValue) => {
        setFormState(prev => ({
            ...prev,
            dias_semana: prev.dias_semana.includes(dayValue) 
                ? prev.dias_semana.filter(d => d !== dayValue) 
                : [...prev.dias_semana, dayValue]
        }));
    };

    const handleTextChange = (e) => {
        setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = () => {
        const payload = {
            ...formState,
            fecha_inicio: formState.fecha_inicio.toISOString(),
            fecha_fin: formState.fecha_fin.toISOString(),
        };
        onAddLote(payload);
    };

    return (
        <Box component={Paper} sx={{ p: 2, mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>Crear Horarios en Lote</Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}><DatePicker label="Fecha de Inicio" value={formState.fecha_inicio} onChange={(val) => setFormState(p=>({...p, fecha_inicio: val}))} /></Grid>
                <Grid item xs={12} sm={6}><DatePicker label="Fecha de Fin" value={formState.fecha_fin} onChange={(val) => setFormState(p=>({...p, fecha_fin: val}))} /></Grid>
                <Grid item xs={12}><Typography variant="body2">Días de la semana:</Typography><FormGroup row>{diasSemanaMap.map(d => <FormControlLabel key={d.value} control={<Checkbox checked={formState.dias_semana.includes(d.value)} onChange={() => handleDiasChange(d.value)}/>} label={d.label}/>)}</FormGroup></Grid>
                <Grid item xs={6} sm={3}><TextField name="hora_inicio" label="Hora Inicio" type="time" value={formState.hora_inicio} onChange={handleTextChange} fullWidth /></Grid>
                <Grid item xs={6} sm={3}><TextField name="hora_fin" label="Hora Fin" type="time" value={formState.hora_fin} onChange={handleTextChange} fullWidth /></Grid>
                <Grid item xs={12} sm={3}><TextField name="duracion_slot_minutos" label="Duración Slot (min)" type="number" value={formState.duracion_slot_minutos} onChange={handleTextChange} fullWidth /></Grid>
                <Grid item xs={12} sm={3}><Button variant="contained" onClick={handleSubmit} disabled={loading} fullWidth>Crear Lote</Button></Grid>
            </Grid>
        </Box>
    );
};


const GestionDisponibilidad = () => {
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [newSlot, setNewSlot] = useState(null);
    const [loadingLote, setLoadingLote] = useState(false);

    const fetchSlots = useCallback(async () => { setLoading(true); setError(''); try { const data = await adminService.getDisponibilidad(); setSlots(data); } catch (err) { setError('No se pudo cargar la disponibilidad.'); } finally { setLoading(false); } }, []);
    useEffect(() => { fetchSlots(); }, [fetchSlots]);

    const handleAddSlot = async () => { if (!newSlot) return; try { await adminService.addDisponibilidad({ fecha_hora_inicio: newSlot.toISOString() }); setNewSlot(null); fetchSlots(); } catch (err) { setError('Error al añadir el horario.'); } };
    const handleDeleteSlot = async (id) => { if (window.confirm("¿Seguro?")) { try { await adminService.deleteDisponibilidad(id); fetchSlots(); } catch (err) { setError('Error al eliminar el horario.'); } } };
    
    const handleAddLote = async (payload) => { setLoadingLote(true); try { await adminService.addDisponibilidadEnLote(payload); fetchSlots(); } catch (err) { setError('Error al crear el lote de horarios.'); } finally { setLoadingLote(false); }};

    return (
        <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>Gestionar Mis Horarios para Reuniones</Typography>
            <FormularioLote onAddLote={handleAddLote} loading={loadingLote} />
            <Divider sx={{ my: 2 }}>O añadir un horario individual</Divider>
            <Box sx={{ display: 'flex', gap: 2, my: 2, alignItems: 'center' }}>
                <DateTimePicker label="Añadir nuevo horario individual" value={newSlot} onChange={setNewSlot} />
                <Button variant="outlined" onClick={handleAddSlot}>Añadir</Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6">Horarios Actuales</Typography>
            {error && <Alert severity="error" sx={{my:1}}>{error}</Alert>}
            {loading ? <CircularProgress /> : (
                <List>
                    {slots.map(slot => (
                        <ListItem key={slot.id} secondaryAction={ !slot.esta_reservado && <IconButton edge="end" onClick={() => handleDeleteSlot(slot.id)}><DeleteIcon /></IconButton> }>
                            <ListItemText primary={new Date(slot.fecha_hora_inicio).toLocaleString('es-CL', { dateStyle: 'full', timeStyle: 'short' })} secondary={slot.esta_reservado ? "RESERVADO" : "Disponible"} secondaryTypographyProps={{ color: slot.esta_reservado ? 'error' : 'primary', fontWeight: 'bold' }}/>
                        </ListItem>
                    ))}
                </List>
            )}
        </Paper>
    );
};

export default GestionDisponibilidad;