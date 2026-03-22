"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Wallet, ArrowUpRight, ArrowDownLeft, Bell, Scan } from 'lucide-react';
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
  }, [router]);

  if (!session) return null;

  return (
    <div className="page-fade px-4 pt-6 pb-20">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full monexo-gradient flex items-center justify-center text-white border-4 border-white shadow-lg">
            <User className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Member</p>
            <p className="font-bold text-lg text-slate-800 leading-tight">
              Hello, {session.user.email?.split('@')[0]}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="rounded-full bg-slate-100 h-10 w-10">
            <Bell className="h-5 w-5 text-slate-600" />
          </Button>
        </div>
      </header>

      {/* Balance Card */}
      <Card className="monexo-gradient border-none text-white overflow-hidden rounded-[30px] shadow-2xl mb-8 relative">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <CardContent className="p-8 relative z-10">
          <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-white/70" />
              <span className="text-xs font-bold tracking-widest uppercase text-white/80">Current Balance</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold">
              UPI: {session.user.email?.split('@')[0]}@monexo
            </div>
          </div>
          
          <div className="space-y-1">
            <p className="text-sm text-white/70">Total Savings</p>
            <h2 className="text-4xl font-extrabold tracking-tight">$12,450.00</h2>
          </div>

          <div className="flex gap-4 mt-8">
            <Button className="bg-white text-primary font-bold rounded-2xl flex-1 hover:bg-slate-100 h-12 shadow-lg">
              <ArrowUpRight className="mr-2 h-4 w-4" /> Send
            </Button>
            <Button className="bg-white/20 text-white backdrop-blur-sm border-none rounded-2xl flex-1 h-12 font-bold">
              <Scan className="mr-2 h-4 w-4" /> Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions / Categories */}
      <div className="mb-8">
        <h3 className="font-bold text-slate-800 mb-4 px-1">Quick Services</h3>
        <div className="grid grid-cols-4 gap-4">
          {[
            { name: 'Recharge', icon: '📱' },
            { name: 'DTH', icon: '📡' },
            { name: 'Bills', icon: '📝' },
            { name: 'Offers', icon: '🎁' }
          ].map((item) => (
            <div key={item.name} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-2xl shadow-sm border border-slate-50">
                {item.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-500">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div className="space-y-4 pb-10">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-bold text-slate-800 text-lg">Recent Transactions</h3>
          <Button variant="link" className="text-primary font-bold text-xs">See All</Button>
        </div>
        
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-[24px] p-4 flex items-center justify-between border border-slate-50 shadow-sm active:scale-[0.98] transition-transform cursor-pointer">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center",
                i % 2 === 0 ? "bg-green-50 text-green-600" : "bg-blue-50 text-blue-600"
              )}>
                {i % 2 === 0 ? <ArrowDownLeft className="h-6 w-6" /> : <ArrowUpRight className="h-6 w-6" />}
              </div>
              <div>
                <p className="font-bold text-sm text-slate-800">{i % 2 === 0 ? 'Cashback Received' : 'Payment to Netflix'}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">24 Oct • 10:45 AM</p>
              </div>
            </div>
            <p className={cn(
              "font-extrabold text-sm",
              i % 2 === 0 ? "text-green-500" : "text-slate-800"
            )}>
              {i % 2 === 0 ? '+$50.00' : '-$15.99'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}