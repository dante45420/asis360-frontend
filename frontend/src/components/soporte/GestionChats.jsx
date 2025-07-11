// src/components/soporte/GestionChats.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
    Box, Paper, List, ListItem, ListItemButton, ListItemText, CircularProgress, 
    TextField, Button, Divider, Typography, Dialog, DialogTitle, DialogContent, 
    DialogActions, FormControl, InputLabel, Select, MenuItem 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import adminService from '../../services/adminService';

// --- Sub-componente: Modal para resolver un chat ---
const ResolutionModal = ({ open, onClose, onSave, itemType }) => {
    const [formData, setFormData] = useState({
        estado_resolucion: 'exitoso',
        causa_problema: '',
        notas: ''
    });

    useEffect(() => {
        if (open) {
            setFormData({
                estado_resolucion: 'exitoso',
                causa_problema: '',
                notas: ''
            });
        }
    }, [open]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        if (!formData.causa_problema) {
            alert('Por favor, completa la causa del problema.');
            return;
        }
        onSave(formData);
    };
    
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Resolver {itemType === 'chat' ? 'Conversación' : 'Ticket'}</DialogTitle>
            <DialogContent>
                <FormControl fullWidth margin="normal">
                    <InputLabel>Estado de Resolución</InputLabel>
                    <Select name="estado_resolucion" value={formData.estado_resolucion} onChange={handleChange} label="Estado de Resolución">
                        <MenuItem value="exitoso">Exitoso</MenuItem>
                        <MenuItem value="no_exitoso">No Exitoso</MenuItem>
                    </Select>
                </FormControl>
                <TextField name="causa_problema" label="Causa de la Resolución" value={formData.causa_problema} onChange={handleChange} fullWidth margin="normal" helperText={"Ej: Duda sobre producto resuelta."} />
                <TextField name="notas" label="Notas Adicionales" value={formData.notas} onChange={handleChange} fullWidth margin="normal" multiline rows={4} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancelar</Button>
                <Button onClick={handleSave} variant="contained">Guardar Resolución</Button>
            </DialogActions>
        </Dialog>
    );
};

