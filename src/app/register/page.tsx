"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Phone, Lock, Ticket, ArrowLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

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
      toast({
        title: "Passwords mismatch",
        description: "Please make sure passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Weak Password",
        description: "Password should be at least 6 characters.",
        variant: "destructive",
      });
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
        // SQL Table: users (must be created in Supabase SQL editor first)
        const { error: dbError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              phone: phone,
              invite_code: inviteCode || null,
            },
          ]);

        if (dbError) {
          console.error("DB Insert Error:", dbError);
        }

        toast({
          title: "Account Created!",
          description: "Welcome to Monexo.",
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="monexo-gradient w-full h-32 rounded-[20px] mb-[-40px] flex items-center justify-between px-8 text-white relative z-0">
        <div>
          <h1 className="text-2xl font-bold">Welcome</h1>
          <p className="text-white/80 text-sm">Join Monexo today</p>
        </div>
        <ShieldCheck className="h-12 w-12 opacity-30" />
      </div>

      <div className="bg-white rounded-[20px] p-8 card-shadow space-y-6 relative z-10">
        <form onSubmit={handleRegister} className="space-y-4 pt-2">
          <div className="space-y-2">
            <div className="relative">
              <Phone className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="tel"
                placeholder="Phone Number"
                className="pl-12 h-12 bg-background/50 border-none focus-visible:ring-primary"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Create Password"
                className="pl-12 h-12 bg-background/50 border-none focus-visible:ring-primary"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Confirm Password"
                className="pl-12 h-12 bg-background/50 border-none focus-visible:ring-primary"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Ticket className="absolute left-4 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Invite Code (Optional)"
                className="pl-12 h-12 bg-background/50 border-none focus-visible:ring-primary"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 rounded-full monexo-gradient text-white font-bold text-lg mt-4 hover:opacity-90 transition-opacity"
          >
            {loading ? "Creating Account..." : "Register"}
          </Button>
        </form>

        <div className="text-center pt-2">
          <Link href="/login" className="text-sm text-muted-foreground flex items-center justify-center gap-1 hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Already have an account? <span className="text-primary font-bold">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
