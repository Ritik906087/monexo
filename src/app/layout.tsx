
"use client";

import { usePathname } from 'next/navigation';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BottomNav } from '@/components/bottom-nav';
import { MobileGuard } from '@/components/mobile-guard';
import { cn } from '@/lib/utils';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');

  return (
    <html lang="en" className="h-full">
      <head>
        <title>MONEXO UPI</title>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className={cn("font-body antialiased", isAdmin ? "bg-slate-50 overflow-auto h-auto" : "h-full w-full overflow-hidden fixed")}>
        {!isAdmin && <MobileGuard />}
        
        {isAdmin ? (
          <div className="min-h-screen w-full bg-slate-50 flex flex-col">
            <main className="flex-1">
              {children}
            </main>
            <Toaster />
          </div>
        ) : (
          <div className="app-container">
            {/* Main Content Area - Scrollable like native list */}
            <main className="flex-1 overflow-x-hidden pt-0 relative smooth-scroll safe-area-top pb-20">
              {children}
            </main>
            
            {/* Fixed Bottom Navigation */}
            <BottomNav />
            
            <Toaster />
          </div>
        )}
      </body>
    </html>
  );
}
