import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Plus, Building2, Users, TrendingUp, MapPin, Loader2, X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import BuyerCard from '@/components/ui/BuyerCard';
import ExportTools from '@/components/export/ExportTools';

const FLORIDA_COUNTIES = ['Alachua','Baker','Bay','Bradford','Brevard','Broward','Calhoun','Charlotte','Citrus','Clay','Collier','Columbia','DeSoto','Dixie','Duval','Escambia','Flagler','Franklin','Gadsden','Gilchrist','Glades','Gulf','Hamilton','Hardee','Hendry','Hernando','Highlands','Hillsborough','Holmes','Indian River','Jackson','Jefferson','Lafayette','Lake','Lee','Leon','Levy','Liberty','Madison','Manatee','Marion','Martin','Miami-Dade','Monroe','Nassau','Okaloosa','Okeechobee','Orange','Osceola','Palm Beach','Pasco','Pinellas','Polk','Putnam','Santa Rosa','Sarasota','Seminole','St. Johns','St. Lucie','Sumter','Suwannee','Taylor','Union','Volusia','Wakulla','Walton','Washington'];
const BUYER_TYPES = ['Builder', 'Developer', 'Individual Investor', 'LLC/Investment Group', 'Land Bank'];

export default function BuyerDatabase() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCounty, setFilterCounty] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterMinDeals, setFilterMinDeals] = useState(0);
  const [filterStrategy, setFilterStrategy] = useState('all');
  const [showAddDialog, setShowAddDialog] = useState(false);

  const queryClient = useQueryClient();

  const { data: buyers = [], isLoading } = useQuery({
    queryKey: ['buyers'],
    queryFn: () => base44.entities.Buyer.list(),
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Buyer.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['buyers'] }); setShowAddDialog(false); }
  });

  const filteredBuyers = buyers.filter(buyer => {
    if (searchTerm && !buyer.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) && !buyer.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    if (filterCounty !== 'all' && !(buyer.target_counties || []).includes(filterCounty)) return false;
    if (filterType !== 'all' && buyer.buyer_type !== filterType) return false;
    if (filterMinDeals > 0 && (buyer.total_lots_acquired_6mo || 0) < filterMinDeals) return false;
    if (filterStrategy !== 'all' && buyer.purchase_strategy !== filterStrategy) return false;
    return true;
  });

  const stats = { total: buyers.length, active: buyers.filter(b => b.active_status).length, recentDeals: buyers.reduce((sum, b) => sum + (b.total_lots_acquired_6mo || 0), 0) };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Buyer Database</h1>
            <p className="text-slate-400">Browse and search all Florida land buyers</p>
          </div>
          <div className="flex gap-3">
            <ExportTools buyers={filteredBuyers} />
            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black"><Plus className="w-4 h-4 mr-2" />Add Buyer</Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader><DialogTitle className="text-white">Add New Buyer</DialogTitle></DialogHeader>
                <BuyerForm onSubmit={(data) => createMutation.mutate(data)} loading={createMutation.isPending} />
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="bg-slate-800/50 border-slate-700/50 p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center"><Users className="w-6 h-6 text-amber-400" /></div><div><p className="text-3xl font-bold text-white">{stats.total}</p><p className="text-sm text-slate-400">Total Buyers</p></div></div></Card>
          <Card className="bg-slate-800/50 border-slate-700/50 p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center"><Building2 className="w-6 h-6 text-emerald-400" /></div><div><p className="text-3xl font-bold text-white">{stats.active}</p><p className="text-sm text-slate-400">Active Buyers</p></div></div></Card>
          <Card className="bg-slate-800/50 border-slate-700/50 p-6"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center"><TrendingUp className="w-6 h-6 text-blue-400" /></div><div><p className="text-3xl font-bold text-white">{stats.recentDeals}</p><p className="text-sm text-slate-400">Deals (6mo)</p></div></div></Card>
        </div>

        <Card className="bg-slate-800/50 border-slate-700/50 p-6 mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" /><Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search buyers..." className="pl-10 bg-slate-700/50 border-slate-600 text-white" /></div></div>
            <Select value={filterCounty} onValueChange={setFilterCounty}><SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white"><MapPin className="w-4 h-4 mr-2" /><SelectValue placeholder="County" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700 max-h-60"><SelectItem value="all">All Counties</SelectItem>{FLORIDA_COUNTIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
            <Select value={filterType} onValueChange={setFilterType}><SelectTrigger className="w-48 bg-slate-700/50 border-slate-600 text-white"><SelectValue placeholder="Buyer Type" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="all">All Types</SelectItem>{BUYER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
            <Select value={filterStrategy} onValueChange={setFilterStrategy}><SelectTrigger className="w-40 bg-slate-700/50 border-slate-600 text-white"><SelectValue placeholder="Strategy" /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="all">All Strategies</SelectItem><SelectItem value="Infill Lots">Infill Lots</SelectItem><SelectItem value="Scattered Lots">Scattered Lots</SelectItem><SelectItem value="Subdivision Tracts">Subdivision</SelectItem><SelectItem value="Any">Any</SelectItem></SelectContent></Select>
            <Select value={filterMinDeals.toString()} onValueChange={(v) => setFilterMinDeals(parseInt(v))}><SelectTrigger className="w-36 bg-slate-700/50 border-slate-600 text-white"><TrendingUp className="w-4 h-4 mr-2" /><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700"><SelectItem value="0">Any Activity</SelectItem><SelectItem value="1">1+ Deals</SelectItem><SelectItem value="5">5+ Deals</SelectItem><SelectItem value="10">10+ Deals</SelectItem></SelectContent></Select>
          </div>
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-700">
            <p className="text-sm text-slate-400">Showing {filteredBuyers.length} of {buyers.length} buyers</p>
            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setFilterCounty('all'); setFilterType('all'); setFilterMinDeals(0); setFilterStrategy('all'); }} className="text-slate-400 hover:text-white"><X className="w-4 h-4 mr-1" />Clear Filters</Button>
          </div>
        </Card>

        {isLoading ? <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-amber-400 animate-spin" /></div> : filteredBuyers.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700/50 p-12 text-center"><Users className="w-16 h-16 text-slate-600 mx-auto mb-4" /><h3 className="text-xl font-semibold text-white mb-2">No Buyers Found</h3><p className="text-slate-400">Try adjusting your filters or add a new buyer</p></Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>{filteredBuyers.map((buyer, idx) => <motion.div key={buyer.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }}><Link to={createPageUrl('BuyerProfile') + `?id=${buyer.id}`}><BuyerCard buyer={buyer} showMatchScore={false} /></Link></motion.div>)}</AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function BuyerForm({ onSubmit, loading }) {
  const [formData, setFormData] = useState({ full_name: '', company_name: '', buyer_type: 'Builder', phone: '', email: '', target_counties: [], price_range_min: 10000, price_range_max: 100000, lot_size_min_acres: 0.1, lot_size_max_acres: 1, flood_zone_tolerance: 'Zone X Only', utilities_preference: 'No Preference', road_access_requirement: 'No Preference', purchase_strategy: 'Any', total_lots_acquired_6mo: 0, avg_days_to_close: 30, response_rate: 70, closing_reliability: 80, preferred_contact_method: 'Any', typical_offer_percentage: 80, active_status: true, buy_box_notes: '' });
  const handleSubmit = (e) => { e.preventDefault(); onSubmit(formData); };
  const toggleCounty = (county) => { const counties = formData.target_counties || []; if (counties.includes(county)) { setFormData({ ...formData, target_counties: counties.filter(c => c !== county) }); } else { setFormData({ ...formData, target_counties: [...counties, county] }); } };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div><Label className="text-slate-300">Full Name *</Label><Input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} required className="bg-slate-700/50 border-slate-600 text-white mt-1" /></div>
        <div><Label className="text-slate-300">Company Name *</Label><Input value={formData.company_name} onChange={(e) => setFormData({ ...formData, company_name: e.target.value })} required className="bg-slate-700/50 border-slate-600 text-white mt-1" /></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label className="text-slate-300">Phone</Label><Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="bg-slate-700/50 border-slate-600 text-white mt-1" /></div>
        <div><Label className="text-slate-300">Email</Label><Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="bg-slate-700/50 border-slate-600 text-white mt-1" /></div>
      </div>
      <div><Label className="text-slate-300">Buyer Type</Label><Select value={formData.buyer_type} onValueChange={(v) => setFormData({ ...formData, buyer_type: v })}><SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-1"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-800 border-slate-700">{BUYER_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
      <div><Label className="text-slate-300">Target Counties</Label><div className="grid grid-cols-4 gap-2 mt-2 max-h-40 overflow-y-auto bg-slate-700/30 p-3 rounded-lg">{FLORIDA_COUNTIES.map(county => <label key={county} className="flex items-center gap-2 text-sm text-slate-300"><Checkbox checked={(formData.target_counties || []).includes(county)} onCheckedChange={() => toggleCounty(county)} />{county}</label>)}</div></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label className="text-slate-300">Min Price: ${formData.price_range_min?.toLocaleString()}</Label><Slider value={[formData.price_range_min]} onValueChange={([v]) => setFormData({ ...formData, price_range_min: v })} min={5000} max={500000} step={5000} className="mt-3" /></div>
        <div><Label className="text-slate-300">Max Price: ${formData.price_range_max?.toLocaleString()}</Label><Slider value={[formData.price_range_max]} onValueChange={([v]) => setFormData({ ...formData, price_range_max: v })} min={5000} max={500000} step={5000} className="mt-3" /></div>
      </div>
      <div><Label className="text-slate-300">Notes</Label><Textarea value={formData.buy_box_notes} onChange={(e) => setFormData({ ...formData, buy_box_notes: e.target.value })} className="bg-slate-700/50 border-slate-600 text-white mt-1" rows={3} /></div>
      <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black">{loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Save Buyer</Button>
    </form>
  );
}