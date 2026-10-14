import React, { useState } from 'react';
import { AuthUser } from '../types';

interface AuthModalProps {
  onLogin: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onLogin({
      id: `user_${Date.now()}`,
      name,
      username: username.startsWith('@') ? username : `@${username || name.toLowerCase().replace(/\s+/g, '')}`,
      phone: phone || '+90 555 000 0000',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      bio: 'ChatTR Kullanıcısı'
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        <h2 className="text-2xl font-bold text-center mb-2">ChatTR'ye Hoş Geldin</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Devam etmek için lütfen bilgilerini gir.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            Ad Soyad *
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Örn: Ercan Şimşek"
              className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            Kullanıcı Adı
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Örn: @ercansimsek"
              className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <div>
            Telefon Numarası
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Örn: +90 532 ..."
              className="w-full mt-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30 mt-2"
          >
            Giriş Yap / Başla
          </button>
        </form>
      </div>
    </div>
  );
};