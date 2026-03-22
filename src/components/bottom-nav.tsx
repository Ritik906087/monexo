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

  // Don't show nav on login/register pages
  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t flex items-center justify-around py-3 px-2 z-50">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.path;
        return (
          <Link 
            key={item.path} 
            href={item.path}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-primary font-semibold" : "text-muted-foreground"
            )}
          >
            <Icon className="h-6 w-6" />
            <span className="text-[11px]">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
