
import React from 'react';
import { LocationItem } from '../types';
import { Star, Trophy } from 'lucide-react';

interface RankingTableProps {
  locations: LocationItem[];
  stats: Record<string, number>;
}

export const RankingTable: React.FC<RankingTableProps> = ({ locations, stats }) => {
  // Sort by count (desc), then by rating (desc)
  const sortedLocations = [...locations].sort((a, b) => {
    const countA = stats[a.id] || 0;
    const countB = stats[b.id] || 0;
    if (countB !== countA) return countB - countA;
    return b.rating - a.rating;
  });

  return (
    <div className="w-full max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden flex flex-col h-full max-h-[400px] md:max-h-[500px]">
      <div className="bg-gradient-to-r from-amber-500/80 to-orange-500/80 p-4 flex items-center gap-2">
        <Trophy className="text-white" size={20} />
        <h2 className="text-white font-bold text-lg tracking-wide">人气排行榜</h2>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-300 uppercase bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-3 py-2 w-12 text-center">排名</th>
              <th className="px-3 py-2">景点</th>
              <th className="px-3 py-2 w-20 text-center">热度</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sortedLocations.map((item, index) => {
              const count = stats[item.id] || 0;
              const isTop3 = index < 3;
              
              return (
                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-3 py-3 text-center">
                    {isTop3 ? (
                       <span className={`
                         inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs
                         ${index === 0 ? 'bg-yellow-400 text-yellow-900' : ''}
                         ${index === 1 ? 'bg-slate-300 text-slate-800' : ''}
                         ${index === 2 ? 'bg-amber-700 text-amber-100' : ''}
                       `}>
                         {index + 1}
                       </span>
                    ) : (
                      <span className="text-slate-400 font-mono">{index + 1}</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-white">{item.shortName || item.name}</div>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={10} 
                          className={i < Math.floor(item.rating) ? "text-yellow-400 fill-yellow-400" : "text-slate-600"} 
                        />
                      ))}
                      <span className="text-[10px] text-slate-400 ml-1">{item.rating}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-white/10 text-white font-mono text-xs">
                      {count}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
