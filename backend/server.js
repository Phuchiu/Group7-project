const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
const userRoutes = require('./routes/user');
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const passwordRoutes = require('./routes/password');
const uploadRoutes = require('./routes/upload');
const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
app.use('/api/auth', authRoutes);
app.use('/api/auth', passwordRoutes);
app.use('/api', profileRoutes);
app.use('/api', userRoutes);
app.use('/api', uploadRoutes);

// Kết nối MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
