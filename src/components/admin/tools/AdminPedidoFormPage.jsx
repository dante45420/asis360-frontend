// src/pages/admin/AdminPedidoFormPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Paper, Grid, TextField, Button, Select, MenuItem, FormControl, InputLabel, IconButton, CircularProgress, Alert, Divider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import adminService from '../../services/adminService';

const AdminPedidoFormPage = () => {
    const { pedidoId } = useParams();
    const navigate = useNavigate();
    // --- LÓGICA CORREGIDA: 'nuevo' es para crear, cualquier otra cosa es edición ---
    const isEditing = pedidoId !== 'nuevo';

    const [pedido, setPedido] = useState({ perfil_cliente_id: '', estado: 'pendiente', detalles: [] });
    const [clientes, setClientes] = useState([]);
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const loadInitialData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const [clientesData, productosData] = await Promise.all([
                adminService.getAllClientesForTool(),
                adminService.getAllProductsForTool()
            ]);
            setClientes(clientesData);
            setProductos(productosData);

            if (isEditing) {
                const pedidoData = await adminService.getPedidoForTool(pedidoId);
                setPedido(pedidoData);
            }
        } catch (err) {
            setError('Error al cargar datos necesarios.');
        } finally {
            setLoading(false);
        }
    }, [pedidoId, isEditing]);

    useEffect(() => {
        loadInitialData();
    }, [loadInitialData]);

    const handlePedidoChange = (e) => setPedido({ ...pedido, [e.target.name]: e.target.value });

    const handleDetalleChange = (index, e) => {
        const nuevosDetalles = [...pedido.detalles];
        nuevosDetalles[index] = { ...nuevosDetalles[index], [e.target.name]: e.target.value };
        setPedido({ ...pedido, detalles: nuevosDetalles });
    };
    
    // Manejador para el campo JSON de respuestas
    const handleRespuestasChange = (index, value) => {
        const nuevosDetalles = [...pedido.detalles];
        try {
            // Intentamos parsear para validar mientras se escribe, pero guardamos como string
            JSON.parse(value);
            // Si es válido, podemos quitar un posible error visual
        } catch (e) {
            // Opcional: marcar el campo con error si el JSON es inválido
        }
        nuevosDetalles[index].respuestas_requisitos = value;
        setPedido({ ...pedido, detalles: nuevosDetalles });
    };

    const addDetalle = () => setPedido({ ...pedido, detalles: [...pedido.detalles, { producto_id: '', respuestas_requisitos: {}, precio_unitario_historico: '0', precio_pagado: '0' }] });
    const removeDetalle = (index) => setPedido({ ...pedido, detalles: pedido.detalles.filter((_, i) => i !== index) });

    const handleSubmit = async () => {
        setError('');
        try {
            // Asegurarse de que el JSON se envíe como objeto
            const payload = {
                ...pedido,
                detalles: pedido.detalles.map(d => ({
                    ...d,
                    respuestas_requisitos: typeof d.respuestas_requisitos === 'string' 
                        ? JSON.parse(d.respuestas_requisitos || '{}') 
                        : d.respuestas_requisitos || {}
                }))
            };

            if (isEditing) {
                await adminService.updatePedidoTool(pedidoId, payload);
            } else {
                await adminService.createPedidoTool(payload);
            }
            alert('Pedido guardado exitosamente');
            navigate('/admin/herramientas');
        } catch (err) {
            setError(err.response?.data?.message || 'Error al guardar el pedido.');
        }
    };

    if (loading) return <CircularProgress />;

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/admin/herramientas')}>Volver</Button>
            <Typography variant="h4" gutterBottom>{isEditing ? `Editar Pedido #${pedidoId}` : 'Crear Nuevo Pedido'}</Typography>
            {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
            <Paper sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Cliente</InputLabel><Select name="perfil_cliente_id" value={pedido.perfil_cliente_id} label="Cliente" onChange={handlePedidoChange}>{clientes.map(c => <MenuItem key={c.id} value={c.id}>{c.nombre}</MenuItem>)}</Select></FormControl></Grid>
                    <Grid item xs={12} sm={6}><FormControl fullWidth><InputLabel>Estado</InputLabel><Select name="estado" value={pedido.estado} label="Estado" onChange={handlePedidoChange}><MenuItem value="pendiente">Pendiente</MenuItem><MenuItem value="en_espera">En Espera</MenuItem><MenuItem value="esperando_pago">Esperando Pago</MenuItem><MenuItem value="pagado">Pagado</MenuItem><MenuItem value="en_camino">En Camino</MenuItem><MenuItem value="completo">Completo</MenuItem><MenuItem value="cancelado">Cancelado</MenuItem></Select></FormControl></Grid>
                    <Grid item xs={12}><Divider><Typography variant="h6">Items del Pedido</Typography></Divider></Grid>
                    {pedido.detalles.map((detalle, index) => (
                        <Grid item xs={12} container spacing={2} key={index} alignItems="center" sx={{ borderBottom: '1px solid #ccc', pb: 2, mb: 2 }}>
                            <Grid item xs={12} md={4}><FormControl fullWidth><InputLabel>Producto</InputLabel><Select name="producto_id" value={detalle.producto_id} onChange={(e) => handleDetalleChange(index, e)}>{productos.map(p => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}</Select></FormControl></Grid>
                            <Grid item xs={6} md={2}><TextField name="precio_unitario_historico" label="Precio Original" type="number" value={detalle.precio_unitario_historico} onChange={(e) => handleDetalleChange(index, e)} fullWidth /></Grid>
                            <Grid item xs={6} md={2}><TextField name="precio_pagado" label="Precio Pagado" type="number" value={detalle.precio_pagado} onChange={(e) => handleDetalleChange(index, e)} fullWidth /></Grid>
                            <Grid item xs={10} md={3}><TextField name="respuestas_requisitos" label="Respuestas (JSON)" multiline maxRows={2} value={typeof detalle.respuestas_requisitos === 'string' ? detalle.respuestas_requisitos : JSON.stringify(detalle.respuestas_requisitos)} onChange={(e) => handleRespuestasChange(index, e.target.value)} fullWidth/></Grid>
                            <Grid item xs={2} md={1}><IconButton onClick={() => removeDetalle(index)}><DeleteIcon color="error"/></IconButton></Grid>
                        </Grid>
                    ))}
                    <Grid item xs={12}><Button startIcon={<AddIcon />} onClick={addDetalle}>Añadir Item</Button></Grid>
                    <Grid item xs={12}><Button variant="contained" color="primary" onClick={handleSubmit}>Guardar Pedido</Button></Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default AdminPedidoFormPage;