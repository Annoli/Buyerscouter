import React from 'react';
import { cn } from "@/lib/utils";
import { Target, DollarSign, MapPin, Activity } from 'lucide-react';

export default function ConfidenceIndicator({ scores }) {
  const indicators = [
    { label: 'Market Fit', value: scores.marketFit || 0, icon: Target, color: 'amber' },
    { label: 'Price Fit', value: scores.priceFit || 0, icon: DollarSign, color: 'emerald' },
    { label: 'Location Match', value: scores.locationMatch || 0, icon: MapPin, color: 'blue' },
    { label: 'Buyer Activity', value: scores.buyerActivity || 0, icon: Activity, color: 'purple' }
  ];

  const colorClasses = {
    amber: { bg: 'bg-amber-500', text: 'text-amber-400', glow: 'shadow-amber-500/30' },
    emerald: { bg: 'bg-emerald-500', text: 'text-emerald-400', glow: 'shadow-emerald-500/30' },
    blue: { bg: 'bg-blue-500', text: 'text-blue-400', glow: 'shadow-blue-500/30' },
    purple: { bg: 'bg-purple-500', text: 'text-purple-400', glow: 'shadow-purple-500/30' }
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {indicators.map((indicator, idx) => {
        const colors = colorClasses[indicator.color];
        return (
          <div 
            key={idx}
            className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center",
                `${colors.bg}/20`
              )}>
                <indicator.icon className={cn("w-5 h-5", colors.text)} />
              </div>
              <div>
                <p className="text-xs text-slate-400">{indicator.label}</p>
                <p className={cn("text-xl font-bold", colors.text)}>{indicator.value}%</p>
              </div>
            </div>
            <div className="h-1.5 bg-slate-700/50 rounded-full overflow-hidden">
              <div 
                className={cn("h-full rounded-full transition-all duration-700", colors.bg, `shadow-lg ${colors.glow}`)}
                style={{ width: `${indicator.value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}