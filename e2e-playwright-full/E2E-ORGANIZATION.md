# 🌐 E2E Test Organization - ImmoWächter

## 📊 **E2E Test Structure Overview**

### 🎯 **Organized Structure** (`/organized/`) - **ACTIVE**

```
e2e/organized/
├── 🔐 auth/                    # Authentication Tests
│   ├── auth-flow.spec.ts       # Complete auth journey
│   ├── login.spec.ts          # Login functionality
│   └── register.spec.ts       # Registration process
│
├── 📄 pages/                   # Page Tests
│   ├── admin.spec.ts          # Admin panel
│   ├── agb.spec.ts            # Terms & Conditions
│   ├── dashboard.spec.ts       # Main dashboard
│   ├── datenschutz.spec.ts     # Privacy policy
│   ├── home.spec.ts           # Homepage
│   ├── impressum.spec.ts      # Imprint
│   ├── login.spec.ts          # Login page
│   ├── register.spec.ts       # Registration page
│   └── verify.spec.ts         # Email verification
│
├── ⚡ features/                # Feature Tests
│   ├── properties-new.spec.ts         # New property creation
│   ├── properties-[id].spec.ts       # Property details
│   ├── properties-[id]-edit.spec.ts  # Property editing
│   └── properties-[id]-maintenance-new.spec.ts # Maintenance creation
│
├── 🛠️ helpers/                 # Test Helpers
│   ├── auth-helpers.ts        # Authentication utilities
│   └── test-data.ts           # Test data generators
│
├── 📊 fixtures/               # Test Data
│   └── (test fixtures and mock data)
│
├── 🐛 debug/                  # Debug Tests
│   ├── debug.spec.ts          # General debugging
│   └── debug-registration.spec.ts # Registration debugging
│
└── global-setup.ts            # ⚙️ Global Test Setup
```

## 🚀 **Test Execution Commands**

### **Run All E2E Tests**
```bash
npx playwright test
```

### **Run by Category**
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

### **Run with UI**
```bash
npx playwright test --ui
```

### **Run in Headed Mode**
```bash
npx playwright test --headed
```

### **Run with Debug**
```bash
npx playwright test --debug
```

## 📊 **Test Categories**

### 🔐 **Authentication Tests** (`/auth/`)
- **Purpose**: Test user authentication flows
- **Files**: `auth-flow.spec.ts`, `login.spec.ts`, `register.spec.ts`
- **Coverage**: Login, registration, session management

### 📄 **Page Tests** (`/pages/`)
- **Purpose**: Test individual pages and static content
- **Files**: All page-specific test files
- **Coverage**: Homepage, dashboard, legal pages, admin

### ⚡ **Feature Tests** (`/features/`)
- **Purpose**: Test core application features
- **Files**: Property management, maintenance features
- **Coverage**: CRUD operations, user workflows

### 🛠️ **Helpers** (`/helpers/`)
- **Purpose**: Shared test utilities and helpers
- **Files**: `auth-helpers.ts`, `test-data.ts`
- **Coverage**: Common functions, test data generation

### 📊 **Fixtures** (`/fixtures/`)
- **Purpose**: Test data and mock objects
- **Files**: Test fixtures and sample data
- **Coverage**: Mock data, test scenarios

### 🐛 **Debug Tests** (`/debug/`)
- **Purpose**: Debugging and troubleshooting
- **Files**: `debug.spec.ts`, `debug-registration.spec.ts`
- **Coverage**: Issue resolution, debugging flows

## 🎯 **Test Features**

- ✅ **Multi-Browser Support** (Chrome, Firefox, Safari)
- ✅ **Mobile Testing** (Responsive design)
- ✅ **Screenshot Capture** (Visual regression)
- ✅ **Video Recording** (Debug sessions)
- ✅ **Parallel Execution** (Fast test runs)
- ✅ **CI/CD Integration** (Automated testing)

## 📈 **Test Reports**

- **HTML Report**: `playwright-report/index.html`
- **Test Results**: `test-results/`
- **Screenshots**: `test-results/*/test-failed-*.png`
- **Videos**: `test-results/*/video.webm`

## 🔧 **Configuration**

- **Playwright Config**: `playwright.config.ts`
- **Global Setup**: `e2e/organized/global-setup.ts`
- **Test Data**: `e2e/organized/fixtures/`

## 🏆 **Benefits of Organization**

1. **📁 Clear Structure** - Easy to find specific tests
2. **🎯 Focused Testing** - Run only what you need
3. **🔧 Better Maintenance** - Organized codebase
4. **📊 Better Reports** - Categorized results
5. **🚀 Faster Development** - Quick test execution

## 🎨 **Test Workflow**

1. **🔍 Identify Test Type** - Choose appropriate category
2. **📝 Write Test** - Follow category structure
3. **🧪 Run Test** - Execute specific category
4. **📊 Review Results** - Check reports and screenshots
5. **🔧 Debug Issues** - Use debug category if needed

## 🚀 **Quick Start**

```bash
# Install dependencies
npm install

# Run all E2E tests
npx playwright test

# Run with UI
npx playwright test --ui

# Run specific category
npx playwright test e2e/organized/auth/

# Generate report
npx playwright show-report
```
