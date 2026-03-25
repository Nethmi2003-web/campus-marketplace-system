const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Item = require('./item-management/models/Item');
const User = require('./user-service/models/User');

dotenv.config();

const seedItems = async () => {
  try {
    await connectDB();

    // Handle both CommonJS and ES Module default exports
    const StudentUser = User.default || User;

    // Find a student user to be the seller
    const student = await StudentUser.findOne({ universityEmail: 'student@my.sliit.lk' });

    if (!student) {
      console.log('❌ Student user not found. Please run seedUsers.js first.');
      process.exit(1);
    }

    // Clear existing items
    await Item.deleteMany();
    console.log('🗑️ Existing items cleared.');

    const mockItems = [
      {
        title: "Thermodynamics 8th Edition",
        description: "Standard engineering textbook, essential for ME students. Good condition with some highlights.",
        price: 3500,
        category: "Books",
        condition: "Used",
        imageUrl: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?q=80&w=500&auto=format&fit=crop",
        seller: student._id,
        stockQuantity: 10,
        status: 'available'
      },
      {
        title: "Logitech G502 Hero Mouse",
        description: "High performance wired gaming mouse. 25K DPI sensor, RGB lighting. Barely used.",
        price: 12000,
        category: "Electronics",
        condition: "Like New",
        imageUrl: "https://images.unsplash.com/photo-1527443195645-1133e7d2bb81?q=80&w=500&auto=format&fit=crop",
        seller: student._id,
        stockQuantity: 2,
        status: 'available'
      },
      {
        title: "SLIIT Lab Coat (Size M)",
        description: "Official white lab coat required for chemistry and physics labs. Clean and ironed.",
        price: 1500,
        category: "Lab Equipment",
        condition: "Used",
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=500&auto=format&fit=crop",
        seller: student._id,
        stockQuantity: 10,
        status: 'available'
      },
      {
        title: "Casio fx-991EX Calculator",
        description: "ClassWiz scientific calculator, standard for all SLIIT exams. Perfect working condition.",
        price: 4500,
        category: "Electronics",
        condition: "Like New",
        imageUrl: "https://images.unsplash.com/photo-1628113310803-aa1377800094?q=80&w=500&auto=format&fit=crop",
        seller: student._id,
        stockQuantity: 10,
        status: 'available'
      },
      {
        title: "Python Programming Coursework Notes",
        description: "Handwritten and printed notes covering all 12 weeks of IT1010 module. Very helpful for finals.",
        price: 800,
        category: "Books",
        condition: "Used",
        imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500&auto=format&fit=crop",
        seller: student._id,
        stockQuantity: 5,
        status: 'available'
      }
    ];

    await Item.insertMany(mockItems);
    console.log('✅ Mock items seeded successfully!');
    
    process.exit();
  } catch (error) {
    console.error('❌ Error seeding items:', error);
    process.exit(1);
  }
};

seedItems();
