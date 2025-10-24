# 🌐 E2E Current Structure - ImmoWächter

## 📊 **Aktuelle E2E-Struktur (KORREKT)**

```
e2e/
├── organized/                    # 🎯 AKTIVE TESTS (HIER ARBEITEN!)
│   ├── auth/                    # 🔐 Authentication Tests (3 files)
│   │   ├── auth-flow.spec.ts
│   │   ├── login.spec.ts
│   │   └── register.spec.ts
│   │
│   ├── pages/                   # 📄 Page Tests (9 files)
│   │   ├── admin.spec.ts
│   │   ├── agb.spec.ts
│   │   ├── dashboard.spec.ts
│   │   ├── datenschutz.spec.ts
│   │   ├── home.spec.ts
│   │   ├── impressum.spec.ts
│   │   ├── login.spec.ts
│   │   ├── register.spec.ts
│   │   └── verify.spec.ts
│   │
│   ├── features/                # ⚡ Feature Tests (4 files)
│   │   ├── properties-new.spec.ts
│   │   ├── properties-[id].spec.ts
│   │   ├── properties-[id]-edit.spec.ts
│   │   └── properties-[id]-maintenance-new.spec.ts
│   │
│   ├── helpers/                 # 🛠️ Test Helpers (2 files)
│   │   ├── auth-helpers.ts
│   │   └── test-data.ts
│   │
│   ├── fixtures/               # 📊 Test Data (empty)
│   │
│   ├── debug/                  # 🐛 Debug Tests (2 files)
│   │   ├── debug.spec.ts
│   │   └── debug-registration.spec.ts
│   │
│   └── global-setup.ts         # ⚙️ Global Setup
│
├── auth/                       # 🔐 LEER (moved to organized/)
├── helpers/                    # 🛠️ LEER (moved to organized/)
├── fixtures/                   # 📊 LEER (moved to organized/)
├── properties/                 # 🏠 LEER (moved to organized/)
├── wartungen/                  # 🔧 LEER (moved to organized/)
├── README.md                   # 📖 Documentation
├── E2E-ORGANIZATION.md         # 📖 Organization Guide
└── CURRENT-STRUCTURE.md        # 📖 This File
```

## 🎯 **WICHTIGE HINWEISE**

### ✅ **VERWENDE DIESE ORDNER:**
- **`e2e/organized/`** - Alle aktiven Tests
- **`e2e/organized/auth/`** - Authentication Tests
- **`e2e/organized/pages/`** - Page Tests
- **`e2e/organized/features/`** - Feature Tests
- **`e2e/organized/debug/`** - Debug Tests

### ❌ **VERWENDE NICHT DIESE ORDNER:**
- **`e2e/auth/`** - LEER (nicht verwenden)
- **`e2e/helpers/`** - LEER (nicht verwenden)
- **`e2e/fixtures/`** - LEER (nicht verwenden)
- **`e2e/properties/`** - LEER (nicht verwenden)
- **`e2e/wartungen/`** - LEER (nicht verwenden)

## 🚀 **Test Commands (KORREKT)**

### **Alle E2E Tests**
```bash
npx playwright test
```

### **Spezifische Kategorien**
```bash
# Authentication tests
npx playwright test e2e/organized/auth/

# Page tests
npx playwright test e2e/organized/pages/

# Feature tests
npx playwright test e2e/organized/features/

# Debug tests
npx playwright test e2e/organized/debug/
```

### **Mit UI**
```bash
npx playwright test --ui
```

### **Mit Browser**
```bash
npx playwright test --headed
```

## 📊 **Test Statistics**

- **Total Tests**: 18 files
- **Authentication**: 3 files
- **Pages**: 9 files
- **Features**: 4 files
- **Debug**: 2 files
- **Helpers**: 2 files
- **Fixtures**: 0 files (empty)

## 🎯 **Workflow**

1. **🔍 Tests finden** - In `e2e/organized/` suchen
2. **📝 Tests schreiben** - In entsprechende Kategorie
3. **🧪 Tests ausführen** - Mit korrekten Pfaden
4. **📊 Ergebnisse prüfen** - In `playwright-report/`

## 🏆 **Vorteile der Organisation**

1. **📁 Klare Struktur** - Alle Tests in `organized/`
2. **🎯 Fokussierte Tests** - Kategorien-basiert
3. **🔧 Bessere Wartung** - Organisierter Code
4. **📊 Bessere Reports** - Kategorisierte Ergebnisse
5. **🚀 Schnellere Entwicklung** - Effiziente Test-Ausführung
