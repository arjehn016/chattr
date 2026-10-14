import React, { useState } from 'react';
import {
  X,
  Phone,
  Video,
  VolumeX,
  Volume2,
  Ban,
  UserCheck,
  Shield,
  ShieldCheck,
  ShieldAlert,
  Copy,
  Clock,
  Trash2,
  Share2,
  Image as ImageIcon,
  Check
} from 'lucide-react';
import { User, Chat } from '../types';

interface ContactInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  contact: User | null;
  chat: Chat | null;
  onToggleMute: () => void;
  onToggleBlock: () => void;
  onClearChat: () => void;
  onStartCall: (type: 'audio' | 'video') => void;
  isApple: boolean;
}

export const ContactInfoModal: React.FC<ContactInfoModalProps> = ({
  isOpen,
  onClose,
  contact,
  chat,
  onToggleMute,
  onToggleBlock,
  onClearChat,
  onStartCall,
  isApple
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !contact) return null;

  const copyUsername = () => {
    navigator.clipboard?.writeText(`@${contact.username}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isBlocked = chat?.isBlocked;
  const isMuted = chat?.isMuted;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md bg-white overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${
          isApple ? 'rounded-2xl' : 'rounded-3xl'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <span className="text-sm font-semibold text-slate-800">Kişi Bilgisi</span>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* Avatar and Main Info */}
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 rounded-full overflow-hidden bg-slate-200 mb-3 border-2 border-white shadow-md">
              {contact.avatar ? (
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-tr from-emerald-500 to-teal-700 text-white font-bold text-3xl">
                  {contact.name.charAt(0)}
                </div>
              )}
            </div>

            <h3 className="text-lg font-bold text-slate-900">{contact.name}</h3>

            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm font-mono text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md">
                @{contact.username}
              </span>
              <button
                type="button"
                onClick={copyUsername}
                className="p-1 text-slate-400 hover:text-slate-700 transition-colors"
                title="Kullanıcı adını kopyala"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            <p className="text-xs text-slate-500 mt-2">
              {contact.isOnline ? 'Çevrim içi' : contact.lastSeenTime}
            </p>

            {/* Quick Action Icons */}
            <div className="flex items-center justify-center gap-4 mt-4 w-full">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartCall('audio');
                }}
                className="flex-1 max-w-[100px] flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Phone className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-700">Sesli Ara</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  onStartCall('video');
                }}
                className="flex-1 max-w-[100px] flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-700">Görüntülü</span>
              </button>

              <button
                type="button"
                onClick={copyUsername}
                className="flex-1 max-w-[100px] flex flex-col items-center gap-1.5 p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors"
              >
                <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center">
                  <Share2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-medium text-slate-700">Paylaş</span>
              </button>
            </div>
          </div>

          {/* Privacy & Phone Visibility Card */}
          <div
            className={`p-4 rounded-2xl border ${
              contact.hidePhone
                ? 'bg-amber-50/70 border-amber-200/80 text-amber-900'
                : 'bg-slate-50 border-slate-200 text-slate-900'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  contact.hidePhone
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                {contact.hidePhone ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  İletişim & Telefon Gizliliği
                </p>
                {contact.hidePhone ? (
                  <div className="mt-1">
                    <p className="text-sm font-semibold text-amber-950 flex items-center gap-1.5">
                      <span>Telefon Numarası Gizli</span>
                    </p>
                    <p className="text-xs text-amber-800/90 mt-1 leading-relaxed">
                      Bu kullanıcı telefon numarasını gizlemeyi seçti. Kendisine yalnızca <strong>@{contact.username}</strong> kullanıcı adıyla ulaşabilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="mt-1">
                    <p className="text-sm font-semibold font-mono text-slate-900">
                      {contact.phone}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Telefon numarası rehberde ve aramada görünür durumdadır.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio / Hakkımda */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Hakkında
            </p>
            <p className="text-sm text-slate-800 leading-relaxed">{contact.bio}</p>
          </div>

          {/* Actions: Mute & Media */}
          <div className="space-y-2">
            {/* Mute action */}
            <div
              onClick={onToggleMute}
              className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                {isMuted ? (
                  <Volume2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-600" />
                )}
                <div>
                  <p className="text-sm font-medium text-slate-900">
                    {isMuted ? 'Sesi Aç' : 'Bildirimleri Sessize Al'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {isMuted ? `Sessizde (${chat?.mutedUntil || 'Etkin'})` : 'Açık'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {isMuted ? 'Aç' : 'Sessize Al'}
              </span>
            </div>

            {/* Clear Chat */}
            <div
              onClick={onClearChat}
              className="p-3.5 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center gap-3 cursor-pointer transition-colors text-slate-700 hover:text-slate-900"
            >
              <Trash2 className="w-5 h-5 text-slate-500" />
              <div>
                <p className="text-sm font-medium">Sohbeti Temizle</p>
                <p className="text-xs text-slate-500">Bu sohbetteki tüm iletileri siler</p>
              </div>
            </div>

            {/* BLOCK / UNBLOCK ACTION (High Priority) */}
            <div
              onClick={onToggleBlock}
              className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-colors ${
                isBlocked
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                  : 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
              }`}
            >
              {isBlocked ? (
                <UserCheck className="w-5 h-5 text-emerald-700 shrink-0" />
              ) : (
                <Ban className="w-5 h-5 text-rose-600 shrink-0" />
              )}
              <div>
                <p className="text-sm font-semibold">
                  {isBlocked ? `${contact.name} Engelini Kaldır` : `${contact.name} Adlı Kişiyi Engelle`}
                </p>
                <p className="text-xs opacity-80">
                  {isBlocked
                    ? 'Engeli kaldırdığınızda karşılıklı mesajlaşabilirsiniz'
                    : 'Engellendiğinde bu kişi size mesaj gönderemez veya arayamaz'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 shadow-sm"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
