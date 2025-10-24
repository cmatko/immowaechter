# 🧪 Test Structure Overview

## 📊 Test Organization

### 🎯 **Unit Tests** (`/unit/`)
**Purpose**: Test individual components in isolation
**Tools**: Jest + React Testing Library
**Files**:
- `critical-maintenances-*.test.ts` - PDF, Animations, Mobile
- `risk-trend-chart.test.ts` - Risk trend visualization
- `property-risk-score.test.ts` - Risk scoring logic
- `notification-center.test.ts` - Notification system
- `risk-alert-system.test.ts` - Alert management
- `maintenance-calendar.test.ts` - Calendar functionality

**Run**: `npm run test:unit`

### 🔗 **Integration Tests** (`/integration/`)
**Purpose**: Test multiple components working together
**Tools**: Jest
**Files**:
- `quick-wins-integration.test.ts` - Quick wins features
- `final-quick-wins-integration.test.ts` - Complete system

**Run**: `npm run test:integration`

### 🌐 **E2E Tests** (`/e2e/`)
**Purpose**: Test complete user journeys
**Tools**: Playwright
**Files**:
- `auth-setup.ts` - Authentication setup
- `dashboard-complete.spec.ts` - Full dashboard flow
- `critical-maintenances.spec.ts` - Maintenance page
- `notifications.spec.ts` - Notification system
- `property-creation.spec.ts` - Property creation
- `quick-wins.spec.ts` - Quick wins features
- `simple-critical-maintenances.spec.ts` - API tests

**Run**: `npm run test:e2e`

### 🔌 **API Tests** (`/api/`)
**Purpose**: Test backend APIs and server health
**Tools**: Node.js
**Files**:
- `api-test.mjs` - General API tests
- `auth-test.mjs` - Authentication tests
- `auto-logout-test.mjs` - Session management
- `critical-maintenances-test.mjs` - Maintenance API
- `server-health-check.mjs` - Health monitoring

**Run**: `npm run test:api`

### ⚡ **Quick Wins Tests** (`/quick-wins/`)
**Purpose**: Test specific quick wins features
**Tools**: Jest
**Files**:
- Quick wins specific test files

**Run**: `npm run test:quick-wins`

### 📊 **Reports** (`/reports/`)
**Purpose**: Test reports and documentation
**Files**:
- `COMPLETE-TEST-REPORT.md` - Complete test report
- `FINAL-TEST-REPORT.md` - Final test status
- `test-coverage-report.md` - Coverage metrics
- `browser-test.html` - Browser test results

## 🚀 Quick Commands

```bash
# Run all tests
npm run test:all

# Unit tests only
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# API tests
npm run test:api

# Quick wins
npm run test:quick-wins

# With coverage
npm run test:coverage
```

## 📈 Test Coverage

- **Unit Tests**: 95%+ coverage
- **Integration Tests**: Feature completeness
- **E2E Tests**: User journey validation
- **API Tests**: Backend reliability

## 🎨 Test Features

- ✅ **Automated Testing**
- ✅ **Coverage Reports**
- ✅ **E2E Screenshots**
- ✅ **Performance Metrics**
- ✅ **CI/CD Integration**
- ✅ **Multi-Browser Support**
