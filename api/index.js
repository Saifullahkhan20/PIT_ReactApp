const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
console.log('Loading environment variables...');
const envPath = path.resolve(__dirname, '../.env');
console.log('Attempting to load .env from:', envPath);
dotenv.config({ path: envPath });
console.log('Environment variables loaded.');
console.log('MONGO_URI after dotenv.config:', process.env.MONGO_URI);
console.log('REACT_APP_API_URL after dotenv.config:', process.env.REACT_APP_API_URL);
console.log('NODE_ENV after dotenv.config:', process.env.NODE_ENV);
console.log('PORT after dotenv.config:', process.env.PORT);

// Connect to database
console.log('Attempting to connect to MongoDB...');
connectDB()
  .then(() => console.log('MongoDB connection successful'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Route files
console.log('Loading route files...');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const authRoutes = require('./routes/authRoutes');
const cartRoutes = require('./routes/cart');
const contactRoutes = require('./routes/contactRoutes');
console.log('Route files loaded successfully.');

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Set static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount routers
console.log('Mounting routes...');
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/contact', contactRoutes);
console.log('Routes mounted successfully.');

// Error handler middleware
app.use(errorHandler);

module.exports = app; 