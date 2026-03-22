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
    <div className="page-fade min-h-full pb-20 bg-[#f8fafc]">
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

      {/* Main Balance Card - With Watermark */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-[24px] p-5 relative overflow-hidden shadow-sm border border-slate-100 min-h-[220px]">
          {/* Watermark Background - Matching the gold coin texture from provided URL */}
          <div 
            className="absolute inset-0 opacity-[0.08] pointer-events-none" 
            style={{ 
              backgroundImage: 'url("https://csgdgbbwhmiyafwwxvxd.supabase.co/storage/v1/object/public/Watermark/watermarked-29249.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h3 className="font-black text-slate-800 text-[13px] uppercase tracking-tight leading-none">My IToken</h3>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-tighter bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">
                  1 Rs = 1 IToken, 1 USDT ≈ 100 IToken
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-lg shadow-inner border border-white shrink-0">🇮🇳</div>
                <span className="text-3xl font-black text-slate-800 tracking-tighter leading-none">
                  {userData?.itoken_balance?.toFixed(2) || '14.30'}
                </span>
              </div>
              <Button size="sm" className="bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-xl h-10 px-5 shadow-lg shadow-blue-200 active:scale-95 transition-all gap-1.5 border-none">
                <Zap className="h-3 w-3 fill-white text-white" />
                <span className="font-black text-[11px] uppercase tracking-wider text-white">Buy</span>
              </Button>
            </div>

            <div className="h-[1px] bg-slate-50/80 my-5"></div>

            {/* Stats Grid - High Density */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Today Profit</span>
                  <span className="text-[14px] font-black text-slate-800 tracking-tight">{userData?.today_profit || '0'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Auto Selling</span>
                  <span className="text-[14px] font-black text-slate-800 tracking-tight">Sell Set</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Reward</span>
                  <span className="text-[14px] font-black text-slate-800 tracking-tight">{userData?.reward_percent || '5'}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Sell Faster</span>
                  <span className="text-[14px] font-black text-slate-800 tracking-tight">Link Upi</span>
                </div>
              </div>

              {/* Action Buttons Integrated */}
              <div className="col-span-2 grid grid-cols-2 gap-2.5 mt-2">
                 <Button variant="outline" className="h-10 rounded-xl border-slate-100 bg-slate-50/30 text-[10px] font-black text-slate-600 shadow-none active:scale-95 uppercase tracking-tight">Buy History</Button>
                 <Button variant="outline" className="h-10 rounded-xl border-slate-100 bg-slate-50/30 text-[10px] font-black text-slate-600 shadow-none active:scale-95 uppercase tracking-tight">Sell History</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker - Compact */}
      <div className="px-4 mt-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-xl py-2.5 px-3 flex items-center justify-between shadow-sm border border-slate-50">
          <div className="flex items-center gap-2">
            <Megaphone className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Welcome MILES</span>
          </div>
          <Info className="h-3.5 w-3.5 text-slate-300" />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-5 px-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="bg-white rounded-[24px] p-5 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">News</h3>
            <div className="flex items-center text-[#2A85FF] gap-0.5 text-[10px] font-black cursor-pointer uppercase">
              <span>More</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
          
          <div className="h-[1px] bg-slate-50 my-4"></div>

          <div className="flex items-center justify-between group cursor-pointer active:scale-95 transition-all">
            <div className="flex flex-col gap-1">
              <p className="text-[12px] font-black text-slate-800 uppercase tracking-tight leading-none">Reward</p>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="h-3 w-3" />
                <p className="text-[9px] font-bold uppercase tracking-widest leading-none">2025-03-21 19:54:18</p>
              </div>
            </div>
            <div className="relative">
              <div className="w-11 h-11 bg-blue-50/50 rounded-2xl flex items-center justify-center text-[#2A85FF] border border-blue-100">
                <Headphones className="h-6 w-6" />
              </div>
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#2A85FF] rounded-full border-2 border-white animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
