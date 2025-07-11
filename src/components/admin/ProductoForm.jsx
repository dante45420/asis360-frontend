// src/components/admin/ProductoForm.jsx
import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, InputLabel, FormControl, Alert } from '@mui/material';
import adminService from '../../services/adminService';

const ProductoForm = ({ open, onClose, onSave, producto }) => {
    const [formData, setFormData] = useState({
        nombre_producto: '',
        sku: '',
        proveedor_id: '',
        categoria: '',
        descripcion: '', // <-- NUEVO CAMPO AÑADIDO AL ESTADO
    });
    const [proveedores, setProveedores] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        if (open) {
            const fetchProveedores = async () => {
                try {
                    setError('');
                    const data = await adminService.getProveedores();
                    setProveedores(data);
                } catch (err) {
                    setError('No se pudieron cargar los proveedores.');
                }
            };
            fetchProveedores();
        }

        // Se actualiza la lógica para incluir el campo 'descripcion'
        if (producto) {
            setFormData({
                nombre_producto: producto.nombre_producto || '',
                sku: producto.sku || '',
                proveedor_id: producto.proveedor_id || '',
                categoria: producto.categoria || '',
                descripcion: producto.descripcion || '', // <-- Se carga la descripción si el producto ya existe
            });
        } else {
            // Se resetea el formulario incluyendo la descripción
            setFormData({ nombre_producto: '', sku: '', proveedor_id: '', categoria: '', descripcion: '' });
        }
    }, [producto, open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!formData.nombre_producto || !formData.proveedor_id) {
            setError('El nombre del producto y el proveedor son obligatorios.');
            return;
        }
        setError('');
        onSave(formData);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>{producto ? 'Editar Producto' : 'Añadir Nuevo Producto'}</DialogTitle>
            <DialogContent>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <TextField autoFocus margin="dense" name="nombre_producto" label="Nombre del Producto" type="text" fullWidth variant="standard" value={formData.nombre_producto} onChange={handleChange} />
                
                {/* --- NUEVO CAMPO DE TEXTO PARA LA DESCRIPCIÓN --- */}
                <TextField 
                    margin="dense" 
                    name="descripcion" 
                    label="Descripción del Producto" 
                    type="text" 
                    fullWidth 
                    multiline 
                    rows={4} 
                    variant="standard" 
                    value={formData.descripcion} 
                    onChange={handleChange} 
                />
                
                <TextField margin="dense" name="sku" label="SKU" type="text" fullWidth variant="standard" value={formData.sku} onChange={handleChange} />
                <TextField margin="dense" name="categoria" label="Categoría" type="text" fullWidth variant="standard" value={formData.categoria} onChange={handleChange} />
                <FormControl fullWidth margin="dense" variant="standard">
                    <InputLabel id="proveedor-select-label">Proveedor</InputLabel>
                    <Select
                        labelId="proveedor-select-label"
                        id="proveedor_id"
                        name="proveedor_id"
                        value={formData.proveedor_id}
                        onChange={handleChange}
                        label="Proveedor"
                    >
                        <MenuItem value="">
                            <em>Seleccione un proveedor</em>
                        </MenuItem>
                        {proveedores.map((p) => (
                            <MenuItem key={p.proveedor_id} value={p.proveedor_id}>
                                {p.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Guardar</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ProductoForm;