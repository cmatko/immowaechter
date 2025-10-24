export interface HealingSession {
  id: string;
  session_id: string;
  test_name: string;
  test_file: string;
  failure_reason: string;
  pattern_detected: string;
  safety_level: 'safe' | 'warning' | 'danger';
  healing_strategy: string;
  applied_fix: string;
  success: boolean;
  claude_tokens_used: number;
  linear_task_created?: string;
  created_at: string;
  updated_at: string;
  description?: string;
  screenshot_url?: string;
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
