
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Phone, ChevronRight, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

export default function AdminLoginPage() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Hardcoded credentials as requested
    if (phone === '9060873927' && password === 'Ritik@9060') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      toast({
        title: "Access Granted",
        description: "Welcome back, Administrator.",
      });
      router.push('/admin');
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid Administrator credentials.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a] overflow-hidden select-none items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 animate-slide-up">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-500/10 border border-blue-500/20 mb-4">
            <ShieldAlert className="h-8 w-8 text-blue-500" />
          </div>
          <h1 className="text-2xl font-black text-white uppercase tracking-widest">Admin Portal</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Secure Terminal v2.0</p>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[32px] p-8 shadow-2xl">
          <form onSubmit={handleAdminLogin} className="space-y-5">
            <div className="space-y-4">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Phone className="h-4 w-4" />
                </div>
                <Input
                  type="tel"
                  placeholder="Admin Phone"
                  className="pl-11 h-14 bg-slate-800/50 border-slate-700 text-white focus-visible:ring-blue-500 rounded-2xl"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  type="password"
                  placeholder="Admin Password"
                  className="pl-11 h-14 bg-slate-800/50 border-slate-700 text-white focus-visible:ring-blue-500 rounded-2xl"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest shadow-lg shadow-blue-900/20 active:scale-95 transition-all border-none"
            >
              {loading ? "Verifying..." : "Initialize Session"}
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
