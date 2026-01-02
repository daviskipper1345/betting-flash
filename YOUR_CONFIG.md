# BETTING FLASH - YOUR CONFIGURATION

## Account Credentials

**JWT Secret Key:**
```
betting_flash_zelene
```

**MongoDB Connection:**
```
mongodb+srv://admin:BHMzQbftRl6Fvwyt@cluster0.mongodb.net/bettingflash?retryWrites=true&w=majority
```

---

## Bank Account Details

### Nigerian Account (OPay)
```
Account Number: 9133758994
Account Holder: CHAKIDA ADAMU JOSEPH
Bank: OPay
```

### International Account (PalmPay)
```
Account Number: 7071198393
Account Holder: Hope Adanchin
Bank: PalmPay
```

---

## Admin Contact

**Email:** bettingflash62@gmail.com
**Phone:** 07071198393

---

## MongoDB Setup Required

**⚠️ IMPORTANT: Before running the app, you MUST whitelist your IP in MongoDB Atlas**

Steps:
1. Go to https://cloud.mongodb.com/
2. Login to your account
3. Click "Cluster0" → "Network Access"
4. Click "Add IP Address"
5. Enter your IP from https://www.whatismyip.com/
6. Click "Confirm"

Alternative (development only):
- Enter 0.0.0.0/0 to allow all IPs

---

## Start the Application

**Terminal 1 - Backend:**
```bash
cd c:\Users\dedan\Pictures\betting-flash\backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd c:\Users\dedan\Pictures\betting-flash\frontend
npm run dev
```

**Open Browser:**
```
http://localhost:5173
```

---

## System Architecture

- **Frontend:** React + Vite (Port 5173)
- **Backend:** Node.js + Express (Port 5000)
- **Database:** MongoDB Atlas (Cloud)
- **Authentication:** JWT

---

## Features Ready to Use

✅ User Registration & Login
✅ Deposit System (2 bank accounts)
✅ Withdrawal System
✅ Sports Betting
✅ Casino Games (5 types)
✅ Virtual Games
✅ Admin Dashboard
✅ Wallet Management
✅ Promo Codes
✅ Luxury Neon UI
✅ Mobile Responsive

---

## Environment Variables (Already Set)

File: `backend/.env`

```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://admin:BHMzQbftRl6Fvwyt@cluster0.mongodb.net/bettingflash?retryWrites=true&w=majority
JWT_SECRET=betting_flash_zelene
JWT_EXPIRE=30d

ADMIN_EMAIL=bettingflash62@gmail.com
ADMIN_PHONE=07071198393
FRONTEND_URL=http://localhost:5173

NIGERIA_BANK_ACCOUNT=9133758994
NIGERIA_BANK_NAME=OPay
NIGERIA_ACCOUNT_NAME=CHAKIDA ADAMU JOSEPH

FOREIGN_BANK_ACCOUNT=7071198393
FOREIGN_BANK_NAME=PalmPay
FOREIGN_ACCOUNT_NAME=Hope Adanchin

SMS_PHONE=07071198393
```

---

## Next Steps

1. **Whitelist MongoDB IP** (2 minutes)
2. **Run Backend** (`npm run dev`)
3. **Run Frontend** (`npm run dev`)
4. **Test Registration & Deposit**
5. **Create Admin User** (set isAdmin: true in MongoDB)

---

**System is ready! 🎰**
