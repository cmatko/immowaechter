'use client';

import { useState, useEffect } from 'react';
import type { HealingSession } from '@/types/healing';

export default function HealingDashboardPage() {
  const [sessions, setSessions] = useState<HealingSession[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for testing without Supabase
  const mockSessions: HealingSession[] = [
    {
      id: '1',
      session_id: 'heal-session-001',
      test_name: 'Login-Flow Test',
      test_file: 'e2e-playwright-full/organized/auth/auth-login-flow.spec.ts',
      failure_reason: 'Element nicht gefunden: [data-testid="login-button"]',
      pattern_detected: 'fehlende-testid',
      safety_level: 'safe',
      healing_strategy: 'testid-hinzufügen',
      applied_fix: 'data-testid="login-button" zum Login-Button hinzugefügt',
      success: true,
      claude_tokens_used: 150,
      linear_task_created: 'KOT-126',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      description: 'Wir haben hier fehlende Test-IDs hinzugefügt, damit die automatischen Tests zuverlässig funktionieren.',
      screenshot_url: '/screenshots/login-fix-before-after.html'
    },
    {
      id: '2',
      session_id: 'heal-session-002',
      test_name: 'Immobilien-Erstellung',
      test_file: 'e2e-playwright-full/organized/features/property-creation.spec.ts',
      failure_reason: 'Timeout beim Warten auf Element: [data-testid="property-form"]',
      pattern_detected: 'timeout-problem',
      safety_level: 'warning',
      healing_strategy: 'timeout-erhöhen',
      applied_fix: 'Timeout von 5000ms auf 10000ms erhöht',
      success: true,
      claude_tokens_used: 200,
      linear_task_created: 'KOT-127',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString(),
      description: 'Wir haben hier die Wartezeiten verlängert, damit langsame Server-Verbindungen nicht mehr zu Test-Fehlern führen.',
      screenshot_url: '/screenshots/property-creation-timeout-fix.html'
    },
    {
      id: '3',
      session_id: 'heal-session-003',
      test_name: 'Wartungserinnerung',
      test_file: 'e2e-playwright-full/organized/features/maintenance-reminder.spec.ts',
      failure_reason: 'Assertion fehlgeschlagen: Erwartet "Erinnerung gesendet" aber bekam "Fehler beim Senden"',
      pattern_detected: 'api-fehler',
      safety_level: 'danger',
      healing_strategy: 'mock-api-response',
      applied_fix: 'Mock API Response für Wartungserinnerung hinzugefügt',
      success: false,
      claude_tokens_used: 300,
      linear_task_created: null,
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString(),
      description: 'Wir haben hier versucht, API-Probleme mit Mock-Daten zu umgehen, damit Tests auch ohne echte Server-Verbindung laufen.',
      screenshot_url: '/screenshots/maintenance-reminder-api-error.html'
    }
  ];

  useEffect(() => {
    // Simulate loading delay
    setTimeout(() => {
      setSessions(mockSessions);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Lade Heilungssitzungen...</p>
        </div>
      </div>
    );
  }

  const totalSessions = sessions.length;
  const successfulHealings = sessions.filter(s => s.success).length;
  const failedHealings = totalSessions - successfulHealings;
  const successRate = totalSessions > 0 ? Math.round((successfulHealings / totalSessions) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🔧 Test-Healing Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Automatische Reparatur von fehlgeschlagenen Tests - Überblick über alle Heilungsversuche
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Gesamt Heilungsversuche"
            value={totalSessions}
            icon="🔧"
            color="blue"
          />
          <StatCard
            title="Erfolgreiche Reparaturen"
            value={successfulHealings}
            icon="✅"
            color="green"
          />
          <StatCard
            title="Fehlgeschlagene Reparaturen"
            value={failedHealings}
            icon="❌"
            color="red"
          />
          <StatCard
            title="Erfolgsquote"
            value={`${successRate}%`}
            icon="📊"
            color="purple"
          />
        </div>

        {/* Sessions List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">📋 Letzte Heilungsversuche</h2>
            <p className="text-sm text-gray-500 mt-1">
              Hier siehst du alle automatischen Reparaturversuche der letzten Zeit
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {sessions.map((session) => (
              <SessionRow key={session.id} session={session} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: {
  title: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'red' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${colorClasses[color]} rounded-md p-3`}>
            <span className="text-white text-xl">{icon}</span>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionRow({ session }: { session: HealingSession }) {
  const getStatusColor = (success: boolean) => {
    return success ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  };

  const getSafetyColor = (level: string) => {
    switch (level) {
      case 'safe': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'danger': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (success: boolean) => {
    return success ? 'Erfolgreich' : 'Fehlgeschlagen';
  };

  const getSafetyText = (level: string) => {
    switch (level) {
      case 'safe': return 'Sicher';
      case 'warning': return 'Warnung';
      case 'danger': return 'Gefährlich';
      default: return 'Unbekannt';
    }
  };

  return (
    <div className="px-6 py-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {session.test_name}
            </h3>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(session.success)}`}>
              {getStatusText(session.success)}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSafetyColor(session.safety_level)}`}>
              {getSafetyText(session.safety_level)}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            <p className="truncate"><strong>Problem:</strong> {session.failure_reason}</p>
            <p className="truncate"><strong>Lösung:</strong> {session.applied_fix}</p>
            <p className="truncate"><strong>Muster erkannt:</strong> {session.pattern_detected}</p>
            {session.description && (
              <p className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-sm">
                <strong>💡 Was passiert ist:</strong> {session.description}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="text-sm">
            <p><strong>AI-Tokens:</strong> {session.claude_tokens_used}</p>
            <p><strong>Linear Task:</strong> {session.linear_task_created || 'Keine'}</p>
            {session.screenshot_url && (
              <button
                onClick={() => window.open(session.screenshot_url, '_blank')}
                className="mt-2 inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                📸 Screenshot anzeigen
              </button>
            )}
          </div>
          <div className="text-sm text-gray-400">
            {new Date(session.created_at).toLocaleDateString('de-DE')}
          </div>
        </div>
      </div>
    </div>
  );
}
