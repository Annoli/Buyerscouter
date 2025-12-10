import React from 'react';
import { Building2, Phone, Mail, MapPin, TrendingUp, Calendar, DollarSign, Ruler, Droplets, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const getScoreColor = (score) => {
  if (score >= 90) return 'from-emerald-500 to-emerald-600';
  if (score >= 75) return 'from-amber-400 to-amber-500';
  if (score >= 50) return 'from-orange-400 to-orange-500';
  return 'from-red-400 to-red-500';
};

const getScoreBg = (score) => {
  if (score >= 90) return 'bg-emerald-500/20 border-emerald-500/30';
  if (score >= 75) return 'bg-amber-500/20 border-amber-500/30';
  if (score >= 50) return 'bg-orange-500/20 border-orange-500/30';
  return 'bg-red-500/20 border-red-500/30';
};

export default function BuyerCard({ buyer, matchScore, onClick, showMatchScore = true }) {
  const recentActivity = buyer.total_lots_acquired_6mo || 0;
  
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "relative overflow-hidden cursor-pointer transition-all duration-300",
        "bg-gradient-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl",
        "border border-slate-700/50 hover:border-amber-500/50",
        "hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1"
      )}
    >
      {/* Score Badge */}
      {showMatchScore && matchScore !== undefined && (
        <div className="absolute top-4 right-4">
          <div className={cn(
            "px-3 py-1.5 rounded-full border",
            getScoreBg(matchScore)
          )}>
            <span className={cn(
              "text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent",
              getScoreColor(matchScore)
            )}>
              {matchScore}%
            </span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <h3 className="text-lg font-semibold text-white truncate">{buyer.company_name}</h3>
            <p className="text-sm text-slate-400">{buyer.full_name}</p>
            <Badge variant="outline" className="mt-2 text-xs border-slate-600 text-slate-300">
              {buyer.buyer_type}
            </Badge>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">
              <span className="font-semibold text-white">{recentActivity}</span> deals (6mo)
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300 truncate">
              ${(buyer.price_range_min / 1000).toFixed(0)}k - ${(buyer.price_range_max / 1000).toFixed(0)}k
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Ruler className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300">
              {buyer.lot_size_min_acres} - {buyer.lot_size_max_acres} acres
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300">
              {buyer.avg_days_to_close || 30} day close
            </span>
          </div>
        </div>

        {/* Counties */}
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-4 h-4 text-slate-500 flex-shrink-0" />
          <div className="flex flex-wrap gap-1.5">
            {(buyer.target_counties || []).slice(0, 4).map((county, idx) => (
              <span key={idx} className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {county}
              </span>
            ))}
            {(buyer.target_counties || []).length > 4 && (
              <span className="px-2 py-0.5 text-xs rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                +{buyer.target_counties.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Contact */}
        <div className="flex items-center gap-4 pt-4 border-t border-slate-700/50">
          {buyer.phone && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Phone className="w-4 h-4" />
              <span>{buyer.phone}</span>
            </div>
          )}
          {buyer.email && (
            <div className="flex items-center gap-2 text-sm text-slate-400 truncate">
              <Mail className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{buyer.email}</span>
            </div>
          )}
        </div>

        {/* Activity Indicator */}
        {buyer.active_status && (
          <div className="absolute bottom-4 right-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400">Active</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}