"use client";

import { useState } from 'react';
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const message = error.message || "Invalid credentials. Please try again.";
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
    <div className="page-fade min-h-screen flex flex-col bg-slate-50">
      {/* Top Branding Section */}
      <div className="monexo-gradient relative pt-20 pb-16 px-8 flex flex-col items-center overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        
        <h1 className="text-5xl font-black text-white tracking-tighter mb-1 relative z-10 italic">MONEXO</h1>
        <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/30 relative z-10">
          <p className="text-[10px] font-black tracking-[0.4em] text-white uppercase">UPI PAYMENTS</p>
        </div>
      </div>

      {/* Login Form Container */}
      <div className="flex-1 px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-[32px] p-8 card-shadow space-y-8 min-h-[480px]">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
            <p className="text-sm text-slate-400 font-medium">Enter your credentials to continue</p>
          </div>

          {errorMsg && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-bold">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-5">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-12 h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl text-lg transition-all font-medium"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-12 h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl text-lg transition-all font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="save" defaultChecked className="rounded-md border-slate-200" />
                <label htmlFor="save" className="text-xs font-bold text-slate-400 cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link href="#" className="text-xs text-primary font-bold hover:underline">
                Forgot?
              </Link>
            </div>

            <div className="space-y-5 pt-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl monexo-gradient text-white font-bold text-lg shadow-xl active:scale-[0.98] transition-transform"
              >
                {loading ? "Authenticating..." : "Sign In"}
                {!loading && <ChevronRight className="ml-2 h-5 w-5" />}
              </Button>

              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-primary font-extrabold hover:underline">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="pb-8 pt-4 text-center mt-auto">
        <p className="text-[10px] font-bold text-slate-300 tracking-[0.4em] uppercase">MONEXO PRO v2.0</p>
      </div>
    </div>
  );
}