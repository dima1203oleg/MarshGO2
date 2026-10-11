import React, { useState, useRef, useEffect } from 'react';

export type SheetSnap = 'collapsed' | 'peek' | 'expanded';

interface DraggableBottomSheetProps {
  children: React.ReactNode;
  initialSnap?: SheetSnap;
  onSnapChange?: (snap: SheetSnap) => void;
  collapsedHeight?: number;
  peekHeight?: number;
}

export const DraggableBottomSheet: React.FC<DraggableBottomSheetProps> = ({
  children,
  initialSnap = 'peek',
  onSnapChange,
  collapsedHeight = 100,
  peekHeight = 320,
}) => {
  const [currentSnap, setCurrentSnap] = useState<SheetSnap>(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);

  const startYRef = useRef<number>(0);
  const currentSnapRef = useRef<SheetSnap>(initialSnap);
  currentSnapRef.current = currentSnap;

  // Calculate actual pixel height for given snap
  const getSnapHeight = (snap: SheetSnap) => {
    switch (snap) {
      case 'collapsed':
        return collapsedHeight;
      case 'peek':
        return peekHeight;
      case 'expanded':
        return typeof window !== 'undefined' ? Math.min(window.innerHeight * 0.8, 620) : 580;
    }
  };

  const handlePointerDown = (clientY: number) => {
    setIsDragging(true);
    startYRef.current = clientY;
    setDragOffset(0);
  };

  const handlePointerMove = (clientY: number) => {
    if (!isDragging) return;
    const delta = startYRef.current - clientY;
    setDragOffset(delta);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    // Determine target snap based on dragOffset direction & magnitude
    const threshold = 50;
    let targetSnap = currentSnapRef.current;

    if (dragOffset > threshold) {
      // Swiped up
      if (currentSnapRef.current === 'collapsed') targetSnap = 'peek';
      else if (currentSnapRef.current === 'peek') targetSnap = 'expanded';
    } else if (dragOffset < -threshold) {
      // Swiped down
      if (currentSnapRef.current === 'expanded') targetSnap = 'peek';
      else if (currentSnapRef.current === 'peek') targetSnap = 'collapsed';
    }

    setDragOffset(0);
    setCurrentSnap(targetSnap);
    onSnapChange?.(targetSnap);
  };

  // Touch event handlers
  const onTouchStart = (e: React.TouchEvent) => handlePointerDown(e.touches[0].clientY);
  const onTouchMove = (e: React.TouchEvent) => handlePointerMove(e.touches[0].clientY);
  const onTouchEnd = () => handlePointerUp();

  // Mouse event handlers
  const onMouseDown = (e: React.MouseEvent) => handlePointerDown(e.clientY);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isDragging) handlePointerMove(e.clientY);
    };
    const handleGlobalMouseUp = () => {
      if (isDragging) handlePointerUp();
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging]);

  const baseHeight = getSnapHeight(currentSnap);
  const currentHeight = Math.max(collapsedHeight, baseHeight + dragOffset);

  return (
    <div
      style={{
        height: `${currentHeight}px`,
        transition: isDragging ? 'none' : 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      className="absolute bottom-0 left-0 right-0 z-[1100] bg-white/95 backdrop-blur-md rounded-t-[32px] shadow-2xl border-t border-slate-200/90 flex flex-col overflow-hidden select-none"
    >
      {/* Tactile Drag Handle */}
      <div
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onMouseDown}
        className="w-full pt-3 pb-2 cursor-grab active:cursor-grabbing flex flex-col items-center justify-center shrink-0 hover:bg-slate-50/50 transition-colors"
      >
        <div className="w-12 h-1.5 rounded-full bg-slate-300 hover:bg-slate-400 transition-colors" />
        <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
          <span>Свайп для {currentSnap === 'expanded' ? 'згортання' : 'деталей'}</span>
        </div>
      </div>

      {/* Sheet Content Body */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {children}
      </div>
    </div>
  );
};
