// src/components/soporte/GestionResoluciones.jsx
import React, { useState, useEffect } from 'react';
import { Paper, Typography, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, IconButton, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import DescriptionIcon from '@mui/icons-material/Description';
import adminService from '../../services/adminService';

const NotesModal = ({ open, onClose, notes }) => (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        <DialogTitle>Notas de la Resolución</DialogTitle>
        <DialogContent>
            <Typography sx={{ whiteSpace: 'pre-wrap', mt: 1 }}>
                {notes || "No se dejaron notas para esta resolución."}
            </Typography>
        </DialogContent>
        <DialogActions>
            <Button onClick={onClose}>Cerrar</Button>
        </DialogActions>
    </Dialog>
);

const GestionResoluciones = () => {
    const [resoluciones, setResoluciones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isNotesModalOpen, setNotesModalOpen] = useState(false);
    const [selectedNotes, setSelectedNotes] = useState('');

    useEffect(() => {
        const loadResoluciones = async () => {
            setLoading(true);
            try {
                const data = await adminService.getResoluciones();
                setResoluciones(data);
            } catch (err) {
                setError("Error al cargar las resoluciones.");
            } finally {
                setLoading(false);
            }
        };
        loadResoluciones();
    }, []);

    const handleOpenNotes = (notes) => {
        setSelectedNotes(notes);
        setNotesModalOpen(true);
    };

    const handleCloseNotes = () => {
        setNotesModalOpen(false);
        setSelectedNotes('');
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <>
            <Paper sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6" gutterBottom>Historial de Soportes Cerrados</Typography>
                <TableContainer>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID Res.</TableCell>
                                <TableCell>Tipo</TableCell>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Cliente</TableCell>
                                <TableCell>Asesor</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Causa</TableCell>
                                <TableCell align="right">Notas</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {resoluciones.map(r => (
                                <TableRow key={r.resolucion_id}>
                                    <TableCell>{r.resolucion_id}</TableCell>
                                    <TableCell><Chip label={r.tipo_resolucion} size="small" variant="outlined" /></TableCell>
                                    <TableCell>{new Date(r.fecha_creacion).toLocaleDateString()}</TableCell>
                                    <TableCell>{r.cliente_nombre}</TableCell>
                                    <TableCell>{r.asesor_nombre}</TableCell>
                                    <TableCell><Chip label={r.estado_resolucion} size="small" color={r.estado_resolucion === 'exitoso' ? 'success' : 'error'} /></TableCell>
                                    <TableCell>{r.causa_problema}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleOpenNotes(r.notas)} title="Ver notas">
                                            <DescriptionIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <NotesModal open={isNotesModalOpen} onClose={handleCloseNotes} notes={selectedNotes} />
        </>
    );
};

export default GestionResoluciones;