
"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Wallet, 
  PlusCircle, 
  MinusCircle, 
  Activity,
  User,
  History,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [processing, setProcessing] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (isAdmin !== 'true') {
      router.push('/admin/login');
      return;
    }

    async function fetchData() {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (userData) {
        setUser({
          ...userData,
          status: (userData.unique_ips || 0) > 3 ? 'suspicious' : 'active'
        });
      } else {
        toast({ variant: "destructive", title: "Missing Node", description: "Node entity not found." });
        router.push('/admin');
        return;
      }

      const { data: txData } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (txData) setTransactions(txData);
      
      setLoading(false);
    }

    fetchData();
  }, [id, router, toast]);

  const handleUpdateBalance = async (type: 'ADD' | 'DEDUCT') => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      toast({ title: "Invalid Input", description: "Please enter a valid amount.", variant: "destructive" });
      return;
    }

    setProcessing(true);
    const value = Number(amount);
    const currentBalance = user.itoken_balance || 0;
    const newBalance = type === 'ADD' 
      ? currentBalance + value 
      : Math.max(0, currentBalance - value);

    const { error } = await supabase
      .from('users')
      .update({ itoken_balance: newBalance })
      .eq('id', id);

    if (!error) {
      setUser({ ...user, itoken_balance: newBalance });
      toast({ 
        title: "Session Updated", 
        description: `Successfully modified credits by ${type === 'ADD' ? '+' : '-'}₹${value}` 
      });
      setAmount('');
    } else {
      toast({ variant: "destructive", title: "Sync Failed" });
    }
    setProcessing(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white animate-slide-up pb-24 font-sans select-none text-slate-900">
      <header className="bg-white px-6 py-5 flex items-center justify-between sticky top-0 z-30 border-b border-slate-50">
        <div className="flex items-center gap-5">
          <button 
            onClick={() => router.push('/admin')}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-100 hover:bg-slate-50 transition-all active:scale-90"
          >
            <ChevronLeft className="h-5 w-5 text-slate-950" />
          </button>
          <div>
            <h1 className="text-[16px] font-black text-slate-950 uppercase tracking-tight leading-none mb-1">Node Profile</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {user.numeric_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
           <div className={cn("w-2.5 h-2.5 rounded-full shadow-sm", user.status === 'suspicious' ? "bg-red-600 animate-pulse" : "bg-emerald-500")} />
           <span className={cn("text-[11px] font-black uppercase tracking-wider", user.status === 'suspicious' ? "text-red-600" : "text-emerald-600")}>
             {user.status === 'suspicious' ? 'Security Alert' : 'Verified Node'}
           </span>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full">
        {/* Profile Card - Stark Contrast */}
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <Avatar className="h-32 w-32 border-4 border-white shadow-md">
              <AvatarImage src={`https://picsum.photos/seed/${user.id}/300`} />
              <AvatarFallback className="bg-slate-100 text-slate-900 font-black text-3xl uppercase">U</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-5">
              <div>
                <h2 className="text-4xl font-black text-slate-950 tracking-tighter mb-1.5">{user.phone}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <div className="bg-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest flex gap-2 items-center">
                    <Activity className="h-3.5 w-3.5" /> Node System Active
                  </div>
                  <div className="bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">Node Level 4.0</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-sm">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Sessions</span>
                  <p className="text-2xl font-black text-slate-950 tracking-tight">{user.total_logins}</p>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unique IPs</span>
                  <p className={cn("text-2xl font-black tracking-tight", (user.unique_ips || 1) > 3 ? "text-red-600" : "text-slate-950")}>
                    {user.unique_ips || 1} Nodes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Credit Management Column */}
          <div className="space-y-8">
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-slate-950 rounded-2xl flex items-center justify-center">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-950">Vault Balance</h3>
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current IToken Credits</span>
                <div className="flex items-center gap-3">
                  <span className="text-5xl font-black text-slate-950 tracking-tighter">₹{(user.itoken_balance || 0).toFixed(2)}</span>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center">
                    <ArrowUpRight className="h-4 w-4 text-slate-300" />
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="relative">
                   <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">₹</span>
                   <Input 
                    placeholder="0.00" 
                    type="number"
                    className="pl-12 h-16 bg-slate-50/80 border-none rounded-[24px] text-2xl font-black text-slate-950 focus-visible:ring-2 focus-visible:ring-slate-100 placeholder:text-slate-300"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleUpdateBalance('ADD')}
                    disabled={processing}
                    className="h-16 rounded-[24px] bg-slate-950 hover:bg-black text-white font-black uppercase tracking-widest gap-2 shadow-md active:scale-95 transition-all border-none"
                  >
                    <PlusCircle className="h-5 w-5" /> Add
                  </Button>
                  <Button 
                    onClick={() => handleUpdateBalance('DEDUCT')}
                    disabled={processing}
                    className="h-16 rounded-[24px] bg-slate-50 hover:bg-slate-100 text-slate-600 font-black uppercase tracking-widest gap-2 active:scale-95 transition-all border-none"
                  >
                    <MinusCircle className="h-5 w-5" /> Deduct
                  </Button>
                </div>
              </div>
            </div>

            {/* Trace Info Card */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  <Activity className="h-5 w-5 text-slate-950" />
                </div>
                <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-950">Network Trace</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[24px] border border-slate-50/50">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Active Gateway (IP)</span>
                  <span className="text-[15px] font-mono font-black text-slate-950">{user.last_ip || '---'}</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[24px] border border-slate-50/50">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Node Timestamp</span>
                  <span className="text-[14px] font-black text-slate-950">{new Date(user.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Identity & Logs Column */}
          <div className="space-y-8">
            {/* Identity Card */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-950" />
                </div>
                <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-950">Settlement Identity</h3>
              </div>

              {user.kyc_data ? (
                <div className="space-y-6">
                  <div className="p-6 bg-slate-950 rounded-[24px] flex flex-col gap-1.5 shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Primary Partner</span>
                    <span className="text-[18px] font-black text-white uppercase tracking-tight">{user.kyc_data.partner}</span>
                  </div>
                  <div className="space-y-5 px-1">
                    <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Gateway Name</span>
                      <span className="text-[14px] font-black text-slate-950">{user.kyc_data.name}</span>
                    </div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-50">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">UPI Address</span>
                      <span className="text-[14px] font-black text-slate-950 font-mono">{user.kyc_data.upi_no}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-500 uppercase">Auth Mobile</span>
                      <span className="text-[14px] font-black text-slate-950">{user.kyc_data.linked_mobile}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-50 rounded-[32px] border border-dashed border-slate-100">
                  <AlertCircle className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No verified gateway linked</p>
                </div>
              )}
            </div>

            {/* Logs List */}
            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                  <History className="h-5 w-5 text-slate-950" />
                </div>
                <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-950">Session Logs</h3>
              </div>

              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-5 hover:bg-slate-50 transition-colors rounded-[24px] border border-transparent hover:border-slate-100 group">
                      <div className="flex items-center gap-4">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shadow-sm", tx.type === 'buy' ? "bg-slate-950 text-white" : "bg-white text-slate-400 border border-slate-100")}>
                          {tx.type === 'buy' ? <ArrowDownLeft className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[12px] font-black text-slate-950 uppercase tracking-tight">{tx.type === 'buy' ? 'Credit Buy' : 'Credit Sell'}</span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">{new Date(tx.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("text-[15px] font-black block", tx.type === 'buy' ? "text-emerald-600" : "text-red-600")}>
                          {tx.type === 'buy' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                        </span>
                        <span className="text-[9px] font-black text-slate-400 uppercase">Successful</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <History className="h-8 w-8 text-slate-100 mx-auto mb-2" />
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No session history</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto py-16 text-center px-6">
        <div className="inline-flex items-center gap-2.5 bg-slate-50 px-6 py-2.5 rounded-full border border-slate-100">
           <ShieldCheck className="h-4 w-4 text-slate-400" />
           <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Security Level 4 Authorization Active</p>
        </div>
      </footer>
    </div>
  );
}
