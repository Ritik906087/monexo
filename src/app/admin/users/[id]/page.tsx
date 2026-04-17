
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
  AlertCircle,
  Copy,
  ExternalLink,
  Power,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

const PARTNER_LOGOS: Record<string, { logo: string, color: string, name: string }> = {
  'paytm-biz': { name: 'Paytm Business', color: 'bg-[#00baf2]', logo: 'https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(5).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDUpLnBuZyIsImlhdCI6MTc3NTE0ODYzMiwiZXhwIjoxODA2Njg0NjMyfQ.QXSbgSLV3ULTcV3ss9Co9ZMe1oj3tb9bR_OP8xY-Nds' },
  'phonepe-biz': { name: 'Phonepe Business', color: 'bg-[#5f259f]', logo: 'https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(4).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDQpLnBuZyIsImlhdCI6MTc3NTE0ODYyMSwiZXhwIjoxODA2Njg0NjIxfQ.b_cMHhiCw52krGt2edtt1k5C1Keo8uGJwYIWpe6vZVo' },
  'mobikwik': { name: 'Mobikwik', color: 'bg-[#002d72]', logo: 'https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDEpLnBuZyIsImlhdCI6MTc3NTE0ODU3MywiZXhwIjoxODA2Njg0NTczfQ.m8Z7gn5FV-0ss58kTEUZ833u8Wv_bFun3YZeZtyIa9s' },
  'paytm': { name: 'Paytm', color: 'bg-[#002970]', logo: 'https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(5).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDUpLnBuZyIsImlhdCI6MTc3NTE0ODYzMiwiZXhwIjoxODA2Njg0NjMyfQ.QXSbgSLV3ULTcV3ss9Co9ZMe1oj3tb9bR_OP8xY-Nds' },
  'phonepe': { name: 'Phonepe', color: 'bg-[#5f259f]', logo: 'https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(4).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDQpLnBuZyIsImlhdCI6MTc3NTE0ODYyMSwiZXhwIjoxODA2Njg0NjIxfQ.b_cMHhiCw52krGt2edtt1k5C1Keo8uGJwYIWpe6vZVo' },
  'freecharge': { name: 'Freecharge', color: 'bg-[#f04f23]', logo: 'https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDMpLnBuZyIsImlhdCI6MTc3NTE0ODYwOSwiZXhwIjoxODA2Njg0NjA5fQ.pus8pOlgEXCFb2pjIzNsVtU9DxnIxEeaVaeR3TuIQPc' }
};

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

  const handleCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} has been copied.`,
    });
  };

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

  const kycPartner = user?.kyc_data?.partner;
  const partnerConfig = kycPartner ? PARTNER_LOGOS[kycPartner] : null;

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
        <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50">
          <div className="flex flex-col md:flex-row items-center gap-10">
            <Avatar className="h-32 w-32 border-4 border-white shadow-md">
              <AvatarImage src={`https://picsum.photos/seed/${user.id}/300`} />
              <AvatarFallback className="bg-slate-100 text-slate-900 font-black text-3xl uppercase">U</AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left space-y-5">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3 group">
                  <h2 className="text-4xl font-black text-slate-950 tracking-tighter mb-1.5">{user.phone}</h2>
                  <button 
                    onClick={() => handleCopy(user.phone, 'Phone number')}
                    className="p-2 hover:bg-slate-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Copy className="h-5 w-5 text-slate-400" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                  <div className="bg-slate-950 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest flex gap-2 items-center">
                    <Activity className="h-3.5 w-3.5" /> Node System Active
                  </div>
                  <div 
                    onClick={() => handleCopy(user.numeric_id?.toString(), 'UID')}
                    className="bg-slate-50 border border-slate-100 px-4 py-1.5 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 cursor-pointer hover:bg-slate-100 transition-all"
                  >
                    UID: {user.numeric_id} <Copy className="h-3 w-3 text-slate-300" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto md:mx-0">
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

            <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    <ExternalLink className="h-5 w-5 text-slate-950" />
                  </div>
                  <h3 className="text-[14px] font-black uppercase tracking-tight text-slate-950">Settlement Gateway</h3>
                </div>
                {user.is_node_active !== undefined && (
                  <div className={cn(
                    "px-4 py-1.5 rounded-full flex items-center gap-2",
                    user.is_node_active ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                  )}>
                    {user.is_node_active ? <CheckCircle2 className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                    <span className="text-[10px] font-black uppercase tracking-widest">{user.is_node_active ? 'Active' : 'Stopped'}</span>
                  </div>
                )}
              </div>

              {user.kyc_data ? (
                <div className="space-y-6">
                  <div className={cn("p-6 rounded-[32px] flex items-center gap-4 shadow-lg border border-white/10", partnerConfig?.color || 'bg-slate-900')}>
                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center p-2 shadow-inner">
                      {partnerConfig?.logo ? (
                        <img src={partnerConfig.logo} alt={partnerConfig.name} className="w-full h-full object-contain" />
                      ) : (
                        <Smartphone className="h-8 w-8 text-slate-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-0.5">Authorization Partner</p>
                      <h4 className="text-xl font-black text-white uppercase tracking-tight">{partnerConfig?.name || user.kyc_data.partner}</h4>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                      <Power className={cn("h-5 w-5", user.is_node_active ? "text-emerald-400" : "text-red-400")} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px] border border-slate-50 group">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Gateway Name</span>
                        <p className="text-[14px] font-black text-slate-950 uppercase">{user.kyc_data.name}</p>
                      </div>
                      <ShieldCheck className="h-5 w-5 text-emerald-500 opacity-20" />
                    </div>

                    <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px] border border-slate-50 group">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">UPI ID</span>
                        <p className="text-[14px] font-mono font-black text-slate-950">{user.kyc_data.upi_no}</p>
                      </div>
                      <button 
                        onClick={() => handleCopy(user.kyc_data.upi_no, 'UPI ID')}
                        className="p-2 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
                      >
                        <Copy className="h-4 w-4 text-slate-400 hover:text-blue-500" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[24px] border border-slate-50 group">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Linked Mobile</span>
                        <p className="text-[14px] font-black text-slate-950">{user.kyc_data.linked_mobile}</p>
                      </div>
                      <button 
                        onClick={() => handleCopy(user.kyc_data.linked_mobile, 'Mobile number')}
                        className="p-2 hover:bg-white rounded-xl transition-all shadow-sm active:scale-90"
                      >
                        <Smartphone className="h-4 w-4 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-20 text-center bg-slate-50/50 rounded-[32px] border border-dashed border-slate-100">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <Power className="h-8 w-8 text-slate-200" />
                  </div>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">No verified gateway linked</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
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
                  <span className="text-[15px] font-mono font-black text-emerald-600">{user.last_ip || '---'}</span>
                </div>
                <div className="flex items-center justify-between p-6 bg-slate-50/50 rounded-[24px] border border-slate-50/50">
                  <span className="text-[11px] font-black text-slate-500 uppercase tracking-tight">Node Timestamp</span>
                  <span className="text-[14px] font-black text-slate-950">{new Date(user.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>

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
