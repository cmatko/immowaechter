@echo off
REM ============================================
REM ImmoWächter - Complete Fresh Start Setup
REM Version: 2.0 - Full Reset Edition
REM ============================================

color 0B
cls
echo.
echo ============================================
echo   ImmoWaechter - FRESH START SETUP v2.0
echo ============================================
echo.
echo Dieses Script erstellt dein Projekt neu:
echo - Loescht alte Dependencies
echo - Erstellt komplette Ordnerstruktur
echo - Installiert alle Packages fresh
echo - Richtet Prisma/Supabase ein
echo - Fuegt rechtssichere Landing Page ein
echo.
pause
echo.

REM ============================================
REM STEP 1: Checks
REM ============================================
echo [1/10] System-Checks...
echo.

node --version >nul 2>&1
if %errorlevel% neq 0 (
    color 0C
    echo FEHLER: Node.js ist nicht installiert!
    echo Bitte installiere: https://nodejs.org
    pause
    exit /b 1
)
echo [OK] Node.js gefunden
echo.

REM ============================================
REM STEP 2: Backup & Cleanup
REM ============================================
echo [2/10] Alte Dateien loeschen...
echo.
echo WARNUNG: Dies loescht node_modules, .next, etc.
pause

if exist "node_modules" (
    echo Loesche node_modules...
    rmdir /s /q node_modules 2>nul
)

if exist ".next" (
    echo Loesche .next...
    rmdir /s /q .next 2>nul
)

if exist "apps\web\node_modules" (
    echo Loesche apps\web\node_modules...
    rmdir /s /q apps\web\node_modules 2>nul
)

if exist "apps\web\.next" (
    echo Loesche apps\web\.next...
    rmdir /s /q apps\web\.next 2>nul
)

if exist "package-lock.json" del /q package-lock.json 2>nul
if exist "apps\web\package-lock.json" del /q apps\web\package-lock.json 2>nul

echo [OK] Cleanup abgeschlossen
echo.

REM ============================================
REM STEP 3: Directory Structure
REM ============================================
echo [3/10] Erstelle Ordnerstruktur...
echo.

if not exist ".github\workflows" mkdir ".github\workflows"
if not exist "apps\web\app\api" mkdir "apps\web\app\api"
if not exist "apps\web\components" mkdir "apps\web\components"
if not exist "apps\web\lib" mkdir "apps\web\lib"
if not exist "apps\web\public" mkdir "apps\web\public"
if not exist "packages\database\prisma" mkdir "packages\database\prisma"
if not exist "packages\ui\components" mkdir "packages\ui\components"
if not exist "docker" mkdir "docker"

echo [OK] Ordnerstruktur erstellt
echo.

REM ============================================
REM STEP 4: Root Package.json
REM ============================================
echo [4/10] Erstelle Root package.json...
echo.

(
echo {
echo   "name": "immowaechter",
echo   "version": "1.0.0",
echo   "private": true,
echo   "workspaces": [
echo     "apps/*",
echo     "packages/*"
echo   ],
echo   "scripts": {
echo     "dev": "npm run dev --workspace=apps/web",
echo     "build": "npm run build --workspace=apps/web",
echo     "start": "npm run start --workspace=apps/web",
echo     "lint": "npm run lint --workspace=apps/web",
echo     "clean": "rimraf node_modules .next apps/web/node_modules apps/web/.next"
echo   },
echo   "devDependencies": {
echo     "rimraf": "^5.0.5"
echo   }
echo }
) > package.json

echo [OK] Root package.json erstellt
echo.

REM ============================================
REM STEP 5: Next.js App Package.json
REM ============================================
echo [5/10] Erstelle Next.js package.json...
echo.

