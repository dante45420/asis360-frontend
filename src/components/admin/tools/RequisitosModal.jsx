// src/components/admin/tools/RequisitosModal.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid } from '@mui/material';

const RequisitosModal = ({ open, onClose, detalle, onSave }) => {
    const [respuestas, setRespuestas] = useState({});

    useEffect(() => {
        // Cuando el modal se abre, cargamos las respuestas del detalle que nos pasaron
        if (detalle && open) {
            // Nos aseguramos que siempre sea un objeto para evitar errores
            setRespuestas(detalle.respuestas_requisitos || {});
        }
    }, [detalle, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRespuestas(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(respuestas);
        onClose();
    };

    // No renderizamos nada si no hay un detalle para editar
    if (!detalle) return null;

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Editar Opciones de "{detalle.nombre_producto_historico}"</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ pt: 2 }}>
                    {/* Hacemos un mapeo de las claves y valores para crear los campos */}
                    {Object.entries(respuestas).map(([key, value]) => (
                        <Grid item xs={12} key={key}>
                            <TextField
                                fullWidth
                                label={key} // La clave del requisito es el label
                                name={key}   // y también el nombre del campo
                                value={value}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Grid>
                    ))}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Guardar Cambios</Button>
            </DialogActions>
        </Dialog>
    );
};

export default RequisitosModal;