"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Info, 
  ChevronRight, 
  Megaphone, 
  Headphones,
  ShoppingBag,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

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
    <div className="page-fade bg-[#F8FAFC] min-h-screen pb-24">
      {/* Important Notice Banner */}
      <div className="px-4 pt-4">
        <div className="relative rounded-[20px] overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 p-5 text-white shadow-lg border border-orange-300">
          <div className="absolute top-2 right-4 bg-white rounded-xl p-2 h-14 w-14 flex flex-col items-center justify-center shadow-inner">
             <div className="text-[10px] font-bold text-red-600 leading-none">MONEXO</div>
             <div className="text-[10px] font-bold text-blue-600 leading-none">UPI</div>
             <div className="mt-1 flex gap-0.5">
               <div className="w-2 h-1 bg-red-500"></div>
               <div className="w-2 h-1 bg-yellow-500"></div>
               <div className="w-2 h-1 bg-blue-500"></div>
             </div>
          </div>
          <h2 className="text-xl font-black italic tracking-tighter mb-2">
            MILESPAY <br />
            IMPORTANT NOTICE!!
          </h2>
          <div className="text-[9px] leading-tight text-white/95 font-medium space-y-1">
            <p>If you didn't get tokens in 5 minutes,Pls contact our supporters with a payment screenshot.</p>
            <p>To sell tokens and receive rupees fast, Pls follow the steps. Do not log in to UPI while selling, Otherwise your tokens won't be processed.</p>
            <p>Thanks for your support!</p>
          </div>
        </div>
      </div>

      {/* IToken Section */}
      <div className="px-4 mt-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-50 relative overflow-hidden">
          {/* Subtle coin background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex flex-wrap gap-4 p-4 items-center justify-center rotate-12">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="w-16 h-16 rounded-full border-4 border-slate-800"></div>
            ))}
          </div>

          <div className="relative z-10">
            <div className="flex items-baseline gap-2 mb-4">
              <h3 className="font-bold text-slate-800 text-lg">My IToken</h3>
              <span className="text-[10px] text-slate-400 font-medium">1 Rs = 1 IToken, 1 USDT ≈ 100 IToken</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl shadow-inner border border-white">
                  🇮🇳
                </div>
                <span className="text-4xl font-extrabold text-slate-800 tracking-tight">
                  {userData?.itoken_balance?.toFixed(2) || '0.00'}
                </span>
              </div>
              <Button className="bg-[#2A85FF] hover:bg-[#1a75ef] rounded-xl h-12 px-6 shadow-md shadow-blue-200">
                <span className="bg-white text-blue-500 rounded-full w-5 h-5 flex items-center justify-center mr-2 text-[10px] font-bold">₹</span>
                <span className="font-bold">Buy</span>
              </Button>
            </div>

            <div className="h-px bg-slate-100 my-6"></div>

            {/* Grid Stats */}
            <div className="grid grid-cols-2 gap-y-6">
              <div className="flex items-start justify-between pr-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Today Profit</p>
                  <p className="text-lg font-bold text-slate-800">{userData?.today_profit?.toFixed(0) || '0'}</p>
                </div>
              </div>
              <div className="flex items-start justify-between pl-4 border-l border-slate-100">
                 <Button variant="outline" className="h-14 rounded-2xl flex-1 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 shadow-sm">
                   Buy History
                 </Button>
              </div>

              <div className="flex items-start justify-between pr-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reward</p>
                  <p className="text-lg font-bold text-slate-800">{userData?.reward_percent || 5}%</p>
                </div>
              </div>
              <div className="flex items-start justify-between pl-4 border-l border-slate-100">
                 {/* Empty matching slot */}
              </div>

              <div className="flex items-start justify-between pr-4 pt-2">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Auto Selling</p>
                  <p className="text-sm font-bold text-slate-800">Sell Set</p>
                </div>
              </div>
              <div className="flex items-start justify-between pl-4 border-l border-slate-100">
                 <Button variant="outline" className="h-14 rounded-2xl flex-1 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 shadow-sm">
                   Sell History
                 </Button>
              </div>

              <div className="flex items-start justify-between pr-4 pt-2">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Sell Faster</p>
                  <p className="text-sm font-bold text-blue-500">Link Upi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Message */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-xl p-3 flex items-center justify-between shadow-sm border border-slate-50">
          <div className="flex items-center gap-2">
            <Megaphone className="h-4 w-4 text-slate-400 rotate-12" />
            <span className="text-xs font-bold text-slate-500 tracking-tight">Welcome MONEXO</span>
          </div>
          <Info className="h-4 w-4 text-slate-300" />
        </div>
      </div>

      {/* News Section */}
      <div className="mt-8 px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-800">News</h3>
          <div className="flex items-center text-slate-400 gap-1 text-xs font-bold cursor-pointer hover:text-primary transition-colors">
            <span>More</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-50 flex items-center justify-between group active:scale-[0.98] transition-all cursor-pointer">
            <div className="space-y-1">
              <p className="font-bold text-slate-800 tracking-tight">Reward</p>
              <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">2025-03-21 19:54:18</p>
            </div>
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 bg-blue-400/10 rounded-full animate-ping opacity-20"></div>
              <Headphones className="h-6 w-6 text-blue-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
