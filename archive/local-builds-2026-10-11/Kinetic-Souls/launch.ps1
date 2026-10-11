#!/usr/bin/env pwsh

Write-Host ""
Write-Host "🎮 Kinetic Souls - Launch Menu" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Dev (with hot reload on localhost:5173)" -ForegroundColor Green
Write-Host "2. Build production" -ForegroundColor Yellow
Write-Host "3. Serve production (test locally)" -ForegroundColor Yellow
Write-Host "4. Show IP address (for mobile testing)" -ForegroundColor Blue
Write-Host ""

$choice = Read-Host "Select option (1-4)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "🚀 Starting dev server..." -ForegroundColor Green
        Write-Host "📱 Access on mobile: http://[YOUR_PC_IP]:5173" -ForegroundColor Cyan
        Write-Host ""
        Push-Location artifacts/kinetic-souls
        $env:PORT = "5173"
        $env:BASE_PATH = "/"
        pnpm run dev
        Pop-Location
    }
    "2" {
        Write-Host ""
        Write-Host "📦 Building production bundle..." -ForegroundColor Yellow
        Push-Location artifacts/kinetic-souls
        $env:PORT = "5173"
        $env:BASE_PATH = "/"
        pnpm run build
        Pop-Location
        Write-Host "✅ Build complete! Output: artifacts/kinetic-souls/dist/" -ForegroundColor Green
    }
    "3" {
        Write-Host ""
        Write-Host "🚀 Building and serving production build..." -ForegroundColor Green
        Push-Location artifacts/kinetic-souls
        $env:PORT = "5173"
        $env:BASE_PATH = "/"
        pnpm run build
        pnpm run serve
        Pop-Location
    }
    "4" {
        Write-Host ""
        Write-Host "📡 Your PC IP addresses:" -ForegroundColor Blue
        Write-Host ""
        ipconfig | Select-String "IPv4"
        Write-Host ""
        Write-Host "Use IP above to access from mobile on same network" -ForegroundColor Cyan
        Write-Host "Example: http://192.168.1.100:5173" -ForegroundColor Yellow
        Write-Host ""
    }
    default {
        Write-Host "Invalid choice. Please run again and select 1-4." -ForegroundColor Red
    }
}
