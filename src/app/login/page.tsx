
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Lock, ChevronRight, Fingerprint } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [savePassword, setSavePassword] = useState(true);
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
    <div className="min-h-screen bg-slate-50 flex flex-col animate-in fade-in duration-700">
      {/* Upper Branding Section */}
      <div className="monexo-gradient pt-20 pb-12 px-8 rounded-b-[40px] flex flex-col items-center shadow-lg">
        <h1 className="text-5xl font-extrabold text-white tracking-tighter mb-1">MONEXO</h1>
        <div className="bg-white/20 backdrop-blur-md px-4 py-1 rounded-full border border-white/30">
          <p className="text-xs font-bold tracking-[0.2em] text-white uppercase">UPI PAYMENTS</p>
        </div>
      </div>

      {/* Login Card */}
      <div className="px-6 -mt-8 flex-1 pb-10">
        <div className="bg-white rounded-[32px] p-8 card-shadow space-y-8">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-800">Login</h2>
            <p className="text-sm text-muted-foreground">Please sign in to your account</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-12 h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl text-lg"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-12 h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl text-lg"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="save" 
                  checked={savePassword} 
                  onCheckedChange={(checked) => setSavePassword(!!checked)} 
                />
                <label htmlFor="save" className="text-xs font-medium text-slate-500 cursor-pointer">
                  Remember me
                </label>
              </div>
              <Link href="/forgot-password" title="Forgot Password" className="text-xs text-primary font-bold hover:underline">
                Forgot Password?
              </Link>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl monexo-gradient text-white font-bold text-lg hover:opacity-95 transition-all shadow-xl active:scale-[0.98]"
            >
              {loading ? "Verifying..." : "Sign In"}
              {!loading && <ChevronRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>

          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="h-[1px] w-12 bg-slate-200"></div>
              <span className="text-[10px] uppercase font-bold tracking-widest">Or login with</span>
              <div className="h-[1px] w-12 bg-slate-200"></div>
            </div>
            
            <Button variant="outline" className="w-14 h-14 rounded-2xl border-slate-100 bg-slate-50 text-slate-400 hover:text-primary transition-colors">
              <Fingerprint className="h-8 w-8" />
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-slate-500">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary font-bold hover:underline">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="pb-8 text-center">
        <p className="text-[10px] font-bold text-slate-300 tracking-[0.4em] uppercase">MONEXO UPI</p>
      </div>
    </div>
  );
}
