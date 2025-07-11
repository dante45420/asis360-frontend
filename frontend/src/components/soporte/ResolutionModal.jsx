// src/components/soporte/ResolutionModal.jsx
import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, 
    Button, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';

const ResolutionModal = ({ open, onClose, onSave, itemType }) => {
    const [formData, setFormData] = useState({
        estado_resolucion: 'exitoso',
        causa_problema: '',
        notas: ''
    });

    useEffect(() => {
        // Resetea el formulario cada vez que se abre
        if (open) {
            setFormData({
                estado_resolucion: 'exitoso',
                causa_problema: '',
                notas: ''
            });
        }
    }, [open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!formData.causa_problema) {
            alert('Por favor, completa la causa del problema.');
            return;
        }
        onSave(formData);
    };
    
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Resolver {itemType === 'chat' ? 'Conversación' : 'Ticket'}</DialogTitle>
            <DialogContent>
                {itemType === 'chat' && (
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Estado de Resolución</InputLabel>
                        <Select name="estado_resolucion" value={formData.estado_resolucion} onChange={handleChange} label="Estado de Resolución">
                            <MenuItem value="exitoso">Exitoso</MenuItem>
                            <MenuItem value="no_exitoso">No Exitoso</MenuItem>
                        </Select>
                    </FormControl>
                )}
                <TextField name="causa_problema" label="Causa de la Resolución" value={formData.causa_problema} onChange={handleChange} fullWidth margin="normal" helperText={itemType === 'ticket' ? "Ej: Producto encontrado y añadido al catálogo." : "Ej: Duda sobre producto resuelta."} />
                <TextField name="notas" label="Notas Adicionales" value={formData.notas} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Guardar Resolución</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResolutionModal;