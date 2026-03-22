
"use client";

import { useState } from 'react';
import { Star, ArrowLeftRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function BuyPage() {
  const [activeTab, setActiveTab] = useState('UPI');

  const buyItems = [
    { id: '48540735793', price: 2241, reward: 112.05, itoken: 2353.05, rewardPercent: 5 },
    { id: '48540735794', price: 5500, reward: 275, itoken: 5775, rewardPercent: 5 },
    { id: '48540735795', price: 1000, reward: 50, itoken: 1050, rewardPercent: 5 },
  ];

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] pb-20 animate-slide-up overflow-hidden">
      {/* Page Header - Compact */}
      <div className="bg-white pt-3 pb-1.5 text-center border-b border-slate-100 shrink-0">
        <h1 className="text-[16px] font-black text-[#1e293b] uppercase tracking-tight">Buy</h1>
      </div>

      {/* Tabs System - Slim */}
      <div className="bg-white flex border-b border-slate-100 shrink-0">
        <button 
          onClick={() => setActiveTab('UPI')}
          className={cn(
            "flex-1 py-2.5 text-[13px] font-black transition-all relative",
            activeTab === 'UPI' ? "text-[#2A85FF]" : "text-slate-400"
          )}
        >
          UPI
          {activeTab === 'UPI' && <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#2A85FF]" />}
        </button>
        <button 
          onClick={() => setActiveTab('USDT')}
          className={cn(
            "flex-1 py-2.5 text-[13px] font-black transition-all relative",
            activeTab === 'USDT' ? "text-[#2A85FF]" : "text-slate-400"
          )}
        >
          USDT
          {activeTab === 'USDT' && <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-[#2A85FF]" />}
        </button>
      </div>

      <div className="p-3 space-y-3 overflow-y-auto smooth-scroll flex-1">
        {/* Filter Card - High Density */}
        <div className="bg-white rounded-xl p-3 flex items-center justify-between border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[12px] text-slate-400 font-bold uppercase tracking-tighter">Min <span className="text-slate-800 font-black">100</span></span>
            <ArrowLeftRight className="h-3.5 w-3.5 text-slate-300" />
            <span className="text-[12px] text-slate-400 font-bold uppercase tracking-tighter">Max <span className="text-slate-800 font-black">100k</span></span>
          </div>
          <Star className="h-4 w-4 text-orange-400 fill-orange-400" />
        </div>

        {/* Buy List Items - Native Feel */}
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

                <Button className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#2A85FF] font-black text-[12px] px-5 h-9 rounded-xl shadow-none active:scale-95 transition-all uppercase tracking-wider">
                  Buy
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Buy History Section - Compact */}
        <div className="mt-6">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 px-1">Buy History</h3>
          <div className="bg-white rounded-2xl py-8 flex flex-col items-center justify-center border border-dashed border-slate-200">
            <div className="bg-slate-50 p-2 rounded-full mb-2">
              <ArrowLeftRight className="h-5 w-5 text-slate-300" />
            </div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">No Records Found</span>
          </div>
        </div>
      </div>
    </div>
  );
}
