/**
 * Österreich-spezifische Helper Functions
 */

import { AUSTRIA_SPECIFIC } from './constants';

/**
 * Format currency für Österreich
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('de-AT', {
    style: 'currency',
    currency: 'EUR'
  }).format(amount);
}

/**
 * Format date für Österreich
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('de-AT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date));
}

/**
 * Format date with time für Österreich
 */
export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('de-AT', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date));
}

/**
 * Get emergency number
 */
export function getEmergencyNumber(type: 'fire' | 'police' | 'ambulance' | 'gas'): string {
  return AUSTRIA_SPECIFIC.emergency[type];
}

/**
 * Get legal reference für Österreich
 */
export function getLegalReference(type: 'negligence' | 'bodily_harm' | 'drinking_water' | 'building' | 'electrical'): string {
  const refs = {
    negligence: AUSTRIA_SPECIFIC.legalReferences.negligence,
    bodily_harm: AUSTRIA_SPECIFIC.legalReferences.bodilyHarm,
    drinking_water: AUSTRIA_SPECIFIC.legalReferences.drinkingWater,
    building: AUSTRIA_SPECIFIC.legalReferences.buildingCode,
    electrical: AUSTRIA_SPECIFIC.legalReferences.electrical
  };
  return refs[type];
}

/**
 * Get Austrian city name
 */
export function getAustrianCity(city: string): string {
  const cityMap: Record<string, string> = {
    'München': 'Wien',
    'Berlin': 'Graz',
    'Hamburg': 'Salzburg',
    'Köln': 'Linz',
    'Frankfurt': 'Innsbruck',
    'Stuttgart': 'Klagenfurt',
    'Düsseldorf': 'Steyr',
    'Leipzig': 'Wels'
  };
  
  return cityMap[city] || city;
}

/**
 * Format Austrian phone number
 */
export function formatAustrianPhone(phone: string): string {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '');
  
  // Format as Austrian phone number
  if (digits.startsWith('43')) {
    return `+${digits.slice(0, 2)} ${digits.slice(2, 3)} ${digits.slice(3, 7)} ${digits.slice(7)}`;
  }
  
  return phone;
}

/**
 * Get Austrian legal disclaimer
 */
export function getAustrianLegalDisclaimer(): string {
  return AUSTRIA_SPECIFIC.legal.disclaimer;
}

/**
 * Get Austrian data protection notice
 */
export function getAustrianDataProtectionNotice(): string {
  return AUSTRIA_SPECIFIC.legal.dataProtection;
}





