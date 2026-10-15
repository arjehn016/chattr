import React, { useState } from 'react';
import { Radio, ArrowRight, ShieldCheck, AtSign } from 'lucide-react';
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface AuthScreenProps {
  onRegister: (user: any) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onRegister }) => {
  const [customUsername, setCustomUsername] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUsername.trim()) {
      alert('Lütfen bir kullanıcı adı girin.');
      return;
    }

    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Formatlanmış kullanıcı adını ve Google hesap bilgilerini birleştiriyoruz
      const formattedUsername = customUsername
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_.]/g, '');

      const newUser = {
        id: user.uid || `user_${Date.now()}`,
        name: user.displayName || 'ChatTR Kullanıcısı',
        username: formattedUsername,
        phone: user.phoneNumber || 'Belirtilmedi',
        email: user.email || '',
        avatar: user.photoURL || '',
        bio: 'ChatTR kullanıyorum.',
        status: 'online'
      };

      setLoading(false);
      onRegister(newUser);
    } catch (error: any) {
      console.error("Google ile giriş hatası:", error);
      alert(`Giriş başarısız: ${error.message || 'Lütfen tekrar deneyin.'}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-[#07090E] p-4 font-sans">
      <div className="w-full max-w-md bg-[#0B0F17] border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
            <Radio className="w-7 h-7 text-amber-400 animate-pulse" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-wider bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
            ChatTR'ye Hoş Geldiniz
          </h1>
          <p className="text-xs text-slate-400">
            Kullanıcı adını belirle ve Google hesabınla anında giriş yap
          </p>
        </div>

        <form onSubmit={handleGoogleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-400">Kullanıcı Adı</label>
            <div className="relative">
              <AtSign className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={customUsername}
                onChange={(e) => setCustomUsername(e.target.value)}
                placeholder="ahmetyilmaz"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-sm text-slate-100 focus:outline-none focus:border-amber-400 font-mono"
                required
              />
            </div>
            <p className="text-[10px] text-slate-500">Arkadaşların seni bu kullanıcı adı ile bulacak.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-amber-400/50 text-slate-100 font-semibold rounded-2xl text-sm shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
          >
            {/* Google SVG İkonu */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5z"
              />
              <path
                fill="#4285F4"
                d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
              />
              <path
                fill="#FBBC05"
                d="M5.3 14.7c-.2-.7-.4-1.5-.4-2.7s.2-2 .4-2.7L1.6 6.4C.6 8.4 0 10.6 0 13s.6 4.6 1.6 6.6l3.7-2.9z"
              />
              <path
                fill="#34A853"
                d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5.3L1.6 15.6C3.5 19.4 7.4 23 12 23z"
              />
            </svg>
            <span>{loading ? 'Bağlanılıyor...' : 'Google ile Devam Et'}</span>
            <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-amber-400/70" />
          <span>Firebase tabanlı güvenli kimlik doğrulama</span>
        </div>
      </div>
    </div>
  );
};