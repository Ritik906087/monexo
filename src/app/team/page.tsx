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
  ArrowDown
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

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

  const handleCopyLink = () => {
    const inviteLink = `https://milesm.skin/#/rs/${userData?.invite_code || 'T75DvonJ4P'}`;
    navigator.clipboard.writeText(inviteLink);
    toast({
      title: "Link Copied!",
      description: "Invitation link has been copied to clipboard.",
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
        <h1 className="text-[16px] font-bold text-slate-700">Team</h1>
      </div>

      <div className="flex-1 overflow-y-auto smooth-scroll pb-24">
        {/* Profile Header Section */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-slate-50">
          <div className="flex items-center gap-3">
            <Avatar className="h-14 w-14 border-2 border-slate-100">
              <AvatarImage src={`https://picsum.photos/seed/${userData?.id}/150`} />
              <AvatarFallback className="bg-blue-50 text-blue-600 font-black">U</AvatarFallback>
            </Avatar>
            <span className="text-[14px] font-bold text-slate-400">Reward: {userData?.reward_percent || 5}%</span>
          </div>
          <span className="text-[14px] font-bold text-slate-400">ID: {userData?.numeric_id || '530087092'}</span>
        </div>

        {/* Stats List */}
        <div className="space-y-0">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 active:bg-slate-50">
            <span className="text-[14px] font-bold text-slate-600">Team Count</span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-blue-500">2</span>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 active:bg-slate-50">
            <span className="text-[14px] font-bold text-slate-600">Total Commission</span>
            <span className="text-[14px] font-bold text-blue-400">3.75</span>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 active:bg-slate-50">
            <span className="text-[14px] font-bold text-slate-600">My Total Profit</span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-blue-500">943.84</span>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
          </div>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-50 active:bg-slate-50">
            <span className="text-[14px] font-bold text-slate-600">Old Rpt New Reward</span>
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-bold text-blue-500">View</span>
              <ChevronRight className="h-4 w-4 text-slate-300" />
            </div>
          </div>
        </div>

        {/* Invitation Link Section */}
        <div className="px-5 py-6 space-y-6">
          {/* Level 1 / Link */}
          <div className="relative flex items-start gap-4">
            {/* Connection Line */}
            <div className="absolute left-3 top-6 w-[1px] h-12 border-l border-dashed border-sky-300"></div>
            <div className="absolute left-[9.5px] top-[50px] w-1.5 h-1.5 border-b border-r border-sky-300 rotate-45"></div>

            <div className="bg-blue-500 p-1.5 rounded-full z-10">
              <User className="h-3 w-3 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-slate-600">Invitation Link</span>
                  <span className="text-[12px] font-bold text-blue-400 cursor-pointer">Hide</span>
                </div>
                <QrCode className="h-5 w-5 text-orange-400" />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[12px] font-medium text-slate-300 truncate tracking-tight pr-2">
                  https://milesm.skin/#/rs/{userData?.invite_code || 'T75DvonJ4P'}
                </p>
                <div 
                  onClick={handleCopyLink}
                  className="bg-blue-500/10 p-1 rounded-md active:scale-90 transition-all cursor-pointer"
                >
                  <Copy className="h-4 w-4 text-blue-500" />
                </div>
              </div>
            </div>
          </div>

          {/* Level 1 Commission */}
          <div className="relative flex items-start gap-4">
            {/* Connection Line */}
            <div className="absolute left-3 top-6 w-[1px] h-12 border-l border-dashed border-sky-300"></div>
            <div className="absolute left-[9.5px] top-[50px] w-1.5 h-1.5 border-b border-r border-sky-300 rotate-45"></div>

            <div className="bg-blue-500 p-1.5 rounded-full z-10">
              <Users className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-slate-500">
                level 1 Commission = Buy * <span className="text-orange-400">0.3 %</span>
              </p>
            </div>
          </div>

          {/* Level 2 Commission */}
          <div className="relative flex items-start gap-4">
            {/* Connection Line */}
            <div className="absolute left-3 top-6 w-[1px] h-12 border-l border-dashed border-sky-300"></div>
            <div className="absolute left-[9.5px] top-[50px] w-1.5 h-1.5 border-b border-r border-sky-300 rotate-45"></div>

            <div className="bg-blue-400 p-1.5 rounded-full z-10">
              <Users className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-slate-500">
                level 2 Commission = Buy * <span className="text-orange-400">0.2 %</span>
              </p>
            </div>
          </div>

          {/* Level 3 Commission */}
          <div className="relative flex items-start gap-4">
            <div className="bg-blue-300 p-1.5 rounded-full z-10">
              <Users className="h-3 w-3 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-bold text-slate-500">
                level 3 Commission = Buy * <span className="text-orange-400">0.1 %</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Support Button */}
      <div className="absolute right-6 bottom-24 z-50">
        <div className="bg-blue-50 p-2 rounded-full border border-blue-100 shadow-md animate-bounce">
          <Headphones className="h-6 w-6 text-blue-500" />
        </div>
      </div>
    </div>
  );
}
