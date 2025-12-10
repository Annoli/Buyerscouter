import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Building2, Phone, Mail, MapPin, DollarSign, Ruler, Droplets, Zap, MessageSquare, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import ScoreGauge from '@/components/ui/ScoreGauge';
import StrengthMeter from '@/components/ui/StrengthMeter';
import ConfidenceIndicator from '@/components/ui/ConfidenceIndicator';
import AIReasoningPanel from '@/components/matching/AIReasoningPanel';
import ContactTemplates from '@/components/contact/ContactTemplates';
import { calculateMatchScore } from '@/components/matching/MatchScoreEngine';

export default function BuyerProfile() {
  const urlParams = new URLSearchParams(window.location.search);
  const buyerId = urlParams.get('id');
  const propertyParam = urlParams.get('property');
  const scoreParam = urlParams.get('score');
  
  const [property, setProperty] = useState(null);
  const [matchData, setMatchData] = useState(null);

  const { data: buyer, isLoading } = useQuery({
    queryKey: ['buyer', buyerId],
    queryFn: async () => { const buyers = await base44.entities.Buyer.filter({ id: buyerId }); return buyers[0]; },
    enabled: !!buyerId
  });

  useEffect(() => {
    if (propertyParam) {
      const parsed = JSON.parse(decodeURIComponent(propertyParam));
      setProperty(parsed);
      if (buyer) { const result = calculateMatchScore(parsed, buyer); setMatchData(result); }
    }
  }, [propertyParam, buyer]);

  if (isLoading) return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center"><Loader2 className="w-8 h-8 text-amber-400 animate-spin" /></div>;

  if (!buyer) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-8">
      <Card className="max-w-md mx-auto bg-slate-800/50 border-slate-700 p-8 text-center">
        <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" /><h2 className="text-xl font-semibold text-white mb-2">Buyer Not Found</h2><p className="text-slate-400 mb-6">The buyer you're looking for doesn't exist.</p>
        <Link to={createPageUrl('BuyerDatabase')}><Button className="bg-amber-500 hover:bg-amber-600 text-black">Back to Database</Button></Link>
      </Card>
    </div>
  );

  const matchScore = scoreParam ? parseInt(scoreParam) : (matchData?.totalScore || null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <Link to={property ? createPageUrl('PropertyMatch') : createPageUrl('BuyerDatabase')}><Button variant="ghost" className="text-slate-400 hover:text-white mb-6"><ArrowLeft className="w-4 h-4 mr-2" />Back</Button></Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 p-8 mb-8">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/30 flex items-center justify-center"><Building2 className="w-8 h-8 text-amber-400" /></div>
                  <div>
                    <h1 className="text-3xl font-bold text-white">{buyer.company_name}</h1>
                    <p className="text-lg text-slate-400">{buyer.full_name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-slate-700 text-slate-300">{buyer.buyer_type}</Badge>
                      {buyer.active_status && <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Active</Badge>}
                      {buyer.purchase_strategy && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{buyer.purchase_strategy}</Badge>}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {buyer.phone && <a href={`tel:${buyer.phone}`} className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"><div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center"><Phone className="w-5 h-5 text-emerald-400" /></div><div><p className="text-xs text-slate-400">Phone</p><p className="text-white font-medium">{buyer.phone}</p></div></a>}
                  {buyer.email && <a href={`mailto:${buyer.email}`} className="flex items-center gap-3 p-4 bg-slate-700/30 rounded-xl hover:bg-slate-700/50 transition-colors"><div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center"><Mail className="w-5 h-5 text-blue-400" /></div><div><p className="text-xs text-slate-400">Email</p><p className="text-white font-medium truncate">{buyer.email}</p></div></a>}
                </div>
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-3 bg-slate-700/30 rounded-xl"><p className="text-2xl font-bold text-white">{buyer.total_lots_acquired_6mo || 0}</p><p className="text-xs text-slate-400">Deals (6mo)</p></div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-xl"><p className="text-2xl font-bold text-white">{buyer.avg_days_to_close || 30}</p><p className="text-xs text-slate-400">Days to Close</p></div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-xl"><p className="text-2xl font-bold text-white">{buyer.response_rate || 70}%</p><p className="text-xs text-slate-400">Response Rate</p></div>
                  <div className="text-center p-3 bg-slate-700/30 rounded-xl"><p className="text-2xl font-bold text-white">{buyer.closing_reliability || 80}%</p><p className="text-xs text-slate-400">Close Rate</p></div>
                </div>
              </div>
              {matchScore !== null && (
                <div className="flex flex-col items-center justify-center p-6 bg-slate-700/30 rounded-2xl">
                  <ScoreGauge score={matchScore} size="lg" label="Match Score" />
                  <p className={cn("mt-4 text-lg font-semibold", matchScore >= 80 ? 'text-emerald-400' : matchScore >= 60 ? 'text-amber-400' : matchScore >= 40 ? 'text-orange-400' : 'text-red-400')}>
                    {matchScore >= 80 ? 'Strong Match' : matchScore >= 60 ? 'Good Match' : matchScore >= 40 ? 'Moderate Match' : 'Low Match'}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        <Tabs defaultValue="buybox" className="space-y-6">
          <TabsList className="bg-slate-800/50 border border-slate-700/50 p-1">
            <TabsTrigger value="buybox" className="data-[state=active]:bg-slate-700">Buy Box</TabsTrigger>
            <TabsTrigger value="strength" className="data-[state=active]:bg-slate-700">Buyer Strength</TabsTrigger>
            {property && <><TabsTrigger value="analysis" className="data-[state=active]:bg-slate-700">AI Analysis</TabsTrigger><TabsTrigger value="contact" className="data-[state=active]:bg-slate-700">Contact</TabsTrigger></>}
            <TabsTrigger value="history" className="data-[state=active]:bg-slate-700">History</TabsTrigger>
          </TabsList>

          <TabsContent value="buybox">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800/50 border-slate-700/50 p-6"><h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-amber-400" />Target Counties</h3><div className="flex flex-wrap gap-2">{(buyer.target_counties || []).map((c, i) => <Badge key={i} className="bg-slate-700 text-slate-300 border-slate-600">{c}</Badge>)}</div></Card>
              <Card className="bg-slate-800/50 border-slate-700/50 p-6"><h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><DollarSign className="w-5 h-5 text-emerald-400" />Price Range</h3><p className="text-2xl font-bold text-white">${buyer.price_range_min?.toLocaleString()} - ${buyer.price_range_max?.toLocaleString()}</p><p className="text-sm text-slate-400 mt-2">Typical offer: {buyer.typical_offer_percentage || 80}% of asking</p></Card>
              <Card className="bg-slate-800/50 border-slate-700/50 p-6"><h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Ruler className="w-5 h-5 text-blue-400" />Lot Size Preference</h3><p className="text-2xl font-bold text-white">{buyer.lot_size_min_acres} - {buyer.lot_size_max_acres} acres</p></Card>
              <Card className="bg-slate-800/50 border-slate-700/50 p-6"><h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Droplets className="w-5 h-5 text-cyan-400" />Flood Zone Tolerance</h3><Badge className="bg-slate-700 text-slate-300 text-base px-4 py-2">{buyer.flood_zone_tolerance || 'No Preference'}</Badge></Card>
              <Card className="bg-slate-800/50 border-slate-700/50 p-6"><h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-yellow-400" />Utilities Preference</h3><Badge className="bg-slate-700 text-slate-300 text-base px-4 py-2">{buyer.utilities_preference || 'No Preference'}</Badge></Card>
              <Card className="bg-slate-800/50 border-slate-700/50 p-6"><h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-purple-400" />Preferred Contact</h3><Badge className="bg-slate-700 text-slate-300 text-base px-4 py-2">{buyer.preferred_contact_method || 'Any'}</Badge></Card>
            </div>
            {buyer.buy_box_notes && <Card className="bg-slate-800/50 border-slate-700/50 p-6 mt-6"><h3 className="text-lg font-semibold text-white mb-4">Notes & Patterns</h3><p className="text-slate-300">{buyer.buy_box_notes}</p></Card>}
          </TabsContent>

          <TabsContent value="strength"><div className="grid md:grid-cols-2 gap-6"><StrengthMeter buyer={buyer} />{matchData && <ConfidenceIndicator scores={matchData.confidence} />}</div></TabsContent>
          {property && <TabsContent value="analysis"><AIReasoningPanel property={property} buyer={buyer} matchScore={matchScore} /></TabsContent>}
          {property && <TabsContent value="contact"><ContactTemplates buyer={buyer} property={property} matchScore={matchScore} /></TabsContent>}
          <TabsContent value="history"><Card className="bg-slate-800/50 border-slate-700/50 p-6"><h3 className="text-lg font-semibold text-white mb-4">Recent Purchase History</h3>{(buyer.recent_purchases || []).length > 0 ? <div className="space-y-3">{buyer.recent_purchases.map((p, i) => <div key={i} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-xl"><div><p className="font-medium text-white">{p.address}</p><p className="text-sm text-slate-400">{p.county} County • {p.lot_size} acres</p></div><div className="text-right"><p className="font-semibold text-emerald-400">${p.price?.toLocaleString()}</p><p className="text-sm text-slate-400">{p.date}</p></div></div>)}</div> : <p className="text-slate-400">No recent purchases recorded</p>}</Card></TabsContent>
        </Tabs>
      </div>
    </div>
  );
}