import React, { useState } from 'react';
import { auth } from '../firebase';
import { signOut, deleteUser, PhoneAuthProvider, signInWithCredential, RecaptchaVerifier } from 'firebase/auth';

interface AccountSettingsProps {
  onLogout: () => void;
}

export const AccountSettings: React.FC<AccountSettingsProps> = ({ onLogout }) => {
  const [deleting, setDeleting] = useState(false);
  const [step, setStep] = useState<'idle' | 'phone' | 'code'>('idle');
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  // 1. Çıkış Yap Fonksiyonu
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onLogout();
    } catch (err: any) {
      console.error('Çıkış yapılırken hata:', err);
    }
  };

  // reCAPTCHA kurulumu (Hesap silme doğrulaması için)
  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'delete-recaptcha-container', {
        size: 'invisible',
        callback: () => {}
      });
    }
  };

  // 2. Hesabı Silmek İçin SMS Kodu Gönder
  const handleStartDelete = async () => {
    const user = auth.currentUser;
    if (!user || !user.phoneNumber) {
      setError('Kullanıcı bulunamadı veya telefon numarası yok.');
      return;
    }

    setDeleting(true);
    setError('');

    try {
      setupRecaptcha();
      const recaptchaVerifier = (window as any).recaptchaVerifier;
      const phoneProvider = new PhoneAuthProvider(auth);
      
      const vId = await phoneProvider.verifyPhoneNumber(user.phoneNumber, recaptchaVerifier);
      setVerificationId(vId);
      setStep('code');
    } catch (err: any) {
      console.error(err);
      setError('Doğrulama kodu gönderilemedi: ' + err.message);
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.clear();
        (window as any).recaptchaVerifier = null;
      }
    } finally {
      setDeleting(false);
    }
  };

  // 3. Kodu Doğrula ve Hesabı Kalıcı Olarak Sil
  const handleConfirmDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || !verificationId) return;

    setDeleting(true);
    setError('');

    try {
      // SMS kodunu credential'a çevir
      const credential = PhoneAuthProvider.credential(verificationId, code);
      
      // HATA ÇÖZÜMÜ: signInWithCredential fonksiyonuna auth ve credential verilir
      await signInWithCredential(auth, credential);

      // Hesabı Firebase'den kalıcı olarak sil
      await deleteUser(user);
      
      alert('Hesabınız başarıyla silindi.');
      onLogout();
    } catch (err: any) {
      console.error(err);
      setError('Kod hatalı veya işlem başarısız.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-4 bg-[#111827] border border-slate-800 rounded-2xl text-slate-100 max-w-md space-y-4">
      <h3 className="text-lg font-bold">Hesap Ayarları</h3>

      {error && (
        <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-xl text-xs text-red-300 text-center">
          {error}
        </div>
      )}

      {/* Görünmez reCAPTCHA alanı */}
      <div id="delete-recaptcha-container"></div>

      {step === 'idle' && (
        <div className="space-y-3">
          <button
            onClick={handleSignOut}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 font-medium rounded-xl transition text-slate-200 text-sm cursor-pointer"
          >
            Çıkış Yap
          </button>

          <button
            onClick={handleStartDelete}
            disabled={deleting}
            className="w-full py-2.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/50 text-red-400 font-medium rounded-xl transition text-sm cursor-pointer disabled:opacity-50"
          >
            {deleting ? 'İşlem yapılıyor...' : 'Hesabımı Kalıcı Olarak Sil'}
          </button>
        </div>
      )}

      {step === 'code' && (
        <form onSubmit={handleConfirmDelete} className="space-y-3">
          <p className="text-xs text-slate-400 text-center">
            Hesabınızı silmek için telefonunuza gelen 6 haneli kodu girin.
          </p>
          <input
            type="text"
            required
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="123456"
            className="w-full text-center tracking-widest text-lg px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:border-red-500"
          />
          <button
            type="submit"
            disabled={deleting}
            className="w-full py-2.5 bg-red-600 hover:bg-red-500 font-semibold rounded-xl transition text-sm shadow-lg shadow-red-600/30 cursor-pointer disabled:opacity-50"
          >
            {deleting ? 'Siliniyor...' : 'Kodu Onayla ve Hesabı Sil'}
          </button>
          <button
            type="button"
            onClick={() => setStep('idle')}
            className="w-full py-1 text-xs text-slate-400 hover:text-slate-200 transition text-center cursor-pointer"
          >
            Vazgeç
          </button>
        </form>
      )}
    </div>
  );
};