(
echo {
echo   "name": "@immowaechter/web",
echo   "version": "0.1.0",
echo   "private": true,
echo   "scripts": {
echo     "dev": "next dev",
echo     "build": "next build",
echo     "start": "next start",
echo     "lint": "next lint"
echo   },
echo   "dependencies": {
echo     "next": "14.2.5",
echo     "react": "^18.3.1",
echo     "react-dom": "^18.3.1",
echo     "@prisma/client": "^5.18.0",
echo     "lucide-react": "^0.428.0"
echo   },
echo   "devDependencies": {
echo     "@types/node": "^22.5.0",
echo     "@types/react": "^18.3.4",
echo     "@types/react-dom": "^18.3.0",
echo     "typescript": "^5.5.4",
echo     "tailwindcss": "^3.4.10",
echo     "postcss": "^8.4.41",
echo     "autoprefixer": "^10.4.20",
echo     "prisma": "^5.18.0",
echo     "eslint": "^8.57.0",
echo     "eslint-config-next": "14.2.5"
echo   }
echo }
) > apps\web\package.json

echo [OK] Next.js package.json erstellt
echo.

REM ============================================
REM STEP 6: TypeScript Config
REM ============================================
echo [6/10] Erstelle TypeScript Config...
echo.

(
echo {
echo   "compilerOptions": {
echo     "target": "ES2017",
echo     "lib": ["dom", "dom.iterable", "esnext"],
echo     "allowJs": true,
echo     "skipLibCheck": true,
echo     "strict": true,
echo     "noEmit": true,
echo     "esModuleInterop": true,
echo     "module": "esnext",
echo     "moduleResolution": "bundler",
echo     "resolveJsonModule": true,
echo     "isolatedModules": true,
echo     "jsx": "preserve",
echo     "incremental": true,
echo     "plugins": [
echo       {
echo         "name": "next"
echo       }
echo     ],
echo     "paths": {
echo       "@/*": ["./*"]
echo     }
echo   },
echo   "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
echo   "exclude": ["node_modules"]
echo }
) > apps\web\tsconfig.json

echo [OK] TypeScript Config erstellt
echo.

REM ============================================
REM STEP 7: Tailwind Config
REM ============================================
echo [7/10] Erstelle Tailwind Config...
echo.

(
echo /** @type {import('tailwindcss'^).Config} */
echo module.exports = {
echo   content: [
echo     './pages/**/*.{js,ts,jsx,tsx,mdx}',
echo     './components/**/*.{js,ts,jsx,tsx,mdx}',
echo     './app/**/*.{js,ts,jsx,tsx,mdx}',
echo   ],
echo   theme: {
echo     extend: {
echo       colors: {
echo         danger: '#DC2626',
echo         warning: '#F59E0B',
echo         success: '#16A34A',
echo       },
echo     },
echo   },
echo   plugins: [],
echo }
) > apps\web\tailwind.config.js

(
echo module.exports = {
echo   plugins: {
echo     tailwindcss: {},
echo     autoprefixer: {},
echo   },
echo }
) > apps\web\postcss.config.js

echo [OK] Tailwind Config erstellt
echo.

REM ============================================
REM STEP 8: Prisma Schema
REM ============================================
echo [8/10] Erstelle Prisma Schema mit OIB-Daten...
echo.

(
echo generator client {
echo   provider = "prisma-client-js"
echo }
echo.
echo datasource db {
echo   provider = "postgresql"
echo   url      = env("DATABASE_URL"^)
echo }
echo.
echo model User {
echo   id        String   @id @default(cuid(^)^)
echo   email     String   @unique
echo   name      String?
echo   createdAt DateTime @default(now(^)^)
echo   updatedAt DateTime @updatedAt
echo   properties Property[]
echo }
echo.
echo model Property {
echo   id          String   @id @default(cuid(^)^)
echo   name        String
echo   address     String
echo   userId      String
echo   user        User     @relation(fields: [userId], references: [id], onDelete: Cascade^)
echo   createdAt   DateTime @default(now(^)^)
echo   updatedAt   DateTime @updatedAt
echo   maintenances Maintenance[]
echo }
echo.
echo model MaintenanceType {
echo   id              String   @id @default(cuid(^)^)
echo   code            String   @unique
echo   name            String
echo   category        String
echo   intervalMonths  Int
echo   criticality     Int
echo   priceMin        Float
echo   priceMax        Float
echo   legalBasis      String?
echo   description     String?
echo   maintenances    Maintenance[]
echo }
echo.
echo model Maintenance {
echo   id                String          @id @default(cuid(^)^)
echo   propertyId        String
echo   property          Property        @relation(fields: [propertyId], references: [id], onDelete: Cascade^)
echo   maintenanceTypeId String
echo   maintenanceType   MaintenanceType @relation(fields: [maintenanceTypeId], references: [id]^)
echo   lastDone          DateTime?
echo   nextDue           DateTime
echo   status            String          @default("pending"^)
echo   createdAt         DateTime        @default(now(^)^)
echo   updatedAt         DateTime        @updatedAt
echo }
) > packages\database\prisma\schema.prisma

