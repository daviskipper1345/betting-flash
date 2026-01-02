# 🎰 BETTING FLASH - Sports Betting & Casino Platform

A production-grade sports betting and casino platform with luxury neon UI, full admin control, and manual financial settlement.

## 🎯 Features

### Core Functionality
- **Sports Betting**: Real matches with live odds, multiple markets (1X2, Over/Under, etc.)
- **Casino Games**: 5 admin-controlled games (Locked Money, Slots, Crash, Dice, Spin Wheel)
- **Virtual Games**: Admin-created tournaments with custom timelines
- **User Wallets**: Main, Bonus, and Withdrawable balances
- **Manual Settlements**: No automatic payments - admin controls everything
- **Promo Codes**: 500% first-deposit bonuses with configurable withdrawal rules

### Admin Features
- User management (freeze/unfreeze accounts)
- Balance editing
- Deposit/withdrawal approval
- Casino game outcome control
- Virtual game timeline management
- Admin logs and analytics

### UI Theme
- Luxury neon casino aesthetic
- Colors: #0B0F14 (bg), #00FF7F (neon green), #FFD700 (gold)
- Dark mode default
- Mobile-first responsive design

## 📁 Project Structure

```
betting-flash/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── models/            # MongoDB schemas
│   │   ├── routes/            # API endpoints
│   │   ├── controllers/       # (ready for expansion)
│   │   ├── middleware/        # Auth, error handling
│   │   ├── config/            # Database config
│   │   ├── utils/             # Helpers
│   │   └── server.js          # Express app
│   ├── package.json
│   └── .env.example
├── frontend/                   # React/Vite app
│   ├── src/
│   │   ├── pages/             # Home, Betting, Casino, Wallet, Account, Admin
│   │   ├── components/        # Reusable UI components
│   │   ├── api.js             # API client
│   │   ├── store.js           # Zustand state management
│   │   ├── App.jsx            # Main app
│   │   └── index.css          # Global styles
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- MongoDB Atlas account (free tier available)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   npm install
   ```

2. **Create .env file**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/betting-flash
   JWT_SECRET=your_super_secret_key_here
   ADMIN_EMAIL=bettingflash62@gmail.com
   ADMIN_BANK_ACCOUNT=1234567890
   ```

4. **Start backend server**
   ```bash
   npm run dev
   ```
   Backend runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:5173`

## 📊 Database Models

### User
- fullName, phone, email, password (hashed)
- bankAccount, country
- isAdmin, isFrozen
- promoCode reference

### Wallet
- mainBalance, bonusBalance, withdrawableBalance
- totalWins, totalLosses

### Bet
- userId, type (SPORTS/CASINO/VIRTUAL)
- stake, potentialWinning, actualWinning
- status (OPEN/WON/LOST/VOID/POSTPONED)
- selections with odds

### Deposit/Withdrawal
- userId, amount, status (PENDING/APPROVED/COMPLETED)
- admin approval tracking

### CasinoGame
- userId, gameType, stake, outcome
- Admin-controlled results

### VirtualGame
- homeTeam, awayTeam, timeline, finalScore
- Admin-created matches

## 🔐 Authentication

- JWT-based authentication
- Token stored in localStorage
- Protected routes via `authMiddleware`
- Admin routes via `adminMiddleware`

## 💳 Deposit & Withdrawal Rules

**Deposit Process:**
1. User enters amount → displayed to be sent to admin bank
2. User makes transfer externally
3. Admin approves → balance updated
4. Promo bonus applied (optional)

**Withdrawal Rules:**
- Without promo code: minimum 2 settled bets
- With promo code: minimum 1 settled bet
- Casino/Virtual bets count as settled bets
- Admin must approve and mark as COMPLETED

## 🎮 Casino Games

1. **Locked Money** - Card-based game
2. **Turn Your Life Around** - Spin wheel
3. **Crazy Slots** - Classic slots
4. **Betting Flash 4** - Crash game
5. **Roll Dice** - Dice rolling

Admin controls all outcomes after game starts.

## 📊 API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/profile`

### Wallet
- `GET /api/wallet`
- `GET /api/wallet/balance`

### Deposits
- `POST /api/deposits/request`
- `GET /api/deposits`
- `POST /api/deposits/:id/approve` (admin)
- `POST /api/deposits/:id/reject` (admin)

### Withdrawals
- `POST /api/withdrawals/request`
- `GET /api/withdrawals`
- `POST /api/withdrawals/:id/approve` (admin)
- `POST /api/withdrawals/:id/complete` (admin)

### Betting
- `POST /api/betting/place`
- `GET /api/betting/open`
- `GET /api/betting/history`
- `POST /api/betting/:id/settle` (admin)

### Casino
- `POST /api/casino/play`
- `GET /api/casino`
- `POST /api/casino/:id/outcome` (admin)

### Admin
- `GET /api/admin/users`
- `POST /api/admin/users/:id/freeze`
- `POST /api/admin/users/:id/balance`
- `POST /api/admin/virtual-games/upload`
- `POST /api/admin/promo-codes`
- `GET /api/admin/stats`

## 🔧 Configuration Variables (To Provide)

You must provide these in your `.env` file:

```
MONGODB_URI=                    # MongoDB Atlas connection string
JWT_SECRET=                     # Random secret key for JWT
SPORTS_API_KEY=                 # (Optional) Sports data API key
SPORTS_API_URL=                 # (Optional) Sports API endpoint
ADMIN_EMAIL=                    # Admin email for alerts
ADMIN_BANK_ACCOUNT=             # Admin bank account number
ADMIN_BANK_NAME=                # Admin bank name
ADMIN_ACCOUNT_NAME=             # Admin account name
SMTP_HOST=                      # Email service host
SMTP_PORT=                      # Email service port
SMTP_USER=                      # Email sender address
SMTP_PASS=                      # Email password
```

## 📱 Mobile Responsive

- Footer navigation always visible
- Bottom margin for footer (100px)
- Touch-friendly buttons
- Responsive grid layouts
- Works on all screen sizes

## 🎨 Neon Theme Colors

```
Primary Background:    #0B0F14
Card Background:       #151A21
Neon Green (primary):  #00FF7F
Gold (highlight):      #FFD700
Win Green:             #1AFF00
Loss Red:              #FF3B3B
Running Blue:          #1E90FF
Primary Text:          #FFFFFF
Secondary Text:        #B0B0B0
```

## 🚀 Deployment

Ready for free-tier deployment:
- Backend: Heroku, Railway, Render, Vercel
- Frontend: Vercel, Netlify, GitHub Pages
- Database: MongoDB Atlas free tier

## 📝 Notes

- No automatic settlement of finances
- All bets require admin approval to settle
- Casino outcomes are admin-controlled
- Virtual games are fully customizable
- System is scalable and modular
- Production-ready code structure

## 🤝 Support

For deployment assistance or API customization, all features are modular and can be extended.

---

**Betting Flash v1.0** - Built for production 🎰✨
