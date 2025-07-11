// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';

// --- IMPORTACIONES NECESARIAS PARA EL SELECTOR DE FECHA ---
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import es from 'date-fns/locale/es'; // Importar el locale en español

// --- TEMA PERSONALIZADO DE LA APLICACIÓN ---
let theme = createTheme({
  palette: {
    primary: {
      main: '#8D5B4C', // Un tono café robusto y amigable
      light: '#F5EDE8', // Un beige muy claro y cálido para fondos de sección
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E4A788', // Un durazno claro para acentos suaves
    },
    background: {
      default: '#FDFCF7', // Un fondo crema muy claro, casi blanco
      paper: '#FFFFFF',
    },
    text: {
      primary: '#4A2E2A', // Un color marrón oscuro para textos principales
      secondary: '#7D6D61', // Un marrón más suave para textos secundarios
    },
    action: {
      active: '#8D5B4C'
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

// --- AJUSTES DE TIPOGRAFÍA RESPONSIVA ---
theme.typography.h2 = {
  fontWeight: 'bold',
  fontSize: '2.2rem', // Tamaño para celular (xs)
  [theme.breakpoints.up('sm')]: {
    fontSize: '3rem', // Tamaño para tablet (sm)
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '3.5rem', // Tamaño para desktop (md)
  },
};
theme.typography.h3 = {
  fontWeight: 'bold',
  fontSize: '1.8rem', // xs
  [theme.breakpoints.up('sm')]: {
    fontSize: '2.2rem', // sm
  },
  [theme.breakpoints.up('md')]: {
    fontSize: '2.5rem', // md
  },
};
theme.typography.h5 = {
  fontSize: '1.1rem', // xs
  [theme.breakpoints.up('sm')]: {
    fontSize: '1.25rem', // sm
  },
};
theme.typography.h6 = {
    fontSize: '1rem', // xs
    [theme.breakpoints.up('sm')]: {
      fontSize: '1.1rem', // sm
    },
};


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
            {/* El ThemeProvider ahora usa nuestro tema personalizado */}
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <App />
            </ThemeProvider>
          </LocalizationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);