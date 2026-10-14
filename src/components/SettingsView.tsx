import React from 'react';
import { User, AppTheme } from '../types';
import {
  Shield,
  UserX,
  Lock,
  Smartphone,
  EyeOff,
  UserCheck,
  Palette,
  Radio,
  ChevronRight,
  LogOut
} from 'lucide-react';

interface SettingsViewProps {
  currentUser: User;
  allUsers: User[];
  onSwitchUser: (userId: string) => void;
  onOpenPrivacyModal: () => void;
  onOpenBlockedModal: () => void;
  onOpenProfileEdit: () => void;
  onToggleHidePhone: () => void;
  blockedCount: number;
  deviceOS: any;
  onChangeDeviceOS: (os: any) => void;
  viewMode: any;
  onChangeViewMode: (mode: any) => void;
  currentTheme: AppTheme;
  onOpenThemeSelector: () => void;
  onOpenEmergencyMesh: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  currentUser,
  allUsers,
  onSwitchUser,
  onOpenPrivacyModal,
  onOpenBlockedModal,
  onOpenProfileEdit,
  onToggleHidePhone,
  blockedCount,
  onOpenThemeSelector,
  onOpenEmergencyMesh
}) => {
  return (
    <div className="flex-1 flex flex-col bg-[#0B0F17] text-slate-100 overflow-y-auto pb-20">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0B0F17]/95 backdrop-blur-md z-10">
        <h1 className="text-xl font-bold">Ayarlar</h1>
        <button
          onClick={onOpenThemeSelector}
          className="px-3 py-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-medium flex items-center gap-1.5 hover:bg-cyan-900/50 transition-colors"
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Tema Değiştir</span>
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Profile Card */}
        <div
          onClick={onOpenProfileEdit}
          className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/40"
            />
            <div>
              <h2 className="font-semibold text-base text-slate-100">{currentUser.name}</h2>
              <p className="text-xs text-cyan-400 font-mono">
                {currentUser.username} • {currentUser.hidePhone ? 'Gizli Numara' : currentUser.phone}
              </p>
              <p className="text-xs text-slate-400 mt-1 line-clamp-1">{currentUser.about || 'ChatTR kullanıyorum.'}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-500" />
        </div>

        {/* Theme Card */}
        <div
          onClick={onOpenThemeSelector}
          className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-800/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium">Tema & Neon Renk Paleti</h3>
              <p className="text-xs text-slate-400">Cyber neon, matris ve koyu modlar</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Emergency Mesh */}
        <div
          onClick={onOpenEmergencyMesh}
          className="p-3.5 rounded-xl bg-red-950/20 border border-red-500/30 flex items-center justify-between cursor-pointer hover:bg-red-950/40"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-red-400">İnternetsiz Afet & Deprem Ağı</h3>
              <p className="text-xs text-slate-400">P2P Mesh acil durum iletişimi</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </div>

        {/* Privacy Options */}
        <div className="space-y-2">
          <div className="px-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Gizlilik Ayarları
          </div>

          <div
            onClick={onToggleHidePhone}
            className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <EyeOff className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Telefon Numarasını Gizle</h3>
                <p className="text-xs text-slate-400">Sadece kullanıcı adı (@username) ile iletişim</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={currentUser.hidePhone}
              onChange={() => {}}
              className="w-5 h-5 accent-cyan-500 rounded cursor-pointer"
            />
          </div>

          <div
            onClick={onOpenPrivacyModal}
            className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Gizlilik & Güvenlik</h3>
                <p className="text-xs text-slate-400">Görülme, profil fotoğrafı, uçtan uca şifreleme</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>

          <div
            onClick={onOpenBlockedModal}
            className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center">
                <UserX className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-medium">Engellenen Kişiler</h3>
                <p className="text-xs text-slate-400">{blockedCount} engellenen kullanıcı</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </div>
        </div>

        {/* Profile Switcher (Simülasyon Testi) */}
        <div className="space-y-2 pt-2">
          <div className="px-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Hesap Değiştir (Test Modu)
          </div>

          <div className="grid grid-cols-2 gap-2">
            {allUsers.map((u) => (
              <button
                key={u.id}
                onClick={() => onSwitchUser(u.id)}
                className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                  u.id === currentUser.id
                    ? 'bg-cyan-950/40 border-cyan-500/50 text-cyan-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                <div className="overflow-hidden">
                  <div className="text-xs font-semibold truncate">{u.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono truncate">{u.username}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};