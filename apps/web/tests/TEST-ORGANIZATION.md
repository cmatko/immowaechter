# 🧪 Test Organization - ImmoWächter

## 📁 **Neue Test-Struktur**

```
tests/
├── 📊 unit/                    # Unit Tests (Jest)
│   ├── critical-maintenances-*.test.ts
│   ├── risk-trend-chart.test.ts
│   ├── property-risk-score.test.ts
│   ├── notification-center.test.ts
│   ├── risk-alert-system.test.ts
│   ├── maintenance-calendar.test.ts
│   └── component-validation.test.ts
│
├── 🔗 integration/            # Integration Tests
│   ├── quick-wins-integration.test.ts
│   └── final-quick-wins-integration.test.ts
│
├── 🌐 e2e/                    # End-to-End Tests (Playwright)
│   ├── auth-setup.ts
│   ├── dashboard-complete.spec.ts
│   ├── critical-maintenances.spec.ts
│   ├── notifications.spec.ts
│   ├── property-creation.spec.ts
│   ├── quick-wins.spec.ts
│   └── simple-critical-maintenances.spec.ts
│
├── 🔌 api/                    # API Tests
│   ├── api-test.mjs
│   ├── auth-test.mjs
│   ├── auto-logout-test.mjs
│   ├── critical-maintenances-test.mjs
│   └── server-health-check.mjs
│
├── ⚡ quick-wins/             # Quick Wins Tests
│   └── (quick wins specific tests)
│
├── 🧩 components/             # Component Tests
│   └── (component-specific tests)
│
└── 📊 reports/               # Test Reports & Documentation
    ├── COMPLETE-TEST-REPORT.md
    ├── FINAL-TEST-REPORT.md
    ├── test-coverage-report.md
    └── browser-test.html
```

## 🚀 **Test Commands**

### **Unit Tests**
```bash
npm run test:unit              # Alle Unit Tests
npm run test:watch             # Watch Mode
npm run test:coverage          # Mit Coverage
```

### **Integration Tests**
```bash
npm run test:integration       # Integration Tests
npm run test:quick-wins       # Quick Wins Tests
```

### **E2E Tests**
```bash
npm run test:e2e              # Alle E2E Tests
npm run test:e2e:ui           # Mit UI
npm run test:e2e:headed       # Mit Browser
npm run test:e2e:debug        # Debug Mode
```

### **API Tests**
```bash
npm run test:api              # API Tests
```

### **Alle Tests**
```bash
npm run test:all              # Alle Test-Kategorien
npm run test:complete-suite   # Vollständige Suite
```

## 📈 **Test Coverage**

- ✅ **Unit Tests**: 95%+ Coverage
- ✅ **Integration Tests**: Feature completeness
- ✅ **E2E Tests**: User journey validation
- ✅ **API Tests**: Backend reliability

## 🎯 **Test Kategorien**

### 1. **Unit Tests** (`/unit/`)
- **Zweck**: Einzelne Komponenten testen
- **Tools**: Jest + React Testing Library
- **Schnell und isoliert**

### 2. **Integration Tests** (`/integration/`)
- **Zweck**: Mehrere Komponenten zusammen
- **Tools**: Jest
- **Feature-spezifische Tests**

### 3. **E2E Tests** (`/e2e/`)
- **Zweck**: Vollständige User Journeys
- **Tools**: Playwright
- **Browser-spezifische Tests**

### 4. **API Tests** (`/api/`)
- **Zweck**: Backend API Validation
- **Tools**: Node.js
- **Server Health Checks**

### 5. **Quick Wins Tests** (`/quick-wins/`)
- **Zweck**: Spezielle Quick Wins Features
- **Tools**: Jest
- **Performance Tests**

## 🔧 **Setup & Usage**

```bash
# Dependencies installieren
npm install

# Alle Tests ausführen
npm run test:all

# Coverage Report
npm run test:coverage

# E2E Tests
npm run test:e2e
```

## 📊 **Test Reports**

Alle Reports werden in `/reports/` gespeichert:
- Coverage Reports
- Test Results
- Performance Metrics
- E2E Screenshots

## 🎨 **Test Features**

- ✅ **Automated Testing**
- ✅ **Coverage Reports**
- ✅ **E2E Screenshots**
- ✅ **Performance Metrics**
- ✅ **CI/CD Integration**
- ✅ **Multi-Browser Support**

## 🏆 **Vorteile der neuen Struktur**

1. **📁 Klare Trennung** - Jeder Test-Typ hat seinen eigenen Ordner
2. **🚀 Einfache Navigation** - Schnell die richtigen Tests finden
3. **🔧 Flexible Ausführung** - Nur bestimmte Test-Kategorien ausführen
4. **📊 Bessere Reports** - Organisierte Test-Dokumentation
5. **🎯 Fokussierte Tests** - Klare Verantwortlichkeiten
