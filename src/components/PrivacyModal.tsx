import React, { useState } from 'react';
import { X, Shield, Lock, Eye, Users, Globe } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  const [lastSeen, setLastSeen] = useState<'everyone' | 'contacts' | 'nobody'>('everyone');
  const [profilePhoto, setProfilePhoto] = useState<'everyone' | 'contacts' | 'nobody'>('everyone');
  const [statusPrivacy, setStatusPrivacy] = useState<'everyone' | 'contacts' | 'nobody'>('contacts');
  const [readReceipts, setReadReceipts] = useState(true);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-md bg-[#0B0F17] border border-slate-800 text-slate-100 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-semibold text-slate-100">Gizlilik ve Güvenlik</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto space-y-5">
          {/* Son Görülme */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">Son Görülme ve Çevrimiçi</label>
            <div className="space-y-1 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-300 font-medium">Son görülmemi kimler görebilir?</p>
              <select
                value={lastSeen}
                onChange={(e) => setLastSeen(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="everyone">Herkes</option>
                <option value="contacts">Kişilerim</option>
                <option value="nobody">Hiç kimse</option>
              </select>
            </div>
          </div>

          {/* Profil Fotoğrafı */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">Profil Fotoğrafı</label>
            <div className="space-y-1 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-300 font-medium">Profil fotoğrafımı kimler görebilir?</p>
              <select
                value={profilePhoto}
                onChange={(e) => setProfilePhoto(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="everyone">Herkes</option>
                <option value="contacts">Kişilerim</option>
                <option value="nobody">Hiç kimse</option>
              </select>
            </div>
          </div>

          {/* Durum / Hakkında */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">Hakkımda / Durum</label>
            <div className="space-y-1 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
              <p className="text-xs text-slate-300 font-medium">Durumumu kimler görebilir?</p>
              <select
                value={statusPrivacy}
                onChange={(e) => setStatusPrivacy(e.target.value as any)}
                className="w-full mt-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              >
                <option value="everyone">Herkes</option>
                <option value="contacts">Kişilerim</option>
                <option value="nobody">Hiç kimse</option>
              </select>
            </div>
          </div>

          {/* Okundu Bilgisi */}
          <div className="flex items-center justify-between bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
            <div>
              <p className="text-xs font-semibold text-slate-200">Okundu Bilgileri</p>
              <p className="text-[10px] text-slate-400">Kapatırsanız başkalarının mesaj okundu bilgisini göremezsiniz</p>
            </div>
            <input
              type="checkbox"
              checked={readReceipts}
              onChange={(e) => setReadReceipts(e.target.checked)}
              className="w-4 h-4 accent-amber-400 cursor-pointer"
            />
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};