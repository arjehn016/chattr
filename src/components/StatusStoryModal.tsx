import React, { useState, useEffect } from 'react';
import { X, Send, Heart, ChevronLeft, ChevronRight } from 'lucide-react';
import { UserStory } from '../types';

interface StatusStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  story: UserStory | null;
  onReply: (storyId: string, replyText: string) => void;
  isApple: boolean;
}

export const StatusStoryModal: React.FC<StatusStoryModalProps> = ({
  isOpen,
  onClose,
  story,
  onReply,
  isApple
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen || !story) {
      setCurrentSlideIndex(0);
      setProgress(0);
      return;
    }

    const slideDurationMs = 5000;
    const intervalTime = 50;
    const step = (intervalTime / slideDurationMs) * 100;

    const interval = setInterval(() => {
      if (isPaused) return;

      setProgress((prev) => {
        if (prev >= 100) {
          if (currentSlideIndex < story.slides.length - 1) {
            setCurrentSlideIndex((c) => c + 1);
            return 0;
          } else {
            onClose();
            return 100;
          }
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(interval);
  }, [isOpen, story, currentSlideIndex, isPaused, onClose]);

  if (!isOpen || !story) return null;

  const currentSlide = story.slides[currentSlideIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((c) => c - 1);
      setProgress(0);
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlideIndex < story.slides.length - 1) {
      setCurrentSlideIndex((c) => c + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onReply(story.id, replyText);
    setReplyText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`w-full max-w-sm h-[640px] bg-slate-900 relative flex flex-col justify-between overflow-hidden shadow-2xl select-none ${
          isApple ? 'rounded-[36px]' : 'rounded-3xl'
        }`}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Story Background */}
        <div className="absolute inset-0 z-0">
          {currentSlide?.mediaUrl ? (
            <img
              src={currentSlide.mediaUrl}
              alt="Durum"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-emerald-800 to-teal-900" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />
        </div>

        {/* Tap areas for next/prev */}
        <div
          className="absolute left-0 top-16 bottom-24 w-1/3 z-10 cursor-pointer"
          onClick={handlePrev}
        />
        <div
          className="absolute right-0 top-16 bottom-24 w-1/3 z-10 cursor-pointer"
          onClick={handleNext}
        />

        {/* Top Header & Segmented Progress Bars */}
        <div className="relative z-20 p-4 pt-5">
          {/* Progress Bars */}
          <div className="flex items-center gap-1.5 mb-3">
            {story.slides.map((_, idx) => (
              <div key={idx} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{
                    width:
                      idx < currentSlideIndex
                        ? '100%'
                        : idx === currentSlideIndex
                        ? `${progress}%`
                        : '0%'
                  }}
                />
              </div>
            ))}
          </div>

          {/* User info row */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full overflow-hidden border border-white/50 bg-slate-700">
                {story.userAvatar ? (
                  <img
                    src={story.userAvatar}
                    alt={story.userName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center font-bold">
                    {story.userName.charAt(0)}
                  </div>
                )}
              </div>
              <div>
                <p className="text-xs font-semibold leading-tight">{story.userName}</p>
                <p className="text-[10px] text-white/70">{story.updatedAt}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Caption & Reply Area */}
        <div className="relative z-20 p-4 pb-6 space-y-3">
          {currentSlide?.caption && (
            <p className="text-sm text-center text-white font-medium bg-black/40 backdrop-blur-md p-2.5 rounded-xl border border-white/10">
              {currentSlide.caption}
            </p>
          )}

          <form onSubmit={handleSendReply} className="flex items-center gap-2">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Yanıtla..."
              className="flex-1 px-4 py-2.5 bg-black/50 border border-white/20 rounded-full text-xs text-white placeholder-white/60 focus:outline-none focus:ring-1 focus:ring-white"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center transition-transform active:scale-90 shrink-0"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
