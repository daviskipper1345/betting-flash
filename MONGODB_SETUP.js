#!/usr/bin/env node

/**
 * MongoDB IP Whitelisting Helper
 * 
 * Your MongoDB Connection String requires IP Whitelisting for security.
 * 
 * TO FIX THE CONNECTION:
 * 
 * 1. Go to: https://cloud.mongodb.com/
 * 2. Login with your MongoDB account
 * 3. Click on your "Cluster0"
 * 4. Go to "Network Access" tab
 * 5. Click "Add IP Address"
 * 6. Choose ONE option:
 *    - Option A: Add your current IP (more secure)
 *      Get your IP from: https://www.whatismyip.com/
 *    - Option B: Allow 0.0.0.0/0 (all IPs - for development only)
 * 7. Click "Confirm"
 * 
 * Your MongoDB Details:
 * ─────────────────────────────────────────────────────
 * Connection String:
 * mongodb+srv://admin:BHMzQbftRl6Fvwyt@cluster0.mongodb.net/bettingflash?retryWrites=true&w=majority
 * 
 * Username: admin
 * Password: BHMzQbftRl6Fvwyt
 * Cluster: cluster0
 * Database: bettingflash
 * ─────────────────────────────────────────────────────
 * 
 * After whitelisting, restart the backend:
 * cd backend
 * npm run dev
 * 
 * You should see: ✅ MongoDB connected: cluster0.mongodb.net
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║        BETTING FLASH - MongoDB Connection Setup              ║
╚══════════════════════════════════════════════════════════════╝

⚠️  CONNECTION ERROR: MongoDB requires IP Whitelisting

Your current configuration:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔑 Connection String:
   mongodb+srv://admin:BHMzQbftRl6Fvwyt@cluster0.mongodb.net/bettingflash

🏢 Cluster: cluster0
📦 Database: bettingflash

✅ QUICK FIX (2 MINUTES):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Step 1: Go to MongoDB Cloud
   → https://cloud.mongodb.com/

Step 2: Click "Cluster0" → "Network Access"

Step 3: Click "Add IP Address"

Step 4: Choose ONE:
   Option A (Secure): Add your IP
   - Get IP: https://www.whatismyip.com/
   - Enter in MongoDB Atlas
   
   Option B (Dev only): Allow all IPs
   - Enter: 0.0.0.0/0
   - NOT recommended for production

Step 5: Click "Confirm"

Step 6: Restart backend:
   cd backend
   npm run dev

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ Your system will work immediately after whitelisting!
`);
