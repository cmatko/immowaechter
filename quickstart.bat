@echo off
REM ============================================
REM ImmoWaechter - Quick Start
REM Nach setup-immowaechter.bat ausfuehren!
REM ============================================

color 0E
cls
echo.
echo ============================================
echo   ImmoWaechter - Quick Start
echo ============================================
echo.
echo Dieses Script:
echo - Installiert alle Dependencies
echo - Richtet Prisma ein
echo - Seed OIB-Daten
echo - Startet Dev-Server
echo.
pause

REM ============================================
REM Install Root Dependencies
REM ============================================
echo.
echo [1/6] Installiere Root Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo FEHLER beim Installieren!
    pause
    exit /b 1
)

REM ============================================
REM Install Web Dependencies
REM ============================================
echo.
echo [2/6] Installiere Next.js Dependencies...
cd apps\web
call npm install
if %errorlevel% neq 0 (
    echo FEHLER beim Installieren!
    cd ..\..
    pause
    exit /b 1
)
cd ..\..

REM ============================================
REM Setup Prisma
REM ============================================
echo.
echo [3/6] Generiere Prisma Client...
cd packages\database
call npx prisma generate
if %errorlevel% neq 0 (
    echo WARNUNG: Prisma Generate fehlgeschlagen
    echo Bitte Supabase URL in .env.local eintragen!
)
cd ..\..

REM ============================================
REM Create Seed Script Package.json
REM ============================================
echo.
echo [4/6] Erstelle Seed-Script...
(
echo {
echo   "name": "@immowaechter/database",
echo   "version": "1.0.0",
echo   "scripts": {
echo     "seed": "tsx prisma/seed.ts"
echo   },
echo   "dependencies": {
echo     "@prisma/client": "^5.18.0"
echo   },
echo   "devDependencies": {
echo     "prisma": "^5.18.0",
echo     "tsx": "^4.7.1"
echo   }
echo }
) > packages\database\package.json

REM ============================================
REM Optional: Docker Database
REM ============================================
echo.
echo [5/6] Moechtest du lokale PostgreSQL-Datenbank starten?
echo (Docker muss installiert sein^)
echo.
choice /C YN /M "Docker-Datenbank starten"
if errorlevel 2 goto skip_docker
if errorlevel 1 goto start_docker

:start_docker
echo Starte Docker-Datenbank...
docker-compose up -d
timeout /t 5 /nobreak >nul
echo.
echo Datenbank laeuft auf: postgresql://postgres:postgres@localhost:5432/immowaechter
echo.
echo Trage folgendes in apps/web/.env.local ein:
echo DATABASE_URL="postgresql://postgres:postgres@localhost:5432/immowaechter"
echo.
pause
goto after_docker

:skip_docker
echo Docker uebersprungen. Verwende Supabase!
echo.

:after_docker

REM ============================================
REM Create Helper Scripts
REM ============================================
echo.
echo [6/6] Erstelle Helper-Scripts...

REM Start Dev Script
(
echo @echo off
echo cls
echo echo Starte ImmoWaechter Development Server...
echo echo.
echo cd apps\web
echo npm run dev
) > start-dev.bat

REM Stop Docker Script
(
echo @echo off
echo echo Stoppe Docker-Datenbank...
echo docker-compose down
echo echo Fertig!
echo pause
) > stop-docker.bat

REM Prisma Studio Script
(
echo @echo off
echo echo Oeffne Prisma Studio...
echo cd packages\database
echo npx prisma studio
) > open-db-studio.bat

REM Database Push Script
(
echo @echo off
echo echo Pushe Prisma Schema zur Datenbank...
echo cd packages\database
echo npx prisma db push
echo echo.
echo Fertig! Datenbank-Schema aktualisiert.
echo pause
) > db-push.bat

REM Seed Database Script
(
echo @echo off
echo echo Seed Datenbank mit OIB-Daten...
echo cd packages\database
echo npm install
echo npm run seed
echo echo.
echo Fertig! OIB-Wartungstypen eingefuegt.
echo pause
) > db-seed.bat

echo [OK] Helper-Scripts erstellt!
echo.

REM ============================================
REM Final Instructions
REM ============================================
color 0A
cls
echo.
echo ============================================
echo   INSTALLATION ABGESCHLOSSEN!
echo ============================================
echo.
echo Verfuegbare Scripts:
echo.
echo - start-dev.bat        = Startet Dev-Server
echo - stop-docker.bat      = Stoppt Datenbank
echo - open-db-studio.bat   = Oeffnet Prisma Studio
echo - db-push.bat          = Schema zur DB pushen
echo - db-seed.bat          = OIB-Daten einfuegen
echo.
echo ============================================
echo   NAECHSTE SCHRITTE:
echo ============================================
echo.
echo 1. Supabase konfigurieren:
echo    https://supabase.com
echo.
echo 2. Credentials in .env.local eintragen:
echo    apps/web/.env.local
echo.
echo 3. Datenbank-Schema pushen:
echo    db-push.bat
echo.
echo 4. OIB-Daten seeden:
echo    db-seed.bat
echo.
echo 5. App starten:
echo    start-dev.bat
echo.
echo 6. Browser oeffnen:
echo    http://localhost:3000
echo.
echo ============================================
echo.
echo Druecke eine Taste um fortzufahren...
pause >nul

REM Optional: Auto-Start
echo.
choice /C YN /M "Dev-Server jetzt starten"
if errorlevel 2 goto end
if errorlevel 1 goto start_now

:start_now
cls
echo Starte Development Server...
echo.
cd apps\web
npm run dev

:end
echo.
echo Viel Erfolg mit ImmoWaechter!
echo.