import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search, MapPin, Building2, Users, TrendingUp,
  ArrowRight, Sparkles, Target, Zap, Database } from
'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

export default function Home() {
  const [searchAddress, setSearchAddress] = useState('');

  const { data: buyers = [] } = useQuery({
    queryKey: ['buyers-count'],
    queryFn: () => base44.entities.Buyer.list()
  });

  const stats = [
  { label: 'Active Buyers', value: buyers.length || '85+', icon: Users, color: 'amber' },
  { label: 'Florida Counties', value: '67', icon: MapPin, color: 'emerald' },
  { label: 'Deals Tracked', value: '2,400+', icon: TrendingUp, color: 'blue' },
  { label: 'Match Accuracy', value: '94%', icon: Target, color: 'purple' }];


  const handleSearch = (e) => {
    e.preventDefault();
    if (searchAddress.trim()) {
      window.location.href = createPageUrl('PropertyMatch') + `?address=${encodeURIComponent(searchAddress)}`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center">

            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-8">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6934626200d76f0c685241a5/7d0f0d76a_Untitleddesign14.png" alt="BuyerScouter Logo" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
              <span className="text-2xl sm:text-3xl font-bold text-white">
                Buyer<span className="text-amber-400">Scouter</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                Land Buyer
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">AI-powered scouting engine, fueled by real Florida land and development data.


            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8 sm:mb-16 px-4">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-slate-800/80 backdrop-blur-xl rounded-xl border border-slate-700 p-2 gap-2">
                  <div className="flex items-center flex-1">
                    <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-slate-400 ml-2 sm:ml-4 flex-shrink-0" />
                    <Input
                      value={searchAddress}
                      onChange={(e) => setSearchAddress(e.target.value)}
                      placeholder="Enter property address..."
                      className="flex-1 bg-transparent border-0 text-base sm:text-lg text-white placeholder:text-slate-500 focus-visible:ring-0" />

                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-4 sm:px-6 py-3 sm:py-6 rounded-lg text-sm sm:text-base w-full sm:w-auto">

                    <Search className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    Find Buyers
                  </Button>
                </div>
              </div>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {stats.map((stat, idx) =>
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}>

                  <Card className="bg-slate-800/50 border-slate-700/50 p-4 sm:p-6 backdrop-blur-sm">
                    <stat.icon className={cn(
                    "w-6 h-6 sm:w-8 sm:h-8 mb-2 sm:mb-3 mx-auto",
                    stat.color === 'amber' ? 'text-amber-400' :
                    stat.color === 'emerald' ? 'text-emerald-400' :
                    stat.color === 'blue' ? 'text-blue-400' : 'text-purple-400'
                  )} />
                    <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                    <p className="text-xs sm:text-sm text-slate-400">{stat.label}</p>
                  </Card>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="bg-slate-900/50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16 px-4">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-4 text-xs sm:text-sm">
              Platform Features
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
              Everything You Need to Close Deals
            </h2>
            <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto">
              Comprehensive tools for matching, analysis, and outreach
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
            {
              icon: Target,
              title: 'AI Match Scoring',
              description: 'Advanced algorithm analyzing 10+ criteria including price, location, lot size, flood zones, and buyer activity patterns.',
              color: 'amber'
            },
            {
              icon: Database,
              title: 'Complete Buyer Database',
              description: 'Access to 85+ verified Florida land buyers including builders, developers, investors, and LLCs across all 67 counties.',
              color: 'emerald'
            },
            {
              icon: Sparkles,
              title: 'AI Reasoning Engine',
              description: 'AI-powered analysis explaining why each buyer matches, suggested offer prices, and negotiation strategies.',
              color: 'purple'
            }].
            map((feature, idx) =>
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}>

                <Card className="bg-slate-800/50 border-slate-700/50 p-6 sm:p-8 h-full hover:border-amber-500/30 transition-colors">
                  <div className={cn(
                  "w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-4 sm:mb-6",
                  feature.color === 'amber' ? 'bg-amber-500/20' :
                  feature.color === 'emerald' ? 'bg-emerald-500/20' : 'bg-purple-500/20'
                )}>
                    <feature.icon className={cn(
                    "w-6 h-6 sm:w-7 sm:h-7",
                    feature.color === 'amber' ? 'text-amber-400' :
                    feature.color === 'emerald' ? 'text-emerald-400' : 'text-purple-400'
                  )} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3">{feature.title}</h3>
                  <p className="text-sm sm:text-base text-slate-400">{feature.description}</p>
                </Card>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      <div className="py-16 sm:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
            Ready to Find Your Buyers?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-6 sm:mb-8">
            Enter any Florida property address and get instant matches with qualified buyers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl('PropertyMatch')} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg">
                Start Matching
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl('BuyerDatabase')} className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto bg-[#2D2F36] hover:bg-[#3A3D44] text-white border-0 px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg">
                <Building2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Browse Buyers
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>);

}