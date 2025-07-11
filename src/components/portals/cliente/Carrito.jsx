// src/components/portals/cliente/Carrito.jsx
import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider, Button, IconButton, Stack, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import SavingsIcon from '@mui/icons-material/Savings';

const Carrito = ({ carrito, onRemoveItem, onCheckout, onOpenEsperaModal, ahorroPotencial }) => {
    return (
        <Box sx={{ width: { xs: '90vw', sm: 350 }, maxWidth: '100%', p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Mi Pedido Actual
            </Typography>
            <Divider sx={{ mb: 1 }} />
            {carrito?.items && carrito.items.length > 0 ? (
                <>
                    {ahorroPotencial > 0 && (
                        <Alert severity="info" icon={<SavingsIcon fontSize="inherit" />} sx={{ mb: 2 }}>
                            Si pones este pedido en espera, podrías **ahorrar hasta ${ahorroPotencial.toLocaleString('es-CL')}** comprando en grupo.
                        </Alert>
                    )}

                    <List dense>
                        {carrito.items.map((item) => (
                            <ListItem
                                key={item.detallePedidoId}
                                disablePadding
                                secondaryAction={
                                    <IconButton edge="end" aria-label="delete" onClick={() => onRemoveItem(item.detallePedidoId)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                }
                            >
                                <ListItemText
                                    primary={`${item.quantity} x ${item.productName}`}
                                    secondary={`$${(item.lineTotal || 0).toLocaleString('es-CL')}`}
                                />
                            </ListItem>
                        ))}
                    </List>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">Total:</Typography>
                        <Typography variant="h6">${(carrito.total || 0).toLocaleString('es-CL')}</Typography>
                    </Box>
                    <Stack spacing={1}>
                        <Button fullWidth variant="contained" onClick={onCheckout}>
                            Finalizar y Pagar
                        </Button>
                        <Button fullWidth variant="outlined" onClick={onOpenEsperaModal}>
                            Poner en Espera
                        </Button>
                    </Stack>
                </>
            ) : (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
                    Tu carrito está vacío.
                </Typography>
            )}
        </Box>
    );
};

export default Carrito;