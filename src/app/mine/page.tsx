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
  LayoutGrid
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
    { label: 'Today Profit', icon: Gift, value: `₹${userData?.today_profit?.toFixed(2) || '0.00'}`, color: 'text-orange-400' },
    { label: 'UPI Sell History', icon: LayoutGrid, color: 'text-blue-400' },
    { label: 'Buy History', icon: ClipboardList, color: 'text-blue-500' },
    { label: 'Transfer IToken History', icon: ClipboardList, color: 'text-blue-400' },
    { label: 'Event Center', icon: Ticket, color: 'text-orange-400' },
    { label: 'Tutorial', icon: PlayCircle, color: 'text-slate-700' },
    { label: 'Official Service', icon: Headphones, color: 'text-blue-500' },
    { label: 'Modify Password', icon: Lock, color: 'text-blue-400' },
  ];

  return (
    <div className="pb-24 page-fade bg-white min-h-full font-sans">
      {/* Header */}
      <div className="text-center py-4 bg-white border-b sticky top-0 z-50">
        <h1 className="text-lg font-medium text-slate-700">Mine</h1>
      </div>

      {/* Profile Section */}
      <div className="px-5 py-6 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-slate-100">
            <AvatarImage src={`https://picsum.photos/seed/${userData?.id}/200`} />
            <AvatarFallback className="bg-blue-50 text-blue-500 font-bold">U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="flex items-center gap-12">
               <span className="text-[13px] text-slate-400">Reward:{userData?.reward_percent || 5}%</span>
               <span className="text-[13px] text-slate-400">ID:{userData?.numeric_id || '530087092'}</span>
            </div>
          </div>
        </div>
        <ChevronRight className="text-slate-300 h-5 w-5" />
      </div>

      {/* Menu List */}
      <div className="mt-2">
        {menuItems.map((item, idx) => (
          <div 
            key={idx} 
            className="flex items-center justify-between px-5 py-4 active:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
          >
            <div className="flex items-center gap-4">
              <div className="w-6 h-6 flex items-center justify-center">
                {typeof item.icon === 'function' ? <item.icon /> : <item.icon className={`h-5 w-5 ${item.color}`} />}
              </div>
              <span className="text-[14px] font-medium text-slate-600">{item.label}</span>
            </div>
            <div className="flex items-center gap-2">
              {item.value && <span className={`text-[14px] font-bold ${item.label === 'IToken' ? 'text-yellow-500' : 'text-yellow-500'}`}>{item.value.replace('₹', '')}</span>}
              <ChevronRight className="text-slate-200 h-5 w-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Action Section */}
      <div className="px-5 mt-10 relative">
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="w-full h-14 rounded-xl border-slate-200 text-slate-600 font-medium text-lg hover:bg-slate-50 transition-all shadow-sm"
        >
          Sign Out
        </Button>
        
        {/* Floating Headphones Icon */}
        <div className="absolute right-6 -bottom-2 bg-blue-50 p-2.5 rounded-full shadow-md border border-white">
          <Headphones className="h-6 w-6 text-blue-400" />
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center mt-12 px-6">
        <p className="text-[11px] text-slate-300">APP Version : 2.0.0</p>
        <p className="text-[11px] text-slate-300 mt-1">
          Haven't downloaded the APK? <span className="text-blue-400 font-medium">Click here and Download now</span>
        </p>
      </div>
    </div>
  );
}
