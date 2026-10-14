import React from 'react';
import { Palette, Check, Sparkles, X, Sun, Moon } from 'lucide-react';
import { AppTheme } from '../types';
import { THEMES } from '../themeStyles';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppTheme;
  onSelectTheme: (theme: AppTheme) => void;
  isApple: boolean;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
  isApple
}) => {
  if (!isOpen) return null;

  const themeList = Object.values(THEMES);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md bg-[#111622] border border-cyan-500/20 text-white overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${
          isApple ? 'rounded-3xl' : 'rounded-3xl'
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Palette className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Tema & Neon Renkler</h3>
              <p className="text-[11px] text-slate-400">
                Oval modern arayüz ve ışıltılı neon paletleri
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto space-y-2.5 flex-1">
          {themeList.map((t) => {
            const isSelected = currentTheme === t.id;

            return (
              <div
                key={t.id}
                onClick={() => {
                  onSelectTheme(t.id);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                  isSelected
                    ? 'border-cyan-400 bg-white/10 shadow-[0_0_20px_rgba(6,182,212,0.25)] ring-1 ring-cyan-400'
                    : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Theme swatch preview circle */}
                  <div className="w-10 h-10 rounded-2xl overflow-hidden flex items-center justify-center p-1 relative border border-white/20 shrink-0">
                    <div className={`w-full h-full rounded-xl ${t.bgClass} flex items-center justify-center`}>
                      <span className={`w-4 h-4 rounded-full ${t.accentColor}`} />
                    </div>
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{t.name}</span>
                      {isSelected && (
                        <span className="text-[10px] font-semibold text-cyan-300 bg-cyan-950 px-1.5 py-0.2 rounded-full border border-cyan-500/30">
                          Aktif
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{t.badge}</p>
                  </div>
                </div>

                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-cyan-500 border-cyan-400 text-black'
                      : 'border-slate-600'
                  }`}
                >
                  {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Oval mesaj baloncukları ve neon hatlar
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-white bg-slate-800 hover:bg-slate-700 rounded-xl"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
