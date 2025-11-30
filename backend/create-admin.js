require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function createAdmin() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Admin credentials
        const adminData = {
            name: 'Admin',
            email: 'admin@washsync.com',
            password: 'admin123', // Change this to a secure password
            isAdmin: true
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('⚠️  Admin user already exists!');
            console.log(`Email: ${existingAdmin.email}`);
            console.log(`Name: ${existingAdmin.name}`);
            console.log(`Is Admin: ${existingAdmin.isAdmin}`);
            process.exit(0);
        }

        // Create admin user
        const admin = new User(adminData);
        await admin.save();

        console.log('✅ Admin user created successfully!');
        console.log('-----------------------------------');
        console.log(`Email: ${adminData.email}`);
        console.log(`Password: ${adminData.password}`);
        console.log(`Name: ${adminData.name}`);
        console.log(`Is Admin: ${adminData.isAdmin}`);
        console.log('-----------------------------------');
        console.log('⚠️  Please change the password after first login!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        process.exit(1);
    }
}

createAdmin();
