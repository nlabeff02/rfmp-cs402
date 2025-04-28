// server/scripts/seed.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');
const User = require('../models/user.model');

// Connect to MongoDB
mongoose.connect(config.mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

// Generate random users
const generateUsers = async (count) => {
  const users = [];
  const salt = await bcrypt.genSalt(10);
  
  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', salt);
  users.push({
    username: 'admin',
    email: 'admin@example.com',
    password: adminPassword,
    role: 'admin',
    isActive: true,
    createdAt: new Date()
  });
  
  // Create regular users
  for (let i = 1; i <= count; i++) {
    const username = `user${i}`;
    const email = `user${i}@example.com`;
    const password = await bcrypt.hash('password123', salt);
    
    users.push({
      username,
      email,
      password,
      role: 'user',
      isActive: true,
      createdAt: new Date()
    });
  }
  
  return users;
};

// Seed database
const seedDatabase = async () => {
  try {
    // Clear existing users
    await User.deleteMany({});
    console.log('Deleted existing users');
    
    // Generate users (1 admin + 4999 regular users = 5000 total)
    const users = await generateUsers(4999);
    console.log('Generated user data');
    
    // Insert users
    await User.insertMany(users);
    console.log('Inserted users into database');
    
    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();