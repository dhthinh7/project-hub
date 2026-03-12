@echo off
echo Starting Project Manager Local Server...
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Dependencies not found. Running installer...
    call install.bat
    exit /b
)

echo Starting server...
call npm start
