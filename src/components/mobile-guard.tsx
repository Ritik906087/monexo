"use client";

import { useEffect, useState } from 'react';

export function MobileGuard() {
  const [showFailsafe, setShowFailsafe] = useState(false);

  useEffect(() => {
    // Block Zooming behavior
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === '+' || e.key === '-' || e.key === '0' || e.key === '=')
      ) {
        e.preventDefault();
      }
    };

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
      }
    };

    const handleTouch = (e: TouchEvent) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Check for large screens
    const handleResize = () => {
      setShowFailsafe(window.innerWidth > 1200);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouch, { passive: false });
    window.addEventListener('resize', handleResize);
    
    handleResize();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!showFailsafe) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[200] pointer-events-none">
      <div className="bg-slate-900/80 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10 shadow-2xl">
        <p className="text-[10px] font-black tracking-widest text-white/60 uppercase">
          Best experience on mobile devices
        </p>
      </div>
    </div>
  );
}
