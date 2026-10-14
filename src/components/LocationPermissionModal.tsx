import React, { useState } from 'react';
import {
  ShieldCheck,
  PhoneOff,
  Navigation,
  Eye,
  X,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AppTheme } from '../types';
import { THEMES } from '../themeStyles';

interface LocationPermissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGrantPermission: () => void;
  onDenyPermission: () => void;
  isApple: boolean;
  userHidesPhone: boolean;
  username: string;
  currentTheme?: AppTheme;
}

export const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({
  isOpen,
  onClose,
  onGrantPermission,
  onDenyPermission,
  userHidesPhone,
  username,
  currentTheme = 'cyber_neon'
}) => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const theme = THEMES[currentTheme] || THEMES.cyber_neon;

  const handleAllow = () => {
    setIsRequesting(true);
    setErrorMsg(null);

    // Try standard browser geolocation API if available
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setIsRequesting(false);
          onGrantPermission();
        },
        (err) => {
          // If browser blocked it in iframe, still grant app-level permission gracefully
          console.warn('Browser geolocation note:', err.message);
          setIsRequesting(false);
          onGrantPermission();
        },
        { timeout: 5000, enableHighAccuracy: false }
      );
    } else {
      setIsRequesting(false);
      onGrantPermission();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className={`w-full max-w-md ${theme.cardClass} border border-cyan-500/30 overflow-hidden shadow-2xl flex flex-col rounded-3xl`}
      >
        {/* Top visual graphic with pulsing radar effect */}
        <div className="relative bg-gradient-to-b from-slate-900 via-[#131b2a] to-slate-950 p-6 text-white text-center flex flex-col items-center justify-center overflow-hidden border-b border-cyan-500/20">
          {/* Subtle radar circle effects */}
          <div className="absolute w-44 h-44 rounded-full border border-cyan-500/10 animate-ping pointer-events-none" />
          <div className="absolute w-32 h-32 rounded-full border border-cyan-500/20 pointer-events-none" />
          <div className="absolute w-20 h-20 rounded-full border border-cyan-500/30 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors z-10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Main Icon */}
          <div className="relative z-10 w-16 h-16 rounded-2xl bg-cyan-500/15 backdrop-blur-md border border-cyan-400/40 text-cyan-400 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(6,182,212,0.4)]">
            <Navigation className="w-8 h-8 transform -rotate-45" />
          </div>

          <h3 className={`relative z-10 text-lg font-bold ${theme.textPrimary} tracking-tight`}>
            Yakındaki Kişileri Gör
          </h3>
          <p className={`relative z-10 text-xs ${theme.textSecondary} max-w-xs mt-1 leading-relaxed opacity-90`}>
            Çevrenizdeki diğer kullanıcıları ve yerel grupları keşfetmek için konum iznine ihtiyacımız var.
          </p>
        </div>

        {/* Permission Privacy Guarantees */}
        <div className="p-5 space-y-3.5">
          <p className={`text-xs font-bold uppercase tracking-wider px-1 text-cyan-400/80`}>
            Gizlilik ve Güvenlik Güvenceleri
          </p>

          <div className="space-y-3">
            <div className={`flex items-start gap-3 p-3 rounded-2xl border ${theme.cardClass}`}>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className={`font-bold ${theme.textPrimary} block`}>
                  Yaklaşık Mesafe Gösterilir
                </span>
                <span className={`${theme.textSecondary} leading-relaxed opacity-80`}>
                  Kesin konumunuz veya sokak adresiniz asla paylaşılmaz; sadece yaklaşık mesafe (örn: 350 m) gösterilir.
                </span>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-3 rounded-2xl border ${theme.cardClass}`}>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <PhoneOff className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className={`font-bold ${theme.textPrimary} block`}>
                  Telefon Numaranız Korunur
                </span>
                <span className={`${theme.textSecondary} leading-relaxed opacity-80`}>
                  {userHidesPhone ? (
                    <span>
                      Numaranız gizli olduğu için diğer kişiler yalnızca{' '}
                      <strong className="text-cyan-400">@{username}</strong> kullanıcı adınızı görür.
                    </span>
                  ) : (
                    <span>
                      İstediğiniz an profilinizden numaranızı gizleyerek yalnızca kullanıcı adınızla görünebilirsiniz.
                    </span>
                  )}
                </span>
              </div>
            </div>

            <div className={`flex items-start gap-3 p-3 rounded-2xl border ${theme.cardClass}`}>
              <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <Eye className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <span className={`font-bold ${theme.textPrimary} block`}>
                  İstediğiniz Zaman Kapatabilirsiniz
                </span>
                <span className={`${theme.textSecondary} leading-relaxed opacity-80`}>
                  Tek dokunuşla görünürlüğünüzü gizleyebilir veya konum erişimini durdurabilirsiniz.
                </span>
              </div>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="p-4 border-t border-cyan-500/15 flex flex-col sm:flex-row items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onDenyPermission}
            className={`w-full sm:w-auto px-4 py-2.5 text-xs font-semibold ${theme.textSecondary} hover:${theme.textPrimary} rounded-xl transition-colors order-2 sm:order-1 cursor-pointer`}
          >
            Şimdi Değil
          </button>
          <button
            type="button"
            onClick={handleAllow}
            disabled={isRequesting}
            className={`w-full sm:w-auto px-5 py-2.5 text-xs font-bold ${theme.accentColor} active:scale-95 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 order-1 sm:order-2 cursor-pointer`}
          >
            {isRequesting ? (
              <span>Konum Alınıyor...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>İzin Ver ve Başlat</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
