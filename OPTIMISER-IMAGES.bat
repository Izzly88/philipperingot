@echo off
rem Double-cliquer sur ce fichier pour optimiser les images du site.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0outils\optimiser-images.ps1"
echo.
pause
