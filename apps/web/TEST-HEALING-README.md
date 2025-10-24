# 🧪 Test Healing System für ImmoWächter

Ein interaktives Self-Healing Test-System, das automatisch Test-Fehler erkennt, Fix-Strategien generiert und Learnings extrahiert.

## 🚀 Features

- **Automatische Test-Generierung** mit Claude API
- **Interaktive Fehlerbehebung** mit 3 Fix-Strategien
- **Pattern Detection** für wiederkehrende Probleme
- **Linear Task Creation** basierend auf Learnings
- **Backup & Rollback** für sichere Änderungen

## 📋 Verfügbare Scripts

### Test Generation
```bash
# Generiere Test für eine Komponente
npm run test:auto-gen -- components/RiskCard.tsx

# Generiere Test für eine Seite
npm run test:auto-gen -- app/page.tsx

# Generiere Test für API Route
npm run test:auto-gen -- app/api/properties/route.ts
```

### Interactive Healing
```bash
# Starte interaktives Healing
npm run test:interactive

# Dry Run (zeige was passieren würde)
npm run test:interactive -- --dry-run

# Verbose Output
npm run test:interactive -- --verbose
```

### Learnings & Tasks
```bash
# Analysiere Learnings
npm run test:analyze-learnings

# Erstelle Linear Tasks
npm run test:create-tasks

# Exportiere Analyse
npm run test:analyze-learnings -- --export
```

### Backup & Rollback
```bash
# Zeige Backup-Status
npm run test:rollback -- --status

# Stelle alle Änderungen zurück
npm run test:rollback

# Dry Run für Rollback
npm run test:rollback -- --dry-run
```

## 🔧 Setup

### 1. Environment Variables
```bash
# Füge zu .env hinzu:
ANTHROPIC_API_KEY="your-anthropic-api-key"
LINEAR_API_KEY="your-linear-api-key"  # Optional
```

### 2. Verzeichnisstruktur
Das System erstellt automatisch:
```
.test-healing/
├── sessions/           # Session-Daten (JSON)
├── learnings/          # Aggregierte Learnings
└── tasks-created.json # Erstellte Linear Tasks

tests/
└── auto-generated/     # Generierte Tests
```

## 🎯 Workflow

### 1. Test Generation
```bash
# Generiere Test für eine Komponente
npm run test:auto-gen -- components/RiskCard.tsx
```

**Was passiert:**
- Analysiert Dateistruktur (Imports, Exports, Props)
- Verwendet Claude API für umfassenden Test
- Speichert in `tests/auto-generated/`

### 2. Interactive Healing
```bash
# Starte Healing-Prozess
npm run test:interactive
```

**Schritte:**
1. **Tests ausführen** - Erkennt Fehler
2. **Claude-Analyse** - Generiert 3 Fix-Strategien
3. **Strategie-Auswahl** - Benutzer wählt Ansatz
4. **Fix-Review** - Zeigt Diffs zur Freigabe
5. **Anwendung** - Wendet genehmigte Fixes an
6. **Re-Test** - Führt Tests erneut aus
7. **Learnings** - Extrahiert Patterns

### 3. Pattern Detection
Das System erkennt automatisch:

**Recurring Patterns:**
- Datei mehrfach modifiziert → Refactoring-Kandidat
- Gleicher Fehlertyp → Systemisches Problem
- Fehlende Test-Coverage → Coverage-Gap

**Tech Debt Opportunities:**
- Refactoring-Kandidaten
- Standardisierungs-Bedarf
- Performance-Optimierungen

### 4. Linear Task Creation
```bash
# Erstelle Tasks aus Learnings
npm run test:create-tasks
```

**Task-Typen:**
- 🔴 **Urgent**: Kritische Patterns
- 🟠 **High**: Wiederkehrende Probleme
- 🟡 **Medium**: Tech Debt
- 🟢 **Low**: Verbesserungen

## 📊 Beispiel-Session

