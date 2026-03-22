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
    <div className="page-fade min-h-full pb-20">
      {/* Notice Banner - Optimized Size */}
      <div className="px-4 pt-3 animate-slide-up">
        <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-br from-[#f97316] to-[#ea580c] p-4 text-white shadow-lg border border-white/20">
          <div className="absolute top-3 right-4 bg-white/20 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1 border border-white/20">
             <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
             <span className="text-[7px] font-black tracking-widest uppercase">LIVE</span>
          </div>
          <h2 className="text-lg font-black italic tracking-tighter mb-1 leading-none uppercase">
            MONEXO NOTICE
          </h2>
          <div className="text-[9px] leading-snug text-white/90 font-bold space-y-1 max-w-[95%]">
            <p>• If tokens not received in 5 mins, contact support with screenshot.</p>
            <p>• Avoid UPI login while selling for faster processing.</p>
          </div>
        </div>
      </div>

      {/* Main Balance Card - Compact & Premium */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="glass-card rounded-[24px] p-5 relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-black text-slate-400 text-[9px] uppercase tracking-[0.2em]">IToken Balance</h3>
            <span className="text-[8px] text-blue-600 font-black bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 italic">1 Rs = 1 IToken</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-lg shadow-inner border border-white">🇮🇳</div>
              <span className="text-3xl font-black text-slate-800 tracking-tighter">
                {userData?.itoken_balance?.toFixed(2) || '0.00'}
              </span>
            </div>
            <Button size="sm" className="fintech-gradient hover:opacity-90 rounded-xl h-10 px-4 shadow-lg shadow-blue-200 active:scale-95 transition-all">
              <span className="font-black text-[10px] uppercase tracking-wider">Buy Token</span>
            </Button>
          </div>

          <div className="h-px bg-slate-100 my-4"></div>

          {/* Core Stats Grid - Optimized */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 mb-1">
                <TrendingUp className="h-2.5 w-2.5 text-green-500" />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Today Profit</p>
              </div>
              <p className="text-base font-black text-slate-800 tracking-tight">₹{userData?.today_profit?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 mb-1">
                <Award className="h-2.5 w-2.5 text-orange-500" />
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">My Reward</p>
              </div>
              <p className="text-base font-black text-slate-800 tracking-tight">{userData?.reward_percent || 5}%</p>
            </div>
          </div>
          
          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2 mt-3">
             <Button variant="outline" className="h-9 rounded-xl border-slate-200 text-[9px] font-black text-slate-600 shadow-sm active:scale-95">BUY HISTORY</Button>
             <Button variant="outline" className="h-9 rounded-xl border-slate-200 text-[9px] font-black text-slate-600 shadow-sm active:scale-95">SELL HISTORY</Button>
          </div>
        </div>
      </div>

      {/* News Ticker - Compact */}
      <div className="px-4 mt-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-slate-50">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg">
              <Megaphone className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">Welcome to MONEXO UPI</span>
          </div>
          <Zap className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-5 px-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Latest Updates</h3>
          <div className="flex items-center text-blue-500 gap-0.5 text-[9px] font-black cursor-pointer uppercase">
            <span>More</span>
            <ChevronRight className="h-2.5 w-2.5" />
          </div>
        </div>

        <div className="space-y-3 pb-8">
          <div className="glass-card p-3 rounded-[20px] flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Headphones className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Reward System v2.0</p>
                <p className="text-[8px] font-bold text-slate-300 uppercase mt-0.5">Mar 21, 2025</p>
              </div>
            </div>
            <div className="bg-slate-100 px-2 py-0.5 rounded-lg">
               <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">NEW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
