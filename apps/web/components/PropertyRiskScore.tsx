'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, TrendingUp, TrendingDown } from 'lucide-react';

interface PropertyRiskScoreProps {
  propertyId: string;
  propertyName: string;
}

interface RiskScoreData {
  score: number;
  maxScore: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  criticalComponents: number;
  legalComponents: number;
  overdueMaintenances: number;
  totalComponents: number;
  lastUpdated: string;
}

export function PropertyRiskScore({ propertyId, propertyName }: PropertyRiskScoreProps) {
  const [riskData, setRiskData] = useState<RiskScoreData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskScore();
  }, [propertyId]);

  const fetchRiskScore = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/property-risk-score?propertyId=${propertyId}`);
      const data = await response.json();
      
      if (data.success) {
        setRiskData(data.data);
      }
    } catch (error) {
      console.error('Error fetching risk score:', error);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-red-600 bg-red-50';
    if (score >= 60) return 'text-orange-600 bg-orange-50';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getScoreIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertTriangle className="w-6 h-6 text-red-600" />;
      case 'high':
        return <AlertTriangle className="w-6 h-6 text-orange-600" />;
      case 'medium':
        return <Shield className="w-6 h-6 text-yellow-600" />;
      default:
        return <Shield className="w-6 h-6 text-green-600" />;
    }
  };

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

  const getRecommendations = (data: RiskScoreData) => {
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

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-24 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!riskData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center text-gray-500">
          <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p>Keine Risikodaten verfügbar</p>
        </div>
      </div>
    );
  }

  const percentage = Math.round((riskData.score / riskData.maxScore) * 100);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            🏠 {propertyName}
          </h3>
          <p className="text-sm text-gray-600">
            Risiko-Score: {riskData.score}/{riskData.maxScore} Punkte
          </p>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getScoreColor(percentage)}`}>
          {getScoreIcon(riskData.level)}
          <span className="text-sm font-medium">
            {percentage}%
          </span>
        </div>
      </div>

      {/* Score Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Risiko-Score</span>
          <span className="text-sm text-gray-600">{percentage}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full transition-all duration-500 ${
              percentage >= 80 ? 'bg-red-500' :
              percentage >= 60 ? 'bg-orange-500' :
              percentage >= 40 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      {/* Status Message */}
      <div className={`p-4 rounded-lg mb-4 ${
        riskData.level === 'critical' ? 'bg-red-50 border border-red-200' :
        riskData.level === 'high' ? 'bg-orange-50 border border-orange-200' :
        riskData.level === 'medium' ? 'bg-yellow-50 border border-yellow-200' :
        'bg-green-50 border border-green-200'
      }`}>
        <div className="flex items-center gap-2">
          {getScoreIcon(riskData.level)}
          <span className={`font-medium ${
            riskData.level === 'critical' ? 'text-red-800' :
            riskData.level === 'high' ? 'text-orange-800' :
            riskData.level === 'medium' ? 'text-yellow-800' :
            'text-green-800'
          }`}>
            {getScoreMessage(riskData.score, riskData.level)}
          </span>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{riskData.criticalComponents}</div>
          <div className="text-sm text-gray-600">Kritisch</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{riskData.legalComponents}</div>
          <div className="text-sm text-gray-600">Rechtlich</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{riskData.overdueMaintenances}</div>
          <div className="text-sm text-gray-600">Überfällig</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-2xl font-bold text-gray-900">{riskData.totalComponents}</div>
          <div className="text-sm text-gray-600">Gesamt</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          💡 Empfehlungen
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          {getRecommendations(riskData).map((rec, index) => (
            <li key={index} className="flex items-start gap-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Last Updated */}
      <div className="mt-4 text-xs text-gray-500 text-center">
        Aktualisiert: {new Date(riskData.lastUpdated).toLocaleString('de-AT')}
      </div>
    </div>
  );
}

