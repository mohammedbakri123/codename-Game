#!/bin/bash

echo "═══════════════════════════════════════════════════"
echo "  🎮 كود نيمز - Codenames Game"
echo "═══════════════════════════════════════════════════"
echo ""

IP="192.168.0.114"

echo "📡 IP: $IP"
echo ""

# Kill any existing processes
echo "🧹 Cleaning up old processes..."
pkill -f "npm run dev" 2>/dev/null
npx kill-port 3001 5173 2>/dev/null
sleep 2

# Update configs
echo "📝 Updating config..."
echo "VITE_SERVER_URL=http://$IP:3001" > client/.env
echo -e "PORT=3001\nNODE_ENV=development\nCLIENT_URL=http://$IP:5173" > server/.env

# Start server
echo "🚀 Starting server..."
cd server
npm run dev > /tmp/server.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait for server
echo "⏳ Waiting for server..."
for i in {1..20}; do
    if curl -s --max-time 1 http://$IP:3001/health > /dev/null 2>&1; then
        echo "   ✅ Server ready!"
        break
    fi
    sleep 1
    echo -n "."
done

# Start client
echo ""
echo "🚀 Starting client..."
cd client
npm run dev -- --host > /tmp/client.log 2>&1 &
CLIENT_PID=$!
cd ..

# Wait for client
echo "⏳ Waiting for client..."
for i in {1..20}; do
    if curl -s --max-time 1 http://localhost:5173 > /dev/null 2>&1; then
        echo "   ✅ Client ready!"
        break
    fi
    sleep 1
    echo -n "."
done

echo ""
echo "═══════════════════════════════════════════════════"
echo "  ✅ READY!"
echo "═══════════════════════════════════════════════════"
echo ""
echo "🔗 OPEN: http://$IP:5173"
echo ""
echo "⚠️  Press Ctrl+C to stop"
echo ""

# Cleanup on exit
trap 'echo ""; echo "🛑 Stopping..."; kill $SERVER_PID $CLIENT_PID 2>/dev/null; exit' INT
wait
