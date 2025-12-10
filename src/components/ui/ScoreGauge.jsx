import React from 'react';
import { cn } from "@/lib/utils";

export default function ScoreGauge({ score, size = 'md', label, showLabel = true }) {
  const radius = size === 'lg' ? 70 : size === 'md' ? 50 : 35;
  const strokeWidth = size === 'lg' ? 8 : size === 'md' ? 6 : 4;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const dashOffset = circumference - progress;

  const getColor = () => {
    if (score >= 90) return { stroke: '#10b981', bg: 'rgba(16, 185, 129, 0.1)' };
    if (score >= 75) return { stroke: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' };
    if (score >= 50) return { stroke: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' };
    return { stroke: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' };
  };

  const color = getColor();
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke="rgba(100, 116, 139, 0.2)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={radius + strokeWidth}
            cy={radius + strokeWidth}
            r={radius}
            fill="none"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${color.stroke}40)`
            }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={cn(
            "font-bold text-white",
            size === 'lg' ? 'text-3xl' : size === 'md' ? 'text-2xl' : 'text-lg'
          )}>
            {score}%
          </span>
        </div>
      </div>
      {showLabel && label && (
        <span className="text-sm text-slate-400 font-medium">{label}</span>
      )}
    </div>
  );
}