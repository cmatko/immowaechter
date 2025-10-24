/**
 * Risk Helper Functions für ImmoWächter
 * Berechnet Risk Levels, UI Configs und Warning Messages
 */

import { RiskLevel, RiskConsequence } from '../types/database';

// ============================================================================
// COMPONENT TYPE MAPPING
// ============================================================================

/**
 * Maps component custom names to risk consequence component types
 */
export function mapComponentTypeToRisk(customName: string): string {
  const mappings: Record<string, string> = {
    // Gas Heating
    'heizung': 'Gasheizung',
    'gas': 'Gasheizung',
    'gasheizung': 'Gasheizung',
    'gastherme': 'Gasheizung',
    'heizkessel': 'Gasheizung',
    'heat_gas_001': 'Gasheizung',
    'heat_gas': 'Gasheizung',
    
    // Oil Heating
    'heat_oil_001': 'Ölheizung',
    'heat_oil': 'Ölheizung',
    'ölheizung': 'Ölheizung',
    'oil_heating': 'Ölheizung',
    
    // Smoke Detector
    'rauch': 'Rauchmelder',
    'rauchmelder': 'Rauchmelder',
    'rauchwarnmelder': 'Rauchmelder',
    'smoke_001': 'Rauchmelder',
    'smoke_detector': 'Rauchmelder',
    
    // Electrical
    'elektrik': 'Elektrik',
    'elektro': 'Elektrik',
    'fi-schalter': 'Elektrik',
    'fi-schutzschalter': 'Elektrik',
    'electric_001': 'Elektrik',
    'electrical': 'Elektrik',
    
    // Elevator
    'aufzug': 'Aufzug',
    'lift': 'Aufzug',
    'fahrstuhl': 'Aufzug',
    'elevator_001': 'Aufzug',
    'elevator': 'Aufzug',
    
    // Fire Extinguisher
    'feuerlöscher': 'Feuerlöscher',
    'feuerlöschgerät': 'Feuerlöscher',
    'fire_extinguisher_001': 'Feuerlöscher',
    'fire_extinguisher': 'Feuerlöscher',
    
    // Photovoltaic
    'photovoltaik': 'Photovoltaik',
    'pv': 'Photovoltaik',
    'solar': 'Photovoltaik',
    'solaranlage': 'Photovoltaik',
    'solar_001': 'Photovoltaik',
    'photovoltaic': 'Photovoltaik',
    
    // Gutter
    'dach': 'Dachrinne',
    'dachrinne': 'Dachrinne',
    'regenrinne': 'Dachrinne',
    'gutter_001': 'Dachrinne',
    'gutter': 'Dachrinne',
    
    // Backwater Valve
    'wasser': 'Rückstauklappe',
    'rückstau': 'Rückstauklappe',
    'rückstauklappe': 'Rückstauklappe',
    'backwater_001': 'Rückstauklappe',
    'backwater': 'Rückstauklappe',
    
    // Legionella
    'legionellen': 'Legionellenprüfung',
    'legionellenprüfung': 'Legionellenprüfung',
    'legionella_001': 'Legionellenprüfung',
    'legionella': 'Legionellenprüfung',
    
    // Water Filter
    'trinkwasser': 'Trinkwasserfilter',
    'trinkwasserfilter': 'Trinkwasserfilter',
    'wasserfilter': 'Trinkwasserfilter',
    'water_filter_001': 'Trinkwasserfilter',
    'water_filter': 'Trinkwasserfilter'
  };
  
  const normalized = customName.toLowerCase().trim();
  
  // Direct match
  if (mappings[normalized]) {
    return mappings[normalized];
  }
  
  // Partial match
  for (const [key, value] of Object.entries(mappings)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return value;
    }
  }
  
  // Return original if no match
  return customName;
}

/**
 * Creates fallback risk consequences for unknown component types
 */
