require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGemini() {
    console.log('🔍 Testing Gemini API Configuration...\n');

    // Check if API key exists
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('❌ GEMINI_API_KEY not found in .env file');
        console.log('Please add: GEMINI_API_KEY=your_api_key_here');
        process.exit(1);
    }

    console.log('✅ API Key found:', apiKey.substring(0, 10) + '...' + apiKey.substring(apiKey.length - 4));

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        console.log('\n🤖 Sending test prompt to Gemini...');
        const result = await model.generateContent('Say "Hello, WashSync!" in one sentence.');
        const response = await result.response;
        const text = response.text();

        console.log('\n✅ SUCCESS! Gemini API is working!');
        console.log('📝 Response:', text);
        console.log('\n🎉 Your Gemini API is configured correctly!');

    } catch (error) {
        console.error('\n❌ ERROR:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Verify your API key at: https://makersuite.google.com/app/apikey');
        console.log('2. Make sure the API key is enabled for Gemini API');
        console.log('3. Check if you have billing enabled (required for some models)');
        process.exit(1);
    }
}

testGemini();