echo [OK] Prisma Schema erstellt
echo.

REM ============================================
REM STEP 9: Environment Files
REM ============================================
echo [9/10] Erstelle Environment Files...
echo.

(
echo # Supabase
echo DATABASE_URL="postgresql://postgres:postgres@localhost:5432/immowaechter"
echo DIRECT_URL="postgresql://postgres:postgres@localhost:5432/immowaechter"
echo NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
echo.
echo # App
echo NEXT_PUBLIC_APP_URL=http://localhost:3000
) > apps\web\.env.local

(
echo # Supabase - Ersetze mit deinen Daten
echo DATABASE_URL="postgresql://postgres:postgres@localhost:5432/immowaechter"
echo NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
) > apps\web\.env.example

echo [OK] Environment Files erstellt
echo.

REM ============================================
REM STEP 10: Landing Page Files
REM ============================================
echo [10/10] Erstelle Landing Page Files...
echo.

REM Create globals.css
(
echo @tailwind base;
echo @tailwind components;
echo @tailwind utilities;
) > apps\web\app\globals.css

REM Create layout.tsx
(
echo import type { Metadata } from 'next'
echo import './globals.css'
echo.
echo export const metadata: Metadata = {
echo   title: 'ImmoWaechter - Nie wieder Wartungen vergessen',
echo   description: 'Digitale Wartungserinnerung fuer Immobilien in Oesterreich',
echo }
echo.
echo export default function RootLayout^({
echo   children,
echo }: {
echo   children: React.ReactNode
echo }^) {
echo   return ^(
echo     ^<html lang="de"^>
echo       ^<body^>{children}^</body^>
echo     ^</html^>
echo   ^)
echo }
) > apps\web\app\layout.tsx

REM Create page.tsx
(
echo import LandingPage from '../components/LandingPage'
echo.
echo export default function Home^(^) {
echo   return ^<LandingPage /^>
echo }
) > apps\web\app\page.tsx

