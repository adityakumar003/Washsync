# WashSync Backend Deployment Guide

## Deploy to Render (Free Tier)

### Step 1: Prepare Your Repository
1. Make sure all changes are committed and pushed to GitHub
2. Ensure `.env` is in `.gitignore` (it already is)

### Step 2: Create Render Account
1. Go to [render.com](https://render.com)
2. Sign up with your GitHub account

### Step 3: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub repository: `adityakumar003/Washsync`
3. Configure the service:
   - **Name**: `washsync-backend`
   - **Region**: Choose closest to your users
   - **Branch**: `master`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 4: Add Environment Variables
In Render dashboard, add these environment variables:

```
MONGODB_URI=mongodb+srv://jhonnyfader96_db_user:JhonnyFader96@cluster0.vztvgja.mongodb.net/?appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
PORT=5000
NODE_ENV=production
OPENWEATHER_API_KEY=494ee91495b022ec74fb1e419bad73a8
OPENWEATHER_CITY=Bengaluru
OPENWEATHER_UNITS=metric
GEMINI_API_KEY=AIzaSyA7vVkMQdN13MlQKDSFHM7_xYZrIPzO2I4
```

### Step 5: Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete (5-10 minutes)
3. Copy your backend URL (e.g., `https://washsync-backend.onrender.com`)

### Step 6: Configure Frontend in Vercel
1. Go to Vercel dashboard → Your project → Settings → Environment Variables
2. Add new variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
   - **Environments**: Production, Preview, Development
3. Redeploy your frontend

## Alternative: Deploy to Railway

### Quick Deploy
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select `adityakumar003/Washsync`
4. Add environment variables (same as above)
5. Set root directory to `backend`
6. Deploy!

## Testing Your Deployment

After deployment, test these endpoints:
- `GET https://your-backend-url.onrender.com/api/branches/active` - Should return branches
- `POST https://your-backend-url.onrender.com/api/auth/login` - Should accept login

## Important Notes

> **Free Tier Limitations**:
> - Render free tier spins down after 15 minutes of inactivity
> - First request after spin-down takes 30-60 seconds
> - Consider upgrading for production use

> **CORS Configuration**:
> - The backend already has CORS enabled for all origins
> - If you need to restrict it, update `server.js`
