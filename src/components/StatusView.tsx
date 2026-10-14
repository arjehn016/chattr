import React, { useState } from 'react';
import { Plus, Camera, Shield, Palette, Sparkles, Clock } from 'lucide-react';
import { UserStory, User, DeviceOS, AppTheme } from '../types';
import { THEMES } from '../themeStyles';

interface StatusViewProps {
  stories: UserStory[];
  currentUser: User;
  onSelectStory: (story: UserStory) => void;
  onAddStory: (caption: string, mediaUrl?: string) => void;
  deviceOS: DeviceOS;
  currentTheme?: AppTheme;
  onOpenThemeSelector?: () => void;
}

export const StatusView: React.FC<StatusViewProps> = ({
  stories,
  currentUser,
  onSelectStory,
  onAddStory,
  deviceOS,
  currentTheme = 'cyber_neon',
  onOpenThemeSelector
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [caption, setCaption] = useState('');

  const isApple = deviceOS === 'apple';
  const theme = THEMES[currentTheme] || THEMES.cyber_neon;

  const unviewedStories = stories.filter((s) => !s.isViewed);
  const viewedStories = stories.filter((s) => s.isViewed);

  const handleCreateStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) return;
    onAddStory(caption.trim());
    setCaption('');
    setShowAddModal(false);
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${theme.bgClass} select-none overflow-y-auto transition-colors`}>
      {/* Header */}
      <header className={`px-4 py-3 shrink-0 flex items-center justify-between ${theme.headerClass}`}>
        <div className="flex items-center gap-2">
          <h1 className={`text-xl font-bold tracking-tight ${theme.textPrimary}`}>
            {isApple ? 'Güncellemeler' : 'Durum'}
          </h1>
          <span className="flex items-center gap-1 text-[10px] font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            24 Saatlik
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenThemeSelector && (
            <button
              type="button"
              onClick={onOpenThemeSelector}
              className="p-1.5 rounded-full hover:bg-white/10 text-cyan-400 transition-colors"
              title="Tema Seç"
            >
              <Palette className="w-4 h-4" />
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className={`p-2 rounded-full ${theme.accentColor} transition-transform active:scale-95 shadow-md flex items-center justify-center cursor-pointer`}
            title="Durum Ekle"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <div className="p-3 space-y-4">
        {/* My Status Card */}
        <div
          onClick={() => setShowAddModal(true)}
          className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all ${theme.cardClass} hover:border-cyan-400/40 cursor-pointer group`}
        >
          <div className="relative w-13 h-13 rounded-2xl bg-slate-800 overflow-hidden shrink-0 flex items-center justify-center font-bold text-white border border-white/10 shadow-sm">
            {currentUser.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            ) : (
              currentUser.name.charAt(0)
            )}
            <div className={`absolute bottom-0 right-0 w-4 h-4 ${theme.accentColor} rounded-full flex items-center justify-center border-2 border-slate-900 shadow-sm`}>
              <Plus className="w-3 h-3 stroke-[3]" />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className={`text-sm font-bold ${theme.textPrimary}`}>Durumum</h3>
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 opacity-80" />
            </div>
            <p className={`text-xs ${theme.textSecondary} mt-0.5 opacity-80`}>
              Durum güncellemesi eklemek için dokunun
            </p>
          </div>
        </div>

        {/* Unviewed Stories Section */}
        {unviewedStories.length > 0 && (
          <div className="space-y-2 pt-1">
            <h4 className={`text-xs font-bold uppercase tracking-wider px-2 text-cyan-400/90 flex items-center gap-1.5`}>
              <Clock className="w-3.5 h-3.5" />
              <span>Son Güncellemeler</span>
            </h4>
            <div className="space-y-2">
              {unviewedStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => onSelectStory(story)}
                  className={`p-3 rounded-2xl border transition-all ${theme.cardClass} hover:border-cyan-400/40 flex items-center gap-3.5 cursor-pointer group`}
                >
                  {/* Glowing neon story ring */}
                  <div className="relative p-0.5 rounded-2xl bg-gradient-to-tr from-cyan-400 via-teal-400 to-emerald-400 shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.4)]">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-white">
                      {story.userAvatar ? (
                        <img
                          src={story.userAvatar}
                          alt={story.userName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        story.userName.charAt(0)
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${theme.textPrimary} truncate`}>
                      {story.userName}
                    </p>
                    <p className={`text-xs ${theme.textSecondary} font-mono mt-0.5 opacity-80`}>
                      {story.updatedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Viewed Stories Section */}
        {viewedStories.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className={`text-xs font-semibold uppercase tracking-wider px-2 ${theme.textSecondary} opacity-70`}>
              Görüntülenen Güncellemeler
            </h4>
            <div className="space-y-2 opacity-80">
              {viewedStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => onSelectStory(story)}
                  className={`p-3 rounded-2xl border transition-all ${theme.cardClass} flex items-center gap-3.5 cursor-pointer`}
                >
                  <div className="relative p-0.5 rounded-2xl border border-white/20 shrink-0">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center font-bold text-white">
                      {story.userAvatar ? (
                        <img
                          src={story.userAvatar}
                          alt={story.userName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        story.userName.charAt(0)
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-bold ${theme.textPrimary} truncate`}>
                      {story.userName}
                    </p>
                    <p className={`text-xs ${theme.textSecondary} font-mono mt-0.5 opacity-70`}>
                      {story.updatedAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Privacy Info */}
        <div className={`p-3.5 rounded-2xl border ${theme.cardClass} flex items-center gap-3 text-xs ${theme.textSecondary}`}>
          <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
          <p className="leading-relaxed">
            Durum güncellemeleriniz uçtan uca şifrelidir ve 24 saat sonra kendiliğinden silinir.
          </p>
        </div>
      </div>

      {/* Add Story Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div
            className={`w-full max-w-sm ${theme.cardClass} border border-cyan-500/30 overflow-hidden shadow-2xl p-5 rounded-3xl`}
          >
            <h3 className={`text-base font-bold ${theme.textPrimary} mb-1 flex items-center gap-2`}>
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Yeni Durum Paylaş
            </h3>
            <p className={`text-xs ${theme.textSecondary} mb-4`}>
              Kişilerinize 24 saat boyunca görünecek anlık bir durum yazın.
            </p>

            <form onSubmit={handleCreateStatus} className="space-y-4">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Ne düşünüyorsunuz?..."
                rows={3}
                className={`w-full p-3.5 rounded-2xl text-sm border focus:outline-none transition-all ${theme.inputPill}`}
                autoFocus
              />

              <div className="flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`px-4 py-2 text-xs font-semibold ${theme.textSecondary} hover:${theme.textPrimary} cursor-pointer`}
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  disabled={!caption.trim()}
                  className={`px-5 py-2 text-xs font-bold ${theme.accentColor} disabled:opacity-50 rounded-xl shadow-md cursor-pointer`}
                >
                  Paylaş
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
