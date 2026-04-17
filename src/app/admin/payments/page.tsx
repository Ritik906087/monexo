
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  CreditCard, 
  Smartphone, 
  Globe, 
  Save, 
  Plus, 
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newMethod, setNewMethod] = useState({ type: 'UPI', details: '', account_name: '' });
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdminAuthenticated');
    if (isAdmin !== 'true') {
      router.push('/admin/login');
      return;
    }
    fetchPayments();
  }, [router]);

  async function fetchPayments() {
    const { data, error } = await supabase
      .from('admin_payment_methods')
      .select('*')
      .order('created_at', { ascending: true });
    
    if (data) setPayments(data);
    setLoading(false);
  }

  const handleAddMethod = async () => {
    if (!newMethod.details) return;
    setSaving(true);
    const { error } = await supabase
      .from('admin_payment_methods')
      .insert([newMethod]);
    
    if (!error) {
      toast({ title: "Success", description: "Payment method added." });
      setNewMethod({ type: 'UPI', details: '', account_name: '' });
      fetchPayments();
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('admin_payment_methods')
      .delete()
      .eq('id', id);
    
    if (!error) {
      toast({ title: "Deleted", description: "Method removed successfully." });
      fetchPayments();
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans select-none text-slate-900">
      <header className="bg-white px-6 py-5 flex items-center gap-4 sticky top-0 z-30 border-b border-slate-50">
        <button onClick={() => router.push('/admin')} className="w-10 h-10 rounded-full flex items-center justify-center border border-slate-100 hover:bg-slate-50">
          <ChevronLeft className="h-5 w-5 text-slate-950" />
        </button>
        <div>
          <h1 className="text-[16px] font-black text-slate-950 uppercase tracking-tight leading-none mb-0.5">Payment Manager</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Global Gateway Settings</p>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8 max-w-[800px] mx-auto w-full">
        <section className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
              <Plus className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-[14px] font-black uppercase tracking-tight">Add Gateway</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Type</label>
              <select 
                value={newMethod.type}
                onChange={(e) => setNewMethod({...newMethod, type: e.target.value})}
                className="w-full h-12 bg-white border border-slate-100 rounded-xl px-4 text-sm font-bold focus:ring-1 focus:ring-slate-200 outline-none"
              >
                <option value="UPI">UPI ID</option>
                <option value="USDT">USDT Address</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Account Name</label>
              <Input 
                placeholder="Merchant Name"
                className="h-12 bg-white border-slate-100 rounded-xl font-bold"
                value={newMethod.account_name}
                onChange={(e) => setNewMethod({...newMethod, account_name: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Address / ID</label>
              <Input 
                placeholder="Enter UPI or USDT Details"
                className="h-12 bg-white border-slate-100 rounded-xl font-bold"
                value={newMethod.details}
                onChange={(e) => setNewMethod({...newMethod, details: e.target.value})}
              />
            </div>
          </div>
          <Button 
            onClick={handleAddMethod}
            disabled={saving}
            className="w-full h-12 bg-slate-900 hover:bg-black text-white rounded-xl font-black uppercase tracking-widest"
          >
            {saving ? "Processing..." : "Register Method"}
          </Button>
        </section>

        <section className="space-y-4">
          <h3 className="text-[12px] font-black text-slate-400 uppercase tracking-widest px-1">Active Gateways</h3>
          <div className="space-y-3">
            {payments.map((method) => (
              <div key={method.id} className="bg-white p-5 rounded-[24px] border border-slate-50 shadow-sm flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    method.type === 'UPI' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                  )}>
                    {method.type === 'UPI' ? <Smartphone className="h-6 w-6" /> : <Globe className="h-6 w-6" />}
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{method.type}</p>
                    <h4 className="text-[15px] font-black text-slate-950 leading-none mb-1">{method.details}</h4>
                    <p className="text-[11px] font-bold text-slate-500 uppercase">{method.account_name || 'Generic Merchant'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(method.id)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-red-100 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
