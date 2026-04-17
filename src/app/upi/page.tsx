
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
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
  const router = useRouter();

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc] animate-slide-up">
      <div className="native-header bg-white">
        <h1 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">UPI Management</h1>
      </div>

      <div className="bg-red-50 px-3 py-1.5 flex items-center justify-center gap-1.5 border-b border-red-100 shrink-0">
        <AlertCircle className="h-2.5 w-2.5 text-red-500" />
        <p className="text-[8px] font-black text-red-500 uppercase tracking-tight">
          If you Change upi id, please relink immediately.
        </p>
      </div>

      <div className="p-3 shrink-0">
        <Button 
          onClick={() => router.push('/upi/link')}
          className="w-full bg-[#2A85FF] hover:bg-[#1A7BFF] h-10 rounded-lg shadow-sm font-black text-[11px] uppercase tracking-widest gap-2 active:scale-95 transition-all border-none"
        >
          <LinkIcon className="h-3 w-3" />
          Link New UPI
        </Button>
      </div>

      <div className="bg-white flex border-b border-slate-100 shrink-0">
        <button onClick={() => setActiveTab('Buy')} className={cn("flex-1 py-3 text-[10px] font-black transition-all relative uppercase tracking-wider", activeTab === 'Buy' ? "text-[#2A85FF]" : "text-slate-400")}>Buy Settings{activeTab === 'Buy' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2A85FF]" />}</button>
        <button onClick={() => setActiveTab('Sell')} className={cn("flex-1 py-3 text-[10px] font-black transition-all relative uppercase tracking-wider", activeTab === 'Sell' ? "text-[#2A85FF]" : "text-slate-400")}>Sell Settings{activeTab === 'Sell' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2A85FF]" />}</button>
      </div>

      <div className="p-2.5 space-y-2.5">
        <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden p-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-[12px] font-black shrink-0">M</div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[12px] font-black text-slate-800 tracking-tight leading-none mb-1 truncate">Mobikwik</h3>
              <p className="text-[9px] font-bold text-slate-400 truncate">705****570@mbk</p>
              
              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn("text-[8px] font-black uppercase tracking-tighter", isStopped ? "text-red-400" : "text-green-500")}>
                    {isStopped ? "Stopped" : "Active"}
                  </span>
                  <Switch checked={!isStopped} onCheckedChange={(checked) => setIsStopped(!checked)} className="scale-75" />
                </div>
                <div className="flex gap-1.5">
                  <Button variant="outline" size="sm" className="h-6 px-2 rounded-md text-[#2A85FF] text-[8px] font-black uppercase tracking-tighter">Details</Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white/50 rounded-xl p-3 border border-slate-100">
           <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Activity className="h-2.5 w-2.5 text-blue-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Security Monitor</span>
              </div>
           </div>
           <p className="text-[9px] font-bold text-slate-400 leading-tight">
             Encryption active. UPI data stored using 256-bit AES protocols.
           </p>
        </div>
      </div>
    </div>
  );
}
