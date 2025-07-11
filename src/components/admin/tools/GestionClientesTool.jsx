// frontend/src/components/admin/tools/GestionClientesTool.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Tooltip, CircularProgress, TablePagination } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import adminService from '../../../services/adminService';
import AdminClienteFormModal from './AdminClienteFormModal';

const GestionClientesTool = () => {
    const [clientes, setClientes] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [clienteToEdit, setClienteToEdit] = useState(null);

    const fetchClientes = useCallback(async () => {
        setLoading(true);
        const data = await adminService.getPerfilesCliente(page + 1, rowsPerPage);
        setClientes(data.items.map(c => ({...c, id: c.id}))); // Ensure id exists for key
        setTotalRows(data.total);
        setLoading(false);
    }, [page, rowsPerPage]);

    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);

    const handleOpenModal = (cliente = null) => {
        setClienteToEdit(cliente);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setClienteToEdit(null);
        setIsModalOpen(false);
    };

    const handleSave = async (data) => {
        try {
            if (clienteToEdit) {
                await adminService.updatePerfilClienteForTool(clienteToEdit.id, data);
            } else {
                await adminService.createPerfilClienteForTool(data);
            }
            fetchClientes(); // Recargar datos
            handleCloseModal();
        } catch (error) {
            console.error("Error al guardar el perfil:", error);
            // Aquí podrías mostrar una alerta/snackbar al usuario
        }
    };
    
    const handleDelete = async (clienteId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este perfil? Esta acción podría ser irreversible.')) {
            try {
                await adminService.deletePerfilClienteForTool(clienteId);
                fetchClientes(); // Recargar datos
            } catch (error) {
                console.error("Error al eliminar el perfil:", error);
                alert(error.response?.data?.message || 'No se pudo eliminar el perfil.');
            }
        }
    };
    
    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <Paper sx={{ p: 2, mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Gestión de Perfiles de Cliente</Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
                    Crear Perfil
                </Button>
            </Box>
            <TableContainer>
                {loading ? <CircularProgress /> : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                                <TableCell>Teléfono</TableCell>
                                <TableCell align="right">Acciones</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clientes.map(cliente => (
                                <TableRow key={cliente.id}>
                                    <TableCell>{cliente.id}</TableCell>
                                    <TableCell>{cliente.nombre}</TableCell>
                                    <TableCell>{cliente.telefono}</TableCell>
                                    <TableCell align="right">
                                        <Tooltip title="Editar Perfil">
                                            <IconButton onClick={() => handleOpenModal(cliente)}><EditIcon /></IconButton>
                                        </Tooltip>
                                        <Tooltip title="Eliminar Perfil">
                                            <IconButton onClick={() => handleDelete(cliente.id)}><DeleteIcon color="error" /></IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </TableContainer>
            <TablePagination
                component="div"
                count={totalRows}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <AdminClienteFormModal 
                open={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
                clienteToEdit={clienteToEdit}
            />
        </Paper>
    );
};

export default GestionClientesTool;