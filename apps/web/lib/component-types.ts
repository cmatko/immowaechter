/**
 * Component Type Validation System
 * Definiert gültige Component Types und Validation Logic
 */

export const VALID_COMPONENT_TYPES = [
  'Heizung',
  'Gasheizung',
  'Elektrik',
  'Feuerlöscher',
  'Aufzug',
  'Dach',
  'Fassade',
  'Rauchmelder',
  'Blitzschutz',
  'Legionellenprüfung',
  'Rückstauklappe',
  'Wasserleitung',
  'Abwasserleitung',
  'Lüftung',
  'Klimaanlage',
  'Photovoltaik',
  'Trinkwasserfilter'
] as const;

export type ComponentType = typeof VALID_COMPONENT_TYPES[number];

export function isValidComponentType(type: string): type is ComponentType {
  return VALID_COMPONENT_TYPES.includes(type as ComponentType);
}

export function validateComponent(component: any): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Name required
  if (!component.name || component.name.trim() === '') {
    errors.push('Component name is required');
  }

  // Type must be valid
  if (!component.type || !isValidComponentType(component.type)) {
    errors.push(`Invalid component type: "${component.type}". Must be one of: ${VALID_COMPONENT_TYPES.join(', ')}`);
  }

  // At least one maintenance date
  if (!component.last_maintenance && !component.next_maintenance) {
    errors.push('At least one maintenance date is required');
  }

  // Interval must be positive number
  if (component.interval_months && (isNaN(component.interval_months) || component.interval_months <= 0)) {
    errors.push('Interval must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export function isInvalidComponentType(type: string): boolean {
  // Check for suspicious patterns
  return (
    type.startsWith('BUILD_') ||
    type.startsWith('test_') ||
    type.includes('_') ||
    /^\d/.test(type) ||
    type.length < 2
  );
}

export function getComponentTypeDisplayName(type: string): string {
  const displayNames: Record<string, string> = {
    'Gasheizung': 'Gasheizung',
    'Heizung': 'Heizung',
    'Elektrik': 'Elektrik',
    'Feuerlöscher': 'Feuerlöscher',
    'Aufzug': 'Aufzug',
    'Dach': 'Dach',
    'Fassade': 'Fassade',
    'Rauchmelder': 'Rauchmelder',
    'Blitzschutz': 'Blitzschutz',
    'Legionellenprüfung': 'Legionellenprüfung',
    'Rückstauklappe': 'Rückstauklappe',
    'Wasserleitung': 'Wasserleitung',
    'Abwasserleitung': 'Abwasserleitung',
    'Lüftung': 'Lüftung',
    'Klimaanlage': 'Klimaanlage',
    'Photovoltaik': 'Photovoltaik',
    'Trinkwasserfilter': 'Trinkwasserfilter'
  };

  return displayNames[type] || type;
}




