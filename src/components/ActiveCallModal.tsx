import React, { useState, useEffect } from 'react';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { User } from '../types';

interface ActiveCallModalProps {
  isOpen: boolean;
  contact: User | null;
  callType: 'audio' | 'video';
  onEndCall: () => void;
  isApple: boolean;
}

export const ActiveCallModal: React.FC<ActiveCallModalProps> = ({
  isOpen,
  contact,
  callType,
  onEndCall,
  isApple
}) => {
  const [callState, setCallState] = useState<'ringing' | 'connected'>('ringing');
  const [seconds, setSeconds] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(callType === 'video');
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    if (!isOpen) {
      setCallState('ringing');
      setSeconds(0);
      return;
    }

    // Connect call after 2 seconds
    const timer = setTimeout(() => {
      setCallState('connected');
    }, 2200);

    return () => clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    let interval: any = null;
    if (isOpen && callState === 'connected') {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, callState]);

  if (!isOpen || !contact) return null;

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const formattedDuration = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-sm h-[600px] overflow-hidden shadow-2xl relative flex flex-col justify-between text-white ${
          isApple ? 'rounded-[38px] border-4 border-slate-800' : 'rounded-[32px] border-2 border-slate-700'
        } ${
          callType === 'video' && isVideoEnabled
            ? 'bg-slate-900'
            : 'bg-gradient-to-b from-slate-900 via-emerald-950 to-slate-950'
        }`}
      >
        {/* Background Video simulation */}
        {callType === 'video' && isVideoEnabled && (
          <div className="absolute inset-0 z-0">
            {contact.avatar ? (
              <img
                src={contact.avatar}
                alt={contact.name}
                className="w-full h-full object-cover opacity-85 filter brightness-90"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center text-6xl">
                👤
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80" />

            {/* Self floating preview */}
            <div className="absolute top-16 right-4 w-24 h-36 bg-slate-800/90 rounded-2xl border-2 border-white/30 overflow-hidden shadow-lg flex items-center justify-center">
              <span className="text-[11px] text-white/80 font-medium">Ön Kamera</span>
            </div>
          </div>
        )}

        {/* Top Info Zone */}
        <div className="relative z-10 pt-12 px-6 flex flex-col items-center text-center">
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Uçtan Uca Şifreli</span>
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">{contact.name}</h2>
          <p className="text-xs text-white/70 font-mono mt-0.5">@{contact.username}</p>

          <p className="text-sm font-medium mt-3 text-emerald-300 font-mono">
            {callState === 'ringing' ? 'Çalıyor...' : formattedDuration}
          </p>

          {/* Large Avatar for Audio Call */}
          {(!isVideoEnabled || callType === 'audio') && (
            <div className="mt-8 relative">
              <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl relative z-10">
                {contact.avatar ? (
                  <img
                    src={contact.avatar}
                    alt={contact.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-emerald-700 text-white font-bold text-4xl">
                    {contact.name.charAt(0)}
                  </div>
                )}
              </div>
              {callState === 'ringing' && (
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400/50 animate-ping" />
              )}
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="relative z-10 p-6 pb-8 bg-gradient-to-t from-black/90 to-transparent">
          <div className="grid grid-cols-4 gap-3 mb-6">
            <button
              type="button"
              onClick={() => setIsSpeaker(!isSpeaker)}
              className={`h-12 rounded-full flex flex-col items-center justify-center transition-colors ${
                isSpeaker ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              {isSpeaker ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              <span className="text-[10px] mt-0.5 font-medium">Hoparlör</span>
            </button>

            <button
              type="button"
              onClick={() => setIsVideoEnabled(!isVideoEnabled)}
              className={`h-12 rounded-full flex flex-col items-center justify-center transition-colors ${
                isVideoEnabled ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70'
              }`}
            >
              {isVideoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              <span className="text-[10px] mt-0.5 font-medium">Kamera</span>
            </button>

            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className={`h-12 rounded-full flex flex-col items-center justify-center transition-colors ${
                isMuted ? 'bg-white/30 text-rose-300' : 'bg-white/10 text-white/70'
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              <span className="text-[10px] mt-0.5 font-medium">Sessiz</span>
            </button>

            <button
              type="button"
              className="h-12 rounded-full bg-white/10 hover:bg-white/20 text-white/70 flex flex-col items-center justify-center transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="text-[10px] mt-0.5 font-medium">Döndür</span>
            </button>
          </div>

          {/* End Call Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={onEndCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-700 text-white flex items-center justify-center shadow-xl active:scale-90 transition-transform"
              title="Aramayı Sonlandır"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
