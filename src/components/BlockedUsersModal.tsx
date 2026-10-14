import React from 'react';
import { UserX, ShieldAlert, X, UserCheck } from 'lucide-react';
import { User, Chat } from '../types';

interface BlockedUsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  blockedUsers: User[];
  onUnblock: (userId: string) => void;
  isApple: boolean;
}

export const BlockedUsersModal: React.FC<BlockedUsersModalProps> = ({
  isOpen,
  onClose,
  blockedUsers,
  onUnblock,
  isApple
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className={`w-full max-w-md overflow-hidden shadow-2xl bg-white flex flex-col max-h-[85vh] ${
          isApple ? 'rounded-2xl' : 'rounded-3xl'
        }`}
      >
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <UserX className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Engellenen Kişiler
              </h3>
              <p className="text-xs text-slate-500">
                {blockedUsers.length} kişi engellendi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-amber-50/60 border-b border-amber-100 text-xs text-amber-900 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p>
            Engellenen kişiler sizi arayamaz ve size mesaj gönderemez. Son görülme zamanınızı, çevrim içi durumunuzu ve durum güncellemelerinizi göremezler.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 divide-y divide-slate-100">
          {blockedUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <UserX className="w-12 h-12 mx-auto stroke-1 text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">Engellenen kimse yok</p>
              <p className="text-xs text-slate-400 mt-1">
                İstemediğiniz kişileri sohbet ekranından veya profilinden engelleyebilirsiniz.
              </p>
            </div>
          ) : (
            blockedUsers.map((user) => (
              <div key={user.id} className="pt-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 flex items-center justify-center font-semibold text-slate-600">
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
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500 font-mono truncate">
                      @{user.username}
                      {user.hidePhone ? (
                        <span className="ml-1.5 text-[11px] text-emerald-600 font-sans">
                          (Numara Gizli)
                        </span>
                      ) : (
                        <span className="ml-1.5 text-slate-400 font-sans">
                          {user.phone}
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onUnblock(user.id)}
                  className="px-3 py-1.5 text-xs font-medium text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-emerald-50 rounded-lg transition-colors flex items-center gap-1 shrink-0"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  Engeli Kaldır
                </button>
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
