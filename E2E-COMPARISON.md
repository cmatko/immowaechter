# 🌐 E2E Test Comparison - ImmoWächter

## 📊 **3 Verschiedene E2E-Bereiche**

### 1. **Hauptverzeichnis E2E** (`/e2e/`)
**Zweck**: **Original E2E Tests** - Vollständige Anwendung
**Status**: ✅ **AKTIV** - Haupt-Test-Suite
**Inhalt**: 
- 🔐 Authentication Tests (3 files)
- 📄 Page Tests (9 files) 
- ⚡ Feature Tests (4 files)
- 🐛 Debug Tests (2 files)
- 🛠️ Helpers (2 files)

**Verwendung**:
```bash
# Alle E2E Tests
npx playwright test

# Spezifische Tests
npx playwright test e2e/organized/auth/
```

---

### 2. **Apps/Web E2E** (`/apps/web/e2e/`)
**Zweck**: **Web-spezifische Tests** - Nur Web-App
**Status**: ❓ **UNKLAR** - Möglicherweise veraltet
**Inhalt**:
- 📁 `generated/` - Auto-generierte Tests (13 files)
- 📁 `organized/` - Leere Ordner-Struktur

**Verwendung**:
```bash
# Web-spezifische Tests
npx playwright test apps/web/e2e/
```

---

### 3. **Tests/E2E** (`/apps/web/tests/e2e/`)
**Zweck**: **Jest-basierte E2E Tests** - Unit/Integration Tests
**Status**: ✅ **AKTIV** - Jest Test Suite
**Inhalt**:
- 🔐 `auth-setup.ts` - Authentication Setup
- 📊 `dashboard-complete.spec.ts` - Dashboard Tests
- 🔧 `critical-maintenances.spec.ts` - Maintenance Tests
- 🔔 `notifications.spec.ts` - Notification Tests
- 🏠 `property-creation.spec.ts` - Property Tests
- ⚡ `quick-wins.spec.ts` - Quick Wins Tests

**Verwendung**:
```bash
# Jest E2E Tests
npm run test:e2e
```

## 🎯 **Unterschiede im Detail**

| Bereich | Zweck | Framework | Status | Tests |
|---------|-------|------------|--------|-------|
| **`/e2e/`** | Vollständige App | Playwright | ✅ Aktiv | 18 files |
| **`/apps/web/e2e/`** | Web-spezifisch | Playwright | ❓ Unklar | 13 files |
| **`/apps/web/tests/e2e/`** | Jest E2E | Jest | ✅ Aktiv | 9 files |

## 🚀 **Empfohlene Verwendung**

### **Für Vollständige E2E Tests:**
```bash
# Hauptverzeichnis E2E (Playwright)
npx playwright test e2e/organized/
```

### **Für Jest-basierte Tests:**
```bash
# Apps/Web Tests E2E (Jest)
npm run test:e2e
```

### **Für Web-spezifische Tests:**
```bash
# Apps/Web E2E (Playwright)
npx playwright test apps/web/e2e/
```

## 🔧 **Konfiguration**

### **Playwright Config:**
- **Hauptverzeichnis**: `playwright.config.ts`
- **Apps/Web**: `apps/web/playwright.config.ts`

### **Jest Config:**
- **Tests/E2E**: `apps/web/jest.config.js`

## 🎯 **Empfehlung**

1. **✅ VERWENDE**: `/e2e/` für vollständige E2E Tests
2. **✅ VERWENDE**: `/apps/web/tests/e2e/` für Jest Tests
3. **❓ PRÜFE**: `/apps/web/e2e/` - möglicherweise veraltet

## 🏆 **Vorteile der Trennung**

1. **🎯 Spezifische Tests** - Verschiedene Frameworks
2. **🔧 Bessere Organisation** - Klare Verantwortlichkeiten
3. **📊 Fokussierte Reports** - Framework-spezifische Ergebnisse
4. **🚀 Flexible Ausführung** - Nur relevante Tests ausführen
