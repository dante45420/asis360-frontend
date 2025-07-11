// frontend/src/components/admin/tools/AdminClienteFormModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid, CircularProgress } from '@mui/material';

const AdminClienteFormModal = ({ open, onClose, onSave, clienteToEdit }) => {
    const isEditing = Boolean(clienteToEdit);
    const [formData, setFormData] = useState({
        nombre: '',
        telefono_vinculado: '',
        rut: '',
        direccion: ''
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData(clienteToEdit || { nombre: '', telefono_vinculado: '', rut: '', direccion: '' });
        }
    }, [open, clienteToEdit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        await onSave(formData);
        setSaving(false);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{isEditing ? 'Editar Perfil de Cliente' : 'Crear Nuevo Perfil'}</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ pt: 2 }}>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Teléfono (Ej: 569...)" name="telefono_vinculado" value={formData.telefono_vinculado || ''} onChange={handleChange} disabled={isEditing} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="RUT" name="rut" value={formData.rut || ''} onChange={handleChange} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField fullWidth label="Dirección" name="direccion" value={formData.direccion || ''} onChange={handleChange} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} disabled={saving}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained" disabled={saving}>
                    {saving ? <CircularProgress size={24} color="inherit" /> : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AdminClienteFormModal;