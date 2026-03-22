"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Lock, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const email = `${phone}@monexo.app`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully logged in to Monexo UPI.",
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade min-h-full flex flex-col bg-white">
      {/* Top Branding Section */}
      <div className="monexo-gradient relative pt-16 pb-12 px-8 flex flex-col items-center overflow-hidden">
        {/* Subtle Decorative Circle */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        
        <h1 className="text-5xl font-extrabold text-white tracking-tighter mb-1 relative z-10">MONEXO</h1>
        <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/30 relative z-10">
          <p className="text-[10px] font-bold tracking-[0.3em] text-white uppercase">UPI PAYMENTS</p>
        </div>
      </div>

      {/* Login Form Container */}
      <div className="flex-1 px-6 -mt-6">
        <div className="bg-white rounded-[32px] p-8 card-shadow space-y-8 relative z-20">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">Sign In</h2>
            <p className="text-sm text-slate-500">Securely access your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-12 h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl text-lg transition-all"
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
                  className="pl-12 h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl text-lg transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="save" defaultChecked />
                <label htmlFor="save" className="text-xs font-medium text-slate-500 cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link href="#" className="text-xs text-primary font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <div className="space-y-4 pt-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl monexo-gradient text-white font-bold text-lg shadow-xl active:scale-[0.98] transition-transform"
              >
                {loading ? "Verifying..." : "Sign In"}
                {!loading && <ChevronRight className="ml-2 h-5 w-5" />}
              </Button>

              <div className="text-center">
                <p className="text-sm text-slate-500">
                  Don't have an account?{' '}
                  <Link href="/register" className="text-primary font-bold hover:underline">
                    Create Account
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Decoration */}
      <div className="pb-8 pt-4 text-center mt-auto">
        <p className="text-[10px] font-bold text-slate-300 tracking-[0.4em] uppercase">MONEXO PRO</p>
      </div>
    </div>
  );
}