require('dotenv').config();
const mongoose = require('mongoose');
const Notification = require('./models/Notification');
const User = require('./models/User');

async function testNotification() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Find the admin user (or any user)
        const user = await User.findOne({ email: 'admin@washsync.com' });

        if (!user) {
            console.log('❌ No user found. Please create a user first.');
            process.exit(1);
        }

        console.log(`Found user: ${user.name} (${user.email})`);

        // Create a test notification
        const notification = await Notification.create({
            user: user._id,
            message: 'Test notification! Your wash is complete! 🎉',
            type: 'wash_complete'
        });

        console.log('✅ Test notification created successfully!');
        console.log('-----------------------------------');
        console.log(`Notification ID: ${notification._id}`);
        console.log(`Message: ${notification.message}`);
        console.log(`Type: ${notification.type}`);
        console.log(`Created: ${notification.createdAt}`);
        console.log('-----------------------------------');
        console.log('👉 Check your notification bell in the app!');

        // Count total notifications for this user
        const count = await Notification.countDocuments({ user: user._id });
        console.log(`\nTotal notifications for ${user.name}: ${count}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

testNotification();
