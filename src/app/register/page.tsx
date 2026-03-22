
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

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
      const email = `${phone}@monexo.app`;
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (authData.user) {
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
    <div className="min-h-screen bg-gradient-to-b from-[#0033FF] to-[#001A80] flex flex-col items-center animate-in fade-in duration-700 font-sans">
      {/* Header Section */}
      <div className="w-full px-10 pt-16 pb-8">
        <h1 className="text-5xl font-bold text-white tracking-tight leading-tight">welcome</h1>
        <p className="text-white/60 text-sm font-medium tracking-wider mt-1 uppercase">Monexo Fintech</p>
      </div>

      {/* Register Form Card */}
      <div className="w-full px-5 z-20">
        <div className="bg-white rounded-[25px] p-8 shadow-2xl space-y-8 min-h-[500px] flex flex-col">
          <form onSubmit={handleRegister} className="space-y-6 flex-1">
            
            {/* Phone Input with Floating Label */}
            <div className="relative group">
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="peer w-full h-14 bg-gray-50 border-b-2 border-transparent px-4 pt-4 outline-none transition-all focus:border-[#0033FF] focus:bg-white rounded-t-lg"
                placeholder=" "
                required
              />
              <label 
                htmlFor="phone"
                className="absolute left-4 top-4 text-gray-400 text-base transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#0033FF] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-1"
              >
                Phone
              </label>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="peer w-full h-14 bg-gray-50 border-b-2 border-transparent px-4 pt-4 outline-none transition-all focus:border-[#0033FF] focus:bg-white rounded-t-lg"
                placeholder=" "
                required
              />
              <label 
                htmlFor="password"
                className="absolute left-4 top-4 text-gray-400 text-base transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#0033FF] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-1"
              >
                Password
              </label>
            </div>

            {/* Confirm Password */}
            <div className="relative group">
              <input
                type="password"
                id="confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="peer w-full h-14 bg-gray-50 border-b-2 border-transparent px-4 pt-4 outline-none transition-all focus:border-[#0033FF] focus:bg-white rounded-t-lg"
                placeholder=" "
                required
              />
              <label 
                htmlFor="confirm"
                className="absolute left-4 top-4 text-gray-400 text-base transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#0033FF] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-1"
              >
                Confirm Password
              </label>
            </div>

            {/* Invite Code */}
            <div className="relative group">
              <input
                type="text"
                id="invite"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="peer w-full h-14 bg-gray-50 border-b-2 border-transparent px-4 pt-4 outline-none transition-all focus:border-[#0033FF] focus:bg-white rounded-t-lg"
                placeholder=" "
              />
              <label 
                htmlFor="invite"
                className="absolute left-4 top-4 text-gray-400 text-base transition-all peer-focus:text-xs peer-focus:top-1 peer-focus:text-[#0033FF] peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:top-1"
              >
                Inviter code (Optional)
              </label>
            </div>

            {/* Login Link */}
            <div className="text-right">
              <Link href="/login" className="text-sm text-[#0033FF] font-semibold hover:underline">
                Already have account? Go login
              </Link>
            </div>

            {/* Register Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-[56px] rounded-[14px] bg-gradient-to-r from-[#0033FF] to-[#0055FF] text-white font-bold text-lg hover:opacity-90 transition-all shadow-xl active:scale-95"
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-auto mb-10 pt-10">
        <p className="text-white/40 text-[11px] font-bold tracking-[0.3em] uppercase">MONEXO UPI</p>
      </div>
    </div>
  );
}
