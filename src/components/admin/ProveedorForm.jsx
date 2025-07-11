// src/components/ProveedorForm.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';

const ProveedorForm = ({ open, onClose, onSave, proveedor }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        info_contacto: '',
        calidad_servicio: ''
    });

    useEffect(() => {
        if (proveedor) {
            setFormData({
                nombre: proveedor.nombre || '',
                info_contacto: proveedor.info_contacto || '',
                calidad_servicio: proveedor.calidad_servicio || ''
            });
        } else {
            setFormData({ nombre: '', info_contacto: '', calidad_servicio: '' });
        }
    }, [proveedor, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        const dataToSave = {
            ...formData,
            calidad_servicio: formData.calidad_servicio ? Number(formData.calidad_servicio) : null
        };
        onSave(dataToSave);
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>{proveedor ? 'Editar Proveedor' : 'Añadir Nuevo Proveedor'}</DialogTitle>
            <DialogContent>
                <TextField autoFocus margin="dense" name="nombre" label="Nombre del Proveedor" type="text" fullWidth variant="standard" value={formData.nombre} onChange={handleChange} />
                <TextField margin="dense" name="info_contacto" label="Email de Contacto" type="email" fullWidth variant="standard" value={formData.info_contacto} onChange={handleChange} />
                <TextField margin="dense" name="calidad_servicio" label="Calidad de Servicio (1-10)" type="number" fullWidth variant="standard" value={formData.calidad_servicio} onChange={handleChange} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Guardar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProveedorForm;