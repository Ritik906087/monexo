
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  LayoutGrid,
  ClipboardList,
  ArrowRightLeft,
  Headphones, 
  Lock, 
  Gift,
  Copy,
  User,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function MinePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

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

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${label} copied.` });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2A85FF]"></div>
    </div>
  );

  const menuItems = [
    { label: 'IToken Balance', icon: ShieldCheck, value: userData?.itoken_balance?.toFixed(2) || '0.00', color: 'text-blue-500' },
    { label: 'Daily Earnings', icon: Gift, value: userData?.today_profit || '0', color: 'text-orange-500' },
    { label: 'UPI Settlements', icon: LayoutGrid, color: 'text-blue-500', onClick: () => router.push('/sell-history') },
    { label: 'Purchase History', icon: ClipboardList, color: 'text-slate-500', onClick: () => router.push('/buy-history') },
    { label: 'Transfer Logs', icon: ArrowRightLeft, color: 'text-emerald-500' },
    { label: 'Support Center', icon: Headphones, color: 'text-indigo-500' },
    { label: 'Security Settings', icon: Lock, color: 'text-red-400' },
  ];

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc] animate-slide-up">
      <div className="native-header bg-white">
        <h1 className="text-[12px] font-bold text-slate-800 tracking-wider uppercase">Profile Center</h1>
        <button className="absolute right-4">
           <Settings className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      <div className="px-5 py-5 flex items-center justify-between bg-white border-b border-slate-100 shrink-0">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12 border-2 border-slate-50 shadow-sm bg-blue-50">
            <AvatarFallback className="bg-blue-100 text-blue-600"><User className="h-6 w-6" /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
             <div onClick={() => handleCopy(userData?.phone, 'Mobile')} className="flex items-center gap-1.5 cursor-pointer group">
               <span className="text-[14px] font-bold text-slate-800">{userData?.phone}</span>
               <Copy className="h-2.5 w-2.5 text-slate-300 group-hover:text-blue-500 transition-colors" />
             </div>
             <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ID: {userData?.numeric_id || '---'}</span>
          </div>
        </div>
        <div className="bg-blue-50/50 px-2 py-1 rounded-md border border-blue-100">
           <span className="text-[8px] font-bold text-[#2A85FF] uppercase">VIP Level 1</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto smooth-scroll px-3 py-3 space-y-3">
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          {menuItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                onClick={item.onClick} 
                className="flex items-center justify-between px-4 py-3 active:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center", item.color)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{item.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  {item.value !== undefined && <span className="text-[11px] font-black text-slate-800">₹{item.value}</span>}
                  <ChevronRight className="text-slate-200 h-3.5 w-3.5" />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-2 pb-12 space-y-4">
          <Button 
            variant="outline" 
            onClick={handleSignOut} 
            className="w-full h-10 rounded-xl border-slate-100 bg-white text-slate-400 font-bold text-[10px] uppercase tracking-widest hover:text-red-500 active:scale-95 transition-all shadow-none"
          >
            End Current Session
          </Button>
          <div className="text-center">
            <p className="text-[8px] text-slate-300 font-bold uppercase tracking-[0.2em]">Application Version 2.0.4 - Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
