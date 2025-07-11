// src/components/portals/cliente/soporte/MisSolicitudesView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip, Divider } from '@mui/material';
import portalService from '../../../../services/portalService';

// Función para mapear estados a colores de Chip
const getStatusChipColor = (status) => {
    switch (status) {
        case 'nuevo': return 'primary';
        case 'en_revision': return 'warning';
        case 'resuelto': return 'success';
        case 'rechazado': return 'error';
        default: return 'default';
    }
};

const MisSolicitudesView = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTickets = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await portalService.getMisTickets();
            setTickets(data);
        } catch (err) {
            setError('No se pudieron cargar tus solicitudes. Intenta de nuevo más tarde.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTickets();
    }, [fetchTickets]);

    const renderContent = () => {
        if (loading) {
            return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>;
        }
        if (error) {
            return <Alert severity="error">{error}</Alert>;
        }
        if (tickets.length === 0) {
            return <Paper sx={{p: 3, textAlign: 'center', fontStyle: 'italic'}}><Typography>Aún no has solicitado productos. Si no encuentras lo que buscas, ¡no dudes en solicitarlo desde la pestaña "Crear Pedido"!</Typography></Paper>;
        }
        
        return (
            <>
                {/* VISTA PARA COMPUTADOR (TABLA) */}
                <TableContainer component={Paper} sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Producto Solicitado</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Estado</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tickets.map((ticket) => (
                                <TableRow key={ticket.id}>
                                    <TableCell>{new Date(ticket.fecha_creacion).toLocaleDateString('es-CL')}</TableCell>
                                    <TableCell>{ticket.nombre_producto}</TableCell>
                                    <TableCell>{ticket.descripcion}</TableCell>
                                    <TableCell>
                                        <Chip label={ticket.estado.replace('_', ' ')} color={getStatusChipColor(ticket.estado)} size="small" sx={{textTransform: 'capitalize'}} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* VISTA PARA CELULAR (TARJETAS) */}
                <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    {tickets.map((ticket) => (
                        <Paper key={ticket.id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography fontWeight="bold">{ticket.nombre_producto}</Typography>
                                <Chip label={ticket.estado.replace('_', ' ')} color={getStatusChipColor(ticket.estado)} size="small" sx={{textTransform: 'capitalize'}} />
                            </Box>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{mb: 1.5}}>
                                Solicitado el: {new Date(ticket.fecha_creacion).toLocaleDateString('es-CL')}
                            </Typography>
                            <Divider sx={{mb: 1.5}} />
                            <Typography variant="body2">
                                {ticket.descripcion}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </>
        );
    };

    return (
        // Se cambia el Paper principal por un Box para evitar el doble contenedor.
        <Box>
            <Typography variant="h5" component="h2" gutterBottom>Historial de Productos Solicitados</Typography>
            <Typography color="text.secondary" sx={{mb: 3}}>
                Aquí puedes ver el estado de los productos que has solicitado para que se agreguen a nuestro catálogo.
            </Typography>
            {renderContent()}
        </Box>
    );
};

export default MisSolicitudesView;