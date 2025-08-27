import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ordersAPI } from '../services/api';
import { Order, CreateOrderDto } from '../types';

const Orders: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart } = useCart();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [createOrderDialog, setCreateOrderDialog] = useState(false);
  const [orderForm, setOrderForm] = useState({
    shippingAddress: '',
    billingAddress: '',
  });

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  if (!user) {
    navigate('/login');
    return null;
  }

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersAPI.getUserOrders(user.id);
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders:', error);
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!cart || cart.cartItems.length === 0) {
      setError('Your cart is empty. Please add items before creating an order.');
      return;
    }

    try {
      const orderData: CreateOrderDto = {
        userId: user.id,
        orderItems: cart.cartItems.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress: orderForm.shippingAddress,
        billingAddress: orderForm.billingAddress,
      };

      await ordersAPI.create(orderData);
      setCreateOrderDialog(false);
      setOrderForm({ shippingAddress: '', billingAddress: '' });
      loadOrders();
      // You could also clear the cart here
    } catch (error) {
      console.error('Failed to create order:', error);
      setError('Failed to create order. Please try again.');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PROCESSING':
        return 'warning';
      case 'SHIPPED':
        return 'info';
      case 'DELIVERED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading orders...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1">
          My Orders
        </Typography>
        {cart && cart.cartItems.length > 0 && (
          <Button
            variant="contained"
            onClick={() => setCreateOrderDialog(true)}
          >
            Create Order from Cart
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {orders.length === 0 ? (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No orders found
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Start shopping to create your first order
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Order #{order.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Placed on {formatDate(order.orderDate)}
                      </Typography>
                    </Box>
                    <Chip
                      label={order.status}
                      color={getStatusColor(order.status) as any}
                      variant="outlined"
                    />
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Shipping Address:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {order.shippingAddress || 'Not specified'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" gutterBottom>
                        Billing Address:
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {order.billingAddress || 'Not specified'}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" gutterBottom>
                    Order Items ({order.orderItems.length}):
                  </Typography>
                  {order.orderItems.map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">
                        Product ID: {item.productId} x {item.quantity}
                      </Typography>
                      <Typography variant="body2" color="primary">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" color="primary">
                      Total: ${order.totalPrice.toFixed(2)}
                    </Typography>
                    <Button
                      size="small"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Order Dialog */}
      <Dialog open={createOrderDialog} onClose={() => setCreateOrderDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create Order from Cart</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Shipping Address"
              multiline
              rows={3}
              value={orderForm.shippingAddress}
              onChange={(e) => setOrderForm(prev => ({ ...prev, shippingAddress: e.target.value }))}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Billing Address"
              multiline
              rows={3}
              value={orderForm.billingAddress}
              onChange={(e) => setOrderForm(prev => ({ ...prev, billingAddress: e.target.value }))}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOrderDialog(false)}>Cancel</Button>
          <Button
            onClick={handleCreateOrder}
            variant="contained"
            disabled={!orderForm.shippingAddress || !orderForm.billingAddress}
          >
            Create Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Orders;
