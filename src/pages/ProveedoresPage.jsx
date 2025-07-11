import { Link as RouterLink } from "react-router-dom"
import { Box, Button, Container, Grid, Paper, Typography, Chip, Card, CardContent } from "@mui/material"
import HandshakeIcon from '@mui/icons-material/Handshake';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import InsightsIcon from '@mui/icons-material/Insights';
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser"
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import SyncProblemIcon from '@mui/icons-material/SyncProblem';
import TaskAltIcon from '@mui/icons-material/TaskAlt';

// Tarjeta de beneficios (con texto de descripción justificado)
const BenefitCard = ({ icon, title, description }) => (
  <Card elevation={0} sx={{ height: "100%", border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
    <CardContent sx={{ p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', height: '100%' }}>
      <Box color="primary.main" sx={{ mb: 2 }}>{icon}</Box>
      <Box>
        <Typography variant="h6" component="h3" gutterBottom fontWeight="bold">{title}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'justify' }}>{description}</Typography>
      </Box>
    </CardContent>
  </Card>
)

// Tarjeta de pasos (con texto de descripción justificado)
const StepCard = ({ step, title, description }) => (
  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 3, mb: 3, maxWidth: 450 }}>
    <Chip label={step} size="large" sx={{ bgcolor: "primary.main", color: "white", fontWeight: "bold", fontSize: '1rem' }}/>
    <Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'justify' }}>{description}</Typography>
    </Box>
  </Box>
)

