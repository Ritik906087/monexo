
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Wallet address copied to clipboard.",
    });
  };

  const handleBuy = async (price: number) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      // Check for active orders for THIS user
      const { data: activeOrders } = await supabase
        .from('orders')
        .select('order_id, id')
        .eq('user_id', session.user.id)
        .in('status', ['pending_payment', 'pending_confirmation'])
        .limit(1);

      if (activeOrders && activeOrders.length > 0) {
        setActiveOrderId(activeOrders[0].order_id);
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
        description: `Order ${orderNumber} initialized successfully.`,
      });

      // Navigate using the Display ID (LGPAY...)
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
      <div className="bg-white pt-3 pb-1.5 text-center border-b border-slate-100 shrink-0 relative sticky top-0 z-50">
        <button 
          onClick={() => router.back()}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center active:scale-90 transition-all border border-slate-100"
        >
          <ChevronLeft className="h-5 w-5 text-slate-600" />
        </button>
        <h1 className="text-[16px] font-black text-[#1e293b] uppercase tracking-tight">Buy</h1>
      </div>

      <div className="bg-white flex border-b border-slate-100 shrink-0 sticky top-[48.5px] z-40">
        <button onClick={() => setActiveTab('UPI')} className={cn("flex-1 py-2.5 text-[13px] font-black transition-all relative", activeTab === 'UPI' ? "text-[#2A85FF]" : "text-slate-400")}>UPI{activeTab === 'UPI' && <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#2A85FF]" />}</button>
        <button onClick={() => setActiveTab('USDT')} className={cn("flex-1 py-2.5 text-[13px] font-black transition-all relative", activeTab === 'USDT' ? "text-[#2A85FF]" : "text-slate-400")}>USDT{activeTab === 'USDT' && <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#2A85FF]" />}</button>
      </div>

      <div className="p-3 space-y-3 pb-24">
        {activeTab === 'UPI' ? (
          <>
            {/* P2P Instruction Card */}
            <div className="bg-blue-500/5 rounded-2xl p-4 border border-blue-100 mb-2">
              <h3 className="text-[12px] font-black text-blue-800 uppercase mb-1">P2P खरीदारी कैसे काम करती है</h3>
              <p className="text-[10px] font-bold text-blue-600 leading-tight">
                जब आप LGB खरीदते हैं, तो आप एक पीयर-टू-पीयर (P2P) सिस्टम में भाग ले रहे होते हैं। आपका भुगतान सीधे किसी दूसरे उपयोगकर्ता को भेजा जाएगा जो अपना LGB बेच रहा है। कृपया भुगतान निर्देशों का ध्यानपूर्वक पालन करें ताकि आपका लेन-देन जल्दी पूरा हो। यह एक सुरक्षित मनी रोटेशन सिस्टम है जो खरीदारों और विक्रेताओं को जोड़ता।
              </p>
            </div>

            <div className="bg-white rounded-xl p-3 flex items-center justify-between border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-[12px] text-slate-400 font-bold uppercase tracking-tighter">Min <span className="text-slate-800 font-black">100</span></span>
                <ArrowLeftRight className="h-3.5 w-3.5 text-slate-300" />
                <span className="text-[12px] text-slate-400 font-bold uppercase tracking-tighter">Max <span className="text-slate-800 font-black">100k</span></span>
              </div>
              <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
            </div>

            <div className="space-y-3">
              {buyItems.map((item) => (
                <div key={item.id} className="bg-white rounded-2xl p-3.5 border border-slate-100 shadow-sm relative overflow-hidden active:scale-[0.98] transition-all">
                  <div className="flex justify-between mb-3">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No:{item.id}</span>
                    <div className="bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
                      <span className="text-[9px] font-black text-[#2A85FF] uppercase tracking-tighter">Reward {item.rewardPercent}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Price</span>
                        <span className="text-[16px] font-black text-red-500 tracking-tighter leading-none">₹{item.price}</span>
                      </div>
                      <span className="text-slate-200 font-bold self-end pb-0.5">+</span>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Reward</span>
                        <span className="text-[14px] font-black text-slate-700 tracking-tighter leading-none">{item.reward}</span>
                      </div>
                      <span className="text-slate-200 font-bold self-end pb-0.5">=</span>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Itoken</span>
                        <span className="text-[16px] font-black text-blue-500 tracking-tighter leading-none">{item.itoken}</span>
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleBuy(item.price)}
                      disabled={loading}
                      className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#2A85FF] font-black text-[12px] px-5 h-9 rounded-xl shadow-none active:scale-95 transition-all uppercase tracking-wider border-none"
                    >
                      {loading ? "..." : "Buy"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4 pt-2">
            <div className="text-center"><span className="text-[14px] font-bold text-slate-400 tracking-tight">1 USDT ≈ 100 ITokens</span></div>
            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">T</div>
              <Input placeholder="Enter the quantity" className="pl-10 pr-16 h-11 bg-white border-slate-100 rounded-xl text-[13px] font-bold focus-visible:ring-1 focus-visible:ring-[#2A85FF]" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              <div className="absolute right-3 top-1/2 -translate-y-1/2"><span className="text-[11px] font-bold text-slate-300">≈ ITokens</span></div>
            </div>
            <div className="bg-orange-50 border border-orange-100 py-1.5 px-4 rounded-md flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 bg-orange-100 rounded-sm flex items-center justify-center"><Info className="h-2.5 w-2.5 text-orange-400" /></div>
              <p className="text-[11px] font-bold text-orange-400">Please enter the value you want buy</p>
            </div>
            <div className="flex flex-col items-center py-4 bg-white rounded-3xl shadow-sm border border-slate-50">
              <div className="w-40 h-40 bg-white p-2 border-2 border-slate-100 rounded-2xl mb-3 overflow-hidden">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TYfyV4FsVmCWin26KqjMSRGHzLN6pzk9dp" alt="QR Code" className="w-full h-full object-contain" />
              </div>
              <p className="text-[10px] font-black text-orange-600/70 uppercase tracking-tighter">Send Only USDT to this deposit address.</p>
            </div>
            <div className="space-y-4 bg-white p-4 rounded-3xl shadow-sm border border-slate-50">
              <div className="flex items-center justify-between group" onClick={() => handleCopy('TYfyV4FsVmCWin26KqjMSRGHzLN6pzk9dp')}>
                <div className="flex flex-col"><span className="text-[10px] font-bold text-slate-300 uppercase">Wallet Address</span><span className="text-[12px] font-black text-slate-700 tracking-tight break-all">TYfyV4FsVmCWin26KqjMSRGHzLN6pzk9dp</span></div>
                <Copy className="h-5 w-5 text-slate-400 group-active:scale-90 transition-transform" />
              </div>
              <div className="flex items-center justify-between"><div className="flex flex-col"><span className="text-[10px] font-bold text-slate-300 uppercase">Network</span><span className="text-[12px] font-black text-slate-700 tracking-tight">Tron(TRC20)</span></div><Globe className="h-5 w-5 text-slate-800" /></div>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="outline" className="h-11 rounded-xl border-slate-100 text-slate-600 font-black text-[12px] uppercase tracking-widest active:scale-95">Save Image</Button>
                <Button className="h-11 rounded-xl bg-[#2A85FF] hover:bg-[#1A7BFF] text-white font-black text-[12px] uppercase tracking-widest active:scale-95 border-none" onClick={() => handleCopy('TYfyV4FsVmCWin26KqjMSRGHzLN6pzk9dp')}>Copy Address</Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Duplicate Order Prevention Dialog */}
      <Dialog open={showActiveOrderDialog} onOpenChange={setShowActiveOrderDialog}>
        <DialogContent className="w-[90%] max-w-[340px] rounded-[32px] p-6 gap-6">
          <DialogHeader className="items-center text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-2">
              <AlertCircle className="h-10 w-10 text-red-500" />
            </div>
            <DialogTitle className="text-xl font-black uppercase text-slate-800">Order in Progress</DialogTitle>
            <DialogDescription className="text-sm font-bold text-slate-500 leading-relaxed">
              FIRST COMPLETE YOUR OLD ORDER THEN ONLY YOU CAN BUY NEW ORDER.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-col gap-2">
            <Button 
              onClick={() => router.push(`/buy/confirm/${activeOrderId}`)}
              className="w-full h-12 bg-[#2A85FF] hover:bg-[#1A7BFF] rounded-xl font-black uppercase tracking-widest border-none"
            >
              Continue Old Order
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => setShowActiveOrderDialog(false)}
              className="w-full h-12 text-slate-400 font-black uppercase tracking-widest"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
