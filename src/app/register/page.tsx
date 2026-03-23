
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const [isInviteFixed, setIsInviteFixed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    // Manually parse invite code from URL/Hash for maximum reliability
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const inviteMatch = url.match(/[?&]invite=([^&]+)/);
    if (inviteMatch && inviteMatch[1]) {
      setInviteCode(inviteMatch[1]);
      setIsInviteFixed(true);
    }
  }, []);

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
            numeric_id: Math.floor(100000000 + Math.random() * 900000000),
            itoken_balance: 0,
            today_profit: 0,
            reward_percent: 5
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
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
      {/* Premium Header Section - Fixed Padding for "Create" text visibility */}
      <div className="bg-[#2A85FF] pt-14 pb-14 px-8 relative overflow-hidden shrink-0">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute top-20 -left-10 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl" />
        <div className="relative z-10 space-y-0">
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none mb-1">Create</h1>
          <div className="flex items-center gap-2">
            <span className="text-white/90 text-xl font-black italic tracking-wide uppercase">MONEXO UPI</span>
          </div>
        </div>
      </div>

      {/* Form Container */}
      <div className="px-5 -mt-10 flex-1 relative z-20 overflow-y-auto smooth-scroll pb-10">
        <div className="bg-white rounded-[32px] p-6 shadow-xl space-y-5">
          <div className="space-y-0.5">
            <h2 className="text-xl font-bold text-slate-800">Registration</h2>
            <p className="text-[12px] text-slate-400 font-medium tracking-tight">Join the premium UPI network</p>
          </div>

          {errorMsg && (
            <Alert variant="destructive" className="py-2 bg-red-50 border-red-100 text-red-600 rounded-xl animate-in fade-in">
              <AlertCircle className="h-3 w-3" />
              <AlertDescription className="text-[10px] font-bold">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-2.5">
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

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-11 h-12 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#2A85FF] rounded-xl text-sm font-medium"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Ticket className="h-4 w-4" />
                </div>
                <Input
                  type="text"
                  placeholder="Invite code (Optional)"
                  className={`pl-11 h-12 border-none focus-visible:ring-1 focus-visible:ring-[#2A85FF] rounded-xl text-sm font-medium ${isInviteFixed ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50'}`}
                  value={inviteCode}
                  onChange={(e) => !isInviteFixed && setInviteCode(e.target.value)}
                  readOnly={isInviteFixed}
                />
                {isInviteFixed && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="bg-blue-100 text-[#2A85FF] text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Fixed</div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-1">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-12 rounded-xl bg-[#2A85FF] hover:bg-[#1A7BFF] text-white font-black text-sm shadow-md active:scale-[0.98] transition-all border-none"
              >
                {loading ? "CREATING ACCOUNT..." : "REGISTER NOW"}
                {!loading && <ChevronRight className="ml-1 h-4 w-4" />}
              </Button>

              <div className="text-center">
                <p className="text-[12px] text-slate-400 font-medium">
                  Already have an account?{' '}
                  <Link href="/login" className="text-[#2A85FF] font-black hover:underline uppercase tracking-tight">
                    Sign In &raquo;
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="mt-auto py-6 text-center shrink-0">
        <p className="text-slate-300 text-[9px] font-black tracking-[0.3em] uppercase">SECURE UPI PAYMENTS v2.0</p>
      </div>
    </div>
  );
}
