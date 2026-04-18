
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
  Headphones,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

const EXPIRY_MINUTES = 30;

export default function OrderConfirmPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [adminPayment, setAdminPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // Fetch user kyc to show their selected UPI
        const { data: uData } = await supabase.from('users').select('*').eq('id', session.user.id).single();
        setUserData(uData);

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

        // Fetch Admin Payment Methods (Target)
        const { data: payData } = await supabase
          .from('admin_payment_methods')
          .select('*')
          .eq('is_active', true)
          .limit(1);
        
        if (payData && payData.length > 0) setAdminPayment(payData[0]);

        // Initial Timer Calculation (30 Minutes)
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
    const hours = Math.floor(mins / 60);
    const displayMins = mins % 60;
    return `00 : ${displayMins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: "Detail copied to clipboard." });
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    const { error } = await supabase.from('orders').delete().eq('id', order.id);
    if (!error) {
      toast({ title: "Order Cancelled" });
      router.push('/buy');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white animate-slide-up relative font-sans">
      {/* Header */}
      <div className="bg-white px-4 h-14 flex items-center justify-between border-b border-slate-50 sticky top-0 z-50">
        <button onClick={() => router.back()} className="p-2">
          <ChevronLeft className="h-6 w-6 text-slate-400" />
        </button>
        <h1 className="text-[17px] font-medium text-slate-700">Buy Itoken details</h1>
        <button className="p-2">
          <FileText className="h-6 w-6 text-[#2A85FF]" />
        </button>
      </div>

      {/* Expiry Banner */}
      <div className="bg-[#fff1f1] px-4 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 rounded-full p-1">
             <Clock className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[15px] font-bold text-red-500 font-mono tracking-wider">
            {isExpired ? "00 : 00 : 00" : formatTime(timeLeft || 0)}
          </span>
          <span className="text-[15px] font-medium text-red-400 ml-1">Please pay in time</span>
        </div>
        <AlertCircle className="h-5 w-5 text-orange-400" />
      </div>

      {/* Stepper */}
      <div className="px-10 py-8">
        <div className="relative flex items-center justify-between w-full">
           <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 -translate-y-1/2 z-0" />
           
           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#2A85FF] flex items-center justify-center border-[3px] border-blue-100 shadow-sm">
                 <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
              <span className="text-[11px] font-medium text-[#2A85FF] absolute top-7 whitespace-nowrap">Payment info</span>
           </div>

           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-200" />
              <span className="text-[11px] font-medium text-slate-300 absolute top-7 whitespace-nowrap">Payment prove</span>
           </div>

           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-200" />
              <span className="text-[11px] font-medium text-slate-300 absolute top-7 whitespace-nowrap">Audit</span>
           </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-8 space-y-8 pb-32">
        {/* Dynamic Partner Instruction */}
        <div className="text-[16px] font-bold text-red-500 leading-snug">
          Please use the {userData?.kyc_data?.partner || 'payment method'}({userData?.kyc_data?.upi_no || 'linked UPI'}) of your choice to pay
        </div>

        {/* Payment Details Table */}
        <div className="space-y-0">
          {[
            { label: 'Name', value: adminPayment?.account_name || 'MUKILAN' },
            { label: 'Account', value: adminPayment?.details || '111101000027901' },
            { label: 'IFSC', value: adminPayment?.ifsc || 'IOBA0001111' },
            { label: 'Bank', value: adminPayment?.bank_name || 'IOBA0001111' },
            { label: 'Amount', value: order?.amount || '110', isAmount: true },
          ].map((field, idx) => (
            <div key={idx} className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0">
              <span className="text-[15px] font-medium text-slate-500 w-24">{field.label}</span>
              <div className="flex-1 flex items-center justify-between">
                <span className={cn(
                  "text-[16px] font-black tracking-tight",
                  field.isAmount ? "text-slate-900" : "text-slate-800 uppercase"
                )}>
                  {field.value}
                </span>
                <button 
                  onClick={() => handleCopy(field.value.toString())}
                  className="px-2.5 py-1 rounded-md border border-blue-200 text-[#2A85FF] text-[11px] font-bold active:scale-95 transition-all"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Notice Section */}
        <div className="space-y-3 pt-4">
          <p className="text-[14px] font-bold text-red-500 leading-[1.4]">
            Notice: The remittance amount must be consistent, otherwise the transaction will not be completed.
          </p>
          <p className="text-[14px] font-bold text-red-500 leading-[1.4]">
            Notice: If you have already paid, please wait patiently for the transaction review, please do not cancel the order
          </p>
        </div>

        {/* Cancel Text */}
        <div className="pt-4 text-center">
          <p className="text-[13px] font-medium text-slate-400">
            Unable to complete payment <span onClick={handleCancelOrder} className="text-red-500 cursor-pointer">Cancel</span> my order.
          </p>
        </div>
      </div>

      {/* Sticky Footer Actions */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 flex gap-4 border-t border-slate-50 z-50">
        <Button 
          variant="outline"
          className="flex-1 h-14 rounded-xl border-blue-500 text-[#2A85FF] font-bold text-lg hover:bg-blue-50"
        >
          Go pay
        </Button>
        <Button 
          className="flex-1 h-14 rounded-xl bg-[#2A85FF] hover:bg-blue-600 text-white font-bold text-lg"
        >
          Finish payment
        </Button>
      </div>

      {/* Floating Support */}
      <div className="fixed bottom-24 right-6 z-[60]">
        <button className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center shadow-lg border border-blue-100 active:scale-90 transition-all">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-300 to-indigo-500 flex items-center justify-center">
            <Headphones className="h-6 w-6 text-white" />
          </div>
        </button>
      </div>
    </div>
  );
}
