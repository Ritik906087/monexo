
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
  LayoutGrid,
  ClipboardList,
  ChevronRightSquare
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
      {/* Header - Simple Title */}
      <div className="text-center py-2.5 border-b border-slate-50 shrink-0">
        <h1 className="text-[15px] font-bold text-slate-700">Mine</h1>
      </div>

      {/* Profile Section - Ultra Compact */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-50 shrink-0">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-slate-50">
            <AvatarImage src={`https://picsum.photos/seed/${userData?.id}/150`} />
            <AvatarFallback className="bg-blue-50 text-blue-600 text-[10px] font-bold">U</AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-4">
            <span className="text-[12px] font-bold text-slate-400">Reward: {userData?.reward_percent || 5}%</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-bold text-slate-400">ID:{userData?.numeric_id || '---'}</span>
          <ChevronRight className="h-4 w-4 text-slate-200" />
        </div>
      </div>

      {/* Menu List - Tightened for Single Screen View */}
      <div className="flex-1 overflow-y-auto smooth-scroll px-1">
        {menuItems.map((item, idx) => (
          <div 
            key={idx} 
            onClick={item.onClick}
            className="flex items-center justify-between px-5 py-3.5 active:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-5 h-5 flex items-center justify-center">
                {typeof item.icon === 'function' ? <item.icon /> : <item.icon className={`h-[18px] w-[18px] ${item.color}`} strokeWidth={1.5} />}
              </div>
              <span className="text-[13px] font-medium text-slate-700">{item.label}</span>
            </div>
            <div className="flex items-center gap-1">
              {item.value && (
                <span className={`text-[13px] font-bold ${item.label === 'IToken' ? 'text-yellow-500' : 'text-slate-300'}`}>
                  {item.value}
                </span>
              )}
              <ChevronRight className="text-slate-200 h-4 w-4" />
            </div>
          </div>
        ))}

        {/* Action Section */}
        <div className="px-5 py-6 space-y-4">
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="w-full h-11 rounded-xl border-slate-100 text-slate-700 font-bold text-[15px] hover:bg-slate-50 transition-all shadow-none border"
          >
            Sign Out
          </Button>
          
          <div className="text-center space-y-1 pb-4">
            <p className="text-[10px] text-slate-300 uppercase tracking-tighter">APP Version : 2.0.0</p>
            <p className="text-[10px] font-medium text-slate-400">
              Haven't downloaded the APK?{' '}
              <span className="text-blue-400 cursor-pointer hover:underline">Click here and Download now</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
