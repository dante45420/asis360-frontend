// src/pages/admin/AdminDashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, CircularProgress, Alert, Divider } from '@mui/material';
import StatCard from '../../components/admin/dashboard/StatCard';
import adminService from '../../services/adminService';

// Importar iconos
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SavingsIcon from '@mui/icons-material/Savings';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import DnsIcon from '@mui/icons-material/Dns';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import UpdateIcon from '@mui/icons-material/Update';
import AllInboxIcon from '@mui/icons-material/AllInbox';

const AdminDashboardPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const data = await adminService.getDashboardStats();
                setStats(data);
            } catch (err) {
                setError('No se pudieron cargar las estadísticas. Intenta de nuevo más tarde.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }
    
    // Función para formatear la fecha del último webhook
    const formatLastWebhook = (isoDate) => {
        if (!isoDate) return "Nunca";
        const date = new Date(isoDate);
        return date.toLocaleString('es-CL');
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Panel de Control</Typography>

            {/* Métricas de Negocio */}
            <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>Métricas de Negocio</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        icon={<MonetizationOnIcon />} 
                        title="Ventas Totales" 
                        value={`$${new Intl.NumberFormat('es-CL').format(stats.total_sales || 0)}`}
                        color="success.main"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        icon={<SavingsIcon />} 
                        title="Ahorro Total para Clientes" 
                        value={`$${new Intl.NumberFormat('es-CL').format(stats.total_saved_for_clients || 0)}`}
                        color="info.main"
                    />
                </Grid>
                 <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        icon={<ReceiptLongIcon />} 
                        title="Pedidos Totales (Histórico)" 
                        value={stats.total_orders || 0}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        icon={<PersonAddIcon />} 
                        title="Nuevos Clientes (30 días)" 
                        value={stats.new_clients_last_30_days || 0}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <StatCard 
                        icon={<HowToRegIcon />} 
                        title="Clientes Activos (30 días)" 
                        value={stats.active_clients_last_30_days || 0}
                    />
                </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* Salud del Sistema */}
            <Typography variant="h5" gutterBottom>Salud del Sistema</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<DnsIcon />} title="Base de Datos" value={stats.database_status} color={stats.database_status === 'Online' ? 'success.light' : 'error.main'} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<WhatsAppIcon />} title="API de WhatsApp" value={stats.whatsapp_api_status} color={stats.whatsapp_api_status === 'Operacional' ? 'success.light' : 'error.main'} />
                </Grid>
                 <Grid item xs={12} sm={6} md={3}>
                    <StatCard icon={<AllInboxIcon />} title="Tareas en 2º Plano" value={stats.background_task_status} color={stats.background_task_status === 'Activa' ? 'success.light' : 'error.main'} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                     <StatCard icon={<UpdateIcon />} title="Último Webhook" value={formatLastWebhook(stats.last_webhook_received)} />
                </Grid>
            </Grid>
        </Box>
    );
};

export default AdminDashboardPage;