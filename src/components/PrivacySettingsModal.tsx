import React, { useState } from 'react';
import {
  ShieldCheck,
  Eye,
  PhoneOff,
  UserCheck,
  ChevronRight,
  X,
  Info,
  AtSign,
  Lock,
  Check,
  MapPin
} from 'lucide-react';
import { User } from '../types';

interface PrivacySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onUpdateUser: (updatedFields: Partial<User>) => void;
  onOpenBlockedUsers: () => void;
  blockedCount: number;
  isApple: boolean;
}

export const PrivacySettingsModal: React.FC<PrivacySettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onOpenBlockedUsers,
  blockedCount,
  isApple
}) => {
  if (!isOpen) return null;

  const [hidePhone, setHidePhone] = useState(currentUser.hidePhone);
  const [phonePrivacy, setPhonePrivacy] = useState(currentUser.phonePrivacy);
  const [lastSeenPrivacy, setLastSeenPrivacy] = useState(currentUser.lastSeenPrivacy);
  const [readReceipts, setReadReceipts] = useState(currentUser.readReceipts);

  const handleToggleHidePhone = () => {
    const nextVal = !hidePhone;
    setHidePhone(nextVal);
    onUpdateUser({
      hidePhone: nextVal,
      phonePrivacy: nextVal ? 'hidden' : 'everyone'
    });
  };

  const handleSavePhonePrivacy = (val: 'everyone' | 'contacts' | 'hidden') => {
    setPhonePrivacy(val);
    setHidePhone(val === 'hidden');
    onUpdateUser({
      phonePrivacy: val,
      hidePhone: val === 'hidden'
    });
  };

  const handleSaveLastSeen = (val: 'everyone' | 'contacts' | 'nobody') => {
    setLastSeenPrivacy(val);
    onUpdateUser({ lastSeenPrivacy: val });
  };

  const handleToggleReceipts = () => {
    const nextVal = !readReceipts;
    setReadReceipts(nextVal);
    onUpdateUser({ readReceipts: nextVal });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-lg bg-white overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${
          isApple ? 'rounded-2xl' : 'rounded-3xl'
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Gizlilik Ayarları
              </h3>
              <p className="text-xs text-slate-500">
                Kişisel verileriniz ve ulaşılabilirlik denetimi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* SPECIAL FEATURE: Hide Phone Number / Username Only Discovery */}
          <div className="p-4 bg-emerald-50/70 border border-emerald-200/70 rounded-2xl">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                  <PhoneOff className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">
                    Telefon Numaramı Gizle
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Etkinleştirildiğinde diğer kullanıcılar telefon numaranızı göremez. Yalnızca kullanıcı adınız (<span className="font-semibold text-emerald-800">@{currentUser.username}</span>) ile bulunabilir ve mesaj alabilirsiniz.
                  </p>
                </div>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={hidePhone}
                onClick={handleToggleHidePhone}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  hidePhone ? 'bg-emerald-600' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    hidePhone ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-emerald-200/60 text-xs text-emerald-900 flex items-center gap-2">
              <AtSign className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>
                Mevcut durum:{' '}
                <strong>
                  {hidePhone
                    ? 'Gizli (Sadece @' + currentUser.username + ' ile ulaşılabilir)'
                    : 'Görünür (' + currentUser.phone + ')'}
                </strong>
              </span>
            </div>
          </div>

          {/* Phone Privacy Detailed Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Telefon Numarası Görünürlüğü
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200/60 overflow-hidden">
              {[
                { id: 'everyone', title: 'Herkes', desc: 'Herkes telefon numaranızı görebilir ve arayabilir' },
                { id: 'contacts', title: 'Sadece Kişilerim', desc: 'Yalnızca rehberinizdeki kişiler görebilir' },
                { id: 'hidden', title: 'Gizli (Sadece Kullanıcı Adı)', desc: 'Telefon numaranız herkesten gizlenir' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSavePhonePrivacy(opt.id as any)}
                  className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-900">{opt.title}</p>
                    <p className="text-xs text-slate-500">{opt.desc}</p>
                  </div>
                  {phonePrivacy === opt.id && (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 ml-2 stroke-[3]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Last seen & Online */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Son Görülme ve Çevrim İçi
            </label>
            <div className="bg-slate-50 border border-slate-200 rounded-xl divide-y divide-slate-200/60 overflow-hidden">
              {[
                { id: 'everyone', title: 'Herkes' },
                { id: 'contacts', title: 'Kişilerim' },
                { id: 'nobody', title: 'Hiç Kimse' }
              ].map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSaveLastSeen(opt.id as any)}
                  className="p-3 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm text-slate-800">{opt.title}</span>
                  {lastSeenPrivacy === opt.id && (
                    <Check className="w-4 h-4 text-emerald-600 stroke-[3]" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Read Receipts */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-slate-900">Okundu Bilgisi (Mavi Tik)</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Kapatırsanız okundu bilgisi göndermez ve almazsınız.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={readReceipts}
              onClick={handleToggleReceipts}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                readReceipts ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  readReceipts ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Nearby Visibility & Location Privacy */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-4">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Beni Yakındakilerde Göster</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Çevrenizdeki kullanıcıların sizi yaklaşık mesafe ile bulmasını sağlar. Numaranız gizliyse yalnızca kullanıcı adınız görünür.
                </p>
              </div>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={currentUser.isNearbyVisible !== false}
              onClick={() =>
                onUpdateUser({ isNearbyVisible: currentUser.isNearbyVisible === false })
              }
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                currentUser.isNearbyVisible !== false ? 'bg-emerald-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                  currentUser.isNearbyVisible !== false ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Blocked Users Link */}
          <div
            onClick={onOpenBlockedUsers}
            className="p-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Engellenen Kişiler</p>
                <p className="text-xs text-slate-500">
                  {blockedCount > 0 ? `${blockedCount} kişi engellendi` : 'Engellenen kişi yok'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-sm"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
