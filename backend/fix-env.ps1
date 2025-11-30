@"
# MongoDB Configuration
MONGODB_URI=mongodb+srv://jhonnyfader96:YOUR_PASSWORD_HERE@cluster0.vztvgja.mongodb.net/washsync?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=washsync-super-secret-jwt-key-change-this-in-production-2024
JWT_EXPIRES_IN=7d

# OpenWeatherMap API
OPENWEATHER_API_KEY=494ee91495b022ec74fb1e419bad73a8
OPENWEATHER_CITY=Bengaluru
OPENWEATHER_UNITS=metric

# Gemini AI Configuration
GEMINI_API_KEY=AIzaSyDmGnP9-UNsJ71EjxTUYx8t_V3jLGIkfbY

# Server Configuration
PORT=5000
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding utf8 -NoNewline
Write-Host "✅ .env file created successfully!"
