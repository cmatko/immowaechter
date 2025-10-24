# 🌐 E2E Test Structure - ImmoWächter (UMBENANNT)

## 📊 **3 E2E-Bereiche mit klaren Namen**

### 1. **`e2e-playwright-full/`** 🎯
**Zweck**: **Vollständige E2E Tests** - Komplette Anwendung
**Framework**: **Playwright**
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
npx playwright test e2e-playwright-full/organized/
```

---

### 2. **`apps/web/e2e-playwright-web/`** 🌐
**Zweck**: **Web-spezifische Tests** - Nur Web-App
**Framework**: **Playwright**
**Status**: ❓ **UNKLAR** - Möglicherweise veraltet
**Inhalt**:
- 📁 `generated/` - Auto-generierte Tests (13 files)
- 📁 `organized/` - Leere Ordner-Struktur

**Verwendung**:
```bash
# Web-spezifische Tests
npx playwright test apps/web/e2e-playwright-web/
```

---

### 3. **`apps/web/tests/e2e-jest/`** ⚡
**Zweck**: **Jest-basierte E2E Tests** - Unit/Integration Tests
**Framework**: **Jest**
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

| Bereich | Framework | Zweck | Status | Tests |
|---------|-----------|-------|--------|-------|
| **`e2e-playwright-full/`** | Playwright | Vollständige App | ✅ Aktiv | 18 files |
| **`e2e-playwright-web/`** | Playwright | Web-spezifisch | ❓ Unklar | 13 files |
| **`e2e-jest/`** | Jest | Unit/Integration | ✅ Aktiv | 9 files |

## 🚀 **Empfohlene Verwendung**

### **Für Vollständige E2E Tests:**
```bash
# Hauptverzeichnis E2E (Playwright)
npx playwright test e2e-playwright-full/organized/
```

### **Für Jest-basierte Tests:**
```bash
# Apps/Web Tests E2E (Jest)
npm run test:e2e
```

### **Für Web-spezifische Tests:**
```bash
# Apps/Web E2E (Playwright)
npx playwright test apps/web/e2e-playwright-web/
```

## 🔧 **Konfiguration**

### **Playwright Config:**
- **Vollständige Tests**: `playwright.config.ts`
- **Web-spezifisch**: `apps/web/playwright.config.ts`

### **Jest Config:**
- **Jest Tests**: `apps/web/jest.config.js`

## 🏆 **Vorteile der Umbenennung**

1. **🎯 Klare Namen** - Sofort erkennbar, was jeder Ordner macht
2. **🔧 Framework-spezifisch** - Playwright vs Jest
3. **📊 Scope-spezifisch** - Vollständig vs Web vs Unit
4. **🚀 Bessere Navigation** - Keine Verwirrung mehr

## 🎨 **Neue Ordner-Struktur**

```
ImmoWächter/
├── e2e-playwright-full/        # 🎯 Vollständige E2E Tests (Playwright)
│   ├── organized/
│   │   ├── auth/
│   │   ├── pages/
│   │   ├── features/
│   │   ├── debug/
│   │   └── helpers/
│   └── README.md
│
├── apps/web/
│   ├── e2e-playwright-web/     # 🌐 Web-spezifische Tests (Playwright)
│   │   ├── generated/
│   │   └── organized/
│   │
│   └── tests/
│       └── e2e-jest/           # ⚡ Jest E2E Tests (Jest)
│           ├── auth-setup.ts
│           ├── dashboard-complete.spec.ts
│           └── ...
```

## 🎯 **Workflow**

1. **🔍 Test-Typ wählen** - Playwright vs Jest
2. **📁 Richtigen Ordner finden** - Klare Namen
3. **🧪 Tests ausführen** - Framework-spezifisch
4. **📊 Ergebnisse prüfen** - Kategorisierte Reports
