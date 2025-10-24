'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Bell, X, CheckCircle, Clock, Shield } from 'lucide-react';

interface RiskAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  propertyId: string;
  propertyName: string;
  componentId?: string;
  componentName?: string;
  severity: number; // 1-10
  createdAt: string;
  acknowledged: boolean;
  actionUrl?: string;
}

interface RiskAlertSystemProps {
  propertyId?: string;
  autoRefresh?: boolean;
  refreshInterval?: number;
}

export function RiskAlertSystem({ 
  propertyId, 
  autoRefresh = true, 
  refreshInterval = 30000 
}: RiskAlertSystemProps) {
  const [alerts, setAlerts] = useState<RiskAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAcknowledged, setShowAcknowledged] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'critical' | 'warning' | 'info'>('all');

  useEffect(() => {
    fetchAlerts();
    
    if (autoRefresh) {
      const interval = setInterval(fetchAlerts, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [propertyId, autoRefresh, refreshInterval]);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const url = propertyId 
        ? `/api/dashboard/risk-alerts?propertyId=${propertyId}`
        : '/api/dashboard/risk-alerts';
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.success) {
        setAlerts(data.data);
      }
    } catch (error) {
      console.error('Error fetching risk alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const response = await fetch(`/api/dashboard/risk-alerts/${alertId}/acknowledge`, {
        method: 'POST'
      });
      
      if (response.ok) {
        setAlerts(prev => 
          prev.map(alert => 
            alert.id === alertId 
              ? { ...alert, acknowledged: true }
              : alert
          )
        );
      }
    } catch (error) {
      console.error('Error acknowledging alert:', error);
    }
  };

  const acknowledgeAll = async () => {
    try {
      const unacknowledgedAlerts = alerts.filter(alert => !alert.acknowledged);
      
      await Promise.all(
        unacknowledgedAlerts.map(alert => 
          fetch(`/api/dashboard/risk-alerts/${alert.id}/acknowledge`, {
            method: 'POST'
          })
        )
      );
      
      setAlerts(prev => 
        prev.map(alert => ({ ...alert, acknowledged: true }))
      );
    } catch (error) {
      console.error('Error acknowledging all alerts:', error);
    }
  };

  const getAlertIcon = (type: string, severity: number) => {
    if (type === 'critical' || severity >= 8) {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
    if (type === 'warning' || severity >= 5) {
      return <AlertTriangle className="w-5 h-5 text-orange-600" />;
    }
    return <Bell className="w-5 h-5 text-blue-600" />;
  };

  const getAlertColor = (type: string, severity: number) => {
    if (type === 'critical' || severity >= 8) {
      return 'border-red-200 bg-red-50';
    }
    if (type === 'warning' || severity >= 5) {
      return 'border-orange-200 bg-orange-50';
    }
    return 'border-blue-200 bg-blue-50';
  };

  const getSeverityText = (severity: number) => {
    if (severity >= 8) return 'KRITISCH';
    if (severity >= 5) return 'HOCH';
    if (severity >= 3) return 'MITTEL';
    return 'NIEDRIG';
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Gerade eben';
    if (diffInMinutes < 60) return `Vor ${diffInMinutes} Min`;
    if (diffInMinutes < 1440) return `Vor ${Math.floor(diffInMinutes / 60)} Std`;
    return date.toLocaleDateString('de-AT');
  };

  const filteredAlerts = alerts.filter(alert => {
    if (!showAcknowledged && alert.acknowledged) return false;
    if (filterType !== 'all' && alert.type !== filterType) return false;
    return true;
  });

  const unacknowledgedCount = alerts.filter(alert => !alert.acknowledged).length;
  const criticalCount = alerts.filter(alert => alert.type === 'critical' || alert.severity >= 8).length;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <Shield className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              🚨 Risk Alerts
            </h3>
            <p className="text-sm text-gray-600">
              Intelligente Risiko-Benachrichtigungen
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {unacknowledgedCount > 0 && (
            <button
              onClick={acknowledgeAll}
              className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
            >
              Alle bestätigen
            </button>
          )}
          <div className="flex items-center gap-1">
            <span className="text-sm text-gray-600">Auto-Refresh:</span>
            <div className={`w-3 h-3 rounded-full ${autoRefresh ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-red-50 rounded-lg">
          <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
          <div className="text-sm text-red-600">Kritisch</div>
        </div>
        <div className="text-center p-3 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600">
            {alerts.filter(a => a.type === 'warning').length}
          </div>
          <div className="text-sm text-orange-600">Warnung</div>
        </div>
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">
            {alerts.filter(a => a.type === 'info').length}
          </div>
          <div className="text-sm text-blue-600">Info</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
          >
            <option value="all">Alle</option>
            <option value="critical">Kritisch</option>
            <option value="warning">Warnung</option>
            <option value="info">Info</option>
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="showAcknowledged"
            checked={showAcknowledged}
            onChange={(e) => setShowAcknowledged(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="showAcknowledged" className="text-sm text-gray-700">
            Bestätigte anzeigen
          </label>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">
              Keine Alerts
            </h4>
            <p className="text-gray-600">
              {alerts.length === 0 
                ? 'Keine Risiko-Alerts vorhanden.'
                : 'Keine Alerts entsprechen den gewählten Filtern.'
              }
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                alert.acknowledged 
                  ? 'bg-gray-50 border-gray-200 opacity-75' 
                  : getAlertColor(alert.type, alert.severity)
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getAlertIcon(alert.type, alert.severity)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h4 className={`font-medium ${
                        alert.acknowledged ? 'text-gray-600' : 'text-gray-900'
                      }`}>
                        {alert.title}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.severity >= 8 ? 'bg-red-100 text-red-800' :
                        alert.severity >= 5 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {getSeverityText(alert.severity)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(alert.createdAt)}
                      </span>
                    </div>
                  </div>
                  
                  <p className={`text-sm mb-2 ${
                    alert.acknowledged ? 'text-gray-500' : 'text-gray-700'
                  }`}>
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">Immobilie:</span> {alert.propertyName}
                      {alert.componentName && (
                        <span> • <span className="font-medium">Komponente:</span> {alert.componentName}</span>
                      )}
                    </div>
                    
                    {!alert.acknowledged && (
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="px-3 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700 transition-colors"
                      >
                        Bestätigen
                      </button>
                    )}
                  </div>
                  
                  {alert.actionUrl && (
                    <a
                      href={alert.actionUrl}
                      className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Details ansehen →
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            {filteredAlerts.length} von {alerts.length} Alerts
          </span>
          <span>
            Letzte Aktualisierung: {new Date().toLocaleTimeString('de-AT')}
          </span>
        </div>
      </div>
    </div>
  );
}

