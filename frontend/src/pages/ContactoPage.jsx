import { Link as RouterLink } from "react-router-dom"
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import PhoneIcon from "@mui/icons-material/Phone"
import EmailIcon from "@mui/icons-material/Email"
import LocationOnIcon from "@mui/icons-material/LocationOn"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import SupportAgentIcon from "@mui/icons-material/SupportAgent"
import ScheduleIcon from "@mui/icons-material/Schedule"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const ContactCard = ({ icon, title, subtitle, action }) => (
  <Card elevation={0} sx={{ height: "100%", border: '1px solid', borderColor: 'grey.200', borderRadius: 3 }}>
    <CardContent sx={{ p: 3, textAlign: "center", display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
      <Box color="primary.main" sx={{ mb: 2 }}>
        {icon}
      </Box>
      <Typography variant="h6" fontWeight="bold" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
        {subtitle}
      </Typography>
      {action}
    </CardContent>
  </Card>
)

const FAQItem = ({ question, answer }) => (
  <Accordion defaultExpanded={false}>
    <AccordionSummary
      expandIcon={<ExpandMoreIcon />}
      aria-controls="panel1a-content"
      id="panel1a-header"
    >
      <Typography variant="h6" fontWeight="bold" color="primary.main">{question}</Typography>
    </AccordionSummary>
    <AccordionDetails>
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'justify' }}>
        {answer}
      </Typography>
    </AccordionDetails>
  </Accordion>
);

const ContactoPage = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{ bgcolor: "background.default", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg" sx={{ textAlign: "center" }}>
          <Chip
            label="📞 HABLEMOS"
            sx={{ mb: 3, bgcolor: 'secondary.main', color: 'text.primary', fontWeight: 'bold' }}
          />
          <Typography variant="h2" component="h1" fontWeight="bold" gutterBottom>
            Estamos para ayudarte
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ my: 4, mx: "auto", maxWidth: "70%" }}>
            ¿Tienes una cafetería o eres un proveedor? Contáctanos para descubrir cómo podemos optimizar tu negocio.
          </Typography>
        </Container>
      </Box>

      <hr className="section-divider" />

      {/* Contact Methods */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            Nuestros Canales de Contacto
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Elige la opción que más te convenga
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={4}>
            <ContactCard
              icon={<WhatsAppIcon sx={{ fontSize: 40 }} />}
              title="WhatsApp"
              subtitle="Ideal para consultas rápidas y soporte directo."
              action={
                <Button variant="contained" href="https://wa.me/56912345678" target="_blank" fullWidth>
                  +56 9 1234 5678
                </Button>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ContactCard
              icon={<EmailIcon sx={{ fontSize: 40 }} />}
              title="Email"
              subtitle="Perfecto para consultas detalladas y propuestas comerciales."
              action={
                <Button variant="contained" href="mailto:contacto@plataforma.cl" fullWidth>
                  contacto@plataforma.cl
                </Button>
              }
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <ContactCard
              icon={<PhoneIcon sx={{ fontSize: 40 }} />}
              title="Teléfono"
              subtitle="Para conversar directamente con nuestro equipo de alianzas."
              action={
                <Button variant="outlined" fullWidth>
                  +56 2 1234 5678
                </Button>
              }
            />
          </Grid>
        </Grid>
      </Container>

      {/* Contact Info & Schedule */}
      <Box sx={{ bgcolor: "primary.light", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} md={5}>
              <Paper elevation={0} sx={{ p: 4, height: "100%", borderRadius: 3 }}>
                <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                  <ScheduleIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Horarios de Atención
                </Typography>
                <List>
                  <ListItem disablePadding>
                    <ListItemText primary="Lunes a Viernes" secondary="9:00 - 18:00 hrs" />
                  </ListItem>
                  <ListItem disablePadding>
                    <ListItemText primary="Soporte WhatsApp" secondary="Respuesta prioritaria en horario hábil" />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText primary="Santiago, Chile" secondary="Operamos en toda la Región Metropolitana" />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
              <Paper elevation={2} sx={{ p: 4, bgcolor: "primary.main", color: "white", height: "100%", borderRadius: 3 }}>
                <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                  <SupportAgentIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                  Próximos Pasos
                </Typography>
                <Typography variant="body1" sx={{ mb: 2, color: "white" }}>
                  Así comenzamos a trabajar juntos:
                </Typography>
                <List sx={{ color: "white" }}>
                  <ListItem>
                    <ListItemText 
                      primary="1. Conversación Inicial" 
                      secondary="Conocemos tu negocio y tus necesidades."
                      secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.9)' } }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="2. Demo Personalizada" 
                      secondary="Te mostramos cómo la plataforma te ayuda."
                      secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.9)' } }}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemText 
                      primary="3. Onboarding y Pedido Cero" 
                      secondary="Te acompañamos en tu primer pedido exitoso."
                      secondaryTypographyProps={{ sx: { color: 'rgba(255, 255, 255, 0.9)' } }}
                    />
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box textAlign="center" sx={{ mb: 8 }}>
          <Typography variant="h3" component="h2" fontWeight="bold" gutterBottom>
            <HelpOutlineIcon sx={{ mr: 1, verticalAlign: "middle" }} />
            Preguntas Frecuentes
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Respuestas a las consultas más comunes
          </Typography>
        </Box>

        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} md={10} lg={8}>
            <FAQItem
              question="¿Qué tipo de insumos puedo comprar?"
              answer="Nos especializamos en todo lo que una cafetería de especialidad necesita: desde granos de café de origen y tostadores locales, hasta leches, alternativas vegetales, pastelería artesanal, y más. Nuestro catálogo está en constante expansión con los mejores proveedores de Santiago."
            />
            <FAQItem
              question="¿Tiene algún costo para mi cafetería?"
              answer="Ofrecemos un plan básico completamente gratuito que te permite explorar proveedores y realizar pedidos. También contaremos con planes avanzados con funcionalidades extra como reportes de gastos y gestión de múltiples sucursales."
            />
            <FAQItem
              question="¿Cómo funciona el proceso de pago?"
              answer="Simplificamos tu contabilidad. Haces pedidos a múltiples proveedores durante la semana o el mes, y al final del ciclo, realizas un único pago a nuestra plataforma. Nosotros nos encargamos de distribuir los fondos a cada proveedor."
            />
            <FAQItem
              question="Soy proveedor, ¿cómo puedo unirme?"
              answer="¡Nos encantaría conocerte! Buscamos socios que compartan nuestra pasión por la calidad. El proceso inicia con una conversación. Por favor, visita nuestra página de 'Proveedores' o escríbenos directamente para comenzar."
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default ContactoPage