// src/components/portals/cliente/panel/EstadisticasView.jsx
import React, { useState, useEffect } from 'react';
import { Paper, Typography, CircularProgress, Alert, Box } from '@mui/material';
import SavingsIcon from '@mui/icons-material/Savings';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import HandshakeIcon from '@mui/icons-material/Handshake';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import portalService from '../../../../services/portalService';

// La tarjeta de estadística se mantiene igual, asegurando que ocupe el 100% del alto.
const StatCard = ({ title, value, icon, description, color }) => (
    <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%', borderRadius: 3, border: '1px solid', borderColor: 'grey.200' }}>
        <Box sx={{ color: color, mb: 1.5 }}>{icon}</Box>
        <Typography variant="h4" component="div" fontWeight="bold">{value}</Typography>
        <Typography variant="h6" color="text.primary" sx={{ mb: 1 }}>{title}</Typography>
        <Typography variant="body2" color="text.secondary">{description}</Typography>
    </Paper>
);

const EstadisticasView = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        portalService.getDashboardStats()
            .then(data => setStats(data))
            .catch(() => setError('No se pudieron cargar las estadísticas.'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', my: 4}}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    const allStats = [
        {
            title: "Dinero Ahorrado",
            value: `$${(stats?.dinero_ahorrado || 0).toLocaleString('es-CL')}`,
            icon: <SavingsIcon sx={{ fontSize: 45 }}/>,
            color: "success.main",
            description: "Ahorro estimado al comprar con nosotros, gracias a los precios por volumen que negociamos para nuestra red de clientes."
        },
        {
            title: "Pedidos Completados",
            value: stats?.pedidos_exitosos || 0,
            icon: <ShoppingCartCheckoutIcon sx={{ fontSize: 45 }}/>,
            color: "primary.main",
            description: "El número total de pedidos que has gestionado y finalizado con éxito. ¡Cada uno es un paso hacia una mayor eficiencia!"
        },
        {
            title: "Proveedores Gestionados",
            value: stats?.proveedores_unicos || 0,
            icon: <HandshakeIcon sx={{ fontSize: 45 }}/>,
            color: "secondary.main",
            description: "La cantidad de proveedores distintos con los que has trabajado, todos centralizados en una sola plataforma para simplificar tu gestión."
        },
        {
            title: "Tickets de Soporte",
            value: stats?.tickets_soporte || 0,
            icon: <SupportAgentIcon sx={{ fontSize: 45 }}/>,
            color: "warning.main",
            description: "El historial de tus conversaciones con nuestro equipo. Estamos aquí para ayudarte a resolver cualquier inconveniente rápidamente."
        }
    ];

    return (
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3, // Espacio entre las tarjetas
            justifyContent: 'center',
          }}
        >
          {allStats.map((stat, index) => (
            <Box
              key={index}
              sx={{
                // En celular (xs), ocupa el 100% del ancho.
                width: { xs: '100%', sm: 'calc(50% - 12px)' }, 
                // En pantallas pequeñas (sm) y más grandes, ocupa el 50% menos el espacio del gap.
                // El cálculo 'calc(50% - 12px)' asegura que dos tarjetas quepan perfectamente.
              }}
            >
              <StatCard {...stat} />
            </Box>
          ))}
        </Box>
    );
};

export default EstadisticasView;