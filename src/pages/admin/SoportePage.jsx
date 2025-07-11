// src/pages/SoportePage.jsx
import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Snackbar } from '@mui/material';

// Importamos los nuevos componentes especializados
import GestionChats from '../../components/soporte/GestionChats';
import GestionTickets from '../../components/soporte/GestionTickets';
import GestionResoluciones from '../../components/soporte/GestionResoluciones';

const SoportePage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Módulo de Soporte</Typography>
            <Paper>
                <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} centered>
                    <Tab label="Chats en Vivo" />
                    <Tab label="Tickets de Productos" />
                    <Tab label="Soportes Cerrados" />
                </Tabs>
            </Paper>
            <Box mt={2}>
                {activeTab === 0 && <GestionChats setSnackbar={setSnackbar} />}
                {activeTab === 1 && <GestionTickets setSnackbar={setSnackbar} />}
                {activeTab === 2 && <GestionResoluciones />}
            </Box>
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={4000} 
                onClose={() => setSnackbar({ open: false, message: '' })} 
                message={snackbar.message} 
            />
        </Box>
    );
};

export default SoportePage;