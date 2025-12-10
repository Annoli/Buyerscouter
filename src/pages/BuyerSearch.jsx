import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Filter, Users, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BuyerCard from '@/components/ui/BuyerCard';
import ExportTools from '@/components/export/ExportTools';

const FLORIDA_COUNTIES = ['Alachua','Baker','Bay','Bradford','Brevard','Broward','Calhoun','Charlotte','Citrus','Clay','Collier','Columbia','DeSoto','Dixie','Duval','Escambia','Flagler','Franklin','Gadsden','Gilchrist','Glades','Gulf','Hamilton','Hardee','Hendry','Hernando','Highlands','Hillsborough','Holmes','Indian River','Jackson','Jefferson','Lafayette','Lake','Lee','Leon','Levy','Liberty','Madison','Manatee','Marion','Martin','Miami-Dade','Monroe','Nassau','Okaloosa','Okeechobee','Orange','Osceola','Palm Beach','Pasco','Pinellas','Polk','Putnam','Santa Rosa','Sarasota','Seminole','St. Johns','St. Lucie','Sumter','Suwannee','Taylor','Union','Volusia','Wakulla','Walton','Washington'];
const PRIORITY_COUNTIES = ['Orange','Polk','Hillsborough','Pinellas','Lee','Duval','Charlotte','Pasco','Sarasota','Miami-Dade'];

