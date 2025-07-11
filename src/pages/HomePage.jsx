import { Link as RouterLink } from "react-router-dom";
import { Box, Button, Container, Grid, Paper, Typography, Chip } from "@mui/material";
import WebhookIcon from '@mui/icons-material/Webhook';
import PaymentIcon from "@mui/icons-material/Payment";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SpeedIcon from '@mui/icons-material/Speed';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import HandshakeIcon from '@mui/icons-material/Handshake';
import AnalyticsIcon from "@mui/icons-material/Analytics";
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';

const FeatureCard = ({ icon, title, description }) => (
  <Paper
    className="hover-lift"
    variant="outlined"
    sx={{
      p: 4,
      textAlign: "center",
      height: "100%",
      borderColor: "grey.200",
      borderRadius: 3,
      bgcolor: "background.paper",
    }}
  >
    <Box color="primary.main" sx={{ mb: 2 }}>{icon}</Box>
    <Typography variant="h6" component="h3" gutterBottom fontWeight="bold" color="text.primary">{title}</Typography>
    <Typography variant="body2" color="text.secondary">{description}</Typography>
  </Paper>
);

const HomePage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ textAlign: "center", py: { xs: 8, md: 12 } }}>
        <Chip label="☕ Para Cafeterías de Santiago ☕" sx={{ mb: 3, fontSize: "1rem", py: 2, bgcolor: 'secondary.main', color: 'text.primary', fontWeight: 'bold' }} />
        <Typography variant="h2" component="h1" gutterBottom color="text.primary">
          La plataforma de abastecimiento que tu cafetería necesita
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ my: 4, mx: "auto", maxWidth: "750px", lineHeight: 1.6 }}>
          Centraliza tus proveedores, optimiza tus compras y dedica más tiempo a lo que importa: tu café y tus clientes.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "center",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: 'center',
            mt: 4,
          }}
        >
          <Button
            component={RouterLink}
            to="/registro"
            variant="contained"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem", width: { xs: '80%', sm: 'auto' }, maxWidth: '300px' }}
          >
            Comenzar Ahora
          </Button>
          <Button
            component={RouterLink}
            to="/contacto"
            variant="outlined"
            size="large"
            sx={{ px: 4, py: 1.5, fontSize: "1.1rem", width: { xs: '80%', sm: 'auto' }, maxWidth: '300px' }}
          >
            Solicitar Demo
          </Button>
        </Box>
      </Container>
      
      <hr className="section-divider" />

      {/* Solution Features */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography variant="h3" component="h2" textAlign="center" gutterBottom color="text.primary">
          Una plataforma, todas tus soluciones
        </Typography>
        <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8, maxWidth: "750px", mx: "auto" }}>
          Diseñamos una solución ágil y polivalente para optimizar la compra de insumos en tu cafetería.
        </Typography>
        <Grid container spacing={4} alignItems="stretch" justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<WebhookIcon sx={{ fontSize: 40 }} />}
              title="Pedidos Integrados"
              description="Haz tus pedidos desde nuestra plataforma web o directamente por WhatsApp. Un sistema polivalente que se adapta a tu ritmo de trabajo."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<PaymentIcon sx={{ fontSize: 40 }} />}
              title="Pago Unificado"
              description="Compra a todos tus proveedores y paga todo en una sola transacción. Nosotros nos encargamos de distribuir los fondos."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<VerifiedUserIcon sx={{ fontSize: 40 }} />}
              title="Proveedores Verificados"
              description="Accede a un catálogo curado de proveedores de café, leche, pastelería y más, calificados por otras cafeterías de Santiago."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<TrendingUpIcon sx={{ fontSize: 40 }} />}
              title="Mejores Precios"
              description="Unificamos la demanda de varias cafeterías para negociar y obtener mejores precios por volumen en tus insumos clave."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<AnalyticsIcon sx={{ fontSize: 40 }} />}
              title="Dashboard de Control"
              description="Visualiza tu historial de compras, controla gastos y accede a estadísticas para optimizar la rentabilidad de tu local."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FeatureCard
              icon={<AssuredWorkloadIcon sx={{ fontSize: 40 }} />}
              title="Trazabilidad y Soporte"
              description="Obtén seguimiento de tus pedidos con notificaciones y un soporte que entiende las urgencias de una cafetería."
            />
          </Grid>
        </Grid>
      </Container>
      
      <hr className="section-divider" />

      {/* Why Us Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
           <Typography variant="h3" component="h2" textAlign="center" gutterBottom color="text.primary">
                ¿Por qué nuestra plataforma?
            </Typography>
            <Typography variant="h6" textAlign="center" color="text.secondary" sx={{ mb: 8, maxWidth: "750px", mx: "auto" }}>
                Nuestra propuesta se basa en tres pilares diseñados para dueños de cafeterías que buscan eficiencia y crecimiento.
            </Typography>
            <Grid container spacing={6} alignItems="flex-start" justifyContent="center">
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center', maxWidth: 320 }}>
                        <SpeedIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" fontWeight="bold">Pilar de Ahorro</Typography>
                        <Typography color="text.secondary">Ahorra tiempo valioso en gestión y reduce costos en insumos clave gracias a nuestro poder de compra por volumen.</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center', maxWidth: 320 }}>
                        <RuleFolderIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" fontWeight="bold">Pilar de Control</Typography>
                        <Typography color="text.secondary">Centraliza pedidos y pagos en un solo lugar. Ten una visión clara y ordenada de los gastos de tu cafetería para decidir mejor.</Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} md={4} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Box sx={{ textAlign: 'center', maxWidth: 320 }}>
                        <HandshakeIcon sx={{ fontSize: 50, color: 'primary.main', mb: 2 }} />
                        <Typography variant="h6" fontWeight="bold">Pilar de Confianza</Typography>
                        <Typography color="text.secondary">Trabaja con proveedores verificados y calificados por la comunidad de cafeterías, con soporte y trazabilidad garantizada.</Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
        
      <hr className="section-divider" />

      {/* CTA Section */}
      <Box sx={{ bgcolor: "primary.light", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h3" component="h2" gutterBottom color="text.primary">
            ¿Listo para optimizar tu cafetería?
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ my: 3, mx: "auto", maxWidth: "90%" }}>
            El registro es rápido y el plan básico es gratuito. Únete a la red de cafeterías que están transformando su abastecimiento en Santiago.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: 'center',
              mt: 4,
            }}
          >
            <Button
              component={RouterLink}
              to="/registro"
              variant="contained"
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: "1.1rem", width: { xs: '80%', sm: 'auto' }, maxWidth: '300px' }}
            >
              Comenzar Ahora - Es Gratis
            </Button>
            <Button
              component={RouterLink}
              to="/contacto"
              variant="outlined"
              size="large"
              sx={{ px: 4, py: 1.5, fontSize: "1.1rem", width: { xs: '80%', sm: 'auto' }, maxWidth: '300px' }}
            >
              Hablar con un Experto
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage;