
"use client";

import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Headphones } from 'lucide-react';

export default function LinkNewUPIPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full bg-white animate-slide-up relative">
      {/* Native App Header */}
      <div className="bg-white h-[56px] flex items-center px-4 shrink-0 border-b border-slate-50 relative">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center -ml-2 active:scale-90 transition-all"
        >
          <ChevronLeft className="h-6 w-6 text-slate-500" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-[16px] font-medium text-slate-800 tracking-tight">Link New UPI</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between py-4 border-b border-slate-100 active:bg-slate-50 transition-colors cursor-pointer group">
          <div className="flex items-center gap-4 w-full">
            <span className="text-[16px] text-slate-600 w-24 shrink-0">Partner</span>
            <div className="flex items-center justify-between flex-1">
              <span className="text-[16px] font-bold text-slate-900 tracking-tight">select the kyc partner</span>
              <ChevronRight className="h-5 w-5 text-slate-300 group-active:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Support Icon matching screenshot */}
      <div className="absolute bottom-6 right-6">
        <button className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center shadow-lg border border-blue-100 active:scale-90 transition-all">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
               <Headphones className="h-6 w-6 text-white" />
            </div>
            {/* Small decorative dot from screenshot */}
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-pink-400 rounded-full border-2 border-white"></div>
          </div>
        </button>
      </div>
    </div>
  );
}
