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
  ShieldCheck
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
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  const menuItems = [
    { label: 'IToken', icon: () => <span className="text-lg">🇮🇳</span>, value: `₹${userData?.itoken_balance?.toFixed(2) || '0.00'}`, color: 'text-slate-800' },
    { label: 'Today Profit', icon: Gift, value: `₹${userData?.today_profit?.toFixed(2) || '0.00'}`, color: 'text-orange-500' },
    { label: 'UPI Sell History', icon: LayoutGrid, color: 'text-blue-500' },
    { label: 'Buy History', icon: ClipboardList, color: 'text-blue-600' },
    { label: 'Transfer IToken History', icon: ArrowRightLeft, color: 'text-indigo-500' },
    { label: 'Event Center', icon: Ticket, color: 'text-orange-500' },
    { label: 'Tutorial', icon: PlayCircle, color: 'text-slate-600' },
    { label: 'Official Service', icon: Headphones, color: 'text-blue-600' },
    { label: 'Modify Password', icon: Lock, color: 'text-blue-500' },
  ];

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden font-sans">
      {/* Header - Branded MONEXO-PAY */}
      <div className="text-center py-3 bg-white border-b flex items-center justify-center relative shadow-sm">
        <h1 className="text-[18px] font-black text-blue-600 italic tracking-tighter uppercase">MONEXO-PAY</h1>
      </div>

      {/* Profile Section - Compact */}
      <div className="px-5 py-3 flex items-center justify-between border-b border-slate-50 bg-slate-50/20">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
            <AvatarImage src={`https://picsum.photos/seed/${userData?.id}/150`} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-black">U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
             <span className="text-[14px] font-black text-slate-900 uppercase tracking-tight">
               User_{userData?.numeric_id?.toString().slice(-4) || '7092'}
             </span>
             <div className="flex items-center gap-3">
               <div className="flex items-center gap-1">
                 <ShieldCheck className="h-3 w-3 text-green-500" />
                 <span className="text-[10px] font-bold text-slate-400 uppercase">Reward: {userData?.reward_percent || 5}%</span>
               </div>
               <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ID: {userData?.numeric_id || '530087092'}</span>
             </div>
          </div>
        </div>
        <ChevronRight className="text-slate-300 h-4 w-4" />
      </div>

      {/* Menu List - Optimized for No-Scroll */}
      <div className="flex-1 overflow-hidden">
        {menuItems.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between px-5 py-[10px] active:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-5 h-5 flex items-center justify-center">
                {typeof item.icon === 'function' ? <item.icon /> : <item.icon className={`h-4 w-4 ${item.color}`} strokeWidth={2.5} />}
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
      </div>

      {/* Action Section - Fixed at Bottom */}
      <div className="px-5 py-3 border-t border-slate-100 bg-white relative">
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="w-full h-11 rounded-2xl border-slate-200 text-red-500 font-black text-[12px] hover:bg-red-50 hover:border-red-100 transition-all shadow-sm uppercase tracking-widest active:scale-95"
        >
          Sign Out
        </Button>
        
        {/* Floating Headphones Icon */}
        <div className="absolute right-8 -top-5 bg-white p-2 rounded-full shadow-lg border border-slate-100 active:scale-90 transition-transform">
          <Headphones className="h-5 w-5 text-blue-500" />
        </div>
      </div>

      {/* Footer Info - Compact */}
      <div className="text-center pb-4 bg-white">
        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Version 2.0.0 PRO</p>
        <p className="text-[8px] font-black text-blue-500 mt-0.5 uppercase cursor-pointer hover:underline">
          Download APK Official
        </p>
      </div>
    </div>
  );
}
