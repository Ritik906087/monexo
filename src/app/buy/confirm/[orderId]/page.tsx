
"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  Clock, 
  AlertCircle, 
  Copy, 
  CheckCircle2,
  FileText,
  Headphones,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

// Order expiry set to 10 minutes
const EXPIRY_MINUTES = 10;

export default function OrderConfirmPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [adminPayment, setAdminPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: info, 1: prove
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

        // Fetch User
        const { data: uData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (uData) setUserData(uData);

        // Fetch Order (Try internal ID first, then order_id)
        let orderQuery = supabase.from('orders').select('*');
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId);
        
        if (isUuid) {
          orderQuery = orderQuery.eq('id', orderId);
        } else {
          orderQuery = orderQuery.eq('order_id', orderId);
        }

        const { data: orderData, error: orderError } = await orderQuery.maybeSingle();

        if (orderError) throw orderError;
        if (!orderData) {
          toast({ variant: "destructive", title: "Order Not Found" });
          router.push('/buy');
          return;
        }
        setOrder(orderData);

        // Fetch Admin Payment Method
        const { data: payData } = await supabase
          .from('admin_payment_methods')
          .select('*')
          .eq('is_active', true)
          .limit(1);
        
        if (payData && payData.length > 0) {
          setAdminPayment(payData[0]);
        } else {
          setAdminPayment({ account_name: 'MUKILAN', details: 'monexo@upi', type: 'UPI' });
        }

        // Timer Logic
        const createdAt = new Date(orderData.created_at).getTime();
        const now = new Date().getTime();
        const diffSeconds = Math.floor((now - createdAt) / 1000);
        const remaining = Math.max(0, (EXPIRY_MINUTES * 60) - diffSeconds);
        
        if (remaining <= 0) {
          setIsExpired(true);
          setTimeLeft(0);
        } else {
          setTimeLeft(remaining);
        }

      } catch (err: any) {
        console.error("Fetch Error:", err);
        toast({ variant: "destructive", title: "Error", description: "Could not load order details." });
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [orderId, router, toast]);

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
    return `00 : ${mins.toString().padStart(2, '0')} : ${secs.toString().padStart(2, '0')}`;
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

  const handleConfirmFinal = () => {
    toast({
      title: "Success",
      description: "Payment details submitted for review."
    });
    router.push('/buy-history');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white animate-slide-up relative font-sans select-none">
      <div className="bg-white px-4 h-14 flex items-center justify-between border-b border-slate-50 sticky top-0 z-50">
        <button onClick={() => currentStep === 1 ? setCurrentStep(0) : router.back()} className="p-2 active:scale-90 transition-all">
          <ChevronLeft className="h-6 w-6 text-slate-400" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-700">Buy Itoken details</h1>
        <button className="p-2">
          <FileText className="h-6 w-6 text-[#2A85FF]" />
        </button>
      </div>

      <div className="bg-[#fff1f1] px-4 py-3.5 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 rounded-full p-1 shadow-sm">
             <Clock className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[15px] font-black text-red-500 font-mono tracking-wider">
            {isExpired ? "00 : 00 : 00" : formatTime(timeLeft || 0)}
          </span>
          <span className="text-[13px] font-bold text-red-400/80 ml-1 uppercase tracking-tight">Please pay in time</span>
        </div>
        <AlertCircle className="h-5 w-5 text-orange-400" />
      </div>

      <div className="px-10 py-8 shrink-0">
        <div className="relative flex items-center justify-between w-full">
           <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 -translate-y-1/2 z-0" />
           
           {/* Step 1: Payment info */}
           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#2A85FF] flex items-center justify-center border-[3px] border-blue-100 shadow-sm">
                 <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
              <span className="text-[10px] font-black text-[#2A85FF] absolute top-7 whitespace-nowrap uppercase tracking-tighter">Payment info</span>
           </div>

           {/* Step 2: Payment prove */}
           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center border-[3px] shadow-sm transition-all",
                currentStep >= 1 ? "bg-[#2A85FF] border-blue-100" : "bg-slate-200 border-white"
              )}>
                {currentStep >= 1 && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <span className={cn(
                "text-[10px] font-black absolute top-7 whitespace-nowrap uppercase tracking-tighter",
                currentStep >= 1 ? "text-[#2A85FF]" : "text-slate-300"
              )}>Payment prove</span>
           </div>

           {/* Step 3: Audit */}
           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-slate-200" />
              <span className="text-[10px] font-black text-slate-300 absolute top-7 whitespace-nowrap uppercase tracking-tighter">Audit</span>
           </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-10 space-y-8 pb-32 overflow-y-auto">
        {currentStep === 0 ? (
          <>
            <div className="text-[15px] font-black text-red-500 leading-snug uppercase tracking-tight">
              Please use the {userData?.kyc_data?.partner || 'payment method'}({userData?.kyc_data?.upi_no || 'linked UPI'}) of your choice to pay
            </div>

            <div className="space-y-0 bg-white rounded-3xl overflow-hidden border border-slate-50 shadow-sm">
              <div className="flex items-center justify-between px-4 py-5 border-b border-slate-50">
                <span className="text-[14px] font-black text-slate-400 uppercase tracking-widest w-24">Name</span>
                <div className="flex-1 flex items-center justify-between gap-4">
                  <span className="text-[16px] font-black tracking-tight text-slate-800 uppercase truncate">
                    {adminPayment?.account_name || 'MUKILAN'}
                  </span>
                  <button onClick={() => handleCopy(adminPayment?.account_name)} className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-50 text-[#2A85FF] text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Copy</button>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-5 border-b border-slate-50">
                <span className="text-[14px] font-black text-slate-400 uppercase tracking-widest w-24">
                  {adminPayment?.type || 'UPI ID'}
                </span>
                <div className="flex-1 flex items-center justify-between gap-4">
                  <span className="text-[16px] font-black tracking-tight text-slate-800 font-mono truncate">
                    {adminPayment?.details || '---'}
                  </span>
                  <button onClick={() => handleCopy(adminPayment?.details)} className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-50 text-[#2A85FF] text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Copy</button>
                </div>
              </div>

              <div className="flex items-center justify-between px-4 py-5">
                <span className="text-[14px] font-black text-slate-400 uppercase tracking-widest w-24">Amount</span>
                <div className="flex-1 flex items-center justify-between gap-4">
                  <span className="text-[20px] font-black tracking-tighter text-slate-900">
                    ₹ {order?.amount || '0'}
                  </span>
                  <button onClick={() => handleCopy(order?.amount?.toString())} className="shrink-0 px-3 py-1.5 rounded-lg bg-blue-50 text-[#2A85FF] text-[10px] font-black uppercase tracking-widest active:scale-95 transition-all">Copy</button>
                </div>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <p className="text-[13px] font-black text-red-500 leading-tight uppercase tracking-tight">
                  Notice: The remittance amount must be consistent, otherwise the transaction will not be completed.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <p className="text-[13px] font-black text-red-500 leading-tight uppercase tracking-tight">
                  Notice: If you have already paid, please wait patiently for the transaction review, please do not cancel the order
                </p>
              </div>
            </div>

            <div className="pt-6 text-center">
              <p className="text-[12px] font-black text-slate-300 uppercase tracking-widest">
                Unable to complete payment? <span onClick={handleCancelOrder} className="text-red-500 cursor-pointer underline underline-offset-4 decoration-red-200">Cancel</span> my order.
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-8 pb-10">
            <div className="text-[15px] font-black text-red-500 leading-snug uppercase tracking-tight">
              Please use the {userData?.kyc_data?.partner || 'payment method'}({userData?.kyc_data?.upi_no || 'linked UPI'}) of your choice to pay
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-3xl font-black text-red-500 uppercase tracking-tighter">Notice! &nbsp; सूचना</h2>
            </div>

            <div className="space-y-6">
               <div className="space-y-2">
                  <div className="flex items-start gap-2 text-red-500">
                    <Volume2 className="h-5 w-5 shrink-0 mt-1" />
                    <Volume2 className="h-5 w-5 shrink-0 mt-1" />
                    <Volume2 className="h-5 w-5 shrink-0 mt-1" />
                    <p className="text-[14px] font-black uppercase leading-tight">
                      The Buying amount must be Same , otherwise the transaction will not be completed.
                    </p>
                  </div>
                  <p className="text-[14px] font-black text-red-500 leading-tight pl-24">
                    1. क्रय राशि समान होनी चाहिए, अन्यथा लेनदेन पूरा नहीं होगा।
                  </p>
               </div>

               <div className="space-y-2">
                  <div className="flex items-start gap-2 text-red-500">
                    <Volume2 className="h-5 w-5 shrink-0 mt-1" />
                    <Volume2 className="h-5 w-5 shrink-0 mt-1" />
                    <Volume2 className="h-5 w-5 shrink-0 mt-1" />
                    <p className="text-[14px] font-black uppercase leading-tight">
                      Once payment completed , please wait patiently for the transaction review.
                    </p>
                  </div>
                  <p className="text-[14px] font-black text-red-500 leading-tight pl-24">
                    2. एक बार भुगतान पूरा हो जाने पर, कृपया लेनदेन समीक्षा के लिए धैर्यपूर्वक प्रतीक्षा करें।
                  </p>
               </div>

               <div className="space-y-2">
                  <div className="flex items-start gap-2 text-red-500">
                    <Volume2 className="h-5 w-5 shrink-0 mt-1" />
                    <Volume2 className="h-5 w-5 shrink-0 mt-1" />
                    <Volume2 className="h-5 w-5 shrink-0 mt-1" />
                    <p className="text-[14px] font-black uppercase leading-tight">
                      Payment must be completed on time after token not receive within 30 minutes please contact customer service in your exclusive VIP group.
                    </p>
                  </div>
                  <p className="text-[14px] font-black text-red-500 leading-tight pl-24">
                    3. टोकन 30 मिनट के भीतर प्राप्त न होने पर भुगतान समय पर पूरा किया जाना चाहिए कृपया अपने विशिष्ट वीआईपी समूह में ग्राहक सेवा से संपर्क करें
                  </p>
               </div>
            </div>

            <div className="pt-6 text-center">
              <p className="text-[12px] font-black text-slate-300 uppercase tracking-widest">
                I'm having trouble paying and want to <span onClick={handleCancelOrder} className="text-red-500 cursor-pointer underline underline-offset-4 decoration-red-200">Cancel</span> my order.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white p-4 flex gap-4 border-t border-slate-50 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {currentStep === 0 ? (
          <>
            <Button variant="outline" className="flex-1 h-14 rounded-2xl border-blue-100 text-[#2A85FF] font-black text-[16px] uppercase tracking-widest shadow-sm active:scale-95">Go pay</Button>
            <Button onClick={() => setCurrentStep(1)} className="flex-1 h-14 rounded-2xl bg-[#2A85FF] text-white font-black text-[16px] uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 border-none">Finish payment</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setCurrentStep(0)} variant="outline" className="flex-1 h-14 rounded-2xl border-blue-100 text-[#2A85FF] font-black text-[16px] uppercase tracking-widest shadow-sm active:scale-95">Previous</Button>
            <Button onClick={handleConfirmFinal} className="flex-1 h-14 rounded-2xl bg-[#2A85FF] text-white font-black text-[16px] uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 border-none">Confirm payment</Button>
          </>
        )}
      </div>

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
