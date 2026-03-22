import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'MONEXO UPI | Premium Payments',
  description: 'The secure and premium way to manage your finances.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased selection:bg-primary/20">
        {/* Main Desktop Wrapper */}
        <div className="flex min-h-screen items-center justify-center bg-slate-900 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-purple-900/20 p-0 sm:p-4">
          
          {/* Mobile Container */}
          <main className="relative flex h-screen w-full max-w-[420px] flex-col overflow-hidden bg-white shadow-2xl sm:h-[840px] sm:rounded-[40px] sm:border-[8px] sm:border-slate-800">
            
            {/* Scrollable Content Area */}
            <div className="smooth-scroll flex-1 overflow-y-auto pb-24 pt-0">
              {children}
            </div>

            <BottomNav />
          </main>

        </div>
        <Toaster />
      </body>
    </html>
  );
}