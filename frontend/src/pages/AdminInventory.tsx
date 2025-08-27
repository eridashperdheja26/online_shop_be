import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Avatar,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  useTheme,
  useMediaQuery,
  LinearProgress,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  InputAdornment,
  Badge,
} from '@mui/material';
import {
  Inventory,
  Warning,
  Error,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Refresh,
  Edit,
  Save,
  Cancel,
  LocalShipping,
  AttachMoney,
  Assessment,
  Notifications,
  LowPriority,
  PriorityHigh,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';
import { productsAPI } from '../services/api';

interface InventoryStats {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalValue: number;
  lowStockThreshold: number;
}

const AdminInventory: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockUpdate, setStockUpdate] = useState({ quantity: 0, price: 0 });
  const [categories, setCategories] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [stats, setStats] = useState<InventoryStats>({
    totalProducts: 0,
    inStock: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0,
    lowStockThreshold: 10,
  });

  useEffect(() => {
    if (user && user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    
    loadProducts();
    loadCategories();
  }, [user, navigate, page, rowsPerPage, searchQuery, selectedCategory, stockFilter]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getAll(page, rowsPerPage, selectedCategory, searchQuery);
      const allProducts = response.data.content || response.data;
      setProducts(allProducts);
      calculateStats(allProducts);
    } catch (error: any) {
      setError('Failed to load products');
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await productsAPI.getAll(0, 1000);
      const allProducts = response.data.content || response.data;
      const uniqueCategories = [...new Set(allProducts.map((p: Product) => p.category).filter(Boolean))] as string[];
      setCategories(uniqueCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const calculateStats = (products: Product[]) => {
    const totalProducts = products.length;
    const inStock = products.filter(p => p.quantity > stats.lowStockThreshold).length;
    const lowStock = products.filter(p => p.quantity > 0 && p.quantity <= stats.lowStockThreshold).length;
    const outOfStock = products.filter(p => p.quantity === 0).length;
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.quantity), 0);

    setStats({
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      totalValue,
      lowStockThreshold: stats.lowStockThreshold,
    });
  };

  const handleStockUpdate = (product: Product) => {
    setEditingProduct(product);
    setStockUpdate({
      quantity: product.quantity,
      price: product.price,
    });
    setOpenDialog(true);
  };

  const handleSubmitStockUpdate = async () => {
    if (!editingProduct) return;

    try {
      await productsAPI.update(editingProduct.id, {
        quantity: stockUpdate.quantity,
        price: stockUpdate.price,
      });
      setSuccess('Stock updated successfully');
      setOpenDialog(false);
      loadProducts();
    } catch (error: any) {
      setError(error.response?.data?.error || 'Failed to update stock');
    }
  };

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { status: 'Out of Stock', color: 'error', icon: <Error /> };
    if (quantity <= stats.lowStockThreshold) return { status: 'Low Stock', color: 'warning', icon: <Warning /> };
    return { status: 'In Stock', color: 'success', icon: <CheckCircle /> };
  };

  const getStockPercentage = (quantity: number) => {
    // Assuming max stock is 100 for visualization
    const maxStock = 100;
    return Math.min((quantity / maxStock) * 100, 100);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.sku && product.sku.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = !selectedCategory || product.category === selectedCategory;
    
    let matchesStock = true;
    switch (stockFilter) {
      case 'inStock':
        matchesStock = product.quantity > stats.lowStockThreshold;
        break;
      case 'lowStock':
        matchesStock = product.quantity > 0 && product.quantity <= stats.lowStockThreshold;
        break;
      case 'outOfStock':
        matchesStock = product.quantity === 0;
        break;
    }
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            📦 Inventory Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Monitor stock levels, track inventory value, and manage product availability
          </Typography>
        </Box>

        {/* Inventory Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #4caf5015 0%, #4caf5005 100%)',
              border: '1px solid #4caf5020',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 48, height: 48 }}>
                    <CheckCircle />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                      {stats.inStock}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      In Stock
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ff980015 0%, #ff980005 100%)',
              border: '1px solid #ff980020',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'warning.main', mr: 2, width: 48, height: 48 }}>
                    <Warning />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'warning.main' }}>
                      {stats.lowStock}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Low Stock
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #f4433615 0%, #f4433605 100%)',
              border: '1px solid #f4433620',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'error.main', mr: 2, width: 48, height: 48 }}>
                    <Error />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'error.main' }}>
                      {stats.outOfStock}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Out of Stock
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #2196f315 0%, #2196f305 100%)',
              border: '1px solid #2196f320',
            }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'info.main', mr: 2, width: 48, height: 48 }}>
                    <AttachMoney />
                  </Avatar>
                  <Box>
                    <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'info.main' }}>
                      ${stats.totalValue.toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Value
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search and Filters */}
        <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)' }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Search inventory"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or SKU..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Inventory />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  label="Category"
                  onChange={(e) => setSelectedCategory(e.target.value)}
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
              <FormControl fullWidth>
                <InputLabel>Stock Status</InputLabel>
                <Select
                  value={stockFilter}
                  label="Stock Status"
                  onChange={(e) => setStockFilter(e.target.value)}
                >
                  <MenuItem value="all">All Products</MenuItem>
                  <MenuItem value="inStock">In Stock</MenuItem>
                  <MenuItem value="lowStock">Low Stock</MenuItem>
                  <MenuItem value="outOfStock">Out of Stock</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                variant="outlined"
                onClick={loadProducts}
                startIcon={<Refresh />}
              >
                Refresh
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Inventory Table */}
        <Paper sx={{ overflow: 'hidden' }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: theme.palette.primary.main }}>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Product</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Category</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Stock Level</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Value</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography variant="body1" color="text.secondary">
                        No products found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => {
                    const stockStatus = getStockStatus(product.quantity);
                    const stockPercentage = getStockPercentage(product.quantity);
                    
                    return (
                      <TableRow key={product.id} hover>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar
                              src={product.imageUrl}
                              variant="rounded"
                              sx={{ width: 50, height: 50, mr: 2 }}
                            >
                              <Inventory />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {product.name}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                SKU: {product.sku}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={product.category} 
                            color="primary" 
                            variant="outlined" 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ minWidth: 200 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {product.quantity} units
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {stockPercentage.toFixed(0)}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={stockPercentage}
                              color={stockStatus.color as any}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            icon={stockStatus.icon}
                            label={stockStatus.status} 
                            color={stockStatus.color as any} 
                            size="small" 
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'success.main' }}>
                            ${(product.price * product.quantity).toFixed(2)}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            @${product.price}/unit
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Tooltip title="Update Stock">
                            <IconButton 
                              size="small" 
                              onClick={() => handleStockUpdate(product)}
                              color="primary"
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredProducts.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25, 50]}
          />
        </Paper>

        {/* Stock Update Dialog */}
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ 
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            color: 'white'
          }}>
            Update Stock & Price
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            {editingProduct && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {editingProduct.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  SKU: {editingProduct.sku}
                </Typography>
              </Box>
            )}
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Stock Quantity"
                  type="number"
                  value={stockUpdate.quantity}
                  onChange={(e) => setStockUpdate(prev => ({ ...prev, quantity: parseInt(e.target.value) }))}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">📦</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Unit Price"
                  type="number"
                  value={stockUpdate.price}
                  onChange={(e) => setStockUpdate(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Value: <strong>${(stockUpdate.quantity * stockUpdate.price).toFixed(2)}</strong>
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setOpenDialog(false)} color="inherit">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitStockUpdate} 
              variant="contained"
              startIcon={<Save />}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              }}
            >
              Update Stock
            </Button>
          </DialogActions>
        </Dialog>

        {/* Alerts */}
        {error && (
          <Alert severity="error" sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ position: 'fixed', top: 16, right: 16, zIndex: 9999 }}>
            {success}
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default AdminInventory;
