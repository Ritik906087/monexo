
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
  Bell,
  Download,
  ClipboardList,
  LayoutGrid,
  Settings,
  User,
  ShieldCheck,
  Copy,
  CheckCircle2
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
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} has been copied to clipboard.`,
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({ title: "Logged Out", description: "Successfully signed out." });
    router.push('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A85FF]"></div>
    </div>
  );

  const menuItems = [
    { label: 'IToken', icon: () => <span className="text-lg">🇮🇳</span>, value: `₹${userData?.itoken_balance?.toFixed(2) || '0.00'}`, color: 'text-slate-800' },
    { label: 'Today Profit', icon: Gift, value: `₹${userData?.today_profit?.toFixed(2) || '0.00'}`, color: 'text-orange-500' },
    { label: 'UPI Sell History', icon: LayoutGrid, color: 'text-blue-500', onClick: () => router.push('/sell-history') },
    { label: 'Buy History', icon: ClipboardList, color: 'text-blue-600', onClick: () => router.push('/buy-history') },
    { label: 'Transfer IToken History', icon: ArrowRightLeft, color: 'text-indigo-500' },
    { label: 'Event Center', icon: Ticket, color: 'text-orange-500' },
    { label: 'Tutorial', icon: PlayCircle, color: 'text-slate-600' },
    { label: 'Official Service', icon: Headphones, color: 'text-blue-600' },
    { label: 'Modify Password', icon: Lock, color: 'text-blue-500' },
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden font-sans pb-20">
      {/* Header - Branded MONEXO-PAY */}
      <div className="text-center py-3 bg-[#2A85FF] flex items-center justify-center relative shadow-sm shrink-0">
        <h1 className="text-[18px] font-black text-white italic tracking-tighter uppercase">MONEXO-PAY</h1>
      </div>

      {/* Profile Section - Compact & Functional */}
      <div className="px-5 py-5 flex items-center justify-between border-b border-slate-50 bg-slate-50/20 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14 border-2 border-white shadow-md">
            <AvatarImage src={`https://picsum.photos/seed/${userData?.id}/150`} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-black">U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
             <div 
               onClick={() => handleCopy(userData?.phone || '', 'Phone Number')}
               className="flex items-center gap-1.5 active:scale-95 transition-transform cursor-pointer"
             >
               <span className="text-[15px] font-black text-slate-900 tracking-tight">
                 {userData?.phone || 'Loading...'}
               </span>
               <Copy className="h-3 w-3 text-slate-400" />
             </div>
             
             <div className="flex items-center gap-3">
               <div 
                 onClick={() => handleCopy(userData?.numeric_id?.toString() || '', 'UID')}
                 className="flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-slate-100 shadow-sm active:scale-95 transition-transform cursor-pointer"
               >
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {userData?.numeric_id || '---'}</span>
                 <Copy className="h-2.5 w-2.5 text-slate-300" />
               </div>
               <div className="flex items-center gap-1">
                 <ShieldCheck className="h-3 w-3 text-green-500" />
                 <span className="text-[10px] font-black text-green-600 uppercase">Reward: {userData?.reward_percent || 5}%</span>
               </div>
             </div>
          </div>
        </div>
        <div className="bg-blue-50 p-2 rounded-full">
          <ChevronRight className="text-[#2A85FF] h-4 w-4" />
        </div>
      </div>

      {/* Menu List - Optimized for No-Scroll */}
      <div className="flex-1 overflow-y-auto smooth-scroll">
        {menuItems.map((item, idx) => (
          <div 
            key={idx} 
            onClick={item.onClick}
            className="flex items-center justify-between px-5 py-[14px] active:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 flex items-center justify-center">
                {typeof item.icon === 'function' ? <item.icon /> : <item.icon className={`h-4.5 w-4.5 ${item.color}`} strokeWidth={2.5} />}
              </div>
              <span className="text-[13px] font-bold text-slate-700 uppercase tracking-tight">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.value && (
                <span className="text-[13px] font-black text-orange-500">
                  {item.value.replace('₹', '')}
                </span>
              )}
              <ChevronRight className="text-slate-200 h-4 w-4" />
            </div>
          </div>
        ))}

        {/* Action Section - Injected in Scroll */}
        <div className="px-5 py-6 space-y-4">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="w-full h-12 rounded-2xl border-slate-200 text-red-500 font-black text-[12px] hover:bg-red-50 hover:border-red-100 transition-all shadow-sm uppercase tracking-widest active:scale-95"
          >
            Sign Out Account
          </Button>
          
          <div className="text-center">
            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Version 2.0.0 PRO</p>
            <p className="text-[8px] font-black text-[#2A85FF] mt-1 uppercase cursor-pointer hover:underline">
              Download APK Official
            </p>
          </div>
        </div>
      </div>

      {/* Floating Service Icon */}
      <div className="fixed right-6 bottom-24 z-[110]">
        <div className="bg-white p-3 rounded-full shadow-2xl border border-blue-50 active:scale-90 transition-transform cursor-pointer animate-bounce">
          <Headphones className="h-6 w-6 text-[#2A85FF]" />
        </div>
      </div>
    </div>
  );
}
