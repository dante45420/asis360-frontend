// src/components/Navbar.jsx
import React, { useState } from 'react';
import { AppBar, Box, Toolbar, IconButton, Typography, Button, Drawer, List, ListItem, ListItemButton, ListItemText, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = user
        ? [ 
            // Rol Admin
            { text: 'Dashboard', path: '/admin/dashboard', roles: ['admin'] },
            { text: 'Pedidos', path: '/admin/pedidos', roles: ['admin'] },
            { text: 'Catálogo', path: '/admin/catalogo', roles: ['admin'] },
            { text: 'Agenda', path: '/admin/agenda', roles: ['admin'] },
            { text: 'Soporte', path: '/admin/soporte', roles: ['admin'] },
            // --- NUEVO ENLACE AÑADIDO ---
            { text: 'Herramientas', path: '/admin/herramientas', roles: ['admin'] },
            
            // Rol Cliente
            { text: 'Panel', path: '/portal/cliente/panel', roles: ['cliente'] },
            { text: 'Mis Pedidos', path: '/portal/cliente/pedidos', roles: ['cliente'] },
            { text: 'Mi Soporte', path: '/portal/cliente/soporte', roles: ['cliente'] },

            // Rol Proveedor
            { text: 'Pedidos', path: '/portal/proveedor/pedidos', roles: ['proveedor'] },
            { text: 'Información', path: '/portal/proveedor/informacion', roles: ['proveedor'] },
            { text: 'Contacto', path: '/portal/proveedor/contacto', roles: ['proveedor'] },
            { text: 'Estadísticas', path: '/portal/proveedor/estadisticas', roles: ['proveedor'] },
          ]
        : [ 
            { text: 'Proveedores', path: '/proveedores' },
            { text: 'Contacto', path: '/contacto' },
            { text: 'Login', path: '/login' }
          ];
      
    const accessibleNavItems = user ? navItems.filter(item => item.roles.includes(user.rol)) : navItems;

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                Menú
            </Typography>
            <List>
                {accessibleNavItems.map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={RouterLink} to={item.path} sx={{ textAlign: 'center' }}>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
                {user && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={handleLogout} sx={{ textAlign: 'center' }}>
                            <ListItemText primary="Cerrar Sesión" />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Box>
    );

    return (
        <AppBar component="nav" position="static">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                        Asistente de Compras
                    </Typography>
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                        <Button component={RouterLink} to="/" sx={{ color: '#fff' }} startIcon={<HomeIcon />}>
                            Inicio
                        </Button>
                        {accessibleNavItems.map((item) => (
                            <Button key={item.text} component={RouterLink} to={item.path} sx={{ color: '#fff' }}>
                                {item.text}
                            </Button>
                        ))}
                        {user && (
                            <Button onClick={handleLogout} sx={{ color: '#fff' }}>
                                Cerrar Sesión
                            </Button>
                        )}
                    </Box>
                    <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ ml: 2, display: { sm: 'none' } }} >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </Container>
            <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 } }}>
                {drawer}
            </Drawer>
        </AppBar>
    );
};

export default Navbar;