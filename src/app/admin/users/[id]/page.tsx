
"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Wallet, 
  PlusCircle, 
  MinusCircle, 
  ShieldCheck, 
  Phone, 
  Key,
  Link as LinkIcon,
  Clock,
  ArrowUpRight,
  ArrowDownLeft,
  Smartphone,
  ExternalLink
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
      // Fetch User
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();

      if (userData) {
        setUser(userData);
      } else {
        toast({ variant: "destructive", title: "Error", description: "User not found." });
        router.push('/admin');
        return;
      }

      // Fetch Recent Transactions for this user
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
    <div className="flex items-center justify-center h-full bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] animate-slide-up overflow-hidden">
      {/* Premium Header */}
      <div className="bg-white px-6 py-4 flex items-center gap-4 border-b border-slate-100 shrink-0 relative shadow-sm">
        <button 
          onClick={() => router.back()}
          className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center active:scale-90 transition-all border border-slate-100"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">User Management</h1>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control Panel v2.0</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto smooth-scroll p-4 pb-24 space-y-4">
        {/* User Profile Card */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4">
             <div className="bg-blue-50 text-blue-600 text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest border border-blue-100">Partner User</div>
          </div>
          
          <div className="relative mb-4">
            <Avatar className="h-20 w-20 border-4 border-white shadow-xl">
              <AvatarImage src={`https://picsum.photos/seed/${user.id}/200`} />
              <AvatarFallback className="bg-blue-600 text-white font-black text-xl">U</AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-white"></div>
          </div>
          
          <h2 className="text-[18px] font-black text-slate-800 mb-1">{user.phone}</h2>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-50 px-2 py-0.5 rounded">UID: {user.numeric_id}</span>
          </div>

          <div className="w-full grid grid-cols-2 gap-3 pt-6 border-t border-slate-50">
            <div className="flex flex-col items-center p-3 bg-blue-50/30 rounded-2xl">
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-tighter mb-1">Current Balance</span>
              <span className="text-[18px] font-black text-blue-600">₹{user.itoken_balance?.toFixed(2)}</span>
            </div>
            <div className="flex flex-col items-center p-3 bg-emerald-50/30 rounded-2xl">
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-tighter mb-1">Today Profit</span>
              <span className="text-[18px] font-black text-emerald-500">₹{user.today_profit?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Linked UPI Details (The "Mast UI" Part) */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm space-y-4 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-50 rounded-full opacity-20 blur-3xl"></div>
          
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <div className="p-1.5 bg-blue-600 rounded-lg">
              <LinkIcon className="h-3.5 w-3.5 text-white" />
            </div>
            <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-tight">Linked UPI Identity</h3>
          </div>
          
          {user.kyc_data ? (
            <div className="grid grid-cols-1 gap-3 relative z-10">
              <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100/50 flex flex-col gap-1">
                <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Authorization Partner</span>
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-black text-slate-700 uppercase">{user.kyc_data.partner || 'Standard Gateway'}</span>
                  <div className="bg-white px-2 py-0.5 rounded border border-slate-100">
                    <span className="text-[8px] font-bold text-blue-500 uppercase">Verified</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center justify-between p-3 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    < स्मार्टफोन className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Linked Mobile</span>
                  </div>
                  <span className="text-[12px] font-black text-slate-700">{user.kyc_data.linked_mobile || user.phone}</span>
                </div>
                
                <div className="flex items-center justify-between p-3 border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Account Name</span>
                  </div>
                  <span className="text-[12px] font-black text-slate-700">{user.kyc_data.name || 'Not Specified'}</span>
                </div>

                <div className="flex items-center justify-between p-3">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-3.5 w-3.5 text-blue-400" />
                    <span className="text-[11px] font-bold text-slate-400 uppercase">UPI Address</span>
                  </div>
                  <span className="text-[12px] font-black text-blue-600">{user.kyc_data.upi_no || 'Not Linked'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-[10px] font-black text-slate-300 uppercase">No UPI Identity Linked Yet</p>
            </div>
          )}
        </div>

        {/* Balance Management */}
        <div className="bg-slate-900 rounded-[32px] p-6 shadow-2xl space-y-5">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-4 w-4 text-blue-500" />
            <h3 className="text-[13px] font-black text-white uppercase tracking-tight">Financial Adjustment</h3>
          </div>

          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-500">₹</span>
            <Input 
              placeholder="0.00" 
              type="number"
              className="pl-8 h-14 bg-white/5 border-none rounded-2xl text-[16px] font-black text-white focus-visible:ring-blue-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => handleUpdateBalance('ADD')}
              disabled={processing}
              className="h-14 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest gap-2 shadow-lg shadow-blue-900/40 border-none transition-all active:scale-95"
            >
              <PlusCircle className="h-4 w-4" /> Add
            </Button>
            <Button 
              onClick={() => handleUpdateBalance('DEDUCT')}
              disabled={processing}
              className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest gap-2 border-none transition-all active:scale-95"
            >
              <MinusCircle className="h-4 w-4" /> Deduct
            </Button>
          </div>
        </div>

        {/* Real Transaction History */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-5">
             <h3 className="text-[13px] font-black text-slate-800 uppercase tracking-tight">Recent Activity Log</h3>
             <Clock className="h-4 w-4 text-slate-300" />
          </div>
          
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between p-3.5 bg-slate-50/50 rounded-2xl border border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-xl shadow-sm", tx.type === 'buy' ? "bg-emerald-500 text-white" : "bg-blue-600 text-white")}>
                      {tx.type === 'buy' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[11px] font-black text-slate-700 uppercase leading-none mb-1">{tx.type === 'buy' ? 'Token Purchase' : 'UPI Settlement'}</span>
                      <span className="text-[9px] font-bold text-slate-400 tracking-tighter">{new Date(tx.created_at).toLocaleDateString()} • {new Date(tx.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className={cn("text-[13px] font-black", tx.type === 'buy' ? "text-emerald-600" : "text-blue-600")}>
                      {tx.type === 'buy' ? '+' : '-'} ₹{tx.amount.toFixed(2)}
                    </span>
                    <span className="text-[8px] font-bold text-slate-300 uppercase tracking-tighter">SUCCESS</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-6 w-6 text-slate-200" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No Activity Records Found</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="bg-white py-4 text-center border-t border-slate-50 shrink-0">
        <div className="flex items-center justify-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
          <p className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Security Level 4 Authorization Active</p>
        </div>
      </div>
    </div>
  );
}
