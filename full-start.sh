#!/bin/bash

echo "═══════════════════════════════════════════════"
echo "  🧪 STARTING WITH FULL DEBUGGING"
echo "═══════════════════════════════════════════════"
echo ""

IP="192.168.0.114"

echo "📡 IP: $IP"
echo ""

# Kill old processes
echo "1️⃣ Cleaning up..."
pkill -f "npm run dev" 2>/dev/null
npx kill-port 3001 5173 2>/dev/null
sleep 2

# Clear cache
echo "2️⃣ Clearing cache..."
rm -rf client/node_modules/.vite 2>/dev/null

# Update configs
echo "3️⃣ Setting configs..."
echo "VITE_SERVER_URL=http://$IP:3001" > client/.env
echo -e "PORT=3001\nNODE_ENV=development\nCLIENT_URL=http://$IP:5173" > server/.env

# Start server
echo "4️⃣ Starting server..."
cd server
npm run dev > /tmp/server-full.log 2>&1 &
SERVER_PID=$!
cd ..

# Wait for server
echo "⏳ Waiting for server..."
MAX_WAIT=30
WAIT_COUNT=0
while [ $WAIT_COUNT -lt $MAX_WAIT ]; do
    if curl -s --max-time 2 http://$IP:3001/health > /dev/null 2>&1; then
        echo "   ✅ Server ready! (${WAIT_COUNT}s)"
        SERVER_READY=true
        break
    fi
    WAIT_COUNT=$((WAIT_COUNT + 1))
    sleep 1
    echo -n "."
done

if [ "$SERVER_READY" = true ]; then
    echo ""
    echo "✅ Server is running!"
    
    # Start client
    echo ""
    echo "5️⃣ Starting client..."
    cd client
    npm run dev -- --host > /tmp/client-full.log 2>&1 &
    CLIENT_PID=$!
    cd ..
    
    sleep 3
    
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "  🎮 EVERYTHING IS RUNNING!"
    echo "═════════════════════════════════════════════════════"
    echo ""
    echo "🔗 URLs:"
    echo "   Local:    http://localhost:5173"
    echo "   Network:  http://$IP:5173"
    echo ""
    echo "📱 TEST:"
    echo "   1. Open http://localhost:5173 in browser"
    echo "   2. Join a room and wait"
    echo "   3. Open http://$IP:5173 on another device"
    echo "   4. Join same room"
    echo "   5. See if both devices show the same room"
    echo ""
    echo "📊 Debug:"
    echo "   Server log: cat /tmp/server-full.log"
    echo "   Client log: cat /tmp/client-full.log"
    echo ""
    echo "⚠️  Press Ctrl+C to stop"
    echo ""
    
    # Monitor logs
    trap 'echo ""; echo "🛑 Stopping..."; kill $SERVER_PID $CLIENT_PID 2>/dev/null; echo "✅ Stopped"; exit' INT
    tail -f /tmp/server-full.log /tmp/client-full.log 2>/dev/null || wait
else
    echo ""
    echo "❌ Server failed to start!"
    echo ""
    echo "📋 Server log:"
    cat /tmp/server-full.log | tail -30
    exit 1
fi
