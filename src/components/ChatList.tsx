import React, { useState } from 'react';
import {
  Search,
  Pin,
  VolumeX,
  Check,
  CheckCheck,
  Plus,
  Mic,
  Users
} from 'lucide-react';
import { Chat, User, DeviceOS, AppTheme } from '../types';

interface ChatListProps {
  chats: Chat[];
  users: User[];
  currentUser: User;
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onOpenNewChat: () => void;
  onOpenMuteModal: (chat: Chat) => void;
  onTogglePin: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  deviceOS: DeviceOS;
  currentTheme?: AppTheme;
  onOpenThemeSelector?: () => void;
  onOpenEmergencyMesh?: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  users,
  currentUser,
  activeChatId,
  onSelectChat,
  onOpenNewChat,
  deviceOS
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'groups'>('all');

  const isApple = deviceOS === 'apple';

  const getContactForChat = (chat: Chat): User | undefined => {
    if (chat.isGroup) return undefined;
    const otherId = chat.participantIds.find((id) => id !== currentUser.id);
    return users.find((u) => u.id === otherId);
  };

  const filteredChats = chats.filter((chat) => {
    const contact = getContactForChat(chat);
    const search = searchTerm.toLowerCase().trim();

    const matchesName = chat.name.toLowerCase().includes(search);
    const matchesUsername = contact?.username.toLowerCase().includes(search.replace(/^@/, '')) || false;
    const matchesPhone = (!contact?.hidePhone && contact?.phone.replace(/\D/g, '').includes(search.replace(/\D/g, ''))) || false;
    const matchesLastMsg = chat.lastMessage?.text.toLowerCase().includes(search) || false;

    const matchesSearch = !search || matchesName || matchesUsername || matchesPhone || matchesLastMsg;

    if (!matchesSearch) return false;

    if (filterType === 'unread') return chat.unreadCount > 0;
    if (filterType === 'groups') return chat.isGroup;
    return true;
  });

  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return 0;
  });

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0B0F17] select-none overflow-hidden text-white">
      {/* Top Header */}
      <header className="px-3.5 py-3 shrink-0 flex items-center justify-between border-b border-slate-800 bg-[#0B0F17]">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
            Sohbetler
          </h1>
          {currentUser.hidePhone && (
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-amber-950/80 text-amber-300 border border-amber-500/30"
              title="Numaranız gizli, yalnızca kullanıcı adınızla bulunabilirsiniz"
            >
              Gizli Profil
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onOpenNewChat}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-transform active:scale-95 bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20"
            title="Yeni Sohbet Başlat"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="p-3 bg-transparent border-b border-slate-800 shrink-0">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="İsim, @kullanıcı_adı veya telefon..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs bg-slate-900/80 border border-slate-800 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-400/50 transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: 'Tümü' },
            { id: 'unread', label: 'Okunmamış' },
            { id: 'groups', label: 'Gruplar' }
          ].map((flt) => (
            <button
              key={flt.id}
              type="button"
              onClick={() => setFilterType(flt.id as any)}
              className={`px-3.5 py-1 text-xs rounded-full transition-all whitespace-nowrap shrink-0 ${
                filterType === flt.id
                  ? 'bg-amber-400 text-slate-950 font-semibold shadow-md shadow-amber-400/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List Body */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedChats.length === 0 ? (
          <div className="py-16 text-center text-slate-400 px-6">
            <Search className="w-10 h-10 mx-auto text-slate-500 stroke-1 mb-2" />
            <p className="text-sm font-semibold text-slate-300">Sohbet bulunamadı</p>
            <p className="text-xs text-slate-500 mt-1">
              Arama kriterini değiştirin veya sağ üstten yeni bir sohbet başlatın.
            </p>
          </div>
        ) : (
          sortedChats.map((chat) => {
            const isSelected = activeChatId === chat.id;
            const contact = getContactForChat(chat);
            const isBlocked = chat.isBlocked;

            return (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`p-3 rounded-2xl flex items-center gap-3 cursor-pointer transition-all relative group border ${
                  isSelected
                    ? 'bg-slate-900/90 border-amber-400/40 shadow-lg shadow-amber-400/5'
                    : 'border-transparent hover:bg-slate-900/40 hover:border-slate-800'
                }`}
              >
                <div className="relative w-12 h-12 rounded-full bg-slate-800 shrink-0 overflow-hidden flex items-center justify-center font-bold text-slate-200 border border-slate-700">
                  {chat.avatar ? (
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  ) : chat.isGroup ? (
                    <div className="w-full h-full bg-amber-600 text-white flex items-center justify-center">
                      <Users className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-amber-600 to-slate-700 text-white flex items-center justify-center text-lg">
                      {chat.name.charAt(0)}
                    </div>
                  )}

                  {contact?.isOnline && !isBlocked && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-950 rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-sm font-semibold truncate text-slate-100">
                        {chat.name}
                      </span>
                      {contact?.hidePhone && (
                        <span
                          className="text-[10px] bg-amber-950/70 text-amber-300 border border-amber-500/30 px-1.5 py-0.2 rounded-full font-mono shrink-0"
                          title="Telefon gizli, sadece @kullaniciadi ile iletişim"
                        >
                          @{contact.username}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[11px] font-mono shrink-0 ${
                        chat.unreadCount > 0 ? 'text-amber-400 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {chat.lastMessage?.timestamp || ''}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1 text-xs truncate text-slate-400">
                      {chat.lastMessage?.senderId === currentUser.id && (
                        <span className="shrink-0">
                          {chat.lastMessage.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-amber-400" />
                          ) : chat.lastMessage.status === 'delivered' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </span>
                      )}

                      {chat.lastMessage?.type === 'voice' ? (
                        <span className="flex items-center gap-1 text-amber-400 font-medium truncate">
                          <Mic className="w-3.5 h-3.5" />
                          Sesli Mesaj ({chat.lastMessage.audioDuration || 15} sn)
                        </span>
                      ) : (
                        <span className="truncate">
                          {isBlocked ? (
                            <span className="text-rose-400 italic">Kişi engellendi</span>
                          ) : (
                            chat.lastMessage?.text || 'Henüz mesaj yok'
                          )}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {chat.isMuted && <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                      {chat.isPinned && <Pin className="w-3.5 h-3.5 text-amber-400 rotate-45" />}
                      {chat.unreadCount > 0 && (
                        <span className="min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-slate-950 bg-amber-400 flex items-center justify-center rounded-full shadow-[0_0_8px_rgba(250,204,21,0.8)]">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Android Floating Action Button (FAB) */}
      {!isApple && (
        <div className="absolute right-4 bottom-20 z-20">
          <button
            type="button"
            onClick={onOpenNewChat}
            className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 shadow-xl shadow-amber-400/20 flex items-center justify-center active:scale-95 transition-transform"
            title="Yeni Sohbet"
          >
            <Plus className="w-6 h-6 stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
};