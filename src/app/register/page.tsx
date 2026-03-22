"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Phone, Lock, Ticket, ChevronRight, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function RegisterPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      const msg = "Passwords do not match.";
      setErrorMsg(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
      return;
    }

    if (password.length < 6) {
      const msg = "Password must be at least 6 characters.";
      setErrorMsg(msg);
      toast({ title: "Error", description: msg, variant: "destructive" });
      return;
    }

    setLoading(true);
    try {
      const email = `${phone}@monexo.app`;
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: dbError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            phone: phone,
            invite_code: inviteCode || null,
          }]);

        if (dbError) throw dbError;

        toast({ title: "Success", description: "Account created successfully!" });
        router.push('/dashboard');
      }
    } catch (error: any) {
      const message = error.message || "Failed to create account.";
      setErrorMsg(message);
      toast({ title: "Failed", description: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade min-h-screen flex flex-col bg-slate-50">
      {/* Premium Header Section */}
      <div className="monexo-gradient pt-20 pb-16 px-8 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        <div className="relative z-10 space-y-1">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">Create your</h1>
          <div className="flex items-center gap-2">
            <span className="text-white/90 text-2xl font-black italic tracking-wide">MONEXO</span>
            <div className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded border border-white/30">
              <span className="text-[10px] font-black text-white uppercase tracking-wider">UPI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="px-5 -mt-10 flex-1 relative z-20">
        <div className="bg-white rounded-[32px] p-8 shadow-xl border border-slate-50 space-y-8 flex flex-col min-h-[520px]">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">Registration</h2>
            <p className="text-sm text-slate-400 font-medium">Join the premium UPI network</p>
          </div>

          {errorMsg && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-600 rounded-2xl animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs font-bold">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-12 h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl text-base font-medium"
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
                  className="pl-12 h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl text-base font-medium"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-12 h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl text-base font-medium"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Ticket className="h-5 w-5" />
                </div>
                <Input
                  type="text"
                  placeholder="Invite code (Optional)"
                  className="pl-12 h-14 bg-slate-50 border-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl text-base font-medium"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-2xl monexo-gradient text-white font-bold text-lg shadow-lg shadow-blue-100 active:scale-[0.98] transition-all"
              >
                {loading ? "Creating Account..." : "Register Now"}
                {!loading && <ChevronRight className="ml-2 h-5 w-5" />}
              </Button>

              <div className="text-center">
                <p className="text-sm text-slate-400 font-medium">
                  Already have an account?{' '}
                  <Link href="/login" className="text-primary font-extrabold hover:underline">
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-auto py-8 text-center">
        <p className="text-slate-300 text-[10px] font-bold tracking-[0.4em] uppercase">SECURE UPI PAYMENTS v2.0</p>
      </div>
    </div>
  );
}