export interface HealingSession {
  id: string;
  created_at: string;
  trigger: 'manual' | 'ci' | 'watch';
  mode: 'interactive' | 'smart' | 'auto' | 'force';
  failed_tests: number;
  test_files: string[];
  pattern_type?: string;
  confidence?: number;
  safety_level?: 'high' | 'medium' | 'low';
  auto_heal_decision: boolean;
  fixes_applied: number;
  duration_seconds: number;
  success: boolean;
  tokens_used?: number;
  api_cost?: number;
  linear_task_created?: string;
  user_id?: string;
  error_message?: string;
  details?: Record<string, any>;
}

export interface HealingStats {
  totalSessions: number;
  autoHealed: number;
  manualReviews: number;
  successRate: number;
  averageDuration: number;
  totalFixes: number;
  totalCost: number;
}

export interface PatternStats {
  pattern_type: string;
  count: number;
  success_rate: number;
  avg_confidence: number;
}

export interface SafetyStats {
  safety_level: string;
  count: number;
  auto_heal_rate: number;
}
