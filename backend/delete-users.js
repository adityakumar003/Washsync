require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function deleteUsers() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Get all users
        const users = await User.find();
        console.log(`\nFound ${users.length} users:`);
        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.isAdmin ? 'Admin' : 'User'}`);
        });

        // Delete all non-admin users
        const result = await User.deleteMany({ isAdmin: false });
        console.log(`\n✅ Deleted ${result.deletedCount} non-admin user(s)`);

        // Show remaining users
        const remaining = await User.find();
        console.log(`\nRemaining users: ${remaining.length}`);
        remaining.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.isAdmin ? 'Admin' : 'User'}`);
        });

        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

deleteUsers();
