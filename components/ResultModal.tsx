import React from 'react';
import { LocationItem, TravelTip } from '../types';
import { X, MapPin, Sparkles, Lightbulb } from 'lucide-react';

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationItem | null;
  tip: TravelTip | null;
  loading: boolean;
}

export const ResultModal: React.FC<ResultModalProps> = ({ isOpen, onClose, location, tip, loading }) => {
  if (!isOpen || !location) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white text-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden transform transition-all animate-[fadeIn_0.3s_ease-out]">
        
        {/* Header */}
        <div className="relative h-32 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-90" />
          <div className="absolute inset-0 opacity-20 bg-[url('https://picsum.photos/600/300')] bg-cover bg-center" />
          <h2 className="relative text-3xl font-black text-white tracking-wider drop-shadow-md flex items-center gap-2">
            <Sparkles className="text-yellow-300" />
            {location.name}
          </h2>
          <button 
            onClick={onClose}
            className="absolute top-3 right-3 p-1 bg-white/20 hover:bg-white/40 rounded-full text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
               <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
               <p className="text-slate-500 font-medium animate-pulse">正在咨询 AI 向导...</p>
            </div>
          ) : tip ? (
            <>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                   <div className="p-2 bg-blue-100 rounded-lg text-blue-600 mt-1">
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

              <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                 <div className="flex items-start gap-3">
                   <div className="p-2 bg-amber-200 rounded-full text-amber-700">
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

              <div>
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
            className="w-full py-3 bg-gradient-to-r from-slate-800 to-slate-900 text-white rounded-xl font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all transform"
          >
            再抽一次！
          </button>
        </div>
      </div>
    </div>
  );
};