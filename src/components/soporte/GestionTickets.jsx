// src/components/soporte/GestionTickets.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, Menu, MenuItem, CircularProgress, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import adminService from '../../services/adminService';
import ResolutionModal from './ResolutionModal'; // <-- Importación corregida

const GestionTickets = ({setSnackbar}) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

    const fetchTickets = useCallback(async () => {
        setLoading(true);
        try {
            const data = await adminService.getTickets(['nuevo', 'en_revision']);
            setTickets(data);
        } catch (err) { setError("Error al cargar los tickets."); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchTickets(); }, [fetchTickets]);

    const handleMenuClick = (event, ticket) => {
        setAnchorEl(event.currentTarget);
        setSelectedTicket(ticket);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleStatusChange = async (newStatus) => {
        if (!selectedTicket) return;
        try {
            const response = await adminService.updateTicketStatus(selectedTicket.ticket_id, { estado: newStatus });
            setSnackbar({ open: true, message: response.message });
            fetchTickets();
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Error al actualizar estado.' });
        }
        handleMenuClose();
        setSelectedTicket(null);
    };

    const handleOpenResolveModal = () => {
        setAnchorEl(null);
        setIsResolveModalOpen(true);
    };
    
    const handleSaveResolution = async (resolutionData) => {
        if (!selectedTicket) return;
        const dataToSend = {
            estado: 'completo',
            causa_problema: resolutionData.causa_problema,
            notas: resolutionData.notas,
        };
        try {
            const response = await adminService.updateTicketStatus(selectedTicket.ticket_id, dataToSend);
            setSnackbar({ open: true, message: response.message });
            setIsResolveModalOpen(false);
            setSelectedTicket(null);
            fetchTickets();
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Error al completar el ticket.' });
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>Tickets de Productos Pendientes</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Producto</TableCell>
                                <TableCell>Descripción</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tickets.map(t => (
                                <TableRow key={t.ticket_id}>
                                    <TableCell>{t.ticket_id}</TableCell>
                                    <TableCell>{new Date(t.fecha_creacion).toLocaleDateString()}</TableCell>
                                    <TableCell>{t.cliente_nombre}</TableCell>
                                    <TableCell>{t.nombre_producto_deseado}</TableCell>
                                    <TableCell sx={{maxWidth: 300, wordBreak: 'break-word'}}>{t.descripcion}</TableCell>
                                    <TableCell><Chip label={t.estado} size="small" color={t.estado === 'nuevo' ? 'primary' : 'warning'} /></TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={(e) => handleMenuClick(e, t)}>
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => { handleMenuClose(); setSelectedTicket(null); }}>
                {selectedTicket?.estado === 'nuevo' && <MenuItem onClick={() => handleStatusChange('en_revision')}>Marcar en Revisión</MenuItem>}
                <MenuItem onClick={handleOpenResolveModal}>Marcar como Completo</MenuItem>
            </Menu>
            <ResolutionModal open={isResolveModalOpen} onClose={() => {setIsResolveModalOpen(false); setSelectedTicket(null);}} onSave={handleSaveResolution} itemType="ticket" />
        </>
    );
};

export default GestionTickets;