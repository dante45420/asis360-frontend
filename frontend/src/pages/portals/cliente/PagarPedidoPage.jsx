// src/pages/portals/cliente/PagarPedidoPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, Typography, Paper, Button, CircularProgress, Alert, Snackbar, 
    List, ListItem, ListItemText, ListItemIcon, Divider, Grid 
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PersonIcon from '@mui/icons-material/Person';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import EmailIcon from '@mui/icons-material/Email';
import portalService from '../../../services/portalService';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const PagarPedidoPage = () => {
    const { pedidoId } = useParams();
    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '' });
    const [paymentData, setPaymentData] = useState(null);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchPaymentData = async () => {
            try {
                const data = await portalService.getDatosPago();
                setPaymentData(data);
            } catch (err) {
                setError('No se pudieron cargar los datos de pago. Contacta a soporte.');
            } finally {
                setLoadingData(false);
            }
        };
        fetchPaymentData();
    }, []);

    const handleFileChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            if (file.size > 5 * 1024 * 1024) { // Límite de 5MB
                setError("El archivo es muy grande. El límite es de 5MB.");
                return;
            }
            setSelectedFile(file);
            setError('');
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            setError("Por favor, selecciona un archivo de comprobante.");
            return;
        }
        setLoading(true);
        setError('');
        try {
            const response = await portalService.subirComprobante(pedidoId, selectedFile);
            setSnackbar({ open: true, message: response.message });
            setTimeout(() => navigate('/portal/cliente/pedidos'), 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error al subir el archivo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
                Volver al Historial
            </Button>
            <Typography variant="h4" gutterBottom>Finalizar Pago del Pedido #{pedidoId}</Typography>

            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>1. Realiza la Transferencia</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Transfiere el monto total de tu pedido a la siguiente cuenta y guarda el comprobante.
                        </Typography>
                        {loadingData ? <CircularProgress /> : paymentData ? (
                            <List>
                                <ListItem><ListItemIcon><AccountBalanceIcon /></ListItemIcon><ListItemText primary={paymentData.banco} secondary="Banco" /></ListItem><Divider />
                                <ListItem><ListItemIcon><PersonIcon /></ListItemIcon><ListItemText primary={paymentData.titular} secondary="Nombre del Titular" /></ListItem><Divider />
                                <ListItem><ListItemIcon><FingerprintIcon /></ListItemIcon><ListItemText primary={paymentData.rut} secondary="RUT del Titular" /></ListItem><Divider />
                                <ListItem><ListItemIcon><CreditCardIcon /></ListItemIcon><ListItemText primary={paymentData.numero_cuenta} secondary="Número de Cuenta" /></ListItem><Divider />
                                <ListItem><ListItemIcon><EmailIcon /></ListItemIcon><ListItemText primary={paymentData.email} secondary="Email para notificar" /></ListItem>
                            </List>
                        ) : <Alert severity="warning">No hay datos de pago disponibles.</Alert>}
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" gutterBottom>2. Sube tu Comprobante</Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Una vez realizada la transferencia, sube una imagen de tu comprobante aquí para que validemos tu pago.
                        </Typography>
                        <Box sx={{ textAlign: 'center', my: 2, p: 4, border: '2px dashed', borderColor: 'grey.400', borderRadius: 2, bgcolor: 'grey.50' }}>
                            <Button
                                component="label"
                                variant="contained"
                                startIcon={<CloudUploadIcon />}
                                size="large"
                            >
                                Seleccionar Archivo
                                <VisuallyHiddenInput type="file" accept="image/png, image/jpeg, image/gif, application/pdf" onChange={handleFileChange} />
                            </Button>
                            {selectedFile && (
                                <Typography variant="body2" sx={{ mt: 2, fontWeight: 'bold' }}>
                                    {selectedFile.name}
                                </Typography>
                            )}
                        </Box>
                        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                        <Button 
                            fullWidth 
                            variant="contained" 
                            color="success" 
                            size="large"
                            onClick={handleUpload} 
                            disabled={!selectedFile || loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Confirmar y Subir Pago"}
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ open: false, message: '' })} message={snackbar.message} />
        </Box>
    );
};

export default PagarPedidoPage;