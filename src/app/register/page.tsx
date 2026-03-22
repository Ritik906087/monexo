
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Smartphone } from 'lucide-react';
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
        title: "Error",
        description: "Passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Supabase uses email/password. We use a virtual email for phone.
      const email = `${phone}@monexo.app`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
        // Insert user record into public.users table
        const { error: dbError } = await supabase
          .from('users')
          .insert([
            {
              id: authData.user.id,
              phone: phone,
              invite_code: inviteCode || null,
            },
          ]);

        if (dbError) throw dbError;

        toast({
          title: "Success",
          description: "Welcome to Monexo! Account created.",
        });
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0000FF] flex flex-col items-center animate-in fade-in duration-500">
      {/* Top Welcome Section */}
      <div className="w-full h-[280px] relative overflow-hidden flex flex-col justify-center px-8 pt-10">
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2 z-10">welcome</h1>
        
        {/* Floating Graphic Element (Simulating the phone/wallet graphic) */}
        <div className="absolute right-[-20px] top-10 opacity-80 rotate-12 z-0">
          <div className="relative w-48 h-64">
            <Smartphone className="w-full h-full text-white/20" strokeWidth={0.5} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-cyan-400/30 blur-3xl rounded-full"></div>
            <div className="absolute top-10 right-0 w-16 h-10 bg-yellow-400/20 rounded-lg backdrop-blur-sm border border-white/20 flex items-center justify-center text-white font-bold text-xl">$</div>
          </div>
        </div>
      </div>

      {/* Register Form Card */}
      <div className="w-full px-5 mt-[-40px] z-20">
        <div className="bg-white rounded-[25px] p-8 shadow-2xl space-y-6">
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Phone Input */}
            <div className="flex items-center border-b border-gray-100 py-3">
              <span className="w-24 text-gray-700 font-medium">Phone</span>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="flex-1 outline-none text-gray-800 placeholder:text-gray-300 bg-transparent text-sm"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex items-center border-b border-gray-100 py-3">
              <span className="w-24 text-gray-700 font-medium">Password</span>
              <input
                type="password"
                placeholder="Enter password"
                className="flex-1 outline-none text-gray-800 placeholder:text-gray-300 bg-transparent text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border-b border-gray-100 py-3">
              <span className="w-24 text-gray-700 font-medium">Confirm</span>
              <input
                type="password"
                placeholder="Password, Again"
                className="flex-1 outline-none text-gray-800 placeholder:text-gray-300 bg-transparent text-sm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Inviter Code */}
            <div className="flex items-center border-b border-gray-100 py-3 mb-2">
              <span className="w-24 text-gray-700 font-medium">Invitercode</span>
              <input
                type="text"
                placeholder="T75DvonJ4P"
                className="flex-1 outline-none text-gray-800 placeholder:text-gray-300 bg-transparent text-sm"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>

            {/* Login Link */}
            <div className="text-right pb-4">
              <Link href="/login" className="text-[13px] text-primary font-medium hover:underline">
                Already have an account,Go login
              </Link>
            </div>

            {/* Register Button */}
            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-xl bg-primary text-white font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-95"
            >
              {loading ? "Registering..." : "Register"}
            </Button>
          </form>
        </div>
      </div>

      <div className="mt-8 mb-10">
        <p className="text-white/60 text-xs font-bold tracking-widest uppercase">MONEXO UPI</p>
      </div>
    </div>
  );
}
