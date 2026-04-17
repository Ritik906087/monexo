
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Headphones, 
  Copy,
  CheckCircle2,
  Circle
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const partners = [
  {
    id: 'paytm-biz',
    name: 'Paytm Business',
    desc: 'Paytm Business is an Indian digital payment platform.',
    icon: 'https://picsum.photos/seed/paytm/40/40',
    status: 'active'
  },
  {
    id: 'phonepe-biz',
    name: 'Phonepe Business',
    desc: 'PhonePe Business is an Indian digital payment platform.',
    icon: 'https://picsum.photos/seed/phonepe/40/40',
    status: 'disabled'
  },
  {
    id: 'mobikwik',
    name: 'Mobikwik',
    desc: 'MobiKwik is an Indian digital payment platform.',
    icon: 'https://picsum.photos/seed/mobi/40/40',
    status: 'active'
  },
  {
    id: 'paytm',
    name: 'Paytm',
    desc: 'Paytm is an Indian digital payment platform.',
    icon: 'https://picsum.photos/seed/paytm2/40/40',
    status: 'active'
  },
  {
    id: 'phonepe',
    name: 'Phonepe',
    desc: 'PhonePe is an Indian digital payment platform.',
    icon: 'https://picsum.photos/seed/phonepe2/40/40',
    status: 'active'
  },
  {
    id: 'freecharge',
    name: 'Freecharge',
    desc: 'Freecharge offers digital payment and mobile recharge services in India.',
    icon: 'https://picsum.photos/seed/free/40/40',
    status: 'active'
  }
];

export default function LinkNewUPIPage() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-full bg-white animate-slide-up relative">
      {/* Native App Header */}
      <div className="bg-white h-[56px] flex items-center px-4 shrink-0 border-b border-slate-50 relative">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center -ml-2 active:scale-90 transition-all"
        >
          <ChevronLeft className="h-6 w-6 text-slate-500" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-[16px] font-medium text-slate-800 tracking-tight">Link New UPI</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-4">
        <div 
          onClick={() => setIsSheetOpen(true)}
          className="flex items-center justify-between py-4 border-b border-slate-100 active:bg-slate-50 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-4 w-full">
            <span className="text-[16px] text-slate-500 w-24 shrink-0 font-medium">Partner</span>
            <div className="flex items-center justify-between flex-1">
              <span className="text-[16px] font-bold text-slate-900 tracking-tight">
                {selectedPartner ? partners.find(p => p.id === selectedPartner)?.name : 'select the kyc partner'}
              </span>
              <ChevronRight className="h-5 w-5 text-slate-300 group-active:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Sheet / Drawer for Partner Selection */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="rounded-t-[32px] p-0 h-[80vh] bg-white border-none overflow-hidden flex flex-col">
          <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mt-3 mb-1" />
          
          <SheetHeader className="px-6 py-4 text-left">
            <SheetTitle className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">
              Choose a link authorization partner
            </SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 space-y-6 pb-20 smooth-scroll">
            {partners.map((partner) => (
              <div 
                key={partner.id}
                onClick={() => partner.status !== 'disabled' && setSelectedPartner(partner.id)}
                className={cn(
                  "flex items-center gap-4 py-1 transition-all",
                  partner.status === 'disabled' ? "opacity-40 grayscale pointer-events-none" : "active:scale-[0.98]"
                )}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-50 shrink-0">
                  <img src={partner.icon} alt={partner.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-black text-slate-800 leading-tight mb-0.5">{partner.name}</h3>
                  <p className="text-[11px] font-bold text-slate-400 line-clamp-2 leading-tight">
                    {partner.desc}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="h-8 px-4 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-[11px] font-black border-none shadow-sm"
                  >
                    Download
                  </Button>
                  <div className={cn(
                    "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors",
                    selectedPartner === partner.id ? "border-blue-500 bg-white" : "border-slate-200"
                  )}>
                    {selectedPartner === partner.id && <div className="w-3 h-3 rounded-full bg-blue-500" />}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 bg-white border-t border-slate-50 shrink-0">
            <Button 
              onClick={() => setIsSheetOpen(false)}
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black uppercase text-xs tracking-widest"
            >
              Confirm Selection
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Floating Support Icon */}
      <div className="absolute bottom-6 right-6 z-10">
        <button className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center shadow-lg border border-blue-100 active:scale-90 transition-all">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
               <Headphones className="h-6 w-6 text-white" />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-pink-400 rounded-full border-2 border-white"></div>
          </div>
        </button>
      </div>
    </div>
  );
}
