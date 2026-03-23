
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ChevronRight, 
  Users, 
  QrCode, 
  Copy, 
  Headphones,
  User,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export default function TeamPage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    async function fetchUserData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setUserData(data);
      }
      setLoading(false);
    }

    fetchUserData();
  }, [router]);

  // Generate real dynamic working temporary invite link using current origin and numeric_id
  const getInviteLink = () => {
    // Use numeric_id as the unique referral code for the user
    const code = userData?.numeric_id || 'MONEXO';
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    // Format requested: [origin]/#/register?invite=REAL_CODE
    return `${origin}/#/register?invite=${code}`;
  };

  const handleCopyLink = () => {
    const inviteLink = getInviteLink();
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link Copied!",
      description: "Your real invitation link is ready to share.",
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-full bg-white">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A85FF]"></div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-white animate-slide-up overflow-hidden relative">
      {/* Page Header */}
      <div className="bg-white pt-3 pb-2 text-center border-b border-slate-50 shrink-0">
        <h1 className="text-[16px] font-black text-slate-800 uppercase tracking-tight">Team Center</h1>
      </div>

      <div className="flex-1 overflow-y-auto smooth-scroll pb-24">
        {/* Real Profile Header Section */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-50 bg-slate-50/30">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border-2 border-white shadow-sm">
              <AvatarImage src={`https://picsum.photos/seed/${userData?.id}/150`} />
              <AvatarFallback className="bg-blue-50 text-blue-600 font-black uppercase text-xs">U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-[13px] font-black text-slate-800 uppercase leading-none mb-1">
                User_{userData?.numeric_id?.toString().slice(-4) || '7092'}
              </span>
              <span className="text-[11px] font-bold text-slate-400">Reward: {userData?.reward_percent || 5}%</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block leading-none mb-1">Account ID</span>
            <span className="text-[12px] font-black text-slate-700 tracking-tight">{userData?.numeric_id || '---'}</span>
          </div>
        </div>

        {/* Stats List */}
        <div className="space-y-0">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 active:bg-slate-50 transition-colors">
            <span className="text-[13px] font-bold text-slate-600 uppercase tracking-tight">Team Count</span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-black text-[#2A85FF]">0</span>
              <ChevronRight className="h-4 w-4 text-slate-200" />
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 active:bg-slate-50 transition-colors">
            <span className="text-[13px] font-bold text-slate-600 uppercase tracking-tight">Total Commission</span>
            <span className="text-[14px] font-black text-emerald-500">₹0.00</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-50 active:bg-slate-50 transition-colors">
            <span className="text-[13px] font-bold text-slate-600 uppercase tracking-tight">My Total Profit</span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-black text-[#2A85FF]">₹{userData?.today_profit?.toFixed(2) || '0.00'}</span>
              <ChevronRight className="h-4 w-4 text-slate-200" />
            </div>
          </div>
        </div>

        {/* Real Invitation Link Section */}
        <div className="px-5 py-8 space-y-7">
          <div className="relative flex items-start gap-4">
            <div className="absolute left-3.5 top-7 w-[1px] h-14 border-l border-dashed border-blue-200"></div>
            <div className="absolute left-[10.5px] top-[60px] w-1.5 h-1.5 border-b border-r border-blue-200 rotate-45"></div>

            <div className="bg-[#2A85FF] p-2 rounded-full z-10 shadow-sm">
              <User className="h-3 w-3 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-black text-slate-800 uppercase tracking-tight">Invitation Link</span>
                  <div className="bg-blue-50 px-2 py-0.5 rounded text-[8px] font-black text-[#2A85FF] uppercase">Live</div>
                </div>
                <QrCode className="h-4 w-4 text-orange-400" />
              </div>
              <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between border border-slate-100 group">
                <p className="text-[11px] font-bold text-slate-400 truncate tracking-tight pr-3 lowercase">
                  {getInviteLink()}
                </p>
                <div 
                  onClick={handleCopyLink}
                  className="bg-white p-1.5 rounded-lg shadow-sm border border-slate-100 active:scale-90 transition-all cursor-pointer"
                >
                  <Copy className="h-3.5 w-3.5 text-[#2A85FF]" />
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-start gap-4">
            <div className="absolute left-3.5 top-7 w-[1px] h-14 border-l border-dashed border-blue-200"></div>
            <div className="absolute left-[10.5px] top-[60px] w-1.5 h-1.5 border-b border-r border-blue-200 rotate-45"></div>

            <div className="bg-blue-500 p-2 rounded-full z-10 shadow-sm">
              <Users className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-tight leading-none mb-1">Level 1 Commission</p>
              <p className="text-[12px] font-black text-slate-800">Buy Amount × <span className="text-orange-500">0.3 %</span></p>
            </div>
          </div>

          <div className="relative flex items-start gap-4">
            <div className="absolute left-3.5 top-7 w-[1px] h-14 border-l border-dashed border-blue-200"></div>
            <div className="absolute left-[10.5px] top-[60px] w-1.5 h-1.5 border-b border-r border-blue-200 rotate-45"></div>

            <div className="bg-blue-400 p-2 rounded-full z-10 shadow-sm">
              <Users className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-tight leading-none mb-1">Level 2 Commission</p>
              <p className="text-[12px] font-black text-slate-800">Buy Amount × <span className="text-orange-500">0.2 %</span></p>
            </div>
          </div>

          <div className="relative flex items-start gap-4">
            <div className="bg-blue-300 p-2 rounded-full z-10 shadow-sm">
              <Users className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[13px] font-bold text-slate-500 uppercase tracking-tight leading-none mb-1">Level 3 Commission</p>
              <p className="text-[12px] font-black text-slate-800">Buy Amount × <span className="text-orange-500">0.1 %</span></p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-6 bottom-24 z-50">
        <div className="bg-white p-2.5 rounded-full border border-blue-50 shadow-xl animate-bounce active:scale-90 transition-transform cursor-pointer">
          <Headphones className="h-6 w-6 text-[#2A85FF]" />
        </div>
      </div>
    </div>
  );
}
