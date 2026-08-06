@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js belum terpasang.& exit /b 1)
if not exist node_modules (
  echo Installing dependencies...
  call npm.cmd install || exit /b 1
)
call npm.cmd run dev
