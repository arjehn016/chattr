import React, { useState } from 'react';
import { X, Camera, AtSign, Phone, User as UserIcon, Check } from 'lucide-react';
import { User } from '../types';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onSave: (updatedFields: Partial<User>) => void;
  isApple: boolean;
}

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
  const [bio, setBio] = useState(currentUser.bio);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: name.trim() || currentUser.name,
      username: username.trim().toLowerCase().replace(/^@/, '') || currentUser.username,
      phone: phone.trim() || currentUser.phone,
      bio: bio.trim() || currentUser.bio
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md bg-white overflow-hidden shadow-2xl flex flex-col max-h-[85vh] ${
          isApple ? 'rounded-2xl' : 'rounded-3xl'
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <h3 className="text-base font-semibold text-slate-900">
            Profili Düzenle
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center">
            <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-200 border-2 border-slate-300">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-2xl bg-emerald-600 text-white">
                  {name.charAt(0)}
                </div>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Profil Fotoğrafı
            </p>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Ad Soyad</label>
            <div className="relative">
              <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-600">Kullanıcı Adı</label>
              <span className="text-[11px] text-emerald-600">Benzersiz Tanımlayıcı</span>
            </div>
            <div className="relative">
              <AtSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="kullanici_adi"
                required
              />
            </div>
            <p className="text-[11px] text-slate-400">
              Telefon numaranızı gizlediğinizde diğer kişiler size bu kullanıcı adı ile ulaşır.
            </p>
          </div>

          {/* Phone */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Telefon Numarası</label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                placeholder="+90 5XX XXX XX XX"
                required
              />
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600">Hakkımda</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
            >
              Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
