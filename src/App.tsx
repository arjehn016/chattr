import React, { useState } from 'react';
import { 
  Users, MessageSquare, Settings as SettingsIcon, Phone, Radio, 
  Shield, UserPlus, Image as ImageIcon, Send, X, Camera, AtSign, User as UserIcon, Sparkles, Check,
  Lock, UserX, Trash2, Bell, HelpCircle
} from 'lucide-react';
import { User, Chat, Message, CallRecord, UserStory } from './types';
import { INITIAL_USERS, INITIAL_CHATS, INITIAL_MESSAGES, INITIAL_CALLS, INITIAL_STORIES } from './mockData';
import { ProfileEditModal } from './components/ProfileEditModal';
import { NewGroupModal } from './components/NewGroupModal';
import { PrivacyModal } from './components/PrivacyModal';
import { AuthScreen } from './components/AuthScreen';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('chattr_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.avatar && parsed.avatar.includes('unsplash.com')) {
          parsed.avatar = '';
        }
        return parsed;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [messages, setMessages] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'settings'>('chats');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [hidePhone, setHidePhone] = useState(true);
  const [isApple, setIsApple] = useState(false);

  // Eğer kullanıcı kayıtlı değilse doğrudan Kayıt Olma Ekranını göster
  if (!currentUser) {
    return (
      <AuthScreen 
        onRegister={(newUser) => {
          setCurrentUser(newUser);
          localStorage.setItem('chattr_user', JSON.stringify(newUser));
        }} 
      />
    );
  }

  const handleSaveProfile = (updatedFields: Partial<User>) => {
    const updated = { ...currentUser, ...updatedFields };
    setCurrentUser(updated);
    localStorage.setItem('chattr_user', JSON.stringify(updated));
  };

  const handleCreateGroup = (groupName: string, selectedUserIds: string[]) => {
    const newChatId = `group_${Date.now()}`;
    const newChat: any = {
      id: newChatId,
      name: groupName,
      isGroup: true,
      participantIds: [currentUser.id, ...selectedUserIds],
      unreadCount: 0,
      lastMessage: {
        id: `msg_${Date.now()}`,
        chatId: newChatId,
        senderId: currentUser.id,
        text: `${currentUser.name} grubu kurdu.`,
        timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
        type: 'text'
      }
    };

    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    setActiveTab('chats');
  };

  const handleLogout = () => {
    localStorage.removeItem('chattr_user');
    setCurrentUser(null);
  };

  return (
    <div className="flex h-screen bg-[#0B0F17] text-slate-100 overflow-hidden font-sans">
      {/* Sol Navigasyon / Sekme Çubuğu */}
      <div className="w-20 bg-[#07090E] border-r border-slate-800 flex flex-col items-center justify-between py-6 z-20">
        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-amber-400 hover:border-amber-400 transition-all shadow-md"
          >
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg">{currentUser.name ? currentUser.name.charAt(0).toUpperCase() : '?'}</span>
            )}
          </button>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setActiveTab('chats')}
              className={`p-3 rounded-2xl transition-all ${activeTab === 'chats' ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
              title="Sohbetler"
            >
              <MessageSquare className="w-5 h-5" />
            </button>

            <button
              onClick={() => setActiveTab('contacts')}
              className={`p-3 rounded-2xl transition-all ${activeTab === 'contacts' ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
              title="Kişiler"
            >
              <Users className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => setIsNewGroupModalOpen(true)}
            className="p-3 rounded-2xl bg-slate-900 text-amber-400 border border-slate-800 hover:bg-slate-800 transition-all"
            title="Yeni Grup Kur"
          >
            <UserPlus className="w-5 h-5" />
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`p-3 rounded-2xl transition-all ${activeTab === 'settings' ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
            title="Ayarlar"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Ana İçerik Alanı */}
      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-slate-800 bg-[#07090E] flex flex-col">
          {/* Üst Kısım: Logomuz ve Başlık */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold shadow-inner">
                <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
              </div>
              <h1 className="text-base font-extrabold tracking-wider bg-gradient-to-r from-amber-400 to-amber-200 bg-clip-text text-transparent">
                ChatTR
              </h1>
            </div>
            <span className="text-xs font-semibold text-slate-400 capitalize">
              {activeTab === 'chats' ? 'Sohbetler' : activeTab === 'contacts' ? 'Kişiler' : 'Ayarlar'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {activeTab === 'chats' && (
              chats.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Henüz bir sohbet yok.<br/>Yeni grup kurabilir veya kişilerden mesaj başlatabilirsiniz.
                </div>
              ) : (
                chats.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => setActiveChatId(chat.id)}
                    className={`p-3 rounded-2xl cursor-pointer border transition-all ${activeChatId === chat.id ? 'bg-slate-900 border-amber-400/40' : 'border-slate-800/60 hover:bg-slate-900/50'}`}
                  >
                    <p className="font-semibold text-sm text-slate-200">{chat.name}</p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{chat.lastMessage?.text}</p>
                  </div>
                ))
              )
            )}

            {activeTab === 'contacts' && (
              INITIAL_USERS.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Kayıtlı kişi bulunmuyor.
                </div>
              ) : (
                INITIAL_USERS.map(u => (
                  <div key={u.id} className="p-3 rounded-2xl border border-slate-800/60 bg-slate-900/40">
                    <p className="font-semibold text-sm text-slate-200">{u.name}</p>
                    <p className="text-xs text-slate-400 font-mono">@{u.username}</p>
                  </div>
                ))
              )
            )}

            {activeTab === 'settings' && (
              <div className="space-y-3 pb-6">
                {/* Profil Kartı */}
                <div 
                  onClick={() => setIsProfileModalOpen(true)}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 cursor-pointer hover:border-amber-400/40 transition-all shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-slate-950 border border-amber-400/30 flex items-center justify-center font-bold text-amber-400 overflow-hidden shadow-inner">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                      ) : (
                        currentUser.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{currentUser.name}</p>
                      <p className="text-xs text-amber-400/80 font-mono">@{currentUser.username}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{hidePhone ? 'Gizli Numara' : currentUser.phone}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2.5 italic bg-slate-950/40 p-2 rounded-xl border border-slate-800/50">"{currentUser.bio}"</p>
                </div>

                {/* Gizlilik ve Güvenlik Menüleri */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Gizlilik Ayarları</p>
                  
                  <div 
                    onClick={() => setHidePhone(!hidePhone)}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-semibold text-slate-200">Telefon Numarasını Gizle</p>
                        <p className="text-[10px] text-slate-400">Sadece kullanıcı adı ile iletişim</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center border ${hidePhone ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-slate-700'}`}>
                      {hidePhone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <div 
                    onClick={() => setIsPrivacyModalOpen(true)}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <Shield className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-semibold text-slate-200">Gizlilik & Güvenlik</p>
                        <p className="text-[10px] text-slate-400">Son görülme, profil fotoğrafı ve durum</p>
                      </div>
                    </div>
                  </div>

                  <div 
                    onClick={() => alert("Engellenen kullanıcı listesi şu an boş.")}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between cursor-pointer hover:border-slate-700 transition-all"
                  >
                    <div className="flex items-center gap-2.5">
                      <UserX className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-xs font-semibold text-slate-200">Engellenen Kişiler</p>
                        <p className="text-[10px] text-slate-400">0 engellenen kullanıcı</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hesap İşlemleri */}
                <div className="space-y-1.5 pt-2">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">Hesap</p>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full p-3 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-2.5 text-red-400 hover:bg-red-500/20 transition-all text-left"
                  >
                    <Trash2 className="w-4 h-4" />
                    <div>
                      <p className="text-xs font-semibold">Hesabı Sıfırla / Çıkış Yap</p>
                      <p className="text-[10px] text-red-400/70">Tüm oturum verilerini temizle</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sağ Sohbet Detay Ekranı */}
        <div className="flex-1 flex flex-col bg-[#0B0F17]">
          {activeChatId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm">
              Sohbet Açık ({activeChatId})
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-700 stroke-[1.5]" />
              <p>Sohbet başlatmak için soldan bir öğe seçin veya yeni grup kurun.</p>
            </div>
          )}
        </div>
      </div>

      {/* Profil Düzenleme Modalı */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onSave={handleSaveProfile}
        isApple={isApple}
      />

      {/* Yeni Grup Kurma Modalı */}
      <NewGroupModal
        isOpen={isNewGroupModalOpen}
        onClose={() => setIsNewGroupModalOpen(false)}
        users={INITIAL_USERS}
        currentUser={currentUser}
        onCreateGroup={handleCreateGroup}
      />

      {/* Gizlilik ve Güvenlik Detay Modalı */}
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}