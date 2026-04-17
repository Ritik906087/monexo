
"use client";

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Phone, Lock, Ticket, ChevronRight, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';

function RegisterForm() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isInviteFixed, setIsInviteFixed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push('/dashboard');
      }
    }
    checkUser();

    const queryInvite = searchParams.get('invite');
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const hashInviteMatch = url.match(/[?&]invite=([^&]+)/);
    const hashInvite = hashInviteMatch ? hashInviteMatch[1] : null;

    const finalInvite = queryInvite || hashInvite;

    if (finalInvite) {
      setInviteCode(finalInvite);
      setIsInviteFixed(true);
    }
  }, [searchParams, router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
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
        // Omitting invite_code from insert to fix schema mismatch error shown in screenshot
        const { error: dbError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            phone: phone,
            numeric_id: Math.floor(100000000 + Math.random() * 900000000),
            itoken_balance: 0,
            today_profit: 0,
            reward_percent: 7,
            created_at: new Date().toISOString()
          }]);

        if (dbError) {
          // If DB insert fails, we should notify but maybe they can still login
          // However, for admin to see them, this MUST succeed.
          throw dbError;
        }

        toast({ title: "Success", description: "Account created successfully!" });
        router.push('/dashboard');
      }
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to create account. Please ensure the phone number is unique.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50 overflow-hidden select-none">
      <div className="bg-[#2A85FF] pt-12 pb-10 px-6 relative overflow-hidden shrink-0">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <h1 className="text-2xl font-black text-white tracking-tight uppercase leading-none mb-1 italic">MONEXO UPI</h1>
          <p className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">Premium Network Enrollment</p>
        </div>
      </div>

      <div className="px-4 -mt-6 flex-1 relative z-20 flex flex-col overflow-hidden pb-4">
        <div className="bg-white rounded-[24px] p-5 shadow-lg flex flex-col flex-1 min-h-0 border border-slate-100">
          <div className="space-y-0.5 mb-4 shrink-0">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">Registration</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">Join the network</p>
          </div>

          {errorMsg && (
            <Alert variant="destructive" className="py-2 px-3 bg-red-50 border-red-100 text-red-600 rounded-lg mb-3 shrink-0">
              <AlertCircle className="h-3 w-3" />
              <AlertDescription className="text-[10px] font-bold leading-tight">
                {errorMsg}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleRegister} className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-y-auto smooth-scroll space-y-2.5 pr-1 mb-4">
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  className="pl-10 h-11 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#2A85FF] rounded-lg text-sm font-bold"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <Input
                  type="password"
                  placeholder="Password"
                  className="pl-10 h-11 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#2A85FF] rounded-lg text-sm font-bold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Lock className="h-3.5 w-3.5" />
                </div>
                <Input
                  type="password"
                  placeholder="Confirm Password"
                  className="pl-10 h-11 bg-slate-50 border-none focus-visible:ring-1 focus-visible:ring-[#2A85FF] rounded-lg text-sm font-bold"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <Ticket className="h-3.5 w-3.5" />
                </div>
                <Input
                  type="text"
                  placeholder="Invite code (Optional)"
                  className={`pl-10 h-11 border-none focus-visible:ring-1 focus-visible:ring-[#2A85FF] rounded-lg text-sm font-bold ${isInviteFixed ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : 'bg-slate-50'}`}
                  value={inviteCode}
                  onChange={(e) => !isInviteFixed && setInviteCode(e.target.value)}
                  readOnly={isInviteFixed}
                />
              </div>
            </div>

            <div className="space-y-3 pt-2 shrink-0">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-11 rounded-lg bg-[#2A85FF] hover:bg-[#1A7BFF] text-white font-black text-[12px] uppercase shadow-sm active:scale-[0.98] transition-all border-none"
              >
                {loading ? "PROCESSING..." : "REGISTER NOW"}
              </Button>

              <div className="text-center pb-2">
                <p className="text-[10px] text-slate-400 font-bold uppercase">
                  Already a member?{' '}
                  <Link href="/login" className="text-[#2A85FF] font-black hover:underline tracking-tight">
                    Sign In »
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

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full bg-slate-50">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2A85FF]"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
