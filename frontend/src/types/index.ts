export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  shippingAddress?: string;
  billingAddress?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  sku?: string;
  category?: string;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  productId: number;
  quantity: number;
  productName?: string;
  productPrice?: number;
  productImageUrl?: string;
  subtotal?: number;
}

export interface Cart {
  id: number;
  userId: number;
  cartItems: CartItem[];
  totalPrice: number;
  totalItems: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  orderItems: OrderItem[];
  status: string;
  totalPrice: number;
  orderDate: string;
  shippingAddress?: string;
  billingAddress?: string;
}

export interface CreateOrderDto {
  userId: number;
  orderItems: { productId: number; quantity: number }[];
  shippingAddress: string;
  billingAddress: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface UserDto {
  username: string;
  password: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  shippingAddress?: string;
  billingAddress?: string;
  role?: string;
}
