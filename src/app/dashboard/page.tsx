"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Megaphone, 
  TrendingUp,
  Award,
  Zap,
  ChevronRight,
  Headphones,
  Clock,
  ArrowUpRight,
  History
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
    <div className="flex items-center justify-center h-full bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A85FF]"></div>
    </div>
  );

  return (
    <div className="page-fade min-h-full pb-24 bg-[#f8fafc] overflow-hidden">
      {/* Premium Notice Banner */}
      <div className="px-4 pt-3 animate-slide-up">
        <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-r from-[#2A85FF] to-[#1A7BFF] p-3 text-white shadow-lg shadow-blue-100 border border-white/10">
          <div className="absolute top-2 right-3 bg-white/20 backdrop-blur-md rounded-full px-2 py-0.5 flex items-center gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></div>
             <span className="text-[7px] font-black tracking-widest uppercase">SYSTEM LIVE</span>
          </div>
          <div className="flex items-center gap-2 mb-1">
             <Megaphone className="h-3 w-3 text-blue-100" />
             <h2 className="text-[12px] font-black italic tracking-tighter uppercase leading-none">
               Official Notice
             </h2>
          </div>
          <div className="text-[9px] leading-tight text-white/90 font-bold space-y-0.5 mt-1">
            <p>• Fast support: share screenshot if tokens delay &gt; 5m.</p>
            <p>• Quick sell: avoid UPI login while selling.</p>
          </div>
        </div>
      </div>

      {/* Main Balance Card - Professional Height & Increased Watermark Visibility */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-[28px] p-5 relative overflow-hidden shadow-sm border border-slate-100 min-h-[190px] flex flex-col justify-between">
          {/* Subtle Watermark - Increased Opacity for better visibility */}
          <div 
            className="absolute inset-0 opacity-[0.12] pointer-events-none" 
            style={{ 
              backgroundImage: 'url("https://csgdgbbwhmiyafwwxvxd.supabase.co/storage/v1/object/public/Watermark/watermarked-29249.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <h3 className="font-black text-slate-400 text-[10px] uppercase tracking-[0.1em] leading-none mb-1.5">My IToken Balance</h3>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-4 rounded-sm bg-slate-50 flex items-center justify-center text-[10px] shadow-sm border border-slate-100 overflow-hidden shrink-0">🇮🇳</div>
                  <span className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
                    {userData?.itoken_balance?.toFixed(2) || '14.30'}
                  </span>
                </div>
              </div>
              <Button size="sm" className="bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-xl h-9 px-4 shadow-xl shadow-blue-100 active:scale-95 transition-all gap-1.5 border-none">
                <Zap className="h-3 w-3 fill-white text-white" />
                <span className="font-black text-[10px] uppercase tracking-wider text-white">Buy</span>
              </Button>
            </div>

            <div className="h-[1px] bg-slate-100/50 my-4"></div>

            {/* Stats Grid - High Professionalism */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                   <TrendingUp className="h-2.5 w-2.5 text-green-500" />
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Today Profit</span>
                </div>
                <span className="text-[14px] font-black text-slate-800 tracking-tight leading-none">₹{userData?.today_profit || '0.00'}</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5 mb-0.5">
                   <Award className="h-2.5 w-2.5 text-orange-400" />
                   <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">My Reward</span>
                </div>
                <span className="text-[14px] font-black text-slate-800 tracking-tight leading-none">{userData?.reward_percent || '5'}%</span>
              </div>
              
              <div className="col-span-2 grid grid-cols-2 gap-3 mt-1">
                 <Button variant="outline" className="h-9 rounded-xl border-slate-100 bg-white/60 backdrop-blur-sm text-[9px] font-black text-slate-600 shadow-none active:scale-95 uppercase tracking-widest gap-2">
                   <History className="h-3 w-3" />
                   Buy Hist
                 </Button>
                 <Button variant="outline" className="h-9 rounded-xl border-slate-100 bg-white/60 backdrop-blur-sm text-[9px] font-black text-slate-600 shadow-none active:scale-95 uppercase tracking-widest gap-2">
                   <ArrowUpRight className="h-3 w-3" />
                   Sell Hist
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Status Ticker */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-2xl py-2 px-4 flex items-center justify-between shadow-sm border border-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2A85FF]"></div>
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">User_{userData?.numeric_id?.toString().slice(-4) || '7092'} Connected</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-md">
             <span className="text-[7px] font-black text-[#2A85FF] uppercase">Secure</span>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-4 px-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">News Feed</h3>
            <div className="flex items-center text-[#2A85FF] gap-0.5 text-[9px] font-black cursor-pointer uppercase tracking-tight">
              <span>Explore</span>
              <ChevronRight className="h-2.5 w-2.5" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between group cursor-pointer active:scale-95 transition-all">
              <div className="flex flex-col gap-1">
                <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none">System Reward Update</p>
                <div className="flex items-center gap-1.5 text-slate-300">
                  <Clock className="h-2.5 w-2.5" />
                  <p className="text-[8px] font-bold uppercase tracking-widest leading-none">2025-03-21 19:54</p>
                </div>
              </div>
              <div className="relative">
                <div className="w-10 h-10 bg-blue-50/50 rounded-2xl flex items-center justify-center text-[#2A85FF] border border-blue-100">
                  <Headphones className="h-5 w-5" />
                </div>
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#2A85FF] rounded-full border border-white animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
