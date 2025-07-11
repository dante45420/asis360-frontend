import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { 
    Box, Typography, Button, CircularProgress, Alert, Paper, Grid, Divider, IconButton, 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, 
    Tabs, Tab, Select, MenuItem, InputLabel, FormControl, Snackbar
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Save as SaveIcon, Cancel as CancelIcon, ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import adminService from '../../services/adminService';

// --- Sub-componente para gestionar Requisitos ---
const GestionRequisitos = ({ productoId, requisitos, fetchDetails, setSnackbar }) => {
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ nombre_requisito: '', orden: 1, opciones_str: '' });

    const handleEditClick = (req) => {
        setEditingId(req.requisito_id);
        setFormData({ nombre_requisito: req.nombre_requisito, orden: req.orden, opciones_str: req.opciones ? req.opciones.join(', ') : '' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ nombre_requisito: '', orden: 1, opciones_str: '' });
    };

    const handleSave = async () => {
        try {
            // --- LÓGICA CORREGIDA ---
            // Convierte el string de opciones en un array limpio.
            const opcionesArray = formData.opciones_str
                .split(',')
                .map(opt => opt.trim())
                .filter(opt => opt); // Filtra opciones vacías

            const dataToSave = {
                producto_id: productoId,
                nombre_requisito: formData.nombre_requisito,
                orden: formData.orden,
                // Envía el array, o null si está vacío.
                opciones: opcionesArray.length > 0 ? opcionesArray : null
            };

            const response = editingId
                ? await adminService.updateRequisito(editingId, dataToSave)
                : await adminService.createRequisito(dataToSave);

            setSnackbar({ open: true, message: response.message });
            fetchDetails();
            handleCancel();
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.message || 'Error al guardar el requisito' });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este requisito?')) {
            try {
                const response = await adminService.deleteRequisito(id);
                setSnackbar({ open: true, message: response.message });
                fetchDetails();
            } catch (error) {
                setSnackbar({ open: true, message: error.response?.data?.message || 'Error al eliminar requisito' });
            }
        }
    };
    
    return (
        <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Crear y Gestionar Requisitos</Typography>
            <TableContainer>
                <Table size="small">
                    <TableHead><TableRow><TableCell>Orden</TableCell><TableCell>Nombre</TableCell><TableCell>Opciones</TableCell><TableCell align="right">Acciones</TableCell></TableRow></TableHead>
                    <TableBody>
                        {requisitos.map(r => (
                            <TableRow key={r.requisito_id}>
                                <TableCell>{r.orden}</TableCell>
                                <TableCell>{r.nombre_requisito}</TableCell>
                                <TableCell sx={{ wordBreak: 'break-word' }}>{r.opciones ? r.opciones.join(', ') : 'N/A'}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleEditClick(r)}><EditIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(r.requisito_id)}><DeleteIcon fontSize="small" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{mb: 1}}>{editingId ? `Editando Requisito #${editingId}` : 'Añadir Nuevo Requisito'}</Typography>
            <Box component="form" sx={{ display: 'flex', gap: 1, alignItems: 'flex-start' }}>
                <TextField label="Orden" type="number" name="orden" value={formData.orden} onChange={e => setFormData({...formData, orden: e.target.value})} size="small" sx={{ width: '80px' }} />
                <TextField label="Nombre Requisito" name="nombre_requisito" value={formData.nombre_requisito} onChange={e => setFormData({...formData, nombre_requisito: e.target.value})} size="small" fullWidth />
                <TextField label="Opciones (separadas por coma)" name="opciones_str" value={formData.opciones_str} onChange={e => setFormData({...formData, opciones_str: e.target.value})} size="small" fullWidth multiline />
                <Box>
                    <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>{editingId ? 'Guardar' : 'Añadir'}</Button>
                    {editingId && <Button size="small" sx={{mt: 1}} onClick={handleCancel} startIcon={<CancelIcon />}>Cancelar</Button>}
                </Box>
            </Box>
        </Paper>
    );
};

