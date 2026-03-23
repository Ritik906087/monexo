
"use client";

import { useRouter } from 'next/navigation';
import { ChevronLeft, History, ShieldCheck } from 'lucide-react';

export default function SellHistoryPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] animate-slide-up overflow-hidden">
      {/* Premium Header with Back Button */}
      <div className="bg-white pt-4 pb-4 px-4 text-center border-b border-slate-100 shrink-0 relative">
        <button 
          onClick={() => router.back()}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center active:scale-90 transition-all border border-slate-100 shadow-sm"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-[16px] font-black text-[#1e293b] uppercase tracking-widest">Sell History</h1>
      </div>

      <div className="flex-1 overflow-y-auto smooth-scroll p-4 flex flex-col">
        {/* Placeholder Content for History */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-60">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100">
             <History className="h-10 w-10 text-orange-400" />
          </div>
          <div className="text-center">
            <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">No Sell Records</h3>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Your upi settlement history will appear here</p>
          </div>
        </div>

        {/* Quick Help Card */}
        <div className="bg-blue-500/5 rounded-3xl p-5 border border-blue-100/50 mb-6 flex items-center gap-4">
          <div className="bg-white p-2.5 rounded-2xl shadow-sm">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
          </div>
          <div className="flex-1">
            <h4 className="text-[12px] font-black text-blue-900 uppercase tracking-tight">Instant Settlement</h4>
            <p className="text-[10px] font-bold text-blue-600/70 leading-tight mt-0.5">Verified UPI accounts receive funds within 2-5 minutes of token selling.</p>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-auto py-8 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Official Monexo Ledger</p>
        </div>
      </div>
    </div>
  );
}
