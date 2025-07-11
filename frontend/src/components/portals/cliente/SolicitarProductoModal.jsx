// src/components/portals/cliente/SolicitarProductoModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const SolicitarProductoModal = ({ open, onClose, onSave }) => {
    const [formData, setFormData] = useState({ nombre_producto: '', descripcion: '' });

    useEffect(() => {
        if (open) {
            setFormData({ nombre_producto: '', descripcion: '' });
        }
    }, [open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!formData.nombre_producto || !formData.descripcion) {
            alert('Ambos campos son requeridos.');
            return;
        }
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Solicitar un Producto Nuevo</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" name="nombre_producto" label="Nombre del Producto" type="text" fullWidth variant="standard" value={formData.nombre_producto} onChange={handleChange} />
                <TextField margin="dense" name="descripcion" label="Descripción (marca, tamaño, etc.)" type="text" fullWidth multiline rows={3} variant="standard" value={formData.descripcion} onChange={handleChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Enviar Solicitud</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SolicitarProductoModal;