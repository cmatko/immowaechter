# 🌐 E2E Tests - ImmoWächter

## 📁 **Organisierte E2E-Struktur**

```
e2e/
├── organized/                    # 🎯 Organisierte Tests
│   ├── auth/                    # 🔐 Authentication Tests
│   │   ├── auth-flow.spec.ts
│   │   ├── login.spec.ts
│   │   └── register.spec.ts
│   │
│   ├── pages/                   # 📄 Page Tests
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
│   ├── features/                # ⚡ Feature Tests
│   │   ├── properties-new.spec.ts
│   │   ├── properties-[id].spec.ts
│   │   ├── properties-[id]-edit.spec.ts
│   │   └── properties-[id]-maintenance-new.spec.ts
│   │
│   ├── helpers/                 # 🛠️ Test Helpers
│   │   ├── auth-helpers.ts
│   │   └── test-data.ts
│   │
│   ├── fixtures/               # 📊 Test Data
│   │   └── (test fixtures)
│   │
│   ├── debug/                  # 🐛 Debug Tests
│   │   ├── debug.spec.ts
│   │   └── debug-registration.spec.ts
│   │
│   └── global-setup.ts         # ⚙️ Global Setup
│
├── auth/                       # 🔐 Empty (moved to organized/)
├── helpers/                    # 🛠️ Empty (moved to organized/)
├── fixtures/                   # 📊 Empty (moved to organized/)
├── properties/                 # 🏠 Empty (moved to organized/)
├── wartungen/                  # 🔧 Empty (moved to organized/)
└── README.md                   # 📖 This File
```

## 🚀 **Test Categories**

### 🔐 **Authentication Tests** (`/auth/`)
- **Login Flow** - User login process
- **Registration** - User registration
- **Auth Flow** - Complete authentication journey

### 📄 **Page Tests** (`/pages/`)
- **Static Pages** - Home, About, Legal pages
- **Dashboard** - Main dashboard functionality
- **Admin** - Admin panel access

### ⚡ **Feature Tests** (`/features/`)
- **Properties** - Property management
- **Maintenance** - Maintenance scheduling
- **User Features** - Core functionality

### 🛠️ **Helpers** (`/helpers/`)
- **Auth Helpers** - Authentication utilities
- **Test Data** - Test data generators
- **Common Functions** - Shared test utilities

### 📊 **Fixtures** (`/fixtures/`)
- **Test Data** - Predefined test data
- **Mock Objects** - Mock implementations
- **Sample Files** - Test file samples

### 🐛 **Debug Tests** (`/debug/`)
- **Debug Registration** - Registration debugging
- **Debug Flow** - General debugging
- **Troubleshooting** - Issue resolution

## 🎯 **Test Execution**

### **Run All E2E Tests**
```bash
npx playwright test
```

### **Run Specific Categories**
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

## ⚠️ **Important Note**

**All active tests are now in `/organized/` directory!**
- ✅ **Use**: `e2e/organized/` for all test execution
- ❌ **Don't use**: `e2e/auth/`, `e2e/helpers/`, etc. (these are empty)
- 🎯 **Focus**: The organized structure is the main testing directory

### **Run with UI**
```bash
npx playwright test --ui
```

### **Run in Headed Mode**
```bash
npx playwright test --headed
```

## 📊 **Test Reports**

- **HTML Report**: `playwright-report/index.html`
- **Test Results**: `test-results/`
- **Screenshots**: `test-results/*/test-failed-*.png`
- **Videos**: `test-results/*/video.webm`

## 🔧 **Configuration**

- **Playwright Config**: `playwright.config.ts`
- **Global Setup**: `e2e/organized/global-setup.ts`
- **Test Data**: `e2e/organized/fixtures/`

## 🎨 **Test Features**

- ✅ **Multi-Browser Support** (Chrome, Firefox, Safari)
- ✅ **Mobile Testing** (Responsive design)
- ✅ **Screenshot Capture** (Visual regression)
- ✅ **Video Recording** (Debug sessions)
- ✅ **Parallel Execution** (Fast test runs)
- ✅ **CI/CD Integration** (Automated testing)

## 🏆 **Benefits of Organization**

1. **📁 Clear Structure** - Easy to find specific tests
2. **🎯 Focused Testing** - Run only what you need
3. **🔧 Better Maintenance** - Organized codebase
4. **📊 Better Reports** - Categorized results
5. **🚀 Faster Development** - Quick test execution
