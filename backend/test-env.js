require('dotenv').config();

console.log('=== Environment Variables Check ===\n');

console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
console.log('MONGODB_URI length:', process.env.MONGODB_URI ? process.env.MONGODB_URI.length : 0);
console.log('MONGODB_URI starts with:', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'undefined');

console.log('\nOther variables:');
console.log('PORT:', process.env.PORT);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);

console.log('\n=== Common Issues to Check ===');
console.log('1. Make sure .env file is in the backend folder');
console.log('2. No spaces around = sign');
console.log('3. No quotes around the URI');
console.log('4. Password special characters are URL-encoded');
console.log('5. Database user exists in MongoDB Atlas');
