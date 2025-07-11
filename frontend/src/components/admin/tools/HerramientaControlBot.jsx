// src/components/admin/tools/HerramientaControlBot.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Switch, FormControlLabel, CircularProgress } from '@mui/material';
import adminService from '../../../services/adminService';

const HerramientaControlBot = () => {
    const [clientes, setClientes] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRows, setTotalRows] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchClientes = useCallback(async () => {
        setLoading(true);
        // La página de la API es base 1, la de la tabla MUI es base 0
        const data = await adminService.getPerfilesCliente(page + 1, rowsPerPage);
        setClientes(data.items);
        setTotalRows(data.total);
        setLoading(false);
    }, [page, rowsPerPage]);

    useEffect(() => {
        fetchClientes();
    }, [fetchClientes]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleTogglePause = async (perfilId, isPaused) => {
        const action = isPaused ? adminService.reanudarBotCliente : adminService.pausarBotCliente;
        await action(perfilId);
        // Actualizamos el estado localmente para reflejar el cambio instantáneamente
        setClientes(prev => prev.map(p => 
            p.id === perfilId ? { ...p, bot_pausado: !isPaused } : p
        ));
    };

    return (
        <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Control Manual del Bot de Chat</Typography>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre Cliente</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell align="right">Acción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow><TableCell colSpan={3} align="center"><CircularProgress /></TableCell></TableRow>
                        ) : (
                            clientes.map(perfil => (
                                <TableRow key={perfil.id}>
                                    <TableCell>{perfil.nombre}</TableCell>
                                    <TableCell>{perfil.telefono}</TableCell>
                                    <TableCell align="right">
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    checked={perfil.bot_pausado}
                                                    onChange={() => handleTogglePause(perfil.id, perfil.bot_pausado)}
                                                    color="warning"
                                                />
                                            }
                                            label={perfil.bot_pausado ? "Pausado" : "Activo"}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={totalRows}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Filas por página:"
            />
        </Paper>
    );
};

export default HerramientaControlBot;