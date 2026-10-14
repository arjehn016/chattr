import { User, Chat, Message, CallRecord, UserStory } from './types';

export const WALLPAPER_IMAGE = '/src/assets/images/chat_wallpaper_subtle_1791988436409.jpg';
export const AVATAR_WOMAN = '/src/assets/images/avatar_turkish_woman_1791988436724.jpg';
export const AVATAR_MAN = '/src/assets/images/avatar_turkish_man_1791988437488.jpg';
export const AVATAR_DESIGNER = '/src/assets/images/avatar_tech_designer_1791988437969.jpg';

export const INITIAL_USERS: User[] = [
  {
    id: 'user_me',
    name: 'Ercan Yılmaz',
    username: 'ercan_y',
    phone: '+90 532 987 6543',
    hidePhone: true, // User hides phone by default - only accessible via username!
    phonePrivacy: 'hidden',
    lastSeenPrivacy: 'everyone',
    readReceipts: true,
    avatar: AVATAR_MAN,
    bio: 'Merhaba! SohbetApp kullanıyorum. Telefon numaram gizlidir, bana kullanıcı adımdan ulaşabilirsiniz.',
    isOnline: true,
    lastSeenTime: 'Şimdi aktif',
  },
  {
    id: 'user_zeynep',
    name: 'Zeynep Demir',
    username: 'zeynep_d',
    phone: '+90 541 234 5678',
    hidePhone: false, // Phone visible
    phonePrivacy: 'everyone',
    lastSeenPrivacy: 'everyone',
    readReceipts: true,
    avatar: AVATAR_WOMAN,
    bio: 'Tasarım & Mimarlık | Yaratıcı düşünce ☕',
    isOnline: true,
    lastSeenTime: 'Çevrim içi',
  },
  {
    id: 'user_mehmet',
    name: 'Mehmet Can',
    username: 'mehmet_c',
    phone: '+90 505 876 5432',
    hidePhone: true, // Phone hidden!
    phonePrivacy: 'hidden',
    lastSeenPrivacy: 'contacts',
    readReceipts: true,
    avatar: AVATAR_MAN,
    bio: 'Yazılım Mühendisi. Kod yazarken rahatsız etmeyiniz 💻',
    isOnline: false,
    lastSeenTime: 'Bugün 14:15',
  },
  {
    id: 'user_melis',
    name: 'Melis Aydın',
    username: 'melis_design',
    phone: '+90 555 432 1098',
    hidePhone: false, // Phone visible
    phonePrivacy: 'everyone',
    lastSeenPrivacy: 'everyone',
    readReceipts: true,
    avatar: AVATAR_DESIGNER,
    bio: 'Ürün Tasarımcısı & Fotoğraf Meraklısı 📷',
    isOnline: false,
    lastSeenTime: 'Dün 23:40',
  },
  {
    id: 'user_burak',
    name: 'Burak Öztürk',
    username: 'burak_dev',
    phone: '+90 530 111 2233',
    hidePhone: true, // Phone hidden!
    phonePrivacy: 'hidden',
    lastSeenPrivacy: 'nobody',
    readReceipts: true,
    avatar: '',
    bio: 'Yeni proje üzerinde çalışıyorum 🚀',
    isOnline: false,
    lastSeenTime: 'Bugün 09:12',
  },
  {
    id: 'user_selin',
    name: 'Selin Kaya',
    username: 'selin_k',
    phone: '+90 533 777 8899',
    hidePhone: false,
    phonePrivacy: 'contacts',
    lastSeenPrivacy: 'everyone',
    readReceipts: true,
    avatar: AVATAR_WOMAN,
    bio: 'Spor, seyahat ve kitaplar 📚✨',
    isOnline: true,
    lastSeenTime: 'Çevrim içi',
  }
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat_zeynep',
    isGroup: false,
    name: 'Zeynep Demir',
    avatar: AVATAR_WOMAN,
    participantIds: ['user_me', 'user_zeynep'],
    unreadCount: 2,
    isPinned: true,
    isArchived: false,
    isMuted: false,
    isBlocked: false,
    disappearingMessages: 'off',
    lastMessage: {
      id: 'm_z_3',
      chatId: 'chat_zeynep',
      senderId: 'user_zeynep',
      text: 'Telefon numaranı gizleme özelliğin harika olmuş! Sadece kullanıcı adından buldum seni.',
      timestamp: '14:28',
      status: 'delivered',
      type: 'text'
    }
  },
  {
    id: 'chat_mehmet',
    isGroup: false,
    name: 'Mehmet Can',
    avatar: AVATAR_MAN,
    participantIds: ['user_me', 'user_mehmet'],
    unreadCount: 0,
    isPinned: true,
    isArchived: false,
    isMuted: true,
    mutedUntil: '8 saat',
    isBlocked: false,
    disappearingMessages: 'off',
    lastMessage: {
      id: 'm_m_2',
      chatId: 'chat_mehmet',
      senderId: 'user_me',
      text: 'Tamamdır, toplantı saat 16:00 da başlayacak.',
      timestamp: '13:50',
      status: 'read',
      type: 'text'
    }
  },
  {
    id: 'chat_group_tech',
    isGroup: true,
    name: 'Yazılım & Tasarım Ekibi 🚀',
    avatar: '',
    participantIds: ['user_me', 'user_zeynep', 'user_mehmet', 'user_melis'],
    unreadCount: 5,
    isPinned: false,
    isArchived: false,
    isMuted: false,
    isBlocked: false,
    disappearingMessages: 'off',
    lastMessage: {
      id: 'm_g_1',
      chatId: 'chat_group_tech',
      senderId: 'user_melis',
      text: 'Yeni arayüz tasarımlarını Figma ya yükledim, göz atabilirsiniz!',
      timestamp: '12:14',
      status: 'read',
      type: 'text'
    }
  },
  {
    id: 'chat_melis',
    isGroup: false,
    name: 'Melis Aydın',
    avatar: AVATAR_DESIGNER,
    participantIds: ['user_me', 'user_melis'],
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isMuted: false,
    isBlocked: false,
    disappearingMessages: '7d',
    lastMessage: {
      id: 'm_mel_1',
      chatId: 'chat_melis',
      senderId: 'user_melis',
      text: 'Sesli mesaj gönderdim, müsait olduğunda dinlersin.',
      timestamp: '11:05',
      status: 'read',
      type: 'voice',
      audioDuration: 18
    }
  },
  {
    id: 'chat_burak',
    isGroup: false,
    name: 'Burak Öztürk',
    avatar: '',
    participantIds: ['user_me', 'user_burak'],
    unreadCount: 0,
    isPinned: false,
    isArchived: false,
    isMuted: false,
    isBlocked: false,
    disappearingMessages: 'off',
    lastMessage: {
      id: 'm_b_1',
      chatId: 'chat_burak',
      senderId: 'user_burak',
      text: 'Kullanıcı adı aramasından mesaj atıyorum, numaran görünmüyor gayet güvenli 👍',
      timestamp: 'Dün',
      status: 'read',
      type: 'text'
    }
  }
];

