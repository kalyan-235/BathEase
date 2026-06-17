require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const connectDB = require('./config/db');

const seed = async () => {
  await connectDB();

  // Clear existing users
  await User.deleteMany({});

  // Create admin and demo user
  await User.create([
    {
      name: 'Admin',
      email: 'admin@bathease.in',
      password: 'admin123',
      role: 'admin',
    },
    {
      name: 'Demo Customer',
      email: 'demo@bathease.in',
      password: 'demo1234',
      role: 'user',
      whatsapp: '+919999999999',
      address: 'MG Road, Bengaluru',
      location: 'Bengaluru',
    },
  ]);

  console.log('✅ Seeded: admin@bathease.in / admin123');
  console.log('✅ Seeded: demo@bathease.in / demo1234');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
