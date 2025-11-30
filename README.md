# WashSync - Smart Washing Machine Management System

A full-stack web application for managing shared washing machines in PGs, hostels, and apartment complexes with intelligent automation and AI-powered recommendations.

## 🚀 Features

### User Features
- View all washing machines and their real-time status
- Occupy machines with custom wash duration
- Live countdown timer for active washes
- Join/leave queue for busy machines
- Real-time notifications for wash completion and queue updates
- Weather-based wash recommendations powered by AI
- Beautiful, responsive UI with glassmorphism design

### Admin Features
- Add and delete washing machines
- Mark machines as under maintenance
- View all registered users
- Override machine states (force release)
- Full control panel for system management

### Smart Features
- Automated timer management with cron jobs
- Queue system with automatic progression
- Weather API integration (OpenWeatherMap)
- AI-powered wash recommendations (Google Gemini)
- Real-time notifications system

## 🛠️ Tech Stack

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing
- node-cron for scheduled tasks
- OpenWeatherMap API
- Google Gemini AI API

### Frontend
- Next.js 14 (App Router)
- React 18
- TailwindCSS
- Axios for API calls
- Lucide React for icons

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- OpenWeatherMap API key (free tier available)
- Google Gemini API key

## 🔧 Installation & Setup

### 1. Clone or navigate to the project
```bash
cd c:/Coding/washsync
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/washsync
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=development

# Get your free API key from https://openweathermap.org/api
OPENWEATHER_API_KEY=your-openweathermap-api-key-here
OPENWEATHER_CITY=London
OPENWEATHER_UNITS=metric

# Get your API key from https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your-gemini-api-key-here
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env.local` file in the frontend directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Make sure MongoDB is running locally:
```bash
# Windows
mongod

# Or if using MongoDB as a service, it should already be running
```

### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## 👤 Creating an Admin User

By default, all registered users are regular users. To create an admin user:

1. Register a new account through the UI
2. Connect to MongoDB and update the user:
```javascript
// Using MongoDB Compass or mongo shell
db.users.updateOne(
  { email: "admin@example.com" },
  { $set: { isAdmin: true } }
)
```

Or use this script in MongoDB shell:
```bash
mongosh washsync
db.users.updateOne({email: "your-email@example.com"}, {$set: {isAdmin: true}})
```

## 📱 Usage

### For Users:
1. Register/Login to your account
2. View available washing machines on the dashboard
3. Click "Start Wash" on an available machine and set duration
4. Monitor your wash with the live countdown timer
5. Join queue if machine is busy
6. Receive notifications when wash completes or it's your turn
7. Check AI wash recommendations based on weather

### For Admins:
1. Login with admin account
2. Click the settings icon to access Admin Panel
3. Add new machines, delete machines, or mark as maintenance
4. View all registered users
5. Override machine states if needed

## 🔄 Cron Job System

The backend runs a cron job every minute that:
- Checks for expired wash timers
- Automatically releases machines
- Sends "wash complete" notifications
- Notifies next person in queue
- Updates queue positions

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify JWT token

### Machines
- `GET /api/machines` - Get all machines
- `POST /api/machines/:id/occupy` - Occupy a machine
- `POST /api/machines/:id/release` - Release a machine
- `POST /api/machines/:id/queue/join` - Join queue
- `POST /api/machines/:id/queue/leave` - Leave queue

### Admin (requires admin role)
- `POST /api/admin/machines` - Add new machine
- `DELETE /api/admin/machines/:id` - Delete machine
- `PATCH /api/admin/machines/:id/status` - Update machine status
- `GET /api/admin/users` - Get all users
- `POST /api/admin/machines/:id/override` - Force release machine

### Notifications
- `GET /api/notifications` - Get user notifications
- `GET /api/notifications/unread-count` - Get unread count
- `PATCH /api/notifications/:id/read` - Mark as read
- `POST /api/notifications/read-all` - Mark all as read

### Weather & AI
- `GET /api/weather/weather` - Get current weather
- `GET /api/weather/ai-recommendation` - Get AI wash recommendation

## 🎨 Design Features

- **Glassmorphism UI** - Modern frosted glass effect
- **Gradient Backgrounds** - Beautiful purple gradient theme
- **Smooth Animations** - Micro-interactions and transitions
- **Responsive Design** - Works on mobile, tablet, and desktop
- **Live Updates** - Real-time timer countdowns
- **Status Indicators** - Color-coded machine states

## 🔒 Security

- JWT-based authentication
- Passwords hashed with bcrypt
- Protected API routes
- Role-based access control (Admin/User)
- Secure token storage in localStorage

## 📝 License

MIT

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

Built with ❤️ using Next.js, Express, and MongoDB
