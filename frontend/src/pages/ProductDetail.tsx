import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  Alert,
  CircularProgress,
  Divider,
  TextField,
} from '@mui/material';
import { ShoppingCart, ArrowBack } from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { Product } from '../types';
import { productsAPI } from '../services/api';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(parseInt(id!));
      setProduct(response.data);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value);
    if (value > 0 && value <= (product?.quantity || 1)) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            {error || 'Product not found'}
          </Alert>
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate('/products')}
            sx={{ mt: 2 }}
          >
            Back to Products
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/products')}
          sx={{ mb: 3 }}
        >
          Back to Products
        </Button>

        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Product Image */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 2,
                }}
              >
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                    }}
                  />
                ) : (
                  <Typography variant="h6" color="text.secondary">
                    No Image Available
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Product Details */}
            <Grid item xs={12} md={6}>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <Chip
                  label={product.category}
                  color="primary"
                  variant="outlined"
                  sx={{ mr: 1 }}
                />
                <Chip
                  label={product.isActive ? 'Active' : 'Inactive'}
                  color={product.isActive ? 'success' : 'error'}
                  variant="outlined"
                />
              </Box>

              <Typography variant="h5" color="primary" gutterBottom>
                ${product.price.toFixed(2)}
              </Typography>

              <Typography variant="body1" paragraph>
                {product.description}
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  SKU: {product.sku}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock: {product.quantity} units
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Add to Cart Section */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Add to Cart
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={6} sm={4}>
                    <TextField
                      type="number"
                      label="Quantity"
                      value={quantity}
                      onChange={handleQuantityChange}
                      inputProps={{
                        min: 1,
                        max: product.quantity,
                      }}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={6} sm={8}>
                    <Button
                      variant="contained"
                      size="large"
                      startIcon={<ShoppingCart />}
                      onClick={handleAddToCart}
                      disabled={product.quantity === 0}
                      fullWidth
                    >
                      {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                  </Grid>
                </Grid>
              </Box>

              {product.quantity === 0 && (
                <Alert severity="warning">
                  This product is currently out of stock.
                </Alert>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default ProductDetail;
