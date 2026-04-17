
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronLeft, 
  ChevronRight, 
  Headphones,
  Check
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PAYTM_LOGO = "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(5).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDUpLnBuZyIsImlhdCI6MTc3NTE0ODYzMiwiZXhwIjoxODI2Njg0NjMyfQ.QXSbgSLV3ULTcV3ss9Co9ZMe1oj3tb9bR_OP8xY-Nds";
const PHONEPE_LOGO = "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(4).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDQpLnBuZyIsImlhdCI6MTc3NTE0ODYyMSwiZXhwIjoxODI2Njg0NjIxfQ.b_cMHhiCw52krGt2edtt1k5C1Keo8uGJwYIWpe6vZVo";
const MOBIKWIK_LOGO = "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(1).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDEpLnBuZyIsImlhdCI6MTc3NTE0ODU3MywiZXhwIjoxODI2Njg0NTczfQ.m8Z7gn5FV-0ss58kTEUZ833u8Wv_bFun3YZeZtyIa9s";
const FREECHARGE_LOGO = "https://gfpzygqegzakluihhkkr.supabase.co/storage/v1/object/sign/Lg%20pay/download%20(3).png?token=eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9jMWRjNDIxNy1iODI0LTQ4ZjEtODQ3ZS04OWU1NWI3YzdhMjEiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJMZyBwYXkvZG93bmxvYWQgKDMpLnBuZyIsImlhdCI6MTc3NTE0ODYwOSwiZXhwIjoxODI2Njg0NjA5fQ.pus8pOlgEXCFb2pjIzNsVtU9DxnIxEeaVaeR3TuIQPc";

const partners = [
  {
    id: 'paytm-biz',
    name: 'Paytm Business',
    desc: 'Paytm Business is an Indian digital payment platform.',
    icon: PAYTM_LOGO,
    status: 'active'
  },
  {
    id: 'phonepe-biz',
    name: 'Phonepe Business',
    desc: 'PhonePe Business is an Indian digital payment platform.',
    icon: PHONEPE_LOGO,
    status: 'disabled'
  },
  {
    id: 'mobikwik',
    name: 'Mobikwik',
    desc: 'MobiKwik is an Indian digital payment platform.',
    icon: MOBIKWIK_LOGO,
    status: 'active'
  },
  {
    id: 'paytm',
    name: 'Paytm',
    desc: 'Paytm is an Indian digital payment platform.',
    icon: PAYTM_LOGO,
    status: 'active'
  },
  {
    id: 'phonepe',
    name: 'Phonepe',
    desc: 'PhonePe is an Indian digital payment platform.',
    icon: PHONEPE_LOGO,
    status: 'active'
  },
  {
    id: 'freecharge',
    name: 'Freecharge',
    desc: 'Freecharge offers digital payment and mobile recharge services in India.',
    icon: FREECHARGE_LOGO,
    status: 'active'
  }
];

export default function LinkNewUPIPage() {
  const router = useRouter();
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [upiNo, setUpiNo] = useState('');

  const currentPartner = partners.find(p => p.id === selectedPartner);

  const handlePartnerSelect = (id: string) => {
    setSelectedPartner(id);
    setIsSheetOpen(false);
  };

  return (
    <div className="flex flex-col h-full bg-white animate-slide-up relative overflow-hidden">
      {/* Native App Header */}
      <div className="bg-white h-[56px] flex items-center px-4 shrink-0 border-b border-slate-50 relative">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center -ml-2 active:scale-90 transition-all"
        >
          <ChevronLeft className="h-6 w-6 text-slate-400" />
        </button>
        <div className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-[15px] font-bold text-slate-700 tracking-tight">Link New UPI</h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-5 space-y-0">
        {/* Partner Row - Always Visible */}
        <div 
          onClick={() => setIsSheetOpen(true)}
          className="flex items-center justify-between py-4 border-b border-slate-100 active:bg-slate-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-4 w-full">
            <span className="text-[15px] text-slate-800 w-20 shrink-0 font-medium">Partner</span>
            <div className="flex items-center justify-between flex-1">
              <span className={cn(
                "text-[16px] font-black tracking-tight",
                selectedPartner ? "text-slate-900" : "text-slate-300"
              )}>
                {selectedPartner ? currentPartner?.name : 'select the kyc partner'}
              </span>
              <ChevronRight className="h-5 w-5 text-slate-200" />
            </div>
          </div>
        </div>

        {/* Conditional Fields - Only show after partner is selected */}
        {selectedPartner && (
          <div className="animate-slide-up space-y-2">
            {/* Name Row */}
            <div className="flex items-center py-4 border-b border-slate-100">
              <span className="text-[15px] text-slate-800 w-20 shrink-0 font-medium">Name</span>
              <Input 
                placeholder="Enter your name"
                className="flex-1 border-none bg-transparent h-auto p-0 focus-visible:ring-0 text-[16px] font-medium placeholder:text-slate-200 text-slate-900"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* UPI No Row */}
            <div className="flex items-center py-4 border-b border-slate-100">
              <span className="text-[15px] text-slate-800 w-20 shrink-0 font-medium">UPI No</span>
              <Input 
                placeholder="Enter Phone No"
                className="flex-1 border-none bg-transparent h-auto p-0 focus-visible:ring-0 text-[16px] font-medium placeholder:text-slate-200 text-slate-900"
                value={upiNo}
                onChange={(e) => setUpiNo(e.target.value)}
              />
            </div>

            {/* Retry Link */}
            <div className="pt-2">
              <button className="text-[11px] font-bold text-[#2A85FF] hover:underline px-1 uppercase tracking-tight">
                UPI list not loading? Tap to retry.
              </button>
            </div>

            {/* Action Button */}
            <div className="pt-6">
              <Button 
                className="w-full h-14 bg-[#2A85FF] hover:bg-blue-600 text-white rounded-xl font-black text-lg uppercase tracking-wider shadow-lg shadow-blue-100 active:scale-[0.98] transition-all border-none"
              >
                Link Kyc
              </Button>
            </div>
          </div>
        )}
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
                onClick={() => partner.status !== 'disabled' && handlePartnerSelect(partner.id)}
                className={cn(
                  "flex items-center gap-4 py-1 transition-all",
                  partner.status === 'disabled' ? "opacity-40 grayscale pointer-events-none" : "active:scale-[0.98] cursor-pointer"
                )}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-50 shrink-0 bg-white">
                  <img src={partner.icon} alt={partner.name} className="w-full h-full object-contain" />
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
        </SheetContent>
      </Sheet>

      {/* Floating Support Icon */}
      <div className="absolute bottom-8 right-6 z-10">
        <button className="w-[52px] h-[52px] bg-blue-50 rounded-full flex items-center justify-center shadow-lg border border-blue-100 active:scale-90 transition-all">
          <div className="relative">
            <div className="w-[38px] h-[38px] rounded-full bg-gradient-to-br from-blue-300 to-indigo-500 flex items-center justify-center">
               <Headphones className="h-5 w-5 text-white" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute -top-[21px] -left-[21px]">
                <circle cx="34" cy="34" r="3" fill="#FF71BD" stroke="white" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
