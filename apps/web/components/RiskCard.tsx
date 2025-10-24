'use client';

import { useState } from 'react';
import { RiskBadge } from './RiskBadge';
import { RiskDetailsModal } from './RiskDetailsModal';
import { AlertTriangle, Calendar, Clock } from 'lucide-react';
import type { ComponentRisk } from '@/types/database';

interface RiskCardProps {
  componentName: string;
  componentType: string;
  nextMaintenance: string | null;
  daysOverdue: number;
  risk: ComponentRisk;
  onScheduleMaintenance?: () => void;
}

export function RiskCard({ 
  componentName, 
  componentType, 
  nextMaintenance, 
  daysOverdue, 
  risk, 
  onScheduleMaintenance 
}: RiskCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatDaysOverdue = (days: number): string => {
    if (days < 0) {
      return `in ${Math.abs(days)} Tagen`;
    } else if (days === 0) {
      return 'heute fällig';
    } else {
      return `${days} Tage überfällig`;
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Nicht geplant';
    return new Date(dateString).toLocaleDateString('de-AT');
  };

  const isCritical = risk.level === 'critical' || risk.level === 'legal';
  const needsAttention = risk.level === 'warning' || risk.level === 'danger' || isCritical;

  return (
    <>
      <div className={`p-4 rounded-lg border-2 transition-all hover:shadow-lg cursor-pointer ${
        risk.level === 'legal' ? 'bg-gray-50 border-gray-300 hover:border-gray-400' :
        risk.level === 'critical' ? 'bg-red-50 border-red-200 hover:border-red-300' :
        risk.level === 'danger' ? 'bg-orange-50 border-orange-200 hover:border-orange-300' :
        risk.level === 'warning' ? 'bg-yellow-50 border-yellow-200 hover:border-yellow-300' :
        'bg-green-50 border-green-200 hover:border-green-300'
      }`} onClick={() => setIsModalOpen(true)}>
        
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 text-lg">{componentName}</h3>
            <p className="text-sm text-gray-600">{componentType}</p>
          </div>
          <RiskBadge level={risk.level} size="sm" />
        </div>

        {/* Risk Status */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            {needsAttention && (
              <AlertTriangle className={`w-4 h-4 ${
                isCritical ? 'text-red-600' : 'text-orange-600'
              }`} />
            )}
            <span className={`text-sm font-medium ${
              isCritical ? 'text-red-900' : 
              needsAttention ? 'text-orange-900' : 'text-green-900'
            }`}>
              {formatDaysOverdue(daysOverdue)}
            </span>
          </div>
          
          <p className={`text-sm ${
            isCritical ? 'text-red-800' : 
            needsAttention ? 'text-orange-800' : 'text-green-800'
          }`}>
            {risk.message.substring(0, 100)}...
          </p>
        </div>

        {/* Maintenance Info */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Nächste: {formatDate(nextMaintenance)}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{formatDaysOverdue(daysOverdue)}</span>
          </div>
        </div>

        {/* Consequences Summary */}
        {(risk.consequences.death || risk.consequences.injury || risk.consequences.insurance || risk.consequences.criminal) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {risk.consequences.death && (
              <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full font-medium">
                🚨 Lebensgefahr
              </span>
            )}
            {risk.consequences.injury && (
              <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full font-medium">
                ⚠️ Verletzungsgefahr
              </span>
            )}
            {risk.consequences.insurance && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                💸 Versicherung
              </span>
            )}
            {risk.consequences.criminal && (
              <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                ⚖️ Strafrecht
              </span>
            )}
          </div>
        )}

        {/* Damage Cost */}
        {risk.consequences.damage.max > 0 && (
          <div className="text-sm text-gray-600 mb-3">
            <span className="font-medium">Möglicher Schaden: </span>
            <span className="font-bold text-gray-900">
              {risk.consequences.damage.min.toLocaleString('de-AT')}€ - {risk.consequences.damage.max.toLocaleString('de-AT')}€
            </span>
          </div>
        )}

        {/* Action Button */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsModalOpen(true);
            }}
            className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium rounded-lg transition-colors"
          >
            Details anzeigen
          </button>
          {onScheduleMaintenance && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onScheduleMaintenance();
              }}
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isCritical ? 'bg-red-600 hover:bg-red-700 text-white' :
                needsAttention ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              Termin buchen
            </button>
          )}
        </div>
      </div>

      {/* Risk Details Modal */}
      <RiskDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        componentName={componentName}
        risk={risk}
      />
    </>
  );
}





