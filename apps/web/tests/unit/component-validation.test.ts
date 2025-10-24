/**
 * Component Type Validation Tests
 */

import { describe, test, expect } from '@jest/globals';
import { isValidComponentType, validateComponent, isInvalidComponentType } from '../../lib/component-types';

describe('Component Type Validation', () => {
  test('accepts valid component types', () => {
    expect(isValidComponentType('Heizung')).toBe(true);
    expect(isValidComponentType('Gasheizung')).toBe(true);
    expect(isValidComponentType('Feuerlöscher')).toBe(true);
    expect(isValidComponentType('Elektrik')).toBe(true);
    expect(isValidComponentType('Aufzug')).toBe(true);
  });

  test('rejects invalid component types', () => {
    expect(isValidComponentType('BUILD_ROOF_001')).toBe(false);
    expect(isValidComponentType('test_component')).toBe(false);
    expect(isValidComponentType('')).toBe(false);
    expect(isValidComponentType('undefined')).toBe(false);
    expect(isValidComponentType('123')).toBe(false);
  });

  test('identifies invalid component types', () => {
    expect(isInvalidComponentType('BUILD_ROOF_001')).toBe(true);
    expect(isInvalidComponentType('test_component')).toBe(true);
    expect(isInvalidComponentType('component_123')).toBe(true);
    expect(isInvalidComponentType('1component')).toBe(true);
    expect(isInvalidComponentType('a')).toBe(true);
  });

  test('validates complete component object', () => {
    const validComponent = {
      name: 'Gasheizung EG',
      type: 'Gasheizung',
      last_maintenance: '2024-01-01',
      interval_months: 12
    };

    const result = validateComponent(validComponent);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('rejects component with invalid type', () => {
    const invalidComponent = {
      name: 'Test',
      type: 'BUILD_ROOF_001',
      last_maintenance: '2024-01-01'
    };

    const result = validateComponent(invalidComponent);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(expect.stringContaining('Invalid component type'));
  });

  test('rejects component without name', () => {
    const invalidComponent = {
      name: '',
      type: 'Heizung',
      last_maintenance: '2024-01-01'
    };

    const result = validateComponent(invalidComponent);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Component name is required');
  });

  test('rejects component without maintenance dates', () => {
    const invalidComponent = {
      name: 'Test Component',
      type: 'Heizung'
      // No maintenance dates
    };

    const result = validateComponent(invalidComponent);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('At least one maintenance date is required');
  });

  test('rejects component with invalid interval', () => {
    const invalidComponent = {
      name: 'Test Component',
      type: 'Heizung',
      last_maintenance: '2024-01-01',
      interval_months: -5
    };

    const result = validateComponent(invalidComponent);
    expect(result.valid).toBe(false);
    expect(result.errors).toContain('Interval must be a positive number');
  });
});




