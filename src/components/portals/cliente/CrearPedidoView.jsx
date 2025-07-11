// src/components/portals/cliente/CrearPedidoView.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, Card, CardContent, CircularProgress, Alert, Paper, CardActionArea, Button, IconButton, Popover, Menu, MenuItem } from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StorefrontIcon from '@mui/icons-material/Storefront'; // <-- ÍCONO AÑADIDO
import portalService from '../../../services/portalService';
import DetalleProductoModal from './DetalleProductoModal';
import SolicitarProductoModal from './SolicitarProductoModal';

// --- NUEVO COMPONENTE PARA LA TARJETA DE PRODUCTO ---
const ProductoCard = ({ producto, onClick }) => {
    const formatPrice = (prod) => {
        const min = prod.precioMin.toLocaleString('es-CL');
        const max = prod.precioMax.toLocaleString('es-CL');
        if (prod.precioMin === prod.precioMax) return `$${min}`;
        return `$${min} - $${max}`;
    };

    return (
        <Card
            elevation={1}
            sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                transition: 'box-shadow 0.3s',
                '&:hover': {
                    boxShadow: 3
                }
            }}
        >
            <CardActionArea onClick={onClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1, width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography gutterBottom variant="h6" component="div" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                            {producto.nombre}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 1 }}>
                            <StorefrontIcon fontSize="small" sx={{ mr: 0.5 }} />
                            <Typography variant="body2">{producto.proveedor}</Typography>
                        </Box>
                    </Box>
                    <Typography variant="h6" sx={{ mt: 2, fontWeight: 'bold', color: 'primary.main', alignSelf: 'flex-end' }}>
                        {formatPrice(producto)}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};


