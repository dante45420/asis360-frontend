// src/components/portals/cliente/ResenasView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, List, ListItem, ListItemText, Divider, CircularProgress, Alert, Rating } from '@mui/material';
import portalService from '../../../services/portalService';

const ResenasView = ({ onActionClick }) => {
    const [resenas, setResenas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchResenas = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await portalService.getMisResenas();
            setResenas(data);
        } catch (err) {
            setError('No se pudieron cargar tus reseñas. Intenta de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchResenas();
    }, [fetchResenas]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Mis Reseñas</Typography>
                <Button variant="contained" onClick={() => onActionClick('nueva_reseña')}>
                    Dejar una Reseña
                </Button>
            </Box>
            {resenas.length === 0 ? (
                <Typography>Aún no has dejado ninguna reseña.</Typography>
            ) : (
                <List>
                    {resenas.map((resena, index) => (
                        <React.Fragment key={resena.id}>
                            <ListItem>
                                <ListItemText
                                    primary={resena.productoNombre}
                                    secondary={
                                        <>
                                            <Rating value={resena.calificacion} readOnly />
                                            <Typography variant="body2" color="text.primary">{resena.comentario}</Typography>
                                        </>
                                    }
                                />
                                <Button onClick={() => onActionClick('editar_reseña', resena)}>
                                    Editar
                                </Button>
                            </ListItem>
                            {index < resenas.length - 1 && <Divider />}
                        </React.Fragment>
                    ))}
                </List>
            )}
        </Box>
    );
};

export default ResenasView;