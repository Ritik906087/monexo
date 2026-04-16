
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  Users, 
  QrCode, 
  Copy, 
  User
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function TeamPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single();
      if (data) setUserData(data);
      setLoading(false);
    }
    fetchUserData();
  }, [router]);

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied.` });
  };

  const getInviteLink = () => {
    const code = userData?.numeric_id || 'MONEXO';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    return `${origin}/#/register?invite=${code}`;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2A85FF]"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-full bg-white animate-slide-up">
      <div className="native-header">
        <h1 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Team Center</h1>
      </div>

      <div className="px-4 py-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/20 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-white shadow-sm bg-blue-50">
            <AvatarFallback className="bg-blue-50 text-blue-600"><User className="h-5 w-5" /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-slate-800 uppercase">{userData?.phone}</span>
            <span className="text-[9px] font-bold text-slate-400">Reward: 7%</span>
          </div>
        </div>
        <div onClick={() => handleCopy(userData?.numeric_id?.toString() || '', 'UID')} className="bg-white px-2 py-1 rounded-lg border border-slate-50 shadow-sm text-right cursor-pointer active:scale-95 transition-all">
          <span className="text-[7px] font-black text-slate-300 uppercase block mb-0.5">UID</span>
          <span className="text-[11px] font-black text-[#2A85FF]">{userData?.numeric_id}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto smooth-scroll px-4 pt-4 pb-20 space-y-4">
        <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-4 shadow-sm">
           <div className="flex items-center justify-between">
             <span className="text-[11px] font-bold text-slate-500 uppercase">Invitation Link</span>
             <QrCode className="h-4 w-4 text-blue-500" />
           </div>
           <div onClick={() => handleCopy(getInviteLink(), 'Link')} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 flex items-center justify-between cursor-pointer active:bg-slate-100 transition-all">
             <p className="text-[10px] font-bold text-slate-400 truncate pr-4">{getInviteLink()}</p>
             <Copy className="h-3 w-3 text-blue-500 shrink-0" />
           </div>
        </div>

        <div className="space-y-3">
           <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-50">
             <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-black">L1</div>
             <div className="flex-1">
               <p className="text-[10px] font-bold text-slate-500 uppercase">Level 1 Commission</p>
               <p className="text-[11px] font-black text-slate-800">Amount × <span className="text-orange-500">0.3%</span></p>
             </div>
           </div>
           <div className="flex items-center gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-50">
             <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center text-white text-[10px] font-black">L2</div>
             <div className="flex-1">
               <p className="text-[10px] font-bold text-slate-500 uppercase">Level 2 Commission</p>
               <p className="text-[11px] font-black text-slate-800">Amount × <span className="text-orange-500">0.2%</span></p>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