const CrearPedidoView = ({ onAddToCart, setSnackbar }) => {
    // --- LÓGICA EXISTENTE (SIN CAMBIOS) ---
    const [categorias, setCategorias] = useState([]);
    const [productos, setProductos] = useState([]);
    const [selectedCategoria, setSelectedCategoria] = useState('');
    const [loading, setLoading] = useState({ categorias: true, productos: false });
    const [error, setError] = useState('');
    const [isDetalleModalOpen, setDetalleModalOpen] = useState(false);
    const [isSolicitarModalOpen, setSolicitarModalOpen] = useState(false);
    const [selectedProductoId, setSelectedProductoId] = useState(null);
    const [infoAnchorEl, setInfoAnchorEl] = useState(null);
    const [categoryMenuAnchor, setCategoryMenuAnchor] = useState(null);
    const isCategoryMenuOpen = Boolean(categoryMenuAnchor);

    const handleCategoryMenuClick = (event) => setCategoryMenuAnchor(event.currentTarget);
    const handleCategoryMenuClose = () => setCategoryMenuAnchor(null);
    const handleCategorySelect = (categoria) => {
        handleSelectCategoria(categoria);
        handleCategoryMenuClose();
    };

    const handleInfoClick = (event) => setInfoAnchorEl(event.currentTarget);
    const handleInfoClose = () => setInfoAnchorEl(null);
    const openInfo = Boolean(infoAnchorEl);

    const fetchCategorias = useCallback(async () => {
        setLoading(prev => ({ ...prev, categorias: true }));
        try { const data = await portalService.getCategorias(); setCategorias(data); } 
        catch (err) { setError('No se pudieron cargar las categorías.'); } 
        finally { setLoading(prev => ({ ...prev, categorias: false })); }
    }, []);

    useEffect(() => { fetchCategorias(); }, [fetchCategorias]);

    const handleSelectCategoria = useCallback(async (categoria) => {
        if (!categoria) return;
        setSelectedCategoria(categoria);
        setLoading(prev => ({ ...prev, productos: true }));
        setError(''); setProductos([]);
        try { const data = await portalService.getProductosPorCategoria(categoria); setProductos(data); } 
        catch (err) { setError('Error al cargar los productos de esta categoría.'); } 
        finally { setLoading(prev => ({ ...prev, productos: false })); }
    }, []);

    const handleOpenDetalle = (productoId) => { setSelectedProductoId(productoId); setDetalleModalOpen(true); };
    const handleSolicitarProducto = async (formData) => {
        try {
            const response = await portalService.solicitarProducto(formData.nombre_producto, formData.descripcion);
            setSnackbar({ open: true, message: response.message });
            setSolicitarModalOpen(false);
        } catch (err) { setSnackbar({ open: true, message: err.response?.data?.message || 'Error al enviar la solicitud.' }); }
    };
    
    return (
        <>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" component="h2" gutterBottom>Paso 1: Elige una Categoría</Typography>
                <Typography color="text.secondary" sx={{mb: 2}}>Selecciona una categoría para ver los productos disponibles.</Typography>
                {loading.categorias ? <CircularProgress size={24} /> : (
                    <Grid container spacing={2}>
                        <Grid item xs>
                             <Button
                                id="category-button"
                                aria-controls={isCategoryMenuOpen ? 'category-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={isCategoryMenuOpen ? 'true' : undefined}
                                variant="outlined"
                                fullWidth
                                onClick={handleCategoryMenuClick}
                                endIcon={<KeyboardArrowDownIcon />}
                                sx={{ height: '56px', justifyContent: 'space-between', textAlign: 'left', color: selectedCategoria ? 'text.primary' : 'text.secondary' }}
                            >
                                {selectedCategoria || 'Selecciona una Categoría'}
                            </Button>
                            <Menu
                                id="category-menu"
                                anchorEl={categoryMenuAnchor}
                                open={isCategoryMenuOpen}
                                onClose={handleCategoryMenuClose}
                                MenuListProps={{ 'aria-labelledby': 'category-button' }}
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                                sx={{ '& .MuiPaper-root': { width: categoryMenuAnchor?.clientWidth } }}
                            >
                                {categorias.map(cat => ( <MenuItem key={cat} onClick={() => handleCategorySelect(cat)}>{cat}</MenuItem> ))}
                            </Menu>
                        </Grid>
                        <Grid item xs="auto">
                            <Box sx={{display: 'flex', alignItems: 'center', height: '100%'}}>
                                <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} onClick={() => setSolicitarModalOpen(true)} sx={{ height: '56px' }}>
                                    Solicitar Producto
                                </Button>
                                <IconButton onClick={handleInfoClick} aria-label="información sobre solicitar producto">
                                    <InfoOutlinedIcon />
                                </IconButton>
                                <Popover open={openInfo} anchorEl={infoAnchorEl} onClose={handleInfoClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} transformOrigin={{ vertical: 'top', 'center': 'center' }}>
                                    <Typography sx={{ p: 2, maxWidth: 250 }}>¿No encuentras un producto? Haz clic en 'Solicitar' para pedir que lo agreguemos al catálogo.</Typography>
                                </Popover>
                            </Box>
                        </Grid>
                    </Grid>
                )}
            </Paper>

            {selectedCategoria && (
                 <Paper sx={{ p: 3, minHeight: '300px' }}>
                    <Typography variant="h5" component="h2" gutterBottom>Paso 2: Selecciona tus Productos</Typography>
                    <Typography color="text.secondary" sx={{mb: 2}}>Haz clic en un producto para ver sus detalles y añadirlo a tu pedido. El rango de precio puede ser por variaciones en el producto o descuentos por cantidad comprada.</Typography>
                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {loading.productos ? <Box sx={{display: 'flex', justifyContent: 'center', my: 4}}><CircularProgress /></Box> : (
                        <Grid container spacing={3} justifyContent="center">
                            {productos.length > 0 ? productos.map(producto => (
                                <Grid item xs={12} sm={6} md={4} key={producto.id}>
                                    <ProductoCard producto={producto} onClick={() => handleOpenDetalle(producto.id)} />
                                </Grid>
                            )) : <Grid item xs={12}><Typography sx={{textAlign: 'center', mt: 4, fontStyle: 'italic'}}>No hay productos disponibles en esta categoría.</Typography></Grid>}
                        </Grid>
                    )}
                </Paper>
            )}

            {isDetalleModalOpen && <DetalleProductoModal open={isDetalleModalOpen} onClose={() => setDetalleModalOpen(false)} productoId={selectedProductoId} onAddToCart={onAddToCart} />}
            <SolicitarProductoModal open={isSolicitarModalOpen} onClose={() => setSolicitarModalOpen(false)} onSave={handleSolicitarProducto} />
        </>
    );
};

export default CrearPedidoView;