import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { 
  Search, MapPin, Loader2, Building2, ArrowUpDown, Grid3X3, List
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import BuyerCard from '@/components/ui/BuyerCard';
import { calculateMatchScore } from '@/components/matching/MatchScoreEngine';
import ExportTools from '@/components/export/ExportTools';

const FLORIDA_COUNTIES = [
  'Alachua', 'Baker', 'Bay', 'Bradford', 'Brevard', 'Broward', 'Calhoun', 'Charlotte',
  'Citrus', 'Clay', 'Collier', 'Columbia', 'DeSoto', 'Dixie', 'Duval', 'Escambia',
  'Flagler', 'Franklin', 'Gadsden', 'Gilchrist', 'Glades', 'Gulf', 'Hamilton', 'Hardee',
  'Hendry', 'Hernando', 'Highlands', 'Hillsborough', 'Holmes', 'Indian River', 'Jackson',
  'Jefferson', 'Lafayette', 'Lake', 'Lee', 'Leon', 'Levy', 'Liberty', 'Madison', 'Manatee',
  'Marion', 'Martin', 'Miami-Dade', 'Monroe', 'Nassau', 'Okaloosa', 'Okeechobee', 'Orange',
  'Osceola', 'Palm Beach', 'Pasco', 'Pinellas', 'Polk', 'Putnam', 'Santa Rosa', 'Sarasota',
  'Seminole', 'St. Johns', 'St. Lucie', 'Sumter', 'Suwannee', 'Taylor', 'Union', 'Volusia',
  'Wakulla', 'Walton', 'Washington'
];

export default function PropertyMatch() {
  const urlParams = new URLSearchParams(window.location.search);
  const initialAddress = urlParams.get('address') || '';

  const [property, setProperty] = useState({
    address: initialAddress,
    county: '',
    asking_price: 50000,
    lot_size_acres: 0.25,
    zoning: 'Residential',
    flood_zone: 'Zone X',
    utilities: 'City Water & Sewer',
    road_access: 'Paved'
  });

  const [matchResults, setMatchResults] = useState([]);
  const [isMatching, setIsMatching] = useState(false);
  const [sortBy, setSortBy] = useState('score');
  const [viewMode, setViewMode] = useState('grid');
  const [minScore, setMinScore] = useState(0);

  const { data: buyers = [], isLoading: buyersLoading } = useQuery({
    queryKey: ['buyers'],
    queryFn: () => base44.entities.Buyer.list(),
  });

  const logSearchMutation = useMutation({
    mutationFn: (searchData) => base44.entities.PropertySearch.create(searchData),
  });

  const runMatching = () => {
    if (!property.county) {
      alert('Please select a county');
      return;
    }

    setIsMatching(true);

    setTimeout(() => {
      const results = buyers.map(buyer => {
        const scoreData = calculateMatchScore(property, buyer);
        return {
          buyerId: buyer.id,
          buyer,
          score: scoreData.totalScore,
          breakdown: scoreData.breakdown,
          confidence: scoreData.confidence
        };
      });

      results.sort((a, b) => b.score - a.score);
      setMatchResults(results);

      logSearchMutation.mutate({
        address: property.address,
        county: property.county,
        asking_price: property.asking_price,
        lot_size_acres: property.lot_size_acres,
        zoning: property.zoning,
        flood_zone: property.flood_zone,
        utilities: property.utilities,
        road_access: property.road_access,
        search_timestamp: new Date().toISOString(),
        match_results: results.slice(0, 20).map(r => ({
          buyer_id: r.buyerId,
          match_score: r.score
        }))
      });

      setIsMatching(false);
    }, 1500);
  };

  const displayedResults = matchResults
    .filter(r => r.score >= minScore)
    .sort((a, b) => {
      if (sortBy === 'score') return b.score - a.score;
      if (sortBy === 'name') return a.buyer.company_name.localeCompare(b.buyer.company_name);
      if (sortBy === 'activity') return (b.buyer.total_lots_acquired_6mo || 0) - (a.buyer.total_lots_acquired_6mo || 0);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Property Matching</h1>
          <p className="text-slate-400">Enter property details to find matching buyers</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700/50 p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-amber-400" />
                Property Details
              </h2>

              <div className="space-y-5">
                <div>
                  <Label className="text-slate-300">Property Address</Label>
                  <Input
                    value={property.address}
                    onChange={(e) => setProperty({ ...property, address: e.target.value })}
                    placeholder="123 Main St, City, FL"
                    className="bg-slate-700/50 border-slate-600 text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">County *</Label>
                  <Select value={property.county} onValueChange={(v) => setProperty({ ...property, county: v })}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-1">
                      <SelectValue placeholder="Select county" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700 max-h-60">
                      {FLORIDA_COUNTIES.map(county => (
                        <SelectItem key={county} value={county} className="text-slate-200">{county}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Asking Price: ${property.asking_price.toLocaleString()}</Label>
                  <Slider
                    value={[property.asking_price]}
                    onValueChange={([v]) => setProperty({ ...property, asking_price: v })}
                    min={5000} max={500000} step={5000}
                    className="mt-3"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Lot Size: {property.lot_size_acres} acres</Label>
                  <Slider
                    value={[property.lot_size_acres]}
                    onValueChange={([v]) => setProperty({ ...property, lot_size_acres: v })}
                    min={0.1} max={10} step={0.05}
                    className="mt-3"
                  />
                </div>

                <div>
                  <Label className="text-slate-300">Zoning</Label>
                  <Select value={property.zoning} onValueChange={(v) => setProperty({ ...property, zoning: v })}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Residential">Residential</SelectItem>
                      <SelectItem value="Agricultural">Agricultural</SelectItem>
                      <SelectItem value="Mixed-Use">Mixed-Use</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Flood Zone</Label>
                  <Select value={property.flood_zone} onValueChange={(v) => setProperty({ ...property, flood_zone: v })}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Zone X">Zone X (Minimal Risk)</SelectItem>
                      <SelectItem value="Zone AE">Zone AE (High Risk)</SelectItem>
                      <SelectItem value="Zone A">Zone A (High Risk)</SelectItem>
                      <SelectItem value="Zone VE">Zone VE (Coastal)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Utilities</Label>
                  <Select value={property.utilities} onValueChange={(v) => setProperty({ ...property, utilities: v })}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="City Water & Sewer">City Water & Sewer</SelectItem>
                      <SelectItem value="City Water Only">City Water Only</SelectItem>
                      <SelectItem value="Well/Septic">Well/Septic</SelectItem>
                      <SelectItem value="None">None Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-slate-300">Road Access</Label>
                  <Select value={property.road_access} onValueChange={(v) => setProperty({ ...property, road_access: v })}>
                    <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="Paved">Paved Road</SelectItem>
                      <SelectItem value="Gravel">Gravel Road</SelectItem>
                      <SelectItem value="Easement">Easement Only</SelectItem>
                      <SelectItem value="None">No Road Access</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={runMatching}
                  disabled={isMatching || buyersLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold py-6"
                >
                  {isMatching ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Matching...</> : <><Search className="w-5 h-5 mr-2" /> Find Matching Buyers</>}
                </Button>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-xl font-semibold text-white">
                  {matchResults.length > 0 ? `${displayedResults.length} Buyers Found` : 'Buyer Matches'}
                </h2>
                <p className="text-sm text-slate-400">
                  {matchResults.length > 0 ? 'Showing all buyers with match scores' : 'Enter property details and click Find Matching Buyers'}
                </p>
              </div>

              {matchResults.length > 0 && (
                <div className="flex items-center gap-3">
                  <Select value={minScore.toString()} onValueChange={(v) => setMinScore(parseInt(v))}>
                    <SelectTrigger className="w-24 bg-slate-800 border-slate-700 text-white"><SelectValue /></SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="0">All</SelectItem>
                      <SelectItem value="25">25%+</SelectItem>
                      <SelectItem value="50">50%+</SelectItem>
                      <SelectItem value="75">75%+</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-white">
                      <ArrowUpDown className="w-4 h-4 mr-2" /><SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-700">
                      <SelectItem value="score">Match Score</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="activity">Activity</SelectItem>
                    </SelectContent>
                  </Select>

                  <ExportTools buyers={displayedResults.map(r => r.buyer)} matchResults={displayedResults} propertyInfo={property} />

                  <div className="flex bg-slate-800 rounded-lg p-1 border border-slate-700">
                    <button onClick={() => setViewMode('grid')} className={cn("p-2 rounded", viewMode === 'grid' ? 'bg-slate-700 text-white' : 'text-slate-400')}>
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setViewMode('list')} className={cn("p-2 rounded", viewMode === 'list' ? 'bg-slate-700 text-white' : 'text-slate-400')}>
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {buyersLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 text-amber-400 animate-spin" />
              </div>
            )}

            {!buyersLoading && matchResults.length === 0 && (
              <Card className="bg-slate-800/50 border-slate-700/50 p-12 text-center">
                <Building2 className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Matches Yet</h3>
                <p className="text-slate-400 mb-6">Fill in the property details and click "Find Matching Buyers" to see results</p>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">{buyers.length} buyers in database</Badge>
              </Card>
            )}

            {matchResults.length > 0 && (
              <div className={cn(viewMode === 'grid' ? 'grid md:grid-cols-2 gap-4' : 'space-y-4')}>
                <AnimatePresence>
                  {displayedResults.map((result, idx) => (
                    <motion.div key={result.buyerId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}>
                      <Link to={createPageUrl('BuyerProfile') + `?id=${result.buyerId}&property=${encodeURIComponent(JSON.stringify(property))}&score=${result.score}`}>
                        <BuyerCard buyer={result.buyer} matchScore={result.score} showMatchScore={true} />
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}