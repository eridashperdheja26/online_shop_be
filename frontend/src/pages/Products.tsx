import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Pagination,
  Chip,
  Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import { productsAPI } from '../services/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Products: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [page, searchQuery, selectedCategory]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(page - 1, 12, selectedCategory, searchQuery);
      
      if (response.data.content) {
        // Paginated response
        setProducts(response.data.content);
        setTotalPages(Math.ceil(response.data.totalElements / 12));
      } else {
        // Non-paginated response
        setProducts(response.data);
        setTotalPages(1);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      // You could create an API endpoint for categories
      // For now, we'll extract unique categories from products
      const response = await productsAPI.getAll(0, 1000);
      const allProducts = response.data.content || response.data;
      const uniqueCategories = [...new Set(allProducts.map((p: Product) => p.category).filter(Boolean))] as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product, 1);
      // You could show a success message here
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadProducts();
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  if (loading && products.length === 0) {
    return (
      <Container>
        <Typography>Loading products...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" component="h1" gutterBottom sx={{ mt: 4 }}>
        Products
      </Typography>

      {/* Search and Filter */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <form onSubmit={handleSearch}>
              <TextField
                fullWidth
                label="Search products"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or description..."
              />
            </form>
          </Grid>
          <Grid item xs={12} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={selectedCategory}
                label="Category"
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="outlined"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('');
                setPage(1);
              }}
              fullWidth
            >
              Clear Filters
            </Button>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Products Grid */}
      <Grid container spacing={4}>
        {products.map((product) => (
          <Grid key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.imageUrl || 'https://source.unsplash.com/random?product'}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3" noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph sx={{ 
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Chip 
                    label={product.quantity > 0 ? 'In Stock' : 'Out of Stock'} 
                    color={product.quantity > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </Box>
                {product.category && (
                  <Chip label={product.category} size="small" sx={{ mb: 1 }} />
                )}
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => navigate(`/products/${product.id}`)}
                  fullWidth
                >
                  View Details
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleAddToCart(product)}
                  disabled={product.quantity === 0}
                  fullWidth
                >
                  Add to Cart
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}

      {products.length === 0 && !loading && (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No products found.
          </Typography>
        </Box>
      )}
    </Container>
  );
};

export default Products;
