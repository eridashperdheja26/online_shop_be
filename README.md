# E-Commerce Spring Boot Application

A comprehensive e-commerce platform built with Spring Boot, featuring user management, product catalog, shopping cart, order processing, and secure authentication.

## Features

### 🛍️ **Product Management**
- Product CRUD operations
- Category-based filtering
- Search functionality
- Stock management
- Image URL support
- Pagination support

### 👥 **User Management**
- User registration and authentication
- Profile management
- Role-based access control (Customer, Admin)
- Address management (shipping & billing)

### 🛒 **Shopping Cart**
- Add/remove items
- Update quantities
- Cart persistence
- Stock validation

### 📦 **Order Management**
- Order creation and processing
- Order status tracking
- Order history
- Stock deduction on order placement

### 🔐 **Security**
- JWT-based authentication
- Password encryption
- Role-based authorization
- Input validation

## Technology Stack

- **Backend**: Spring Boot 3.5.4
- **Java Version**: 21
- **Database**: MySQL/PostgreSQL
- **Security**: Spring Security + JWT
- **Validation**: Bean Validation
- **Documentation**: OpenAPI 3 (Swagger)
- **Build Tool**: Maven

## Project Structure

```
src/main/java/com/online/shop/e_commerce/
├── Controller/          # REST API endpoints
├── Service/            # Business logic
├── Repository/         # Data access layer
├── Entity/            # JPA entities
├── Dto/               # Data Transfer Objects
├── Enum/              # Enumerations
└── Security/          # Security configuration
```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /profile/{userId}` - Get user profile
- `PUT /profile/{userId}` - Update user profile

### Users (`/api/users`)
- `GET /` - Get all users (Admin only)
- `GET /{userId}` - Get user by ID
- `GET /role/{role}` - Get users by role
- `GET /active` - Get active users
- `PUT /{userId}` - Update user
- `PUT /{userId}/password` - Update password
- `PUT /{userId}/activate` - Activate user
- `PUT /{userId}/deactivate` - Deactivate user

### Products (`/api/products`)
- `GET /` - Get all products (with pagination, category, search)
- `POST /` - Create new product
- `GET /{id}` - Get product by ID
- `GET /category/{category}` - Get products by category
- `GET /search` - Search products
- `GET /in-stock` - Get in-stock products
- `PUT /{id}` - Update product
- `PATCH /{id}` - Partial update
- `DELETE /{id}` - Delete product
- `PUT /{id}/stock` - Update stock

### Cart (`/api/cart`)
- `GET /{userId}` - Get user's cart
- `POST /{userId}/add-item` - Add item to cart
- `PUT /{userId}/update-item/{cartItemId}` - Update item quantity
- `DELETE /{userId}/remove-item/{cartItemId}` - Remove item from cart
- `DELETE /{userId}/clear` - Clear cart

### Orders (`/api/orders`)
- `POST /` - Create new order
- `GET /{orderId}` - Get order by ID
- `GET /user/{userId}` - Get user's orders
- `GET /` - Get all orders (Admin only)
- `PUT /{orderId}/status` - Update order status
- `DELETE /{orderId}/cancel` - Cancel order
- `GET /status/{status}` - Get orders by status

## Database Schema

### Users Table
- `id`, `username`, `password`, `email`
- `first_name`, `last_name`, `phone_number`
- `shipping_address`, `billing_address`
- `role`, `is_active`, `created_at`, `updated_at`

### Products Table
- `id`, `name`, `description`, `price`, `quantity`
- `sku`, `category`, `image_url`, `is_active`
- `created_at`, `updated_at`

### Carts Table
- `id`, `user_id`, `created_at`, `updated_at`

### Cart Items Table
- `id`, `cart_id`, `product_id`, `quantity`
- `created_at`, `updated_at`

### Orders Table
- `id`, `user_id`, `status`, `total_price`
- `order_date`, `shipping_address`, `billing_address`
- `created_at`, `updated_at`

### Order Items Table
- `id`, `order_id`, `product_id`, `quantity`, `price`
- `created_at`, `updated_at`

## Setup Instructions

### Prerequisites
- Java 21
- Maven 3.6+
- MySQL 8.0+ or PostgreSQL 13+

### 1. Clone the Repository
```bash
git clone <repository-url>
cd online_shop
```

### 2. Configure Database
Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/online_shop
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
```

### 3. Build and Run
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

### 4. Access the Application
- **Application**: http://localhost:8080
- **API Documentation**: http://localhost:8080/swagger-ui.html

## Sample API Usage

### Register a New User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "password123",
    "email": "john@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Create a Product
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15",
    "description": "Latest iPhone model",
    "price": 999.99,
    "quantity": 50,
    "category": "Electronics"
  }'
```

### Add Item to Cart
```bash
curl -X POST http://localhost:8080/api/cart/1/add-item \
  -H "Content-Type: application/json" \
  -d '{
    "productId": 1,
    "quantity": 2
  }'
```

## Security Features

- **Password Encryption**: BCrypt password hashing
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Bean validation for all inputs
- **Role-based Access**: Different permissions for customers and admins
- **SQL Injection Protection**: JPA/Hibernate parameterized queries

## Future Enhancements

- [ ] Payment gateway integration (Stripe, PayPal)
- [ ] Email notifications
- [ ] Product reviews and ratings
- [ ] Inventory management
- [ ] Shipping calculation
- [ ] Discount and coupon system
- [ ] Analytics and reporting
- [ ] Mobile app API
- [ ] Multi-language support
- [ ] Advanced search with Elasticsearch

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
