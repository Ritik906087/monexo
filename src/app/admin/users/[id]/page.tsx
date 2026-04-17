
"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Wallet, 
  PlusCircle, 
  MinusCircle, 
  ShieldCheck, 
  ShieldAlert,
  Link as LinkIcon,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  History,
  Activity,
  MoreVertical,
  ChevronRight,
  User
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
    if (!amount || isNaN(Number(amount))) {
      toast({ title: "Invalid Input", variant: "destructive" });
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
    <div className="flex flex-col min-h-screen bg-white animate-slide-up pb-24 font-sans select-none">
      <header className="bg-white/80 backdrop-blur-xl px-6 py-5 flex items-center justify-between sticky top-0 z-30 border-b border-slate-50">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin')}
            className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-100 hover:bg-slate-50 active:scale-90 transition-all"
          >
            <ChevronLeft className="h-5 w-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-[14px] font-black text-slate-900 uppercase tracking-tight">Node Identity</h1>
            <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest">ID: {user.numeric_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
           <div className={cn("w-2 h-2 rounded-full", user.status === 'suspicious' ? "bg-red-500 animate-pulse" : "bg-emerald-500")} />
           <span className={cn("text-[10px] font-black uppercase tracking-wider", user.status === 'suspicious' ? "text-red-500" : "text-emerald-500")}>
             {user.status === 'suspicious' ? 'Security Alert' : 'Verified Node'}
           </span>
        </div>
      </header>

      <div className="p-4 md:p-8 space-y-8 max-w-[1200px] mx-auto w-full">
        {/* Profile Card - Minimal White */}
        <div className="bg-white rounded-[40px] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-50 relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <Avatar className="h-28 w-28 border-4 border-white shadow-xl">
              <AvatarImage src={`https://picsum.photos/seed/${user.id}/300`} />
              <AvatarFallback className="bg-slate-100 text-slate-400 font-black text-2xl uppercase">U</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-3xl font-black text-slate-950 tracking-tighter mb-1">{user.phone}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <div className="bg-slate-50 px-3 py-1 rounded-full text-[9px] font-black text-slate-400 uppercase tracking-widest">Node Level 4</div>
                  <div className="bg-slate-900 px-3 py-1 rounded-full text-[9px] font-black text-white uppercase tracking-widest flex gap-1.5 items-center">
                    <Activity className="h-3 w-3" /> {user.device_type || 'Cloud'} Node Active
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-3xl border border-slate-50 shadow-sm">
                  <span className="text-[9px] font-black text-slate-300 uppercase block mb-1">Total Logs</span>
                  <span className="text-xl font-black text-slate-900">{user.total_logins}</span>
                </div>
                <div className="bg-white p-4 rounded-3xl border border-slate-50 shadow-sm">
                  <span className="text-[9px] font-black text-slate-300 uppercase block mb-1">Unique IPs</span>
                  <span className={cn("text-xl font-black", (user.unique_ips || 1) > 3 ? "text-red-500" : "text-slate-900")}>
                    {user.unique_ips || 1} Nodes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Balance Control Card */}
          <div className="space-y-8">
            <div className="bg-white rounded-[40px] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-50 space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-950 rounded-2xl flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-[13px] font-black uppercase tracking-tight text-slate-900">Vault Session</h3>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Available Credits</span>
                <div className="flex items-center gap-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">₹{(user.itoken_balance || 0).toFixed(2)}</span>
                  <ArrowUpRight className="h-5 w-5 text-slate-200" />
                </div>
              </div>

              <div className="space-y-4">
                <div className="relative">
                   <span className="absolute left-5 top-1/2 -translate-y-1/2 font-black text-slate-300 text-lg">₹</span>
                   <Input 
                    placeholder="0.00" 
                    type="number"
                    className="pl-10 h-16 bg-slate-50 border-none rounded-[24px] text-xl font-black text-slate-900 focus-visible:ring-1 focus-visible:ring-slate-200"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    onClick={() => handleUpdateBalance('ADD')}
                    disabled={processing}
                    className="h-16 rounded-[24px] bg-slate-900 hover:bg-black text-white font-black uppercase tracking-widest gap-2 shadow-none transition-all active:scale-95 border-none"
                  >
                    <PlusCircle className="h-4 w-4" /> Add
                  </Button>
                  <Button 
                    onClick={() => handleUpdateBalance('DEDUCT')}
                    disabled={processing}
                    className="h-16 rounded-[24px] bg-slate-50 hover:bg-slate-100 text-slate-500 font-black uppercase tracking-widest gap-2 transition-all active:scale-95 border-none"
                  >
                    <MinusCircle className="h-4 w-4" /> Deduct
                  </Button>
                </div>
              </div>
            </div>

            {/* Trace Info Card */}
            <div className="bg-white rounded-[40px] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.02)] border border-slate-50 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Activity className="h-4 w-4 text-slate-900" />
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-tight text-slate-900">Network Trace</h3>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px]">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Access Point (IP)</span>
                  <span className="text-[14px] font-mono font-black text-slate-700">{user.last_ip || '---'}</span>
                </div>
                <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px]">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tight">Last Activity</span>
                  <span className="text-[13px] font-black text-slate-700">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity & Identity Column */}
          <div className="space-y-8">
            {/* Identity Card */}
            <div className="bg-white rounded-[40px] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.02)] border border-slate-50 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                  <User className="h-4 w-4 text-slate-900" />
                </div>
                <h3 className="text-[13px] font-black uppercase tracking-tight text-slate-900">Partner Entity (KYC)</h3>
              </div>

              {user.kyc_data ? (
                <div className="space-y-5">
                  <div className="p-5 bg-slate-50 rounded-[24px] flex flex-col gap-1">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">Authorized Gateway</span>
                    <span className="text-[15px] font-black text-slate-800 uppercase tracking-tight">{user.kyc_data.partner}</span>
                  </div>
                  <div className="space-y-4 px-1">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Entity Name</span>
                      <span className="text-[13px] font-black text-slate-800">{user.kyc_data.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Network UPI</span>
                      <span className="text-[13px] font-black text-slate-800">{user.kyc_data.upi_no}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Linked Phone</span>
                      <span className="text-[13px] font-black text-slate-800">{user.kyc_data.linked_mobile}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-16 text-center bg-slate-50/50 rounded-[32px] border border-dashed border-slate-100">
                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No verified identity node</p>
                </div>
              )}
            </div>

            {/* Logs List */}
            <div className="bg-white rounded-[40px] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-50 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                    <History className="h-4 w-4 text-slate-900" />
                  </div>
                  <h3 className="text-[13px] font-black uppercase tracking-tight text-slate-900">Activity Logs</h3>
                </div>
              </div>

              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors rounded-[24px] group">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", tx.type === 'buy' ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400")}>
                          {tx.type === 'buy' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight">{tx.type === 'buy' ? 'Purchase' : 'Withdrawal'}</span>
                          <span className="text-[8px] font-bold text-slate-300 uppercase">{new Date(tx.created_at).toLocaleDateString()} Node</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("text-[14px] font-black block", tx.type === 'buy' ? "text-slate-900" : "text-slate-400")}>
                          {tx.type === 'buy' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                        </span>
                        <span className="text-[8px] font-black text-slate-300 uppercase">Success</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <span className="text-[10px] font-black text-slate-200 uppercase tracking-widest">No activity recorded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-auto py-12 text-center px-6">
        <div className="inline-flex items-center gap-2 bg-slate-50 px-5 py-2 rounded-full border border-slate-100">
           <div className="w-1 h-1 rounded-full bg-slate-300 animate-pulse" />
           <p className="text-[9px] font-black text-slate-400 tracking-[0.2em] uppercase">Authorized Security Level 4 System Active</p>
        </div>
      </footer>
    </div>
  );
}
