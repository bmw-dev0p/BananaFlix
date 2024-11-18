import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || '');

    console.log('Database connected.');

    // Clear existing users
    await User.deleteMany({});
    console.log('Existing users cleared.');

    // Seed new users
    const users = [
      {
        username: 'banana1',
        email: 'banana1@banana.com',
        password: await bcrypt.hash('banana1', 10),
        age: 15,
      },
      {
        username: 'banana2',
        email: 'banana2@banana.com',
        password: await bcrypt.hash('banana2', 10),
        age: 20,
      },
    ];

    await User.insertMany(users);
    console.log('Test users seeded.');

    // Close the database connection
    mongoose.connection.close();
    console.log('Database connection closed.');
  } catch (error) {
    console.error('Error seeding users:', error);
    process.exit(1); // Exit with failure
  }
};

seedUsers();
