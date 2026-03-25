const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Handle both CommonJS and ES Module default exports
const UserModel = require('./user-service/models/User');
const User = UserModel.default || UserModel;

// Load env vars
dotenv.config();

const seedUsers = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('--- Starting Database Seeding ---');
    
    // 0. Clear existing users (As requested for Single Admin enforcement)
    await User.deleteMany({});
    console.log('🗑️  All existing users removed.');

    // 1. Seed Admin
    const adminEmail = 'admin@my.sliit.lk';
    const adminExists = await User.findOne({ universityEmail: adminEmail });

    if (!adminExists) {
      await User.create({
        firstName: 'System',
        lastName: 'Admin',
        faculty: 'Administration',
        universityEmail: adminEmail,
        password: 'password123',
        confirmPassword: 'password123',
        role: 'admin'
      });
      console.log('✅ Single Admin user created: admin@my.sliit.lk / password123');
    }

    // 2. Seed Regular Student User
    const studentEmail = 'student@my.sliit.lk';
    const studentExists = await User.findOne({ universityEmail: studentEmail });

    if (!studentExists) {
      await User.create({
        firstName: 'Nethmi',
        lastName: 'Perera',
        faculty: 'Computing',
        universityEmail: studentEmail,
        password: 'password123',
        confirmPassword: 'password123',
        role: 'user'
      });
      console.log('✅ Student user created: student@my.sliit.lk / password123');
    } else {
      console.log('ℹ️ Student user already exists.');
    }

    console.log('--- Seeding Completed Successfully ---');
    process.exit();

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

seedUsers();
