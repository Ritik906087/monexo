
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    async function checkAuthAndRoute() {
      const { data: { session } } = await supabase.auth.getSession();
      
      const hash = window.location.hash;
      
      // If user is already logged in, go to dashboard
      if (session) {
        router.push('/dashboard');
        return;
      }

      // Handle the hash-based routing for register (e.g., /#/register?invite=...)
      if (hash.includes('/register') || hash.includes('register')) {
        // Extract invite param if it exists in the hash
        const inviteMatch = hash.match(/[?&]invite=([^&]+)/);
        const invite = inviteMatch ? inviteMatch[1] : '';
        router.push(`/register${invite ? `?invite=${invite}` : ''}`);
        return;
      }

      // Default to login if not authenticated and no special route requested
      router.push('/login');
    }
    
    checkAuthAndRoute();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full bg-slate-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2A85FF]"></div>
    </div>
  );
}
