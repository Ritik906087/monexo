
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  LayoutGrid,
  ClipboardList,
  ArrowRightLeft,
  Ticket, 
  PlayCircle, 
  Headphones, 
  Lock, 
  Gift,
  Copy,
  User
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

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
    { label: 'IToken', icon: () => <span className="text-[14px]">🇮🇳</span>, value: userData?.itoken_balance?.toFixed(2) || '0.00', color: 'text-orange-400' },
    { label: 'Today Profit', icon: Gift, value: userData?.today_profit || '0', color: 'text-yellow-500' },
    { label: 'UPI Sell History', icon: LayoutGrid, color: 'text-blue-500', onClick: () => router.push('/sell-history') },
    { label: 'Buy History', icon: ClipboardList, color: 'text-blue-600', onClick: () => router.push('/buy-history') },
    { label: 'Transfer History', icon: ArrowRightLeft, color: 'text-blue-400' },
    { label: 'Official Service', icon: Headphones, color: 'text-blue-600' },
    { label: 'Modify Password', icon: Lock, color: 'text-blue-400' },
  ];

  return (
    <div className="flex flex-col min-h-full bg-white animate-slide-up">
      <div className="native-header bg-[#2A85FF] border-none">
        <h1 className="text-[12px] font-black text-white tracking-[0.2em] uppercase">MONEXO-PAY</h1>
      </div>

      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-50 bg-slate-50/20 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border border-white shadow-sm bg-blue-50">
            <AvatarFallback className="bg-blue-50 text-blue-600"><User className="h-5 w-5" /></AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
             <div onClick={() => handleCopy(userData?.phone, 'Mobile')} className="flex items-center gap-1 active:scale-95 transition-transform cursor-pointer">
               <span className="text-[12px] font-black text-slate-800 uppercase">{userData?.phone}</span>
               <Copy className="h-2.5 w-2.5 text-slate-400" />
             </div>
             <span className="text-[9px] font-bold text-slate-400 uppercase">ID:{userData?.numeric_id || '---'}</span>
          </div>
        </div>
        <span className="text-[8px] font-black text-[#2A85FF] bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100 uppercase tracking-tighter">Reward: 7%</span>
      </div>

      <div className="flex-1 overflow-y-auto smooth-scroll">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} onClick={item.onClick} className="flex items-center justify-between px-5 py-3 active:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 flex items-center justify-center">
                  {typeof Icon === 'function' ? <Icon /> : <Icon className={`h-4 w-4 ${item.color || 'text-slate-400'}`} />}
                </div>
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight">{item.label}</span>
              </div>
              <div className="flex items-center gap-1">
                {item.value !== undefined && <span className="text-[11px] font-black text-yellow-500">{item.value}</span>}
                <ChevronRight className="text-slate-200 h-3.5 w-3.5" />
              </div>
            </div>
          );
        })}

        <div className="px-5 py-6 space-y-4 pb-12">
          <Button variant="outline" onClick={handleSignOut} className="w-full h-10 rounded-lg border-slate-200 text-slate-500 font-black text-[11px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 shadow-none">Sign Out</Button>
          <div className="text-center space-y-1">
            <p className="text-[8px] text-slate-300 font-black uppercase tracking-widest">APP Version : 2.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
