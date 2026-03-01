@echo off
title MOVETOS Website - Dev Server
echo.
echo  ========================================
echo   MOVETOS / CrowdOps Website
echo   Dev Server starten...
echo  ========================================
echo.
cd /d "%~dp0"
npm run dev
pause
