"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  History, 
  CreditCard, 
  Ticket, 
  PlayCircle, 
  Headphones, 
  Lock, 
  Gift,
  ArrowRightLeft,
  Settings,
  Bell,
  ShieldCheck,
  Download
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged Out", description: "Successfully signed out." });
    router.push('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const menuSections = [
    {
      title: "Transactions",
      items: [
        { label: 'UPI Sell History', icon: CreditCard, color: 'text-blue-500' },
        { label: 'Buy History', icon: History, color: 'text-blue-600' },
        { label: 'Transfer History', icon: ArrowRightLeft, color: 'text-blue-400' },
      ]
    },
    {
      title: "Account & Safety",
      items: [
        { label: 'Event Center', icon: Ticket, color: 'text-orange-400' },
        { label: 'Tutorial', icon: PlayCircle, color: 'text-slate-700' },
        { label: 'Official Service', icon: Headphones, color: 'text-indigo-600' },
        { label: 'Security Settings', icon: Lock, color: 'text-blue-500' },
      ]
    }
  ];

  return (
    <div className="pb-24 page-fade bg-[#F9FAFB] min-h-full">
      {/* Mini Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b sticky top-0 z-50">
        <h1 className="font-black text-xs uppercase tracking-widest text-slate-800">Profile</h1>
        <div className="flex gap-4">
           <Bell className="h-4 w-4 text-slate-400" />
           <Settings className="h-4 w-4 text-slate-400" />
        </div>
      </div>

      {/* Profile Card */}
      <div className="px-4 mt-4">
        <div className="bg-white rounded-[20px] p-4 shadow-sm border border-slate-50 flex items-center justify-between active:scale-[0.98] transition-all cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-12 w-12 border-2 border-blue-50 shadow-sm">
                <AvatarImage src={`https://picsum.photos/seed/${userData?.id}/200`} />
                <AvatarFallback className="bg-slate-50 font-black text-xs text-slate-400">UN</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white w-3.5 h-3.5 rounded-full"></div>
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">Reward: {userData?.reward_percent || 5}%</span>
                <ShieldCheck className="h-3 w-3 text-blue-500" />
              </div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">UID: {userData?.numeric_id || 'Generating...'}</p>
            </div>
          </div>
          <ChevronRight className="text-slate-300 h-4 w-4" />
        </div>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-2 gap-3 px-4 mt-4">
        <div className="bg-white p-3.5 rounded-[18px] shadow-sm border border-slate-50 space-y-2">
          <div className="flex items-center gap-1.5 opacity-60">
             <div className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-[10px] shadow-inner">🇮🇳</div>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">IToken</span>
          </div>
          <p className="text-lg font-black text-slate-800 tracking-tighter">₹{userData?.itoken_balance?.toFixed(2) || '0.00'}</p>
        </div>

        <div className="bg-white p-3.5 rounded-[18px] shadow-sm border border-slate-50 space-y-2">
          <div className="flex items-center gap-1.5 opacity-60">
             <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center shadow-inner">
               <Gift className="text-orange-400 h-3 w-3" />
             </div>
             <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">Profit</span>
          </div>
          <p className="text-lg font-black text-orange-500 tracking-tighter">₹{userData?.today_profit?.toFixed(2) || '0.00'}</p>
        </div>
      </div>

      {/* Menu List */}
      <div className="mt-5 space-y-5">
        {menuSections.map((section, sIdx) => (
          <div key={sIdx} className="px-4">
            <h3 className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-2.5 px-1">{section.title}</h3>
            <div className="bg-white rounded-[20px] overflow-hidden border border-slate-50 shadow-sm">
              {section.items.map((item, iIdx) => (
                <div 
                  key={iIdx} 
                  className={cn(
                    "flex items-center justify-between p-3.5 hover:bg-slate-50 transition-colors cursor-pointer active:bg-slate-100",
                    iIdx !== section.items.length - 1 && "border-b border-slate-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center bg-slate-50 shadow-sm")}>
                      <item.icon className={cn("h-4 w-4", item.color)} />
                    </div>
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-tight">{item.label}</span>
                  </div>
                  <ChevronRight className="text-slate-300 h-3.5 w-3.5" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Version & Action */}
      <div className="px-4 mt-8 flex flex-col gap-4">
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="w-full h-12 rounded-[16px] border-red-100 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all active:scale-95"
        >
          LOG OUT FROM MONEXO
        </Button>
        
        <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="bg-white p-2 rounded-xl shadow-sm">
               <Download className="h-4 w-4 text-blue-500" />
             </div>
             <div>
               <p className="text-[10px] font-black text-slate-800 uppercase">Update to v2.0.1</p>
               <p className="text-[8px] font-bold text-slate-400">Better performance & UI fixes</p>
             </div>
           </div>
           <Button size="sm" className="h-7 rounded-lg bg-blue-500 text-[8px] font-black uppercase px-3">Download</Button>
        </div>

        <div className="text-center py-4">
           <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.3em]">Monexo Upi Premium Payments</p>
           <p className="text-[8px] font-bold text-slate-300 mt-1">© 2025 MONEXO GLOBAL</p>
        </div>
      </div>
    </div>
  );
}
