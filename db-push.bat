@echo off
echo Pushe Prisma Schema zur Datenbank...
cd packages\database
npx prisma db push
echo.
Fertig! Datenbank-Schema aktualisiert.
pause
