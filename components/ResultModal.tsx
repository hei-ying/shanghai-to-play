
import React from 'react';
import { LocationItem, TravelTip } from '../types';
import { X, MapPin, Sparkles, Lightbulb } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationItem | null;
  tip: TravelTip | null;
  imageUrl: string | null;
  loading: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, location, tip, imageUrl, loading }) => {
  if (!isOpen || !location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white text-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all animate-[fadeIn_0.3s_ease-out] flex flex-col max-h-[90vh]">
        
        {/* Header - Image Area */}
        <div className="relative h-48 sm:h-56 flex-shrink-0 flex items-end justify-start overflow-hidden group">
          {/* Background Layer */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-90 transition-opacity duration-700" 
             style={{ opacity: imageUrl ? 0 : 0.9 }} 
          />
          
          {/* Image Layer */}
          <div 
             className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out transform scale-100 group-hover:scale-105"
             style={{ 
               backgroundImage: `url(${imageUrl || 'https://picsum.photos/600/300'})`,
               opacity: imageUrl ? 1 : 0.2
             }} 
          />
          
          {/* Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Title Content */}
          <div className="relative p-6 w-full z-10">
             <h2 className="text-3xl font-black text-white tracking-wider drop-shadow-md flex items-center gap-2">
               <Sparkles className="text-yellow-300" />
               {location.name}
             </h2>
             {imageUrl && <p className="text-white/80 text-xs mt-1 font-mono">✨ AI 生成实景图</p>}
          </div>

          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-2 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full text-white transition-all z-20 border border-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4 min-h-[200px]">
               <div className="relative">
                 <div className="w-12 h-12 border-4 border-slate-200 rounded-full"></div>
                 <div className="absolute top-0 left-0 w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
               <p className="text-slate-500 font-medium animate-pulse">
                 AI 正在为您规划行程并手绘美景...
               </p>
            </div>
          ) : tip ? (
            <>
              <div className="space-y-2 animate-[fadeIn_0.5s_ease-out]">
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1 flex-shrink-0">
                     <MapPin size={20} />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-slate-900">景点概览</h3>
                     <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                       {tip.description}
                     </p>
                   </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 animate-[fadeIn_0.5s_ease-out_0.1s] fill-mode-backwards">
                 <div className="flex items-start gap-3">
                   <div className="p-2 bg-amber-200 rounded-full text-amber-700 flex-shrink-0">
                     <Lightbulb size={18} />
                   </div>
                   <div>
                     <h3 className="font-bold text-amber-800 text-sm uppercase tracking-wide">游玩建议</h3>
                     <p className="text-amber-900 mt-1 text-sm font-medium">
                       {tip.proTip}
                     </p>
                   </div>
                 </div>
              </div>

              <div className="animate-[fadeIn_0.5s_ease-out_0.2s] fill-mode-backwards">
                <h3 className="font-bold text-slate-800 mb-3 text-sm uppercase tracking-wider flex items-center gap-2">
                  <span className="w-1 h-4 bg-purple-500 rounded-full"></span>
                  必打卡景点
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tip.attractions.map((spot, i) => (
                    <div key={i} className="bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-lg text-sm text-slate-700 font-medium transition-colors border border-slate-100">
                      📍 {spot}
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-red-500">
              获取详情失败，请再试一次！
            </div>
          )}

          <button 
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all transform"
          >
            再抽一次！
          </button>
        </div>
      </div>
    </div>
  );
};
