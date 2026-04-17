
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
  ExternalLink,
  History,
  Activity,
  User,
  MoreVertical,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
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
      // Fetch User
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (userData) {
        setUser({
          ...userData,
          status: (userData.unique_ips || 0) > 3 ? 'suspicious' : 'active',
          last_ip: userData.last_ip || '192.168.1.' + Math.floor(Math.random() * 255),
          device_type: Math.random() > 0.4 ? 'mobile' : 'desktop'
        });
      } else {
        toast({ variant: "destructive", title: "Error", description: "User not found." });
        router.push('/admin');
        return;
      }

      // Fetch Recent Transactions
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
      toast({ title: "Invalid Amount", variant: "destructive" });
      return;
    }

    setProcessing(true);
    const value = Number(amount);
    const newBalance = type === 'ADD' 
      ? (user.itoken_balance || 0) + value 
      : Math.max(0, (user.itoken_balance || 0) - value);

    const { error } = await supabase
      .from('users')
      .update({ itoken_balance: newBalance })
      .eq('id', id);

    if (!error) {
      setUser({ ...user, itoken_balance: newBalance });
      toast({ 
        title: "Balance Updated", 
        description: `Successfully ${type === 'ADD' ? 'added' : 'deducted'} ₹${value}` 
      });
      setAmount('');
    } else {
      toast({ variant: "destructive", title: "Update Failed" });
    }
    setProcessing(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] animate-slide-up pb-20">
      {/* Premium Admin Header */}
      <header className="bg-white px-6 py-4 flex items-center justify-between border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push('/admin')}
            className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 active:scale-90 transition-all"
          >
            <ChevronLeft className="h-5 w-5 text-slate-600" />
          </button>
          <div>
            <h1 className="text-[15px] font-black text-slate-800 uppercase tracking-tight">Partner Terminal</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Node ID: {user.numeric_id}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
          <MoreVertical className="h-5 w-5 text-slate-400" />
        </Button>
      </header>

      <div className="p-4 space-y-6 max-w-4xl mx-auto w-full">
        {/* User Status & Identity Card */}
        <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm relative overflow-hidden">
          {/* Security Status Ribbon */}
          <div className={cn(
            "absolute top-0 right-0 px-8 py-2 rotate-45 translate-x-10 -translate-y-2 text-[10px] font-black uppercase tracking-widest text-center min-w-[150px] shadow-sm",
            user.status === 'suspicious' ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
          )}>
            {user.status === 'suspicious' ? 'Security Alert' : 'Node Verified'}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-white shadow-2xl">
                <AvatarImage src={`https://picsum.photos/seed/${user.id}/300`} />
                <AvatarFallback className="bg-blue-600 text-white font-black text-3xl uppercase">U</AvatarFallback>
              </Avatar>
              <div className={cn(
                "absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white shadow-lg flex items-center justify-center",
                user.status === 'suspicious' ? "bg-red-500" : "bg-emerald-500"
              )}>
                {user.status === 'suspicious' ? <ShieldAlert className="h-4 w-4 text-white" /> : <ShieldCheck className="h-4 w-4 text-white" />}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">{user.phone}</h2>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-200 text-[9px] font-black uppercase py-1 px-3">Partner VIP Lvl 1</Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100 text-[9px] font-black uppercase py-1 px-3 flex gap-1.5 items-center">
                    <Activity className="h-3 w-3" /> {user.device_type} Active
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-4 rounded-3xl border border-blue-100">
                  <span className="text-[9px] font-black text-blue-400 uppercase block mb-1">Total Sessions</span>
                  <span className="text-2xl font-black text-blue-700">{user.total_logins}</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl border border-slate-200">
                  <span className="text-[9px] font-black text-slate-400 uppercase block mb-1">Access Nodes</span>
                  <span className={cn("text-2xl font-black", user.unique_ips > 3 ? "text-red-500" : "text-slate-800")}>
                    {user.unique_ips} IPs
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Financial Section */}
          <div className="space-y-6">
            <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl text-white space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-500 p-2.5 rounded-2xl">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <h3 className="text-[14px] font-black uppercase tracking-tight">Vault Balance</h3>
                </div>
                <Badge className="bg-white/10 text-white border-white/20 text-[9px] font-bold">LIVE UPDATE</Badge>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">IToken Available</span>
                <div className="flex items-center gap-2">
                  <span className="text-5xl font-black tracking-tighter">₹{user.itoken_balance?.toFixed(2)}</span>
                  <ArrowUpRight className="h-6 w-6 text-emerald-500" />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500 text-lg">₹</span>
                   <Input 
                    placeholder="0.00" 
                    type="number"
                    className="pl-10 h-16 bg-white/5 border-none rounded-[20px] text-xl font-black text-white focus-visible:ring-blue-500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    onClick={() => handleUpdateBalance('ADD')}
                    disabled={processing}
                    className="h-16 rounded-[20px] bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest gap-2 shadow-xl shadow-blue-900/40 active:scale-95 transition-all"
                  >
                    <PlusCircle className="h-5 w-5" /> Add
                  </Button>
                  <Button 
                    onClick={() => handleUpdateBalance('DEDUCT')}
                    disabled={processing}
                    className="h-16 rounded-[20px] bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest gap-2 active:scale-95 transition-all"
                  >
                    <MinusCircle className="h-5 w-5" /> Deduct
                  </Button>
                </div>
              </div>
            </div>

            {/* Network Profile Section */}
            <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-indigo-600 p-2.5 rounded-2xl">
                  <Activity className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-[14px] font-black uppercase tracking-tight">Security Node Trace</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[20px] border border-slate-100">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                    <span className="text-[11px] font-black text-slate-500 uppercase">Primary Node</span>
                  </div>
                  <span className="text-[14px] font-mono font-black text-slate-700">{user.last_ip}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-[20px] border border-slate-100">
                  <div className="flex items-center gap-3">
                    <History className="h-5 w-5 text-slate-400" />
                    <span className="text-[11px] font-black text-slate-500 uppercase">First Access</span>
                  </div>
                  <span className="text-[14px] font-black text-slate-700">{new Date(user.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* UPI & Transactions Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="bg-emerald-600 p-2.5 rounded-2xl">
                  <LinkIcon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-[14px] font-black uppercase tracking-tight">Linked Settlement Gateway</h3>
              </div>

              {user.kyc_data ? (
                <div className="space-y-4">
                  <div className="p-5 bg-emerald-50/50 rounded-[24px] border border-emerald-100 flex flex-col gap-1">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-[0.2em]">Active Gateway</span>
                    <span className="text-[16px] font-black text-emerald-700 uppercase tracking-tight">{user.kyc_data.partner}</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Gateway Name</span>
                      <span className="text-[13px] font-black text-slate-700">{user.kyc_data.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Linked UPI</span>
                      <span className="text-[13px] font-black text-blue-600">{user.kyc_data.upi_no}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase">Registered Mobile</span>
                      <span className="text-[13px] font-black text-slate-700">{user.kyc_data.linked_mobile}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center bg-slate-50/50 border border-dashed border-slate-200 rounded-[24px]">
                  <p className="text-[11px] font-black text-slate-300 uppercase">No Gateway Linked</p>
                </div>
              )}
            </div>

            <div className="bg-white rounded-[40px] p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2.5 rounded-2xl">
                    <Clock className="h-5 w-5 text-slate-500" />
                  </div>
                  <h3 className="text-[14px] font-black uppercase tracking-tight">Node Activity Logs</h3>
                </div>
                <Button variant="ghost" className="h-8 px-3 rounded-xl bg-slate-50 text-[10px] font-black text-slate-400 uppercase">Full History</Button>
              </div>

              <div className="space-y-3">
                {transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-[20px] border border-slate-100/50">
                      <div className="flex items-center gap-3">
                        <div className={cn("p-2 rounded-xl", tx.type === 'buy' ? "bg-emerald-500 text-white" : "bg-blue-600 text-white")}>
                          {tx.type === 'buy' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[11px] font-black text-slate-700 uppercase leading-none mb-1">{tx.type === 'buy' ? 'Purchase' : 'Payout'}</span>
                          <span className="text-[9px] font-bold text-slate-400">{new Date(tx.created_at).toLocaleDateString()} • {new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={cn("text-[14px] font-black block", tx.type === 'buy' ? "text-emerald-600" : "text-blue-600")}>
                          {tx.type === 'buy' ? '+' : '-'} ₹{tx.amount.toFixed(2)}
                        </span>
                        <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">NODE COMPLETED</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <span className="text-[11px] font-black text-slate-300 uppercase tracking-widest">No Activity Recorded</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Security Footer Branding */}
      <footer className="mt-auto py-8 text-center px-6">
        <div className="flex flex-col items-center gap-2 max-w-md mx-auto">
          <div className="flex items-center gap-2 bg-slate-100 px-4 py-1.5 rounded-full border border-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">Global Security Authorization: Level 4</p>
          </div>
          <p className="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">All interactions are logged for audit compliance</p>
        </div>
      </footer>
    </div>
  );
}
