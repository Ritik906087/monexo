
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Lock, ChevronRight, AlertCircle } from 'lucide-react';
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

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to MONEXO UPI.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      let message = "Invalid credentials. Please try again.";
      
      // Better network error handling
      if (error.message === "Failed to fetch" || error.message?.includes("fetch")) {
        message = "Network error. Please check your internet connection and Supabase configuration.";
      } else if (error.message) {
        message = error.message;
      }
      
      setErrorMsg(message);
      toast({
        title: "Login Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden select-none">
      <div className="bg-[#2A85FF] relative pt-12 pb-14 px-8 flex flex-col items-center overflow-hidden shrink-0">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <h1 className="text-4xl font-black text-white tracking-tighter mb-1 relative z-10 italic text-center">MONEXO</h1>
        <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/30 relative z-10">
          <p className="text-[9px] font-black tracking-[0.4em] text-white uppercase">UPI PAYMENTS</p>
        </div>
      </div>

      <div className="flex-1 px-5 -mt-8 relative z-20 overflow-hidden flex flex-col pb-4">
        <div className="bg-white rounded-[32px] p-6 shadow-xl flex flex-col flex-1 min-h-0">
          <div className="space-y-0.5 shrink-0 mb-4">
            <h2 className="text-xl font-bold text-slate-800">Account Login</h2>
            <p className="text-[12px] text-slate-400 font-medium tracking-tight">Enter your credentials to continue</p>
          </div>

          {errorMsg && (
            <Alert variant="destructive" className="py-2 bg-red-50 border-red-100 text-red-600 rounded-xl animate-in fade-in shrink-0 mb-3">
              <AlertCircle className="h-3 w-3" />
              <AlertDescription className="text-[10px] font-bold">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto smooth-scroll space-y-4 pr-1 mb-4">
              <div className="space-y-3">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    className="pl-11 h-12 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#2A85FF] rounded-xl text-sm font-medium"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    type="password"
                    placeholder="Password"
                    className="pl-11 h-12 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#2A85FF] rounded-xl text-sm font-medium"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <div className="flex items-center space-x-2">
                  <Checkbox id="save" defaultChecked className="rounded border-slate-200" />
                  <label htmlFor="save" className="text-[11px] font-bold text-slate-400 cursor-pointer">
                    Remember me
                  </label>
                </div>
                <Link href="#" className="text-[11px] text-[#2A85FF] font-bold hover:underline">
                  Forgot?
                </Link>
              </div>
            </div>

            <div className="space-y-4 pt-2 shrink-0">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#2A85FF] hover:bg-[#1A7BFF] text-white font-black text-sm shadow-md active:scale-[0.98] transition-all border-none"
              >
                {loading ? "AUTHENTICATING..." : "LOG IN"}
                {!loading && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>

              <div className="text-center pb-2">
                <p className="text-[12px] text-slate-400 font-medium">
                  No Account?{' '}
                  <Link href="/register" className="text-[#2A85FF] font-black hover:underline uppercase tracking-tight">
                    Register Now »
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
