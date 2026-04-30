const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const userModel = require('./models/user.model');

dotenv.config();

const seedAdmin = async () => {
  try {
    // Connect to Database
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    const adminEmail = 'admin@shopverse.com';
    const adminPassword = 'adminpassword123';
    const adminUsername = 'admin_user';

    // Check if admin already exists
    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }

    // Hash password using model method (same as production code)
    const hashedPassword = await userModel.hashPassword(adminPassword);

    // Create Admin
    const admin = new userModel({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('------------------------------');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
