import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button,
    Chip, CircularProgress, Alert, Box, Tabs, Tab, Snackbar, Stack, Grid, IconButton, Tooltip, Divider
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddTaskIcon from '@mui/icons-material/AddTask';
import DeleteIcon from '@mui/icons-material/Delete';
import adminService from '../../services/adminService';
import DetalleCompletoPedidoModal from '../../components/admin/DetalleCompletoPedidoModal';

// --- Componente para la Mesa de Procesamiento ---
const MesaDeProcesamiento = ({ pedidos, onRemove, onProcess }) => (
    <Paper sx={{ p: 2, height: '100%', position: 'sticky', top: '128px' }}>
        <Typography variant="h6" gutterBottom>Mesa de Procesamiento</Typography>
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Cliente</TableCell>
                        <TableCell>Producto</TableCell>
                        <TableCell>Acción</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {pedidos.map(p => (
                        <TableRow key={p.detalle_id}>
                            <TableCell>{p.cliente_nombre}</TableCell>
                            <TableCell>{p.nombre_producto_corto}</TableCell>
                            <TableCell>
                                <Tooltip title="Quitar de la mesa">
                                    <IconButton size="small" onClick={() => onRemove(p.detalle_id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    ))}
                    {pedidos.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} align="center">Añade pedidos a la mesa</TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
        <Button sx={{ mt: 2 }} fullWidth variant="contained" disabled={pedidos.length === 0} onClick={onProcess}>
            Continuar a Procesamiento ({pedidos.length})
        </Button>
    </Paper>
);

// --- Componente para mostrar el tiempo restante ---
const TimeRemaining = ({ expiryDate }) => {
    const calculateTimeLeft = useCallback(() => {
        if (!expiryDate) return null;
        const difference = +new Date(expiryDate) - +new Date();
        if (difference <= 0) return null;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        return { días: days, horas: hours };
    }, [expiryDate]);

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => setTimeLeft(calculateTimeLeft()), 1000 * 60);
        return () => clearTimeout(timer);
    });

    if (!timeLeft) return <Chip label="Expirado" color="error" size="small" />;
    return <Chip label={`Quedan ${timeLeft.días}d ${timeLeft.horas}h`} color="secondary" size="small" />;
};


