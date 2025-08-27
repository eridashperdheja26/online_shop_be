import axios from 'axios';
import { Product, User, Cart, CartItem, Order, CreateOrderDto, LoginDto, UserDto } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData: UserDto) => api.post('/auth/register', userData),
  registerAdmin: (userData: UserDto) => api.post('/auth/register-admin', userData),
  login: (loginData: LoginDto) => api.post('/auth/login', loginData),
  getProfile: (userId: number) => api.get(`/auth/profile/${userId}`),
  updateProfile: (userId: number, userData: Partial<UserDto>) => api.put(`/auth/profile/${userId}`, userData),
};

// Products API
export const productsAPI = {
  getAll: (page = 0, size = 10, category?: string, search?: string) => 
    api.get('/products', { params: { page, size, category, search } }),
  getById: (id: number) => api.get(`/products/${id}`),
  getByCategory: (category: string) => api.get(`/products/category/${category}`),
  search: (query: string) => api.get('/products/search', { params: { query } }),
  getInStock: () => api.get('/products/in-stock'),
  create: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => 
    api.post('/products', product),
  update: (id: number, product: Partial<Product>) => api.put(`/products/${id}`, product),
  delete: (id: number) => api.delete(`/products/${id}`),
  updateStock: (id: number, quantity: number) => 
    api.put(`/products/${id}/stock`, null, { params: { quantity } }),
};

// Cart API
export const cartAPI = {
  getUserCart: (userId: number) => api.get(`/cart/${userId}`),
  addItem: (userId: number, cartItem: Omit<CartItem, 'id'>) => 
    api.post(`/cart/${userId}/add-item`, cartItem),
  updateItemQuantity: (userId: number, cartItemId: number, quantity: number) => 
    api.put(`/cart/${userId}/update-item/${cartItemId}`, null, { params: { quantity } }),
  removeItem: (userId: number, cartItemId: number) => 
    api.delete(`/cart/${userId}/remove-item/${cartItemId}`),
  clearCart: (userId: number) => api.delete(`/cart/${userId}/clear`),
};

// Orders API
export const ordersAPI = {
  create: (orderData: CreateOrderDto) => api.post('/orders', orderData),
  createFromCart: (userId: number, shippingAddress: string, billingAddress: string) => 
    api.post(`/orders/from-cart/${userId}`, null, { 
      params: { shippingAddress, billingAddress } 
    }),
  getById: (orderId: number) => api.get(`/orders/${orderId}`),
  getUserOrders: (userId: number) => api.get(`/orders/user/${userId}`),
  getAll: () => api.get('/orders'),
  updateStatus: (orderId: number, status: string) => 
    api.put(`/orders/${orderId}/status`, null, { params: { status } }),
  cancel: (orderId: number) => api.delete(`/orders/${orderId}/cancel`),
  getByStatus: (status: string) => api.get(`/orders/status/${status}`),
};

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (userId: number) => api.get(`/users/${userId}`),
  getByRole: (role: string) => api.get(`/users/role/${role}`),
  getActive: () => api.get('/users/active'),
  update: (userId: number, userData: Partial<UserDto>) => 
    api.put(`/users/${userId}`, userData),
  updatePassword: (userId: number, newPassword: string) => 
    api.put(`/users/${userId}/password`, null, { params: { newPassword } }),
  deactivate: (userId: number) => api.put(`/users/${userId}/deactivate`),
  activate: (userId: number) => api.put(`/users/${userId}/activate`),
};

export default api;
