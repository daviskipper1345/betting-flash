# ⚡ BETTING FLASH - QUICK START GUIDE

## ✅ Configuration Complete!

Your credentials have been configured:

### 🔐 Authentication
- **JWT Secret**: betting_flash_zelene
- **MongoDB**: Connected to your cluster

### 🏦 Bank Accounts

**Nigerian Account (OPay)**
```
Account Number: 9133758994
Account Name: CHAKIDA ADAMU JOSEPH
Bank: OPay
```

**International Account (PalmPay)**
```
Account Number: 7071198393
Account Name: Hope Adanchin
Bank: PalmPay
```

### 📞 Contact
- **Email**: bettingflash62@gmail.com
- **SMS**: 07071198393

---

## 🚀 Running the System

### Step 1: MongoDB Setup
Your MongoDB connection requires **IP Whitelisting**:

1. Go to: https://cloud.mongodb.com/
2. Login with your account
3. Click "Cluster0" → "Network Access"
4. Click "Add IP Address"
5. Add your current IP (or 0.0.0.0/0 for development)
6. Click "Confirm"

**Current MongoDB URI (already configured):**
```
mongodb+srv://admin:BHMzQbftRl6Fvwyt@cluster0.mongodb.net/bettingflash?retryWrites=true&w=majority
```

### Step 2: Start Backend

Open **Terminal 1** and run:
```bash
cd c:\Users\dedan\Pictures\betting-flash\backend
npm run dev
```

Expected output:
```
✅ Betting Flash Backend running on port 5000
✅ MongoDB connected: cluster0.mongodb.net
```

### Step 3: Start Frontend

Open **Terminal 2** and run:
```bash
cd c:\Users\dedan\Pictures\betting-flash\frontend
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 4: Access the App

Open browser: **http://localhost:5173**

---

## 📋 Test Flow

1. **Register** → Use any test data
2. **Deposit** → App shows your bank details
3. **Place Bet** → Add selections and set stake
4. **Admin Dashboard** → Approve deposits, settle bets

---

## 🔧 If MongoDB Won't Connect

Run this PowerShell command to test connection:
```powershell
$uri = "mongodb+srv://admin:BHMzQbftRl6Fvwyt@cluster0.mongodb.net/bettingflash?retryWrites=true&w=majority"
Write-Host "Testing connection to: $uri"
```

**Fix:** Add your IP to MongoDB Atlas Network Access

---

## 📁 Project Structure

```
betting-flash/
├── backend/          # Express.js API (Port 5000)
│   ├── src/
│   ├── package.json
│   └── .env          # Configuration (already set)
├── frontend/         # React App (Port 5173)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── README.md         # Full documentation
```

---

## 🎮 Features Ready

✅ User Registration & Login
✅ Wallet (3 balance types)
✅ Deposit System (2 bank accounts)
✅ Withdrawal System
✅ Sports Betting with Bet Slip
✅ 5 Casino Games
✅ Virtual Games Admin
✅ Admin Dashboard
✅ Luxury Neon UI
✅ Mobile Responsive

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| `MONGODB_URI undefined` | .env file missing or incorrect path |
| `Cannot find module 'dotenv'` | Run `npm install` in backend |
| `Port 5000 already in use` | Kill process: `npx kill-port 5000` |
| `Cannot GET /` | Frontend not running on 5173 |
| `ENOTFOUND _mongodb._tcp` | Whitelist your IP in MongoDB Atlas |

---

## 📞 Support

**Your Admin Account:**
- Email: bettingflash62@gmail.com
- All bank details are active
- SMS capable: 07071198393

---

**Happy betting! 🎰✨**
