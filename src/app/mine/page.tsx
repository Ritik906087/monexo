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
  ArrowRightLeft
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

  const menuItems = [
    { label: 'UPI Sell History', icon: CreditCard, color: 'text-blue-500' },
    { label: 'Buy History', icon: History, color: 'text-blue-600' },
    { label: 'Transfer IToken History', icon: ArrowRightLeft, color: 'text-blue-400' },
    { label: 'Event Center', icon: Ticket, color: 'text-orange-400' },
    { label: 'Tutorial', icon: PlayCircle, color: 'text-slate-700' },
    { label: 'Official Service', icon: Headphones, color: 'text-indigo-600' },
    { label: 'Modify Password', icon: Lock, color: 'text-blue-500' },
  ];

  return (
    <div className="pb-10 page-fade">
      <h1 className="text-center font-bold text-lg py-4 border-b">Mine</h1>

      {/* Profile Header */}
      <div className="flex items-center justify-between px-4 py-6 bg-white rounded-2xl mb-4 card-shadow mx-4 mt-4">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-primary/10">
            <AvatarImage src="https://picsum.photos/seed/user123/200" />
            <AvatarFallback>UN</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-bold text-sm">Reward: {userData?.reward_percent || 5}%</span>
            </div>
            <p className="text-slate-400 font-bold text-[10px] mt-1 tracking-wider">ID: {userData?.numeric_id || 'Generating...'}</p>
          </div>
        </div>
        <ChevronRight className="text-slate-300 h-5 w-5" />
      </div>

      {/* Token & Profit Info */}
      <div className="space-y-3 px-4">
        <Card className="p-4 border-none card-shadow flex items-center justify-between bg-white rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center shadow-inner">
               <span className="text-lg">🇮🇳</span>
            </div>
            <span className="font-bold text-slate-700">IToken</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-primary text-lg">{userData?.itoken_balance?.toFixed(2) || '0.00'}</span>
            <ChevronRight className="text-slate-300 h-4 w-4" />
          </div>
        </Card>

        <Card className="p-4 border-none card-shadow flex items-center justify-between bg-white rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center shadow-inner">
               <Gift className="text-orange-400 h-5 w-5" />
            </div>
            <span className="font-bold text-slate-700">Today Profit</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-extrabold text-orange-500 text-lg">{userData?.today_profit?.toFixed(2) || '0.00'}</span>
            <ChevronRight className="text-slate-300 h-4 w-4" />
          </div>
        </Card>
      </div>

      {/* Menu List */}
      <div className="mt-6 bg-white rounded-[24px] mx-4 overflow-hidden shadow-sm border border-slate-50">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className={cn(
              "flex items-center justify-between p-4 hover:bg-slate-50 transition-colors cursor-pointer",
              index !== menuItems.length - 1 && "border-b border-slate-50"
            )}
          >
            <div className="flex items-center gap-4">
              <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center bg-slate-50")}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <span className="text-sm font-bold text-slate-700">{item.label}</span>
            </div>
            <ChevronRight className="text-slate-300 h-4 w-4" />
          </div>
        ))}
      </div>

      {/* Sign Out Button */}
      <div className="px-4 mt-8">
        <Button 
          variant="ghost" 
          onClick={handleSignOut}
          className="w-full h-14 rounded-2xl bg-red-50 text-red-500 font-bold hover:bg-red-100 hover:text-red-600 transition-colors"
        >
          Sign Out
        </Button>
      </div>

      <div className="mt-8 text-center px-4 space-y-1 pb-10">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">APP Version : 2.0.0</p>
        <p className="text-[10px] font-bold text-slate-300">
          Haven't downloaded the APK? <span className="text-primary cursor-pointer">Click here</span>
        </p>
      </div>
    </div>
  );
}
