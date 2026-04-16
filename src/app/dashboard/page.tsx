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
    <div className="page-fade min-h-full bg-[#f8fafc]">
      {/* MONEXO PAY Important Notice Banner */}
      <div className="px-3 pt-3 animate-slide-up">
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-[#FFB800] via-[#FF8A00] to-[#FF5C00] p-3 text-white shadow-sm border border-white/10">
          <div className="absolute top-2.5 right-2.5 w-10 h-8 bg-white/95 rounded-lg shadow-sm flex flex-col items-center justify-center p-0.5 z-20">
             <div className="bg-red-600 text-white text-[4px] font-black px-1 rounded-[1px] leading-tight uppercase w-full text-center">MONEXO</div>
             <div className="text-[#FF8A00] text-[7px] font-black leading-tight uppercase">PAY</div>
             <div className="flex gap-0.5 mt-0.5">
               <div className="w-0.5 h-0.5 bg-red-500 rounded-full"></div>
               <div className="w-0.5 h-0.5 bg-yellow-400 rounded-full"></div>
               <div className="w-0.5 h-0.5 bg-blue-500 rounded-full"></div>
             </div>
          </div>

          <div className="relative z-10 flex flex-col items-start pr-8">
            <h2 className="text-[11px] font-black italic tracking-tighter uppercase leading-tight mb-1">
              MONEXO PAY IMPORTANT NOTICE!!
            </h2>
            <p className="text-[9px] leading-tight text-white/95 font-bold line-clamp-2">
              If you didn't get tokens in 5 minutes, Pls contact our supporters with a payment screenshot.
            </p>
          </div>
        </div>
      </div>

      {/* Main IToken Card */}
      <div className="px-3 mt-3 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="bg-white rounded-2xl p-4 relative overflow-hidden shadow-sm border border-slate-100 min-h-[130px]">
          {/* Background Image - 30% Visibility per prompt 14 */}
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
            <div className="flex items-baseline gap-2 mb-1">
              <h3 className="font-bold text-slate-500 text-[10px] uppercase tracking-wider">My IToken</h3>
              <span className="text-[7px] font-bold text-slate-400 tracking-tight bg-slate-50 px-1 rounded border border-slate-100/50">1 Rs = 1 IToken</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-1">
                <span className="text-base">🇮🇳</span>
                <span className="text-[22px] font-black text-slate-900 tracking-tighter">
                  {userData?.itoken_balance?.toFixed(2) || '0.00'}
                </span>
              </div>
              <Button 
                onClick={() => router.push('/buy')}
                className="bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-lg h-7 px-4 shadow-sm active:scale-95 transition-all gap-1.5 border-none"
              >
                <span className="font-bold text-[9px] uppercase tracking-wider text-white">Buy</span>
              </Button>
            </div>

            <div className="grid grid-cols-12 gap-y-2 gap-x-2 pt-3 border-t border-slate-100/50">
              <div className="col-span-4 flex flex-col">
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Today Profit</span>
                <span className="text-[11px] font-black text-slate-800">₹{userData?.today_profit || '0'}</span>
              </div>
              <div className="col-span-4 flex flex-col">
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Reward</span>
                <span className="text-[11px] font-black text-[#2A85FF]">7%</span>
              </div>
              <div className="col-span-4">
                 <Button 
                   onClick={() => router.push('/buy-history')}
                   variant="outline" 
                   className="w-full h-5 rounded-md border-slate-100 bg-white text-[7px] font-bold text-slate-500 shadow-none active:scale-95 uppercase"
                 >
                   History
                 </Button>
              </div>
              
              <div className="col-span-4 flex flex-col">
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Auto Selling</span>
                <span className="text-[9px] font-black text-emerald-500 uppercase">Active</span>
              </div>
              <div className="col-span-4 flex flex-col">
                <span className="text-[7px] font-bold text-slate-400 uppercase tracking-tight mb-0.5">Sell Faster</span>
                <span className="text-[9px] font-black text-blue-500 uppercase">Link Upi</span>
              </div>
              <div className="col-span-4">
                 <Button 
                   onClick={() => router.push('/sell-history')}
                   variant="outline" 
                   className="w-full h-5 rounded-md border-slate-100 bg-white text-[7px] font-bold text-slate-500 shadow-none active:scale-95 uppercase"
                 >
                   Records
                 </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Reward Rules Ticker */}
      <div className="px-3 mt-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="bg-white rounded-xl py-2 px-3 flex items-center justify-between shadow-sm border border-slate-100">
          <div className="flex items-center gap-2">
            <Megaphone className="h-3 w-3 text-[#2A85FF]" />
            <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tight">Reward rules & referral system</span>
          </div>
          <Info className="h-2.5 w-2.5 text-slate-200" />
        </div>
      </div>

      {/* News Section */}
      <div className="mt-3 px-3 pb-3 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[10px] font-bold text-slate-800 uppercase tracking-wider">Latest Updates</h3>
            <div className="flex items-center text-[#2A85FF] gap-0.5 text-[7px] font-bold uppercase tracking-widest cursor-pointer">
              <span>View All</span>
              <ChevronRight className="h-2.5 w-2.5" />
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex flex-col gap-1 relative border-l-2 border-blue-100 pl-3">
              <p className="text-[9px] font-bold text-slate-700 uppercase">System Reward Update - Active</p>
              <div className="flex items-center justify-between">
                <p className="text-[7px] font-medium text-slate-400">2025-03-21 19:54</p>
                <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-[#2A85FF] shadow-sm">
                  <Headphones className="h-2.5 w-2.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}