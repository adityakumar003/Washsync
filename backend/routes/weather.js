const express = require('express');
const router = express.Router();
const axios = require('axios');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { auth } = require('../middleware/auth');

// Initialize Gemini AI
let genAI;
if (process.env.GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

// ─── In-Memory Cache ────────────────────────────────────────────────────────
// Cache lives in Render server memory — persists across all user requests.
// Automatically expires after 15 minutes, triggering a fresh API call.
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

const weatherCache = { data: null, timestamp: 0 };
const aiCache = { data: null, timestamp: 0 };

const isCacheValid = (cache) => {
    return cache.data !== null && (Date.now() - cache.timestamp) < CACHE_TTL;
};

const getCacheAge = (cache) => {
    const ageMs = Date.now() - cache.timestamp;
    return Math.floor(ageMs / 1000); // age in seconds
};
// ────────────────────────────────────────────────────────────────────────────

// Get weather data
router.get('/weather', auth, async (req, res) => {
    try {
        // Return cached data if still valid
        if (isCacheValid(weatherCache)) {
            console.log(`[CACHE HIT] /weather — served from cache (age: ${getCacheAge(weatherCache)}s)`);
            return res.json(weatherCache.data);
        }

        const apiKey = process.env.OPENWEATHER_API_KEY;
        const city = process.env.OPENWEATHER_CITY || 'London';
        const units = process.env.OPENWEATHER_UNITS || 'metric';

        if (!apiKey) {
            return res.status(500).json({ error: 'Weather API key not configured' });
        }

        console.log('[CACHE MISS] /weather — fetching fresh data from OpenWeatherMap...');

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`
        );

        const weatherData = {
            temperature: response.data.main.temp,
            humidity: response.data.main.humidity,
            description: response.data.weather[0].description,
            icon: response.data.weather[0].icon,
            windSpeed: response.data.wind.speed,
            clouds: response.data.clouds.all,
            city: response.data.name
        };

        // Store in cache
        weatherCache.data = weatherData;
        weatherCache.timestamp = Date.now();
        console.log('[CACHE SET] /weather — cached for 15 minutes');

        res.json(weatherData);
    } catch (error) {
        console.error('Weather API error:', error.message);

        // If cache has stale data, return it rather than failing completely
        if (weatherCache.data) {
            console.log('[CACHE STALE] /weather — API failed, returning stale cached data');
            return res.json(weatherCache.data);
        }

        res.status(500).json({ error: 'Failed to fetch weather data' });
    }
});

// Get AI wash recommendation
router.get('/ai-recommendation', auth, async (req, res) => {
    try {
        // Return cached AI recommendation if still valid
        if (isCacheValid(aiCache)) {
            console.log(`[CACHE HIT] /ai-recommendation — served from cache (age: ${getCacheAge(aiCache)}s)`);
            return res.json(aiCache.data);
        }

        if (!genAI) {
            return res.status(500).json({ error: 'Gemini API key not configured' });
        }

        // First get weather data
        const apiKey = process.env.OPENWEATHER_API_KEY;
        const city = process.env.OPENWEATHER_CITY || 'London';
        const units = process.env.OPENWEATHER_UNITS || 'metric';

        if (!apiKey) {
            return res.status(500).json({ error: 'Weather API key not configured' });
        }

        console.log('[CACHE MISS] /ai-recommendation — fetching fresh data from OWM + Gemini...');

        // Get current weather
        const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${units}&appid=${apiKey}`
        );

        // Get forecast for next few hours
        const forecastResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=${units}&appid=${apiKey}`
        );

        const currentWeather = weatherResponse.data;
        const forecast = forecastResponse.data.list.slice(0, 3); // Next 9 hours

        // Prepare weather summary for AI
        const weatherSummary = `
Current Weather in ${currentWeather.name}:
- Temperature: ${currentWeather.main.temp}°C
- Humidity: ${currentWeather.main.humidity}%
- Conditions: ${currentWeather.weather[0].description}
- Wind Speed: ${currentWeather.wind.speed} m/s
- Cloud Cover: ${currentWeather.clouds.all}%

Forecast for next 9 hours:
${forecast.map((f, i) => `
  ${i * 3} hours: ${f.weather[0].description}, Temp: ${f.main.temp}°C, Rain probability: ${f.pop * 100}%
`).join('')}
    `;

        // Get AI recommendation
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Based on the following weather data, provide a brief, friendly recommendation (2-3 sentences max) about whether it's a good time to do laundry. Consider drying conditions, rain probability, humidity, and temperature. Be concise and helpful.

${weatherSummary}

Provide only the recommendation text, no additional formatting or labels.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const recommendation = response.text();

        const responseData = {
            recommendation: recommendation.trim(),
            weather: {
                temperature: currentWeather.main.temp,
                humidity: currentWeather.main.humidity,
                description: currentWeather.weather[0].description,
                icon: currentWeather.weather[0].icon
            }
        };

        // Store in cache
        aiCache.data = responseData;
        aiCache.timestamp = Date.now();
        console.log('[CACHE SET] /ai-recommendation — cached for 15 minutes');

        res.json(responseData);
    } catch (error) {
        console.error('AI recommendation error:', error.message);

        // If cache has stale data, return it rather than the generic fallback
        if (aiCache.data) {
            console.log('[CACHE STALE] /ai-recommendation — API failed, returning stale cached data');
            return res.json(aiCache.data);
        }

        // Fallback recommendation if AI fails and no cache exists
        res.json({
            recommendation: "Weather data is currently unavailable. Please check back later for personalized wash recommendations.",
            weather: null
        });
    }
});

module.exports = router;
