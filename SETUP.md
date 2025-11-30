# WashSync - Quick Setup Guide

## ⚡ Quick Start (5 minutes)

### Step 1: Get API Keys (Required)

#### OpenWeatherMap API Key (FREE)
1. Go to https://openweathermap.org/api
2. Click "Sign Up" (top right)
3. Create a free account
4. Go to "API keys" tab
5. Copy your API key

#### Google Gemini API Key (FREE)
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy your API key

### Step 2: Configure Backend

1. Open `backend/.env.example`
2. Copy the file and rename to `backend/.env`
3. Edit `backend/.env` and add your API keys:

```env
# Keep these as is
MONGODB_URI=mongodb://localhost:27017/washsync
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development

# Add your OpenWeatherMap API key here
OPENWEATHER_API_KEY=paste-your-key-here
OPENWEATHER_CITY=London  # Change to your city
OPENWEATHER_UNITS=metric

# Add your Gemini API key here
GEMINI_API_KEY=paste-your-key-here
```

### Step 3: Configure Frontend

1. Open `frontend/.env.local.example`
2. Copy the file and rename to `frontend/.env.local`
3. Content should be:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### Step 4: Start MongoDB

**Option A: MongoDB as Windows Service (Recommended)**
- MongoDB should already be running if installed as a service
- Check by opening MongoDB Compass or running: `mongosh`

**Option B: Start MongoDB Manually**
```bash
mongod
```

### Step 5: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd c:\Coding\washsync\backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 WashSync server running on port 5000
[CRON] Timer check job initialized
```

**Terminal 2 - Start Frontend:**
```bash
cd c:\Coding\washsync\frontend
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
```

### Step 6: Open the App

Open your browser and go to: **http://localhost:3000**

## 🎯 First Time Usage

### Create Your Account
1. Click "Register here"
2. Fill in your details
3. Click "Create Account"

### Create Admin Account (Optional)

After registering, make yourself admin:

**Using MongoDB Compass:**
1. Open MongoDB Compass
2. Connect to `mongodb://localhost:27017`
3. Select `washsync` database
4. Click `users` collection
5. Find your user and click edit
6. Change `isAdmin: false` to `isAdmin: true`
7. Save

**Using Command Line:**
```bash
mongosh washsync
db.users.updateOne({email: "your-email@example.com"}, {$set: {isAdmin: true}})
```

### Add Washing Machines (Admin Only)
1. Login with admin account
2. Click the ⚙️ Settings icon (top right)
3. Click "Add Machine"
4. Enter machine name (e.g., "Washer A")
5. Click "Add"

## 🎨 Features to Try

### As a User:
- ✅ View all machines on dashboard
- ✅ Start a wash (click "Start Wash" → enter duration → Start)
- ✅ Watch live countdown timer
- ✅ Join queue for busy machines
- ✅ Check notifications (🔔 bell icon)
- ✅ View weather and AI wash recommendations

### As an Admin:
- ✅ Add/delete machines
- ✅ Mark machines as maintenance
- ✅ View all users
- ✅ Force release machines

## 🔧 Troubleshooting

### Backend won't start
- **MongoDB not running**: Start MongoDB service or run `mongod`
- **Port 5000 in use**: Change PORT in backend/.env
- **Missing API keys**: Check backend/.env has valid keys

### Frontend won't start
- **Port 3000 in use**: Next.js will offer port 3001
- **Can't connect to backend**: Verify backend is running on port 5000

### Weather/AI not working
- **Check API keys**: Verify keys are correct in backend/.env
- **OpenWeather city**: Try changing OPENWEATHER_CITY to your city name
- **Gemini quota**: Free tier has rate limits, wait a minute and try again

### Notifications not appearing
- **Cron job**: Check backend terminal for "[CRON]" messages
- **Timer expired**: Wait for timer to expire (or set short duration like 1 minute)
- **Refresh**: Click the refresh icon on dashboard

## 📱 Testing the Full Flow

1. **Register two accounts** (use different emails)
2. **Make one admin** (using MongoDB)
3. **Add 2-3 machines** (as admin)
4. **Start a wash** (as user 1) with 2 minute duration
5. **Join queue** (as user 2) on the same machine
6. **Wait 2 minutes** - Watch the magic happen:
   - Timer counts down
   - Machine auto-releases
   - User 1 gets "wash complete" notification
   - User 2 gets "your turn" notification
   - Queue automatically updates

## 🎉 You're All Set!

Enjoy using WashSync! The system will automatically manage timers, queues, and notifications.

---

**Need Help?** Check the main README.md for detailed API documentation and architecture details.
