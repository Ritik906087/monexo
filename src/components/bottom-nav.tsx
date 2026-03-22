"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, CreditCard, Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Home', icon: Home, path: '/dashboard' },
    { name: 'Buy', icon: ShoppingBag, path: '/buy' },
    { name: 'UPI', icon: CreditCard, path: '/upi' },
    { name: 'Team', icon: Users, path: '/team' },
    { name: 'Mine', icon: User, path: '/mine' },
  ];

  // Only show nav on internal pages
  const isAuthPage = pathname === '/login' || pathname === '/register' || pathname === '/';
  if (isAuthPage) return null;

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-slate-100 flex items-center justify-around py-2 px-2 z-50 h-20 safe-area-bottom">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center justify-center gap-1 transition-all duration-300 w-16 h-12 rounded-xl",
              isActive ? "text-primary scale-110" : "text-slate-400 hover:text-slate-600"
            )}
          >
            <div className={cn(
              "p-1 rounded-lg transition-colors",
              isActive ? "bg-primary/10" : "bg-transparent"
            )}>
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={cn(
              "text-[10px] font-bold tracking-tight",
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