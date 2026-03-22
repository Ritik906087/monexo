
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
    <div className="flex flex-col h-full bg-[#f8fafc] pb-20 animate-slide-up">
      {/* Page Header */}
      <div className="bg-white pt-4 pb-2 text-center border-b border-slate-100">
        <h1 className="text-[18px] font-black text-[#1e293b]">Buy</h1>
      </div>

      {/* Tabs System */}
      <div className="bg-white flex border-b border-slate-100">
        <button 
          onClick={() => setActiveTab('UPI')}
          className={cn(
            "flex-1 py-3 text-[14px] font-black transition-all relative",
            activeTab === 'UPI' ? "text-[#2A85FF]" : "text-slate-400"
          )}
        >
          UPI
          {activeTab === 'UPI' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#2A85FF]" />}
        </button>
        <button 
          onClick={() => setActiveTab('USDT')}
          className={cn(
            "flex-1 py-3 text-[14px] font-black transition-all relative",
            activeTab === 'USDT' ? "text-[#2A85FF]" : "text-slate-400"
          )}
        >
          USDT
          {activeTab === 'USDT' && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#2A85FF]" />}
        </button>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto smooth-scroll flex-1">
        {/* Filter Card */}
        <div className="bg-white rounded-xl p-4 flex items-center justify-between border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="text-[13px] text-slate-400 font-bold">Min <span className="text-slate-800 font-black">100</span></span>
            <ArrowLeftRight className="h-4 w-4 text-slate-300" />
            <span className="text-[13px] text-slate-400 font-bold">Max <span className="text-slate-800 font-black">100000</span></span>
          </div>
          <Star className="h-5 w-5 text-orange-400" />
        </div>

        {/* Buy List Items */}
        {buyItems.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex justify-between mb-4">
              <span className="text-[12px] font-bold text-slate-300 uppercase">No:{item.id}</span>
              <span className="text-[12px] font-bold text-slate-400 uppercase">Reward {item.rewardPercent}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Price</span>
                  <span className="text-[18px] font-black text-red-500 tracking-tight">₹{item.price}</span>
                </div>
                <span className="text-slate-300 font-bold mt-4">+</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Reward</span>
                  <span className="text-[15px] font-black text-slate-800 tracking-tight">{item.reward}</span>
                </div>
                <span className="text-slate-300 font-bold mt-4">=</span>
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Itoken</span>
                  <span className="text-[18px] font-black text-blue-500 tracking-tight">{item.itoken}</span>
                </div>
              </div>

              <Button className="bg-[#e0f2fe] hover:bg-[#bae6fd] text-[#2A85FF] font-black text-[13px] px-6 h-10 rounded-xl shadow-none active:scale-95 transition-all">
                Buy
              </Button>
            </div>
          </div>
        ))}

        {/* Buy History Section */}
        <div className="mt-8">
          <h3 className="text-[14px] font-black text-slate-800 uppercase tracking-widest mb-4">Buy History</h3>
          <div className="bg-white rounded-2xl py-12 flex items-center justify-center border border-dashed border-slate-200">
            <span className="text-[13px] font-bold text-slate-400 uppercase">No buy history</span>
          </div>
        </div>
      </div>
    </div>
  );
}
