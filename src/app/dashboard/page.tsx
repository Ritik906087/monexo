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
  Info,
  Clock
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
    <div className="page-fade min-h-full pb-20 bg-[#f8fafc] overflow-hidden">
      {/* Notice Banner - Compact */}
      <div className="px-3 pt-2 animate-slide-up">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#f97316] to-[#ea580c] p-3 text-white shadow-md border border-white/20">
          <div className="absolute top-2 right-3 bg-white/20 backdrop-blur-md rounded-full px-1.5 py-0.5 flex items-center gap-1">
             <div className="w-1 h-1 rounded-full bg-white animate-pulse"></div>
             <span className="text-[6px] font-black tracking-widest uppercase">LIVE</span>
          </div>
          <h2 className="text-[13px] font-black italic tracking-tighter mb-0.5 leading-none uppercase">
            MONEXO NOTICE
          </h2>
          <div className="text-[8px] leading-tight text-white/90 font-bold space-y-0.5">
            <p>• Fast support: share screenshot if tokens delay > 5m.</p>
            <p>• Quick sell: avoid UPI login while selling.</p>
          </div>
        </div>
      </div>

      {/* Main Balance Card - Optimized & Compact */}
      <div className="px-3 mt-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-[24px] p-4 relative overflow-hidden shadow-sm border border-slate-100 min-h-[160px]">
          {/* Subtle Watermark - Low opacity for readability */}
          <div 
            className="absolute inset-0 opacity-[0.05] pointer-events-none" 
            style={{ 
              backgroundImage: 'url("https://csgdgbbwhmiyafwwxvxd.supabase.co/storage/v1/object/public/Watermark/watermarked-29249.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <h3 className="font-black text-slate-800 text-[11px] uppercase tracking-tight leading-none mb-1">My IToken</h3>
                <span className="text-[7px] text-slate-400 font-bold uppercase tracking-tighter bg-slate-50 px-1 py-0.5 rounded border border-slate-100 w-fit">
                  1 Rs = 1 IToken
                </span>
              </div>
              <Button size="sm" className="bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-lg h-8 px-4 shadow-lg shadow-blue-100 active:scale-95 transition-all gap-1.5 border-none">
                <Zap className="h-2.5 w-2.5 fill-white text-white" />
                <span className="font-black text-[9px] uppercase tracking-wider text-white">Buy</span>
              </Button>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-full bg-slate-50 flex items-center justify-center text-sm shadow-inner border border-white shrink-0">🇮🇳</div>
              <span className="text-2xl font-black text-slate-800 tracking-tighter leading-none">
                {userData?.itoken_balance?.toFixed(2) || '14.30'}
              </span>
            </div>

            <div className="h-[1px] bg-slate-50/80 my-3"></div>

            {/* Stats Grid - High Density */}
            <div className="grid grid-cols-2 gap-x-2 gap-y-2">
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Today Profit</span>
                <span className="text-[12px] font-black text-slate-800 tracking-tight leading-none">₹{userData?.today_profit || '0'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Reward</span>
                <span className="text-[12px] font-black text-slate-800 tracking-tight leading-none">{userData?.reward_percent || '5'}%</span>
              </div>
              
              <div className="col-span-2 grid grid-cols-2 gap-2 mt-1">
                 <Button variant="outline" className="h-8 rounded-lg border-slate-100 bg-slate-50/50 text-[9px] font-black text-slate-600 shadow-none active:scale-95 uppercase tracking-tight">Buy Hist</Button>
                 <Button variant="outline" className="h-8 rounded-lg border-slate-100 bg-slate-50/50 text-[9px] font-black text-slate-600 shadow-none active:scale-95 uppercase tracking-tight">Sell Hist</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker - Ultra Compact */}
      <div className="px-3 mt-2.5 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-xl py-2 px-3 flex items-center justify-between shadow-sm border border-slate-50">
          <div className="flex items-center gap-2">
            <Megaphone className="h-3 w-3 text-[#2A85FF]" />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tight">Welcome User_{userData?.numeric_id?.toString().slice(-4) || '7092'}</span>
          </div>
          <Info className="h-3 w-3 text-slate-300" />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-4 px-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Live News</h3>
            <div className="flex items-center text-[#2A85FF] gap-0.5 text-[9px] font-black cursor-pointer uppercase">
              <span>View All</span>
              <ChevronRight className="h-2.5 w-2.5" />
            </div>
          </div>
          
          <div className="h-[1px] bg-slate-50 my-3"></div>

          <div className="flex items-center justify-between group cursor-pointer active:scale-95 transition-all">
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] font-black text-slate-800 uppercase tracking-tight leading-none">System Reward Added</p>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="h-2.5 w-2.5" />
                <p className="text-[8px] font-bold uppercase tracking-widest leading-none">2025-03-21 19:54</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-9 h-9 bg-blue-50/50 rounded-xl flex items-center justify-center text-[#2A85FF] border border-blue-100">
                <Headphones className="h-5 w-5" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#2A85FF] rounded-full border border-white animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
