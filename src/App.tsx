import React, { useState } from 'react';
import { 
  Users, MessageSquare, Settings as SettingsIcon, Radio, 
  Shield, UserPlus, Lock, Check, Trash2, Radar, Wifi, SlidersHorizontal, Eye, EyeOff
} from 'lucide-react';
import { User, Chat } from './types';
import { INITIAL_USERS, INITIAL_CHATS } from './mockData';
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
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'chats' | 'contacts' | 'nearby' | 'settings'>('chats');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNewGroupModalOpen, setIsNewGroupModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [hidePhone, setHidePhone] = useState(true);
  const [isApple, setIsApple] = useState(false);

  // Yakındakiler & Mesafe Filtresi ve Görünürlük State'leri
  const [isDiscoverable, setIsDiscoverable] = useState(true);
  const [searchRadius, setSearchRadius] = useState<number>(500);
  const [nearbyUsers, setNearbyUsers] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);

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

  const startNearbyScan = () => {
    if (!isDiscoverable) {
      alert('Yakındakilerde görünmek istemediğiniz için tarama yapamazsınız. Önce görünürlüğü açın.');
      return;
    }

    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setNearbyUsers([]);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-[#0B0F17] text-slate-100 overflow-hidden font-sans">
      {/* Sol Navigasyon / Sekme Çubuğu */}
      <div className="w-20 bg-[#07090E] border-r border-slate-800 flex flex-col items-center justify-between py-6 z-20">
        <div className="flex flex-col items-center gap-6">
          <button 
            onClick={() => setIsProfileModalOpen(true)}
            className="w-12 h-12 rounded-full bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center font-bold text-amber-400 hover:border-amber-400 transition-all shadow-md"
            title="Profilim"
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

            <button
              onClick={() => setActiveTab('nearby')}
              className={`p-3 rounded-2xl transition-all ${activeTab === 'nearby' ? 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/20' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'}`}
              title="Yakındakileri Gör"
            >
              <Radar className="w-5 h-5" />
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
              {activeTab === 'chats' ? 'Sohbetler' : activeTab === 'contacts' ? 'Kişiler' : activeTab === 'nearby' ? 'Yakındakiler' : 'Ayarlar'}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {activeTab === 'chats' && (
              chats.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  Henüz sohbetiniz yok.<br/>Yeni grup kurabilir veya kişilerden mesaj başlatabilirsiniz.
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
                  Henüz ekli kişi yok.
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

            {activeTab === 'nearby' && (
              <div className="space-y-3">
                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isDiscoverable ? <Eye className="w-4 h-4 text-amber-400" /> : <EyeOff className="w-4 h-4 text-slate-500" />}
                      <span className="text-xs font-semibold text-slate-200">Yakındakilerde Görün</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={isDiscoverable} 
                      onChange={(e) => setIsDiscoverable(e.target.checked)}
                      className="w-4 h-4 accent-amber-400 cursor-pointer"
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {isDiscoverable ? 'Aktifsiniz: Diğer açık kullanıcılar sizi görebilir.' : 'Gizlisiniz: Kimse sizi taramada göremez.'}
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                      Arama Mesafesi
                    </span>
                    <span className="text-amber-400 font-mono font-bold">
                      {searchRadius >= 1000 ? `${searchRadius / 1000} km` : `${searchRadius} metre`}
                    </span>
                  </div>
                  <select 
                    value={searchRadius} 
                    onChange={(e) => setSearchRadius(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
                  >
                    <option value={100}>100 Metre</option>
                    <option value={250}>250 Metre</option>
                    <option value={500}>500 Metre</option>
                    <option value={1000}>1 Kilometre</option>
                    <option value={5000}>5 Kilometre</option>
                  </select>
                </div>

                <div className="p-3 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-300 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wifi className={`w-4 h-4 shrink-0 ${isScanning ? 'animate-pulse text-amber-400' : ''}`} />
                    <span>{isScanning ? 'Çevre taranıyor...' : 'Radar Hazır'}</span>
                  </div>
                  <button 
                    onClick={startNearbyScan} 
                    disabled={isScanning || !isDiscoverable}
                    className="px-2.5 py-1 bg-amber-400 text-slate-950 font-bold rounded-lg text-[10px] hover:bg-amber-300 transition-all disabled:opacity-40"
                  >
                    {isScanning ? 'Taranıyor' : 'Tara'}
                  </button>
                </div>

                {!isDiscoverable ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    Görünürlüğünüz kapalı olduğu için tarama yapamazsınız.
                  </div>
                ) : nearbyUsers.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs space-y-2">
                    <Radar className="w-8 h-8 mx-auto text-slate-700 animate-spin stroke-[1]" />
                    <p>Seçilen mesafede başka kullanıcı bulunamadı.</p>
                  </div>
                ) : (
                  nearbyUsers.map(n => (
                    <div key={n.id} className="p-3 rounded-2xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm text-slate-200">{n.name}</p>
                        <p className="text-[10px] text-slate-400">Mesafe: {n.distance}</p>
                      </div>
                      <span className="text-[10px] px-2 py-1 bg-amber-400/10 text-amber-400 rounded-lg border border-amber-400/20 font-mono">
                        {n.signal}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-3 pb-6">
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
                </div>

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

      {/* Modallar */}
      <ProfileEditModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onSave={handleSaveProfile}
        isApple={isApple}
      />

      <NewGroupModal
        isOpen={isNewGroupModalOpen}
        onClose={() => setIsNewGroupModalOpen(false)}
        users={INITIAL_USERS}
        currentUser={currentUser}
        onCreateGroup={handleCreateGroup}
      />

      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}