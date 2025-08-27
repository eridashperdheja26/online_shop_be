import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  Grid,
  IconButton,
  TextField,
  Divider,
  Alert,
  Paper,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, removeFromCart, updateQuantity, clearCart, loading } = useCart();
  const [quantityUpdates, setQuantityUpdates] = useState<{ [key: number]: number }>({});

  if (!user) {
    navigate('/login');
    return null;
  }

  if (!cart || cart.cartItems.length === 0) {
    return (
      <Container maxWidth="md">
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <CartIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start shopping to add items to your cart
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </Button>
        </Box>
      </Container>
    );
  }

  const handleQuantityChange = (cartItemId: number, newQuantity: number) => {
    if (newQuantity <= 0) return;
    
    setQuantityUpdates(prev => ({
      ...prev,
      [cartItemId]: newQuantity
    }));
  };

  const handleUpdateQuantity = async (cartItemId: number) => {
    const newQuantity = quantityUpdates[cartItemId];
    if (newQuantity && newQuantity > 0) {
      try {
        await updateQuantity(cartItemId, newQuantity);
        setQuantityUpdates(prev => {
          const updated = { ...prev };
          delete updated[cartItemId];
          return updated;
        });
      } catch (error) {
        console.error('Failed to update quantity:', error);
      }
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error('Failed to clear cart:', error);
    }
  };

  const handleCheckout = () => {
    navigate('/orders');
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4, mb: 4 }}>
        Shopping Cart
      </Typography>

      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          {cart.cartItems.map((item) => (
            <Card key={item.id} sx={{ mb: 2 }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={3} sm={2}>
                    <CardMedia
                      component="img"
                      height="80"
                      image={item.productImageUrl || 'https://source.unsplash.com/random?product'}
                      alt={item.productName}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Grid>
                  <Grid item xs={9} sm={4}>
                    <Typography variant="h6" gutterBottom>
                      {item.productName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Price: ${item.productPrice?.toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={loading}
                      >
                        <RemoveIcon />
                      </IconButton>
                      <TextField
                        size="small"
                        value={quantityUpdates[item.id] || item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value) || 1;
                          handleQuantityChange(item.id, value);
                        }}
                        sx={{ width: 60 }}
                        inputProps={{ min: 1, style: { textAlign: 'center' } }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        disabled={loading}
                      >
                        <AddIcon />
                      </IconButton>
                    </Box>
                    {quantityUpdates[item.id] && quantityUpdates[item.id] !== item.quantity && (
                      <Button
                        size="small"
                        onClick={() => handleUpdateQuantity(item.id)}
                        disabled={loading}
                        sx={{ mt: 1 }}
                      >
                        Update
                      </Button>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Typography variant="h6" color="primary">
                      ${item.subtotal?.toFixed(2) || (item.productPrice! * item.quantity).toFixed(2)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={1}>
                    <IconButton
                      color="error"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={loading}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearCart}
              disabled={loading}
            >
              Clear Cart
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/products')}
            >
              Continue Shopping
            </Button>
          </Box>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Items ({cart.totalItems}):</Typography>
              <Typography>${cart.totalPrice.toFixed(2)}</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Shipping:</Typography>
              <Typography>Free</Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total:</Typography>
              <Typography variant="h6" color="primary">
                ${cart.totalPrice.toFixed(2)}
              </Typography>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleCheckout}
              disabled={loading || cart.totalItems === 0}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
