
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { cn } from "@/lib/utils";
import { Zap, Home, Search, Building2, Users, Menu, X, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { base44 } from '@/api/base44Client';

const navItems = [
  { name: 'Home', page: 'Home', icon: Home },
  { name: 'Match Property', page: 'PropertyMatch', icon: Search },
  { name: 'Buyer Database', page: 'BuyerDatabase', icon: Building2 },
  { name: 'Advanced Search', page: 'BuyerSearch', icon: Users },
  { name: 'Pricing', page: 'Pricing', icon: Zap },
];

export default function Layout({ children, currentPageName }) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const handleLogout = () => { base44.auth.logout(); };

  return (
    <div className="min-h-screen bg-slate-950">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to={createPageUrl('Home')} className="flex items-center gap-2">
              <img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6934626200d76f0c685241a5/7d0f0d76a_Untitleddesign14.png" alt="BuyerScouter Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
              <span className="text-lg sm:text-xl font-bold text-white hidden sm:block">Buyer<span className="text-amber-400">Scouter</span></span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link key={item.page} to={createPageUrl(item.page)} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors", currentPageName === item.page ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:text-white hover:bg-slate-800")}>
                  <item.icon className="w-4 h-4" />{item.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-400 hover:text-white hidden md:flex"><LogOut className="w-4 h-4 mr-2" />Logout</Button>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-slate-400 hover:text-white">{mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}</button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-t border-slate-800">
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => <Link key={item.page} to={createPageUrl(item.page)} onClick={() => setMobileMenuOpen(false)} className={cn("flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors", currentPageName === item.page ? "bg-amber-500/20 text-amber-400" : "text-slate-400 hover:text-white hover:bg-slate-800")}><item.icon className="w-5 h-5" />{item.name}</Link>)}
              <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 w-full"><LogOut className="w-5 h-5" />Logout</button>
            </div>
          </div>
        )}
      </nav>
      <main className="pt-16">{children}</main>
      <footer className="bg-slate-900/50 border-t border-slate-800 py-6 sm:py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2"><img src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/6934626200d76f0c685241a5/7d0f0d76a_Untitleddesign14.png" alt="BuyerScouter Logo" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" /><span className="text-xs sm:text-sm text-slate-400 text-center md:text-left">BuyerScouter — AI-Powered Buyer Matching</span></div>
            <p className="text-xs sm:text-sm text-slate-500">© {new Date().getFullYear()} All rights reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
