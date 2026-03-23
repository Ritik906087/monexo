
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
    toast({
      title: "Copied!",
      description: `${label} copied to clipboard.`,
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged Out", description: "Successfully signed out." });
    router.push('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A85FF]"></div>
    </div>
  );

  const menuItems = [
    { label: 'IToken', icon: () => <span className="text-[14px]">🇮🇳</span>, value: userData?.itoken_balance?.toFixed(2) || '0.00', color: 'text-orange-400' },
    { label: 'Today Profit', icon: Gift, value: userData?.today_profit || '0', color: 'text-yellow-500' },
    { label: 'UPI Sell History', icon: LayoutGrid, color: 'text-blue-500', onClick: () => router.push('/sell-history') },
    { label: 'Buy History', icon: ClipboardList, color: 'text-blue-600', onClick: () => router.push('/buy-history') },
    { label: 'Transfer IToken History', icon: ArrowRightLeft, color: 'text-blue-400' },
    { label: 'Event Center', icon: Ticket, color: 'text-orange-400' },
    { label: 'Tutorial', icon: PlayCircle, color: 'text-slate-700' },
    { label: 'Official Service', icon: Headphones, color: 'text-blue-600' },
    { label: 'Modify Password', icon: Lock, color: 'text-blue-400' },
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden select-none">
      {/* Header - Blue Background */}
      <div className="text-center py-2.5 bg-[#2A85FF] shrink-0 shadow-md">
        <h1 className="text-[14px] font-black text-white tracking-[0.2em] uppercase">MONEXO-PAY</h1>
      </div>

      {/* Profile Section - Updated Avatar & Reward 7% */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-50 bg-slate-50/40 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm bg-blue-50">
            {/* Custom Human Illustration placeholder for a professional look */}
            <AvatarImage src={`https://picsum.photos/seed/user66/200`} />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              <User className="h-6 w-6" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
             <div 
               onClick={() => handleCopy(userData?.phone, 'Mobile Number')}
               className="flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
             >
               <span className="text-[12px] font-black text-slate-800 leading-none uppercase tracking-tight">{userData?.phone}</span>
               <Copy className="h-2.5 w-2.5 text-slate-400" />
             </div>
             <div 
               onClick={() => handleCopy(userData?.numeric_id?.toString(), 'UID')}
               className="flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer mt-0.5"
             >
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">ID:{userData?.numeric_id || '---'}</span>
               <Copy className="h-2 w-2 text-slate-300" />
             </div>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-[9px] font-black text-[#2A85FF] bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 uppercase tracking-tighter">Reward: {userData?.reward_percent || 7}%</span>
        </div>
      </div>

      {/* Menu List - Minimized to fit one screen */}
      <div className="flex-1 overflow-y-auto smooth-scroll px-1">
        {menuItems.map((item, idx) => (
          <div 
            key={idx} 
            onClick={item.onClick}
            className="flex items-center justify-between px-5 py-2.5 active:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-5 h-5 flex items-center justify-center">
                {/* Fixed conditional icon rendering */}
                {typeof item.icon === 'function' ? (
                  item.label === 'IToken' ? (
                    <item.icon />
                  ) : (
                    <item.icon className={`h-[16px] w-[16px] ${item.color}`} strokeWidth={1.5} />
                  )
                ) : null}
              </div>
              <span className="text-[11.5px] font-bold text-slate-600 uppercase tracking-tight leading-none">{item.label}</span>
            </div>
            <div className="flex items-center gap-1">
              {item.value && (
                <span className={`text-[12px] font-black ${item.label === 'IToken' ? 'text-yellow-500' : 'text-slate-400'}`}>
                  {item.value}
                </span>
              )}
              <ChevronRight className="text-slate-200 h-3.5 w-3.5" />
            </div>
          </div>
        ))}

        {/* Action Section */}
        <div className="px-5 py-3 space-y-3">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="w-full h-9 rounded-xl border-slate-200 text-slate-500 font-black text-[12px] uppercase tracking-[0.1em] hover:bg-red-50 hover:text-red-500 transition-all shadow-none"
          >
            Sign Out
          </Button>
          
          <div className="text-center space-y-0.5 pb-2">
            <p className="text-[8px] text-slate-300 font-black uppercase tracking-[0.2em]">APP Version : 2.0.0</p>
            <p className="text-[9px] font-bold text-slate-400 leading-none">
              Haven't downloaded the APK?{' '}
              <span className="text-blue-400 cursor-pointer hover:underline font-black">Download now</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
