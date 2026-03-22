
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, Wallet, ArrowUpRight, ArrowDownLeft, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function DashboardPage() {
  const [session, setSession] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setSession(session);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) router.push('/login');
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged Out",
      description: "Come back soon!",
    });
    router.push('/login');
  };

  if (!session) return null;

  return (
    <div className="animate-in fade-in duration-700 w-full">
      <header className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full monexo-gradient flex items-center justify-center text-white">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Welcome back,</p>
            <p className="font-bold text-sm">{session.user.email?.split('@')[0]}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full text-destructive">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <Card className="monexo-gradient border-none text-white overflow-hidden card-shadow rounded-[20px] mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-white/70" />
              <span className="text-sm font-medium text-white/80">Total Balance</span>
            </div>
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Primary Wallet</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-2">$12,450.00</h2>
          <div className="flex gap-4 mt-8">
            <Button variant="secondary" className="bg-white/10 text-white border-none rounded-full flex-1 hover:bg-white/20">
              <ArrowUpRight className="mr-1 h-4 w-4" /> Send
            </Button>
            <Button variant="secondary" className="bg-white/10 text-white border-none rounded-full flex-1 hover:bg-white/20">
              <ArrowDownLeft className="mr-1 h-4 w-4" /> Receive
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="font-bold text-lg px-2">Recent Transactions</h3>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[20px] p-4 flex items-center justify-between card-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center text-primary">
                {i % 2 === 0 ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
              </div>
              <div>
                <p className="font-semibold text-sm">{i % 2 === 0 ? 'Received from Alice' : 'Payment to Netflix'}</p>
                <p className="text-xs text-muted-foreground">Today, 10:45 AM</p>
              </div>
            </div>
            <p className={`font-bold ${i % 2 === 0 ? 'text-green-500' : 'text-foreground'}`}>
              {i % 2 === 0 ? '+$50.00' : '-$15.99'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
