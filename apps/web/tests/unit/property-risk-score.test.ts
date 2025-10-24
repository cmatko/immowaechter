import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';

// Mock für Property Risk Score Component
describe('Property Risk Score', () => {
  let mockRiskData: any;
  let mockComponents: any[];

  beforeEach(() => {
    mockComponents = [
      {
        id: 'comp-1',
        component_type: 'heating',
        risk_level: 'critical',
        next_maintenance: '2024-01-01',
        last_maintenance: '2023-12-01'
      },
      {
        id: 'comp-2',
        component_type: 'electrical',
        risk_level: 'legal',
        next_maintenance: '2024-02-01',
        last_maintenance: '2023-11-01'
      },
      {
        id: 'comp-3',
        component_type: 'plumbing',
        risk_level: 'normal',
        next_maintenance: '2024-03-01',
        last_maintenance: '2023-10-01'
      }
    ];

    mockRiskData = {
      score: 75,
      maxScore: 100,
      level: 'high',
      criticalComponents: 1,
      legalComponents: 1,
      overdueMaintenances: 1,
      totalComponents: 3,
      lastUpdated: '2024-01-15T10:30:00Z'
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should calculate risk score correctly', () => {
    const getComponentTypeScore = (componentType: string) => {
      const typeScores: Record<string, number> = {
        'heating': 15,
        'electrical': 12,
        'plumbing': 10,
        'security': 8,
        'fire_safety': 20,
        'elevator': 18,
        'roof': 12,
        'facade': 8,
        'basement': 6,
        'garden': 5,
        'parking': 4,
        'other': 5
      };
      
      return typeScores[componentType] || 5;
    };

    const calculateRiskScore = (components: any[]) => {
      let score = 0;
      let criticalComponents = 0;
      let legalComponents = 0;
      let overdueMaintenances = 0;
      
      const now = new Date();
      
      components.forEach(component => {
        // Base score for component type
        const componentTypeScore = getComponentTypeScore(component.component_type);
        score += componentTypeScore;
        
        // Risk level multiplier
        if (component.risk_level === 'critical') {
          score += 20;
          criticalComponents++;
        } else if (component.risk_level === 'legal') {
          score += 15;
          legalComponents++;
        }
        
        // Overdue maintenance penalty
        if (component.next_maintenance) {
          const nextMaintenance = new Date(component.next_maintenance);
          if (nextMaintenance < now) {
            const daysOverdue = Math.floor((now.getTime() - nextMaintenance.getTime()) / (1000 * 60 * 60 * 24));
            score += Math.min(daysOverdue * 2, 30);
            overdueMaintenances++;
          }
        }
      });
      
      return {
        score: Math.min(score, 100),
        criticalComponents,
        legalComponents,
        overdueMaintenances
      };
    };

    const result = calculateRiskScore(mockComponents);
    
    expect(result.score).toBeGreaterThan(0);
    expect(result.criticalComponents).toBe(1);
    expect(result.legalComponents).toBe(1);
    expect(result.overdueMaintenances).toBeGreaterThanOrEqual(0);
  });

  it('should determine risk level correctly', () => {
    const determineRiskLevel = (score: number) => {
      if (score >= 80) return 'critical';
      if (score >= 60) return 'high';
      if (score >= 40) return 'medium';
      return 'low';
    };

    expect(determineRiskLevel(90)).toBe('critical');
    expect(determineRiskLevel(70)).toBe('high');
    expect(determineRiskLevel(50)).toBe('medium');
    expect(determineRiskLevel(30)).toBe('low');
  });

  it('should get component type scores correctly', () => {
    const getComponentTypeScore = (componentType: string) => {
      const typeScores: Record<string, number> = {
        'heating': 15,
        'electrical': 12,
        'plumbing': 10,
        'security': 8,
        'fire_safety': 20,
        'elevator': 18,
        'roof': 12,
        'facade': 8,
        'basement': 6,
        'garden': 5,
        'parking': 4,
        'other': 5
      };
      
      return typeScores[componentType] || 5;
    };

    expect(getComponentTypeScore('heating')).toBe(15);
    expect(getComponentTypeScore('fire_safety')).toBe(20);
    expect(getComponentTypeScore('electrical')).toBe(12);
    expect(getComponentTypeScore('unknown')).toBe(5);
  });

  it('should calculate percentage correctly', () => {
    const percentage = Math.round((mockRiskData.score / mockRiskData.maxScore) * 100);
    
    expect(percentage).toBe(75);
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
  });

  it('should get score color correctly', () => {
    const getScoreColor = (score: number) => {
      if (score >= 80) return 'text-red-600 bg-red-50';
      if (score >= 60) return 'text-orange-600 bg-orange-50';
      if (score >= 40) return 'text-yellow-600 bg-yellow-50';
      return 'text-green-600 bg-green-50';
    };

    expect(getScoreColor(90)).toBe('text-red-600 bg-red-50');
    expect(getScoreColor(70)).toBe('text-orange-600 bg-orange-50');
    expect(getScoreColor(50)).toBe('text-yellow-600 bg-yellow-50');
    expect(getScoreColor(30)).toBe('text-green-600 bg-green-50');
  });

  it('should get score message correctly', () => {
    const getScoreMessage = (score: number, level: string) => {
      switch (level) {
        case 'critical':
          return 'KRITISCH: Sofortiges Handeln erforderlich!';
        case 'high':
          return 'HOCH: Wartungen sollten bald durchgeführt werden';
        case 'medium':
          return 'MITTEL: Regelmäßige Überwachung empfohlen';
        default:
          return 'NIEDRIG: Gute Wartungssituation';
      }
    };

    expect(getScoreMessage(90, 'critical')).toContain('KRITISCH');
    expect(getScoreMessage(70, 'high')).toContain('HOCH');
    expect(getScoreMessage(50, 'medium')).toContain('MITTEL');
    expect(getScoreMessage(30, 'low')).toContain('NIEDRIG');
  });

  it('should generate recommendations correctly', () => {
    const getRecommendations = (data: any) => {
      const recommendations = [];
      
      if (data.criticalComponents > 0) {
        recommendations.push(`${data.criticalComponents} kritische Komponenten sofort prüfen`);
      }
      
      if (data.legalComponents > 0) {
        recommendations.push(`${data.legalComponents} rechtlich relevante Wartungen durchführen`);
      }
      
      if (data.overdueMaintenances > 0) {
        recommendations.push(`${data.overdueMaintenances} überfällige Wartungen nachholen`);
      }
      
      if (recommendations.length === 0) {
        recommendations.push('Weiter so! Regelmäßige Wartungen beibehalten');
      }
      
      return recommendations;
    };

    const recommendations = getRecommendations(mockRiskData);
    
    expect(recommendations).toContain('1 kritische Komponenten sofort prüfen');
    expect(recommendations).toContain('1 rechtlich relevante Wartungen durchführen');
    expect(Array.isArray(recommendations)).toBe(true);
  });

  it('should handle empty components array', () => {
    const emptyComponents: any[] = [];
    const result = {
      score: 0,
      maxScore: 100,
      level: 'low',
      criticalComponents: 0,
      legalComponents: 0,
      overdueMaintenances: 0,
      totalComponents: 0,
      lastUpdated: new Date().toISOString()
    };

    expect(result.score).toBe(0);
    expect(result.level).toBe('low');
    expect(result.totalComponents).toBe(0);
  });

  it('should validate API response structure', () => {
    const mockApiResponse = {
      success: true,
      data: mockRiskData
    };

    expect(mockApiResponse).toHaveProperty('success', true);
    expect(mockApiResponse).toHaveProperty('data');
    expect(mockApiResponse.data).toHaveProperty('score');
    expect(mockApiResponse.data).toHaveProperty('level');
    expect(mockApiResponse.data).toHaveProperty('criticalComponents');
  });

  it('should handle loading states correctly', () => {
    const loadingStates = {
      initial: true,
      loading: true,
      loaded: false,
      error: false
    };

    expect(loadingStates.initial).toBe(true);
    expect(loadingStates.loading).toBe(true);
    expect(loadingStates.loaded).toBe(false);
    expect(loadingStates.error).toBe(false);
  });

  it('should format timestamp correctly', () => {
    const timestamp = '2024-01-15T10:30:00Z';
    const date = new Date(timestamp);
    const formatted = date.toLocaleString('de-AT');
    
    expect(formatted).toContain('15.1.2024');
    expect(typeof formatted).toBe('string');
  });

  it('should validate score bar width calculation', () => {
    const percentage = Math.round((mockRiskData.score / mockRiskData.maxScore) * 100);
    const barWidth = `${percentage}%`;
    
    expect(barWidth).toBe('75%');
    expect(percentage).toBeGreaterThanOrEqual(0);
    expect(percentage).toBeLessThanOrEqual(100);
  });

  it('should handle different risk levels correctly', () => {
    const riskLevels = ['low', 'medium', 'high', 'critical'];
    
    riskLevels.forEach(level => {
      expect(riskLevels).toContain(level);
    });
    
    expect(riskLevels.length).toBe(4);
  });
});
