import React from 'react';
import {
  Wifi,
  Battery,
  Signal,
  Apple,
  Smartphone,
  Monitor,
  Shield,
  PhoneOff,
  UserCheck,
  Radio,
  Palette
} from 'lucide-react';
import { DeviceOS, AppViewMode, User, AppTheme } from '../types';
import { THEMES } from '../themeStyles';

interface MobileFrameProps {
  deviceOS: DeviceOS;
  viewMode: AppViewMode;
  onChangeDeviceOS: (os: DeviceOS) => void;
  onChangeViewMode: (mode: AppViewMode) => void;
  currentUser: User;
  currentTheme: AppTheme;
  onOpenThemeSelector: () => void;
  onOpenEmergencyMesh: () => void;
  children: React.ReactNode;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  deviceOS,
  viewMode,
  onChangeDeviceOS,
  onChangeViewMode,
  currentUser,
  currentTheme,
  onOpenThemeSelector,
  onOpenEmergencyMesh,
  children
}) => {
  const theme = THEMES[currentTheme] || THEMES.cyber_neon;
  const isApple = deviceOS === 'apple';

  // Current time for status bar
  const currentTime = new Date().toLocaleTimeString('tr-TR', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-start sm:py-6 px-0 sm:px-4 text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Utility Bar (Control Bar) */}
      <header className="w-full max-w-5xl mb-4 px-4 py-2.5 bg-slate-800/90 backdrop-blur-xl rounded-full border border-slate-700/80 flex flex-wrap items-center justify-between gap-3 shadow-xl shrink-0">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${theme.accentColor} ${theme.neonGlow} flex items-center justify-center font-bold text-lg shadow-md`}>
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-white tracking-tight">SohbetApp</h1>
              <span className="text-[10px] font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                {theme.name}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Oval Modern Arayüz & Afet Mesh Ağı (@{currentUser.username})
            </p>
          </div>
        </div>

        {/* Quick Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Emergency Mesh Alert Button */}
          <button
            type="button"
            onClick={onOpenEmergencyMesh}
            className="px-3.5 py-1.5 rounded-full bg-rose-600/30 hover:bg-rose-600/50 text-rose-300 border border-rose-500/50 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-[0_0_15px_rgba(244,63,94,0.35)] animate-pulse"
          >
            <Radio className="w-4 h-4 text-rose-400" />
            <span>Afet Modu (İnternetsiz)</span>
          </button>

          {/* Theme Selector Button */}
          <button
            type="button"
            onClick={onOpenThemeSelector}
            className="px-3.5 py-1.5 rounded-full bg-cyan-950/80 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 transition-all shadow-[0_0_12px_rgba(6,182,212,0.25)]"
          >
            <Palette className="w-3.5 h-3.5 text-cyan-400" />
            <span>{theme.name}</span>
          </button>

          {/* OS Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-full border border-slate-700">
            <button
              type="button"
              onClick={() => onChangeDeviceOS('apple')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isApple
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Apple className="w-3.5 h-3.5" />
              Apple (iOS)
            </button>
            <button
              type="button"
              onClick={() => onChangeDeviceOS('android')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                !isApple
                  ? `${theme.accentColor} font-bold shadow-sm`
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              Android
            </button>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-full border border-slate-700">
            <button
              type="button"
              onClick={() => onChangeViewMode('frame')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'frame'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Mobil Cihaz Çerçevesi"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Telefon</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeViewMode('responsive')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all ${
                viewMode === 'responsive'
                  ? 'bg-slate-700 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Web & Geniş Ekran Görünümü"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Web</span>
            </button>
          </div>

          {/* Active User Pill */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-700">
            <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-800 border border-white/20 flex items-center justify-center font-bold text-xs text-white">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                currentUser.name.charAt(0)
              )}
            </div>
            <div className="hidden md:block text-left leading-tight">
              <p className="text-xs font-semibold text-slate-200">{currentUser.name}</p>
              <p className="text-[10px] text-cyan-400 font-mono">
                {currentUser.hidePhone ? '🛡️ Numara Gizli' : currentUser.phone}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      {viewMode === 'frame' ? (
        /* Mobile Smartphone Bezel Frame */
        <div className="relative my-auto pb-4">
          <div
            className={`w-[390px] sm:w-[410px] h-[820px] max-h-[92vh] bg-black shadow-2xl relative flex flex-col overflow-hidden transition-all duration-300 ${
              isApple
                ? 'rounded-[50px] border-[10px] border-slate-800 ring-1 ring-cyan-500/20 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]'
                : 'rounded-[40px] border-[8px] border-slate-800 ring-1 ring-cyan-500/20 shadow-2xl'
            }`}
          >
            {/* Phone Status Bar */}
            <div
              className={`h-11 px-6 flex items-center justify-between text-xs font-semibold z-40 select-none shrink-0 ${
                isApple
                  ? 'bg-transparent text-white absolute top-0 left-0 right-0'
                  : `${theme.headerClass} text-white`
              }`}
            >
              <span className="font-mono tracking-tight text-[13px]">{currentTime}</span>

              {/* Apple Dynamic Island / Android Camera Punch hole */}
              {isApple ? (
                <div className="w-28 h-6 bg-black rounded-full flex items-center justify-end px-2 gap-1.5 shadow-sm border border-white/10">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
                </div>
              ) : (
                <div className="w-3.5 h-3.5 bg-black rounded-full border border-white/10" />
              )}

              <div className="flex items-center gap-1.5">
                <Signal className="w-3.5 h-3.5" />
                <Wifi className="w-3.5 h-3.5" />
                <Battery className="w-4 h-4" />
              </div>
            </div>

            {/* Application Screen Container */}
            <div className={`flex-1 flex flex-col overflow-hidden relative ${isApple ? 'pt-11' : ''}`}>
              {children}
            </div>

            {/* Apple Home Bar Indicator */}
            {isApple && (
              <div className="h-4 bg-black/80 flex items-center justify-center shrink-0 z-40">
                <div className="w-32 h-1 bg-white/40 rounded-full" />
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Full Desktop / Tablet Web WhatsApp Layout */
        <div className={`w-full max-w-6xl h-[840px] max-h-[88vh] ${theme.bgClass} rounded-3xl border border-slate-800 shadow-2xl flex overflow-hidden`}>
          {children}
        </div>
      )}
    </div>
  );
};
