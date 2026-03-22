"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, CreditCard, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function BottomNav() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';
  
  if (!mounted || isAuthPage) return null;

  const navItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Buy', icon: ShoppingBag, path: '/buy' },
    { name: 'UPI', icon: CreditCard, path: '/upi' },
    { name: 'Team', icon: Users, path: '/team' },
    { name: 'Mine', icon: User, path: '/mine' },
  ];

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-slate-100 flex items-center justify-around z-[100] h-[64px] safe-area-bottom shadow-[0_-8px_25px_-10px_rgba(0,0,0,0.06)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 transition-all duration-200 min-w-[60px] active:scale-90 py-1",
              isActive ? "text-[#2A85FF]" : "text-slate-400"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-xl transition-all",
              isActive ? "bg-blue-50/80" : "bg-transparent"
            )}>
              <Icon className="h-[20px] w-[20px]" strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[8.5px] font-black tracking-tight uppercase",
              isActive ? "opacity-100" : "opacity-70"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
