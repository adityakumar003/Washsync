// Quick MongoDB Connection Test
require('dotenv').config();
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB Connection...\n');
console.log('Connection String:', process.env.MONGODB_URI?.replace(/\/\/.*:.*@/, '//<credentials>@') || 'NOT FOUND');
console.log('');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ SUCCESS! MongoDB is connected!');
        console.log('📊 Connection Details:');
        console.log('   - Database:', mongoose.connection.name);
        console.log('   - Host:', mongoose.connection.host);
        console.log('   - Port:', mongoose.connection.port);
        console.log('\n🎉 Your database is ready to use!');
        process.exit(0);
    })
    .catch((error) => {
        console.log('❌ FAILED! Could not connect to MongoDB\n');
        console.log('Error:', error.message);
        console.log('\n📋 Common Issues:');
        console.log('   1. MongoDB not installed/running locally');
        console.log('   2. Wrong connection string in .env file');
        console.log('   3. Network/firewall blocking connection');
        console.log('   4. MongoDB Atlas: IP not whitelisted');
        console.log('\n💡 Solution: Check MONGODB_SETUP.md for setup instructions');
        process.exit(1);
    });

// Timeout after 10 seconds
setTimeout(() => {
    console.log('⏱️  Connection timeout - MongoDB not responding');
    process.exit(1);
}, 10000);
