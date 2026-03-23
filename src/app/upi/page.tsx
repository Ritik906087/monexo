
"use client";

import { useState } from 'react';
import { 
  Plus, 
  AlertCircle, 
  Link as LinkIcon, 
  Info,
  ChevronRight,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

export default function UPIPage() {
  const [activeTab, setActiveTab] = useState('Buy');
  const [isStopped, setIsStopped] = useState(false);

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc] animate-slide-up">
      {/* Page Header - STICKY */}
      <div className="bg-white pt-3 pb-1.5 text-center border-b border-slate-100 shrink-0 sticky top-0 z-50">
        <h1 className="text-[15px] font-black text-[#1e293b] uppercase tracking-[0.1em]">UPI Management</h1>
      </div>

      {/* Red Warning Banner */}
      <div className="bg-red-50 px-4 py-1.5 flex items-center justify-center gap-2 border-b border-red-100 shrink-0">
        <AlertCircle className="h-3 w-3 text-red-500" />
        <p className="text-[9px] font-black text-red-500 uppercase tracking-tight">
          If you Change your upi id, please relink UPI.
        </p>
      </div>

      {/* Action Button Area */}
      <div className="p-3 shrink-0">
        <Button className="w-full bg-[#2A85FF] hover:bg-[#1A7BFF] h-11 rounded-xl shadow-md shadow-blue-100 font-black text-[12px] uppercase tracking-widest gap-2 active:scale-95 transition-all border-none">
          <LinkIcon className="h-3.5 w-3.5" />
          Link New UPI
        </Button>
      </div>

      {/* Tabs System */}
      <div className="bg-white flex border-b border-slate-100 shrink-0">
        <button 
          onClick={() => setActiveTab('Buy')}
          className={cn(
            "flex-1 py-2.5 text-[11px] font-black transition-all relative uppercase tracking-widest",
            activeTab === 'Buy' ? "text-[#2A85FF]" : "text-slate-400"
          )}
        >
          Buy Settings
          {activeTab === 'Buy' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2A85FF]" />}
        </button>
        <button 
          onClick={() => setActiveTab('Sell')}
          className={cn(
            "flex-1 py-2.5 text-[11px] font-black transition-all relative uppercase tracking-widest",
            activeTab === 'Sell' ? "text-[#2A85FF]" : "text-slate-400"
          )}
        >
          Sell Settings
          {activeTab === 'Sell' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2A85FF]" />}
        </button>
      </div>

      {/* UPI Account Card */}
      <div className="p-3 space-y-3">
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-3 flex items-start gap-3">
            {/* Avatar Icon */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#2A85FF] to-[#1A7BFF] flex items-center justify-center text-white text-base font-black shadow-inner shrink-0">
              M
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <div className="truncate">
                  <h3 className="text-[13px] font-black text-slate-800 tracking-tight leading-none mb-1 truncate">
                    Mobikwik (705****570)
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 tracking-tight truncate">
                    705****570@mbk
                  </p>
                </div>
              </div>

              {/* Status Toggle Area */}
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-[9px] font-black uppercase tracking-tighter transition-colors",
                    isStopped ? "text-red-400" : "text-green-500"
                  )}>
                    {isStopped ? "Stopped" : "Active"}
                  </span>
                  <Switch 
                    checked={!isStopped} 
                    onCheckedChange={(checked) => setIsStopped(!checked)}
                    className="scale-75"
                  />
                </div>
                
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-lg border-blue-50 text-[#2A85FF] text-[9px] font-black uppercase tracking-tighter hover:bg-blue-50">
                    Operate
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 px-2.5 rounded-lg border-blue-50 text-[#2A85FF] text-[9px] font-black uppercase tracking-tighter hover:bg-blue-50">
                    Details
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Info Banner */}
          <div className="bg-orange-50/70 p-1.5 flex items-center gap-2 border-t border-orange-100">
            <Info className="h-2.5 w-2.5 text-orange-400" />
            <p className="text-[9px] font-black text-orange-500 uppercase tracking-tighter">
              UPI unlinked – Please relink for settlements
            </p>
          </div>
        </div>

        {/* Status Monitor Section */}
        <div className="bg-white/50 rounded-[20px] p-3 border border-slate-100">
           <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-3 w-3 text-blue-500" />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Security Monitor</span>
              </div>
              <div className="flex items-center gap-1">
                 <div className="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                 <span className="text-[8px] font-black text-green-600 uppercase">Live</span>
              </div>
           </div>
           <p className="text-[10px] font-medium text-slate-400 leading-snug">
             Encryption active. Your UPI data is stored securely using 256-bit AES protocols. Ensure correct UPI for instant settlements.
           </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="py-6 text-center">
        <p className="text-[8px] font-black text-slate-300 tracking-[0.3em] uppercase">Secure Terminal v2.0</p>
      </div>
    </div>
  );
}