const AdminPedidosPage = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('en_espera');
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [loadingAction, setLoadingAction] = useState(null);
    const [loadingComprobante, setLoadingComprobante] = useState(null);
    const [pedidosParaProcesar, setPedidosParaProcesar] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedPedidoId, setSelectedPedidoId] = useState(null);
    const navigate = useNavigate();

    const fetchPedidos = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const result = await adminService.getPedidos(selectedStatus);
            setData(result);
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al cargar datos.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    }, [selectedStatus]);

    useEffect(() => {
        fetchPedidos();
    }, [fetchPedidos]);

    const handleTabChange = (event, newValue) => setSelectedStatus(newValue);

    const handleAction = async (action, pedidoId) => {
        setLoadingAction(pedidoId);
        try {
            let response;
            switch (action) {
                case 'aprobar': response = await adminService.aprobarPedido(pedidoId); break;
                case 'rechazar':
                    const motivo = window.prompt("Motivo del rechazo (opcional):");
                    if (motivo === null) { setLoadingAction(null); return; }
                    response = await adminService.rechazarPedido(pedidoId, motivo);
                    break;
                case 'enviar': response = await adminService.marcarComoEnviado(pedidoId); break;
                case 'completar': response = await adminService.marcarComoCompletado(pedidoId); break;
                default: throw new Error("Acción desconocida");
            }
            setSnackbar({ open: true, message: response.message });
            fetchPedidos();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoadingAction(null);
        }
    };
    
    const handleVerComprobante = async (pedidoId) => {
        setLoadingComprobante(pedidoId);
        try {
            const data = await adminService.getComprobanteUrl(pedidoId);
            window.open(data.url, '_blank');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al ver el comprobante.');
        } finally {
            setLoadingComprobante(null);
        }
    };

    const handleAddToMesa = (pedido, productoNombre) => {
        setPedidosParaProcesar(prev => {
            if (prev.find(p => p.detalle_id === pedido.detalle_id)) return prev;
            return [...prev, { ...pedido, nombre_producto_corto: productoNombre }];
        });
    };

    const handleRemoveFromMesa = (detalleId) => setPedidosParaProcesar(prev => prev.filter(p => p.detalle_id !== detalleId));
    const handleContinueToProcessing = () => navigate('/admin/procesar-grupo', { state: { pedidos: pedidosParaProcesar } });
    const handleOpenModal = (pedidoId) => { setSelectedPedidoId(pedidoId); setModalOpen(true); };

    const getStatusChip = (status) => {
        if (!status) return <Chip label="Indefinido" color="default" size="small" />;
        const colorMap = { 'en_revision': 'warning', 'pagado': 'info', 'en_camino': 'primary', 'completo': 'success', 'cancelado': 'error', 'esperando_pago': 'secondary', 'en_pausa': 'default', 'en_espera': 'secondary' };
        return <Chip label={status.replace(/_/g, ' ')} color={colorMap[status] || 'default'} size="small" sx={{ textTransform: 'capitalize' }} />;
    };

    const renderActionButtons = (pedido) => {
        const isLoading = loadingAction === pedido.pedido_id;
        switch (pedido.estado) {
            case 'en_revision': return (<><Button variant="outlined" size="small" onClick={() => handleVerComprobante(pedido.pedido_id)} disabled={loadingComprobante === pedido.pedido_id}>{loadingComprobante === pedido.pedido_id ? <CircularProgress size={20} /> : "Ver Comp."}</Button><Button variant="contained" color="success" size="small" onClick={() => handleAction('aprobar', pedido.pedido_id)} disabled={isLoading}>Aprobar</Button><Button variant="outlined" color="error" size="small" onClick={() => handleAction('rechazar', pedido.pedido_id)} disabled={isLoading}>Rechazar</Button></>);
            case 'pagado': return <Button variant="contained" size="small" onClick={() => handleAction('enviar', pedido.pedido_id)} disabled={isLoading}>Marcar como Enviado</Button>;
            case 'en_camino': return <Button variant="contained" color="success" size="small" onClick={() => handleAction('completar', pedido.pedido_id)} disabled={isLoading}>Marcar como Completado</Button>;
            default: return null;
        }
    };

    const renderEnEsperaView = () => (
        <Grid container spacing={3}>
            <Grid xs={12} md={8}>
                {data.length === 0 ? <Typography sx={{ p: 2 }}>No hay pedidos en espera para agrupar.</Typography> :
                    data.map(grupo => (
                        <Paper key={grupo.producto_id} sx={{ mb: 2, p: 2 }}>
                            <Typography variant="h6">{grupo.nombre_producto}</Typography><Divider sx={{ my: 1 }} />
                            {/* --- CORRECCIÓN AÑADIDA --- */}
                            {/* Nos aseguramos de que grupo.pedidos sea un array antes de mapearlo */}
                            {Array.isArray(grupo.pedidos) && grupo.pedidos.map(p => (
                                <Stack key={p.detalle_id} direction="row" spacing={2} alignItems="center" sx={{ my: 1, borderBottom: '1px solid #eee', pb: 1, flexWrap: 'wrap' }}>
                                    <Typography sx={{ flexBasis: '25%' }}><b>Cliente:</b> {p.cliente_nombre}</Typography>
                                    <Box sx={{ flexBasis: '30%' }}>{p.respuestas && Object.entries(p.respuestas).map(([key, value]) => <Chip key={key} label={`${key}: ${value}`} size="small" sx={{ mr: 0.5, mb: 0.5 }} />)}</Box>
                                    <Box sx={{ flexBasis: '15%', textAlign: 'center' }}>{p.fecha_espera_maxima && <TimeRemaining expiryDate={p.fecha_espera_maxima} />}</Box>
                                    <Box sx={{ flexBasis: '30%', textAlign: 'right' }}>
                                        <Tooltip title="Ver Pedido Completo"><IconButton size="small" onClick={() => handleOpenModal(p.pedido_id)}><VisibilityIcon /></IconButton></Tooltip>
                                        <Tooltip title="Añadir a Mesa de Procesamiento"><IconButton size="small" onClick={() => handleAddToMesa(p, grupo.nombre_producto)}><AddTaskIcon /></IconButton></Tooltip>
                                    </Box>
                                </Stack>
                            ))}
                        </Paper>
                    ))
                }
            </Grid>
            <Grid xs={12} md={4}><MesaDeProcesamiento pedidos={pedidosParaProcesar} onRemove={handleRemoveFromMesa} onProcess={handleContinueToProcessing} /></Grid>
        </Grid>
    );

    const renderDefaultView = () => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Cliente</TableCell><TableCell>Fecha</TableCell><TableCell>Monto</TableCell><TableCell>Estado</TableCell><TableCell align="right">Acciones</TableCell></TableRow></TableHead>
                <TableBody>
                    {data.length > 0 ? (
                        data.map((pedido) => (
                            <TableRow key={pedido.pedido_id}>
                                <TableCell>{pedido.pedido_id}</TableCell>
                                <TableCell>{pedido.cliente_nombre}</TableCell>
                                <TableCell>{new Date(pedido.fecha_creacion).toLocaleDateString('es-CL')}</TableCell>
                                <TableCell>${(pedido.monto_total || 0).toLocaleString('es-CL')}</TableCell>
                                <TableCell>{getStatusChip(pedido.estado)}</TableCell>
                                <TableCell align="right"><Stack direction="row" spacing={1} justifyContent="flex-end">{renderActionButtons(pedido)}</Stack></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow><TableCell colSpan={6} align="center">No hay pedidos con este estado.</TableCell></TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>Gestión de Pedidos</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={selectedStatus} onChange={handleTabChange} variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile>
                    <Tab label="En Espera (Grupo)" value="en_espera" /><Tab label="En Revisión" value="en_revision" /><Tab label="Pagados" value="pagado" /><Tab label="En Camino" value="en_camino" /><Tab label="En Pausa (Bot)" value="en_pausa" /><Tab label="Esperando Pago" value="esperando_pago" /><Tab label="Completos" value="completo" /><Tab label="Cancelados" value="cancelado" />
                </Tabs>
            </Box>
            {loading ? <CircularProgress sx={{ display: 'block', margin: 'auto' }} /> : error ? <Alert severity="error">{error}</Alert> : (
                selectedStatus === 'en_espera' ? renderEnEsperaView() : renderDefaultView()
            )}
            <DetalleCompletoPedidoModal open={modalOpen} onClose={() => setModalOpen(false)} pedidoId={selectedPedidoId} />
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ open: false, message: '' })} message={snackbar.message} />
        </Box>
    );
};

export default AdminPedidosPage;