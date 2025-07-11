// src/components/admin/GestionProveedores.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, IconButton, Box, CircularProgress, Alert, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import adminService from '../../services/adminService';
import ProveedorForm from './ProveedorForm';

const GestionProveedores = () => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProveedor, setCurrentProveedor] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });

    const fetchProveedores = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminService.getProveedores();
            setProveedores(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProveedores();
    }, [fetchProveedores]);

    const handleOpenModal = (proveedor = null) => {
        setCurrentProveedor(proveedor);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setCurrentProveedor(null);
    };

    const handleSave = async (proveedorData) => {
        try {
            const response = currentProveedor
                ? await adminService.updateProveedor(currentProveedor.proveedor_id, proveedorData)
                : await adminService.createProveedor(proveedorData);
            setSnackbar({ open: true, message: response.message });
            handleCloseModal();
            fetchProveedores();
        } catch (err) {
            setError(err.message);
        }
    };
    
    const handleDelete = async (proveedorId) => {
        if(window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
            try {
                const response = await adminService.deleteProveedor(proveedorId);
                setSnackbar({ open: true, message: response.message });
                fetchProveedores();
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Listado de Proveedores</Typography>
                <Button variant="contained" onClick={() => handleOpenModal()}>Añadir Proveedor</Button>
            </Box>
            
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            
            <TableContainer component={Paper}>
                {loading ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box> :
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Contacto</TableCell>
                                <TableCell>Calidad</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {proveedores.map((p) => (
                                <TableRow key={p.proveedor_id}>
                                    <TableCell>{p.proveedor_id}</TableCell>
                                    <TableCell>{p.nombre}</TableCell>
                                    <TableCell>{p.info_contacto}</TableCell>
                                    <TableCell>{p.calidad_servicio}/10</TableCell>
                                    <TableCell align="right">
                                        <IconButton onClick={() => handleOpenModal(p)}><EditIcon /></IconButton>
                                        <IconButton onClick={() => handleDelete(p.proveedor_id)}><DeleteIcon color="error" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                }
            </TableContainer>

            <ProveedorForm open={isModalOpen} onClose={handleCloseModal} onSave={handleSave} proveedor={currentProveedor} />
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ open: false, message: '' })} message={snackbar.message} />
        </>
    );
};

export default GestionProveedores;