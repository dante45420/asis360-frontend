// src/pages/portals/cliente/ClientePedidosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, Paper, Snackbar, Badge, Popover, Container, Fab, useTheme, useMediaQuery } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CreateIcon from '@mui/icons-material/Create';
import HistoryIcon from '@mui/icons-material/History';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CrearPedidoView from '../../../components/portals/cliente/CrearPedidoView';
import HistorialPedidosView from '../../../components/portals/cliente/HistorialPedidosView';
import ResenasView from '../../../components/portals/cliente/ResenasView';
import Carrito from '../../../components/portals/cliente/Carrito';
import PonerEnEsperaModal from '../../../components/portals/cliente/PonerEnEsperaModal';
import DejarResenaModal from '../../../components/portals/cliente/DejarResenaModal';
import DetallePedidoModalCliente from '../../../components/portals/cliente/DetallePedidoModalCliente';
import portalService from '../../../services/portalService';
import { useAuth } from '../../../context/AuthContext';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return ( <div role="tabpanel" hidden={value !== index} id={`cliente-tabpanel-${index}`} {...other}> {value === index && <Box sx={{ pt: 3 }}>{children}</Box>} </div> );
};

const ClientePedidosPage = () => {
    // --- LÓGICA EXISTENTE (SIN CAMBIOS) ---
    const [activeTab, setActiveTab] = useState(0);
    const [carrito, setCarrito] = useState({ items: [], total: 0, pedidoId: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [isEsperaModalOpen, setIsEsperaModalOpen] = useState(false);
    const [isResenaModalOpen, setIsResenaModalOpen] = useState(false);
    const [isDetalleModalOpen, setIsDetalleModalOpen] = useState(false);
    const [selectedPedidoId, setSelectedPedidoId] = useState(null);
    const [reseñaToEdit, setReseñaToEdit] = useState(null);
    const [cartAnchorEl, setCartAnchorEl] = useState(null);
    const [ahorroPotencial, setAhorroPotencial] = useState(0);
    const { user } = useAuth();
    const navigate = useNavigate();
    const [reviewTrigger, setReviewTrigger] = useState(0);
    
    const theme = useTheme();
    const isMobile = !useMediaQuery(theme.breakpoints.up('sm'));

    const fetchCarrito = useCallback(async () => {
        try {
            const data = await portalService.getCarrito();
            setCarrito(data);
            if (data.items.length > 0) {
                const ahorroData = await portalService.getAhorroPotencial();
                setAhorroPotencial(ahorroData.ahorro_potencial);
            } else { setAhorroPotencial(0); }
        } catch (error) { setSnackbar({ open: true, message: 'Error al cargar tu carrito.' }); }
    }, []);

    useEffect(() => { fetchCarrito(); }, [fetchCarrito]);

    const handleTabChange = (event, newValue) => setActiveTab(newValue);
    const handleCartClick = (event) => setCartAnchorEl(event.currentTarget);
    const handleCartClose = () => setCartAnchorEl(null);

    // ... (El resto de las funciones de manejo de eventos se mantienen igual) ...
    const handleAddToCart = async (productoId, requisitos) => {
        try {
            const response = await portalService.agregarAlCarrito({ producto_id: productoId, requisitos });
            setSnackbar({ open: true, message: response.message });
            fetchCarrito();
        } catch (error) { setSnackbar({ open: true, message: error.response?.data?.message || 'Error al añadir producto.' }); }
    };

    const handleRemoveFromCart = async (detalleId) => {
        try {
            const response = await portalService.quitarDelCarrito(detalleId);
            setSnackbar({ open: true, message: response.message });
            fetchCarrito();
        } catch (error) { setSnackbar({ open: true, message: error.response?.data?.message || 'Error al quitar producto.' }); }
    };

    const handleCheckout = async () => {
        if (!carrito.pedidoId || carrito.items.length === 0) return;
        try {
            await portalService.finalizarPedido();
            setSnackbar({ open: true, message: 'Pedido finalizado. Ahora puedes subir tu comprobante.' });
            fetchCarrito(); setActiveTab(1); navigate(`/portal/cliente/pago/${carrito.pedidoId}`);
        } catch(error) { setSnackbar({ open: true, message: error.response?.data?.message || 'Error al finalizar el pedido.' }); }
        handleCartClose();
    };

    const handleSetOnHold = async (dias) => {
        if (!carrito.pedidoId || carrito.items.length === 0) return;
        try {
            const response = await portalService.ponerPedidoEnEspera(carrito.pedidoId, dias);
            setSnackbar({ open: true, message: response.message });
            await fetchCarrito(); setIsEsperaModalOpen(false); setActiveTab(1);
        } catch (error) { setSnackbar({ open: true, message: error.response?.data?.message || 'Error al poner en espera.' }); }
    };

    const handleHistoryAction = async (action, payload) => {
        switch (action) {
            case 'ver_detalles': setSelectedPedidoId(payload.id); setIsDetalleModalOpen(true); break;
            case 'subir_comprobante': navigate(`/portal/cliente/pago/${payload.id}`); break;
            case 'repetir_pedido':
                try {
                    const response = await portalService.repetirPedido(payload.id);
                    setSnackbar({ open: true, message: response.message }); fetchCarrito(); setActiveTab(0);
                } catch (error) { setSnackbar({ open: true, message: 'Error al repetir el pedido.' }); }
                break;
            case 'nueva_reseña': setReseñaToEdit(null); setIsResenaModalOpen(true); break;
            case 'editar_reseña': setReseñaToEdit(payload); setIsResenaModalOpen(true); break;
            default: break;
        }
    };
    
    const handleSaveReseña = async (reseñaId, data) => {
        try {
            const response = reseñaId ? await portalService.updateReseña(reseñaId, data) : await portalService.crearReseña(data);
            setSnackbar({ open: true, message: response.message }); setReviewTrigger(prev => prev + 1);
        } catch (error) { setSnackbar({ open: true, message: error.response?.data?.message || 'Error al guardar la reseña.' }); }
    };


    const openCartPopover = Boolean(cartAnchorEl);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" component="h1" gutterBottom>Portal de Pedidos</Typography>
                <Typography variant="h6" color="text.secondary">Hola, {user?.nombre || 'Cliente'}. Desde aquí puedes crear pedidos, ver tu historial y dejar reseñas.</Typography>
            </Box>
            
            <Paper sx={{ width: '100%', borderRadius: 2, overflow: 'hidden', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} variant={isMobile ? "fullWidth" : "standard"} centered indicatorColor="primary" textColor="primary" sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tab icon={<CreateIcon />} label={isMobile ? '' : 'Crear Pedido'} aria-label="Crear Pedido" />
                    <Tab icon={<HistoryIcon />} label={isMobile ? '' : 'Registro de Pedidos'} aria-label="Registro de Pedidos" />
                    <Tab icon={<RateReviewIcon />} label={isMobile ? '' : 'Mis Reseñas'} aria-label="Mis Reseñas" />
                </Tabs>
            </Paper>

            <Box>
                <TabPanel value={activeTab} index={0}><CrearPedidoView onAddToCart={handleAddToCart} setSnackbar={setSnackbar} /></TabPanel>
                <TabPanel value={activeTab} index={1}><HistorialPedidosView onActionClick={handleHistoryAction} /></TabPanel>
                <TabPanel value={activeTab} index={2}><ResenasView key={reviewTrigger} onActionClick={handleHistoryAction} /></TabPanel>
            </Box>
            
            <Fab color="primary" aria-label="ver carrito" onClick={handleCartClick} sx={{ position: 'fixed', bottom: 32, right: 32 }}>
                <Badge badgeContent={carrito?.items?.length || 0} color="error">
                    <ShoppingCartIcon />
                </Badge>
            </Fab>

            <Popover id="cart-popover" open={openCartPopover} anchorEl={cartAnchorEl} onClose={handleCartClose} anchorOrigin={{ vertical: 'top', horizontal: 'left' }} transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                <Carrito carrito={carrito} ahorroPotencial={ahorroPotencial} onRemoveItem={handleRemoveFromCart} onCheckout={handleCheckout} onOpenEsperaModal={() => setIsEsperaModalOpen(true)} />
            </Popover>

            {isResenaModalOpen && <DejarResenaModal open={isResenaModalOpen} onClose={() => setIsResenaModalOpen(false)} onSave={handleSaveReseña} reseñaToEdit={reseñaToEdit} />}
            <PonerEnEsperaModal open={isEsperaModalOpen} onClose={() => setIsEsperaModalOpen(false)} onSave={handleSetOnHold} />
            <DetallePedidoModalCliente open={isDetalleModalOpen} onClose={() => setIsDetalleModalOpen(false)} pedidoId={selectedPedidoId} />
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ open: false, message: '' })} message={snackbar.message} />
        </Container>
    );
};

export default ClientePedidosPage;