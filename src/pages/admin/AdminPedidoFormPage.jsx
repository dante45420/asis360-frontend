// src/pages/admin/AdminPedidoFormPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, TextField, Button, CircularProgress, Select, MenuItem, FormControl, InputLabel, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Tooltip, Divider } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SettingsIcon from '@mui/icons-material/Settings'; // Icono para el modal
import adminService from '../../services/adminService';
import RequisitosModal from '../../components/admin/tools/RequisitosModal'; // Importamos el nuevo modal

const AdminPedidoFormPage = () => {
    const { pedidoId } = useParams();
    const navigate = useNavigate();
    const isEditing = Boolean(pedidoId);

    // Estados existentes
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [pedidoData, setPedidoData] = useState({ perfil_cliente_id: '', estado: 'pendiente' });
    const [detalles, setDetalles] = useState([]);

    // --- NUEVOS ESTADOS ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDetalleIndex, setSelectedDetalleIndex] = useState(null);
    const [totalPedido, setTotalPedido] = useState(0);

    // --- EFECTO PARA RECALCULAR EL TOTAL ---
    useEffect(() => {
        const calcularTotal = () => {
            const total = detalles.reduce((sum, item) => {
                const cantidad = parseInt(item.respuestas_requisitos?.Cantidad || 1, 10);
                const precio = parseFloat(item.precio_pagado || 0);
                return sum + (cantidad * precio);
            }, 0);
            setTotalPedido(total);
        };
        calcularTotal();
    }, [detalles]); // Se ejecuta cada vez que el array de detalles cambia

    const loadInitialData = useCallback(async () => {
        // ... (sin cambios en esta función)
        setLoading(true);
        try {
            const [clientesRes, productosRes] = await Promise.all([
                adminService.getClientesList(),
                adminService.getProductosList()
            ]);
            setClientes(clientesRes);
            setProductos(productosRes);

            if (isEditing) {
                const pedidoRes = await adminService.getPedidoForTool(pedidoId);
                setPedidoData({
                    perfil_cliente_id: pedidoRes.perfil_cliente_id,
                    estado: pedidoRes.estado,
                });
                
                const detallesFormateados = pedidoRes.detalles.map(d => ({
                    ...d,
                    respuestas_requisitos: typeof d.respuestas_requisitos === 'object' && d.respuestas_requisitos !== null ? d.respuestas_requisitos : {}
                }));

                setDetalles(detallesFormateados);
            }
        } catch (error) {
            console.error("Error cargando datos iniciales:", error);
        } finally {
            setLoading(false);
        }
    }, [isEditing, pedidoId]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const handlePedidoDataChange = (e) => {
        const { name, value } = e.target;
        setPedidoData(prev => ({ ...prev, [name]: value }));
    };

    const handleDetailChange = (index, e) => {
        const { name, value } = e.target;
        const newDetalles = [...detalles];
        if (name === 'producto_id') {
            const productoSeleccionado = productos.find(p => p.id === value);
            newDetalles[index].producto_id = value;
            newDetalles[index].nombre_producto_historico = productoSeleccionado ? productoSeleccionado.nombre : '';
        } else if (name === 'cantidad') {
            newDetalles[index].respuestas_requisitos = {
                ...newDetalles[index].respuestas_requisitos,
                'Cantidad': value
            };
        } else {
             newDetalles[index][name] = value;
        }
        setDetalles(newDetalles);
    };

    const handleAddItem = () => {
        setDetalles([...detalles, {
            producto_id: '',
            respuestas_requisitos: { 'Cantidad': 1 },
            precio_unitario_historico: '0.00',
            precio_pagado: '0.00'
        }]);
    };

    const handleRemoveItem = (index) => {
        const newDetalles = detalles.filter((_, i) => i !== index);
        setDetalles(newDetalles);
    };

    // --- NUEVAS FUNCIONES PARA EL MODAL ---
    const handleOpenModal = (index) => {
        setSelectedDetalleIndex(index);
        setIsModalOpen(true);
    };

    const handleSaveRequisitos = (nuevasRespuestas) => {
        if (selectedDetalleIndex !== null) {
            const newDetalles = [...detalles];
            newDetalles[selectedDetalleIndex].respuestas_requisitos = nuevasRespuestas;
            setDetalles(newDetalles);
        }
    };

    const handleSubmit = async () => {
        setSaving(true);
        // El backend recalculará el total, pero lo enviamos para consistencia
        const payload = { ...pedidoData, detalles, monto_total: totalPedido };
        try {
            if (isEditing) {
                await adminService.updatePedidoForTool(pedidoId, payload);
            } else {
                await adminService.createPedidoForTool(payload);
            }
            navigate('/admin/herramientas');
        } catch (error) {
            console.error("Error guardando el pedido:", error);
        } finally {
            setSaving(false);
        }
    };
    
    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/herramientas')} sx={{ mb: 2 }}>
                Volver a Herramientas
            </Button>
            <Typography variant="h4" gutterBottom>{isEditing ? `Editando Pedido #${pedidoId}` : 'Crear Nuevo Pedido'}</Typography>
            <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* ... (Grid de Cliente y Estado sin cambios) ... */}
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="cliente-select-label">Cliente</InputLabel>
                            <Select labelId="cliente-select-label" name="perfil_cliente_id" value={pedidoData.perfil_cliente_id} label="Cliente" onChange={handlePedidoDataChange} disabled={saving}>
                                {clientes.map(c => <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                             <InputLabel id="estado-select-label">Estado</InputLabel>
                            <Select labelId="estado-select-label" name="estado" value={pedidoData.estado} label="Estado" onChange={handlePedidoDataChange} disabled={saving}>
                                <MenuItem value="pendiente">Pendiente (Carrito)</MenuItem>
                                <MenuItem value="esperando_pago">Esperando Pago</MenuItem>
                                <MenuItem value="en_revision">En Revisión</MenuItem>
                                <MenuItem value="pagado">Pagado</MenuItem>
                                <MenuItem value="en_camino">En Camino</MenuItem>
                                <MenuItem value="completo">Completo</MenuItem>
                                <MenuItem value="cancelado">Cancelado</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>Items del Pedido</Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Producto</TableCell>
                                <TableCell>Cantidad</TableCell>
                                <TableCell>Precio Histórico</TableCell>
                                <TableCell>Precio Pagado</TableCell>
                                <TableCell align="center">Opciones</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {detalles.map((detalle, index) => (
                                <TableRow key={index}>
                                    <TableCell sx={{ minWidth: 200 }}>
                                        <FormControl fullWidth size="small">
                                            <Select name="producto_id" value={detalle.producto_id} onChange={(e) => handleDetailChange(index, e)} disabled={saving}>
                                                {productos.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
                                            </Select>
                                        </FormControl>
                                    </TableCell>
                                    <TableCell>
                                        <TextField type="number" name="cantidad" value={detalle.respuestas_requisitos.Cantidad || 1} onChange={(e) => handleDetailChange(index, e)} size="small" disabled={saving} inputProps={{ min: 1 }} />
                                    </TableCell>
                                    <TableCell>
                                         <TextField type="number" name="precio_unitario_historico" value={detalle.precio_unitario_historico} onChange={(e) => handleDetailChange(index, e)} size="small" disabled={saving} inputProps={{ step: "0.01" }} />
                                    </TableCell>
                                    <TableCell>
                                         <TextField type="number" name="precio_pagado" value={detalle.precio_pagado} onChange={(e) => handleDetailChange(index, e)} size="small" disabled={saving} inputProps={{ step: "0.01" }} />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title="Editar Opciones/Requisitos">
                                            <IconButton onClick={() => handleOpenModal(index)} disabled={saving}><SettingsIcon /></IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Eliminar Item">
                                            <IconButton onClick={() => handleRemoveItem(index)} color="error" disabled={saving}><DeleteIcon /></IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Button startIcon={<AddCircleOutlineIcon />} onClick={handleAddItem} sx={{ mt: 2 }} disabled={saving}>Añadir Item</Button>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h5">
                        Total del Pedido: ${new Intl.NumberFormat('es-CL').format(totalPedido)}
                    </Typography>
                    <Button variant="contained" startIcon={saving ? <CircularProgress size={20} color="inherit"/> : <SaveIcon />} onClick={handleSubmit} disabled={saving || !pedidoData.perfil_cliente_id}>
                        {isEditing ? 'Guardar Cambios' : 'Crear Pedido'}
                    </Button>
                </Box>
            </Paper>

            {/* Renderizamos el Modal */}
            <RequisitosModal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                detalle={selectedDetalleIndex !== null ? detalles[selectedDetalleIndex] : null}
                onSave={handleSaveRequisitos}
            />
        </Box>
    );
};

export default AdminPedidoFormPage;