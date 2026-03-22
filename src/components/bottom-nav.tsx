"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, CreditCard, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  // Navigation items configuration
  const navItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Buy', icon: ShoppingBag, path: '/buy' },
    { name: 'UPI', icon: CreditCard, path: '/upi' },
    { name: 'Team', icon: Users, path: '/team' },
    { name: 'Mine', icon: User, path: '/mine' },
  ];

  // Hide navigation on auth and landing pages
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';
  if (isAuthPage) return null;

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[420px] bg-white border-t border-slate-100 flex items-center justify-around py-3 px-2 z-50 h-20 safe-area-bottom shadow-[0_-5px_20px_-10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-300 min-w-[64px]",
              isActive ? "text-[#2A85FF] scale-105" : "text-slate-400"
            )}
          >
            <div className={cn(
              "transition-colors",
              isActive ? "text-[#2A85FF]" : "text-slate-400"
            )}>
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[11px] font-bold tracking-tight",
              isActive ? "opacity-100" : "opacity-80"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