export default function BuyerSearch() {
  const [filters, setFilters] = useState({ counties: [], priceMin: 0, priceMax: 500000, lotSizeMin: 0, lotSizeMax: 10, minDeals: 0, strategy: 'all', buyerType: 'all', activeOnly: false, consistentHistory: false });

  const { data: buyers = [], isLoading } = useQuery({ queryKey: ['buyers'], queryFn: () => base44.entities.Buyer.list() });

  const toggleCounty = (county) => {
    if (filters.counties.includes(county)) { setFilters({ ...filters, counties: filters.counties.filter(c => c !== county) }); }
    else { setFilters({ ...filters, counties: [...filters.counties, county] }); }
  };

  const filteredBuyers = buyers.filter(buyer => {
    if (filters.counties.length > 0) { const hasMatch = filters.counties.some(c => (buyer.target_counties || []).includes(c)); if (!hasMatch) return false; }
    if (buyer.price_range_max < filters.priceMin || buyer.price_range_min > filters.priceMax) return false;
    if (buyer.lot_size_max_acres < filters.lotSizeMin || buyer.lot_size_min_acres > filters.lotSizeMax) return false;
    if (filters.minDeals > 0 && (buyer.total_lots_acquired_6mo || 0) < filters.minDeals) return false;
    if (filters.strategy !== 'all' && buyer.purchase_strategy !== filters.strategy) return false;
    if (filters.buyerType !== 'all' && buyer.buyer_type !== filters.buyerType) return false;
    if (filters.activeOnly && !buyer.active_status) return false;
    if (filters.consistentHistory && (buyer.total_lots_acquired_12mo || 0) < 5) return false;
    return true;
  });

  const clearFilters = () => { setFilters({ counties: [], priceMin: 0, priceMax: 500000, lotSizeMin: 0, lotSizeMax: 10, minDeals: 0, strategy: 'all', buyerType: 'all', activeOnly: false, consistentHistory: false }); };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8"><h1 className="text-3xl font-bold text-white mb-2">Florida-Wide Buyer Search</h1><p className="text-slate-400">Advanced search across all buyer criteria</p></div>

        <div className="grid lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700/50 p-6 sticky top-8">
              <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold text-white flex items-center gap-2"><Filter className="w-5 h-5 text-amber-400" />Filters</h2><Button variant="ghost" size="sm" onClick={clearFilters} className="text-slate-400"><X className="w-4 h-4 mr-1" /> Clear</Button></div>
              <div className="space-y-6">
                <div><Label className="text-slate-300 mb-3 block">Target Counties</Label><div className="space-y-2 max-h-48 overflow-y-auto pr-2"><p className="text-xs text-amber-400 mb-2">Priority Counties</p>{PRIORITY_COUNTIES.map(c => <label key={c} className="flex items-center gap-2 text-sm"><Checkbox checked={filters.counties.includes(c)} onCheckedChange={() => toggleCounty(c)} /><span className="text-slate-300">{c}</span></label>)}<p className="text-xs text-slate-500 mt-3 mb-2">All Counties</p>{FLORIDA_COUNTIES.filter(c => !PRIORITY_COUNTIES.includes(c)).map(c => <label key={c} className="flex items-center gap-2 text-sm"><Checkbox checked={filters.counties.includes(c)} onCheckedChange={() => toggleCounty(c)} /><span className="text-slate-400">{c}</span></label>)}</div></div>
                <div><Label className="text-slate-300">Price Range: ${filters.priceMin.toLocaleString()} - ${filters.priceMax.toLocaleString()}</Label><div className="mt-4 space-y-4"><Slider value={[filters.priceMin]} onValueChange={([v]) => setFilters({ ...filters, priceMin: v })} min={0} max={500000} step={10000} /><Slider value={[filters.priceMax]} onValueChange={([v]) => setFilters({ ...filters, priceMax: v })} min={0} max={500000} step={10000} /></div></div>
                <div><Label className="text-slate-300">Lot Size: {filters.lotSizeMin} - {filters.lotSizeMax} acres</Label><div className="mt-4 space-y-4"><Slider value={[filters.lotSizeMin]} onValueChange={([v]) => setFilters({ ...filters, lotSizeMin: v })} min={0} max={10} step={0.1} /><Slider value={[filters.lotSizeMax]} onValueChange={([v]) => setFilters({ ...filters, lotSizeMax: v })} min={0} max={10} step={0.1} /></div></div>
                <div><Label className="text-slate-300">Purchase Strategy</Label><Select value={filters.strategy} onValueChange={(v) => setFilters({ ...filters, strategy: v })}><SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-2"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="all">All Strategies</SelectItem><SelectItem value="Infill Lots">Infill Lots</SelectItem><SelectItem value="Scattered Lots">Scattered Lots</SelectItem><SelectItem value="Subdivision Tracts">Subdivision Tracts</SelectItem></SelectContent></Select></div>
                <div><Label className="text-slate-300">Buyer Type</Label><Select value={filters.buyerType} onValueChange={(v) => setFilters({ ...filters, buyerType: v })}><SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-2"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="all">All Types</SelectItem><SelectItem value="Builder">Builder</SelectItem><SelectItem value="Developer">Developer</SelectItem><SelectItem value="Individual Investor">Individual Investor</SelectItem><SelectItem value="LLC/Investment Group">LLC/Investment Group</SelectItem><SelectItem value="Land Bank">Land Bank</SelectItem></SelectContent></Select></div>
                <div><Label className="text-slate-300">Minimum Recent Deals (6mo)</Label><Select value={filters.minDeals.toString()} onValueChange={(v) => setFilters({ ...filters, minDeals: parseInt(v) })}><SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-2"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="0">Any</SelectItem><SelectItem value="1">1+ deals</SelectItem><SelectItem value="3">3+ deals</SelectItem><SelectItem value="5">5+ deals</SelectItem><SelectItem value="10">10+ deals</SelectItem></SelectContent></Select></div>
                <div className="space-y-3"><label className="flex items-center gap-3"><Checkbox checked={filters.activeOnly} onCheckedChange={(v) => setFilters({ ...filters, activeOnly: v })} /><span className="text-sm text-slate-300">Active buyers only</span></label><label className="flex items-center gap-3"><Checkbox checked={filters.consistentHistory} onCheckedChange={(v) => setFilters({ ...filters, consistentHistory: v })} /><span className="text-sm text-slate-300">Consistent 5+ deal history</span></label></div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6"><div><p className="text-lg font-semibold text-white">{filteredBuyers.length} Buyers Found</p><p className="text-sm text-slate-400">{filters.counties.length > 0 && `${filters.counties.length} counties selected`}</p></div><ExportTools buyers={filteredBuyers} /></div>

            {(filters.counties.length > 0 || filters.minDeals > 0 || filters.strategy !== 'all') && (
              <div className="flex flex-wrap gap-2 mb-6">
                {filters.counties.map(c => <Badge key={c} className="bg-amber-500/20 text-amber-400 border-amber-500/30 cursor-pointer hover:bg-amber-500/30" onClick={() => toggleCounty(c)}>{c} <X className="w-3 h-3 ml-1" /></Badge>)}
                {filters.minDeals > 0 && <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">{filters.minDeals}+ deals</Badge>}
                {filters.strategy !== 'all' && <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">{filters.strategy}</Badge>}
              </div>
            )}

            {isLoading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-amber-400 animate-spin" /></div>}
            {!isLoading && filteredBuyers.length === 0 && <Card className="bg-slate-800/50 border-slate-700/50 p-12 text-center"><Users className="w-16 h-16 text-slate-600 mx-auto mb-4" /><h3 className="text-xl font-semibold text-white mb-2">No Buyers Found</h3><p className="text-slate-400">Try adjusting your filters</p></Card>}
            {!isLoading && filteredBuyers.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                <AnimatePresence>{filteredBuyers.map((buyer, idx) => <motion.div key={buyer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}><Link to={createPageUrl('BuyerProfile') + `?id=${buyer.id}`}><BuyerCard buyer={buyer} showMatchScore={false} /></Link></motion.div>)}</AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}