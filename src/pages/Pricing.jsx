import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Check, ArrowRight, ChevronDown, Zap, Target, TrendingUp,
  Shield, FileText, RefreshCw, XCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";

export default function Pricing() {
  const [openFaq, setOpenFaq] = useState(null);

  const features = [
    {
      icon: Zap,
      title: "Instant Buyer Detection",
      description: "AI pinpoints the most likely buyers for any Florida parcel."
    },
    {
      icon: Shield,
      title: "Verified Buyer Activity",
      description: "Real purchasing behavior — not stale spreadsheets."
    },
    {
      icon: Target,
      title: "County & Zip-Level Mapping",
      description: "Scout demand with precision down to micro-markets."
    },
    {
      icon: TrendingUp,
      title: "Behavior-Based Matching",
      description: "We analyze build patterns, lot preferences, and zoning trends to surface serious buyers — fast."
    },
    {
      icon: FileText,
      title: "Advanced Filtering Tools",
      description: "Zero in on the right buyers in seconds."
    },
    {
      icon: FileText,
      title: "Export-Ready Reports",
      description: "Clean, professional match files for outreach or stacking deals."
    },
    {
      icon: RefreshCw,
      title: "Continuous System Upgrades",
      description: "The platform evolves. Your intel stays sharp."
    },
    {
      icon: XCircle,
      title: "Cancel Anytime",
      description: "No contracts. No friction. No fine print."
    }
  ];

  const valueCards = [
    {
      title: "Data That Acts Like a Scout",
      description: "We track buyer movement across Florida so you don't have to. Every profile is verified, monitored, and kept up-to-date. Inactive buyers disappear from your radar automatically."
    },
    {
      title: "Match Intelligence Built for Land Pros",
      description: "This isn't a list. This is an active reconnaissance system that adapts to the market, learns buyer behavior, and points you toward the people actually closing deals."
    },
    {
      title: "Clarity You Can Act On",
      description: "One match page gives you more signal than hours of research. No fluff. No filler. Just accurate buyer intel ready for your next move."
    }
  ];

  const faqs = [
    {
      question: "Where does Buyerscouter get its buyer intel?",
      answer: "Our system monitors real purchase activity, public records, and builder trends. Only proven, active buyers remain in the database."
    },
    {
      question: "Can I cancel whenever?",
      answer: "Yes. Your access continues until the end of your billing cycle."
    },
    {
      question: "Will you expand beyond Florida?",
      answer: "Florida is the testing ground. Additional states will roll out once data quality meets our standards."
    },
    {
      question: "Who is this built for?",
      answer: "Land investors, wholesalers, and acquisition pros who run real numbers — not guesses."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-16 sm:pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-4">
              <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-amber-600 mx-auto rounded-full mb-6" />
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Simple Pricing.
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                Powerful Intelligence.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-12 max-w-3xl mx-auto px-4 leading-relaxed">
              You don't need tiers. You need accurate buyer intelligence — delivered fast, without noise, and without limits you didn't ask for. BuyerScouter gives you the full scouting system in one clean, powerful package.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Pricing Card */}
      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 mb-20 sm:mb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-2 border-amber-500/30 p-8 sm:p-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
            
            <div className="relative text-center">
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 mb-6 text-sm">
                Complete Access
              </Badge>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">BuyerScouter Access</h2>
              <p className="text-slate-400 mb-8">Your land's buyer radar. Always on. Always accurate.</p>

              <div className="mb-8">
                <div className="flex items-baseline justify-center gap-2">
                  <span className="text-5xl sm:text-6xl font-bold text-white">$49.97</span>
                  <span className="text-xl text-slate-400">/ month</span>
                </div>
              </div>

              <Link to={createPageUrl('PropertyMatch')} className="block mb-8">
                <Button className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-8 py-6 text-lg">
                  Activate Your Scout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <div className="grid sm:grid-cols-2 gap-4 text-left">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <feature.icon className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Value Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
          {valueCards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/50 border-slate-700/50 p-6 sm:p-8 h-full">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-4">{card.title}</h3>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">{card.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400">Everything you need to know</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="bg-slate-800/50 border-slate-700/50 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-700/30 transition-colors"
                >
                  <span className="font-semibold text-white pr-4">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-amber-400 flex-shrink-0 transition-transform",
                      openFaq === idx && "rotate-180"
                    )}
                  />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5">
                    <p className="text-slate-400 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Final CTA */}
      <div className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
            Your Buyer Radar Starts Here.
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-8">
            Accurate intel wins deals.
          </p>
          <Link to={createPageUrl('PropertyMatch')}>
            <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-black font-semibold px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg">
              Activate Your Scout
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}