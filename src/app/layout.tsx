import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'MONEXO UPI',
  description: 'Premium Fintech Mobile App',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'MONEXO',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#1A7BFF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        {/* Mobile App Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="font-body antialiased bg-[#e5e7eb] flex justify-center h-full overflow-hidden">
        <div className="app-container relative w-full max-w-[420px] bg-white h-full flex flex-col shadow-2xl overflow-hidden">
          {/* Main Content Area - Scrollable */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden smooth-scroll relative pb-20">
            {children}
          </main>
          
          {/* Fixed Bottom Navigation */}
          <BottomNav />
          
          <Toaster />
        </div>
      </body>
    </html>
  );
}
