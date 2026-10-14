import React, { useState } from 'react';
import {
  User,
  Chat,
  Message,
  CallRecord,
  UserStory,
  ActiveTab,
  AppTheme,
  AuthUser
} from './types';
import {
  INITIAL_USERS,
  INITIAL_CHATS,
  INITIAL_MESSAGES,
  INITIAL_CALLS,
  INITIAL_STORIES
} from './mockData';
import { Navigation } from './components/Navigation';
import { ChatList } from './components/ChatList';
import { ChatView } from './components/ChatView';
import { ContactInfoModal } from './components/ContactInfoModal';
import { NewChatModal } from './components/NewChatModal';
import { StatusView } from './components/StatusView';
import { StatusStoryModal } from './components/StatusStoryModal';
import { CallsView } from './components/CallsView';
import { ActiveCallModal } from './components/ActiveCallModal';
import { SettingsView } from './components/SettingsView';
import { PrivacySettingsModal } from './components/PrivacySettingsModal';
import { BlockedUsersModal } from './components/BlockedUsersModal';
import { ProfileEditModal } from './components/ProfileEditModal';
import { MuteModal } from './components/MuteModal';
import { NearbyView } from './components/NearbyView';
import { LocationPermissionModal } from './components/LocationPermissionModal';
import { EmergencyMeshView } from './components/EmergencyMeshView';
import { ThemeSelectorModal } from './components/ThemeSelectorModal';
import { AuthModal } from './components/AuthModal';
import { MessageSquare } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chats');
  const [currentTheme, setCurrentTheme] = useState<AppTheme>('cyber_neon');
  const [showThemeSelectorModal, setShowThemeSelectorModal] = useState(false);

  const [authUser, setAuthUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('chattr_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const defaultUser: User = {
    id: 'user_me',
    name: authUser?.name || 'Kullanıcı',
    username: authUser?.username || '@kullanici',
    phone: authUser?.phone || '',
    hidePhone: false,
    phonePrivacy: 'everyone',
    lastSeenPrivacy: 'everyone',
    readReceipts: true,
    avatar: authUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    bio: authUser?.bio || 'ChatTR Kullanıcısı',
    isOnline: true,
    lastSeenTime: 'Şimdi'
  };

  const [users, setUsers] = useState<User[]>(INITIAL_USERS.length > 0 ? INITIAL_USERS : [defaultUser]);
  const [currentUserId, setCurrentUserId] = useState<string>(users[0]?.id || 'user_me');
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);
  const [calls, setCalls] = useState<CallRecord[]>(INITIAL_CALLS);
  const [stories, setStories] = useState<UserStory[]>(INITIAL_STORIES);

  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [typingChatId] = useState<string | null>(null);

  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showBlockedModal, setShowBlockedModal] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [muteTargetChat, setMuteTargetChat] = useState<Chat | null>(null);

  const [locationPermission, setLocationPermission] = useState<'not_prompted' | 'granted' | 'denied'>('not_prompted');
  const [showLocationPermissionModal, setShowLocationPermissionModal] = useState(false);

  const [activeCall, setActiveCall] = useState<{
    isOpen: boolean;
    contact: User | null;
    callType: 'audio' | 'video';
  }>({
    isOpen: false,
    contact: null,
    callType: 'audio'
  });

  const [selectedStory, setSelectedStory] = useState<UserStory | null>(null);

  const currentUser = users.find((u) => u.id === currentUserId) || users[0] || defaultUser;
  const activeChat = chats.find((c) => c.id === activeChatId) || null;

  const getChatContact = (chat: Chat | null): User | undefined => {
    if (!chat || chat.isGroup) return undefined;
    const otherId = chat.participantIds.find((id) => id !== currentUser.id);
    return users.find((u) => u.id === otherId);
  };

  const activeContact = getChatContact(activeChat);

  const blockedUsers = users.filter((u) => {
    const userChat = chats.find(
      (c) => !c.isGroup && c.participantIds.includes(u.id) && c.participantIds.includes(currentUser.id)
    );
    return userChat?.isBlocked;
  });

  const unreadTotal = chats.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  const handleSwitchUser = (userId: string) => {
    setCurrentUserId(userId);
    setActiveChatId(null);
  };

  const handleUpdateUser = (updatedFields: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUser.id ? { ...u, ...updatedFields } : u))
    );
  };

  const handleToggleHidePhone = () => {
    const nextVal = !currentUser.hidePhone;
    handleUpdateUser({
      hidePhone: nextVal,
      phonePrivacy: nextVal ? 'hidden' : 'everyone'
    });
  };

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId);
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (
    text: string,
    type: 'text' | 'image' | 'voice' = 'text',
    mediaUrl?: string,
    audioDuration?: number
  ) => {
    if (!activeChatId) return;

    const timeString = new Date().toLocaleTimeString('tr-TR', {
      hour: '2-digit',
      minute: '2-digit'
    });

    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      chatId: activeChatId,
      senderId: currentUser.id,
      text,
      timestamp: timeString,
      status: 'sent',
      type,
      mediaUrl,
      audioDuration
    };

    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: [...(prev[activeChatId] || []), newMessage]
    }));

    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, lastMessage: newMessage } : c))
    );
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!activeChatId) return;
    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: (prev[activeChatId] || []).filter((m) => m.id !== messageId)
    }));
  };

  const handleClearChat = () => {
    if (!activeChatId) return;
    setMessagesMap((prev) => ({
      ...prev,
      [activeChatId]: []
    }));
    setChats((prev) =>
      prev.map((c) => (c.id === activeChatId ? { ...c, lastMessage: undefined } : c))
    );
    setShowContactInfo(false);
  };

  const handleToggleMute = (chatId?: string) => {
    const targetId = chatId || activeChatId;
    if (!targetId) return;
    const targetChat = chats.find((c) => c.id === targetId);
    if (!targetChat) return;

    if (targetChat.isMuted) {
      setChats((prev) =>
        prev.map((c) =>
          c.id === targetId ? { ...c, isMuted: false, mutedUntil: undefined } : c
        )
      );
    } else {
      setMuteTargetChat(targetChat);
    }
  };

  const handleConfirmMute = (duration: string) => {
    if (!muteTargetChat) return;
    setChats((prev) =>
      prev.map((c) =>
        c.id === muteTargetChat.id
          ? { ...c, isMuted: true, mutedUntil: duration }
          : c
      )
    );
    setMuteTargetChat(null);
  };

  const handleToggleBlock = (chatId?: string) => {
    const targetId = chatId || activeChatId;
    if (!targetId) return;
    setChats((prev) =>
      prev.map((c) => (c.id === targetId ? { ...c, isBlocked: !c.isBlocked } : c))
    );
  };

  const handleUnblockUser = (userId: string) => {
    setChats((prev) =>
      prev.map((c) =>
        !c.isGroup && c.participantIds.includes(userId)
          ? { ...c, isBlocked: false }
          : c
      )
    );
  };

  const handleTogglePin = (chatId: string) => {
    setChats((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, isPinned: !c.isPinned } : c))
    );
  };

  const handleStartChatWithUser = (user: User) => {
    const existing = chats.find(
      (c) => !c.isGroup && c.participantIds.includes(user.id) && c.participantIds.includes(currentUser.id)
    );

    if (existing) {
      setActiveChatId(existing.id);
      setActiveTab('chats');
      return;
    }

    const newChatId = `chat_${user.id}_${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      isGroup: false,
      name: user.name,
      avatar: user.avatar,
      participantIds: [currentUser.id, user.id],
      unreadCount: 0,
      isPinned: false,
      isArchived: false,
      isMuted: false,
      isBlocked: false,
      disappearingMessages: 'off'
    };

    setChats((prev) => [newChat, ...prev]);
    setMessagesMap((prev) => ({
      ...prev,
      [newChatId]: []
    }));
    setActiveChatId(newChatId);
    setActiveTab('chats');
  };

  const handleDeleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
    }
  };

  const handleStartCall = (contactId: string, type: 'audio' | 'video') => {
    const contact = users.find((u) => u.id === contactId) || activeContact;
    if (!contact) return;

    setActiveCall({
      isOpen: true,
      contact,
      callType: type
    });

    const newCall: CallRecord = {
      id: `call_${Date.now()}`,
      contactId: contact.id,
      contactName: contact.name,
      contactAvatar: contact.avatar,
      type,
      direction: 'outgoing',
      timestamp: 'Az önce',
      duration: 'Devam ediyor...'
    };
    setCalls((prev) => [newCall, ...prev]);
  };

  const handleAddStory = (caption: string) => {
    const newStory: UserStory = {
      id: `story_me_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      updatedAt: 'Şimdi',
      isViewed: false,
      slides: [
        {
          id: `sl_${Date.now()}`,
          mediaUrl: currentUser.avatar,
          caption,
          timestamp: 'Az önce'
        }
      ]
    };
    setStories((prev) => [newStory, ...prev]);
  };

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'nearby' && locationPermission === 'not_prompted') {
      setShowLocationPermissionModal(true);
    }
  };

  const renderTabContent = () => {
    if (activeTab === 'chats') {
      return (
        <ChatList
          chats={chats}
          users={users}
          currentUser={currentUser}
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onOpenNewChat={() => setShowNewChatModal(true)}
          onOpenMuteModal={(c) => setMuteTargetChat(c)}
          onTogglePin={handleTogglePin}
          onDeleteChat={handleDeleteChat}
          deviceOS="apple"
          currentTheme={currentTheme}
          onOpenThemeSelector={() => setShowThemeSelectorModal(true)}
          onOpenEmergencyMesh={() => setActiveTab('emergency')}
        />
      );
    }
    if (activeTab === 'emergency') {
      return (
        <EmergencyMeshView
          currentUser={currentUser}
          onClose={() => setActiveTab('chats')}
          isApple={true}
        />
      );
    }
    if (activeTab === 'nearby') {
      return (
        <NearbyView
          currentUser={currentUser}
          allUsers={users}
          locationPermission={locationPermission}
          onRequestPermission={() => setShowLocationPermissionModal(true)}
          onStartChat={(u) => handleStartChatWithUser(u)}
          deviceOS="apple"
          currentTheme={currentTheme}
          onOpenThemeSelector={() => setShowThemeSelectorModal(true)}
        />
      );
    }
    if (activeTab === 'status') {
      return (
        <StatusView
          stories={stories}
          currentUser={currentUser}
          onSelectStory={(s) => setSelectedStory(s)}
          onAddStory={handleAddStory}
          deviceOS="apple"
          currentTheme={currentTheme}
          onOpenThemeSelector={() => setShowThemeSelectorModal(true)}
        />
      );
    }
    if (activeTab === 'calls') {
      return (
        <CallsView
          calls={calls}
          onStartCall={(id, type) => handleStartCall(id, type)}
          onOpenNewCall={() => setShowNewChatModal(true)}
          deviceOS="apple"
          currentTheme={currentTheme}
          onOpenThemeSelector={() => setShowThemeSelectorModal(true)}
        />
      );
    }
    if (activeTab === 'settings') {
      return (
        <SettingsView
          currentUser={currentUser}
          allUsers={users}
          onSwitchUser={handleSwitchUser}
          onOpenPrivacyModal={() => setShowPrivacyModal(true)}
          onOpenBlockedModal={() => setShowBlockedModal(true)}
          onOpenProfileEdit={() => setShowProfileEdit(true)}
          onToggleHidePhone={handleToggleHidePhone}
          blockedCount={blockedUsers.length}
          deviceOS="apple"
          onChangeDeviceOS={() => {}}
          viewMode="responsive"
          onChangeViewMode={() => {}}
          currentTheme={currentTheme}
          onOpenThemeSelector={() => setShowThemeSelectorModal(true)}
          onOpenEmergencyMesh={() => setActiveTab('emergency')}
        />
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#0B0F17] text-slate-100">
      {!authUser && (
        <AuthModal
          onLogin={(user: AuthUser) => {
            setAuthUser(user);
            localStorage.setItem('chattr_user', JSON.stringify(user));
            const newU: User = {
              id: `user_${Date.now()}`,
              name: user.name,
              username: user.username,
              phone: user.phone,
              hidePhone: false,
              phonePrivacy: 'everyone',
              lastSeenPrivacy: 'everyone',
              readReceipts: true,
              avatar: user.avatar,
              bio: user.bio,
              isOnline: true,
              lastSeenTime: 'Şimdi'
            };
            setUsers((prev) => [newU, ...prev]);
            setCurrentUserId(newU.id);
          }}
        />
      )}

      <div className="flex-1 flex h-full overflow-hidden">
        <div className="w-full md:w-[380px] lg:w-[420px] flex flex-col border-r border-slate-800 shrink-0 h-full bg-[#0B0F17]">
          <div className="flex-1 overflow-hidden flex flex-col">
            {renderTabContent()}
          </div>
          <Navigation
            activeTab={activeTab}
            onTabChange={handleTabChange}
            unreadTotal={unreadTotal}
            deviceOS="apple"
            currentTheme={currentTheme}
          />
        </div>

        <div className="hidden md:flex flex-1 flex-col h-full bg-[#0B0F17] relative overflow-hidden">
          {activeChat ? (
            <ChatView
              chat={activeChat}
              messages={messagesMap[activeChat.id] || []}
              currentUser={currentUser}
              contactUser={activeContact}
              onBack={() => setActiveChatId(null)}
              onSendMessage={handleSendMessage}
              onDeleteMessage={handleDeleteMessage}
              onToggleMute={() => handleToggleMute(activeChat.id)}
              onToggleBlock={() => handleToggleBlock(activeChat.id)}
              onClearChat={handleClearChat}
              onOpenContactInfo={() => setShowContactInfo(true)}
              onStartCall={(type) =>
                activeContact && handleStartCall(activeContact.id, type)
              }
              deviceOS="apple"
              currentTheme={currentTheme}
              isTyping={typingChatId === activeChat.id}
            />
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 select-none">
              <div className="w-20 h-20 rounded-full bg-slate-800/80 flex items-center justify-center mb-4">
                <MessageSquare className="w-10 h-10 text-slate-400 stroke-1" />
              </div>
              <h3 className="text-xl font-bold text-slate-200">
                ChatTR Güvenli Mesajlaşma
              </h3>
              <p className="text-xs text-slate-400 max-w-sm mt-1 leading-relaxed">
                Mesaj göndermek veya almak için soldaki listeden bir sohbet seçin ya da yeni bir sohbet başlatın.
              </p>
            </div>
          )}
        </div>
      </div>

      <LocationPermissionModal
        isOpen={showLocationPermissionModal}
        onClose={() => setShowLocationPermissionModal(false)}
        onGrantPermission={() => {
          setLocationPermission('granted');
          setShowLocationPermissionModal(false);
        }}
        onDenyPermission={() => {
          setLocationPermission('denied');
          setShowLocationPermissionModal(false);
        }}
        isApple={true}
        userHidesPhone={currentUser.hidePhone}
        username={currentUser.username}
      />

      <NewChatModal
        isOpen={showNewChatModal}
        onClose={() => setShowNewChatModal(false)}
        users={users}
        currentUser={currentUser}
        onStartChatWithUser={handleStartChatWithUser}
        onOpenNearby={() => {
          setActiveTab('nearby');
          if (locationPermission === 'not_prompted') {
            setShowLocationPermissionModal(true);
          }
        }}
        isApple={true}
      />

      <ContactInfoModal
        isOpen={showContactInfo}
        onClose={() => setShowContactInfo(false)}
        contact={activeContact || null}
        chat={activeChat}
        onToggleMute={() => handleToggleMute()}
        onToggleBlock={() => handleToggleBlock()}
        onClearChat={handleClearChat}
        onStartCall={(type) => activeContact && handleStartCall(activeContact.id, type)}
        isApple={true}
      />

      <PrivacySettingsModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        currentUser={currentUser}
        onUpdateUser={handleUpdateUser}
        onOpenBlockedUsers={() => {
          setShowPrivacyModal(false);
          setShowBlockedModal(true);
        }}
        blockedCount={blockedUsers.length}
        isApple={true}
      />

      <BlockedUsersModal
        isOpen={showBlockedModal}
        onClose={() => setShowBlockedModal(false)}
        blockedUsers={blockedUsers}
        onUnblock={handleUnblockUser}
        isApple={true}
      />

      <ProfileEditModal
        isOpen={showProfileEdit}
        onClose={() => setShowProfileEdit(false)}
        currentUser={currentUser}
        onSave={handleUpdateUser}
        isApple={true}
      />

      <MuteModal
        isOpen={!!muteTargetChat}
        contactName={muteTargetChat?.name || ''}
        onClose={() => setMuteTargetChat(null)}
        onConfirm={handleConfirmMute}
        isApple={true}
      />

      <ActiveCallModal
        isOpen={activeCall.isOpen}
        contact={activeCall.contact}
        callType={activeCall.callType}
        onEndCall={() =>
          setActiveCall({ isOpen: false, contact: null, callType: 'audio' })
        }
        isApple={true}
      />

      <StatusStoryModal
        isOpen={!!selectedStory}
        story={selectedStory}
        onClose={() => {
          if (selectedStory) {
            setStories((prev) =>
              prev.map((s) => (s.id === selectedStory.id ? { ...s, isViewed: true } : s))
            );
          }
          setSelectedStory(null);
        }}
        onReply={(_storyId, reply) => {
          if (selectedStory) {
            const userChat = chats.find(
              (c) => !c.isGroup && c.participantIds.includes(selectedStory.userId)
            );
            if (userChat) {
              setActiveChatId(userChat.id);
              setActiveTab('chats');
              handleSendMessage(`Durum yanıtı: "${reply}"`);
            }
          }
        }}
        isApple={true}
      />

      <ThemeSelectorModal
        isOpen={showThemeSelectorModal}
        onClose={() => setShowThemeSelectorModal(false)}
        currentTheme={currentTheme}
        onSelectTheme={setCurrentTheme}
        isApple={true}
      />
    </div>
  );
}