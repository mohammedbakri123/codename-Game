@echo off
chcp 65001 >nul
echo ═══════════════════════════════════════════════
echo      🎮 كود نيمز - Codenames Game
echo ═══════════════════════════════════════════════
echo.

REM Get IP address
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4"') do (
    set IP=%%a
    goto :found_ip
)
:found_ip
set IP=%IP: =%

if "%IP%"=="" (
    echo ⚠️  Could not auto-detect IP address
    echo Using localhost
    set IP=localhost
)

echo 📡 Server IP: %IP%
echo.

REM Update config files
echo 📝 Updating configuration...
echo VITE_SERVER_URL=http://%IP%:3001 > client\.env
echo PORT=3001 > server\.env
echo NODE_ENV=development >> server\.env
echo CLIENT_URL=http://%IP%:5173 >> server\.env
echo ✅ Configuration updated!
echo.

echo 🚀 Starting servers...
echo.

REM Start server in new window
echo ▶️  Starting server...
start "Codenames Server" cmd /k "cd server && npm run dev"

REM Wait for server
timeout /t 3 /nobreak >nul

REM Start client in new window  
echo ▶️  Starting client...
start "Codenames Client" cmd /k "cd client && npm run dev -- --host"

echo.
echo ═══════════════════════════════════════════════
echo      ✅ Game is running!
echo ═══════════════════════════════════════════════
echo.
echo 🔗 Access URLs:
echo    Local (this computer): http://localhost:5173
if not "%IP%"=="localhost" (
echo    Network (other devices): http://%IP%:5173
)
echo.
echo 📱 For other devices:
echo    1. Connect to the same Wi-Fi
echo    2. Open browser
echo    3. Go to: http://%IP%:5173
echo.
echo ⚠️  Close the server and client windows to stop
echo.
pause
