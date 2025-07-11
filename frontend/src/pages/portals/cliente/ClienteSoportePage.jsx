// src/pages/portals/cliente/ClienteSoportePage.jsx
import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import MisSolicitudesView from '../../../components/portals/cliente/soporte/MisSolicitudesView';
import ContactarAsesorView from '../../../components/portals/cliente/soporte/ContactarAsesorView';

const ClienteSoportePage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Soporte y Ayuda
            </Typography>
            
            <Paper>
                <Tabs 
                    value={activeTab} 
                    onChange={handleChange} 
                    indicatorColor="primary" 
                    textColor="primary" 
                    variant="fullWidth"
                    aria-label="pestañas de soporte"
                >
                    <Tab icon={<HistoryIcon />} iconPosition="start" label="Solicitudes Pasadas" />
                    <Tab icon={<ContactSupportIcon />} iconPosition="start" label="Contactar a un Asesor" />
                </Tabs>
            </Paper>

            <Box mt={3}>
                {activeTab === 0 && (
                    <Paper sx={{ p: 3 }}><MisSolicitudesView /></Paper>
                )}
                {activeTab === 1 && (
                    <Paper sx={{ p: 3 }}><ContactarAsesorView /></Paper>
                )}
            </Box>
        </Box>
    );
};

export default ClienteSoportePage;