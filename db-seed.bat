@echo off
echo Seed Datenbank mit OIB-Daten...
cd packages\database
npm install
npm run seed
echo.
Fertig! OIB-Wartungstypen eingefuegt.
pause
