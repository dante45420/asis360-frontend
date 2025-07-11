// src/components/admin/tools/GestionPedidosTool.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // <-- Importar hook
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, CircularProgress } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import adminService from '../../../services/adminService';

const GestionPedidosTool = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // <-- Instanciar hook

    const fetchPedidos = useCallback(async () => {
        setLoading(true);
        const data = await adminService.getAllPedidos();
        setPedidos(data);
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchPedidos();
    }, [fetchPedidos]);

    const handleDelete = async (pedidoId) => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar el pedido #${pedidoId}? Esta acción es irreversible.`)) {
            await adminService.deletePedido(pedidoId);
            fetchPedidos(); // Recargar la lista
        }
    };

    return (
        <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Gestión Manual de Pedidos</Typography>
                {/* Botón "Crear" ahora navega al formulario */}
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate('/admin/herramientas/pedidos/nuevo')}>
                    Crear Pedido
                </Button>
            </Box>
            <TableContainer>
                {loading ? <CircularProgress /> : (
                    <Table>
                        <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Cliente</TableCell><TableCell>Fecha</TableCell><TableCell>Estado</TableCell><TableCell>Total</TableCell><TableCell align="right">Acciones</TableCell></TableRow></TableHead>
                        <TableBody>
                            {pedidos.map(pedido => (
                                <TableRow key={pedido.pedido_id}>
                                    <TableCell>{pedido.pedido_id}</TableCell>
                                    <TableCell>{pedido.cliente_nombre}</TableCell>
                                    <TableCell>{new Date(pedido.fecha_creacion).toLocaleDateString()}</TableCell>
                                    <TableCell>{pedido.estado}</TableCell>
                                    <TableCell>${(pedido.monto_total).toLocaleString('es-CL')}</TableCell>
                                    <TableCell align="right">
                                        {/* Botón "Editar" ahora navega al formulario con el ID */}
                                        <Tooltip title="Editar Pedido">
                                            <IconButton onClick={() => navigate(`/admin/herramientas/pedidos/${pedido.pedido_id}`)}><EditIcon /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar Pedido">
                                            <IconButton onClick={() => handleDelete(pedido.pedido_id)}><DeleteIcon color="error" /></IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
        </Paper>
    );
};

export default GestionPedidosTool;