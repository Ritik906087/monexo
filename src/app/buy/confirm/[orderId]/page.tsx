
"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Clock, 
  AlertCircle, 
  Copy, 
  CheckCircle2,
  Phone,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Info,
  Loader
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

export default function OrderConfirmPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchOrder() {
      try {
        // Find by either UUID (id) or Display ID (order_id)
        const { data, error } = await supabase
          .from('orders')
          .select('*')
          .or(`id.eq."${orderId}",order_id.eq."${orderId}"`)
          .maybeSingle();

        if (error) {
           console.error("Order search error:", error);
           throw error;
        }
        
        if (!data) {
          toast({ variant: "destructive", title: "Order Not Found", description: "This order does not exist." });
          router.push('/buy');
          return;
        }

        setOrder(data);
      } catch (err: any) {
        console.error("Fetch error details:", err);
        toast({ variant: "destructive", title: "Error", description: "Could not load order details." });
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId, router, toast]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Detail copied to clipboard." });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] animate-slide-up">
      <div className="bg-white p-4 flex items-center justify-between border-b sticky top-0 z-10">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center">
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-sm font-black uppercase tracking-tight text-slate-800">Order Confirmation</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 p-4 space-y-4 pb-24">
        <div className="bg-blue-600 rounded-3xl p-6 text-white relative overflow-hidden shadow-lg shadow-blue-200">
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <ShieldCheck className="h-20 w-20" />
           </div>
           <div className="relative z-10 flex flex-col items-center text-center">
              <Clock className="h-8 w-8 mb-2 animate-pulse" />
              <h2 className="text-xl font-black uppercase tracking-tight">Waiting for Payment</h2>
              <p className="text-[11px] font-bold text-blue-100 mt-1 uppercase">Please complete within 15:00 minutes</p>
           </div>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2 mb-3">
             <Info className="h-4 w-4 text-blue-500" />
             <h3 className="text-[12px] font-black text-slate-800 uppercase">P2P खरीदारी निर्देश</h3>
           </div>
           <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
             "यह एक सुरक्षित Money Rotation System है। आपका भुगतान सीधे किसी दूसरे उपयोगकर्ता को भेजा जाएगा जो अपना LGB बेच रहा है।"
           </p>
        </div>

        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
           <div className="flex justify-between items-center pb-3 border-b border-slate-50">
             <span className="text-[11px] font-bold text-slate-400 uppercase">Order ID</span>
             <span className="text-[13px] font-black text-slate-800">{order?.order_id}</span>
           </div>
           <div className="flex justify-between items-center">
             <span className="text-[11px] font-bold text-slate-400 uppercase">Payable Amount</span>
             <span className="text-2xl font-black text-red-500 tracking-tighter">₹{order?.amount}</span>
           </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5">
           <div className="flex items-center gap-2 mb-1">
             <CreditCard className="h-4 w-4 text-blue-500" />
             <h3 className="text-[13px] font-black text-slate-800 uppercase">Payment Details</h3>
           </div>

           <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
                <span className="text-[9px] font-black text-slate-300 uppercase absolute top-2 left-4">UPI ID</span>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-[14px] font-black text-slate-700">monexo@upi</span>
                  <button onClick={() => handleCopy('monexo@upi')} className="p-2 hover:bg-white rounded-xl transition-all">
                    <Copy className="h-4 w-4 text-blue-500" />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
                <span className="text-[9px] font-black text-slate-300 uppercase absolute top-2 left-4">Account Name</span>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-[14px] font-black text-slate-700 uppercase">Monexo Merchant</span>
                </div>
              </div>
           </div>
        </div>

        <div className="pt-2">
           <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-100 active:scale-[0.98] transition-all">
             I Have Paid
             <CheckCircle2 className="ml-2 h-5 w-5" />
           </Button>
           <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase">
             Security Level 4 Encryption Active
           </p>
        </div>
      </div>
    </div>
  );
}
