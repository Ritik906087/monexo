"use client";

import { useState } from 'react';
import { 
  Plus, 
  AlertCircle, 
  Link as LinkIcon, 
  Info,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function UPIPage() {
  const [activeTab, setActiveTab] = useState('Buy');
  const [isStopped, setIsStopped] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] pb-20 animate-slide-up overflow-hidden">
      {/* Page Header - Compact */}
      <div className="bg-white pt-3 pb-1.5 text-center border-b border-slate-100 shrink-0">
        <h1 className="text-[16px] font-black text-[#1e293b] uppercase tracking-tight">UPI</h1>
      </div>

      <div className="flex-1 overflow-y-auto smooth-scroll">
        {/* Red Warning Banner - Precise Styling */}
        <div className="bg-red-50/50 px-4 py-2 flex items-center justify-center gap-2 border-b border-red-50">
          <AlertCircle className="h-3 w-3 text-red-500" />
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-tight leading-none">
            If you Change your upi id, please relink UPI.
          </p>
        </div>

        {/* Action Button - Link New UPI */}
        <div className="p-4">
          <Button className="w-full bg-[#2A85FF] hover:bg-[#1A7BFF] h-12 rounded-2xl shadow-lg shadow-blue-100 font-black text-[13px] uppercase tracking-widest gap-2 active:scale-95 transition-all">
            <LinkIcon className="h-4 w-4" />
            Link New UPI
          </Button>
        </div>

        {/* Tabs System - Native Feel */}
        <div className="bg-white flex border-b border-slate-100 shrink-0">
          <button 
            onClick={() => setActiveTab('Buy')}
            className={cn(
              "flex-1 py-3 text-[12px] font-black transition-all relative uppercase tracking-wider",
              activeTab === 'Buy' ? "text-[#2A85FF]" : "text-slate-400"
            )}
          >
            Buy
            {activeTab === 'Buy' && <div className="absolute bottom-0 left-1/4 w-1/2 h-[2.5px] bg-[#2A85FF]" />}
          </button>
          <button 
            onClick={() => setActiveTab('Sell')}
            className={cn(
              "flex-1 py-3 text-[12px] font-black transition-all relative uppercase tracking-wider",
              activeTab === 'Sell' ? "text-[#2A85FF]" : "text-slate-400"
            )}
          >
            Sell
            {activeTab === 'Sell' && <div className="absolute bottom-0 left-1/4 w-1/2 h-[2.5px] bg-[#2A85FF]" />}
          </button>
        </div>

        {/* UPI Account Card - High Density */}
        <div className="p-4">
          <div className="bg-white rounded-[24px] border border-slate-100 shadow-sm overflow-hidden animate-slide-up">
            <div className="p-4 flex items-start gap-4">
              {/* Avatar Icon */}
              <div className="w-12 h-12 rounded-full bg-[#2A85FF] flex items-center justify-center text-white text-xl font-black shadow-inner">
                M
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-[14px] font-black text-slate-800 tracking-tight leading-none mb-1">
                      Mobikwik (705****570)
                    </h3>
                    <p className="text-[11px] font-bold text-slate-400 tracking-tight">
                      705****570@mbk
                    </p>
                  </div>
                  {/* UnLink button removed as per request */}
                </div>

                {/* Status Toggle Area */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-tighter">Stopped</span>
                    <Switch 
                      checked={isStopped} 
                      onCheckedChange={setIsStopped}
                      className="scale-90"
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg border-blue-100 text-[#2A85FF] text-[10px] font-black uppercase tracking-tighter hover:bg-blue-50">
                      Operate
                    </Button>
                    <Button variant="outline" size="sm" className="h-8 px-3 rounded-lg border-blue-100 text-[#2A85FF] text-[10px] font-black uppercase tracking-tighter hover:bg-blue-50">
                      Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Info Banner - Photo Match */}
            <div className="bg-orange-50/70 p-2 flex items-center gap-2 border-t border-orange-100">
              <Info className="h-3 w-3 text-orange-400" />
              <p className="text-[10px] font-black text-orange-500 uppercase tracking-tighter">
                UPI unlinked – Please relink
              </p>
            </div>
          </div>
        </div>

        {/* Status Monitor Section */}
        <div className="px-4 pb-4">
          <div className="bg-blue-50/40 rounded-2xl p-4 border border-dashed border-blue-100">
             <div className="flex items-center gap-3 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#2A85FF] animate-pulse"></div>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Status Monitor</span>
             </div>
             <p className="text-[10px] font-bold text-slate-500 leading-snug">
               Ensure your UPI ID is correct for instant settlements. If you face any issues, contact 24/7 support.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
