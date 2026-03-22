"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { Phone, Lock, Ticket, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function RegisterPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Passwords do not match.", variant: "destructive" });
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
      toast({ title: "Failed", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-fade min-h-full flex flex-col bg-[#F8FAFC]">
      {/* Header Section */}
      <div className="monexo-gradient pt-16 pb-12 px-8">
        <h1 className="text-4xl font-bold text-white tracking-tight">Welcome to</h1>
        <p className="text-white/80 text-xl font-medium tracking-wide">Monexo UPI</p>
      </div>

      {/* Form Container */}
      <div className="px-5 -mt-8 flex-1">
        <div className="bg-white rounded-[25px] p-8 shadow-2xl space-y-8 flex flex-col">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-800">Registration</h2>
            <p className="text-sm text-slate-500">Fill details to join us</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <Input
                  type="tel"
                  placeholder="Phone"
                  className="pl-12 h-14 bg-slate-50 border-none rounded-2xl text-base"
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
                  className="pl-12 h-14 bg-slate-50 border-none rounded-2xl text-base"
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
                  className="pl-12 h-14 bg-slate-50 border-none rounded-2xl text-base"
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
                  className="pl-12 h-14 bg-slate-50 border-none rounded-2xl text-base"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
              </div>
            </div>

            <div className="text-right">
              <Link href="/login" className="text-sm text-primary font-semibold hover:underline">
                Already have account? Login
              </Link>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl monexo-gradient text-white font-bold text-lg shadow-lg active:scale-95 transition-all"
            >
              <UserPlus className="mr-2 h-5 w-5" />
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-auto py-8 text-center">
        <p className="text-slate-400 text-[10px] font-bold tracking-[0.4em] uppercase">MONEXO UPI</p>
      </div>
    </div>
  );
}