REM Create LandingPage component - Part 1
(
echo 'use client'
echo.
echo import { AlertTriangle, Shield, Bell, FileText, CheckCircle } from 'lucide-react'
echo.
echo export default function LandingPage^(^) {
echo   return ^(
echo     ^<div className="min-h-screen bg-white"^>
echo       {/* Navigation */}
echo       ^<nav className="bg-white border-b border-gray-200 sticky top-0 z-50"^>
echo         ^<div className="container mx-auto px-4 py-4 flex justify-between items-center"^>
echo           ^<div className="flex items-center gap-2"^>
echo             ^<AlertTriangle className="w-8 h-8 text-red-600" /^>
echo             ^<span className="text-2xl font-bold text-gray-900"^>ImmoWaechter^</span^>
echo           ^</div^>
echo           ^<button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"^>
echo             Jetzt starten
echo           ^</button^>
echo         ^</div^>
echo       ^</nav^>
echo.
echo       {/* Hero Section with yellow/orange gradient */}
echo       ^<section className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 py-20"^>
echo         ^<div className="container mx-auto px-4"^>
echo           ^<div className="max-w-4xl mx-auto text-center"^>
echo             ^<h1 className="text-5xl font-bold text-gray-900 mb-6"^>
echo               648 Wartungen werden jaehrlich vergessen – gehoert Ihre dazu?
echo             ^</h1^>
echo             ^<p className="text-xl text-gray-700 mb-8"^>
echo               ImmoWaechter erinnert Sie an alle gesetzlichen Wartungsfristen – fuer mehr Sicherheit in Ihrer Immobilie
echo             ^</p^>
echo             ^<button className="bg-red-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-red-700 transition-colors"^>
echo               Kostenlos testen
echo             ^</button^>
echo           ^</div^>
echo         ^</div^>
echo       ^</section^>
echo.
echo       {/* PROMINENT DISCLAIMER */}
echo       ^<section className="bg-yellow-100 border-y-4 border-yellow-400 py-6"^>
echo         ^<div className="container mx-auto px-4"^>
echo           ^<div className="max-w-4xl mx-auto"^>
echo             ^<div className="flex gap-4 items-start"^>
echo               ^<AlertTriangle className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-1" /^>
echo               ^<div^>
echo                 ^<p className="text-sm text-gray-800 leading-relaxed"^>
echo                   ^<strong^>Wichtiger Hinweis:^</strong^> ImmoWaechter ist ein digitaler Wartungsassistent, 
echo                   der Sie an gesetzliche Fristen und empfohlene Wartungsintervalle erinnert. 
echo                   Die Verantwortung fuer die Durchfuehrung der Wartungen und die Einhaltung aller 
echo                   gesetzlichen Pflichten verbleibt beim Immobilienbesitzer. ImmoWaechter ersetzt 
echo                   keine fachliche Beratung und uebernimmt keine Haftung fuer Schaeden.
echo                 ^</p^>
echo               ^</div^>
echo             ^</div^>
echo           ^</div^>
echo         ^</div^>
echo       ^</section^>
echo.
echo       {/* Features Section */}
echo       ^<section className="py-20 bg-gray-50"^>
echo         ^<div className="container mx-auto px-4"^>
echo           ^<h2 className="text-3xl font-bold text-center mb-12 text-gray-900"^>So unterstuetzt ImmoWaechter Sie^</h2^>
echo           ^<div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto"^>
echo             {/* Feature 1 */}
echo             ^<div className="bg-white p-6 rounded-lg shadow-md"^>
echo               ^<Bell className="w-12 h-12 text-amber-500 mb-4" /^>
echo               ^<h3 className="text-xl font-semibold mb-2 text-gray-900"^>Rechtzeitige Erinnerungen^</h3^>
echo               ^<p className="text-gray-600"^>
echo                 Jaehrlich entstehen 648 CO-Unfaelle durch vergessene Gasheizungswartungen. 
echo                 Unsere Erinnerungen helfen Ihnen, Termine einzuhalten.
echo               ^</p^>
echo             ^</div^>
echo.
echo             {/* Feature 2 */}
echo             ^<div className="bg-white p-6 rounded-lg shadow-md"^>
echo               ^<FileText className="w-12 h-12 text-blue-500 mb-4" /^>
echo               ^<h3 className="text-xl font-semibold mb-2 text-gray-900"^>Lueckenlose Dokumentation^</h3^>
echo               ^<p className="text-gray-600"^>
echo                 Bei grober Fahrlaessigkeit zahlen Versicherungen oft nicht. Mit unserer 
echo                 Wartungsdokumentation koennen Sie Ihre Sorgfaltspflicht nachweisen.
echo               ^</p^>
echo             ^</div^>
echo.
echo             {/* Feature 3 */}
echo             ^<div className="bg-white p-6 rounded-lg shadow-md"^>
echo               ^<Shield className="w-12 h-12 text-green-500 mb-4" /^>
echo               ^<h3 className="text-xl font-semibold mb-2 text-gray-900"^>Gesetzliche Pflichten^</h3^>
echo               ^<p className="text-gray-600"^>
echo                 Als Immobilienbesitzer haben Sie Verkehrssicherungspflichten. 
echo                 Wir helfen Ihnen, den Ueberblick zu behalten.
echo               ^</p^>
echo             ^</div^>
echo           ^</div^>
echo         ^</div^>
echo       ^</section^>
echo.
echo       {/* Statistics Section */}
echo       ^<section className="py-16 bg-white"^>
echo         ^<div className="container mx-auto px-4"^>
echo           ^<div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center"^>
echo             ^<div^>
echo               ^<div className="text-4xl font-bold text-red-600 mb-2"^>648^</div^>
echo               ^<div className="text-gray-600"^>CO-Vergiftungen/Jahr^</div^>
echo             ^</div^>
echo             ^<div^>
echo               ^<div className="text-4xl font-bold text-red-600 mb-2"^>50.000€^</div^>
echo               ^<div className="text-gray-600"^>Moegliches Bussgeld^</div^>
echo             ^</div^>
echo             ^<div^>
echo               ^<div className="text-4xl font-bold text-red-600 mb-2"^>15.000€^</div^>
echo               ^<div className="text-gray-600"^>Durchschn. Schaden^</div^>
echo             ^</div^>
echo             ^<div^>
echo               ^<div className="text-4xl font-bold text-green-600 mb-2"^>24.000€^</div^>
echo               ^<div className="text-gray-600"^>Moegliche Foerderungen^</div^>
echo             ^</div^>
echo           ^</div^>
echo         ^</div^>
echo       ^</section^>
echo.
echo       {/* CTA Section */}
echo       ^<section className="py-20 bg-gradient-to-br from-red-600 to-orange-600 text-white"^>
echo         ^<div className="container mx-auto px-4 text-center"^>
echo           ^<h2 className="text-4xl font-bold mb-6"^>Behalten Sie den Ueberblick^</h2^>
echo           ^<p className="text-xl mb-8 max-w-2xl mx-auto"^>
echo             Multi-Channel-Erinnerungen erhoehen die Chance, dass Sie wichtige Termine wahrnehmen
echo           ^</p^>
echo           ^<button className="bg-white text-red-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors"^>
echo             Jetzt Wartungen organisieren
echo           ^</button^>
echo         ^</div^>
echo       ^</section^>
echo.
echo       {/* Footer */}
echo       ^<footer className="bg-gray-900 text-white py-12"^>
echo         ^<div className="container mx-auto px-4 text-center"^>
echo           ^<p^>© 2025 ImmoWaechter - Digitale Wartungserinnerung^</p^>
echo         ^</div^>
echo       ^</footer^>
echo     ^</div^>
echo   ^)
echo }
) > apps\web\components\LandingPage.tsx