// --- Sub-componente: Lista de Conversaciones ---
const ListaConversaciones = ({ chats, onSelectChat, onTakeChat, selectedChatId }) => (
    <Paper sx={{ height: 'calc(100vh - 220px)', overflowY: 'auto' }}>
        <List disablePadding>
            {chats.map(chat => (
                <ListItem
                    key={chat.conversacion_id}
                    disablePadding
                    sx={{ borderBottom: '1px solid #eee' }}
                    secondaryAction={
                        chat.estado_soporte === 'pendiente' && 
                        <Button size="small" variant="outlined" onClick={() => onTakeChat(chat.conversacion_id)}>Tomar</Button>
                    }
                >
                    <ListItemButton 
                        selected={selectedChatId === chat.conversacion_id}
                        onClick={() => onSelectChat(chat.conversacion_id)}
                    >
                        <ListItemText 
                            primary={chat.cliente_nombre} 
                            secondary={`ID: ${chat.conversacion_id} - ${new Date(chat.fecha_inicio).toLocaleString()}`} 
                        />
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    </Paper>
);

// --- Sub-componente: Ventana de Chat ---
const ChatBox = ({ conversationId, onResolve }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const chatEndRef = useRef(null);

    const fetchMessages = useCallback(async () => {
        if (!conversationId) {
            setMessages([]);
            return;
        }
        setLoading(true);
        try {
            const data = await adminService.getMensajesConversacion(conversationId);
            setMessages(data.reverse());
        } catch (error) {
            console.error("Error fetching messages:", error);
        } finally {
            setLoading(false);
        }
    }, [conversationId]);

    useEffect(() => {
        if (conversationId) {
            fetchMessages();
            const interval = setInterval(fetchMessages, 5000);
            return () => clearInterval(interval);
        }
    }, [conversationId, fetchMessages]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !conversationId) return;
        try {
            await adminService.enviarMensajeAsesor(conversationId, newMessage);
            setNewMessage('');
            fetchMessages();
        } catch(error) {
            console.error("Error sending message:", error);
        }
    };

    if (!conversationId) {
        return (
            <Paper sx={{p: 3, height: 'calc(100vh - 220px)', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Typography variant="h6" color="textSecondary">Selecciona una conversación</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ height: 'calc(100vh - 220px)', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{p: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #ddd', bgcolor: 'grey.50'}}>
                <Typography variant="h6" sx={{ml: 1}}>Conversación #{conversationId}</Typography>
                <Button 
                    variant="contained" 
                    color="success" 
                    size="small"
                    startIcon={<CheckCircleIcon />}
                    onClick={onResolve}
                >
                    Marcar como Resuelto
                </Button>
            </Box>
            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
                {loading && messages.length === 0 ? <CircularProgress sx={{m: 'auto'}} /> : messages.map(msg => {
                    const isUser = msg.remitente === 'usuario';
                    const isAsesor = msg.remitente === 'asesor';
                    const align = isUser ? 'flex-start' : 'flex-end';
                    const bgColor = isUser ? '#e3f2fd' : (isAsesor ? '#c8e6c9' : '#f0f0f0');
                    return (
                        <Box key={msg.mensaje_id} sx={{ mb: 1, display: 'flex', justifyContent: align }}>
                            <Paper elevation={1} sx={{ p: 1.5, maxWidth: '70%', bgcolor: bgColor, wordBreak: 'break-word' }}>
                                <Typography variant="body1">{msg.cuerpo_mensaje}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{display: 'block', textAlign: 'right', mt: 0.5}}>
                                    {isAsesor ? "Asesor" : "Cliente"} - {new Date(msg.fecha_envio).toLocaleTimeString()}
                                </Typography>
                            </Paper>
                        </Box>
                    );
                })}
                <div ref={chatEndRef} />
            </Box>
            <Divider />
            <Box component="form" sx={{ p: 2, display: 'flex', gap: 1 }} onSubmit={handleSend}>
                <TextField fullWidth size="small" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Escribe un mensaje..." />
                <Button type="submit" variant="contained">Enviar</Button>
            </Box>
        </Paper>
    );
};

// --- Componente Principal: GestionChats ---
const GestionChats = ({setSnackbar}) => {
    const [chats, setChats] = useState([]);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

    const fetchChats = useCallback(async () => {
        setLoading(true);
        try {
            const pending = await adminService.getSoporteChats('pendiente');
            const active = await adminService.getSoporteChats('activa');
            setChats([...pending, ...active].sort((a, b) => new Date(b.fecha_inicio) - new Date(a.fecha_inicio)));
        } catch (err) {
            console.error("Error al cargar los chats:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchChats();
        const interval = setInterval(fetchChats, 15000);
        return () => clearInterval(interval);
    }, [fetchChats]);

    const handleTakeChat = async (id) => {
        try {
            await adminService.asignarChat(id);
            fetchChats();
            setSelectedChatId(id);
        } catch (err) {
            setSnackbar({ open: true, message: err.response?.data?.message || 'Error al tomar el chat' });
        }
    };
    
    const handleOpenResolveModal = () => {
        if (!selectedChatId) {
            setSnackbar({ open: true, message: 'Primero selecciona un chat para resolver.' });
            return;
        }
        setIsResolveModalOpen(true);
    };

    const handleSaveResolution = async (resolutionData) => {
        try {
            const response = await adminService.resolverConversacion(selectedChatId, resolutionData);
            setSnackbar({ open: true, message: response.message });
            setIsResolveModalOpen(false);
            fetchChats();
            setSelectedChatId(null);
        } catch (error) {
            console.error("Error al guardar la resolución del chat:", error);
            setSnackbar({ open: true, message: error.response?.data?.message || "Error al guardar la resolución." });
        }
    };

    return (
        <>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                <Box sx={{ width: '350px', flexShrink: 0 }}>
                    <ListaConversaciones 
                        chats={chats} 
                        onSelectChat={setSelectedChatId} 
                        onTakeChat={handleTakeChat} 
                        selectedChatId={selectedChatId} 
                    />
                </Box>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <ChatBox 
                        conversationId={selectedChatId} 
                        onResolve={handleOpenResolveModal} 
                    />
                </Box>
            </Box>
            <ResolutionModal 
                open={isResolveModalOpen} 
                onClose={() => setIsResolveModalOpen(false)} 
                onSave={handleSaveResolution} 
                itemType="chat" 
            />
        </>
    );
};

export default GestionChats;