const ProveedoresPage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: "background.default", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Chip label="Alianzas Estratégicas" sx={{ mb: 3, bgcolor: 'secondary.main', color: 'text.primary', fontWeight: 'bold' }}/>
          <Typography variant="h2" component="h1" gutterBottom color="text.primary">
            Alíate con la nueva red de abastecimiento para cafeterías
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ my: 4, mx: "auto", maxWidth: "800px", textAlign: 'justify' }}>
            Centraliza los pedidos de varias cafeterías a la vez, mejora la comunicación con tus clientes y simplifica tu operación comercial.
          </Typography>
          <Button component={RouterLink} to="/contacto" variant="contained" size="large" sx={{ px: 5, py: 1.5, fontSize: "1.1rem" }}>
            Contáctanos
          </Button>
        </Container>
      </Box>

      <hr className="section-divider" />

      {/* Benefits Grid */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" gutterBottom>¿Por qué trabajar con nosotros?</Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '750px', mx: 'auto' }}>
            Somos el socio estratégico que optimiza tu canal de venta a cafeterías.
          </Typography>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={5}>
            <BenefitCard
              icon={<ReceiptLongIcon sx={{ fontSize: 40 }}/>}
              title="Logística Simplificada"
              description="Recibe una única Orden de Compra consolidada en lugar de gestionar múltiples pedidos pequeños. Menos administración, más eficiencia."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <BenefitCard
              icon={<AssuredWorkloadIcon sx={{ fontSize: 40 }}/>}
              title="Cobranza Garantizada y Puntual"
              description="Olvídate de perseguir pagos. Nosotros gestionamos la cobranza y te aseguramos un pago puntual y centralizado."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <BenefitCard
              icon={<HandshakeIcon sx={{ fontSize: 40 }}/>}
              title="Una Relación Estratégica"
              description="Más que una plataforma, somos un socio. Nos dedicamos a entender tu negocio para crear una relación comercial beneficiosa y a largo plazo."
            />
          </Grid>
          <Grid item xs={12} sm={6} md={5}>
            <BenefitCard
              icon={<InsightsIcon sx={{ fontSize: 40 }}/>}
              title="Inteligencia de Mercado"
              description="Accede a datos sobre los productos más demandados y las tendencias del sector de cafeterías para tomar mejores decisiones de inventario."
            />
          </Grid>
        </Grid>
      </Container>
      
      {/* How we simplify */}
       <Box sx={{ bgcolor: 'primary.light', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
            <Box textAlign="center" sx={{ mb: 8 }}>
                <Typography variant="h3" component="h2" gutterBottom>Simplificamos tu Operación</Typography>
                <Typography variant="h6" color="text.secondary" sx={{ maxWidth: '750px', mx: 'auto' }}>
                    Transformamos un proceso caótico en un flujo de trabajo simple y centralizado.
                </Typography>
            </Box>
            <Grid container spacing={4} alignItems="center" justifyContent="center">
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 4, borderRadius: 4 }}>
                        <Typography variant="h6" fontWeight="bold" color="text.secondary" gutterBottom>El Modelo Tradicional</Typography>
                        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                            {['Múltiples pedidos pequeños', 'Gestión de cobranza individual', 'Comunicación dispersa por WhatsApp', 'Incertidumbre en la demanda'].map(item => (
                                <Box component="li" key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5}}>
                                    <SyncProblemIcon color="error" />
                                    <Typography>{item}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={1} sx={{ textAlign: 'center', display: { xs: 'none', md: 'block' } }}>
                    <ArrowForwardIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                </Grid>
                <Grid item xs={12} md={5}>
                     <Paper elevation={3} sx={{ p: 4, borderRadius: 4, border: '2px solid', borderColor: 'primary.main' }}>
                        <Typography variant="h6" fontWeight="bold" color="primary.main" gutterBottom>Nuestra Solución Centralizada</Typography>
                        <Box component="ul" sx={{ m: 0, p: 0, listStyle: 'none' }}>
                            {['Una Orden de Compra consolidada', 'Un solo punto de pago garantizado', 'Canal de comunicación unificado', 'Previsibilidad de la demanda'].map(item => (
                                <Box component="li" key={item} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5}}>
                                    <TaskAltIcon color="success" />
                                    <Typography>{item}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
      </Box>

      {/* How It Works */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6} alignItems="center" justifyContent="center">
          <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Box sx={{ width: '100%', maxWidth: 500 }}>
                <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: { xs: 'center', md: 'left'}}}>Nuestro Proceso de Alianza</Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4, textAlign: { xs: 'center', md: 'left'} }}>
                    Buscamos construir relaciones basadas en la confianza y el beneficio mutuo.
                </Typography>
                <StepCard step="1" title="Conversación Inicial" description="Nos reunimos para conversar sobre tu propuesta de valor y tus productos. Nos interesa entender cómo podemos crear una alianza beneficiosa para ambos."/>
                <StepCard step="2" title="Acuerdos Comerciales" description="Juntos definimos los términos, precios y condiciones de despacho de forma transparente, sentando las bases de una gran relación comercial."/>
                <StepCard step="3" title="Bienvenida a la Red" description="Presentamos tu catálogo de productos a nuestra exclusiva red de cafeterías, destacando tus fortalezas y tu propuesta de valor."/>
                <StepCard step="4" title="Operación Simplificada" description="Comienzas a recibir Órdenes de Compra consolidadas y pagos puntuales directamente de nosotros. Tu equipo se enfoca en la calidad, no en la burocracia."/>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper elevation={0} sx={{ p: { xs: 3, md: 4 }, bgcolor: "primary.light", borderRadius: 4, border: '1px solid', borderColor: 'grey.200', maxWidth: 500 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom color="text.primary" textAlign="center">Nuestros Socios: Un Círculo de Calidad y Confianza</Typography>
              <Typography variant="body1" sx={{ mb: 3, textAlign: 'justify' }} color="text.secondary">
                Buscamos proveedores que compartan nuestro compromiso con la excelencia y que vean el valor en una red colaborativa.
              </Typography>
              <Box>
                {[
                  { title: "Café de Especialidad y Tostadores de Origen", desc: "Para conectar con un nicho de cafeterías que prioriza la calidad del grano." },
                  { title: "Lácteos y Alternativas Vegetales de Calidad", desc: "Ingredientes clave para el barista, con demanda constante y predecible." },
                  { title: "Pastelería y Panadería Artesanal", desc: "Productos que complementan la oferta de las cafeterías, generando ventas recurrentes." },
                  { title: "Logística Confiable en Santiago", desc: "Asegurando que tu producto llegue en tiempo y forma, un pilar de la confianza de nuestra red." },
                ].map((item) => (
                  <Box key={item.title} sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                    <VerifiedUserIcon sx={{ mr: 1.5, mt: 0.5, color: 'primary.main' }} />
                    <Box>
                        <Typography variant="body1" fontWeight="bold">{item.title}</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'justify' }}>{item.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Final CTA */}
      <Box sx={{ bgcolor: "primary.main", color: "white", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="md" sx={{ textAlign: "center" }}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Iniciemos una conversación
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
            Si tu empresa comparte nuestro foco en la calidad y la eficiencia para el sector de cafeterías, nos encantaría conocerte.
          </Typography>
          <Button
            component={RouterLink}
            to="/contacto"
            variant="contained"
            size="large"
            sx={{
              px: 5, py: 1.5, fontSize: "1.1rem",
              bgcolor: "white", color: "primary.main",
              "&:hover": { bgcolor: "grey.200" },
            }}
          >
            Contactanós
          </Button>
        </Container>
      </Box>
    </Box>
  )
}

export default ProveedoresPage