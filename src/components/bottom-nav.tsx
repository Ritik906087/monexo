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

  // Hide navigation on auth and landing pages
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
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-slate-50 flex items-center justify-around py-2 px-2 z-[100] h-20 safe-area-bottom shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.08)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1.5 transition-all duration-200 min-w-[64px] active:scale-90",
              isActive ? "text-[#2A85FF]" : "text-slate-400"
            )}
          >
            <div className={cn(
              "p-1 rounded-xl transition-all",
              isActive ? "bg-blue-50" : "bg-transparent"
            )}>
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-bold tracking-tight uppercase",
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
