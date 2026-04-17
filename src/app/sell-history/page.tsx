
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ArrowUpRight, History } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function SellHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchHistory() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('type', 'sell')
        .order('created_at', { ascending: false });

      if (data) setOrders(data);
      setLoading(false);
    }
    fetchHistory();
  }, []);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] animate-slide-up overflow-hidden">
      <div className="bg-white pt-4 pb-4 px-4 text-center border-b border-slate-100 shrink-0 relative">
        <button onClick={() => router.back()} className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center active:scale-90 transition-all border border-slate-100">
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-[16px] font-black text-[#1e293b] uppercase tracking-widest">Sell History</h1>
      </div>

      <div className="flex-1 overflow-y-auto smooth-scroll p-4 space-y-3">
        {loading ? (
          <div className="flex justify-center py-10"><div className="animate-spin h-6 w-6 border-b-2 border-orange-500 rounded-full" /></div>
        ) : orders.length > 0 ? (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-orange-50 p-2.5 rounded-xl">
                  <ArrowUpRight className="h-4 w-4 text-orange-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[12px] font-black text-slate-700 uppercase">UPI Withdrawal</span>
                  <span className="text-[9px] font-bold text-slate-400">{new Date(order.created_at).toLocaleString()}</span>
                </div>
              </div>
              <div className="text-right flex flex-col">
                <span className="text-[13px] font-black text-red-600">-₹{order.amount}</span>
                <span className="text-[8px] font-black text-slate-300 uppercase">ID: {order.order_id}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center space-y-4 opacity-60 py-20">
            <History className="h-10 w-10 text-orange-400" />
            <p className="text-[11px] font-bold text-slate-400 uppercase">No Sell Records Found</p>
          </div>
        )}
      </div>
    </div>
  );
}
