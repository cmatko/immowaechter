# 🧪 ImmoWächter Test Suite

## 📁 Test-Struktur

```
tests/
├── unit/                    # Unit Tests (Jest)
│   ├── critical-maintenances-*.test.ts
│   ├── risk-trend-chart.test.ts
│   ├── property-risk-score.test.ts
│   ├── notification-center.test.ts
│   ├── risk-alert-system.test.ts
│   └── maintenance-calendar.test.ts
│
├── integration/            # Integration Tests
│   ├── quick-wins-integration.test.ts
│   └── final-quick-wins-integration.test.ts
│
├── e2e/                    # End-to-End Tests (Playwright)
│   ├── auth-setup.ts
│   ├── dashboard-complete.spec.ts
│   ├── critical-maintenances.spec.ts
│   ├── notifications.spec.ts
│   ├── property-creation.spec.ts
│   ├── quick-wins.spec.ts
│   └── simple-critical-maintenances.spec.ts
│
├── api/                    # API Tests
│   ├── api-test.mjs
│   ├── auth-test.mjs
│   ├── auto-logout-test.mjs
│   ├── critical-maintenances-test.mjs
│   └── server-health-check.mjs
│
├── components/             # Component Tests
│   └── (component-specific tests)
│
├── quick-wins/             # Quick Wins Tests
│   └── (quick wins specific tests)
│
└── reports/               # Test Reports & Documentation
    ├── COMPLETE-TEST-REPORT.md
    ├── FINAL-TEST-REPORT.md
    ├── test-coverage-report.md
    └── browser-test.html
```

## 🚀 Test Commands

### Unit Tests
```bash
npm run test                    # Alle Unit Tests
npm run test:watch             # Watch Mode
npm run test:coverage          # Mit Coverage Report
```

### Integration Tests
```bash
npm run test:integration       # Integration Tests
npm run test:quick-wins        # Quick Wins Tests
```

### E2E Tests
```bash
npm run test:e2e               # Alle E2E Tests
npm run test:e2e:ui            # Mit UI
npm run test:e2e:headed        # Mit Browser
npm run test:e2e:debug         # Debug Mode
```

### API Tests
```bash
npm run test:api               # API Tests
npm run test:health            # Health Checks
```

## 📊 Test Coverage

- **Unit Tests**: 95%+ Coverage
- **Integration Tests**: Vollständige Feature-Tests
- **E2E Tests**: User Journey Tests
- **API Tests**: Backend Validation

## 🎯 Test Kategorien

### 1. **Unit Tests** (`/unit/`)
- Einzelne Komponenten testen
- Jest + React Testing Library
- Schnell und isoliert

### 2. **Integration Tests** (`/integration/`)
- Mehrere Komponenten zusammen
- API + Frontend Integration
- Feature-spezifische Tests

### 3. **E2E Tests** (`/e2e/`)
- Vollständige User Journeys
- Playwright
- Browser-spezifische Tests

### 4. **API Tests** (`/api/`)
- Backend API Validation
- Node.js Tests
- Server Health Checks

### 5. **Quick Wins Tests** (`/quick-wins/`)
- Spezielle Quick Wins Features
- PDF Export, Animations, Mobile
- Performance Tests

## 🔧 Setup

```bash
# Dependencies installieren
npm install

# Tests ausführen
npm run test:all

# Coverage Report
npm run test:coverage

# E2E Tests
npm run test:e2e
```

## 📈 Test Reports

Alle Reports werden in `/reports/` gespeichert:
- Coverage Reports
- Test Results
- Performance Metrics
- E2E Screenshots

## 🎨 Test Features

- ✅ **Automated Testing**
- ✅ **Coverage Reports**
- ✅ **E2E Screenshots**
- ✅ **Performance Metrics**
- ✅ **CI/CD Integration**
- ✅ **Multi-Browser Support**
