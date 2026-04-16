
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Megaphone, 
  ChevronRight,
  Headphones,
  Info
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
    <div className="page-fade min-h-full bg-[#f8fafc]">
      {/* MilesPay Important Notice Banner */}
      <div className="px-4 pt-4 animate-slide-up">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FFB800] via-[#FF8A00] to-[#FF5C00] p-6 text-white shadow-lg shadow-orange-100/50 border border-white/20">
          <div className="absolute top-4 right-4 w-12 h-12 bg-white rounded-2xl shadow-md flex flex-col items-center justify-center p-1 z-20">
             <div className="bg-red-600 text-white text-[8px] font-black px-1 rounded-sm leading-tight uppercase w-full text-center">MILES</div>
             <div className="text-[#FF8A00] text-[10px] font-black leading-tight uppercase">UPI</div>
             <div className="flex gap-0.5 mt-0.5">
               <div className="w-1.5 h-0.5 bg-red-500 rounded-full"></div>
               <div className="w-1.5 h-0.5 bg-yellow-400 rounded-full"></div>
               <div className="w-1.5 h-0.5 bg-blue-500 rounded-full"></div>
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-[20px] font-black italic tracking-tighter uppercase leading-tight mb-3 drop-shadow-md">
              MILESPAY IMPORTANT NOTICE!!
            </h2>
            <p className="text-[12px] leading-relaxed text-white/95 font-bold drop-shadow-sm px-2">
              If you didn't get tokens in 5 minutes, Pls contact our supporters with a payment screenshot. 
              To sell tokens and receive rupees fast, Pls follow the steps. Do not log in to UPI while selling, 
              Otherwise your tokens won't be processed. Thanks for your support!
            </p>
          </div>
        </div>
      </div>

      {/* Main Card with Background Image */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-[32px] p-6 relative overflow-hidden shadow-sm border border-slate-100 min-h-[280px]">
          {/* Background Image Layer */}
          <div 
            className="absolute inset-0 opacity-[0.25] pointer-events-none" 
            style={{ 
              backgroundImage: 'url("https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/public/Lg%20pay/IMG_20260416_075632.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative z-10">
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="font-black text-slate-800 text-[18px]">My IToken</h3>
              <span className="text-[10px] font-bold text-slate-400 tracking-tight">1 Rs = 1 IToken, 1 USDT ≈ 100 IToken</span>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-3xl shadow-sm">🇮🇳</span>
                <span className="text-5xl font-black text-slate-800 tracking-tighter">
                  {userData?.itoken_balance?.toFixed(2) || '0.00'}
                </span>
              </div>
              <Button 
                onClick={() => router.push('/buy')}
                className="bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-2xl h-14 px-8 shadow-lg shadow-blue-100 active:scale-95 transition-all gap-2 border-none"
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[12px] font-black text-white">₹</span>
                </div>
                <span className="font-black text-[16px] uppercase tracking-widest text-white">Buy</span>
              </Button>
            </div>

            {/* Stats Grid Layout as per Screenshot */}
            <div className="grid grid-cols-12 gap-y-6 gap-x-2 pt-4 border-t border-slate-100/50">
              <div className="col-span-4 flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Today Profit</span>
                <span className="text-[18px] font-black text-slate-800">₹{userData?.today_profit || '0'}</span>
              </div>
              <div className="col-span-4 flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Reward</span>
                <span className="text-[18px] font-black text-slate-800">7%</span>
              </div>
              <div className="col-span-4">
                 <Button 
                   onClick={() => router.push('/buy-history')}
                   variant="outline" 
                   className="w-full h-14 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm text-[11px] font-black text-slate-600 shadow-none active:scale-95 uppercase tracking-tight"
                 >
                   Buy History
                 </Button>
              </div>
              
              <div className="col-span-4 flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Auto Selling</span>
                <span className="text-[15px] font-black text-slate-800">Sell Set</span>
              </div>
              <div className="col-span-4 flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-1">Sell Faster</span>
                <span className="text-[15px] font-black text-slate-800">Link Upi</span>
              </div>
              <div className="col-span-4">
                 <Button 
                   onClick={() => router.push('/sell-history')}
                   variant="outline" 
                   className="w-full h-14 rounded-2xl border-slate-200 bg-white/80 backdrop-blur-sm text-[11px] font-black text-slate-600 shadow-none active:scale-95 uppercase tracking-tight"
                 >
                   Sell History
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Rules Ticker */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-2xl py-3 px-4 flex items-center justify-between shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <Megaphone className="h-4 w-4 text-[#2A85FF]" />
            <span className="text-[13px] font-bold text-slate-500 uppercase tracking-tight">Reward rules</span>
          </div>
          <Info className="h-4 w-4 text-slate-300" />
        </div>
      </div>

      {/* News Section */}
      <div className="mt-4 px-4 pb-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="bg-white rounded-[28px] p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[16px] font-black text-slate-800 uppercase tracking-tight">News</h3>
            <div className="flex items-center text-[#2A85FF] gap-1 text-[12px] font-black uppercase tracking-widest cursor-pointer">
              <span>More</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex flex-col gap-1 relative">
              <p className="text-[15px] font-black text-slate-700 uppercase">Reward</p>
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-bold text-slate-400">2025-03-21 19:54:18</p>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2A85FF] shadow-sm">
                  <Headphones className="h-5 w-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
