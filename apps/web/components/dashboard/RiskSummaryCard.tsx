'use client';

import { useEffect, useState } from 'react';
import { RiskBadge } from '@/components/RiskBadge';
import { AlertTriangle, CheckCircle, Clock, AlertOctagon, Scale } from 'lucide-react';
import Link from 'next/link';
import type { RiskLevel } from '@/types/database';

interface RiskStats {
  safe: number;
  warning: number;
  danger: number;
  critical: number;
  legal: number;
  total: number;
}

interface CriticalComponent {
  id: string;
  propertyId: string;
  propertyName: string;
  componentName: string;
  riskLevel: RiskLevel;
  daysOverdue: number;
}

export function RiskSummaryCard() {
  const [stats, setStats] = useState<RiskStats | null>(null);
  const [criticalComponents, setCriticalComponents] = useState<CriticalComponent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRiskData() {
      try {
        const response = await fetch('/api/dashboard/risk-summary');
        const data = await response.json();
        
        if (data.success) {
          setStats(data.data.stats);
          setCriticalComponents(data.data.criticalComponents);
        }
      } catch (error) {
        console.error('Risk summary error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchRiskData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const riskLevels = [
    { level: 'legal' as RiskLevel, count: stats.legal, icon: Scale, color: 'text-gray-900' },
    { level: 'critical' as RiskLevel, count: stats.critical, icon: AlertOctagon, color: 'text-red-600' },
    { level: 'danger' as RiskLevel, count: stats.danger, icon: AlertTriangle, color: 'text-orange-600' },
    { level: 'warning' as RiskLevel, count: stats.warning, icon: Clock, color: 'text-yellow-600' },
    { level: 'safe' as RiskLevel, count: stats.safe, icon: CheckCircle, color: 'text-green-600' },
  ];

  const urgentCount = stats.legal + stats.critical;

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Risiko-Übersicht</h2>
        {urgentCount > 0 && (
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-bold">
            {urgentCount} DRINGEND!
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="space-y-3 mb-6">
        {riskLevels.map(({ level, count, icon: Icon, color }) => {
          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
          
          return (
            <div key={level} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <RiskBadge level={level} size="sm" />
                </div>
                <span className="font-bold text-gray-900">{count}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    level === 'legal' ? 'bg-gray-900' :
                    level === 'critical' ? 'bg-red-600' :
                    level === 'danger' ? 'bg-orange-500' :
                    level === 'warning' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Critical Components List */}
      {criticalComponents.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">
            Dringende Wartungen:
          </h3>
          <div className="space-y-2">
            {criticalComponents.slice(0, 3).map((comp) => (
              <Link
                key={comp.id}
                href={`/properties/${comp.propertyId}`}
                className="block p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">
                      {comp.componentName || 'Wartung'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {comp.propertyName} • {comp.daysOverdue} Tage überfällig
                    </p>
                  </div>
                  <RiskBadge level={comp.riskLevel} size="sm" showLabel={false} />
                </div>
              </Link>
            ))}
          </div>
          {criticalComponents.length > 0 && (
            <Link 
              href="/dashboard/critical-maintenances"
              className="mt-3 w-full block text-center text-sm text-red-600 hover:text-red-800 font-medium transition-colors"
            >
              {criticalComponents.length > 3 
                ? `Alle ${criticalComponents.length} kritischen Wartungen anzeigen →`
                : 'Alle kritischen Wartungen anzeigen →'
              }
            </Link>
          )}
        </div>
      )}

      {/* All Safe Message */}
      {urgentCount === 0 && stats.total > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="w-5 h-5" />
            <p className="text-sm font-medium">
              Alle Wartungen aktuell! 🎉
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
