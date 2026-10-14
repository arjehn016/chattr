import React, { useState } from 'react';
import {
  Search,
  X,
  UserPlus,
  ShieldAlert,
  Phone,
  AtSign,
  MessageSquare,
  Users,
  Check,
  Compass
} from 'lucide-react';
import { User, Chat } from '../types';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: User;
  onStartChatWithUser: (user: User) => void;
  onOpenNearby?: () => void;
  isApple: boolean;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onStartChatWithUser,
  onOpenNearby,
  isApple
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<'all' | 'username' | 'phone'>('all');

  if (!isOpen) return null;

  const cleanQuery = searchTerm.trim().toLowerCase().replace(/^@/, '');

  // Filter available other users
  const otherUsers = users.filter((u) => u.id !== currentUser.id);

  // Check if query matches a user who hid their phone by phone number
  const hiddenPhoneMatches = otherUsers.filter(
    (u) =>
      u.hidePhone &&
      cleanQuery.length >= 4 &&
      u.phone.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, ''))
  );

  const matchedUsers = otherUsers.filter((u) => {
    if (!cleanQuery) return true;

    // Matching username
    const matchesUsername = u.username.toLowerCase().includes(cleanQuery);

    // Matching name
    const matchesName = u.name.toLowerCase().includes(cleanQuery);

    // Matching phone only if NOT hidden!
    const matchesPhone =
      !u.hidePhone &&
      u.phone.replace(/\D/g, '').includes(cleanQuery.replace(/\D/g, ''));

    if (searchType === 'username') return matchesUsername;
    if (searchType === 'phone') return matchesPhone;
    return matchesUsername || matchesName || matchesPhone;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md bg-white overflow-hidden shadow-2xl flex flex-col max-h-[88vh] ${
          isApple ? 'rounded-2xl' : 'rounded-3xl'
        }`}
      >
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-semibold text-slate-900">
              Yeni Sohbet Başlat
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-100 bg-white space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Kullanıcı adı (@burak_dev) veya Telefon numarası..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              autoFocus
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => setSearchType('all')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                searchType === 'all'
                  ? 'bg-slate-900 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Tümü
            </button>
            <button
              type="button"
              onClick={() => setSearchType('username')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                searchType === 'username'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <AtSign className="w-3 h-3" />
              Kullanıcı Adı
            </button>
            <button
              type="button"
              onClick={() => setSearchType('phone')}
              className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                searchType === 'phone'
                  ? 'bg-emerald-600 text-white font-medium'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Phone className="w-3 h-3" />
              Telefon No
            </button>
          </div>

          {onOpenNearby && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenNearby();
              }}
              className="w-full mt-2 py-2 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-xs font-semibold text-emerald-800 flex items-center justify-center gap-2 transition-colors"
            >
              <Compass className="w-4 h-4 text-emerald-600 animate-spin-slow" />
              <span>Yakındaki Kişileri ve Grupları Keşfet (Radar)</span>
            </button>
          )}
        </div>

        {/* Privacy Alert when searching phone of hidden user */}
        {hiddenPhoneMatches.length > 0 && searchType !== 'username' && (
          <div className="mx-4 mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950">
                Telefon Numarası Gizli Kullanıcı
              </p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                Aradığınız numaranın sahibi telefon numarasını gizlemiştir. Bu kişiye yalnızca kullanıcı adı ile ulaşabilirsiniz:{' '}
                {hiddenPhoneMatches.map((u) => (
                  <span
                    key={u.id}
                    onClick={() => setSearchTerm(`@${u.username}`)}
                    className="underline font-semibold cursor-pointer text-amber-900 mx-1"
                  >
                    @{u.username}
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}

        {/* User list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
            Rehber ve Kullanıcılar ({matchedUsers.length})
          </p>

          {matchedUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-10 h-10 mx-auto stroke-1 text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">Kullanıcı bulunamadı</p>
              <p className="text-xs text-slate-400 mt-1">
                Lütfen kullanıcı adını (@...) veya telefon numarasını kontrol edin.
              </p>
            </div>
          ) : (
            matchedUsers.map((user) => (
              <div
                key={user.id}
                onClick={() => {
                  onStartChatWithUser(user);
                  onClose();
                }}
                className="p-2.5 flex items-center justify-between rounded-xl hover:bg-emerald-50/60 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-600">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      user.name.charAt(0)
                    )}
                    {user.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-emerald-900">
                      {user.name}
                    </p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                      <span className="text-emerald-700 font-semibold">
                        @{user.username}
                      </span>
                      <span>·</span>
                      {user.hidePhone ? (
                        <span className="text-amber-700 bg-amber-50 px-1 rounded text-[11px] font-sans">
                          Numara Gizli
                        </span>
                      ) : (
                        <span className="text-slate-400 font-sans">
                          {user.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-600 group-hover:text-white text-slate-600 flex items-center justify-center transition-colors shrink-0"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Kullanıcı adı ile eklenen kişilerin numarası görünmez.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg shadow-sm"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
