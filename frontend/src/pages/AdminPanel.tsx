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
  LinearProgress,
  Divider,
  Badge,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  ShoppingCart,
  People,
  AttachMoney,
  TrendingUp,
  Add,
  Edit,
  Delete,
  Visibility,
  LocalShipping,
  Assessment,
  Settings,
  Notifications,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  totalRevenue: number;
  lowStockProducts: number;
  pendingOrders: number;
}

const AdminPanel: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    lowStockProducts: 0,
    pendingOrders: 0,
  });

  useEffect(() => {
    // Check if user is admin
    if (user && user.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    
    // Load dashboard stats
    loadDashboardStats();
  }, [user, navigate]);

  const loadDashboardStats = async () => {
    // Mock data for now - replace with actual API calls
    setStats({
      totalProducts: 156,
      totalOrders: 89,
      totalUsers: 234,
      totalRevenue: 15420.50,
      lowStockProducts: 12,
      pendingOrders: 8,
    });
  };

  const StatCard = ({ 
    title, 
    value, 
    icon, 
    color, 
    subtitle, 
    onClick 
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: string;
    subtitle?: string;
    onClick?: () => void;
  }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        '&:hover': onClick ? {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        } : {},
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              bgcolor: color, 
              mr: 2,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
          </Box>
        </Box>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ 
    title, 
    description, 
    icon, 
    color, 
    onClick 
  }: {
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
    onClick: () => void;
  }) => (
    <Card 
      sx={{ 
        height: '100%',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: theme.shadows[8],
        },
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}20`,
      }}
      onClick={onClick}
    >
      <CardContent sx={{ p: 3, textAlign: 'center' }}>
        <Avatar 
          sx={{ 
            bgcolor: color, 
            mx: 'auto', 
            mb: 2,
            width: 64,
            height: 64,
          }}
        >
          {icon}
        </Avatar>
        <Typography variant="h6" component="div" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {description}
        </Typography>
      </CardContent>
    </Card>
  );

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ mt: 4, mb: 6 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            🚀 Admin Dashboard
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Welcome back, {user.username}! Manage your shop like a pro.
          </Typography>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              icon={<Inventory />}
              color={theme.palette.primary.main}
              subtitle="Active in catalog"
              onClick={() => navigate('/admin/products')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              icon={<ShoppingCart />}
              color={theme.palette.success.main}
              subtitle="All time orders"
              onClick={() => navigate('/admin/orders')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Users"
              value={stats.totalUsers}
              icon={<People />}
              color={theme.palette.info.main}
              subtitle="Registered customers"
              onClick={() => navigate('/admin/users')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Revenue"
              value={`$${stats.totalRevenue.toLocaleString()}`}
              icon={<AttachMoney />}
              color={theme.palette.warning.main}
              subtitle="Total earnings"
              onClick={() => navigate('/admin/analytics')}
            />
          </Grid>
        </Grid>

        {/* Alerts & Notifications */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #ff980015 0%, #ff980005 100%)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Notifications sx={{ color: 'warning.main', mr: 1 }} />
                <Typography variant="h6" color="warning.main">
                  Low Stock Alert
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                {stats.lowStockProducts}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Products need restocking
              </Typography>
              <Button 
                variant="outlined" 
                color="warning"
                onClick={() => navigate('/admin/inventory')}
              >
                View Inventory
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #2196f315 0%, #2196f305 100%)' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LocalShipping sx={{ color: 'info.main', mr: 1 }} />
                <Typography variant="h6" color="info.main">
                  Pending Orders
                </Typography>
              </Box>
              <Typography variant="h4" sx={{ mb: 1, fontWeight: 'bold' }}>
                {stats.pendingOrders}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Orders awaiting processing
              </Typography>
              <Button 
                variant="outlined" 
                color="info"
                onClick={() => navigate('/admin/orders')}
              >
                Process Orders
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* Quick Actions */}
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
          🎯 Quick Actions
        </Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Add Product"
              description="Create new product listings"
              icon={<Add />}
              color={theme.palette.success.main}
              onClick={() => navigate('/admin/products/add')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Manage Inventory"
              description="Update stock levels and prices"
              icon={<Inventory />}
              color={theme.palette.primary.main}
              onClick={() => navigate('/admin/inventory')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="View Analytics"
              description="Sales reports and insights"
              icon={<Assessment />}
              color={theme.palette.info.main}
              onClick={() => navigate('/admin/analytics')}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <QuickActionCard
              title="Shop Settings"
              description="Configure shop preferences"
              icon={<Settings />}
              color={theme.palette.warning.main}
              onClick={() => navigate('/admin/settings')}
            />
          </Grid>
        </Grid>

        {/* Recent Activity */}
        <Paper sx={{ p: 3, background: 'linear-gradient(135deg, #f5f5f5 0%, #ffffff 100%)' }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
            📊 Recent Activity
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 32, height: 32 }}>
                  <ShoppingCart />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    New order received
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    2 minutes ago
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2, width: 32, height: 32 }}>
                  <Inventory />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Low stock alert
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    15 minutes ago
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2, width: 32, height: 32 }}>
                  <People />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    New user registered
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    1 hour ago
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>
                  <TrendingUp />
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    Sales milestone reached
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    3 hours ago
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default AdminPanel;
