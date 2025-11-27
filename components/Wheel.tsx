
import React, { useEffect, useRef, forwardRef } from 'react';
import { LocationItem } from '../types';
import { Mountain, Trees, Flower, Tent, Bird, Sun, Waves, Cherry, Coffee } from 'lucide-react';

interface WheelProps {
  items: LocationItem[];
  rotation: number;
  onTransitionEnd: () => void;
  isSpinning: boolean;
}

const ICON_MAP: Record<string, React.ElementType> = {
  Mountain, Trees, Flower, Tent, Bird, Sun, Waves, Cherry, Coffee
};

export const Wheel = forwardRef<HTMLDivElement, WheelProps>(({ items, rotation, onTransitionEnd, isSpinning }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const size = 600; // Canvas resolution (high res for retina)
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, size, size);
    
    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 20; // 20px padding
    const arc = (2 * Math.PI) / items.length;

    items.forEach((item, index) => {
      const angle = index * arc;

      // Draw Sector
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc);
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();
      ctx.restore();

      // Draw Text & Icon
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = item.textColor;
      ctx.font = 'bold 24px "Noto Sans SC"';
      
      // Text - Use shortName if available
      const displayName = item.shortName || item.name;
      ctx.fillText(displayName, radius - 60, 10);

      // Icon placeholder logic (Visual circle only, real icon is overlay DOM)
      ctx.beginPath();
      ctx.arc(radius - 30, 0, 6, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.fill();

      ctx.restore();
    });
  }, [items]);

  return (
    <div className="relative w-full max-w-[350px] md:max-w-[450px] aspect-square mx-auto perspective-1000">
      {/* The Outer Wheel Container that Rotates */}
      <div 
        className="w-full h-full rounded-full shadow-2xl border-4 border-white/20 relative"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 4s cubic-bezier(0.2, 0.8, 0.2, 0.99)' : 'none',
        }}
        onTransitionEnd={onTransitionEnd}
      >
        <canvas 
          ref={canvasRef} 
          width={size} 
          height={size} 
          className="w-full h-full rounded-full"
        />
        
        {/* Overlaying React Icons absolutely positioned to match sectors 
            This is a trick to get high-quality SVG icons on top of the canvas sectors
            without complex canvas drawImage logic.
        */}
        {items.map((item, index) => {
           const Icon = ICON_MAP[item.iconName] || Mountain;
           const rotationDeg = (360 / items.length) * index + (360 / items.length) / 2;
           return (
             <div
               key={item.id}
               className="absolute top-0 left-0 w-full h-full pointer-events-none flex justify-center items-center"
               style={{ transform: `rotate(${rotationDeg}deg)` }}
             >
                <div 
                  className="absolute"
                  style={{ transform: 'translateX(35%) rotate(90deg)', right: '15%' }} 
                >
                  <Icon size={24} color={item.textColor} className="opacity-80" />
                </div>
             </div>
           )
        })}
      </div>

      {/* Center Pin / Marker */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 z-20 pointer-events-none filter drop-shadow-lg">
        <svg width="40" height="50" viewBox="0 0 40 50" fill="none">
           <path d="M20 50L5 10C5 10 0 0 20 0C40 0 35 10 35 10L20 50Z" fill="#F87171" stroke="white" strokeWidth="3"/>
        </svg>
      </div>

      {/* Center Decor */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-xl z-10 flex items-center justify-center border-4 border-slate-200">
        <div className="w-12 h-12 bg-amber-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
});

Wheel.displayName = 'Wheel';
