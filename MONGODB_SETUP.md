# MongoDB Setup Options for WashSync

## ⚡ Quick Option: MongoDB Atlas (Cloud - FREE)

**No installation needed! Use MongoDB's free cloud database:**

### Step 1: Create Free Account
1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Choose **FREE M0 cluster**

### Step 2: Create Cluster
1. Click "Build a Database"
2. Choose **FREE Shared** tier
3. Select a cloud provider (AWS recommended)
4. Choose region closest to you
5. Click "Create Cluster" (takes 3-5 minutes)

### Step 3: Create Database User
1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Username: `washsync`
5. Password: Create a strong password (save it!)
6. User Privileges: "Read and write to any database"
7. Click "Add User"

### Step 4: Allow Network Access
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (for development)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like):
   ```
   mongodb+srv://washsync:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

### Step 6: Update Backend .env
Open `backend/.env` and replace the MONGODB_URI:

```env
# Replace this line:
MONGODB_URI=mongodb://localhost:27017/washsync

# With your Atlas connection string:
MONGODB_URI=mongodb+srv://washsync:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/washsync?retryWrites=true&w=majority
```

**That's it! No local MongoDB installation needed.**

---

## 🖥️ Alternative: Install MongoDB Locally

### For Windows:

1. **Download MongoDB**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: Windows, Latest Version (7.0+)
   - Download the MSI installer

2. **Install MongoDB**
   - Run the downloaded `.msi` file
   - Choose "Complete" installation
   - **Important**: Check "Install MongoDB as a Service"
   - Keep default settings
   - Click Install

3. **Verify Installation**
   Open PowerShell and run:
   ```powershell
   Get-Service MongoDB
   ```
   Should show MongoDB service running

4. **Add to PATH (if needed)**
   If `mongod` still not found:
   - Add to System PATH: `C:\Program Files\MongoDB\Server\7.0\bin`
   - Restart PowerShell

5. **Use in WashSync**
   Keep the default in `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/washsync
   ```

---

## ✅ Which Option Should You Choose?

### Choose **MongoDB Atlas** (Cloud) if:
- ✅ You want the quickest setup (5 minutes)
- ✅ You don't want to install software
- ✅ You want your data accessible from anywhere
- ✅ You're okay with internet dependency

### Choose **Local MongoDB** if:
- ✅ You want to work offline
- ✅ You prefer local development
- ✅ You want full control over the database
- ✅ You're comfortable installing software

---

## 🚀 After Setup

Once MongoDB is configured (either option), start your backend:

```bash
cd backend
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 WashSync server running on port 5000
```

Then you're ready to use WashSync!
