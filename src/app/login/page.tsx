
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
  const [savePassword, setSavePassword] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreePrivacy) {
      toast({
        title: "Consent Required",
        description: "Please agree to our privacy policy to continue.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // For demo purposes, we treat phone as the login identifier.
      // In Supabase Auth, we'll use a virtual email derived from the phone.
      const email = `${phone}@monexo.app`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Welcome back!",
        description: "Successfully logged in.",
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
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-5xl font-bold tracking-tighter monexo-text-gradient mb-1">MONEXO</h1>
        <p className="text-sm font-semibold tracking-widest text-muted-foreground">UPI</p>
      </div>

      <div className="bg-white rounded-[20px] p-8 card-shadow space-y-6">
        <form onSubmit={handleLogin} className="space-y-4">
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
                placeholder="Password"
                className="pl-12 h-12 bg-background/50 border-none focus-visible:ring-primary"
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
              <label htmlFor="save" className="text-xs text-muted-foreground cursor-pointer">
                Save password
              </label>
            </div>
            <Link href="/forgot-password" title="Forgot Password" className="text-xs text-primary font-medium hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 rounded-full monexo-gradient text-white font-bold text-lg hover:opacity-90 transition-opacity"
          >
            {loading ? "Verifying..." : "Login"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="privacy" 
              checked={agreePrivacy} 
              onCheckedChange={(checked) => setAgreePrivacy(!!checked)} 
              required
            />
            <label htmlFor="privacy" className="text-[11px] text-muted-foreground leading-tight cursor-pointer">
              I agree to the <span className="text-primary hover:underline">Privacy Policy</span> and <span className="text-primary hover:underline">Terms of Service</span>
            </label>
          </div>
        </form>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          New to Monexo?{' '}
          <Link href="/register" className="text-primary font-bold hover:underline">
            Register Now
          </Link>
        </p>
      </div>
    </div>
  );
}