export function createFallbackRiskConsequences(componentType: string): RiskConsequence {
  return {
    id: 'fallback',
    component_type: componentType,
    death_risk: false,
    injury_risk: false,
    insurance_void: true,
    criminal_liability: false,
    damage_cost_min: 1000,
    damage_cost_max: 50000,
    insurance_reduction_percent: 50,
    criminal_paragraph: null,
    max_fine_eur: 1000,
    max_prison_years: 0,
    warning_yellow: 'Wartung bald fällig. Jetzt Termin vereinbaren.',
    warning_orange: '⚠️ Wartung überfällig! Bitte schnellstmöglich durchführen.',
    warning_red: '🚨 WARNUNG: Wartung stark überfällig! Versicherungsschutz gefährdet.',
    warning_black: '⚫ KRITISCH: Wartung massiv überfällig! Rechtliche Konsequenzen möglich.',
    real_case: null,
    statistic: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
}

// ============================================================================
// RISK LEVEL CALCULATION
// ============================================================================

/**
 * Berechnet das Risk Level basierend auf Wartungsdaten
 * Verwendet die gleiche Logic wie der Database Trigger
 */
export function calculateRiskLevel(
  lastMaintenance: string | null, 
  nextMaintenance: string | null
): RiskLevel {
  if (!nextMaintenance) {
    return 'safe'; // Keine Wartung geplant = sicher
  }

  const today = new Date();
  const nextDate = new Date(nextMaintenance);
  const daysOverdue = Math.floor((today.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));

  // Risk Level Logic (gleiche wie Database Trigger)
  if (daysOverdue < -90) return 'safe';      // Mehr als 3 Monate im Voraus
  if (daysOverdue < 0) return 'warning';     // Bald fällig
  if (daysOverdue < 180) return 'danger';    // Überfällig (bis 6 Monate)
  if (daysOverdue < 365) return 'critical';  // Kritisch (6-12 Monate)
  return 'legal';                            // Legal (über 1 Jahr)
}

/**
 * Berechnet Tage seit/bis nächster Wartung
 * Negativ = noch X Tage, Positiv = X Tage überfällig
 */
export function calculateDaysOverdue(nextMaintenance: string | null): number {
  if (!nextMaintenance) {
    return 0; // Keine Wartung geplant
  }

  const today = new Date();
  const nextDate = new Date(nextMaintenance);
  return Math.floor((today.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
}

// ============================================================================
// RISK CONFIGURATION
// ============================================================================

export interface RiskConfig {
  emoji: string;
  color: string;
  label: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

/**
 * Returns Tailwind CSS Klassen und Emoji für UI basierend auf Risk Level
 */
export function getRiskConfig(level: RiskLevel): RiskConfig {
  const configs: Record<RiskLevel, RiskConfig> = {
    safe: {
      emoji: '🟢',
      color: 'green',
      label: 'Sicher',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-200'
    },
    warning: {
      emoji: '🟡',
      color: 'yellow',
      label: 'Bald fällig',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-200'
    },
    danger: {
      emoji: '🟠',
      color: 'orange',
      label: 'Überfällig',
      bgColor: 'bg-orange-100',
      textColor: 'text-orange-800',
      borderColor: 'border-orange-200'
    },
    critical: {
      emoji: '⚫',
      color: 'black',
      label: 'KRITISCH',
      bgColor: 'bg-black',
      textColor: 'text-white',
      borderColor: 'border-black'
    },
    legal: {
      emoji: '⚖️',
      color: 'purple',
      label: 'RECHTLICH',
      bgColor: 'bg-purple-600',
      textColor: 'text-white',
      borderColor: 'border-gray-700'
    }
  };

  return configs[level];
}

// ============================================================================
// WARNING MESSAGES
// ============================================================================

/**
 * Returns die passende Warning Message basierend auf Risk Level
 */
export function getWarningMessage(consequences: RiskConsequence, level: RiskLevel): string {
  switch (level) {
    case 'safe':
      return 'Wartung aktuell';
    case 'warning':
      return consequences.warning_yellow;
    case 'danger':
      return consequences.warning_orange;
    case 'critical':
      return consequences.warning_red;
    case 'legal':
      return consequences.warning_black;
    default:
      return 'Unbekannter Risk Level';
  }
}

// ============================================================================
// COMPREHENSIVE RISK ASSESSMENT
// ============================================================================

export interface RiskAssessment {
  level: RiskLevel;
  daysOverdue: number;
  config: RiskConfig;
  message: string;
  consequences: {
    death: boolean;
    injury: boolean;
    insurance: boolean;
    criminal: boolean;
    damage: { min: number; max: number };
  };
  realCase?: string;
  statistic?: string;
}

/**
 * Vollständige Risk Assessment für eine Component
 */
export function assessComponentRisk(
  lastMaintenance: string | null,
  nextMaintenance: string | null,
  consequences: RiskConsequence
): RiskAssessment {
  const level = calculateRiskLevel(lastMaintenance, nextMaintenance);
  const daysOverdue = calculateDaysOverdue(nextMaintenance);
  const config = getRiskConfig(level);
  const message = getWarningMessage(consequences, level);

  return {
    level,
    daysOverdue,
    config,
    message,
    consequences: {
      death: consequences.death_risk,
      injury: consequences.injury_risk,
      insurance: consequences.insurance_void,
      criminal: consequences.criminal_liability,
      damage: {
        min: consequences.damage_cost_min || 0,
        max: consequences.damage_cost_max || 0
      }
    },
    realCase: consequences.real_case || undefined,
    statistic: consequences.statistic || undefined
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Formatiert Tage für Display
 */
export function formatDaysOverdue(days: number): string {
  if (days < 0) {
    return `in ${Math.abs(days)} Tagen`;
  } else if (days === 0) {
    return 'heute fällig';
  } else {
    return `${days} Tage überfällig`;
  }
}

/**
 * Prüft ob ein Risk Level kritisch ist
 */
export function isCriticalRisk(level: RiskLevel): boolean {
  return level === 'critical' || level === 'legal';
}

/**
 * Prüft ob ein Risk Level Aufmerksamkeit benötigt
 */
export function needsAttention(level: RiskLevel): boolean {
  return level === 'warning' || level === 'danger' || isCriticalRisk(level);
}

/**
 * Returns Priority Score für Sorting (höher = kritischer)
 */
export function getRiskPriority(level: RiskLevel): number {
  const priorities: Record<RiskLevel, number> = {
    safe: 0,
    warning: 1,
    danger: 2,
    critical: 3,
    legal: 4
  };
  return priorities[level];
}

/**
 * Sortiert Components nach Risk Level
 */
export function sortByRisk<T extends { risk_level?: RiskLevel }>(components: T[]): T[] {
  return components.sort((a, b) => {
    const priorityA = getRiskPriority(a.risk_level || 'safe');
    const priorityB = getRiskPriority(b.risk_level || 'safe');
    return priorityB - priorityA; // Höchste Priorität zuerst
  });
}
