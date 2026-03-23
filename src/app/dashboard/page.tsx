
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
      {/* Premium Compact Notice Banner */}
      <div className="px-4 pt-3 animate-slide-up">
        <div className="relative rounded-[28px] overflow-hidden bg-gradient-to-br from-[#2A85FF] to-[#1A7BFF] p-5 text-white shadow-lg shadow-blue-100/50 border border-white/20">
          <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-0.5 border border-blue-100 z-20">
             <span className="text-[6px] font-black text-[#2A85FF] leading-none uppercase text-center">MONEXO</span>
             <span className="text-[5px] font-bold text-slate-400 leading-none mt-0.5 uppercase tracking-tighter">UPI</span>
             <div className="flex gap-0.5 mt-0.5">
               <div className="w-1.5 h-0.5 bg-red-500 rounded-full"></div>
               <div className="w-1.5 h-0.5 bg-yellow-400 rounded-full"></div>
               <div className="w-1.5 h-0.5 bg-blue-500 rounded-full"></div>
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center">
            <h2 className="text-[17px] font-black italic tracking-tighter uppercase leading-tight mb-3 px-10 drop-shadow-sm">
              MONEXOPAY IMPORTANT NOTICE!!
            </h2>
            <p className="text-[11.5px] leading-relaxed text-white/95 font-bold drop-shadow-sm px-1">
              If you didn't get tokens in 5 minutes, Pls contact our supporters with a payment screenshot. 
              To sell tokens and receive rupees fast, Pls follow the steps. Do not log in to UPI while selling, 
              Otherwise your tokens won't be processed. Thanks for your support!
            </p>
          </div>
        </div>
      </div>

      {/* Main Balance Card */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-[32px] p-6 relative overflow-hidden shadow-sm border border-slate-100">
          <div 
            className="absolute inset-0 opacity-[0.08] pointer-events-none" 
            style={{ 
              backgroundImage: 'url("https://csgdgbbwhmiyafwwxvxd.supabase.co/storage/v1/object/public/Watermark/watermarked-29249.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-black text-slate-800 text-[15px]">My IToken</h3>
              <span className="text-[10px] font-bold text-slate-400 tracking-tight">1 Rs = 1 IToken, 1 USDT ≈ 100 IToken</span>
            </div>

            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <span className="text-2xl shadow-sm">🇮🇳</span>
                <span className="text-4xl font-black text-slate-800 tracking-tighter">
                  {userData?.itoken_balance?.toFixed(2) || '0.00'}
                </span>
              </div>
              <Button 
                onClick={() => router.push('/buy')}
                className="bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-2xl h-12 px-6 shadow-lg shadow-blue-100 active:scale-95 transition-all gap-2 border-none"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[11px] font-black text-white">₹</span>
                </div>
                <span className="font-black text-[14px] uppercase tracking-widest text-white">Buy</span>
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-y-6 gap-x-2">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Today Profit</span>
                <span className="text-[15px] font-black text-slate-800">₹{userData?.today_profit || '0'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Reward</span>
                <span className="text-[15px] font-black text-slate-800">7%</span>
              </div>
              <div className="row-span-2 flex flex-col gap-3">
                 <Button 
                   onClick={() => router.push('/buy-history')}
                   variant="outline" 
                   className="h-10 rounded-xl border-slate-100 bg-white text-[10px] font-black text-slate-600 shadow-none active:scale-95 px-2 uppercase tracking-tight"
                 >
                   Buy History
                 </Button>
                 <Button 
                   onClick={() => router.push('/sell-history')}
                   variant="outline" 
                   className="h-10 rounded-xl border-slate-100 bg-white text-[10px] font-black text-slate-600 shadow-none active:scale-95 px-2 uppercase tracking-tight"
                 >
                   Sell History
                 </Button>
              </div>
              
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Auto Selling</span>
                <span className="text-[15px] font-black text-slate-800">Sell Set</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Sell Faster</span>
                <span className="text-[15px] font-black text-slate-800">Link Upi</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker Section */}
      <div className="px-4 mt-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-2xl py-2.5 px-4 flex items-center justify-between shadow-sm border border-slate-100">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-[#2A85FF]" />
            <span className="text-[12px] font-black text-slate-600 uppercase tracking-tight">Welcome MONEXO</span>
          </div>
          <Info className="h-4 w-4 text-slate-300" />
        </div>
      </div>

      {/* News Section */}
      <div className="mt-4 px-4 pb-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[15px] font-black text-slate-800 uppercase tracking-tight">News</h3>
            <div className="flex items-center text-[#2A85FF] gap-1 text-[11px] font-black uppercase tracking-widest cursor-pointer">
              <span>More</span>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-1 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
              <p className="text-[14px] font-black text-slate-700 uppercase">Reward</p>
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-bold text-slate-400">2025-03-21 19:54:18</p>
                <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-[#2A85FF] shadow-sm">
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