export const INITIAL_MESSAGES: Record<string, Message[]> = {
  chat_zeynep: [
    {
      id: 'm_z_1',
      chatId: 'chat_zeynep',
      senderId: 'user_me',
      text: 'Selam Zeynep! Yeni sohbet uygulaması hakkında ne düşünüyorsun?',
      timestamp: '14:20',
      status: 'read',
      type: 'text'
    },
    {
      id: 'm_z_2',
      chatId: 'chat_zeynep',
      senderId: 'user_zeynep',
      text: 'Selam! Hem Apple hem Android tarzı desteklemesi ve numara gizleme özelliği mükemmel olmuş.',
      timestamp: '14:25',
      status: 'read',
      type: 'text'
    },
    {
      id: 'm_z_3',
      chatId: 'chat_zeynep',
      senderId: 'user_zeynep',
      text: 'Telefon numaranı gizleme özelliğin harika olmuş! Sadece kullanıcı adından buldum seni.',
      timestamp: '14:28',
      status: 'delivered',
      type: 'text'
    }
  ],
  chat_mehmet: [
    {
      id: 'm_m_1',
      chatId: 'chat_mehmet',
      senderId: 'user_mehmet',
      text: 'Ercan selam, bugün sprint toplantısı ne zaman?',
      timestamp: '13:42',
      status: 'read',
      type: 'text'
    },
    {
      id: 'm_m_2',
      chatId: 'chat_mehmet',
      senderId: 'user_me',
      text: 'Tamamdır, toplantı saat 16:00 da başlayacak.',
      timestamp: '13:50',
      status: 'read',
      type: 'text'
    }
  ],
  chat_group_tech: [
    {
      id: 'm_g_0',
      chatId: 'chat_group_tech',
      senderId: 'user_zeynep',
      text: 'Arkadaşlar yeni tasarım prototiplerini paylaşıyorum.',
      timestamp: '11:45',
      status: 'read',
      type: 'text'
    },
    {
      id: 'm_g_1',
      chatId: 'chat_group_tech',
      senderId: 'user_melis',
      text: 'Yeni arayüz tasarımlarını Figma ya yükledim, göz atabilirsiniz!',
      timestamp: '12:14',
      status: 'read',
      type: 'text'
    }
  ],
  chat_melis: [
    {
      id: 'm_mel_1',
      chatId: 'chat_melis',
      senderId: 'user_melis',
      text: 'Ses kaydı: Proje revizyonları hakkında bilgi veriyorum.',
      timestamp: '11:05',
      status: 'read',
      type: 'voice',
      audioDuration: 24
    }
  ],
  chat_burak: [
    {
      id: 'm_b_1',
      chatId: 'chat_burak',
      senderId: 'user_burak',
      text: 'Kullanıcı adı aramasından mesaj atıyorum, numaran görünmüyor gayet güvenli 👍',
      timestamp: 'Dün',
      status: 'read',
      type: 'text'
    }
  ]
};

