import React, { useState } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';

const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  textTransform: 'none',
}));

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // TODO: Implement login logic
    try {
      // Simulate API call
      if (!formData.email || !formData.password) {
        throw new Error('Please fill in all fields');
      }
      // Handle successful login
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    window.location.href = '/api/auth/google';
  };

  const handleFacebookLogin = () => {
    // TODO: Implement Facebook OAuth
    window.location.href = '/api/auth/facebook';
  };

  const handleForgotPassword = () => {
    setForgotPasswordOpen(true);
  };

  const handleResetPassword = async () => {
    try {
      // TODO: Implement password reset logic
      if (!resetEmail) {
        throw new Error('Please enter your email');
      }
      // Simulate API call
      setResetEmailSent(true);
      setTimeout(() => {
        setForgotPasswordOpen(false);
        setResetEmailSent(false);
        setResetEmail('');
      }, 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" gutterBottom>
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Sign in to continue learning
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ width: '100%', mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              error={!!error}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              error={!!error}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                width: '100%',
                mt: 1,
                mb: 2,
              }}
            >
              <Link
                component="button"
                variant="body2"
                onClick={handleForgotPassword}
              >
                Forgot password?
              </Link>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mb: 2 }}
            >
              Sign In
            </Button>

            <Divider sx={{ mb: 2 }}>OR</Divider>

            <SocialButton
              variant="outlined"
              startIcon={<GoogleIcon />}
              onClick={handleGoogleLogin}
            >
              Continue with Google
            </SocialButton>

            <SocialButton
              variant="outlined"
              startIcon={<FacebookIcon />}
              onClick={handleFacebookLogin}
              sx={{ bgcolor: '#1877F2', color: 'white', '&:hover': { bgcolor: '#1565C0' } }}
            >
              Continue with Facebook
            </SocialButton>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link href="/register" variant="body2">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Dialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      >
        <DialogTitle>Reset Password</DialogTitle>
        <DialogContent>
          {resetEmailSent ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Password reset instructions have been sent to your email.
            </Alert>
          ) : (
            <>
              <Typography variant="body1" sx={{ mt: 2 }}>
                Enter your email address and we'll send you instructions to reset
                your password.
              </Typography>
              <TextField
                autoFocus
                margin="dense"
                id="resetEmail"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForgotPasswordOpen(false)}>Cancel</Button>
          {!resetEmailSent && (
            <Button onClick={handleResetPassword} variant="contained">
              Reset Password
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Login; 