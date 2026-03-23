
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
  History,
  Info,
  ShieldCheck,
  ChevronRight as ChevronIcon
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
      {/* Premium Large Notice Banner - Matching Photo but Blue */}
      <div className="px-4 pt-3 animate-slide-up">
        <div className="relative rounded-[24px] overflow-hidden bg-gradient-to-br from-[#2A85FF] via-[#1A7BFF] to-[#0D6EFD] p-5 text-white shadow-xl shadow-blue-200 border border-white/20 min-h-[160px]">
          {/* Circular accents like in photo */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          
          {/* Floating Logo Badge Placeholder - Adjusted positioning and z-index */}
          <div className="absolute top-2 right-4 w-12 h-12 bg-white rounded-xl shadow-lg flex flex-col items-center justify-center p-1 border-2 border-[#2A85FF] z-20">
             <span className="text-[6px] font-black text-[#2A85FF] leading-none uppercase text-center">MONEXO</span>
             <span className="text-[5px] font-bold text-slate-400 leading-none mt-0.5 uppercase">UPI</span>
             <div className="flex gap-0.5 mt-1">
               <div className="w-2 h-0.5 bg-red-500"></div>
               <div className="w-2 h-0.5 bg-yellow-400"></div>
               <div className="w-2 h-0.5 bg-blue-500"></div>
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Added px-10 to prevent overlap with logo in corners */}
            <h2 className="text-[17px] font-black italic tracking-tighter uppercase leading-none mb-3 drop-shadow-md px-10">
              MONEXOPAY IMPORTANT NOTICE!!
            </h2>
            
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3 border border-white/20 w-full">
              <p className="text-[10px] leading-tight text-white font-bold text-center">
                If you didn't get tokens in 5 minutes, Pls contact our supporters with a payment screenshot. 
                To sell tokens and receive rupees fast, Pls follow the steps. Do not log in to UPI while selling, 
                Otherwise your tokens won't be processed. Thanks for your support!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Balance Card - Photo Layout Match */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-[28px] p-5 relative overflow-hidden shadow-sm border border-slate-100">
          {/* Watermark */}
          <div 
            className="absolute inset-0 opacity-[0.12] pointer-events-none" 
            style={{ 
              backgroundImage: 'url("https://csgdgbbwhmiyafwwxvxd.supabase.co/storage/v1/object/public/Watermark/watermarked-29249.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-bold text-slate-800 text-[14px]">My IToken</h3>
              <span className="text-[10px] font-medium text-slate-400">1 Rs = 1 IToken, 1 USDT ≈ 100 IToken</span>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-6 rounded-md bg-slate-50 flex items-center justify-center text-lg shadow-sm border border-slate-100 overflow-hidden">🇮🇳</div>
                <span className="text-4xl font-black text-slate-800 tracking-tighter">
                  {userData?.itoken_balance?.toFixed(2) || '14.30'}
                </span>
              </div>
              <Button className="bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-xl h-12 px-6 shadow-lg shadow-blue-100 active:scale-95 transition-all gap-2 border-none">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white">₹</span>
                </div>
                <span className="font-black text-[14px] uppercase tracking-wider text-white">Buy</span>
              </Button>
            </div>

            <div className="h-[1px] bg-slate-100/50 my-5"></div>

            {/* Stats Grid - Photo Matching 3-Column Layout */}
            <div className="grid grid-cols-3 gap-4 items-center">
              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400">Today Profit</span>
                  <span className="text-[14px] font-black text-slate-800">₹{userData?.today_profit || '0'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400">Auto Selling</span>
                  <span className="text-[14px] font-black text-slate-800">Sell Set</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400">Reward</span>
                  <span className="text-[14px] font-black text-slate-800">{userData?.reward_percent || '5'}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold text-slate-400">Sell Faster</span>
                  <span className="text-[14px] font-black text-slate-800">Link Upi</span>
                </div>
              </div>

              <div className="space-y-3">
                 <Button variant="outline" className="w-full h-11 rounded-xl border-slate-100 bg-white text-[11px] font-bold text-slate-600 shadow-none active:scale-95 px-3">
                   Buy History
                 </Button>
                 <Button variant="outline" className="w-full h-11 rounded-xl border-slate-100 bg-white text-[11px] font-bold text-slate-600 shadow-none active:scale-95 px-3">
                   Sell History
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-xl py-2 px-4 flex items-center justify-between shadow-sm border border-slate-50">
          <div className="flex items-center gap-2">
            <Megaphone className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[11px] font-bold text-slate-500">Welcome MONEXO</span>
          </div>
          <Info className="h-3.5 w-3.5 text-slate-300" />
        </div>
      </div>

      {/* News Section */}
      <div className="mt-4 px-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="bg-white rounded-[24px] p-4 shadow-sm border border-slate-50">
          <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-2">
            <h3 className="text-[14px] font-bold text-slate-800">News</h3>
            <div className="flex items-center text-slate-400 gap-0.5 text-[11px] font-medium cursor-pointer">
              <span>More</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-1">
              <p className="text-[13px] font-bold text-slate-700">Reward</p>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-slate-400">2025-03-21 19:54:18</p>
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#2A85FF]">
                  <Headphones className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
