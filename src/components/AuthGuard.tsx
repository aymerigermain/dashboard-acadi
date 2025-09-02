import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { 
  Login,
  Visibility,
  VisibilityOff,
  Lock,
  Person,
} from '@mui/icons-material';

interface AuthGuardProps {
  children: React.ReactNode;
}

const AUTH_KEY = 'acadi_dashboard_auth';

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const requiredUsername = import.meta.env.VITE_AUTH_USERNAME || 'admin';
  const requiredPassword = import.meta.env.VITE_AUTH_PASSWORD || 'admin123';

  useEffect(() => {
    // Check if user is already authenticated
    const authData = localStorage.getItem(AUTH_KEY);
    if (authData) {
      try {
        const { timestamp, authenticated } = JSON.parse(authData);
        // Session expires after 24 hours
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000 && authenticated) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem(AUTH_KEY);
        }
      } catch {
        localStorage.removeItem(AUTH_KEY);
      }
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API delay for security
    await new Promise(resolve => setTimeout(resolve, 500));

    if (username === requiredUsername && password === requiredPassword) {
      const authData = {
        authenticated: true,
        timestamp: Date.now(),
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
      setIsAuthenticated(true);
    } else {
      setError('Identifiants incorrects');
    }

    setLoading(false);
  };


  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          {/* Logo */}
          <Box
            component="img"
            src="/acadi-logo.png"
            alt="ACADI Logo"
            sx={{
              height: 80,
              width: 'auto',
              mb: 3,
            }}
          />

          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
              color: '#0496FF',
              mb: 1,
            }}
          >
            ACADI Dashboard
          </Typography>

          <Typography
            variant="subtitle1"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Tableau de Bord - Formation Stratégie
          </Typography>

          <Box component="form" onSubmit={handleLogin} sx={{ textAlign: 'left' }}>
            <TextField
              fullWidth
              label="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      disabled={loading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || !username || !password}
              startIcon={loading ? undefined : <Login />}
              sx={{
                mt: 3,
                py: 1.5,
                bgcolor: '#0496FF',
                '&:hover': { bgcolor: '#0374CC' },
              }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>
          </Box>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 3, display: 'block' }}
          >
            Accès sécurisé au tableau de bord des performances
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};