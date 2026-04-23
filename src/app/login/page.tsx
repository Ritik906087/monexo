
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Lock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function checkUser() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          router.push('/dashboard');
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      }
    }
    checkUser();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return;
    
    setLoading(true);
    setErrorMsg(null);
    
    try {
      const email = `${phone}@monexo.app`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          const currentIp = ipData.ip;
          const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

          const { data: userData } = await supabase
            .from('users')
            .select('last_ip, total_logins, unique_ips')
            .eq('id', data.user.id)
            .single();

          const isNewIp = userData?.last_ip !== currentIp;

          await supabase
            .from('users')
            .update({
              last_ip: currentIp,
              device_type: isMobile ? 'mobile' : 'desktop',
              total_logins: (userData?.total_logins || 0) + 1,
              unique_ips: isNewIp ? (userData?.unique_ips || 1) + 1 : (userData?.unique_ips || 1)
            })
            .eq('id', data.user.id);
        } catch (ipErr) {
          console.error("Tracking error:", ipErr);
        }
      }

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to MONEXO UPI.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      setErrorMsg(error.message || "Invalid credentials.");
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#f8fafc] overflow-hidden select-none">
      <div className="bg-[#2A85FF] relative pt-12 pb-14 px-6 flex flex-col items-center overflow-hidden shrink-0">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <h1 className="text-3xl font-black text-white tracking-tighter mb-1 relative z-10 italic">MONEXO</h1>
        <div className="bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full border border-white/20 relative z-10">
          <p className="text-[8px] font-black tracking-[0.4em] text-white uppercase">UPI PAYMENTS</p>
        </div>
      </div>

      <div className="flex-1 px-4 -mt-6 relative z-20 flex flex-col pb-4">
        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 flex flex-col border border-slate-100">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-tight">Login</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Secure Session Initialize</p>
          </div>

          {errorMsg && (
            <Alert variant="destructive" className="py-2 px-3 bg-red-50 border-red-100 text-red-600 rounded-lg mb-4">
              <AlertCircle className="h-3 w-3" />
              <AlertDescription className="text-[9px] font-bold">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="tel"
                placeholder="Phone Number"
                className="pl-10 h-11 bg-slate-50 border-none rounded-xl text-sm font-bold"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <Input
                type="password"
                placeholder="Password"
                className="pl-10 h-11 bg-slate-50 border-none rounded-xl text-sm font-bold"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="save" defaultChecked className="h-3.5 w-3.5 rounded border-slate-200" />
                <label htmlFor="save" className="text-[10px] font-bold text-slate-400 cursor-pointer uppercase">Remember</label>
              </div>
              <Link href="#" className="text-[10px] text-[#2A85FF] font-bold uppercase">Forgot Password?</Link>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-11 rounded-xl bg-[#2A85FF] hover:bg-[#1A7BFF] text-white font-bold text-[12px] uppercase shadow-lg shadow-blue-100 border-none mt-2"
            >
              {loading ? "AUTHENTICATING..." : "LOG IN"}
            </Button>

            <div className="text-center pt-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase">
                New user?{' '}
                <Link href="/register" className="text-[#2A85FF] font-black hover:underline tracking-tight">
                  Join Now »
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
