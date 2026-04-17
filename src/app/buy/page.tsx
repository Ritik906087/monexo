
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft,
  AlertCircle,
  Search,
  ChevronUp,
  ChevronDown,
  Headphones,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const PARTNER_LOGOS: Record<string, string> = {
  'mobikwik': "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDEpLnBuZyIsImlhdCI6MTc3NTE0ODU3MywiZXhwIjoxODA2Njg0NTczfQ.m8Z7gn5FV-0ss58kTEUZ833u8Wv_bFun3YZeZtyIa9s",
  'freecharge': "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDMpLnBuZyIsImlhdCI6MTc3NTE0ODYwOSwiZXhwIjoxODA2Njg0NjA5fQ.pus8pOlgEXCFb2pjIzNsVtU9DxnIxEeaVaeR3TuIQPc"
};

export default function BuyPage() {
  const [activeTab, setActiveTab] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [showActiveOrderDialog, setShowActiveOrderDialog] = useState(false);
  const [showPaymentSheet, setShowPaymentSheet] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  const router = useRouter();
  const { toast } = useToast();

  const buyItems = [
    { id: '5008000468984837', price: 110, reward: 3.85, itoken: 113.85, rewardPercent: 3.5 },
    { id: '5009164435399685', price: 200, reward: 7, itoken: 207.00, rewardPercent: 3.5 },
    { id: '5009269653775365', price: 200, reward: 7, itoken: 207.00, rewardPercent: 3.5 },
    { id: '5010074291845723', price: 500, reward: 17.5, itoken: 517.50, rewardPercent: 3.5 },
  ];

  useEffect(() => {
    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data } = await supabase.from('users').select('*').eq('id', session.user.id).single();
        setUserData(data);
      }
    }
    fetchUser();
  }, []);

  const maskUpi = (upi: string) => {
    if (!upi) return '---';
    const parts = upi.split('@');
    if (parts.length !== 2) return upi;
    const id = parts[0];
    const provider = parts[1];
    return `${id.slice(0, 5)}*****${id.slice(-2)}@${provider}`;
  };

  const generateOrderNumber = () => {
    return Math.floor(100000000000000 + Math.random() * 900000000000000).toString();
  };

  const handleOpenSheet = async (item: any) => {
    if (!userData?.kyc_data?.upi_no || (userData.kyc_data.partner !== 'mobikwik' && userData.kyc_data.partner !== 'freecharge')) {
      toast({
        variant: "destructive",
        title: "Link UPI First",
        description: "Please link a Mobikwik or Freecharge account to continue.",
      });
      router.push('/upi/link?type=buy');
      return;
    }

    setSelectedItem(item);
    
    // Check for active orders first
    const { data: activeOrders } = await supabase
      .from('orders')
      .select('order_id, id')
      .eq('user_id', userData.id)
      .in('status', ['pending_payment', 'pending_confirmation'])
      .limit(1);

    if (activeOrders && activeOrders.length > 0) {
      setActiveOrderId(activeOrders[0].order_id || activeOrders[0].id);
      setShowActiveOrderDialog(true);
      return;
    }

    setShowPaymentSheet(true);
  };

  const confirmPurchase = async () => {
    if (!selectedItem || !userData) return;
    
    setLoading(true);
    try {
      const orderNumber = generateOrderNumber();
      const { data: newOrder, error: insertError } = await supabase
        .from('orders')
        .insert([{
          user_id: userData.id,
          order_id: orderNumber,
          amount: selectedItem.price,
          status: 'pending_payment',
          type: 'buy',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({ title: "Order Created", description: `Order ${orderNumber} initialized.` });
      router.push(`/buy/confirm/${orderNumber}`);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Order Failed", description: error.message });
    } finally {
      setLoading(false);
      setShowPaymentSheet(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-white animate-slide-up">
      {/* Native-style header */}
      <div className="h-[56px] flex items-center justify-center relative border-b border-slate-50 shrink-0">
        <h1 className="text-[16px] font-bold text-slate-800">Buy</h1>
      </div>

      {/* Tabs matching screenshot */}
      <div className="flex border-b border-slate-100 bg-white sticky top-0 z-40">
        {['UPI Plus', 'UPI', 'USDT'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "flex-1 py-3.5 text-[13px] font-bold transition-all relative uppercase tracking-wider",
              activeTab === tab ? "text-[#2A85FF]" : "text-slate-400"
            )}
          >
            {tab}
            {activeTab === tab && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-[2.5px] bg-[#2A85FF] rounded-t-full" />}
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="px-5 py-3.5 flex items-center justify-between text-slate-400 bg-white">
        <div className="flex items-center gap-4">
          <div className="flex flex-col gap-0">
            <ChevronUp className="h-3.5 w-3.5" />
            <ChevronDown className="h-3.5 w-3.5" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium">Min</span>
            <span className="text-[13px] font-bold text-slate-700">100</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-medium">Max</span>
            <span className="text-[13px] font-bold text-slate-700">100000</span>
          </div>
        </div>
        <Search className="h-4 w-4 text-orange-400" />
      </div>

      {/* Buy List */}
      <div className="flex-1 overflow-y-auto px-5 space-y-4 pb-24 bg-slate-50/30">
        {buyItems.map((item) => (
          <div key={item.id} className="py-4 border-b border-slate-100 last:border-0 group">
            <div className="flex justify-between items-center mb-3">
              <span className="text-[11px] font-medium text-slate-300">No:{item.id}</span>
              <span className="text-[11px] font-bold text-slate-400">Reward {item.rewardPercent}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-red-500 uppercase leading-none mb-1">Price</span>
                  <span className="text-[16px] font-black text-red-500 tracking-tighter">₹ {item.price}</span>
                </div>
                <span className="text-slate-200 text-lg font-light px-1">+</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Reward</span>
                  <span className="text-[16px] font-bold text-slate-700 tracking-tighter">{item.reward}</span>
                </div>
                <span className="text-slate-200 text-lg font-light px-1">=</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Itoken</span>
                  <span className="text-[16px] font-black text-blue-500 tracking-tighter">{item.itoken}</span>
                </div>
              </div>

              <Button 
                onClick={() => handleOpenSheet(item)}
                className="bg-slate-100 hover:bg-blue-50 text-blue-500 font-bold text-[11px] px-5 h-8 rounded-md shadow-none active:scale-95 transition-all border-none"
              >
                Buy
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Sheet for Payment Selection */}
      <Sheet open={showPaymentSheet} onOpenChange={setShowPaymentSheet}>
        <SheetContent side="bottom" className="rounded-t-[32px] p-0 border-none bg-white">
          <div className="px-6 py-6 space-y-6">
            <SheetHeader className="text-left">
              <SheetTitle className="text-[16px] font-bold text-red-500 leading-tight">
                Pay using the following payment UPIs:
              </SheetTitle>
            </SheetHeader>
            
            <div className="space-y-4">
              {userData?.kyc_data && (userData.kyc_data.partner === 'mobikwik' || userData.kyc_data.partner === 'freecharge') && (
                <div 
                  onClick={confirmPurchase}
                  className="flex items-center justify-between py-2 cursor-pointer active:opacity-70 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-50 flex items-center justify-center p-1.5 shadow-sm">
                      <img 
                        src={PARTNER_LOGOS[userData.kyc_data.partner] || ""} 
                        alt={userData.kyc_data.partner} 
                        className="w-full h-full object-contain" 
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[15px] font-bold text-slate-700 capitalize">{userData.kyc_data.partner}</span>
                      <span className="text-[12px] font-medium text-slate-400">{maskUpi(userData.kyc_data.upi_no)}</span>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  </div>
                </div>
              )}

              <div 
                onClick={() => router.push('/upi')}
                className="pt-4 border-t border-slate-50"
              >
                <span className="text-[14px] font-medium text-slate-300 uppercase tracking-wide">Manage UPI</span>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Support Floating Button */}
      <div className="fixed bottom-24 right-5 z-[60]">
        <button className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center shadow-lg border border-blue-100 active:scale-90 transition-all">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-300 to-indigo-500 flex items-center justify-center">
            <Headphones className="h-5 w-5 text-white" />
          </div>
        </button>
      </div>

      {/* Active Order Dialog */}
      <Dialog open={showActiveOrderDialog} onOpenChange={setShowActiveOrderDialog}>
        <DialogContent className="w-[85%] max-w-[320px] rounded-[32px] p-6 gap-4">
          <DialogHeader className="items-center text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
            </div>
            <DialogTitle className="text-[15px] font-bold text-slate-800 uppercase">Order in Progress</DialogTitle>
            <DialogDescription className="text-[12px] font-medium text-slate-500 leading-relaxed">
              FIRST COMPLETE YOUR OLD ORDER THEN ONLY YOU CAN BUY NEW ORDER.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2">
            <Button 
              onClick={() => router.push(`/buy/confirm/${activeOrderId}`)}
              className="w-full h-11 bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-xl font-bold uppercase text-[11px] border-none tracking-widest"
            >
              Continue Old Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