export const INITIAL_CALLS: CallRecord[] = [
  {
    id: 'call_1',
    contactId: 'user_zeynep',
    contactName: 'Zeynep Demir',
    contactAvatar: AVATAR_WOMAN,
    type: 'video',
    direction: 'incoming',
    timestamp: 'Bugün 13:45',
    duration: '4 dk 12 sn'
  },
  {
    id: 'call_2',
    contactId: 'user_mehmet',
    contactName: 'Mehmet Can',
    contactAvatar: AVATAR_MAN,
    type: 'audio',
    direction: 'outgoing',
    timestamp: 'Bugün 10:20',
    duration: '1 dk 40 sn'
  },
  {
    id: 'call_3',
    contactId: 'user_selin',
    contactName: 'Selin Kaya',
    contactAvatar: AVATAR_WOMAN,
    type: 'audio',
    direction: 'missed',
    timestamp: 'Dün 18:02'
  },
  {
    id: 'call_4',
    contactId: 'user_melis',
    contactName: 'Melis Aydın',
    contactAvatar: AVATAR_DESIGNER,
    type: 'video',
    direction: 'outgoing',
    timestamp: '12 Ekim 2026',
    duration: '15 dk 20 sn'
  }
];

export const INITIAL_STORIES: UserStory[] = [
  {
    id: 'story_zeynep',
    userId: 'user_zeynep',
    userName: 'Zeynep Demir',
    userAvatar: AVATAR_WOMAN,
    updatedAt: '25 dakika önce',
    isViewed: false,
    slides: [
      {
        id: 's_z_1',
        mediaUrl: AVATAR_DESIGNER,
        caption: 'Ofiste yeni tasarım haftası başladı! ☕🎨',
        timestamp: '14:05'
      }
    ]
  },
  {
    id: 'story_mehmet',
    userId: 'user_mehmet',
    userName: 'Mehmet Can',
    userAvatar: AVATAR_MAN,
    updatedAt: '2 saat önce',
    isViewed: false,
    slides: [
      {
        id: 's_m_1',
        mediaUrl: AVATAR_MAN,
        caption: 'Hafta sonu İstanbul yürüyüşü 🚶‍♂️',
        timestamp: '12:30'
      }
    ]
  },
  {
    id: 'story_melis',
    userId: 'user_melis',
    userName: 'Melis Aydın',
    userAvatar: AVATAR_DESIGNER,
    updatedAt: '5 saat önce',
    isViewed: true,
    slides: [
      {
        id: 's_mel_1',
        mediaUrl: AVATAR_DESIGNER,
        caption: 'Kahve molası ve kitap okuma zamanı 📖',
        timestamp: '09:20'
      }
    ]
  }
];

export const INITIAL_NEARBY_GROUPS = [
  {
    id: 'group_nearby_1',
    name: 'Kadıköy Yazılımcıları & Tasarımcılar',
    distanceText: '280 m uzakta',
    memberCount: 142,
    description: 'Bölgedeki yazılımcı ve tasarımcıların buluşma ve yardımlaşma grubu'
  },
  {
    id: 'group_nearby_2',
    name: 'Moda Sahil Koşu & Yürüyüş Kulübü',
    distanceText: '650 m uzakta',
    memberCount: 89,
    description: 'Sabah ve akşam sahil yürüyüşü ve koşu etkinlikleri 🏃‍♂️'
  },
  {
    id: 'group_nearby_3',
    name: 'Mahalle Kitap & Kahve Sohbetleri',
    distanceText: '1.2 km uzakta',
    memberCount: 56,
    description: 'Haftalık kitap incelemeleri ve kahve sohbetleri ☕📚'
  }
];
