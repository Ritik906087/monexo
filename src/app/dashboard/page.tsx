"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Megaphone, 
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setUserData(data);
      }
      setLoading(false);
    }

    fetchUserData();
  }, [router]);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="page-fade min-h-full pb-24">
      {/* Notice Banner - High Impact */}
      <div className="px-4 pt-4 animate-slide-up">
        <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-br from-[#f97316] to-[#ea580c] p-5 text-white shadow-2xl shadow-orange-200 border border-white/20">
          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 border border-white/20">
             <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
             <span className="text-[8px] font-black tracking-widest uppercase">LIVE</span>
          </div>
          <h2 className="text-xl font-black italic tracking-tighter mb-2 leading-none uppercase">
            IMPORTANT<br />NOTICE!!
          </h2>
          <div className="text-[10px] leading-relaxed text-white/90 font-bold space-y-2 max-w-[90%]">
            <p>If you didn't get tokens in 5 minutes, please contact support with payment screenshot.</p>
            <p>Do not log in to UPI while selling for faster processing.</p>
          </div>
        </div>
      </div>

      {/* Main Balance Card - Premium Glassmorphism */}
      <div className="px-4 mt-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card rounded-[28px] p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.2em]">My IToken Balance</h3>
            <span className="text-[9px] text-blue-600 font-black bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 italic">1 Rs = 1 IToken</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-xl shadow-inner border border-white">🇮🇳</div>
              <span className="text-4xl font-black text-slate-800 tracking-tighter">
                {userData?.itoken_balance?.toFixed(2) || '0.00'}
              </span>
            </div>
            <Button size="lg" className="fintech-gradient hover:opacity-90 rounded-2xl h-12 px-6 shadow-xl shadow-blue-200 active:scale-95 transition-all">
              <span className="font-black text-xs uppercase tracking-widest">Buy Token</span>
            </Button>
          </div>

          <div className="h-px bg-slate-100 my-6"></div>

          {/* Core Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Today Profit</p>
              </div>
              <p className="text-lg font-black text-slate-800 tracking-tight">₹{userData?.today_profit?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-3 w-3 text-orange-500" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">My Reward</p>
              </div>
              <p className="text-lg font-black text-slate-800 tracking-tight">{userData?.reward_percent || 5}%</p>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="grid grid-cols-2 gap-3 mt-4">
             <Button variant="outline" className="h-11 rounded-2xl border-slate-200 text-[10px] font-black text-slate-600 shadow-sm active:scale-95">BUY HISTORY</Button>
             <Button variant="outline" className="h-11 rounded-2xl border-slate-200 text-[10px] font-black text-slate-600 shadow-sm active:scale-95">SELL HISTORY</Button>
          </div>
        </div>
      </div>

      {/* News Ticker */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm border border-slate-50">
          <div className="flex items-center gap-3">
            <div className="bg-blue-50 p-2 rounded-xl">
              <Megaphone className="h-4 w-4 text-blue-500" />
            </div>
            <span className="text-[11px] font-black text-slate-600 uppercase tracking-tight">Welcome to MONEXO UPI Payments</span>
          </div>
          <Zap className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-6 px-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">Latest Updates</h3>
          <div className="flex items-center text-blue-500 gap-0.5 text-[10px] font-black cursor-pointer uppercase">
            <span>More</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>

        <div className="space-y-4 pb-12">
          <div className="glass-card p-4 rounded-[24px] flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center">
                <Headphones className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs font-black text-slate-800 uppercase tracking-tight">Reward System v2.0</p>
                <p className="text-[9px] font-bold text-slate-300 uppercase mt-1">Mar 21, 2025</p>
              </div>
            </div>
            <div className="bg-slate-100 px-3 py-1 rounded-lg">
               <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">NEW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
