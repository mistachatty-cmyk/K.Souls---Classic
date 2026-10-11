@echo off
REM Kinetic Souls Quick Launch Script for Windows

echo.
echo 🎮 Kinetic Souls - Launch Menu
echo ================================
echo.
echo 1. Dev (with hot reload on localhost:5173)
echo 2. Build production
echo 3. Serve production (test locally)
echo 4. Show IP address (for mobile testing)
echo.

set /p choice="Select option (1-4): "

if "%choice%"=="1" (
    echo.
    echo 🚀 Starting dev server...
    echo 📱 Access on mobile: http://[YOUR_PC_IP]:5173
    echo.
    cd /d artifacts\kinetic-souls
    cmd /c "set PORT=5173 & set BASE_PATH=/ & pnpm run dev"
) else if "%choice%"=="2" (
    echo.
    echo 📦 Building production bundle...
    cd /d artifacts\kinetic-souls
    cmd /c "set PORT=5173 & set BASE_PATH=/ & pnpm run build"
    echo ✅ Build complete! Output: artifacts\kinetic-souls\dist\
) else if "%choice%"=="3" (
    echo.
    echo 🚀 Building and serving production build...
    cd /d artifacts\kinetic-souls
    cmd /c "set PORT=5173 & set BASE_PATH=/ & pnpm run build && pnpm run serve"
) else if "%choice%"=="4" (
    echo.
    echo 📡 Your PC IP addresses:
    echo.
    ipconfig | findstr /R "IPv4"
    echo.
    echo Use IP above to access from mobile on same network
    echo Example: http://192.168.1.100:5173
    echo.
    pause
) else (
    echo Invalid choice. Please run again and select 1-4.
)
