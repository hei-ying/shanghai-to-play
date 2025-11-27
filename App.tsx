
import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Wheel } from './components/Wheel';
import { ResultModal } from './components/ResultModal';
import { RankingTable } from './components/RankingTable';
import { LOCATIONS, playTickSound, playWinSound } from './constants';
import { fetchLocationDetails, fetchLocationImage } from './services/geminiService';
import { LocationItem, TravelTip } from './types';
import { Dices } from 'lucide-react';

const App: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [winner, setWinner] = useState<LocationItem | null>(null);
  const [aiTip, setAiTip] = useState<TravelTip | null>(null);
  const [aiImage, setAiImage] = useState<string | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);
  const [stats, setStats] = useState<Record<string, number>>({});

  // Store the actual angle (cumulative) to prevent spinning backward
  const currentRotationRef = useRef(0);

  // Generate random stars/particles once
  const stars = useMemo(() => {
    return [...Array(30)].map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: Math.random() * 3 + 1 + 'px',
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      opacity: Math.random() * 0.5 + 0.3
    }));
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;

    setIsSpinning(true);
    setModalOpen(false);
    setWinner(null);
    setAiTip(null);
    setAiImage(null);

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
      
      try {
        // Parallel fetch for text and image to optimize wait time
        const [tip, image] = await Promise.all([
           fetchLocationDetails(winner.name),
           fetchLocationImage(winner.name)
        ]);
        
        setAiTip(tip);
        setAiImage(image);
      } catch (e) {
        console.error("Error fetching AI content", e);
      } finally {
        setLoadingTip(false);
      }
    }
  }, [winner]);

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 overflow-hidden relative">
      
      {/* Dynamic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {/* Deep Gradient Mesh - Darker, richer tones */}
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-900/40 rounded-full mix-blend-screen filter blur-[80px] animate-blob-bounce"></div>
        <div className="absolute top-[30%] right-[-10%] w-[40vw] h-[40vw] bg-indigo-900/40 rounded-full mix-blend-screen filter blur-[80px] animate-blob-bounce animation-delay-2000"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[60vw] h-[60vw] bg-pink-900/30 rounded-full mix-blend-screen filter blur-[80px] animate-blob-bounce animation-delay-4000"></div>
        
        {/* Highlight Orbs - Brighter, smaller pops of color */}
        <div className="absolute top-[10%] left-[40%] w-[20vw] h-[20vw] bg-amber-600/20 rounded-full mix-blend-overlay filter blur-[60px] animate-blob-bounce animation-delay-6000"></div>
        
        {/* Star Particles */}
        {stars.map(star => (
          <div 
            key={star.id}
            className="absolute bg-white rounded-full animate-twinkle"
            style={{
              top: star.top,
              left: star.left,
              width: star.size,
              height: star.size,
              animationDelay: star.delay,
              animationDuration: star.duration,
              opacity: star.opacity
            }}
          />
        ))}
        
        {/* Vignette Overlay */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-slate-950/80"></div>
      </div>

      <header className="text-center mb-6 md:mb-10 z-10 w-full relative">
        <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 drop-shadow-[0_2px_10px_rgba(251,191,36,0.3)] mb-2 tracking-tight">
          上海周末溜达去哪儿
        </h1>
        <div className="h-1 w-24 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full opacity-60"></div>
      </header>

      <main className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-20">
        
        {/* Left Side: Wheel */}
        <div className="flex flex-col items-center gap-8 w-full max-w-md lg:max-w-lg">
          <div className="relative w-full group">
            <Wheel 
              items={LOCATIONS} 
              rotation={rotation} 
              isSpinning={isSpinning}
              onTransitionEnd={onTransitionEnd}
            />
            {/* Ambient Glow behind wheel */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-indigo-500/20 rounded-full blur-3xl -z-10 group-hover:bg-indigo-500/30 transition-colors duration-1000"></div>
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning}
            className={`
              group relative px-10 py-5 rounded-full text-xl font-black uppercase tracking-wider
              transition-all duration-300 transform w-full max-w-[280px] overflow-hidden
              ${isSpinning 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700' 
                : 'text-white border border-amber-400/30 shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95'
              }
            `}
          >
             {/* Button Background Gradient */}
             <div className={`absolute inset-0 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 transition-transform duration-300 ${isSpinning ? 'opacity-0' : 'opacity-100'}`}></div>
             
             {/* Button Shine Effect */}
             {!isSpinning && <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-150%] group-hover:animate-[shine_1s_ease-in-out]"></div>}

            <span className="relative flex items-center justify-center gap-3 z-10">
              {isSpinning ? '正在旋转...' : '开始抽奖'}
              {!isSpinning && <Dices className="group-hover:rotate-180 transition-transform duration-700" />}
            </span>
          </button>
        </div>

        {/* Right Side: Ranking Table (Desktop) / Below (Mobile) */}
        <div className="w-full lg:w-80 xl:w-96 transform transition-all hover:-translate-y-1 duration-300">
           <RankingTable locations={LOCATIONS} stats={stats} />
        </div>

      </main>

      <ResultModal 
        isOpen={modalOpen} 
        onClose={closeModal} 
        location={winner} 
        tip={aiTip}
        imageUrl={aiImage}
        loading={loadingTip}
      />

      <footer className="mt-8 md:absolute md:bottom-4 text-slate-400/60 text-xs text-center w-full z-0 font-medium tracking-wide">
        <p>© {new Date().getFullYear()} 小龙 • Powered by Gemini AI</p>
      </footer>
    </div>
  );
};

export default App;
