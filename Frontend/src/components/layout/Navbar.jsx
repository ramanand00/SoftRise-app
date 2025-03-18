import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';

const Navbar = () => {
  const token = localStorage.getItem('token');

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            flexGrow: 1,
            textDecoration: 'none',
            color: 'inherit',
            fontWeight: 700,
          }}
        >
          SoftRise
        </Typography>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            component={RouterLink}
            to="/courses"
            color="inherit"
          >
            Courses
          </Button>
          
          {token ? (
            <Button
              color="inherit"
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.reload();
              }}
            >
              Logout
            </Button>
          ) : (
            <>
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                color="inherit"
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 