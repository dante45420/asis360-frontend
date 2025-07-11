// src/components/admin/GestionProductos.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, IconButton, Box, CircularProgress, Alert, Snackbar, Stack } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import adminService from '../../services/adminService';
import ProductoForm from './ProductoForm';

const GestionProductos = () => {
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProducto, setCurrentProducto] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const fetchProductos = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminService.getProductos();
            setProductos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductos();
    }, [fetchProductos]);

    const handleOpenModal = (producto = null) => {
        setCurrentProducto(producto);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProducto(null);
    };

    const handleSaveProduct = async (productoData) => {
        try {
            let response;
            if (currentProducto) {
                response = await adminService.updateProducto(currentProducto.producto_id, productoData);
            } else {
                response = await adminService.createProducto(productoData);
            }
            setSnackbar({ open: true, message: response.message });
            handleCloseModal();
            fetchProductos();
        } catch (err) {
            console.error("Error al guardar producto:", err);
            setSnackbar({ open: true, message: err.response?.data?.message || "Error al guardar el producto." });
        }
    };

    const handleDeleteProduct = async (productoId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.')) {
            try {
                const response = await adminService.deleteProducto(productoId);
                setSnackbar({ open: true, message: response.message });
                fetchProductos();
            } catch (err) {
                console.error("Error al eliminar producto:", err);
                setSnackbar({ open: true, message: err.message || "Error al eliminar el producto." });
            }
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Listado de Productos</Typography>
                <Button variant="contained" onClick={() => handleOpenModal()}>
                    Añadir Producto
                </Button>
            </Box>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TableContainer component={Paper}>
                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>
                ) : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre del Producto</TableCell>
                                <TableCell>Categoría</TableCell>
                                <TableCell>Proveedor</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {productos.map((p) => (
                                <TableRow key={p.producto_id}>
                                    <TableCell>{p.producto_id}</TableCell>
                                    <TableCell>{p.nombre_producto}</TableCell>
                                    <TableCell>{p.categoria}</TableCell>
                                    <TableCell>{p.proveedor_nombre}</TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                            <Button 
                                                size="small" 
                                                variant="outlined"
                                                component={RouterLink}
                                                to={`/admin/productos/${p.producto_id}`}
                                            >
                                                Gestionar
                                            </Button>
                                            <IconButton onClick={() => handleOpenModal(p)}><EditIcon /></IconButton>
                                            <IconButton onClick={() => handleDeleteProduct(p.producto_id)}><DeleteIcon color="error" /></IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>

            <ProductoForm 
                open={isModalOpen} 
                onClose={handleCloseModal} 
                onSave={handleSaveProduct}
                producto={currentProducto} 
            />
            <Snackbar 
                open={snackbar.open} 
                autoHideDuration={6000} 
                onClose={() => setSnackbar({ open: false, message: '' })} 
                message={snackbar.message} 
            />
        </>
    );
};

export default GestionProductos;