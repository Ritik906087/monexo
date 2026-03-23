
"use client";

import { useRouter } from 'next/navigation';
import { ChevronLeft, ArrowLeftRight, Clock } from 'lucide-react';

export default function BuyHistoryPage() {
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
        <h1 className="text-[16px] font-black text-[#1e293b] uppercase tracking-widest">Buy History</h1>
      </div>

      <div className="flex-1 overflow-y-auto smooth-scroll p-4 flex flex-col">
        {/* Placeholder Content for History */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-60">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100">
             <Clock className="h-10 w-10 text-blue-400" />
          </div>
          <div className="text-center">
            <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">No Buy Records</h3>
            <p className="text-[11px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">Your itoken purchase history will appear here</p>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-auto py-8 text-center">
          <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">Secure Transaction Ledger</p>
        </div>
      </div>
    </div>
  );
}
