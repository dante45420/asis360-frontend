// frontend/src/pages/admin/AdminHerramientasPage.jsx
import React, { useState } from 'react';
import { Box, Typography, Paper, Tabs, Tab } from '@mui/material';
import BugReportIcon from '@mui/icons-material/BugReport';
import BuildIcon from '@mui/icons-material/Build';
import PeopleIcon from '@mui/icons-material/People';

import HerramientaControlBot from '../../components/admin/tools/HerramientaControlBot';
import GestionPedidosTool from '../../components/admin/tools/GestionPedidosTool';
import GestionClientesTool from '../../components/admin/tools/GestionClientesTool'; // <-- IMPORTAR

const AdminHerramientasPage = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Herramientas de Administración</Typography>
            <Paper>
                <Tabs 
                    value={activeTab} 
                    onChange={handleChange} 
                    indicatorColor="primary" 
                    textColor="primary" 
                    variant="fullWidth"
                >
                    <Tab icon={<BugReportIcon />} iconPosition="start" label="Control de Bots" />
                    <Tab icon={<BuildIcon />} iconPosition="start" label="Gestión de Pedidos" />
                    {/* HABILITAR LA PESTAÑA */}
                    <Tab icon={<PeopleIcon />} iconPosition="start" label="Gestión de Clientes" /> 
                </Tabs>
            </Paper>
            <Box mt={3}>
                {activeTab === 0 && <HerramientaControlBot />}
                {activeTab === 1 && <GestionPedidosTool />}
                {/* MOSTRAR EL NUEVO COMPONENTE */}
                {activeTab === 2 && <GestionClientesTool />}
            </Box>
        </Box>
    );
};

export default AdminHerramientasPage;