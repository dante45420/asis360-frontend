// src/components/Footer.jsx
import React from 'react';
import { Box, Container, Typography, Link, IconButton, Stack } from '@mui/material';
import InstagramIcon from '@mui/icons-material/Instagram';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import { siteConfig } from '../config/siteConfig';

function Footer() {
    const currentYear = new Date().getFullYear();
    return (
        <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800] }}>
            {/* El Box exterior es full-width (para el color de fondo) */}
            {/* El Container interior limita el contenido */}
            <Container maxWidth="lg">
                <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" spacing={2}>
                    <Typography variant="body2" color="text.secondary">© {currentYear} {siteConfig.companyName}. Todos los derechos reservados.</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Contacto: <Link href={`mailto:${siteConfig.contactEmail}`} color="inherit">{siteConfig.contactEmail}</Link>
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <IconButton component={Link} href={siteConfig.socialLinks.whatsapp} target="_blank" aria-label="whatsapp"><WhatsAppIcon /></IconButton>
                        <IconButton component={Link} href={siteConfig.socialLinks.instagram} target="_blank" aria-label="instagram"><InstagramIcon /></IconButton>
                        <IconButton component={Link} href={siteConfig.socialLinks.tiktok} target="_blank" aria-label="tiktok"><MusicNoteIcon /></IconButton>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}

export default Footer;