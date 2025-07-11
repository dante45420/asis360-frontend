// src/components/portals/cliente/PonerEnEsperaModal.jsx
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography, Alert } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';

const PonerEnEsperaModal = ({ open, onClose, onSave }) => {
    const [dias, setDias] = useState(7);

    const handleSave = () => { onSave(dias); };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Poner Pedido en Espera</DialogTitle>
            <DialogContent>
                <Alert severity="info" icon={<SavingsIcon/>} sx={{mb: 2}}>
                    Al poner tu pedido en espera, permites que otras cafeterías se unan a una compra agrupada. Si se alcanza el volumen necesario, **todos obtienen un mejor precio**.
                </Alert>
                <Typography gutterBottom color="text.secondary">
                    Tu pedido quedará "congelado" mientras buscamos a otros compradores. Si no se logra el objetivo en el plazo que definas, podrás decidir si quieres pagarlo al precio normal o cancelarlo.
                </Typography>
                <TextField
                    autoFocus
                    margin="dense"
                    name="dias"
                    label="Esperar un máximo de (días)"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={dias}
                    onChange={(e) => setDias(e.target.value)}
                    InputProps={{ inputProps: { min: 1, max: 30 } }}
                    sx={{mt: 2}}
                />
            </DialogContent>
            <DialogActions sx={{p: 2}}>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Confirmar Espera</Button>
            </DialogActions>
        </Dialog>
    );
};

export default PonerEnEsperaModal;