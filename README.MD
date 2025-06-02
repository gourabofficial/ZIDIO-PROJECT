# 🌌 Cosmic Heroes - E-commerce Platform

A full-stack e-commerce application for superhero merchandise built with modern web technologies. This platform offers a cosmic-themed shopping experience with comprehensive admin management capabilities.

![Cosmic Heroes](https://img.shields.io/badge/Status-Active-brightgreen)
![React](https://img.shields.io/badge/React-19.0.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-darkgreen)

## ✨ Features

### 🛍️ Customer Features
- **Cosmic Shopping Experience**: Browse superhero merchandise with an immersive space-themed UI
- **Product Catalog**: Filter by categories, collections, size, price range, and offers
- **Search & Discovery**: Advanced search functionality with real-time suggestions
- **Wishlist Management**: Save favorite items for later purchase
- **Shopping Cart**: Add, remove, and manage items with quantity controls
- **Secure Checkout**: Multiple payment options including Cash on Delivery and Online payments
- **Order Tracking**: Real-time order status updates with unique tracking IDs
- **User Authentication**: Secure login/signup powered by Clerk
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices

### 🔧 Admin Features
- **Dashboard Analytics**: Comprehensive overview of sales, orders, and user metrics
- **Product Management**: Add, edit, delete products with multiple image uploads
- **Inventory Control**: Manage stock, categories, sizes, and pricing
- **Order Management**: View and update order statuses
- **User Management**: Monitor user accounts and activities
- **Homepage Customization**: Configure featured products, hot items, and trending sections
- **Content Management**: Control what appears on the homepage dynamically

### 🎨 Design Features
- **Cosmic Theme**: Space-inspired gradient backgrounds and animations
- **Interactive UI**: Smooth animations and transitions using Framer Motion
- **Modern Components**: Clean, professional design with Tailwind CSS
- **Loading States**: Engaging loading animations and skeleton screens
- **Toast Notifications**: Real-time feedback for user actions

## 🛠️ Tech Stack

### Frontend
- **React 19.0.0** - Modern UI library with latest features
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Clerk** - Authentication and user management
- **Axios** - HTTP client for API requests
- **React Hot Toast** - Notification system
- **Lucide React** - Modern icon library
- **Vite** - Fast build tool and development server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Clerk Express** - Server-side authentication
- **Stripe** - Payment processing
- **Cloudinary** - Image storage and optimization
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation


## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Clerk account for authentication
- Cloudinary account for image storage
- Stripe account for payments (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Zidio-Main-Project
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd client
   npm install
   ```

### Environment Configuration

#### Server Environment Variables
Create a `.env` file in the `server` directory:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# Clerk Authentication
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Stripe (for payments)
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Application
PORT=5000
CLIENT_URL=http://localhost:5173
```

#### Client Environment Variables
Create a `.env` file in the `client` directory:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# API Configuration
VITE_API_URL=http://localhost:5000
```


- User-specific shopping carts
- Product quantity management
- Real-time updates

## 🔒 Authentication & Authorization

The application uses **Clerk** for authentication, providing:
- Secure user registration and login
- Role-based access control
- Session management
- Protected routes for admin features

### Admin Access
Admin users have access to:
- Product management dashboard
- Order management system
- User account overview
- Homepage content control
- Analytics and reporting

## 💳 Payment Integration

**Stripe** integration supports:
- Secure online payments
- Cash on Delivery option
- Order confirmation
- Payment status tracking

## 🖼️ Media Management

**Cloudinary** integration provides:
- Secure image uploads
- Automatic optimization
- Multiple image formats
- Responsive image delivery

## 🎯 Key Features Implementation

### Product Filtering
Advanced filtering system with:
- Price range selection
- Category and collection filters
- Size-based filtering
- Offer status filtering
- Real-time search

### Admin Dashboard
Comprehensive admin panel featuring:
- Sales analytics with charts
- Recent activity monitoring
- Product management interface
- Order status updates
- User management tools

### Responsive Design
Mobile-first approach with:
- Adaptive layouts for all screen sizes
- Touch-friendly interactions
- Optimized performance
- Progressive enhancement



### Cosmic Theme
- Space-inspired color palette
- Gradient backgrounds and animations
- Star field effects
- Smooth transitions and micro-interactions

### Interactive Elements
- Hover effects on buttons and cards
- Loading animations
- Toast notifications
- Modal dialogs
- Responsive navigation



## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Built with ❤️ for the superhero community

## 🆘 Support

For support, email [your-email] or join our Discord community.

---

**Happy Shopping in the Cosmic Universe! 🌟**