# Network Connection Guide - Connect Multiple Devices

## Quick Start (Easiest Method)

### Step 1: Find Your Computer's IP Address

**Windows:**
```cmd
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)
```

**Mac/Linux:**
```bash
ifconfig
# or
ip addr show
# Look for "inet" (e.g., 192.168.1.100)
```

**Example IP:** `192.168.1.100` (yours will be different)

### Step 2: Update Configuration Files

**Edit `server/.env`:**
```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://192.168.1.100:5173  # Replace with YOUR IP
```

**Edit `client/.env`:**
```env
VITE_SERVER_URL=http://192.168.1.100:3001  # Replace with YOUR IP
```

### Step 3: Start the Game

**Terminal 1 - Start Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Client (with host flag):**
```bash
cd client
npm run dev -- --host
```

The `--host` flag allows other devices to connect.

### Step 4: Connect from Other Devices

On phones, tablets, or other computers:

1. Open web browser (Chrome, Safari, etc.)
2. Enter: `http://192.168.1.100:5173` (use YOUR IP)
3. Enter your name and join a room!

---

## Method 2: Using ngrok (For Remote Testing)

Great for playing with friends over the internet.

### Install ngrok

**Mac (with Homebrew):**
```bash
brew install ngrok
```

**Windows:**
1. Download from https://ngrok.com/download
2. Extract and add to PATH

### Start Tunneling

**1. Start your local server:**
```bash
cd server
npm run dev
```

**2. Start ngrok tunnel for server:**
```bash
ngrok http 3001
```
Copy the HTTPS URL (e.g., `https://abc123.ngrok.io`)

**3. Update client environment:**
```bash
# client/.env
VITE_SERVER_URL=https://abc123.ngrok.io
```

**4. Rebuild and restart client:**
```bash
cd client
npm run build
npm run dev -- --host
```

**5. Start ngrok for client:**
```bash
ngrok http 5173
```

Share the client ngrok URL with friends!

---

## Method 3: Deploy to Internet (Production)

### Deploy Server to Railway

1. Create account at https://railway.app
2. Connect GitHub repository
3. Select the `server` folder
4. Add environment variables:
   - `PORT=3001`
   - `NODE_ENV=production`
   - `CLIENT_URL=https://your-app.vercel.app`
5. Get your server URL (e.g., `https://codenames-server.up.railway.app`)

### Deploy Client to Vercel

1. Create account at https://vercel.com
2. Connect GitHub repository
3. Select the `client` folder
4. Add environment variable:
   - `VITE_SERVER_URL=https://codenames-server.up.railway.app`
5. Deploy!

---

## Troubleshooting

### Other Device Can't Connect

**1. Same Wi-Fi Network?**
- All devices must be on the same network
- Check Wi-Fi name on all devices

**2. Firewall Blocking?**

**Windows:**
- Control Panel > Windows Defender Firewall
- Allow an app > Find Node.js > Check Private and Public

**Mac:**
- System Preferences > Security & Privacy > Firewall
- Turn off temporarily for testing

**3. Check IP Address**
```bash
# Make sure you're using the correct IP
# It should start with 192.168.x.x or 10.0.x.x
```

### CORS Errors

In `server/src/index.js`, update CORS settings:
```javascript
app.use(cors({
  origin: true,  // Allow all in development
  credentials: true
}));
```

### Socket.IO Connection Failed

Update `client/src/services/socketService.js`:
```javascript
const socket = io('http://192.168.1.100:3001', {
  transports: ['websocket', 'polling'],
  withCredentials: false
});
```

### Connection Refused

1. Make sure server is running
2. Check if port 3001 is not in use:
   ```bash
   # Windows
   netstat -ano | findstr :3001
   
   # Mac/Linux
   lsof -i :3001
   ```

---

## Testing Checklist

- [ ] All devices on same Wi-Fi
- [ ] Server running on host computer
- [ ] Client running with `--host` flag
- [ ] Correct IP address in .env files
- [ ] Firewall allows Node.js
- [ ] VPN disabled (if applicable)

---

## Quick Reference

```bash
# Find IP
ipconfig              # Windows
ifconfig | grep inet  # Mac
ip addr show          # Linux

# Start for network play
./start-local.sh      # Using the provided script
# OR manually:
cd server && npm run dev
cd client && npm run dev -- --host

# Access URLs
Local:     http://localhost:5173
Network:   http://YOUR_IP:5173
```

---

## Common Local IPs

- `192.168.1.xxx` - Most common home networks
- `192.168.0.xxx` - Some routers
- `10.0.0.xxx` - Some corporate networks

Replace `xxx` with your specific number (usually 2-254).

Happy playing! 🎮
