import React, { useState } from 'react';
import {
  Navigation,
  Compass,
  MapPin,
  MessageSquare,
  Hand,
  Users,
  Shield,
  Eye,
  EyeOff,
  Filter,
  Sparkles,
  Lock,
  Palette
} from 'lucide-react';
import { User, DeviceOS, AppTheme } from '../types';
import { THEMES } from '../themeStyles';
import { INITIAL_NEARBY_GROUPS } from '../mockData';

interface NearbyViewProps {
  currentUser: User;
  allUsers: User[];
  locationPermission: 'not_prompted' | 'granted' | 'denied';
  onRequestPermission: () => void;
  onStartChat: (user: User) => void;
  deviceOS: DeviceOS;
  currentTheme?: AppTheme;
  onOpenThemeSelector?: () => void;
}

export const NearbyView: React.FC<NearbyViewProps> = ({
  currentUser,
  allUsers,
  locationPermission,
  onRequestPermission,
  onStartChat,
  deviceOS,
  currentTheme = 'cyber_neon',
  onOpenThemeSelector
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'people' | 'groups'>('people');
  const [selectedRadius, setSelectedRadius] = useState<'500m' | '1km' | '3km' | '10km'>('3km');
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [wavedUsers, setWavedUsers] = useState<Record<string, boolean>>({});
  const [joinedGroups, setJoinedGroups] = useState<Record<string, boolean>>({});

  const isApple = deviceOS === 'apple';
  const theme = THEMES[currentTheme] || THEMES.cyber_neon;

  // Realistic mock distances for other users
  const nearbyPeopleData = allUsers
    .filter((u) => u.id !== currentUser.id)
    .map((user, idx) => {
      const distances = [
        { meters: 180, text: '180 m uzakta' },
        { meters: 340, text: '340 m uzakta' },
        { meters: 620, text: '620 m uzakta' },
        { meters: 1100, text: '1.1 km uzakta' },
        { meters: 2400, text: '2.4 km uzakta' }
      ];
      const dist = distances[idx % distances.length];
      return {
        user,
        distanceMeters: dist.meters,
        distanceText: dist.text
      };
    });

  const filteredPeople = nearbyPeopleData.filter((item) => {
    if (selectedRadius === '500m') return item.distanceMeters <= 500;
    if (selectedRadius === '1km') return item.distanceMeters <= 1000;
    if (selectedRadius === '3km') return item.distanceMeters <= 3000;
    return true;
  });

  const handleWave = (userId: string) => {
    setWavedUsers((prev) => ({ ...prev, [userId]: true }));
  };

  const handleJoinGroup = (groupId: string) => {
    setJoinedGroups((prev) => ({ ...prev, [groupId]: true }));
  };

  // If permission has not been granted yet, show the Permission Prompt Screen styled with active theme
  if (locationPermission !== 'granted') {
    return (
      <div className={`flex-1 flex flex-col h-full ${theme.bgClass} select-none overflow-y-auto transition-colors`}>
        <header className={`px-4 py-3 shrink-0 flex items-center justify-between ${theme.headerClass}`}>
          <h1 className={`text-xl font-bold tracking-tight ${theme.textPrimary}`}>
            Yakındakiler
          </h1>
          {onOpenThemeSelector && (
            <button
              type="button"
              onClick={onOpenThemeSelector}
              className="p-2 rounded-full hover:bg-white/10 text-cyan-400 transition-colors"
              title="Tema Seç"
            >
              <Palette className="w-5 h-5" />
            </button>
          )}
        </header>

        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto">
          <div className="relative mb-6">
            <div className={`w-24 h-24 rounded-full ${theme.cardClass} flex items-center justify-center ${theme.neonGlow}`}>
              <Navigation className="w-12 h-12 text-cyan-400 transform -rotate-45 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-cyan-400/40 animate-ping pointer-events-none" />
          </div>

          <h2 className={`text-xl font-bold ${theme.textPrimary} mb-2`}>
            Yakınınızdaki Kişileri Keşfedin
          </h2>

          <p className={`text-xs ${theme.textSecondary} leading-relaxed mb-6`}>
            Çevrenizdeki diğer kullanıcıları bulmak, selam vermek ve yerel mahalle gruplarına katılmak için konum izni gereklidir.
          </p>

          <div className={`w-full ${theme.cardClass} p-4 rounded-3xl text-left space-y-2.5 mb-6 text-xs backdrop-blur-xl`}>
            <div className={`flex items-center gap-2 ${theme.textPrimary} font-medium`}>
              <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Gizlilik Öncelikli Yaklaşım</span>
            </div>
            <p className={`pl-6 text-[11px] ${theme.textSecondary}`}>
              • Kesin konumunuz asla paylaşılmaz, yalnızca mesafe aralığı gösterilir.
            </p>
            <p className={`pl-6 text-[11px] ${theme.textSecondary}`}>
              • Telefon numaranız gizliyse, diğer kişiler yalnızca kullanıcı adınızı (@{currentUser.username}) görür.
            </p>
          </div>

          <button
            type="button"
            onClick={onRequestPermission}
            className={`w-full py-3.5 ${theme.accentColor} font-bold text-sm rounded-2xl ${theme.neonGlow} transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer`}
          >
            <MapPin className="w-4 h-4" />
            <span>Konum İznini Aç ve Başlat</span>
          </button>
        </div>
      </div>
    );
  }

  // Permission is GRANTED: Show Radar & Discovery Feed
  return (
    <div className={`flex-1 flex flex-col h-full ${theme.bgClass} select-none overflow-y-auto transition-colors`}>
      {/* Header */}
      <header className={`px-4 py-3 shrink-0 flex items-center justify-between ${theme.headerClass}`}>
        <div className="flex items-center gap-2.5">
          <h1 className={`text-xl font-bold tracking-tight ${theme.textPrimary}`}>
            Yakındakiler
          </h1>
          <span className="flex items-center gap-1 text-[10px] font-semibold bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 px-2.5 py-0.5 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.25)]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Canlı Radar
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
            onClick={() => setIsDiscoverable(!isDiscoverable)}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full flex items-center gap-1.5 transition-all cursor-pointer ${
              isDiscoverable
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                : 'bg-slate-800 text-slate-400 border border-slate-700'
            }`}
            title="Beni yakındakilere göster veya gizle"
          >
            {isDiscoverable ? (
              <>
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Görünürüm</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>Gizliyim</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Radar Visual Strip */}
      <div className="p-4 mx-3 my-2 rounded-3xl bg-gradient-to-r from-slate-900 via-[#131b2a] to-slate-900 border border-cyan-500/25 text-white shrink-0 relative overflow-hidden shadow-lg">
        {/* Subtle background radar circles */}
        <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full border border-cyan-500/10 pointer-events-none" />
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full border border-cyan-500/5 pointer-events-none" />

        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
              <Compass className="w-6 h-6 text-cyan-400 animate-spin-slow" />
              <div className="absolute inset-0 rounded-2xl border border-cyan-400/40 animate-ping" />
            </div>
            <div>
              <p className="text-xs font-semibold text-white flex items-center gap-1.5">
                <span>Çevreniz Taranıyor</span>
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </p>
              <p className="text-[11px] text-cyan-200/80">
                {isDiscoverable
                  ? 'Kullanıcılar sizi yaklaşık mesafe ile görebilir'
                  : 'Gizli mod: Diğer kullanıcılar sizi görmez'}
              </p>
            </div>
          </div>

          {currentUser.hidePhone && (
            <span className="text-[10px] bg-cyan-500/20 border border-cyan-500/30 px-2.5 py-1 rounded-full text-cyan-300 font-mono flex items-center gap-1 shadow-xs">
              <Lock className="w-3 h-3" />
              Gizli Numara
            </span>
          )}
        </div>

        {/* Distance Filter Selector */}
        <div className="mt-3 pt-3 border-t border-cyan-500/15 flex items-center justify-between text-xs">
          <span className="text-[11px] text-cyan-200/70 flex items-center gap-1 font-medium">
            <Filter className="w-3 h-3" /> Tarama Mesafesi:
          </span>
          <div className="flex items-center gap-1.5">
            {(['500m', '1km', '3km', '10km'] as const).map((rad) => (
              <button
                key={rad}
                type="button"
                onClick={() => setSelectedRadius(rad)}
                className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
                  selectedRadius === rad
                    ? 'bg-cyan-500 text-black shadow-[0_0_12px_rgba(6,182,212,0.6)]'
                    : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                {rad}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs: Kişiler vs Gruplar - Sleek segmented pill */}
      <div className={`mx-3 p-1 rounded-2xl ${theme.cardClass} flex items-center gap-1`}>
        <button
          type="button"
          onClick={() => setActiveSubTab('people')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'people'
              ? `${theme.accentColor} ${theme.neonGlow} shadow-md`
              : `${theme.textSecondary} hover:${theme.textPrimary}`
          }`}
        >
          Yakındaki Kişiler ({filteredPeople.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('groups')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'groups'
              ? `${theme.accentColor} ${theme.neonGlow} shadow-md`
              : `${theme.textSecondary} hover:${theme.textPrimary}`
          }`}
        >
          Yerel Gruplar ({INITIAL_NEARBY_GROUPS.length})
        </button>
      </div>

      {/* Content List */}
      <div className="p-3 space-y-2.5 flex-1">
        {activeSubTab === 'people' ? (
          filteredPeople.length === 0 ? (
            <div className={`py-14 text-center ${theme.textSecondary}`}>
              <MapPin className="w-10 h-10 mx-auto text-cyan-400/40 stroke-1 mb-2 animate-bounce" />
              <p className={`text-sm font-semibold ${theme.textPrimary}`}>Bu mesafede kullanıcı yok</p>
              <p className="text-xs opacity-75 mt-1">
                Arama mesafesini artırarak (örn. 3km veya 10km) daha fazla kişi görebilirsiniz.
              </p>
            </div>
          ) : (
            filteredPeople.map(({ user, distanceText }) => {
              const hasWaved = wavedUsers[user.id];

              return (
                <div
                  key={user.id}
                  className={`p-3 rounded-2xl border transition-all ${theme.cardClass} hover:border-cyan-400/40 flex items-start justify-between gap-3 group`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shrink-0 flex items-center justify-center font-bold text-white bg-slate-800 border border-white/10 shadow-sm">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        user.name.charAt(0)
                      )}
                      {user.isOnline && (
                        <span className="absolute bottom-1 right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-sm font-bold ${theme.textPrimary} truncate`}>
                          {user.name}
                        </span>
                        <span className="text-[11px] font-mono text-cyan-400/90 font-medium">
                          @{user.username}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-0.5 text-xs">
                        <span className="font-semibold text-cyan-400 flex items-center gap-1 font-mono text-[11px]">
                          <MapPin className="w-3 h-3 text-cyan-400" />
                          {distanceText}
                        </span>

                        {user.hidePhone ? (
                          <span className="text-[10px] text-amber-300 bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 rounded-full font-sans">
                            Numara Gizli
                          </span>
                        ) : (
                          <span className={`text-[11px] ${theme.textSecondary} opacity-70`}>
                            {user.phone}
                          </span>
                        )}
                      </div>

                      <p className={`text-xs ${theme.textSecondary} mt-1 truncate max-w-xs opacity-85`}>
                        {user.bio}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={() => handleWave(user.id)}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 cursor-pointer ${
                        hasWaved
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                          : 'bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10'
                      }`}
                      title="Selam Ver"
                    >
                      <Hand className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">
                        {hasWaved ? 'Selam Verildi' : 'Selam Ver'}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onStartChat(user)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold ${theme.accentColor} flex items-center gap-1 shadow-md transition-all active:scale-95 cursor-pointer`}
                      title="Sohbet Başlat"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Mesaj</span>
                    </button>
                  </div>
                </div>
              );
            })
          )
        ) : (
          /* Groups Tab */
          INITIAL_NEARBY_GROUPS.map((grp) => {
            const isJoined = joinedGroups[grp.id];

            return (
              <div
                key={grp.id}
                className={`p-3.5 rounded-2xl border transition-all ${theme.cardClass} hover:border-cyan-400/40 flex items-start justify-between gap-3`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg shrink-0 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                    <Users className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className={`text-sm font-bold ${theme.textPrimary} truncate`}>
                      {grp.name}
                    </h3>
                    <div className={`flex items-center gap-2 text-xs ${theme.textSecondary} mt-0.5`}>
                      <span className="text-cyan-400 font-semibold font-mono flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {grp.distanceText}
                      </span>
                      <span>·</span>
                      <span>{grp.memberCount} üye</span>
                    </div>
                    <p className={`text-xs ${theme.textSecondary} mt-1 leading-relaxed opacity-90`}>
                      {grp.description}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleJoinGroup(grp.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 shrink-0 cursor-pointer ${
                    isJoined
                      ? 'bg-white/10 text-slate-300 border border-white/10'
                      : `${theme.accentColor} shadow-md`
                  }`}
                >
                  {isJoined ? 'Katıldınız' : 'Katıl'}
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Safety Notice Footer */}
      <div className={`mx-3 mb-3 p-3 rounded-2xl ${theme.cardClass} text-[11px] ${theme.textSecondary} flex items-center justify-center gap-2 text-center`}>
        <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
        <span>
          Konumunuz yalnızca mesafeyi hesaplamak içindir; kesin harita adresiniz asla saklanmaz veya paylaşılmaz.
        </span>
      </div>
    </div>
  );
};
