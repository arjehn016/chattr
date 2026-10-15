import React, { useState } from 'react';
import { AuthUser } from '../types';
import { auth } from '../firebase';
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber, 
  ConfirmationResult, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';

interface AuthModalProps {
  onLogin: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onLogin }) => {
  const [authType, setAuthType] = useState<'selection' | 'phone' | 'code'>('selection');
  const [phone, setPhone] = useState('+90 ');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Google ile Giriş Yap
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      onLogin({
        id: user.uid,
        name: user.displayName || 'Google Kullanıcısı',
        username: `@${(user.displayName || 'user').toLowerCase().replace(/\s+/g, '')}`,
        phone: user.phoneNumber || '+90 555 000 0000',
        avatar: user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        bio: 'ChatTR Google Kullanıcısı'
      });
    } catch (err: any) {
      console.error(err);
      setError('Google ile giriş yapılırken bir hata oluştu: ' + (err.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // reCAPTCHA kurulumu
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {}
      });
    }
  };

  // SMS Kod Gönder
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 10) {
      setError('Lütfen geçerli bir telefon numarası girin.');
      return;
    }
    if (!name.trim()) {
      setError('Lütfen adınızı soyadınızı girin.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      setupRecaptcha();
      const recaptchaVerifier = (window as any).recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, recaptchaVerifier);
      setConfirmationResult(confirmation);
      setAuthType('code');
    } catch (err: any) {
      console.error(err);
      setError('Kod gönderilemedi: ' + (err.message || 'Bir hata oluştu.'));
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // SMS Kodunu Doğrula
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      setError('Lütfen 6 haneli doğrulama kodunu girin.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (!confirmationResult) return;
      const result = await confirmationResult.confirm(code);
      const firebaseUser = result.user;

      onLogin({
        id: firebaseUser.uid || `user_${Date.now()}`,
        name: name,
        username: `@${name.toLowerCase().replace(/\s+/g, '')}`,
        phone: firebaseUser.phoneNumber || phone,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        bio: 'ChatTR Kullanıcısı'
      });
    } catch (err: any) {
      console.error(err);
      setError('Kod hatalı veya süresi dolmuş.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-md bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        <h2 className="text-2xl font-bold text-center mb-2">ChatTR'ye Hoş Geldin</h2>
        <p className="text-xs text-slate-400 text-center mb-6">Devam etmek için bir giriş yöntemi seç.</p>

        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-xs text-red-300 text-center">
            {error}
          </div>
        )}

        <div id="recaptcha-container"></div>

        {authType === 'selection' && (
          <div className="space-y-3">
            {/* Google ile Giriş Butonu */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-900 font-medium rounded-xl transition flex items-center justify-center gap-3 shadow-md disabled:opacity-50 cursor-pointer"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.13 0-5.78-2.11-6.73-4.96H1.19v3.15C3.17 21.31 7.24 24 12 24z"/>
                <path fill="#FBBC05" d="M5.27 14.24c-.25-.72-.38-1.49-.38-2.24s.13-1.52.38-2.24V6.6H1.19C.43 8.13 0 9.87 0 11.7c0 1.83.43 3.57 1.19 5.1l4.08-2.56z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.24 0 3.17 2.69 1.19 6.6l4.08 3.15c.95-2.85 3.6-4.96 6.73-4.96z"/>
              </svg>
              Google (Gmail) ile Devam Et
            </button>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-700"></div>
              <span className="flex-shrink mx-4 text-xs text-slate-500">veya</span>
              <div className="flex-grow border-t border-slate-700"></div>
            </div>

            {/* Telefon ile Giriş Butonu */}
            <button
              onClick={() => setAuthType('phone')}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 border border-slate-700 font-medium rounded-xl transition text-slate-200 cursor-pointer"
            >
              Telefon Numarası ile Giriş Yap
            </button>
          </div>
        )}

        {authType === 'phone' && (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Ad Soyad *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Ercan Şimşek"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Telefon Numarası *</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 555 000 0000"
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Kod Gönderiliyor...' : 'SMS Kodu Gönder'}
            </button>

            <button
              type="button"
              onClick={() => setAuthType('selection')}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition text-center cursor-pointer"
            >
              Geri Dön
            </button>
          </form>
        )}

        {authType === 'code' && (
          <form onSubmit={handleVerifyCode} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Doğrulama Kodu (6 Hane)</label>
              <input
                type="text"
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full text-center tracking-widest text-lg px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 font-semibold rounded-xl transition shadow-lg shadow-indigo-600/30 mt-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Doğrulanıyor...' : 'Kodu Onayla ve Giriş Yap'}
            </button>

            <button
              type="button"
              onClick={() => setAuthType('phone')}
              className="w-full py-2 text-xs text-slate-400 hover:text-slate-200 transition text-center cursor-pointer"
            >
              Numarayı Değiştir
            </button>
          </form>
        )}
      </div>
    </div>
  );
};