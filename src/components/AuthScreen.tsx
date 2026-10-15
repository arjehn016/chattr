import React, { useState } from 'react';
import { Radio, User, AtSign, Phone, ArrowRight } from 'lucide-react';

interface AuthScreenProps {
  onRegister: (user: any) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onRegister }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('+90 ');
  const [bio, setBio] = useState('ChatTR kullanıyorum.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !username.trim()) return;

    const newUser: any = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      username: username.trim().toLowerCase().replace(/\s+/g, '_'),
      phone: phone.trim(),
      avatar: '',
      bio: bio.trim(),
      status: 'online'
    };

    onRegister(newUser);
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#07090E] p-4 font-sans">
      <div className="w-full max-w-md bg-[#0B0F17] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Radio className="w-7 h-7 text-amber-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
            ChatTR'ye Katıl
          </h1>
          <p className="text-xs text-slate-400">Güvenli ve hızlı mesajlaşma için profilini oluştur</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Ad Soyad</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Ercan Şimşek"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Kullanıcı Adı</label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ercansimsek"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-400"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Telefon Numarası</label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 555 000 0000"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-400/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Hemen Başla</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};