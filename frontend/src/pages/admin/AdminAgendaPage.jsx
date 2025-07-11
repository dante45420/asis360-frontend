// src/pages/admin/AdminAgendaPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Paper, Tabs, Tab, CircularProgress, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GestionDisponibilidad from '../../components/admin/GestionDisponibilidad'; // Componente que ya diseñamos
import adminService from '../../services/adminService';

// --- Componente para la vista de Reuniones Agendadas ---
const ReunionesAgendadasView = () => {
    const [reuniones, setReuniones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminService.getReunionesAgendadas()
            .then(data => setReuniones(data))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <CircularProgress />;

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Próximas Reuniones Agendadas</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Fecha y Hora</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Consulta</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reuniones.length === 0 ? (
                            <TableRow><TableCell colSpan={3} align="center">No tienes reuniones agendadas.</TableCell></TableRow>
                        ) : (
                            reuniones.map(reunion => (
                                <TableRow key={reunion.id}>
                                    <TableCell>{new Date(reunion.fecha_hora_inicio).toLocaleString('es-CL')}</TableCell>
                                    <TableCell>{reunion.cliente_nombre}</TableCell>
                                    <TableCell>{reunion.detalles_solicitud}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};


const AdminAgendaPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Gestión de Agenda</Typography>
            <Paper>
                <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} centered>
                    <Tab icon={<ScheduleIcon />} iconPosition="start" label="Gestionar Mis Horarios" />
                    <Tab icon={<EventAvailableIcon />} iconPosition="start" label="Reuniones Agendadas" />
                </Tabs>
            </Paper>
            <Box mt={3}>
                {activeTab === 0 && <GestionDisponibilidad />}
                {activeTab === 1 && <ReunionesAgendadasView />}
            </Box>
        </Box>
    );
};

export default AdminAgendaPage;