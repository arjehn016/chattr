import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Phone,
  Video,
  MoreVertical,
  Smile,
  Paperclip,
  Mic,
  Send,
  Check,
  CheckCheck,
  VolumeX,
  Volume2,
  Ban,
  UserCheck,
  Info,
  Trash2,
  Reply,
  Star,
  Shield,
  ShieldAlert,
  Image as ImageIcon,
  FileText,
  MapPin,
  X
} from 'lucide-react';
import { Chat, Message, User, DeviceOS, AppTheme } from '../types';
import { AudioWaveform } from './AudioWaveform';
import { WALLPAPER_IMAGE } from '../mockData';
import { THEMES } from '../themeStyles';

interface ChatViewProps {
  chat: Chat;
  messages: Message[];
  currentUser: User;
  contactUser?: User;
  onBack: () => void;
  onSendMessage: (text: string, type?: 'text' | 'image' | 'voice', mediaUrl?: string, duration?: number) => void;
  onDeleteMessage: (messageId: string) => void;
  onToggleMute: () => void;
  onToggleBlock: () => void;
  onClearChat: () => void;
  onOpenContactInfo: () => void;
  onStartCall: (type: 'audio' | 'video') => void;
  deviceOS: DeviceOS;
  currentTheme?: AppTheme;
  isTyping?: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({
  chat,
  messages,
  currentUser,
  contactUser,
  onBack,
  onSendMessage,
  onDeleteMessage,
  onToggleMute,
  onToggleBlock,
  onClearChat,
  onOpenContactInfo,
  onStartCall,
  deviceOS,
  currentTheme = 'cyber_neon',
  isTyping = false
}) => {
  const theme = THEMES[currentTheme] || THEMES.cyber_neon;
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [replyMessage, setReplyMessage] = useState<Message | null>(null);

  // Audio recording simulation
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isApple = deviceOS === 'apple';
  const isBlocked = chat.isBlocked;

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Audio recording timer
  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isBlocked) return;
    onSendMessage(inputText.trim(), 'text');
    setInputText('');
    setReplyMessage(null);
    setShowEmojiPicker(false);
  };

  const handleSendVoice = () => {
    setIsRecording(false);
    const dur = Math.max(2, recordSeconds);
    onSendMessage('Sesli Mesaj', 'voice', undefined, dur);
  };

  const emojis = ['👍', '❤️', '😂', '🔥', '🙏', '👏', '😊', '😍', '🎉', '✨', '👋', '☕', '💡', '✅', '🚀'];

  const addEmoji = (emoji: string) => {
    setInputText((prev) => prev + emoji);
  };

  const sampleImages = [
    { name: 'Ofis Çalışması', url: '/src/assets/images/chat_wallpaper_subtle_1791988436409.jpg' },
    { name: 'Fotoğraf', url: contactUser?.avatar || '/src/assets/images/avatar_turkish_woman_1791988436724.jpg' }
  ];

  const handleSendAttachment = (url: string) => {
    setShowAttachMenu(false);
    onSendMessage('Görsel paylaşıldı', 'image', url);
  };

  return (
    <div className={`flex-1 flex flex-col h-full ${theme.bgClass} relative overflow-hidden select-none`}>
      {/* Subtle modern wallpaper overlay */}
      <div
        className="absolute inset-0 opacity-15 pointer-events-none bg-repeat bg-center"
        style={{ backgroundImage: `url(${WALLPAPER_IMAGE})` }}
      />
      <div className={`absolute inset-0 pointer-events-none ${theme.wallpaperOverlay}`} />

      {/* Top Navigation Bar */}
      <header
        className={`relative z-20 px-3.5 py-2.5 flex items-center justify-between border-b shrink-0 ${theme.headerClass}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 -ml-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors flex items-center"
            title="Geri"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Contact Avatar & Header Info */}
          <div
            onClick={onOpenContactInfo}
            className="flex items-center gap-2.5 cursor-pointer min-w-0 group"
          >
            <div className="relative w-10 h-10 rounded-full bg-slate-300 overflow-hidden shrink-0 flex items-center justify-center font-bold text-slate-700">
              {chat.avatar ? (
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                chat.name.charAt(0)
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h2
                  className={`text-sm font-semibold truncate ${theme.textPrimary}`}
                >
                  {chat.name}
                </h2>
                {chat.isMuted && (
                  <VolumeX className="w-3.5 h-3.5 opacity-60 shrink-0 text-slate-400" />
                )}
              </div>

              {/* Status subtitle */}
              <p
                className={`text-[11px] truncate flex items-center gap-1 ${theme.textSecondary}`}
              >
                {isTyping ? (
                  <span className="font-semibold animate-pulse text-cyan-400">
                    yazıyor...
                  </span>
                ) : isBlocked ? (
                  <span className="text-rose-400 font-medium">Engellendi</span>
                ) : contactUser?.hidePhone ? (
                  <span className="flex items-center gap-1">
                    <Shield className="w-3 h-3 text-cyan-400" />
                    <span>@{contactUser.username} (Numara Gizli)</span>
                  </span>
                ) : contactUser?.isOnline ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Çevrim içi
                  </span>
                ) : (
                  contactUser?.lastSeenTime || 'Son görülme yakınlarda'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onStartCall('video')}
            className="p-2 rounded-full text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition-colors"
            title="Görüntülü Arama"
          >
            <Video className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => onStartCall('audio')}
            className="p-2 rounded-full text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition-colors"
            title="Sesli Arama"
          >
            <Phone className="w-5 h-5" />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMoreMenu(!showMoreMenu)}
              className="p-2 rounded-full text-slate-300 hover:text-cyan-300 hover:bg-white/10 transition-colors"
              title="Daha Fazla Seçenek"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* Dropdown Menu */}
            {showMoreMenu && (
              <div
                className={`absolute right-0 top-12 w-56 rounded-2xl shadow-2xl py-2 z-40 text-xs font-medium backdrop-blur-xl animate-in fade-in duration-100 ${theme.cardClass}`}
                onClick={() => setShowMoreMenu(false)}
              >
                <button
                  type="button"
                  onClick={onOpenContactInfo}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/10 flex items-center gap-2.5 text-slate-200"
                >
                  <Info className="w-4 h-4 text-cyan-400" />
                  Kişi Bilgisi
                </button>
                <button
                  type="button"
                  onClick={onToggleMute}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/10 flex items-center gap-2.5 text-slate-200"
                >
                  {chat.isMuted ? (
                    <>
                      <Volume2 className="w-4 h-4 text-cyan-400" />
                      Sesi Aç
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-4 h-4 text-slate-400" />
                      Sessize Al
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClearChat}
                  className="w-full text-left px-4 py-2.5 hover:bg-white/10 flex items-center gap-2.5 text-slate-200"
                >
                  <Trash2 className="w-4 h-4 text-slate-400" />
                  Sohbeti Temizle
                </button>
                <div className="my-1 border-t border-white/10" />
                <button
                  type="button"
                  onClick={onToggleBlock}
                  className={`w-full text-left px-4 py-2.5 hover:bg-white/10 flex items-center gap-2.5 font-semibold ${
                    isBlocked ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isBlocked ? (
                    <>
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      Engeli Kaldır
                    </>
                  ) : (
                    <>
                      <Ban className="w-4 h-4 text-rose-400" />
                      Kişiyi Engelle
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10">
        {/* Phone privacy notice banner if contact phone is hidden */}
        {contactUser?.hidePhone && (
          <div className="mx-auto max-w-sm p-2.5 bg-amber-50/90 border border-amber-200/80 rounded-xl text-center text-[11px] text-amber-900 shadow-sm flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>
              Bu kullanıcının telefon numarası gizlidir. İletişim <strong>@{contactUser.username}</strong> üzerinden sağlanmaktadır.
            </span>
          </div>
        )}

        {/* Date divider */}
        <div className="flex justify-center">
          <span className="px-3 py-1 bg-white/80 shadow-xs border border-slate-200/60 rounded-lg text-[10px] font-semibold text-slate-600 tracking-wide uppercase">
            Bugün
          </span>
        </div>

        {/* Message Bubbles */}
        {messages.map((msg) => {
          const isSender = msg.senderId === currentUser.id;

          return (
            <div
              key={msg.id}
              className={`flex flex-col group ${isSender ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`relative max-w-[84%] sm:max-w-[72%] rounded-[24px] px-4 py-2.5 transition-all ${
                  isSender
                    ? `${theme.senderBubble} rounded-br-[6px]`
                    : `${theme.incomingBubble} rounded-bl-[6px]`
                }`}
              >
                {/* Quoted message if any */}
                {msg.replyTo && (
                  <div
                    className={`mb-1.5 p-1.5 rounded-lg text-[11px] border-l-2 ${
                      isSender
                        ? 'bg-black/10 border-emerald-900 text-slate-800'
                        : 'bg-slate-100 border-emerald-600 text-slate-700'
                    }`}
                  >
                    <span className="font-semibold block">{msg.replyTo.senderName}</span>
                    <span className="truncate block opacity-85">{msg.replyTo.text}</span>
                  </div>
                )}

                {/* Media Image */}
                {msg.type === 'image' && msg.mediaUrl && (
                  <div className="mb-1 rounded-xl overflow-hidden max-h-60 bg-slate-100">
                    <img
                      src={msg.mediaUrl}
                      alt="Görsel"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Voice Note Audio */}
                {msg.type === 'voice' && (
                  <AudioWaveform
                    duration={msg.audioDuration || 15}
                    isSender={isSender && isApple}
                  />
                )}

                {/* Text Message */}
                {msg.type !== 'voice' && (
                  <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                    {msg.text}
                  </p>
                )}

                {/* Timestamp & Status checks */}
                <div
                  className={`flex items-center justify-end gap-1 mt-0.5 text-[10px] font-mono leading-none ${
                    isSender && isApple ? 'text-white/80' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isSender && (
                    <span>
                      {msg.status === 'read' ? (
                        <CheckCheck
                          className={`w-3.5 h-3.5 ${
                            isApple ? 'text-white stroke-[2.5]' : 'text-blue-500 stroke-[2.5]'
                          }`}
                        />
                      ) : msg.status === 'delivered' ? (
                        <CheckCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </span>
                  )}
                </div>

                {/* Message quick actions on hover */}
                <div
                  className={`absolute top-0 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 backdrop-blur shadow-md rounded-full px-1.5 py-0.5 flex items-center gap-1 text-slate-600 border border-slate-200 z-10 ${
                    isSender ? 'right-2' : 'left-2'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setReplyMessage({
                        id: msg.id,
                        senderName: isSender ? 'Siz' : chat.name,
                        text: msg.text
                      } as any)
                    }
                    className="p-1 hover:text-emerald-600"
                    title="Yanıtla"
                  >
                    <Reply className="w-3 h-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteMessage(msg.id)}
                    className="p-1 hover:text-rose-600"
                    title="Sil"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing indicator bubble */}
        {isTyping && (
          <div className="flex items-center gap-1.5 p-3 bg-white rounded-2xl rounded-bl-xs shadow-xs w-20">
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" />
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-150" />
            <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce delay-300" />
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Reply Quote Banner */}
      {replyMessage && (
        <div className={`p-2.5 mx-3 mb-1 rounded-2xl flex items-center justify-between text-xs relative z-20 backdrop-blur-xl ${theme.cardClass}`}>
          <div className="border-l-3 border-cyan-400 pl-2.5 min-w-0">
            <span className="font-semibold text-cyan-300 block">
              {replyMessage.replyTo?.senderName || chat.name}
            </span>
            <span className="text-slate-300 truncate block max-w-xs">
              {replyMessage.text}
            </span>
          </div>
          <button
            onClick={() => setReplyMessage(null)}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Emoji Picker Drawer */}
      {showEmojiPicker && (
        <div className={`p-3 mx-3 mb-1 rounded-3xl grid grid-cols-8 gap-2 relative z-20 backdrop-blur-xl ${theme.cardClass}`}>
          {emojis.map((em, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => addEmoji(em)}
              className="text-xl p-1.5 hover:bg-white/10 rounded-xl transition-transform active:scale-125 flex items-center justify-center"
            >
              {em}
            </button>
          ))}
        </div>
      )}

      {/* Attachment Menu */}
      {showAttachMenu && (
        <div className={`p-3 mx-3 mb-1 rounded-3xl flex items-center justify-around relative z-20 backdrop-blur-xl ${theme.cardClass}`}>
          <button
            type="button"
            onClick={() => handleSendAttachment(sampleImages[0].url)}
            className="flex flex-col items-center gap-1 text-slate-300 hover:text-cyan-300 group"
          >
            <div className="w-11 h-11 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Galeri</span>
          </button>

          <button
            type="button"
            onClick={() => handleSendAttachment(sampleImages[1].url)}
            className="flex flex-col items-center gap-1 text-slate-300 hover:text-pink-300 group"
          >
            <div className="w-11 h-11 rounded-full bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Belge</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setShowAttachMenu(false);
              onSendMessage('📍 Mevcut Konum: İstanbul, Beşiktaş', 'text');
            }}
            className="flex flex-col items-center gap-1 text-slate-300 hover:text-emerald-300 group"
          >
            <div className="w-11 h-11 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-medium">Konum</span>
          </button>
        </div>
      )}

      {/* Bottom Bar: If Blocked, show Block Banner; otherwise Input Bar */}
      {isBlocked ? (
        <div className="p-4 mx-3 mb-2 rounded-2xl bg-rose-950/80 border border-rose-500/40 text-center relative z-20 backdrop-blur-md">
          <p className="text-xs font-semibold text-rose-200 mb-2">
            Bu kişiyi engellediniz. Mesaj göndermek veya almak için engeli kaldırın.
          </p>
          <button
            type="button"
            onClick={onToggleBlock}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-full shadow-lg shadow-rose-600/30 transition-transform active:scale-95"
          >
            Engeli Kaldır
          </button>
        </div>
      ) : isRecording ? (
        <div className={`p-2.5 mx-3 mb-2 rounded-full flex items-center justify-between relative z-20 backdrop-blur-xl ${theme.cardClass}`}>
          <div className="flex items-center gap-2 pl-3">
            <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
            <span className="text-xs font-mono font-semibold text-rose-400">
              00:{recordSeconds < 10 ? '0' : ''}{recordSeconds}
            </span>
            <span className="text-xs text-slate-300 ml-2">Ses kaydediliyor...</span>
          </div>

          <div className="flex items-center gap-2 pr-1">
            <button
              type="button"
              onClick={() => setIsRecording(false)}
              className="px-3 py-1 text-xs text-slate-400 hover:text-rose-400"
            >
              İptal
            </button>
            <button
              type="button"
              onClick={handleSendVoice}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-md active:scale-95 ${theme.accentColor} ${theme.neonGlow}`}
            >
              Gönder
            </button>
          </div>
        </div>
      ) : (
        <div className="p-3 bg-transparent relative z-20 shrink-0">
          <form
            onSubmit={handleSend}
            className={`p-1.5 pl-3 rounded-full flex items-center gap-2 backdrop-blur-xl ${theme.cardClass} shadow-xl`}
          >
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors"
              title="Ekle"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Mesaj yazın..."
              className={`flex-1 px-4 py-2 text-xs bg-transparent border-none focus:outline-none focus:ring-0 ${theme.textPrimary}`}
            />

            {inputText.trim() ? (
              <button
                type="submit"
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 ${theme.accentColor} ${theme.neonGlow}`}
                title="Gönder"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsRecording(true)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 shrink-0 ${theme.accentColor} ${theme.neonGlow}`}
                title="Sesli Mesaj Kaydet"
              >
                <Mic className="w-4 h-4" />
              </button>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
