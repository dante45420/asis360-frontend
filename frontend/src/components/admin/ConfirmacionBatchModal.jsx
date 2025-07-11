// src/components/admin/ConfirmacionBatchModal.jsx
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, List, ListItem, ListItemText, Box } from '@mui/material';

const ConfirmacionBatchModal = ({ open, onClose, onConfirm, cambios }) => {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Confirmar Cambios</DialogTitle>
            <DialogContent>
                <Typography>Estás a punto de aplicar los siguientes cambios en <strong>{cambios.length}</strong> pedidos. ¿Estás seguro?</Typography>
                <List dense sx={{ maxHeight: 300, overflow: 'auto', my: 2 }}>
                    {cambios.map(c => (
                        <ListItem key={c.pedido_id}>
                            <ListItemText 
                                primary={`Pedido #${c.pedido_id} -> Nuevo Estado: ${c.nuevo_estado}`}
                                secondary={
                                    c.detalles.map(d => `Item #${d.detalle_id} -> Nuevo Precio: $${d.nuevo_precio_pagado}`).join(', ')
                                }
                            />
                        </ListItem>
                    ))}
                </List>
                <Typography variant="caption" color="text.secondary">Esta acción es irreversible.</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={onConfirm} variant="contained" color="primary">
                    Confirmar y Aplicar
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmacionBatchModal;