
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
  Volume2,
  Info,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

// Expiry settings
const INITIAL_EXPIRY_MINUTES = 10;
const AUDIT_EXPIRY_MINUTES = 30; // Updated to 30 minutes as requested

export default function OrderConfirmPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [adminPayment, setAdminPayment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: info, 1: prove, 2: audit
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessOverlay, setShowSuccessOverlay] = useState(false);
  
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

        const { data: uData } = await supabase
          .from('users')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        
        if (uData) setUserData(uData);

        let orderQuery = supabase.from('orders').select('*');
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(orderId);
        
        if (isUuid) {
          orderQuery = orderQuery.eq('id', orderId);
        } else {
          orderQuery = orderQuery.eq('order_id', orderId);
        }

        const { data: orderData } = await orderQuery.maybeSingle();

        if (!orderData) {
          router.push('/buy');
          return;
        }
        setOrder(orderData);

        const isReviewing = orderData.status === 'reviewing' || orderData.status === 'completed';
        if (isReviewing) {
          setCurrentStep(2);
        }

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

        // Timer calculation
        const expiryMins = isReviewing ? AUDIT_EXPIRY_MINUTES : INITIAL_EXPIRY_MINUTES;
        const createdAt = new Date(orderData.created_at).getTime();
        const now = new Date().getTime();
        const diffSeconds = Math.floor((now - createdAt) / 1000);
        const remaining = Math.max(0, (expiryMins * 60) - diffSeconds);
        
        if (remaining <= 0) {
          setIsExpired(true);
          setTimeLeft(0);
        } else {
          setTimeLeft(remaining);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [orderId, router]);

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

  const handleGotIt = async () => {
    setShowConfirmModal(false);
    setShowSuccessOverlay(true);
    setCurrentStep(2);
    
    // Update timer to 30 minutes for audit
    setTimeLeft(AUDIT_EXPIRY_MINUTES * 60);
    setIsExpired(false);

    if (order) {
      supabase.from('orders').update({ status: 'reviewing' }).eq('id', order.id).then();
    }

    setTimeout(() => {
      setShowSuccessOverlay(false);
    }, 2000);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen bg-white animate-slide-up relative font-sans select-none overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 h-14 flex items-center justify-between border-b border-slate-50 sticky top-0 z-50">
        <button 
          onClick={() => {
            if (currentStep === 1) setCurrentStep(0);
            else if (currentStep === 2) setCurrentStep(1);
            else router.back();
          }} 
          className="p-2 active:scale-90 transition-all"
        >
          <ChevronLeft className="h-6 w-6 text-slate-400" />
        </button>
        <h1 className="text-[17px] font-bold text-slate-700">Buy Itoken details</h1>
        <button onClick={() => router.push('/buy-history')} className="p-2 active:scale-90 transition-all">
          <FileText className="h-6 w-6 text-[#2A85FF]" />
        </button>
      </div>

      {/* Timer Banner - Pink styling from screenshot */}
      <div className="bg-[#fff1f1] px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-red-500 rounded-full p-1 shadow-sm">
             <Clock className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[15px] font-black text-red-500 font-mono tracking-wider">
            {isExpired ? "00 : 00 : 00" : formatTime(timeLeft || 0)}
          </span>
          <span className="text-[13px] font-bold text-red-500/90 ml-1 uppercase tracking-tight">
            {currentStep === 2 ? "Under review, Please wait" : "Please pay in time"}
          </span>
        </div>
        <Info className="h-5 w-5 text-orange-400" />
      </div>

      {/* Stepper */}
      <div className="px-10 py-8 shrink-0">
        <div className="relative flex items-center justify-between w-full">
           <div className="absolute top-1/2 left-0 w-full h-[1px] bg-slate-100 -translate-y-1/2 z-0" />
           
           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-[#2A85FF] flex items-center justify-center border-[3px] border-blue-100 shadow-sm">
                 <CheckCircle2 className="h-3 w-3 text-white" />
              </div>
              <span className="text-[10px] font-black text-[#2A85FF] absolute top-7 whitespace-nowrap uppercase tracking-tighter">Payment info</span>
           </div>

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

           <div className="relative z-10 flex flex-col items-center gap-2">
              <div className={cn(
                "w-5 h-5 rounded-full flex items-center justify-center border-[3px] shadow-sm transition-all",
                currentStep === 2 ? "bg-[#2A85FF] border-blue-100" : "bg-slate-200 border-white"
              )}>
                {currentStep === 2 && <CheckCircle2 className="h-3 w-3 text-white" />}
              </div>
              <span className={cn(
                "text-[10px] font-black absolute top-7 whitespace-nowrap uppercase tracking-tighter",
                currentStep === 2 ? "text-[#2A85FF]" : "text-slate-300"
              )}>Audit</span>
           </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 px-5 pt-8 space-y-6 pb-32 overflow-y-auto smooth-scroll">
        {currentStep === 0 && (
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
                Unable to complete payment? <span onClick={handleCancelOrder} className="text-red-500 cursor-pointer underline underline-offset-4 decoration-red-200 font-black">Cancel</span> my order.
              </p>
            </div>
          </>
        )}

        {currentStep === 1 && (
          <div className="space-y-8 animate-slide-up">
            <div className="text-[16px] font-black text-red-600 leading-snug uppercase tracking-tight">
              Please use the {userData?.kyc_data?.partner || 'payment method'}({userData?.kyc_data?.upi_no || 'linked UPI'}) of your choice to pay
            </div>

            <div className="text-center space-y-6">
              <h2 className="text-[32px] font-black text-red-600 uppercase tracking-tight">Notice! &nbsp; सूचना</h2>
              
              <div className="space-y-8 text-left">
                {/* Instruction 1 */}
                <div className="space-y-1">
                  <div className="flex gap-1.5 items-center mb-1">
                    <Volume2 className="h-5 w-5 text-red-600 shrink-0" />
                    <Volume2 className="h-5 w-5 text-red-600 shrink-0" />
                    <Volume2 className="h-5 w-5 text-red-600 shrink-0" />
                    <p className="text-[14px] font-black text-red-600 leading-tight uppercase tracking-tight">
                      The Buying amount must be Same , otherwise the transaction will not be completed.
                    </p>
                  </div>
                  <p className="text-[14px] font-black text-red-600 leading-tight uppercase tracking-tight">
                    1. क्रय राशि समान होनी चाहिए, अन्यथा लेनदेन पूरा नहीं होगा।
                  </p>
                </div>

                {/* Instruction 2 */}
                <div className="space-y-1">
                  <div className="flex gap-1.5 items-center mb-1">
                    <Volume2 className="h-5 w-5 text-red-600 shrink-0" />
                    <Volume2 className="h-5 w-5 text-red-600 shrink-0" />
                    <Volume2 className="h-5 w-5 text-red-600 shrink-0" />
                    <p className="text-[14px] font-black text-red-600 leading-tight uppercase tracking-tight">
                      Once payment completed , please wait patiently for the transaction review.
                    </p>
                  </div>
                  <p className="text-[14px] font-black text-red-600 leading-tight uppercase tracking-tight">
                    2. एक बार भुगतान पूरा हो जाने पर, कृपया लेनदेन समीक्षा के लिए धैर्यपूर्वक प्रतीक्षा करें।
                  </p>
                </div>

                {/* Instruction 3 */}
                <div className="space-y-1">
                  <div className="flex gap-1.5 items-center mb-1">
                    <Volume2 className="h-5 w-5 text-red-600 shrink-0" />
                    <Volume2 className="h-5 w-5 text-red-600 shrink-0" />
                    <Volume2 className="h-5 w-5 text-red-600 shrink-0" />
                    <p className="text-[14px] font-black text-red-600 leading-tight uppercase tracking-tight">
                      Payment must be completed on time after token not receive within 30 minutes please contact customer service in your exclusive VIP group.
                    </p>
                  </div>
                  <p className="text-[14px] font-black text-red-600 leading-tight uppercase tracking-tight">
                    3. टोकन 30 मिनट के भीतर प्राप्त न होने पर भुगतान समय पर पूरा किया जाना चाहिए कृपया अपने विशिष्ट वीआईपी समूह में ग्राहक सेवा से संपर्क करें
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-10 text-center">
              <p className="text-[14px] font-medium text-slate-500">
                I'm having trouble paying and want to <span onClick={handleCancelOrder} className="text-red-600 font-bold cursor-pointer hover:underline">Cancel</span> my order.
              </p>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-8 animate-slide-up">
            <div className="text-center space-y-4">
              <h2 className="text-[28px] font-black text-red-600 uppercase tracking-tight">Notice! &nbsp; सूचना</h2>
              
              <div className="flex gap-2 text-left">
                <div className="flex gap-0.5 shrink-0 mt-1">
                  <Volume2 className="h-4 w-4 text-black fill-black" />
                  <Volume2 className="h-4 w-4 text-black fill-black" />
                  <Volume2 className="h-4 w-4 text-black fill-black" />
                </div>
                <p className="text-[13px] font-bold text-red-600 leading-tight">
                  Please carefully check the amount you have paid. If the amount in rupees is insufficient, make sure to complete the remaining payment to the same person. If you have overpaid, unfortunately, you will need to contact the recipient directly to request a refund. We will provide the recipient's information for you to take the action. Our company will not be liable for assistance in these cases. Please ensure your payment is accurate to avoid any unnecessary issues!
                </p>
              </div>

              <div className="pt-4 text-left">
                 <p className="text-[13px] font-bold text-slate-700">
                   I'm having trouble paying and want to <span onClick={handleCancelOrder} className="text-red-600 cursor-pointer hover:underline">Cancel</span> my order.
                 </p>
              </div>

              <div className="pt-2 text-right">
                <button className="text-[14px] font-bold text-[#2A85FF] hover:underline">View tutorial</button>
              </div>
            </div>

            <div className="flex flex-col items-center pt-4 space-y-6">
              <div className="w-full max-w-[240px] aspect-square relative">
                 <img 
                  src="https://picsum.photos/seed/audit-futuristic-tech/600/600" 
                  alt="Audit Status" 
                  className="w-full h-full object-contain"
                  data-ai-hint="futuristic tech"
                 />
              </div>
              <div className="text-center space-y-3">
                 <p className="text-[18px] font-bold text-slate-400">Waiting for review</p>
                 <button className="text-[15px] font-bold text-[#2A85FF] hover:underline">Contact Customer Service</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Buttons */}
      {currentStep < 2 && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white p-4 flex gap-4 border-t border-slate-50 z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {currentStep === 0 ? (
            <>
              <Button variant="outline" className="flex-1 h-14 rounded-2xl border-blue-100 text-[#2A85FF] font-black text-[16px] uppercase tracking-widest shadow-sm active:scale-95">Go pay</Button>
              <Button onClick={() => setCurrentStep(1)} className="flex-1 h-14 rounded-2xl bg-[#2A85FF] text-white font-black text-[16px] uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 border-none">Finish payment</Button>
            </>
          ) : (
            <>
              <Button onClick={() => setCurrentStep(0)} variant="outline" className="flex-1 h-14 rounded-2xl border-blue-100 text-[#2A85FF] font-black text-[16px] uppercase tracking-widest shadow-sm active:scale-95">Previous</Button>
              <Button onClick={() => setShowConfirmModal(true)} className="flex-1 h-14 rounded-2xl bg-[#2A85FF] text-white font-black text-[16px] uppercase tracking-widest shadow-lg shadow-blue-100 active:scale-95 border-none">Confirm payment</Button>
            </>
          )}
        </div>
      )}

      {/* Success Overlay - Identical to screenshot */}
      {showSuccessOverlay && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
          <div className="bg-[#4a5568]/95 backdrop-blur-sm px-6 py-4 rounded-2xl flex items-center gap-3 shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-[#4a5568]" />
            </div>
            <span className="text-white font-bold text-[14px]">Submission successful, waitting review</span>
          </div>
        </div>
      )}

      {/* Floating Support */}
      <div className="fixed bottom-24 right-6 z-[60]">
        <button className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg border border-slate-100 active:scale-90 transition-all">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
            <Headphones className="h-6 w-6 text-white" />
          </div>
        </button>
      </div>

      {/* Confirm Payment Modal */}
      <AlertDialog open={showConfirmModal} onOpenChange={setShowConfirmModal}>
        <AlertDialogContent className="max-w-[320px] rounded-[24px] p-0 overflow-hidden border-none animate-in fade-in zoom-in duration-200">
          <div className="p-8 text-center space-y-4">
            <AlertDialogTitle className="text-[20px] font-bold text-slate-800 leading-none">Confirm payment</AlertDialogTitle>
            <AlertDialogDescription className="text-[14px] text-slate-500 leading-relaxed font-medium">
              Please confirm that you have completed the payment with the {userData?.kyc_data?.partner || 'linked'}({userData?.kyc_data?.upi_no || 'UPI'}) account. If you do not complete the payment, your credit will be affected and your transactions will be limited!
            </AlertDialogDescription>
          </div>
          <div className="flex border-t border-slate-100">
            <button 
              onClick={() => setShowConfirmModal(false)}
              className="flex-1 py-4 text-[15px] font-bold text-slate-400 border-r border-slate-100 active:bg-slate-50 transition-colors uppercase tracking-tight"
            >
              Continue to pay
            </button>
            <button 
              onClick={handleGotIt}
              className="flex-1 py-4 text-[15px] font-black text-[#2A85FF] active:bg-slate-50 transition-colors uppercase tracking-tight"
            >
              Got it
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