// --- El resto de los sub-componentes se mantienen igual ---
const GestionPrecios = ({ productoId, precios, requisitos, fetchDetails, setSnackbar }) => {
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ variante_requisitos: {}, cantidad_minima: 1, precio_unitario: '' });

    const handleEditClick = (p) => {
        setEditingId(p.precio_id);
        setFormData({ variante_requisitos: p.variante_requisitos || {}, cantidad_minima: p.cantidad_minima, precio_unitario: p.precio_unitario });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({ variante_requisitos: {}, cantidad_minima: 1, precio_unitario: '' });
    };

    const handleSave = async () => {
        if (!formData.precio_unitario) return;
        try {
            const dataToSave = { ...formData, producto_id: productoId, variante_requisitos: Object.keys(formData.variante_requisitos).length > 0 ? formData.variante_requisitos : null };
            const response = editingId
                ? await adminService.updatePrecio(editingId, dataToSave)
                : await adminService.createPrecio(dataToSave);
            setSnackbar({ open: true, message: response.message });
            fetchDetails();
            handleCancel();
        } catch (error) {
            setSnackbar({ open: true, message: error.response?.data?.message || 'Error al guardar el precio' });
        }
    };
    
    const handleDelete = async (id) => {
        if (window.confirm('¿Eliminar este precio?')) {
            try {
                const response = await adminService.deletePrecio(id);
                setSnackbar({ open: true, message: response.message });
                fetchDetails();
            } catch (error) {
                setSnackbar({ open: true, message: error.response?.data?.message || 'Error al eliminar precio' });
            }
        }
    };

    return (
        <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Crear y Gestionar Precios por Variante</Typography>
            <TableContainer>
                <Table size="small">
                    <TableHead><TableRow><TableCell>Variante</TableCell><TableCell>Cant. Mínima</TableCell><TableCell>Precio</TableCell><TableCell align="right">Acciones</TableCell></TableRow></TableHead>
                    <TableBody>
                        {precios.map(p => (
                            <TableRow key={p.precio_id}>
                                <TableCell>{p.variante_requisitos ? JSON.stringify(p.variante_requisitos) : 'Precio Base'}</TableCell>
                                <TableCell>{p.cantidad_minima}</TableCell>
                                <TableCell>${parseFloat(p.precio_unitario).toLocaleString('es-CL')}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={() => handleEditClick(p)}><EditIcon fontSize="small" /></IconButton>
                                    <IconButton size="small" onClick={() => handleDelete(p.precio_id)}><DeleteIcon fontSize="small" /></IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Divider sx={{ my: 2 }} />
            <Typography variant="body1" sx={{mb: 1}}>{editingId ? `Editando Precio #${editingId}` : 'Añadir Nuevo Precio'}</Typography>
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {requisitos.filter(r => r.opciones && r.opciones.length > 0).map(req => (
                        <FormControl key={req.requisito_id} fullWidth size="small">
                            <InputLabel>{req.nombre_requisito}</InputLabel>
                            <Select
                                value={formData.variante_requisitos[req.nombre_requisito] || ''}
                                label={req.nombre_requisito}
                                onChange={e => setFormData({...formData, variante_requisitos: {...formData.variante_requisitos, [req.nombre_requisito]: e.target.value }})}
                            >
                                <MenuItem value=""><em>(Ninguna/Para Precio Base)</em></MenuItem>
                                {req.opciones.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                            </Select>
                        </FormControl>
                    ))}
                </Box>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <TextField label="Precio Unitario" type="number" name="precio_unitario" value={formData.precio_unitario} onChange={e => setFormData({...formData, precio_unitario: e.target.value})} size="small" fullWidth />
                    <TextField label="Cantidad Mínima" type="number" name="cantidad_minima" value={formData.cantidad_minima} onChange={e => setFormData({...formData, cantidad_minima: e.target.value})} size="small" fullWidth />
                    <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>{editingId ? 'Guardar' : 'Añadir'}</Button>
                    {editingId && <Button variant="text" onClick={handleCancel} startIcon={<CancelIcon />}>Cancelar</Button>}
                </Box>
            </Box>
        </Paper>
    );
};

const GestionMedia = ({ producto, fetchDetails, setSnackbar }) => {
    const [formData, setFormData] = useState({ media_url: '', media_type: '' });
    const [error, setError] = useState('');

    useEffect(() => {
        setFormData({ media_url: producto.media_url || '', media_type: producto.media_type || '' });
    }, [producto]);

    const handleSave = async () => {
        setError('');
        try {
            const response = await adminService.updateProducto(producto.producto_id, formData);
            fetchDetails();
            setSnackbar({ open: true, message: response.message });
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Error al guardar la media.';
            setError(errorMessage);
            setSnackbar({ open: true, message: errorMessage });
        }
    };
    
    return(
        <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Foto y Video del Producto</Typography>
            <Box sx={{display: 'flex', gap: 2, alignItems: 'center', mb: 2}}>
                <TextField label="URL Pública de Media" value={formData.media_url} onChange={e => setFormData({...formData, media_url: e.target.value})} fullWidth error={!!error} helperText={error} />
                <FormControl sx={{minWidth: 120}}>
                    <InputLabel>Tipo</InputLabel>
                    <Select value={formData.media_type} label="Tipo" onChange={e => setFormData({...formData, media_type: e.target.value})}>
                        <MenuItem value=""><em>Ninguno</em></MenuItem>
                        <MenuItem value="image">Imagen</MenuItem>
                        <MenuItem value="video">Video</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>Guardar Media</Button>
            </Box>
            <Divider />
            <Box mt={2}>
                <Typography variant="subtitle1">Vista Previa Actual:</Typography>
                {formData.media_url ? (
                    formData.media_type === 'image' ? ( <img src={formData.media_url} alt="Vista previa" style={{ maxWidth: '100%', maxHeight: '300px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '8px' }} /> )
                    : formData.media_type === 'video' ? ( <video src={formData.media_url} controls style={{ maxWidth: '100%', maxHeight: '300px', border: '1px solid #ddd', borderRadius: '4px', marginTop: '8px' }} /> )
                    : ( <Typography variant="body2" color="text.secondary">Selecciona un tipo de media para ver la vista previa.</Typography> )
                ) : ( <Typography variant="body2" color="text.secondary">No se ha asignado ninguna imagen o video.</Typography> )}
            </Box>
        </Paper>
    );
};

const TablaResumen = ({ requisitos, precios }) => {
    const variantes = useMemo(() => {
        const reqsWithOptions = requisitos.filter(r => r.opciones && r.opciones.length > 0 && r.nombre_requisito !== 'Cantidad');
        if (reqsWithOptions.length === 0) {
            return [{ "Variante": "Precio Base" }];
        }
        let combinations = [{}];
        for (const req of reqsWithOptions) {
            const newCombinations = [];
            for (const combo of combinations) {
                for (const option of req.opciones) {
                    newCombinations.push({ ...combo, [req.nombre_requisito]: option });
                }
            }
            combinations = newCombinations;
        }
        return combinations;
    }, [requisitos]);

    const findPrice = (variante, cantidad) => {
        let bestMatch = null;
        let maxSpecificity = -1;
        const targetVariante = (variante["Variante"] === "Precio Base") ? {} : variante;
        for (const p of precios) {
            if (cantidad < p.cantidad_minima) continue;
            const pVariante = p.variante_requisitos || {};
            const isSubset = Object.keys(pVariante).every(key => targetVariante[key] === pVariante[key]);
            if (isSubset) {
                const specificity = Object.keys(pVariante).length;
                if (specificity > maxSpecificity) {
                    maxSpecificity = specificity;
                    bestMatch = p;
                } else if (specificity === maxSpecificity && bestMatch && p.cantidad_minima > bestMatch.cantidad_minima) {
                    bestMatch = p;
                }
            }
        }
        return bestMatch ? `$${parseFloat(bestMatch.precio_unitario).toLocaleString('es-CL')}` : 'N/A';
    };

    return (
        <Paper sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>Resumen de Precios por Variante</Typography>
            <TableContainer>
                <Table size="small">
                    <TableHead><TableRow><TableCell>Variante</TableCell><TableCell>Precio (x1+)</TableCell><TableCell>Precio (x10+)</TableCell><TableCell>Precio (x50+)</TableCell></TableRow></TableHead>
                    <TableBody>
                        {variantes.map((v, i) => (
                            <TableRow key={i}>
                                <TableCell>{Object.keys(v).length > 0 ? JSON.stringify(v) : 'Precio Base'}</TableCell>
                                <TableCell>{findPrice(v, 1)}</TableCell>
                                <TableCell>{findPrice(v, 10)}</TableCell>
                                <TableCell>{findPrice(v, 50)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
};

const AdminProductoDetailPage = ({ setSnackbar }) => {
    const { productoId } = useParams();
    const [producto, setProducto] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const fetchDetails = useCallback(async () => {
        try {
            setLoading(true);
            const data = await adminService.getProductoDetails(productoId);
            setProducto(data);
        } catch (err) {
            setError('Error al cargar los detalles del producto.');
        } finally {
            setLoading(false);
        }
    }, [productoId]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!producto) return <Alert severity="warning">No se encontró el producto.</Alert>;

    const tabProps = { productoId: producto.producto_id, fetchDetails, setSnackbar };

    return (
        <Box>
            <Button component={RouterLink} to="/admin/catalogo" startIcon={<ArrowBackIcon />} sx={{ mb: 2 }}>Volver al Catálogo</Button>
            <Typography variant="h4" gutterBottom>Gestionar: {producto.nombre_producto}</Typography>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Precios" />
                    <Tab label="Requisitos" />
                    <Tab label="Fotos y Videos" />
                    <Tab label="Tabla Resumen" />
                </Tabs>
            </Box>
            {activeTab === 0 && <GestionPrecios precios={producto.precios} requisitos={producto.requisitos} {...tabProps} />}
            {activeTab === 1 && <GestionRequisitos requisitos={producto.requisitos} {...tabProps} />}
            {activeTab === 2 && <GestionMedia producto={producto} {...tabProps} />}
            {activeTab === 3 && <TablaResumen requisitos={producto.requisitos} precios={producto.precios} />}
        </Box>
    );
};

const AdminProductoDetailPageWrapper = () => {
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    return (
        <>
            <AdminProductoDetailPage setSnackbar={setSnackbar} />
            <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ open: false, message: '' })} message={snackbar.message} />
        </>
    );
};

export default AdminProductoDetailPageWrapper;