```bash
🧪 Running tests...
❌ 3 tests failed

🤖 Analyzing failures with Claude...

📋 Generated 3 fix strategies:

1. Conservative (Low Risk) - 3 fixes, ~15 min
   Minimal changes to selectors only
   
2. Aggressive (Medium Risk) - 2 fixes, ~30 min
   Refactor component structure for better testability
   
3. Hybrid (Low-Medium Risk) - 4 fixes, ~20 min
   Fix selectors + add missing data-testids

👉 Choose strategy [1/2/3] or [q]uit: 3

🔧 Reviewing fixes from Hybrid strategy...

Fix 1/4: components/RiskCard.tsx
  Reason: Add data-testid for test stability
  
  [Shows diff]
  
👉 Apply? [y/n/q/d]: y
✅ Applied (backup created)

🔄 Re-running tests...
✅ All tests passed!

📊 Session Summary:
- Iterations: 1
- Tests fixed: 3/3 (100%)
- Strategy: Hybrid
- Files modified: 2
- Time: 8 minutes

🧠 Learnings Extracted:

Recurring Patterns:
  • Missing data-testid in 3 components
  
Test Coverage Gaps:
  • No tests for error handling in RiskCard
  
Tech Debt Opportunities:
  • Standardize data-testid naming convention
  
💡 Suggested Linear Tasks:

Task 1: "Add data-testid standard to component library"
  Priority: High
  Reason: Missing in 3 components, caused 3 test failures
  Estimated: 2-3 hours
  
Task 2: "Add error state tests for RiskCard"
  Priority: Medium
  Reason: Coverage gap identified
  Estimated: 1-2 hours

👉 Create these tasks in Linear? [y/n]: y

Creating tasks...
✅ Created: KOT-116 - Add data-testid standard
   https://linear.app/kotto/issue/KOT-116
✅ Created: KOT-117 - Add error state tests
   https://linear.app/kotto/issue/KOT-117

🎉 Session complete! Check Linear for new tasks.
```

## 🔒 Sicherheit

- **Backup-First**: Alle Änderungen werden gesichert
- **Benutzerfreigabe**: Keine automatischen Änderungen
- **Rollback**: Einfache Wiederherstellung möglich
- **Dry-Run**: Teste ohne Änderungen

## 🎛️ Konfiguration

### Max Iterations
```typescript
// In interactive-healing.ts
maxIterations: 3  // Max 3 Healing-Iterationen
```

### Claude Model
```typescript
// In generate-test.ts und interactive-healing.ts
model: 'claude-3-5-sonnet-20241022'
```

### Linear Team
```typescript
// In learnings-analyzer.ts
team: 'Kotto'
project: 'ImmoWächter'
```

## 🐛 Troubleshooting

### Claude API Fehler
```bash
# Prüfe API Key
echo $ANTHROPIC_API_KEY

# Teste Verbindung
npm run test:auto-gen -- --help
```

### Backup-Probleme
```bash
# Zeige Backup-Status
npm run test:rollback -- --status

# Stelle alles zurück
npm run test:rollback
```

### Linter-Fehler
```bash
# Prüfe TypeScript
npx tsc --noEmit

# Prüfe ESLint
npm run lint
```

## 📈 Metriken

Das System sammelt automatisch:
- **Session-Daten**: Timestamps, Strategien, Ergebnisse
- **Pattern-Frequenz**: Wie oft treten Probleme auf
- **Fix-Erfolg**: Erfolgsrate der Strategien
- **Tech Debt**: Identifizierte Verbesserungen

## 🔮 Roadmap

- [ ] **Linear API Integration** - Echte Task-Erstellung
- [ ] **Git Integration** - Automatische Commits
- [ ] **Slack Notifications** - Team-Benachrichtigungen
- [ ] **Metrics Dashboard** - Visualisierung der Learnings
- [ ] **Custom Strategies** - Benutzerdefinierte Fix-Ansätze

## 🤝 Contributing

1. Fork das Repository
2. Erstelle Feature-Branch
3. Implementiere Änderungen
4. Teste mit `npm run test:interactive -- --dry-run`
5. Erstelle Pull Request

## 📄 Lizenz

MIT License - siehe LICENSE Datei für Details.
