/**
 * ImmoWächter Specific Healing Rules
 * 
 * Definiert sichere und gefährliche Patterns für das Smart Auto-Healing System.
 * 
 * Diese Regeln sind spezifisch für ImmoWächter und berücksichtigen:
 * - Österreichische Immobilien-Gesetze (OIB)
 * - Finanzielle Berechnungen (Subsidies, Commissions)
 * - Sicherheitskritische Bereiche (Authentication, Payments)
 * - Test-Daten-Updates
 */

export interface HealingRule {
  name: string;
  pattern: RegExp;
  reason: string;
  autoHeal: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface RuleSet {
  safePatterns: HealingRule[];
  dangerousPatterns: HealingRule[];
  businessLogicPatterns: HealingRule[];
}

/**
 * ImmoWächter Specific Rules
 * 
 * Diese Regeln basieren auf der ImmoWächter-Domäne:
 * - OIB (Österreichisches Institut für Bautechnik) Intervalle
 * - Subsidy-Berechnungen
 * - Commission-Berechnungen  
 * - Authentication & Security
 * - Payment-Flows
 */
export const IMMOWACHTER_RULES: RuleSet = {
  
  // ✅ SAFE TO AUTO-HEAL
  safePatterns: [
    {
      name: 'oib-intervals',
      pattern: /HEATING_INTERVAL|CHIMNEY_INTERVAL|ELEVATOR_INTERVAL|GAS_INTERVAL/,
      reason: 'OIB legal data updates are safe and standardized',
      autoHeal: true,
      priority: 'high'
    },
    {
      name: 'subsidy-fixtures',
      pattern: /fixtures\/subsidies|test-data|mock-data|sample-data/,
      reason: 'Test data fixtures are safe to update',
      autoHeal: true,
      priority: 'high'
    },
    {
      name: 'timeout-adjustments',
      pattern: /timeout|waitFor|expect.*toBeVisible|expect.*toHaveText/,
      reason: 'Timing adjustments are safe for test stability',
      autoHeal: true,
      priority: 'medium'
    },
    {
      name: 'selector-updates',
      pattern: /data-testid|getByRole|getByText|getByLabelText/,
      reason: 'Selector updates after UI changes are safe',
      autoHeal: true,
      priority: 'medium'
    },
    {
      name: 'component-props',
      pattern: /props|interface.*Props|type.*Props/,
      reason: 'Component prop updates are safe',
      autoHeal: true,
      priority: 'low'
    },
    {
      name: 'styling-updates',
      pattern: /className|style|css|tailwind/,
      reason: 'Styling updates are safe',
      autoHeal: true,
      priority: 'low'
    }
  ],
  
  // ❌ NEVER AUTO-HEAL - DANGEROUS PATTERNS
  dangerousPatterns: [
    {
      name: 'subsidy-calculation',
      pattern: /calculateSubsidy|estimateCost|calculateCommission|computePrice/,
      reason: 'Financial calculations need manual review - affects money',
      autoHeal: false,
      priority: 'high'
    },
    {
      name: 'authentication',
      pattern: /login|auth|session|token|jwt|password|credentials/,
      reason: 'Security-critical authentication code',
      autoHeal: false,
      priority: 'high'
    },
    {
      name: 'payment-flow',
      pattern: /payment|stripe|checkout|billing|invoice|transaction/,
      reason: 'Payment-related code affects money flow',
      autoHeal: false,
      priority: 'high'
    },
    {
      name: 'user-data',
      pattern: /user.*data|personal.*info|privacy|gdpr/,
      reason: 'User data handling requires careful review',
      autoHeal: false,
      priority: 'high'
    },
    {
      name: 'database-operations',
      pattern: /database|db\.|prisma\.|sql|query|mutation/,
      reason: 'Database operations can affect data integrity',
      autoHeal: false,
      priority: 'medium'
    },
    {
      name: 'api-endpoints',
      pattern: /api\/|route\.ts|endpoint|controller/,
      reason: 'API endpoints affect external integrations',
      autoHeal: false,
      priority: 'medium'
    }
  ],
  
  // ⚠️ BUSINESS LOGIC - REQUIRES CAREFUL REVIEW
  businessLogicPatterns: [
    {
      name: 'property-valuation',
      pattern: /valuation|appraisal|market.*value|property.*price/,
      reason: 'Property valuation logic affects business decisions',
      autoHeal: false,
      priority: 'high'
    },
    {
      name: 'maintenance-scheduling',
      pattern: /maintenance.*schedule|inspection.*date|next.*maintenance/,
      reason: 'Maintenance scheduling affects legal compliance',
      autoHeal: false,
      priority: 'medium'
    },
    {
      name: 'risk-assessment',
      pattern: /risk.*score|risk.*level|risk.*calculation/,
      reason: 'Risk assessment affects property management decisions',
      autoHeal: false,
      priority: 'medium'
    },
    {
      name: 'notification-rules',
      pattern: /notification.*rule|alert.*condition|trigger.*condition/,
      reason: 'Notification rules affect user experience',
      autoHeal: false,
      priority: 'low'
    }
  ]
};

/**
 * Check if a pattern matches any rule
 */
export function matchesRule(pattern: string, rule: HealingRule): boolean {
  return rule.pattern.test(pattern);
}

/**
 * Find matching rules for a given pattern
 */
export function findMatchingRules(pattern: string): {
  safe: HealingRule[];
  dangerous: HealingRule[];
  businessLogic: HealingRule[];
} {
  return {
    safe: IMMOWACHTER_RULES.safePatterns.filter(rule => matchesRule(pattern, rule)),
    dangerous: IMMOWACHTER_RULES.dangerousPatterns.filter(rule => matchesRule(pattern, rule)),
    businessLogic: IMMOWACHTER_RULES.businessLogicPatterns.filter(rule => matchesRule(pattern, rule))
  };
}

/**
 * Get safety level for a pattern
 */
export function getSafetyLevel(pattern: string): {
  level: 'safe' | 'dangerous' | 'business-logic' | 'unknown';
  rules: HealingRule[];
  reason: string;
} {
  const matches = findMatchingRules(pattern);
  
  if (matches.dangerous.length > 0) {
    return {
      level: 'dangerous',
      rules: matches.dangerous,
      reason: matches.dangerous[0].reason
    };
  }
  
  if (matches.businessLogic.length > 0) {
    return {
      level: 'business-logic',
      rules: matches.businessLogic,
      reason: matches.businessLogic[0].reason
    };
  }
  
  if (matches.safe.length > 0) {
    return {
      level: 'safe',
      rules: matches.safe,
      reason: matches.safe[0].reason
    };
  }
  
  return {
    level: 'unknown',
    rules: [],
    reason: 'No matching rules found'
  };
}

/**
 * Check if auto-healing is allowed for a pattern
 */
export function isAutoHealAllowed(pattern: string): {
  allowed: boolean;
  reason: string;
  confidence: number;
} {
  const safety = getSafetyLevel(pattern);
  
  if (safety.level === 'dangerous') {
    return {
      allowed: false,
      reason: `DANGEROUS: ${safety.reason}`,
      confidence: 1.0
    };
  }
  
  if (safety.level === 'business-logic') {
    return {
      allowed: false,
      reason: `BUSINESS LOGIC: ${safety.reason}`,
      confidence: 0.8
    };
  }
  
  if (safety.level === 'safe') {
    return {
      allowed: true,
      reason: `SAFE: ${safety.reason}`,
      confidence: 0.9
    };
  }
  
  return {
    allowed: false,
    reason: 'UNKNOWN: No matching rules - manual review required',
    confidence: 0.3
  };
}

/**
 * Get all rules for debugging/reporting
 */
export function getAllRules(): RuleSet {
  return IMMOWACHTER_RULES;
}

/**
 * Validate rules configuration
 */
export function validateRules(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  // Check for duplicate rule names
  const allRules = [
    ...IMMOWACHTER_RULES.safePatterns,
    ...IMMOWACHTER_RULES.dangerousPatterns,
    ...IMMOWACHTER_RULES.businessLogicPatterns
  ];
  
  const names = allRules.map(rule => rule.name);
  const duplicates = names.filter((name, index) => names.indexOf(name) !== index);
  
  if (duplicates.length > 0) {
    errors.push(`Duplicate rule names: ${duplicates.join(', ')}`);
  }
  
  // Check for invalid regex patterns
  for (const rule of allRules) {
    try {
      new RegExp(rule.pattern);
    } catch (error) {
      errors.push(`Invalid regex in rule '${rule.name}': ${error}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}
