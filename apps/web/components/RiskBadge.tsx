'use client';

import { getRiskConfig } from '@/lib/risk-helpers';
import type { RiskLevel } from '@/types/database';

interface RiskBadgeProps {
  level: RiskLevel;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskBadge({ level, showLabel = true, size = 'md' }: RiskBadgeProps) {
  const config = getRiskConfig(level);
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <span 
      className={`inline-flex items-center gap-1 rounded-full font-bold ${config.bgColor} ${config.textColor} ${sizeClasses[size]}`}
    >
      <span>{config.emoji}</span>
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}





