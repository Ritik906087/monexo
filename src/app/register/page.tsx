
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className="w-full h-[240px] relative overflow-hidden flex flex-col justify-center px-10 pt-12">
        <h1 className="text-5xl font-extrabold text-white tracking-tight mb-2 z-10">welcome</h1>
        
        {/* Floating Graphic Element (Simulating the phone/wallet graphic from the image) */}
        <div className="absolute right-[-10px] top-8 opacity-90 z-0">
          <div className="relative w-40 h-56 rotate-6">
            <div className="absolute inset-0 bg-blue-400/20 blur-3xl rounded-full scale-150"></div>
            <Smartphone className="w-full h-full text-white/30" strokeWidth={0.5} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-40 border-2 border-white/20 rounded-[30px] flex flex-col items-center justify-center p-4">
               <div className="w-10 h-8 bg-yellow-400/80 rounded shadow-lg flex items-center justify-center text-xs font-bold text-blue-900 mb-2">$</div>
               <div className="w-8 h-8 bg-blue-500/80 rounded shadow-lg flex items-center justify-center text-xs font-bold text-white">✓</div>
            </div>
          </div>
        </div>
      </div>

      {/* Register Form Card */}
      <div className="w-full px-5 mt-[-20px] z-20">
        <div className="bg-white rounded-[25px] p-10 shadow-2xl space-y-8">
          <form onSubmit={handleRegister} className="space-y-2">
            
            {/* Phone Input */}
            <div className="flex items-center border-b border-gray-100 py-4">
              <span className="w-28 text-gray-700 font-medium text-base">Phone</span>
              <input
                type="tel"
                placeholder="Enter phone number"
                className="flex-1 outline-none text-gray-800 placeholder:text-gray-300 bg-transparent text-base"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="flex items-center border-b border-gray-100 py-4">
              <span className="w-28 text-gray-700 font-medium text-base">Password</span>
              <input
                type="password"
                placeholder="Enter password"
                className="flex-1 outline-none text-gray-800 placeholder:text-gray-300 bg-transparent text-base"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex items-center border-b border-gray-100 py-4">
              <span className="w-28 text-gray-700 font-medium text-base">Confirm</span>
              <input
                type="password"
                placeholder="Password, Again"
                className="flex-1 outline-none text-gray-800 placeholder:text-gray-300 bg-transparent text-base"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {/* Inviter Code */}
            <div className="flex items-center border-b border-gray-100 py-4 mb-2">
              <span className="w-28 text-gray-700 font-medium text-base">Invitercode</span>
              <input
                type="text"
                placeholder="Optional"
                className="flex-1 outline-none text-gray-800 placeholder:text-gray-300 bg-transparent text-base"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
              />
            </div>

            {/* Login Link */}
            <div className="text-right py-4">
              <Link href="/login" className="text-sm text-[#1A7BFF] font-medium hover:underline">
                Already have an account,Go login
              </Link>
            </div>

            {/* Register Button */}
            <div className="pt-4">
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 rounded-xl bg-[#1A7BFF] text-white font-bold text-lg hover:bg-blue-600 transition-all shadow-lg active:scale-95"
              >
                {loading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="mt-12 mb-10">
        <p className="text-white/40 text-[10px] font-bold tracking-[0.2em] uppercase">MONEXO UPI</p>
      </div>
    </div>
  );
}
