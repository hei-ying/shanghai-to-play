
import { LocationItem } from './types';

export const LOCATIONS: LocationItem[] = [
  { id: '1', name: '佘山国家森林公园', shortName: '佘山', color: '#FF6B6B', textColor: '#FFFFFF', iconName: 'Mountain', rating: 4.5 },
  { id: '2', name: '东平国家森林公园', shortName: '东平森林', color: '#4ECDC4', textColor: '#FFFFFF', iconName: 'Trees', rating: 4.0 },
  { id: '3', name: '滨江森林公园', shortName: '滨江森林', color: '#45B7D1', textColor: '#FFFFFF', iconName: 'Waves', rating: 4.2 },
  { id: '4', name: '辰山植物园', color: '#96CEB4', textColor: '#FFFFFF', iconName: 'Flower', rating: 4.8 },
  { id: '5', name: '共青森林公园', shortName: '共青森林', color: '#FFEEAD', textColor: '#333333', iconName: 'Tent', rating: 4.3 },
  { id: '6', name: '海湾国家森林公园', shortName: '海湾森林', color: '#D4A5A5', textColor: '#FFFFFF', iconName: 'Bird', rating: 3.8 },
  { id: '7', name: '顾村公园', color: '#9B59B6', textColor: '#FFFFFF', iconName: 'Cherry', rating: 4.1 },
  { id: '8', name: '世纪公园', color: '#3498DB', textColor: '#FFFFFF', iconName: 'Sun', rating: 4.6 },
  { id: '10', name: '世博文化公园-双子山', shortName: '双子山', color: '#E67E22', textColor: '#FFFFFF', iconName: 'Mountain', rating: 4.7 },
  { id: '9', name: '工作累了，周末哪也不想去', shortName: '宅家躺平', color: '#64748b', textColor: '#FFFFFF', iconName: 'Coffee', rating: 5.0 },
];

// Sound synthesis helper
export const playTickSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.1);
  } catch (e) {
    // Ignore audio errors
  }
};

export const playWinSound = () => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    // Victory arpeggio
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
    osc.frequency.setValueAtTime(1046.50, ctx.currentTime + 0.3); // C6
    
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.6);
  } catch (e) {
    // Ignore audio errors
  }
};
