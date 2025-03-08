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
  Alert,
  Stepper,
  Step,
  StepLabel,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import GoogleIcon from '@mui/icons-material/Google';
import FacebookIcon from '@mui/icons-material/Facebook';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import SchoolIcon from '@mui/icons-material/School';

const SocialButton = styled(Button)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(2),
  textTransform: 'none',
}));

const steps = ['Account Details', 'Personal Information', 'Interests'];

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    education: '',
    interests: {
      webDevelopment: false,
      dataScience: false,
      mobileDevelopment: false,
      cloudComputing: false,
      artificialIntelligence: false,
      cybersecurity: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleInterestChange = (interest) => (event) => {
    setFormData((prev) => ({
      ...prev,
      interests: {
        ...prev.interests,
        [interest]: event.target.checked,
      },
    }));
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = async () => {
    try {
      // TODO: Implement registration logic
      if (formData.password !== formData.confirmPassword) {
        throw new Error('Passwords do not match');
      }
      // Handle successful registration
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleRegister = () => {
    // TODO: Implement Google OAuth
    window.location.href = '/api/auth/google';
  };

  const handleFacebookRegister = () => {
    // TODO: Implement Facebook OAuth
    window.location.href = '/api/auth/facebook';
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!error}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
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
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={!!error}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              id="firstName"
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="lastName"
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              fullWidth
              id="education"
              label="Education"
              name="education"
              value={formData.education}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SchoolIcon />
                  </InputAdornment>
                ),
              }}
            />
          </>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Select your areas of interest:
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.interests.webDevelopment}
                  onChange={handleInterestChange('webDevelopment')}
                />
              }
              label="Web Development"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.interests.dataScience}
                  onChange={handleInterestChange('dataScience')}
                />
              }
              label="Data Science"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.interests.mobileDevelopment}
                  onChange={handleInterestChange('mobileDevelopment')}
                />
              }
              label="Mobile Development"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.interests.cloudComputing}
                  onChange={handleInterestChange('cloudComputing')}
                />
              }
              label="Cloud Computing"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.interests.artificialIntelligence}
                  onChange={handleInterestChange('artificialIntelligence')}
                />
              }
              label="Artificial Intelligence"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.interests.cybersecurity}
                  onChange={handleInterestChange('cybersecurity')}
                />
              }
              label="Cybersecurity"
            />
          </Box>
        );
      default:
        return 'Unknown step';
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
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stepper activeStep={activeStep} sx={{ width: '100%', mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" sx={{ width: '100%', mt: 1 }}>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? 'Create Account' : 'Next'}
              </Button>
            </Box>

            {activeStep === 0 && (
              <>
                <Divider sx={{ my: 3 }}>OR</Divider>

                <SocialButton
                  variant="outlined"
                  startIcon={<GoogleIcon />}
                  onClick={handleGoogleRegister}
                >
                  Sign up with Google
                </SocialButton>

                <SocialButton
                  variant="outlined"
                  startIcon={<FacebookIcon />}
                  onClick={handleFacebookRegister}
                  sx={{ bgcolor: '#1877F2', color: 'white', '&:hover': { bgcolor: '#1565C0' } }}
                >
                  Sign up with Facebook
                </SocialButton>

                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link href="/login" variant="body2">
                      Sign in
                    </Link>
                  </Typography>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register; 