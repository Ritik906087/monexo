"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Info, 
  ChevronRight, 
  Megaphone, 
  Headphones,
  History,
  TrendingUp,
  Award,
  Zap
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
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="page-fade bg-[#F9FAFB] min-h-full pb-24">
      {/* Premium Banner */}
      <div className="px-4 pt-4 animate-slide-up">
        <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-br from-[#FF512F] to-[#DD2476] p-4 text-white shadow-lg border border-white/10">
          <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1 border border-white/20">
             <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
             <span className="text-[8px] font-black tracking-widest uppercase">MONEXO UPI</span>
          </div>
          <h2 className="text-lg font-black italic tracking-tighter mb-2 leading-none uppercase">
            MILESPAY <br />
            NOTICE
          </h2>
          <div className="text-[10px] leading-snug text-white/90 font-semibold space-y-1 max-w-[85%]">
            <p>If you didn't get tokens in 5 minutes, please contact support with payment screenshot.</p>
            <p>Do not log in to UPI while selling for faster processing.</p>
          </div>
        </div>
      </div>

      {/* Balance Card */}
      <div className="px-4 mt-5 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-100 relative">
          <div className="flex items-baseline gap-2 mb-3">
            <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest">My IToken Balance</h3>
            <span className="text-[9px] text-blue-500 font-black bg-blue-50 px-1.5 py-0.5 rounded">1 Rs = 1 IToken</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-lg shadow-inner border border-white">
                🇮🇳
              </div>
              <span className="text-3xl font-black text-slate-800 tracking-tighter">
                {userData?.itoken_balance?.toFixed(2) || '0.00'}
              </span>
            </div>
            <Button size="sm" className="bg-[#2A85FF] hover:bg-[#1a75ef] rounded-xl h-10 px-5 shadow-lg shadow-blue-100 active:scale-95 transition-all">
              <span className="font-bold text-xs">Buy Token</span>
            </Button>
          </div>

          <div className="h-px bg-slate-50 my-5"></div>

          {/* Optimized Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-50">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="h-3 w-3 text-green-500" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">Today Profit</p>
              </div>
              <p className="text-base font-black text-slate-800 tracking-tight">₹{userData?.today_profit?.toFixed(2) || '0.00'}</p>
            </div>

            <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-50">
              <div className="flex items-center gap-2 mb-1">
                <Award className="h-3 w-3 text-orange-500" />
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">My Reward</p>
              </div>
              <p className="text-base font-black text-slate-800 tracking-tight">{userData?.reward_percent || 5}%</p>
            </div>

            <div className="col-span-1">
               <Button variant="outline" className="h-10 rounded-xl w-full border-slate-100 text-[10px] font-black text-slate-600 hover:bg-slate-50 shadow-sm active:scale-95 transition-all">
                 BUY HISTORY
               </Button>
            </div>
            <div className="col-span-1">
               <Button variant="outline" className="h-10 rounded-xl w-full border-slate-100 text-[10px] font-black text-slate-600 hover:bg-slate-50 shadow-sm active:scale-95 transition-all">
                 SELL HISTORY
               </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker Banner */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-slate-50">
          <div className="flex items-center gap-2">
            <div className="bg-blue-50 p-1.5 rounded-lg">
              <Megaphone className="h-3.5 w-3.5 text-blue-500" />
            </div>
            <span className="text-[10px] font-bold text-slate-600">Welcome to MONEXO UPI Payments</span>
          </div>
          <Zap className="h-3.5 w-3.5 text-yellow-400" />
        </div>
      </div>

      {/* Sections Grid */}
      <div className="mt-6 px-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Recent News</h3>
          <div className="flex items-center text-blue-500 gap-0.5 text-[10px] font-black cursor-pointer hover:underline uppercase">
            <span>More</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>

        <div className="space-y-3 pb-8">
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-50 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Headphones className="h-5 w-5 text-blue-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-800 tracking-tight">Reward System v2.0</p>
                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">Mar 21, 2025</p>
              </div>
            </div>
            <div className="bg-slate-50 px-2 py-1 rounded-md">
               <span className="text-[8px] font-black text-slate-400 uppercase">NEW</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}