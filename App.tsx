
import React, { useState, useCallback, useRef } from 'react';
import { Wheel } from './components/Wheel';
import { ResultModal } from './components/ResultModal';
import { RankingTable } from './components/RankingTable';
import { LOCATIONS, playTickSound, playWinSound } from './constants';
import { fetchLocationDetails } from './services/geminiService';
import { LocationItem, TravelTip } from './types';
import { Dices } from 'lucide-react';

const App: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [winner, setWinner] = useState<LocationItem | null>(null);
  const [aiTip, setAiTip] = useState<TravelTip | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});

  // Store the actual angle (cumulative) to prevent spinning backward
  const currentRotationRef = useRef(0);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setModalOpen(false);
    setWinner(null);
    setAiTip(null);

    // Randomize spin: 5 to 10 full rotations + random angle
    const randomOffset = Math.random() * 360;
    const rounds = 5 + Math.floor(Math.random() * 5); 
    const spinAngle = rounds * 360 + randomOffset;
    
    // Update cumulative rotation
    const newRotation = currentRotationRef.current + spinAngle;
    currentRotationRef.current = newRotation;
    setRotation(newRotation);

    // Calculate winner logic
    const sliceAngle = 360 / LOCATIONS.length;
    const finalAngleNormalized = newRotation % 360;
    
    // Calculate which index is at the top (270 degrees)
    let effectiveAngle = (270 - finalAngleNormalized) % 360;
    if (effectiveAngle < 0) effectiveAngle += 360;
    
    const winningIndex = Math.floor(effectiveAngle / sliceAngle);
    const winningLocation = LOCATIONS[winningIndex];
    setWinner(winningLocation);

    // Optional: Play tick sounds during spin (simplified: one sound at start)
    playTickSound();

  }, [isSpinning]);

  const onTransitionEnd = useCallback(async () => {
    setIsSpinning(false);
    playWinSound();
    
    if (winner) {
      // Update stats
      setStats(prev => ({
        ...prev,
        [winner.id]: (prev[winner.id] || 0) + 1
      }));

      setModalOpen(true);
      setLoadingTip(true);
      
      // Fetch AI Details
      const tip = await fetchLocationDetails(winner.name);
      setAiTip(tip);
      setLoadingTip(false);
    }
  }, [winner]);

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-10 right-10 w-32 h-32 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-32 h-32 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <header className="text-center mb-6 md:mb-10 z-10 w-full">
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400 drop-shadow-sm mb-2">
          上海周末溜达去哪儿
        </h1>
      </header>

      <main className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
        
        {/* Left Side: Wheel */}
        <div className="flex flex-col items-center gap-8 w-full max-w-md lg:max-w-lg">
          <div className="relative w-full">
            <Wheel 
              items={LOCATIONS} 
              rotation={rotation} 
              isSpinning={isSpinning}
              onTransitionEnd={onTransitionEnd}
            />
            {/* Shadow below wheel */}
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-2/3 h-4 bg-black/40 blur-xl rounded-[100%] pointer-events-none"></div>
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`
              group relative px-8 py-4 rounded-full text-xl font-black uppercase tracking-wider
              transition-all duration-200 transform hover:scale-105 active:scale-95 w-full max-w-[280px]
              ${isSpinning 
                ? 'bg-slate-700 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-[0_0_40px_-10px_rgba(251,191,36,0.6)] hover:shadow-[0_0_60px_-10px_rgba(251,191,36,0.8)]'
              }
            `}
          >
            <span className="flex items-center justify-center gap-3">
              {isSpinning ? '正在旋转...' : '开始抽奖'}
              {!isSpinning && <Dices className="group-hover:rotate-180 transition-transform duration-500" />}
            </span>
          </button>
        </div>

        {/* Right Side: Ranking Table (Desktop) / Below (Mobile) */}
        <div className="w-full lg:w-80 xl:w-96">
           <RankingTable locations={LOCATIONS} stats={stats} />
        </div>

      </main>

      <ResultModal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        location={winner} 
        tip={aiTip}
        loading={loadingTip}
      />

      <footer className="mt-8 md:absolute md:bottom-4 text-slate-500 text-xs text-center w-full z-0">
        <p>© {new Date().getFullYear()} 小龙 • 由 Gemini AI 驱动</p>
      </footer>
    </div>
  );
};

export default App;
