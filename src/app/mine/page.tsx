
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  Gift, 
  ArrowRightLeft, 
  ClipboardList, 
  FileText, 
  Ticket, 
  Play, 
  Headphones, 
  Lock, 
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
    </div>
  );

  const menuItems = [
    { label: 'IToken', icon: "🇮🇳", value: userData?.itoken_balance?.toFixed(2) || '0.00', color: 'text-[#ffbf00]' },
    { label: 'Today Profit', icon: Gift, value: userData?.today_profit || '0', color: 'text-[#ffbf00]', iconColor: 'text-[#ffbf00]' },
    { label: 'UPI Sell History', icon: ArrowRightLeft, onClick: () => router.push('/sell-history'), iconColor: 'text-blue-500' },
    { label: 'Buy History', icon: ClipboardList, onClick: () => router.push('/buy-history'), iconColor: 'text-blue-500' },
    { label: 'Transfer IToken History', icon: ClipboardList, iconColor: 'text-blue-500' },
    { label: 'Event Center', icon: Ticket, iconColor: 'text-orange-400' },
    { label: 'Tutorial', icon: Play, iconColor: 'text-slate-800' },
    { label: 'Official Service', icon: Headphones, iconColor: 'text-indigo-500' },
    { label: 'Modify Password', icon: Lock, iconColor: 'text-blue-300' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white animate-slide-up pb-24 font-sans select-none">
      {/* Title Header */}
      <div className="h-14 flex items-center justify-center border-b border-slate-50 sticky top-0 bg-white z-50">
        <h1 className="text-[17px] font-bold text-slate-700">Mine</h1>
      </div>

      {/* Profile Section */}
      <div className="px-5 py-6 flex items-center justify-between border-b border-slate-50">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full border border-slate-100 flex items-center justify-center p-0.5 bg-white">
            <Avatar className="h-full w-full">
              <AvatarImage src={`https://picsum.photos/seed/${userData?.id}/200`} />
              <AvatarFallback className="bg-slate-50">
                <User className="h-8 w-8 text-slate-300" />
              </AvatarFallback>
            </Avatar>
          </div>
          <span className="text-[15px] text-slate-400 font-medium">Reward:{userData?.reward_percent || '3.5'}%</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span className="text-[15px] font-medium">ID:{userData?.numeric_id || '---'}</span>
          <ChevronRight className="h-5 w-5 opacity-40" />
        </div>
      </div>

      {/* Menu List */}
      <div className="flex-1">
        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              onClick={item.onClick}
              className="flex items-center justify-between px-5 py-4 border-b border-slate-50 active:bg-slate-50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-4">
                <div className={cn("w-6 h-6 flex items-center justify-center", item.iconColor)}>
                  {typeof Icon === 'string' ? (
                    <span className="text-xl leading-none">{Icon}</span>
                  ) : (
                    <Icon className="h-5 w-5" />
                  )}
                </div>
                <span className="text-[16px] text-slate-600 font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.value !== undefined && (
                  <span className={cn("text-[16px] font-bold", item.color)}>
                    {item.value}
                  </span>
                )}
                <ChevronRight className="h-5 w-5 text-slate-200" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Sign Out Button */}
      <div className="p-6 mt-4">
        <Button 
          variant="outline" 
          onClick={handleSignOut}
          className="w-full h-12 rounded-xl border-slate-100 bg-white text-slate-600 font-medium text-[16px] hover:bg-slate-50 active:scale-[0.98] transition-all shadow-none"
        >
          Sign Out
        </Button>
      </div>

      {/* Floating Support FAB */}
      <div className="fixed bottom-24 right-6 z-[60]">
        <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.1)] border border-slate-50 active:scale-90 transition-all">
          <div className="w-11 h-11 rounded-full bg-[#f0f4ff] flex items-center justify-center relative">
            <Headphones className="h-6 w-6 text-indigo-500" />
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-pink-400" />
          </div>
        </button>
      </div>
    </div>
  );
}
