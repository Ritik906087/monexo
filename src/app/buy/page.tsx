
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Star, 
  ArrowLeftRight, 
  Copy, 
  Globe, 
  Headphones,
  Info,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

export default function BuyPage() {
  const [activeTab, setActiveTab] = useState('UPI');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(false);
  const [showActiveOrderDialog, setShowActiveOrderDialog] = useState(false);
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const buyItems = [
    { id: '48540735793', price: 2241, reward: 156.87, itoken: 2397.87, rewardPercent: 7 },
    { id: '48540735794', price: 5500, reward: 385, itoken: 5885, rewardPercent: 7 },
    { id: '48540735795', price: 1000, reward: 70, itoken: 1070, rewardPercent: 7 },
  ];

  const handleBuy = async (price: number) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: activeOrders } = await supabase
        .from('orders')
        .select('order_id, id')
        .eq('user_id', session.user.id)
        .in('status', ['pending_payment', 'pending_confirmation'])
        .limit(1);

      if (activeOrders && activeOrders.length > 0) {
        setActiveOrderId(activeOrders[0].order_id || activeOrders[0].id);
        setShowActiveOrderDialog(true);
        setLoading(false);
        return;
      }

      const orderNumber = `LGPAY${Math.floor(100000 + Math.random() * 900000)}`;
      const { data: newOrder, error: insertError } = await supabase
        .from('orders')
        .insert([{
          user_id: session.user.id,
          order_id: orderNumber,
          amount: price,
          status: 'pending_payment',
          type: 'buy',
          created_at: new Date().toISOString()
        }])
        .select()
        .single();

      if (insertError) throw insertError;

      toast({
        title: "Order Created",
        description: `Order ${orderNumber} initialized.`,
      });

      router.push(`/buy/confirm/${orderNumber}`);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: error.message || "Could not create order.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-[#f8fafc] animate-slide-up">
      <div className="native-header">
        <button 
          onClick={() => router.back()}
          className="absolute left-4 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center active:scale-90 transition-all"
        >
          <ChevronLeft className="h-4 w-4 text-slate-600" />
        </button>
        <h1 className="text-[14px] font-black text-slate-800 uppercase tracking-tight">Purchase IToken</h1>
      </div>

      <div className="bg-white flex border-b border-slate-100 shrink-0 sticky top-[52px] z-40">
        <button onClick={() => setActiveTab('UPI')} className={cn("flex-1 py-3 text-[11px] font-black transition-all relative uppercase tracking-wider", activeTab === 'UPI' ? "text-[#2A85FF]" : "text-slate-400")}>UPI{activeTab === 'UPI' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2A85FF]" />}</button>
        <button onClick={() => setActiveTab('USDT')} className={cn("flex-1 py-3 text-[11px] font-black transition-all relative uppercase tracking-wider", activeTab === 'USDT' ? "text-[#2A85FF]" : "text-slate-400")}>USDT{activeTab === 'USDT' && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#2A85FF]" />}</button>
      </div>

      <div className="p-2.5 space-y-2.5 pb-24">
        {activeTab === 'UPI' ? (
          <>
            <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/50 mb-1">
              <h3 className="text-[9px] font-black text-blue-800 uppercase mb-0.5">P2P System Guide</h3>
              <p className="text-[9px] font-bold text-blue-600 leading-tight">
                आपका भुगतान सीधे किसी दूसरे उपयोगकर्ता को भेजा जाएगा जो अपना LGB बेच रहा है।
              </p>
            </div>

            <div className="space-y-2.5">
              {buyItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl p-3 border border-slate-100 shadow-sm active:scale-[0.98] transition-all">
                  <div className="flex justify-between mb-2">
                    <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">ID:{item.id}</span>
                    <div className="bg-blue-50 px-1.5 py-0.5 rounded-md border border-blue-100">
                      <span className="text-[8px] font-black text-[#2A85FF] uppercase">Reward {item.rewardPercent}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <div className="flex flex-col">
                        <span className="text-[7px] font-black text-slate-400 uppercase leading-none mb-0.5">Price</span>
                        <span className="text-[14px] font-black text-red-500 tracking-tighter">₹{item.price}</span>
                      </div>
                      <span className="text-slate-200 text-[10px] font-bold pb-0.5">+</span>
                      <div className="flex flex-col">
                        <span className="text-[7px] font-black text-slate-400 uppercase leading-none mb-0.5">Reward</span>
                        <span className="text-[12px] font-black text-slate-700 tracking-tighter">{item.reward}</span>
                      </div>
                      <span className="text-slate-200 text-[10px] font-bold pb-0.5">=</span>
                      <div className="flex flex-col">
                        <span className="text-[7px] font-black text-slate-400 uppercase leading-none mb-0.5">Itoken</span>
                        <span className="text-[14px] font-black text-blue-500 tracking-tighter">{item.itoken}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleBuy(item.price)}
                      disabled={loading}
                      className="bg-blue-50 hover:bg-blue-100 text-[#2A85FF] font-black text-[10px] px-4 h-8 rounded-lg shadow-none active:scale-95 transition-all uppercase tracking-wider border-none"
                    >
                      {loading ? "..." : "Buy"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-3 pt-1">
            <div className="relative">
              <Input placeholder="Enter quantity" className="h-10 bg-white border-slate-100 rounded-lg text-sm font-bold focus-visible:ring-1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
            </div>
            <div className="flex flex-col items-center py-4 bg-white rounded-2xl shadow-sm border border-slate-50">
              <div className="w-32 h-32 bg-white p-1.5 border border-slate-100 rounded-lg mb-2">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TYfyV4FsVmCWin26KqjMSRGHzLN6pzk9dp" alt="QR" className="w-full h-full object-contain" />
              </div>
              <p className="text-[8px] font-black text-orange-600/70 uppercase">Send Only USDT TRC20.</p>
            </div>
          </div>
        )}
      </div>

      <Dialog open={showActiveOrderDialog} onOpenChange={setShowActiveOrderDialog}>
        <DialogContent className="w-[85%] max-w-[320px] rounded-3xl p-5 gap-4">
          <DialogHeader className="items-center text-center">
            <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
            <DialogTitle className="text-sm font-black uppercase text-slate-800">Order in Progress</DialogTitle>
            <DialogDescription className="text-[11px] font-bold text-slate-500">
              FIRST COMPLETE YOUR OLD ORDER THEN ONLY YOU CAN BUY NEW ORDER.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2">
            <Button 
              onClick={() => router.push(`/buy/confirm/${activeOrderId}`)}
              className="w-full h-10 bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-lg font-black uppercase text-[10px] border-none"
            >
              Continue Old Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
