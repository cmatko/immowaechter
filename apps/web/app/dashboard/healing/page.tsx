'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import type { HealingSession } from '@/types/healing';

export default function HealingDashboardPage() {
  const [sessions, setSessions] = useState<HealingSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const router = useRouter();

  // AUTH CHECK - FIRST THING!
  useEffect(() => {
    checkAuthorization();
  }, []);

  async function checkAuthorization() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        // Not logged in - redirect to login
        router.push('/login?redirect=/dashboard/healing');
        return;
      }

      // Check if user is admin (your email)
      const ADMIN_EMAIL = 'cmaatko@gmail.com';
      
      if (user.email !== ADMIN_EMAIL) {
        // Logged in but not admin - redirect to home
        router.push('/');
        return;
      }

      // User is authorized!
      setAuthorized(true);
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/');
    } finally {
      setCheckingAuth(false);
    }
  }

  // Fetch sessions only after authorized
  useEffect(() => {
    if (authorized) {
      fetchSessions();
    }
  }, [authorized]);

  async function fetchSessions() {
    try {
      setLoading(true);
      
      // Mock data for testing without Supabase
      const mockSessions: HealingSession[] = [
        {
          id: '1',
          created_at: new Date().toISOString(),
          trigger: 'manual',
          mode: 'auto',
          failed_tests: 8,
          test_files: ['tests/maintenance.e2e.ts', 'tests/heating.test.ts'],
          pattern_type: 'oib-interval',
          confidence: 0.85,
          safety_level: 'high',
          auto_heal_decision: true,
          fixes_applied: 8,
          duration_seconds: 30,
          success: true,
          tokens_used: 15000,
          api_cost: 0.15,
        },
        {
          id: '2',
          created_at: new Date(Date.now() - 3600000).toISOString(),
          trigger: 'manual',
          mode: 'smart',
          failed_tests: 3,
          test_files: ['tests/subsidy.test.ts'],
          pattern_type: 'calculation',
          confidence: 0.75,
          safety_level: 'low',
          auto_heal_decision: false,
          fixes_applied: 0,
          duration_seconds: 5,
          success: false,
          tokens_used: 8000,
          api_cost: 0.08,
          linear_task_created: 'KOT-126',
        },
        {
          id: '3',
          created_at: new Date(Date.now() - 7200000).toISOString(),
          trigger: 'ci',
          mode: 'auto',
          failed_tests: 5,
          test_files: ['tests/properties.e2e.ts'],
          pattern_type: 'timeout',
          confidence: 0.92,
          safety_level: 'high',
          auto_heal_decision: true,
          fixes_applied: 5,
          duration_seconds: 45,
          success: true,
          tokens_used: 12000,
          api_cost: 0.12,
        },
        {
          id: '4',
          created_at: new Date(Date.now() - 10800000).toISOString(),
          trigger: 'watch',
          mode: 'interactive',
          failed_tests: 2,
          test_files: ['tests/risk.test.ts'],
          pattern_type: 'selector',
          confidence: 0.88,
          safety_level: 'medium',
          auto_heal_decision: false,
          fixes_applied: 2,
          duration_seconds: 60,
          success: true,
          tokens_used: 6000,
          api_cost: 0.06,
        },
        {
          id: '5',
          created_at: new Date(Date.now() - 14400000).toISOString(),
          trigger: 'manual',
          mode: 'force',
          failed_tests: 12,
          test_files: ['tests/auth.e2e.ts', 'tests/payment.test.ts'],
          pattern_type: 'authentication',
          confidence: 0.65,
          safety_level: 'low',
          auto_heal_decision: true,
          fixes_applied: 0,
          duration_seconds: 10,
          success: false,
          tokens_used: 20000,
          api_cost: 0.20,
          error_message: 'Force mode failed - authentication patterns detected',
        },
      ];
      
      setSessions(mockSessions);
    } catch (err) {
      console.error('Failed to fetch sessions:', err);
    } finally {
      setLoading(false);
    }
  }

  // SHOW LOADING WHILE CHECKING AUTH
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // DON'T SHOW ANYTHING IF NOT AUTHORIZED (will redirect)
  if (!authorized) {
    return null;
  }

  // SHOW LOADING WHILE FETCHING DATA
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading healing sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🧠 Test Healing Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor and analyze your self-healing test automation
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Sessions"
            value={sessions.length}
            icon="🔄"
            color="blue"
          />
          <StatCard
            title="Auto-Healed"
            value={sessions.filter(s => s.auto_heal_decision).length}
            icon="🤖"
            color="green"
          />
          <StatCard
            title="Manual Reviews"
            value={sessions.filter(s => !s.auto_heal_decision).length}
            icon="👤"
            color="yellow"
          />
          <StatCard
            title="Success Rate"
            value={`${sessions.length > 0 ? Math.round((sessions.filter(s => s.success).length / sessions.length) * 100) : 0}%`}
            icon="✅"
            color="purple"
          />
        </div>

        {/* Sessions List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Healing Sessions
            </h2>
          </div>
          <div className="divide-y divide-gray-200">
            {sessions.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                No healing sessions yet. Run a test to see data here!
              </div>
            ) : (
              sessions.map((session) => (
                <SessionRow key={session.id} session={session} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  icon: string; 
  color: 'blue' | 'green' | 'yellow' | 'purple';
}) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700',
    green: 'bg-green-50 text-green-700',
    yellow: 'bg-yellow-50 text-yellow-700',
    purple: 'bg-purple-50 text-purple-700',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`text-3xl ${colors[color]} p-3 rounded-lg`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// Session Row Component
function SessionRow({ session }: { session: HealingSession }) {
  const getStatusBadge = () => {
    if (session.success && session.auto_heal_decision) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          ✅ Auto-Healed
        </span>
      );
    }
    if (session.success && !session.auto_heal_decision) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          👤 Manual
        </span>
      );
    }
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
        ❌ Failed
      </span>
    );
  };

  const getSafetyBadge = () => {
    if (!session.safety_level) return null;
    
    const colors = {
      high: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-red-100 text-red-800',
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colors[session.safety_level]}`}>
        {session.safety_level.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="px-6 py-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getStatusBadge()}
            {getSafetyBadge()}
            {session.pattern_type && (
              <span className="text-sm text-gray-600">
                Pattern: <span className="font-medium">{session.pattern_type}</span>
              </span>
            )}
            {session.confidence !== undefined && (
              <span className="text-sm text-gray-600">
                Confidence: <span className="font-medium">{Math.round(session.confidence * 100)}%</span>
              </span>
            )}
          </div>
          
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              <span className="font-medium">{session.failed_tests}</span> failed test(s) • 
              <span className="font-medium ml-1">{session.fixes_applied}</span> fix(es) applied • 
              <span className="ml-1">{session.duration_seconds}s</span>
            </div>
            {session.test_files.length > 0 && (
              <div className="text-xs text-gray-500">
                Files: {session.test_files.slice(0, 3).join(', ')}
                {session.test_files.length > 3 && ` +${session.test_files.length - 3} more`}
              </div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-gray-500">
            {new Date(session.created_at).toLocaleDateString()} at{' '}
            {new Date(session.created_at).toLocaleTimeString()}
          </div>
          {session.linear_task_created && (
            <a
              href={`https://linear.app/kotto/issue/${session.linear_task_created}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
            >
              {session.linear_task_created} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
