import { AppBar, Box, createTheme, CssBaseline, ThemeProvider, Toolbar, Typography } from '@mui/material';
import React, { FunctionComponent } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import CryptoDetail from './components/CryptoDetail/CryptoDetail';
import CryptoTable from './components/CryptoTable/CryptoTable';
import Login from './components/Login/Login';
import LogoutButton from './components/Logout/LogoutButtons';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { AuthProvider, useAuth } from './context/AuthContext';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Header component that only shows on protected routes
const AppHeader: FunctionComponent = () => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Don't show header on login page
  if (!isAuthenticated || location.pathname === '/login') {
    return null;
  }

  return (
    <AppBar
      position="sticky"
      sx={{
        background: '#667eea',
        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.2)',
        borderRadius: 2,
        mx: 2,
        mt: 1,
        width: "auto"
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Logo/Icon */}
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              bgcolor: 'rgba(255, 255, 255, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Typography variant="h6" fontWeight="700" sx={{ color: 'white' }}>
              C
            </Typography>
          </Box>

          {/* App Title */}
          <Typography
            variant="h6"
            component="h1"
            fontWeight="700"
            sx={{
              color: 'white',
              display: { xs: 'none', sm: 'block' }
            }}
          >
            CoinGecko Dashboard
          </Typography>

          {/* Mobile Title */}
          <Typography
            variant="h6"
            component="h1"
            fontWeight="700"
            sx={{
              color: 'white',
              display: { xs: 'block', sm: 'none' }
            }}
          >
            CoinGecko
          </Typography>
        </Box>

        {/* Navigation info and logout */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Current page indicator */}
          <Typography
            variant="body2"
            sx={{
              color: 'rgba(255, 255, 255, 0.8)',
              display: { xs: 'none', md: 'block' }
            }}
          >
            {location.pathname === '/' ? 'Market Overview' : 'Crypto Details'}
          </Typography>

          {/* Logout Button */}
          <LogoutButton variant="icon" />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

// Layout wrapper component
const AppLayout: FunctionComponent<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <>
      <AppHeader />
      <Box component="main">
        {children}
      </Box>
    </>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <CryptoTable />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/crypto/:id"
                element={
                  <ProtectedRoute>
                    <CryptoDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </AppLayout>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
