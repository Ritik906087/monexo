
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

  const DASHBOARD_BG_IMAGE = "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/IMG_20260416_075632.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvSU1HXzIwMjYwNDE2XzA3NTYzMi5qcGciLCJpYXQiOjE3NzYzMDcxNjcsImV4cCI6MTgwNzg0MzE2N30.Qiqh9ipjHfmWieqbBs6gsBQxLXyFQQMBWStQ1kJoLok";

  return (
    <div className="page-fade min-h-full bg-[#f8fafc]">
      {/* MilesPay Important Notice Banner - Compact Version */}
      <div className="px-3 pt-3 animate-slide-up">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-[#FFB800] via-[#FF8A00] to-[#FF5C00] p-4 text-white shadow-md border border-white/20">
          <div className="absolute top-3 right-3 w-10 h-10 bg-white rounded-xl shadow-md flex flex-col items-center justify-center p-1 z-20">
             <div className="bg-red-600 text-white text-[7px] font-black px-1 rounded-sm leading-tight uppercase w-full text-center">MILES</div>
             <div className="text-[#FF8A00] text-[8px] font-black leading-tight uppercase">UPI</div>
             <div className="flex gap-0.5 mt-0.5">
               <div className="w-1 h-0.5 bg-red-500 rounded-full"></div>
               <div className="w-1 h-0.5 bg-yellow-400 rounded-full"></div>
               <div className="w-1 h-0.5 bg-blue-500 rounded-full"></div>
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-start text-left pr-10">
            <h2 className="text-[14px] font-black italic tracking-tighter uppercase leading-tight mb-1.5 drop-shadow-sm">
              MILESPAY IMPORTANT NOTICE!!
            </h2>
            <p className="text-[10px] leading-snug text-white/95 font-bold drop-shadow-sm line-clamp-3">
              If you didn't get tokens in 5 minutes, Pls contact our supporters with a payment screenshot. 
              To sell tokens and receive rupees fast, Pls follow the steps.
            </p>
          </div>
        </div>
      </div>

      {/* Main Card with Refined Background */}
      <div className="px-3 mt-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-2xl p-4 relative overflow-hidden shadow-sm border border-slate-100 min-h-[220px]">
          {/* Subtle Background Layer */}
          <div 
            className="absolute inset-0 opacity-[0.15] pointer-events-none" 
            style={{ 
              backgroundImage: `url("${DASHBOARD_BG_IMAGE}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          {/* Strong White Overlay for Readability and Subtle Texture Effect */}
          <div className="absolute inset-0 bg-white/85 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-baseline gap-2 mb-3">
              <h3 className="font-black text-slate-800 text-[15px]">My IToken</h3>
              <span className="text-[9px] font-bold text-slate-400 tracking-tight">1 Rs = 1 IToken</span>
            </div>

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🇮🇳</span>
                <span className="text-4xl font-black text-slate-800 tracking-tighter">
                  {userData?.itoken_balance?.toFixed(2) || '0.00'}
                </span>
              </div>
              <Button 
                onClick={() => router.push('/buy')}
                className="bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-xl h-11 px-6 shadow-md active:scale-95 transition-all gap-2 border-none"
              >
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-[10px] font-black text-white">₹</span>
                </div>
                <span className="font-black text-[14px] uppercase tracking-wider text-white">Buy</span>
              </Button>
            </div>

            {/* Compact Stats Grid Layout */}
            <div className="grid grid-cols-12 gap-y-4 gap-x-2 pt-3 border-t border-slate-100/50">
              <div className="col-span-4 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Today Profit</span>
                <span className="text-[16px] font-black text-slate-800">₹{userData?.today_profit || '0'}</span>
              </div>
              <div className="col-span-4 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Reward</span>
                <span className="text-[16px] font-black text-[#2A85FF]">7%</span>
              </div>
              <div className="col-span-4">
                 <Button 
                   onClick={() => router.push('/buy-history')}
                   variant="outline" 
                   className="w-full h-10 rounded-xl border-slate-100 bg-white/60 backdrop-blur-sm text-[10px] font-black text-slate-500 shadow-none active:scale-95 uppercase tracking-tight"
                 >
                   History
                 </Button>
              </div>
              
              <div className="col-span-4 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Auto Selling</span>
                <span className="text-[13px] font-black text-slate-700">Active</span>
              </div>
              <div className="col-span-4 flex flex-col">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">Sell Faster</span>
                <span className="text-[13px] font-black text-slate-700">Link Upi</span>
              </div>
              <div className="col-span-4">
                 <Button 
                   onClick={() => router.push('/sell-history')}
                   variant="outline" 
                   className="w-full h-10 rounded-xl border-slate-100 bg-white/60 backdrop-blur-sm text-[10px] font-black text-slate-500 shadow-none active:scale-95 uppercase tracking-tight"
                 >
                   Records
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Rules Ticker - Smaller */}
      <div className="px-3 mt-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-xl py-2.5 px-3.5 flex items-center justify-between shadow-sm border border-slate-100">
          <div className="flex items-center gap-2.5">
            <Megaphone className="h-3.5 w-3.5 text-[#2A85FF]" />
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tight">Reward rules</span>
          </div>
          <Info className="h-3.5 w-3.5 text-slate-300" />
        </div>
      </div>

      {/* News Section - Compact */}
      <div className="mt-3 px-3 pb-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Latest News</h3>
            <div className="flex items-center text-[#2A85FF] gap-0.5 text-[10px] font-black uppercase tracking-widest cursor-pointer">
              <span>More</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-0.5 relative">
              <p className="text-[13px] font-black text-slate-700 uppercase">System Reward Update</p>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-bold text-slate-400">2025-03-21 19:54</p>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-[#2A85FF] shadow-sm">
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
