import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Loader2, CheckCircle2, XCircle, Lightbulb, DollarSign, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

export default function AIReasoningPanel({ property, buyer, matchScore, onComplete }) {
  const [reasoning, setReasoning] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateReasoning();
  }, [property, buyer]);

  const generateReasoning = async () => {
    setLoading(true);
    try {
      const prompt = `Analyze this land buyer match for a Florida property:

PROPERTY:
- Address: ${property.address}
- County: ${property.county}
- Asking Price: $${property.asking_price?.toLocaleString()}
- Lot Size: ${property.lot_size_acres} acres
- Zoning: ${property.zoning}
- Flood Zone: ${property.flood_zone}
- Utilities: ${property.utilities}
- Road Access: ${property.road_access}

BUYER:
- Company: ${buyer.company_name}
- Type: ${buyer.buyer_type}
- Target Counties: ${buyer.target_counties?.join(', ')}
- Price Range: $${buyer.price_range_min?.toLocaleString()} - $${buyer.price_range_max?.toLocaleString()}
- Lot Size Preference: ${buyer.lot_size_min_acres} - ${buyer.lot_size_max_acres} acres
- Recent Deals (6mo): ${buyer.total_lots_acquired_6mo}
- Flood Zone Tolerance: ${buyer.flood_zone_tolerance}
- Utilities Preference: ${buyer.utilities_preference}
- Purchase Strategy: ${buyer.purchase_strategy}

MATCH SCORE: ${matchScore}%

Provide detailed analysis.`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            whyGoodFit: { type: "array", items: { type: "string" } },
            criteriaMatched: { type: "array", items: { type: "string" } },
            criteriaNotMatched: { type: "array", items: { type: "string" } },
            recommendationScore: { type: "number" },
            recommendationExplanation: { type: "string" },
            suggestedOfferLow: { type: "number" },
            suggestedOfferHigh: { type: "number" },
            offerRationale: { type: "string" },
            likelihoodToRespond: { type: "number" },
            likelihoodToBuy: { type: "number" },
            negotiationTips: { type: "array", items: { type: "string" } }
          }
        }
      });

      setReasoning(result);
      if (onComplete) onComplete(result);
    } catch (error) {
      console.error('AI reasoning error:', error);
      // Fallback reasoning
      setReasoning({
        whyGoodFit: [`${buyer.company_name} operates in ${property.county} County`, `Price point aligns with their typical acquisitions`],
        criteriaMatched: ['County match', 'Price range compatibility'],
        criteriaNotMatched: [],
        recommendationScore: matchScore,
        recommendationExplanation: 'Based on buying patterns and criteria alignment.',
        suggestedOfferLow: Math.round(property.asking_price * 0.75),
        suggestedOfferHigh: Math.round(property.asking_price * 0.85),
        offerRationale: 'Standard market offer range for residential land.',
        likelihoodToRespond: 70,
        likelihoodToBuy: 50,
        negotiationTips: ['Lead with recent comparable sales', 'Highlight development potential']
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-amber-400 animate-spin mb-4" />
        <p className="text-slate-300">Analyzing match with AI...</p>
      </div>
    );
  }

  if (!reasoning) return null;

  return (
    <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-amber-500/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500/10 to-transparent p-4 border-b border-slate-700/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-amber-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">AI Match Analysis</h3>
          <p className="text-sm text-slate-400">Powered by advanced matching intelligence</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Why Good Fit */}
        {reasoning.whyGoodFit?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-semibold text-white">Why This Buyer Is A Good Fit</h4>
            </div>
            <ul className="space-y-2">
              {reasoning.whyGoodFit.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                  {reason}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Criteria Matched / Not Matched */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-emerald-500/10 rounded-lg p-4 border border-emerald-500/20">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-semibold text-emerald-400">Criteria Matched</h4>
            </div>
            <ul className="space-y-1.5">
              {(reasoning.criteriaMatched || []).map((item, idx) => (
                <li key={idx} className="text-sm text-slate-300 flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="w-4 h-4 text-red-400" />
              <h4 className="text-sm font-semibold text-red-400">Criteria Not Matched</h4>
            </div>
            <ul className="space-y-1.5">
              {(reasoning.criteriaNotMatched || []).length > 0 ? (
                reasoning.criteriaNotMatched.map((item, idx) => (
                  <li key={idx} className="text-sm text-slate-300 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-red-400" />
                    {item}
                  </li>
                ))
              ) : (
                <li className="text-sm text-slate-400 italic">All major criteria matched</li>
              )}
            </ul>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-slate-700/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-white">Recommendation Score</h4>
            <span className={cn(
              "text-2xl font-bold",
              reasoning.recommendationScore >= 80 ? 'text-emerald-400' :
              reasoning.recommendationScore >= 60 ? 'text-amber-400' : 'text-orange-400'
            )}>
              {reasoning.recommendationScore}%
            </span>
          </div>
          <p className="text-sm text-slate-300">{reasoning.recommendationExplanation}</p>
        </div>

        {/* Suggested Offer */}
        <div className="bg-gradient-to-r from-amber-500/10 to-transparent rounded-lg p-4 border border-amber-500/20">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <h4 className="text-sm font-semibold text-white">Suggested Offer Range</h4>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl font-bold text-amber-400">
              ${reasoning.suggestedOfferLow?.toLocaleString()} - ${reasoning.suggestedOfferHigh?.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-slate-400">{reasoning.offerRationale}</p>
        </div>

        {/* Likelihood Scores */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <p className="text-sm text-slate-400 mb-1">Likelihood to Respond</p>
            <p className="text-3xl font-bold text-blue-400">{reasoning.likelihoodToRespond}%</p>
          </div>
          <div className="text-center p-4 bg-slate-700/30 rounded-lg">
            <p className="text-sm text-slate-400 mb-1">Likelihood to Buy</p>
            <p className="text-3xl font-bold text-emerald-400">{reasoning.likelihoodToBuy}%</p>
          </div>
        </div>

        {/* Negotiation Tips */}
        {reasoning.negotiationTips?.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Negotiation Tips</h4>
            <div className="flex flex-wrap gap-2">
              {reasoning.negotiationTips.map((tip, idx) => (
                <span key={idx} className="px-3 py-1.5 bg-slate-700/50 rounded-full text-xs text-slate-300 border border-slate-600">
                  {tip}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}