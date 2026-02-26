@echo off
echo ========================================
echo  S.H.I.E.L.D - GitHub Push Script
echo ========================================
echo.

echo [1/5] Initializing Git repository...
git init
echo.

echo [2/5] Adding remote repository...
git remote add origin https://github.com/Stark1645/S.H.I.E.L.D..git
echo.

echo [3/5] Adding all files...
git add .
echo.

echo [4/5] Creating commit...
git commit -m "S.H.I.E.L.D v2.0 FINAL - Production Ready Autonomous Cybersecurity War Room"
echo.

echo [5/5] Pushing to GitHub...
git branch -M main
git push -u origin main --force
echo.

echo ========================================
echo  Push Complete!
echo ========================================
echo.
echo Repository: https://github.com/Stark1645/S.H.I.E.L.D.
echo.
pause
