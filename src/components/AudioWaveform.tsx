import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioWaveformProps {
  duration?: number; // seconds
  isSender?: boolean;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({ duration = 15, isSender = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);

  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + (100 / (duration * 10)) * speed;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, duration, speed]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const cycleSpeed = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (speed === 1) setSpeed(1.5);
    else if (speed === 1.5) setSpeed(2);
    else setSpeed(1);
  };

  // Generate 24 pseudo-random bars for realistic audio visualizer
  const bars = [
    30, 45, 75, 90, 60, 40, 65, 85, 100, 70, 50, 80, 95, 60, 45, 80, 100, 85,
    60, 40, 70, 50, 35, 25
  ];

  const currentSeconds = Math.floor((progress / 100) * duration);
  const displaySeconds = isPlaying ? currentSeconds : duration;
  const mins = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="flex items-center gap-2.5 py-1 min-w-[210px] select-none">
      <button
        type="button"
        onClick={togglePlay}
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-transform active:scale-95 ${
          isSender
            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
            : 'bg-slate-700 text-white hover:bg-slate-800'
        }`}
        aria-label={isPlaying ? 'Durdur' : 'Oynat'}
      >
        {isPlaying ? (
          <Pause className="w-4 h-4 fill-current" />
        ) : (
          <Play className="w-4 h-4 fill-current ml-0.5" />
        )}
      </button>

      <div className="flex-1 flex flex-col justify-center gap-1">
        <div className="flex items-center gap-[2px] h-6 cursor-pointer" onClick={() => setProgress(50)}>
          {bars.map((barHeight, idx) => {
            const barProgress = (idx / bars.length) * 100;
            const isPlayed = barProgress <= progress;
            return (
              <span
                key={idx}
                className={`w-[3px] rounded-full transition-all duration-150 ${
                  isPlayed
                    ? isSender
                      ? 'bg-emerald-700'
                      : 'bg-emerald-600'
                    : 'bg-slate-300'
                }`}
                style={{ height: `${Math.max(20, (barHeight / 100) * 24)}px` }}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono tabular-nums leading-none">
          <span>{formattedTime}</span>
          <button
            type="button"
            onClick={cycleSpeed}
            className="text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-black/5 px-1 py-0.5 rounded transition-colors"
          >
            {speed}x
          </button>
        </div>
      </div>
    </div>
  );
};
