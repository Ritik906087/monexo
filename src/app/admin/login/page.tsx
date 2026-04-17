
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Phone, ChevronRight, ShieldCheck } from 'lucide-react';
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

    if (phone === '9060873927' && password === 'Ritik@9060') {
      localStorage.setItem('isAdminAuthenticated', 'true');
      toast({
        title: "Authenticated",
        description: "Welcome to the Admin Terminal.",
      });
      router.push('/admin');
    } else {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid administrator credentials.",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white items-center justify-center p-6 select-none font-sans">
      <div className="w-full max-w-sm space-y-8 animate-slide-up">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 mb-2">
            <ShieldCheck className="h-6 w-6 text-slate-900" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">Admin Access</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Security Terminal v4.0</p>
        </div>

        <div className="bg-white rounded-[32px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-50">
          <form onSubmit={handleAdminLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Terminal ID</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input
                    type="tel"
                    placeholder="Enter phone"
                    className="pl-11 h-12 bg-slate-50/50 border-none rounded-xl text-sm font-bold focus-visible:ring-1 focus-visible:ring-slate-200"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Access Key</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-300" />
                  <Input
                    type="password"
                    placeholder="Enter password"
                    className="pl-11 h-12 bg-slate-50/50 border-none rounded-xl text-sm font-bold focus-visible:ring-1 focus-visible:ring-slate-200"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full h-12 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-[12px] uppercase tracking-widest transition-all active:scale-[0.98] border-none shadow-none"
            >
              {loading ? "Verifying..." : "Initialize Session"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
        
        <p className="text-center text-[9px] font-bold text-slate-300 uppercase tracking-widest italic">
          Authorized Personnel Only
        </p>
      </div>
    </div>
  );
}
