
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
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2A85FF]"></div>
    </div>
  );

  const DASHBOARD_BG_IMAGE = "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/IMG_20260416_075632.jpg?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvSU1HXzIwMjYwNDE2XzA3NTYzMi5qcGciLCJpYXQiOjE3NzYzMDcxNjcsImV4cCI6MTgwNzg0MzE2N30.Qiqh9ipjHfmWieqbBs6gsBQxLXyFQQMBWStQ1kJoLok";

  return (
    <div className="page-fade min-h-full bg-[#f8fafc] pb-24">
      {/* MONEXO PAY Important Notice Banner - Compact Size */}
      <div className="px-3 pt-3">
        <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-br from-[#FFB800] via-[#FF8A00] to-[#FF5C00] p-3.5 text-white shadow-md border border-white/10 aspect-[16/6] flex flex-col justify-center">
          {/* Logo Box on right - Refined size */}
          <div className="absolute top-1/2 -translate-y-1/2 right-4 w-[64px] h-[64px] bg-white rounded-2xl shadow-lg flex flex-col items-center justify-center p-1 z-20">
             <div className="bg-red-600 text-white text-[6px] font-black px-1 py-0.5 rounded-[2px] leading-tight uppercase w-[90%] text-center tracking-tighter">MONEXO</div>
             <div className="text-[#FF8A00] text-[11px] font-black leading-tight uppercase tracking-tight mt-0.5">PAY</div>
             <div className="flex gap-0.5 mt-0.5">
               <div className="w-0.5 h-0.5 bg-red-500 rounded-full"></div>
               <div className="w-0.5 h-0.5 bg-yellow-400 rounded-full"></div>
               <div className="w-0.5 h-0.5 bg-blue-500 rounded-full"></div>
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-start pr-16">
            <h2 className="text-[11px] font-black italic tracking-tighter uppercase leading-tight mb-1.5 drop-shadow-sm">
              MONEXO PAY IMPORTANT NOTICE!!
            </h2>
            <p className="text-[8px] leading-[1.2] text-white/95 font-bold max-w-[85%]">
              If you didn't get tokens in 5 minutes, Pls contact our supporters with a payment screenshot. To sell tokens and receive rupees fast, Pls follow the steps.
            </p>
          </div>
        </div>
      </div>

      {/* Main IToken Card */}
      <div className="px-3 mt-4">
        <div className="bg-white rounded-[28px] p-5 relative overflow-hidden shadow-sm border border-slate-100 min-h-[190px]">
          {/* Background Image - 30% visibility as requested */}
          <div 
            className="absolute inset-0 opacity-[0.3] pointer-events-none" 
            style={{ 
              backgroundImage: `url("${DASHBOARD_BG_IMAGE}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />
          <div className="absolute inset-0 bg-white/70 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-baseline gap-2 mb-3">
              <h3 className="font-black text-slate-800 text-[13px]">My IToken</h3>
              <span className="text-[8px] font-bold text-slate-400 tracking-tight uppercase">1 Rs = 1 IToken</span>
            </div>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-1.5">
                <span className="text-xl">🇮🇳</span>
                <span className="text-[28px] font-black text-slate-900 tracking-tighter">
                  {userData?.itoken_balance?.toFixed(2) || '0.00'}
                </span>
              </div>
              <Button 
                onClick={() => router.push('/buy')}
                className="bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-xl h-10 px-4 shadow-md active:scale-95 transition-all gap-2 border-none"
              >
                <div className="w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                  <span className="text-white text-[9px] font-black">₹</span>
                </div>
                <span className="font-black text-[11px] uppercase tracking-wider text-white">Buy</span>
              </Button>
            </div>

            {/* Stats Grid matching screenshot layout */}
            <div className="space-y-4 pt-4 border-t border-slate-50">
              <div className="flex items-center justify-between">
                <div className="flex gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Today Profit</span>
                    <span className="text-[13px] font-black text-slate-800">{userData?.today_profit || '0'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Reward</span>
                    <span className="text-[13px] font-black text-slate-800">{userData?.reward_percent || '7'}%</span>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/buy-history')}
                  variant="outline" 
                  className="h-9 px-3.5 rounded-xl border-slate-200 bg-white text-[10px] font-black text-slate-500 shadow-none active:scale-95 uppercase"
                >
                  Buy History
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex gap-8">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Auto Selling</span>
                    <span className="text-[13px] font-black text-slate-800 uppercase">Sell Set</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Sell Faster</span>
                    <span className="text-[13px] font-black text-slate-800 uppercase">Link Upi</span>
                  </div>
                </div>
                <Button 
                  onClick={() => router.push('/sell-history')}
                  variant="outline" 
                  className="h-9 px-3.5 rounded-xl border-slate-200 bg-white text-[10px] font-black text-slate-500 shadow-none active:scale-95 uppercase"
                >
                  Sell History
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Rules Ticker */}
      <div className="px-3 mt-4">
        <div className="bg-white rounded-2xl py-2.5 px-4 flex items-center justify-between shadow-sm border border-slate-100">
          <div className="flex items-center gap-3">
            <Megaphone className="h-3.5 w-3.5 text-slate-400" />
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Reward rules</span>
          </div>
          <Info className="h-3.5 w-3.5 text-slate-300" />
        </div>
      </div>

      {/* News Section */}
      <div className="mt-4 px-3">
        <div className="bg-white rounded-[28px] p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-wider">News</h3>
            <div className="flex items-center text-slate-300 gap-1 text-[10px] font-bold uppercase tracking-widest cursor-pointer">
              <span>More</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex flex-col gap-1 relative">
              <p className="text-[13px] font-black text-slate-700 uppercase">Reward</p>
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-medium text-slate-400">2025-03-21 19:54:18</p>
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#2A85FF] shadow-sm">
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
