import React, { useState } from 'react';
import { X, Camera, AtSign, Phone, User as UserIcon, Sparkles } from 'lucide-react';
import { User } from '../types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSave: (updatedFields: Partial<User>) => void;
  isApple: boolean;
}

const PRESET_BIOS = [
  'ChatTR kullanıyorum.',
  'Güvenli ve uçtan uca şifreli iletişim.',
  'Afet ve acil durum iletişim ağı aktif.',
  'Müsait değil, mesh ağında.',
  'Yalnızca @kullaniciadi ile iletişimde.'
];

export const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSave,
  isApple
}) => {
  const [name, setName] = useState(currentUser.name);
  const [username, setUsername] = useState(currentUser.username);
  const [phone, setPhone] = useState(currentUser.phone);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(
    currentUser.avatar && currentUser.avatar.includes('unsplash.com/photo-1534528741775-53994a69daeb')
      ? ''
      : currentUser.avatar || ''
  );

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setAvatar(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || currentUser.name,
      username: username.trim().toLowerCase().replace(/^@/, '') || currentUser.username,
      phone: phone.trim() || currentUser.phone,
      bio: bio.trim() || currentUser.bio,
      avatar
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md bg-[#0B0F17] border border-slate-800 text-slate-100 overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${
          isApple ? 'rounded-2xl' : 'rounded-3xl'
        }`}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <h3 className="text-base font-semibold text-slate-100">
            Profili Düzenle
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Avatar Upload / Preview */}
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-900 border-2 border-amber-400/40 group shadow-lg shadow-amber-400/10 flex items-center justify-center">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-3xl bg-slate-950 text-amber-400 border border-amber-400/20">
                  {name ? name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              
              <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer text-white">
                <Camera className="w-6 h-6 text-amber-400 mb-0.5" />
                <span className="text-[10px] font-medium">Fotoğraf Seç</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Galeriden Fotoğraf Seçmek İçin Üzerine Tıklayın
            </p>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Ad Soyad</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-400">Kullanıcı Adı</label>
              <span className="text-[11px] text-amber-400">Benzersiz Tanımlayıcı</span>
            </div>
            <div className="relative">
              <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400"
                placeholder="kullanici_adi"
                required
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Telefon Numarası</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400"
                placeholder="+90 5XX XXX XX XX"
                required
              />
            </div>
          </div>

          {/* Bio & Presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Hakkımda (Biyografi)</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              placeholder="Kendinizden bahsedin..."
              className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400"
            />

            {/* Preset Bio Pills */}
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 font-mono">Hazır Biyografiler:</span>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                {PRESET_BIOS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setBio(preset)}
                    className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors text-left"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md shadow-amber-400/20 transition-all"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};