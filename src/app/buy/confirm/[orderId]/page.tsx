
"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Clock, 
  AlertCircle, 
  Copy, 
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Info,
  Globe,
  Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

const EXPIRY_MINUTES = 10;

export default function OrderConfirmPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [adminPayments, setAdminPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .or(`id.eq."${orderId}",order_id.eq."${orderId}"`)
          .maybeSingle();

        if (orderError) throw orderError;
        if (!orderData) {
          toast({ variant: "destructive", title: "Order Not Found" });
          router.push('/buy');
          return;
        }
        setOrder(orderData);

        // Fetch Admin Payment Methods
        const { data: payData } = await supabase
          .from('admin_payment_methods')
          .select('*')
          .eq('is_active', true);
        
        if (payData) setAdminPayments(payData);

        // Initial Timer Calculation
        const createdAt = new Date(orderData.created_at).getTime();
        const now = new Date().getTime();
        const diffSeconds = Math.floor((now - createdAt) / 1000);
        const remaining = Math.max(0, (EXPIRY_MINUTES * 60) - diffSeconds);
        
        if (remaining <= 0) setIsExpired(true);
        setTimeLeft(remaining);

      } catch (err: any) {
        toast({ variant: "destructive", title: "Error", description: "Could not load data." });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [orderId, router, toast]);

  // Timer Effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isExpired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setIsExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isExpired]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Detail copied to clipboard." });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full bg-[#f8fafc]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  const upiMethod = adminPayments.find(p => p.type === 'UPI');
  const usdtMethod = adminPayments.find(p => p.type === 'USDT');

  return (
    <div className="flex flex-col min-h-screen bg-[#f8fafc] animate-slide-up relative">
      <div className="bg-white p-4 flex items-center justify-between border-b sticky top-0 z-10">
        <button onClick={() => router.back()} className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center">
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-sm font-black uppercase tracking-tight text-slate-800">Order Confirmation</h1>
        <div className="w-9" />
      </div>

      <div className="flex-1 p-4 space-y-4 pb-24">
        {/* Timer Banner */}
        <div className={cn(
          "rounded-3xl p-6 text-white relative overflow-hidden shadow-lg transition-all duration-500",
          isExpired ? "bg-slate-400 shadow-slate-100" : "bg-blue-600 shadow-blue-200"
        )}>
           <div className="absolute top-0 right-0 p-4 opacity-10">
             <ShieldCheck className="h-20 w-20" />
           </div>
           <div className="relative z-10 flex flex-col items-center text-center">
              <Clock className={cn("h-8 w-8 mb-2", !isExpired && "animate-pulse")} />
              <h2 className="text-xl font-black uppercase tracking-tight">
                {isExpired ? "Order Expired" : "Waiting for Payment"}
              </h2>
              <p className="text-[11px] font-bold text-blue-100 mt-1 uppercase">
                {isExpired 
                  ? "This session has timed out." 
                  : `Please complete within ${formatTime(timeLeft || 0)} minutes`
                }
              </p>
           </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
           <div className="flex items-center gap-2 mb-3">
             <Info className="h-4 w-4 text-blue-500" />
             <h3 className="text-[12px] font-black text-slate-800 uppercase">P2P खरीदारी निर्देश</h3>
           </div>
           <p className="text-[11px] font-bold text-slate-500 leading-relaxed italic">
             "यह एक सुरक्षित Money Rotation System है। आपका भुगतान सीधे किसी दूसरे उपयोगकर्ता को भेजा जाएगा जो अपना LGB बेच रहा है।"
           </p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm space-y-4">
           <div className="flex justify-between items-center pb-3 border-b border-slate-50">
             <span className="text-[11px] font-bold text-slate-400 uppercase">Order ID</span>
             <span className="text-[13px] font-black text-slate-800">{order?.order_id}</span>
           </div>
           <div className="flex justify-between items-center">
             <span className="text-[11px] font-bold text-slate-400 uppercase">Payable Amount</span>
             {isExpired ? (
               <span className="text-[13px] font-black text-slate-300 uppercase italic">Timed Out</span>
             ) : (
               <span className="text-2xl font-black text-red-500 tracking-tighter">₹{order?.amount}</span>
             )}
           </div>
        </div>

        {/* Payment Methods */}
        {!isExpired && upiMethod && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 animate-in fade-in duration-500">
             <div className="flex items-center gap-2 mb-1">
               <CreditCard className="h-4 w-4 text-blue-500" />
               <h3 className="text-[13px] font-black text-slate-800 uppercase">UPI Payment</h3>
             </div>

             <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
                  <span className="text-[9px] font-black text-slate-300 uppercase absolute top-2 left-4">UPI ID</span>
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-[14px] font-black text-slate-700">{upiMethod.details}</span>
                    <button onClick={() => handleCopy(upiMethod.details)} className="p-2 hover:bg-white rounded-xl transition-all">
                      <Copy className="h-4 w-4 text-blue-500" />
                    </button>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative group">
                  <span className="text-[9px] font-black text-slate-300 uppercase absolute top-2 left-4">Account Name</span>
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-[14px] font-black text-slate-700 uppercase">{upiMethod.account_name || 'Merchant'}</span>
                  </div>
                </div>
             </div>
          </div>
        )}

        {!isExpired && usdtMethod && (
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-5 animate-in fade-in duration-500">
             <div className="flex items-center gap-2 mb-1">
               <Globe className="h-4 w-4 text-emerald-500" />
               <h3 className="text-[13px] font-black text-slate-800 uppercase">USDT Payment</h3>
             </div>

             <div className="space-y-4">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100 relative group">
                  <span className="text-[9px] font-black text-emerald-300 uppercase absolute top-2 left-4">USDT Address (TRC20)</span>
                  <div className="flex items-center justify-between pt-3">
                    <span className="text-[12px] font-black text-emerald-800 truncate pr-4">{usdtMethod.details}</span>
                    <button onClick={() => handleCopy(usdtMethod.details)} className="p-2 hover:bg-white rounded-xl transition-all">
                      <Copy className="h-4 w-4 text-emerald-500" />
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}

        <div className="pt-2">
           <Button 
            disabled={isExpired}
            className={cn(
              "w-full h-14 text-white rounded-2xl font-black uppercase tracking-widest transition-all border-none",
              isExpired ? "bg-slate-300 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-100 active:scale-[0.98]"
            )}
           >
             {isExpired ? "Expired" : "I Have Paid"}
             <CheckCircle2 className="ml-2 h-5 w-5" />
           </Button>
           <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase">
             Security Level 4 Encryption Active
           </p>
        </div>
      </div>

      {/* Floating Support */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <button className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shadow-lg border border-blue-100 active:scale-90 transition-all">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-300 to-indigo-500 flex items-center justify-center">
            <Headphones className="h-5 w-5 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}
