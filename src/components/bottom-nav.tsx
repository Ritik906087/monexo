"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Ticket, ShieldCheck, ExternalLink, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isExcludedPage = 
    pathname === '/login' || 
    pathname === '/register' || 
    pathname === '/' ||
    pathname?.startsWith('/admin') ||
    pathname === '/buy-history' ||
    pathname === '/sell-history';
  
  if (!mounted || isExcludedPage) return null;

  const navItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Buy', icon: Ticket, path: '/buy' },
    { name: 'UPI', icon: ShieldCheck, path: '/upi' },
    { name: 'Team', icon: ExternalLink, path: '/team' },
    { name: 'Mine', icon: UserCircle, path: '/mine' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-slate-100 flex items-center justify-around z-[100] h-[58px] safe-area-bottom shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 transition-all duration-200 flex-1 h-full",
              isActive ? "text-[#2A85FF]" : "text-slate-400"
            )}
          >
            <Icon className="h-[20px] w-[20px]" strokeWidth={isActive ? 2.5 : 2} />
            <span className={cn(
              "text-[9px] font-bold uppercase tracking-tight",
              isActive ? "opacity-100" : "opacity-60"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}