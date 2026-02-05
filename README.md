# Codenames - Real-time Word Game

A real-time multiplayer word game built with React, Node.js, and Socket.IO.

## Quick Start

### Install Dependencies
```bash
npm run install:all
```

### Setup Environment
```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

### Run Development
```bash
npm run dev
```

- Server: http://localhost:3001
- Client: http://localhost:5173

## Connect Multiple Devices

### Method 1: Local Network (Easiest)

**Step 1: Find your computer's IP address**

Windows:
```cmd
ipconfig
# Look for "IPv4 Address" (e.g., 192.168.1.100)
```

Mac/Linux:
```bash
ifconfig
# or
ip addr show
# Look for "inet" (e.g., 192.168.1.100)
```

**Step 2: Update configuration files**

Edit `server/.env`:
```env
PORT=3001
NODE_ENV=development
CLIENT_URL=http://192.168.1.100:5173  # Replace with YOUR IP
```

Edit `client/.env`:
```env
VITE_SERVER_URL=http://192.168.1.100:3001  # Replace with YOUR IP
```

**Step 3: Start the game**

Terminal 1 - Server:
```bash
cd server
npm run dev
```

Terminal 2 - Client:
```bash
cd client
npm run dev -- --host
```

**Step 4: Connect from other devices**

On phones, tablets, or other computers:
1. Open browser
2. Enter: `http://192.168.1.100:5173` (use YOUR IP)
3. Play!

**See [CONNECTION_GUIDE.md](CONNECTION_GUIDE.md) for full details including ngrok and deployment options.**

## Game Rules

1. Two teams compete: Red (9 cards) vs Blue (8 cards)
2. Each team has one Spymaster and multiple Operatives
3. Spymaster sees all card colors
4. Spymaster gives one-word clue + number
5. Operatives guess words based on the clue
6. First team to reveal all their cards wins
7. Avoid the assassin card (black)!

## Project Structure

```
codenames/
├── client/     (React + Vite)
├── server/     (Node.js + Socket.IO)
└── shared/     (Pure Game Engine)
```

## Features

- Real-time multiplayer gameplay
- Room creation and joining
- Team and role selection
- Spymaster/Operative views
- Win detection
- Arabic language support

## Requirements

- Node.js 18+
- npm or yarn
- Modern web browser

## Available Scripts

```bash
# Install all dependencies
npm run install:all

# Run development (both server and client)
npm run dev

# Run server only
npm run server:dev

# Run client only
npm run client:dev

# Build for production
npm run build

# Start production server
npm start
```

## Socket Events

### Client → Server
- `JOIN_ROOM` - Join a game room
- `START_GAME` - Start a new game
- `SEND_CLUE` - Spymaster gives a clue
- `SELECT_WORD` - Operative selects a word
- `END_TURN` - End current turn

### Server → Client
- `ROOM_UPDATE` - Room state updated
- `GAME_UPDATE` - Game state updated
- `GAME_STARTED` - Game has started
- `CLUE_RECEIVED` - New clue given
- `WORD_SELECTED` - Word was selected
- `TURN_ENDED` - Turn ended
- `GAME_ENDED` - Game over
- `ERROR` - Error message

## Troubleshooting

**Can't connect from other device?**
- Make sure all devices are on same Wi-Fi
- Check firewall settings (allow Node.js)
- Verify IP address is correct
- Try disabling VPN

**CORS errors?**
Check that server allows all origins in development.

**Port already in use?**
```bash
npx kill-port 3001
```

## License

MIT