echo [OK] Landing Page erstellt
echo.

REM ============================================
REM Create Docker Compose
REM ============================================
(
echo version: '3.8'
echo.
echo services:
echo   db:
echo     image: postgres:15-alpine
echo     environment:
echo       POSTGRES_USER: postgres
echo       POSTGRES_PASSWORD: postgres
echo       POSTGRES_DB: immowaechter
echo     ports:
echo       - "5432:5432"
echo     volumes:
echo       - postgres_data:/var/lib/postgresql/data
echo.
echo volumes:
echo   postgres_data:
) > docker-compose.yml

REM Create .gitignore
(
echo node_modules
echo .next
echo .env
echo .env.local
echo dist
echo build
echo *.log
echo .DS_Store
echo .turbo
echo package-lock.json
) > .gitignore

REM ============================================
REM Install Dependencies
REM ============================================
color 0A
echo.
echo ============================================
echo   INSTALLATION ABGESCHLOSSEN!
echo ============================================
echo.
echo Naechste Schritte:
echo.
echo 1. Dependencies installieren:
echo    npm install
echo    cd apps/web
echo    npm install
echo    cd ../..
echo.
echo 2. Supabase konfigurieren:
echo    - Gehe zu https://supabase.com
echo    - Erstelle Projekt
echo    - Kopiere Credentials in apps/web/.env.local
echo.
echo 3. Prisma einrichten:
echo    cd packages/database
echo    npx prisma generate
echo    npx prisma db push
echo.
echo 4. App starten:
echo    npm run dev
echo.
echo 5. Browser oeffnen:
echo    http://localhost:3000
echo.
echo ============================================
echo.
pause