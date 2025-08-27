import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Badge,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Avatar,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Person as PersonIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate('/profile');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <StoreIcon sx={{ mr: 2 }} />
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          E-Commerce Store
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" onClick={() => navigate('/products')}>
            Products
          </Button>

          {isAuthenticated ? (
            <>
              {user?.role === 'ADMIN' && (
                <Button color="inherit" onClick={() => navigate('/admin')}>
                  Admin Panel
                </Button>
              )}
              
              <Button color="inherit" onClick={() => navigate('/orders')}>
                Orders
              </Button>

              <IconButton
                color="inherit"
                onClick={() => navigate('/cart')}
                sx={{ position: 'relative' }}
              >
                <Badge badgeContent={getCartItemCount()} color="secondary">
                  <CartIcon />
                </Badge>
              </IconButton>

              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{ ml: 1 }}
              >
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                  <PersonIcon />
                </Avatar>
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
              >
                <MenuItem onClick={handleProfile}>Profile</MenuItem>
                {user?.role === 'ADMIN' && (
                  <>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/products'); }}>
                      Manage Products
                    </MenuItem>
                    <MenuItem onClick={() => { handleMenuClose(); navigate('/admin/inventory'); }}>
                      Manage Inventory
                    </MenuItem>
                  </>
                )}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                Register
              </Button>
              <Button 
                color="inherit" 
                variant="outlined"
                onClick={() => navigate('/admin/register')}
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Admin Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
