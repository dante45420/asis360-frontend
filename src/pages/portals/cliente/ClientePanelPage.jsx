// src/pages/portals/cliente/ClientePanelPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Paper, Container } from '@mui/material';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PersonIcon from '@mui/icons-material/Person';
import EstadisticasView from '../../../components/portals/cliente/panel/EstadisticasView';
import PerfilView from '../../../components/portals/cliente/panel/PerfilView';

const ClientePanelPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Panel de Cliente
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Tu centro de operaciones para gestionar compras y ver tu progreso.
                </Typography>
            </Box>

            <Paper sx={{ width: '100%', mb: 3 }}>
                <Tabs 
                    value={activeTab} 
                    onChange={(e, newValue) => setActiveTab(newValue)} 
                    indicatorColor="primary" 
                    textColor="primary" 
                    variant="fullWidth"
                    centered
                >
                    <Tab sx={{ py: 2 }} icon={<ShowChartIcon />} iconPosition="start" label="Mis Estadísticas" />
                    <Tab sx={{ py: 2 }} icon={<PersonIcon />} iconPosition="start" label="Mi Perfil" />
                </Tabs>
            </Paper>

            <Box>
                {activeTab === 0 && <EstadisticasView />}
                {activeTab === 1 && <PerfilView />}
            </Box>
        </Container>
    );
};

export default ClientePanelPage;