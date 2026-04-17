
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  AlertCircle, 
  Link as LinkIcon, 
  Info,
  ChevronRight,
  ShieldCheck,
  Activity,
  History
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function UPIPage() {
  const [activeTab, setActiveTab] = useState('Buy');
  const [isStopped, setIsStopped] = useState(false);
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
      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();
      
      if (data) setUserData(data);
      setLoading(false);
    }
    fetchUserData();
  }, [router]);

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

      <div className="p-2.5 space-y-2.5 pb-24">
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin h-5 w-5 border-b-2 border-blue-500 rounded-full" /></div>
        ) : userData?.kyc_data ? (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white text-[14px] font-black shrink-0 shadow-lg shadow-blue-100">
                {userData.kyc_data.partner?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-[13px] font-black text-slate-800 tracking-tight leading-none truncate uppercase">
                    {userData.kyc_data.partner || 'Linked Partner'}
                  </h3>
                  <Badge variant="outline" className="text-[8px] font-black text-emerald-500 bg-emerald-50 border-emerald-100 px-1.5 py-0 uppercase">Verified</Badge>
                </div>
                <p className="text-[10px] font-mono font-bold text-slate-500 truncate mb-0.5">{userData.kyc_data.upi_no}</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Linked Mobile: {userData.kyc_data.linked_mobile}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[9px] font-black uppercase tracking-tighter", isStopped ? "text-red-400" : "text-emerald-500")}>
                      {isStopped ? "Node Stopped" : "Node Active"}
                    </span>
                    <Switch checked={!isStopped} onCheckedChange={(checked) => setIsStopped(!checked)} className="scale-75" />
                  </div>
                  <Button variant="ghost" className="h-7 px-3 rounded-lg bg-slate-50 text-[9px] font-black text-slate-400 uppercase tracking-widest">Details</Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-3xl border border-dashed border-slate-200">
            <div className="p-4 bg-slate-50 rounded-full mb-4">
              <History className="h-8 w-8 text-slate-200" />
            </div>
            <p className="text-[11px] font-black text-slate-300 uppercase tracking-widest text-center">No UPI Identity Linked Yet</p>
            <Button 
              variant="link" 
              onClick={() => router.push('/upi/link')}
              className="text-[#2A85FF] font-black text-[10px] uppercase mt-2"
            >
              Start Linking Now →
            </Button>
          </div>
        )}

        <div className="bg-white/50 rounded-xl p-3 border border-slate-100">
           <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5">
                <Activity className="h-2.5 w-2.5 text-blue-500" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Security Monitor Active</span>
              </div>
           </div>
           <p className="text-[9px] font-bold text-slate-400 leading-tight">
             All linked UPI IDs are encrypted using 256-bit AES protocols and monitored for security compliance.
           </p>
        </div>
      </div>
    </div>
  );
}
