'use client';

import { RiskBadge } from './RiskBadge';
import { AlertTriangle, Shield, Scale, DollarSign, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { ComponentRisk } from '@/types/database';

interface RiskDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  componentName: string;
  risk: ComponentRisk;
}

export function RiskDetailsModal({ isOpen, onClose, componentName, risk }: RiskDetailsModalProps) {
  const router = useRouter();
  
  if (!isOpen) return null;

  const handleFindCraftsman = () => {
    // Weiterleitung zur Coming Soon Page mit Component-Type
    router.push(`/handwerker/coming-soon?component=${encodeURIComponent(componentName)}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">
            Risiko-Analyse: {componentName}
          </h2>
          <div className="flex items-center gap-3">
            <RiskBadge level={risk.level} />
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Warning Message */}
          <div className={`p-4 rounded-lg border-2 ${
            risk.level === 'legal' ? 'bg-gray-900 text-white border-gray-700' :
            risk.level === 'critical' ? 'bg-red-50 text-red-900 border-red-200' :
            risk.level === 'danger' ? 'bg-orange-50 text-orange-900 border-orange-200' :
            risk.level === 'warning' ? 'bg-yellow-50 text-yellow-900 border-yellow-200' :
            'bg-green-50 text-green-900 border-green-200'
          }`}>
            <p className="whitespace-pre-line font-medium">{risk.message}</p>
          </div>

          {/* Consequences Grid */}
          {(risk.consequences.death || risk.consequences.injury || risk.consequences.insurance || risk.consequences.criminal) && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Mögliche Konsequenzen:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {risk.consequences.death && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-red-900">Lebensgefahr</h4>
                      <p className="text-sm text-red-700">Tödliche Unfälle möglich</p>
                    </div>
                  </div>
                )}
                
                {risk.consequences.injury && (
                  <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-orange-900">Verletzungsgefahr</h4>
                      <p className="text-sm text-orange-700">Gesundheitsrisiko für Bewohner</p>
                    </div>
                  </div>
                )}
                
                {risk.consequences.insurance && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-900">Versicherungsschutz</h4>
                      <p className="text-sm text-blue-700">Leistung kann verweigert werden</p>
                    </div>
                  </div>
                )}
                
                {risk.consequences.criminal && (
                  <div className="flex items-start gap-3 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <Scale className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-purple-900">Strafrechtlich</h4>
                      <p className="text-sm text-purple-700">Rechtliche Konsequenzen möglich</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Damage Costs */}
          {risk.consequences.damage.max > 0 && (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-gray-600" />
                <h3 className="font-bold text-gray-900">Möglicher Schaden:</h3>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {risk.consequences.damage.min.toLocaleString('de-AT')}€ - {risk.consequences.damage.max.toLocaleString('de-AT')}€
              </p>
            </div>
          )}

        {/* Real Case */}
        {risk.realCase && (
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded">
            <h4 className="font-bold text-yellow-900 mb-1">Realfall aus Österreich:</h4>
            <p className="text-sm text-yellow-800">{risk.realCase}</p>
          </div>
        )}

        {/* Statistic */}
        {risk.statistic && (
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400 rounded">
            <h4 className="font-bold text-blue-900 mb-1">Statistik Österreich:</h4>
            <p className="text-sm text-blue-800">{risk.statistic}</p>
          </div>
        )}

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <button
              onClick={handleFindCraftsman}
              className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-colors"
            >
              Jetzt Handwerker finden
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition-colors"
            >
              Später erinnern
            </button>
          </div>

          {/* Austrian Legal Disclaimer */}
          <div className="mt-6 pt-4 border-t text-xs text-gray-500">
            <p>
              ⚖️ Rechtliche Hinweise basieren auf österreichischem Recht (Stand: Oktober 2025).
              Keine Rechtsberatung. Bei Fragen kontaktieren Sie einen Rechtsanwalt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
