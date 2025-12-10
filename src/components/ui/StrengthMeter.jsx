import React from 'react';
import { cn } from "@/lib/utils";
import { TrendingUp, Clock, MessageSquare, CheckCircle } from 'lucide-react';

export default function StrengthMeter({ buyer }) {
  const metrics = [
    {
      label: 'Acquisition Frequency',
      value: Math.min(100, (buyer.total_lots_acquired_6mo || 0) * 10),
      icon: TrendingUp,
      description: `${buyer.total_lots_acquired_6mo || 0} deals in 6 months`
    },
    {
      label: 'Recency',
      value: buyer.last_purchase_date ? 
        Math.max(0, 100 - Math.floor((new Date() - new Date(buyer.last_purchase_date)) / (1000 * 60 * 60 * 24 * 3))) : 0,
      icon: Clock,
      description: buyer.last_purchase_date ? `Last deal: ${new Date(buyer.last_purchase_date).toLocaleDateString()}` : 'No recent activity'
    },
    {
      label: 'Response Rate',
      value: buyer.response_rate || 0,
      icon: MessageSquare,
      description: `${buyer.response_rate || 0}% response rate`
    },
    {
      label: 'Closing Reliability',
      value: buyer.closing_reliability || 0,
      icon: CheckCircle,
      description: `${buyer.closing_reliability || 0}% close rate`
    }
  ];

  const overallStrength = Math.round(metrics.reduce((sum, m) => sum + m.value, 0) / metrics.length);

  const getBarColor = (value) => {
    if (value >= 80) return 'bg-gradient-to-r from-emerald-500 to-emerald-400';
    if (value >= 60) return 'bg-gradient-to-r from-amber-500 to-amber-400';
    if (value >= 40) return 'bg-gradient-to-r from-orange-500 to-orange-400';
    return 'bg-gradient-to-r from-red-500 to-red-400';
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Buyer Strength</h3>
        <div className={cn(
          "px-3 py-1 rounded-full text-sm font-bold",
          overallStrength >= 80 ? 'bg-emerald-500/20 text-emerald-400' :
          overallStrength >= 60 ? 'bg-amber-500/20 text-amber-400' :
          overallStrength >= 40 ? 'bg-orange-500/20 text-orange-400' :
          'bg-red-500/20 text-red-400'
        )}>
          {overallStrength}% Overall
        </div>
      </div>

      <div className="space-y-5">
        {metrics.map((metric, idx) => (
          <div key={idx} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-300">{metric.label}</span>
              </div>
              <span className="text-sm text-white font-semibold">{metric.value}%</span>
            </div>
            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-700", getBarColor(metric.value))}
                style={{ width: `${metric.value}%` }}
              />
            </div>
            <p className="text-xs text-slate-500">{metric.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}