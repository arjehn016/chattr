export type DeviceOS = 'apple' | 'android';
export type AppViewMode = 'frame' | 'responsive';
export type ActiveTab = 'chats' | 'nearby' | 'status' | 'calls' | 'settings' | 'emergency';

export type AppTheme =
  | 'cyber_neon'
  | 'emerald_matrix'
  | 'synthwave_pink'
  | 'nordic_cobalt'
  | 'matrix_emerald'
  | 'solar_amber'
  | 'minimal_pearl';

export type PhonePrivacySetting = 'everyone' | 'contacts' | 'hidden';
export type LocationPermissionState = 'not_prompted' | 'granted' | 'denied';

export type EmergencyStatus = 'safe' | 'need_help' | 'under_rubble' | 'medical_needed';

export interface EmergencyBroadcast {
  id: string;
  senderId: string;
  senderName: string;
  username: string;
  status: EmergencyStatus;
  message: string;
  coordinates: string;
  batteryPercent: number;
  bloodType: string;
  timestamp: string;
  hopCount: number;
  signalStrength: number;
  distanceMeters: number;
}

export interface MeshPeer {
  id: string;
  name: string;
  username: string;
  distanceMeters: number;
  signalStrength: number;
  battery: number;
  status: EmergencyStatus;
  lastSeenSec: number;
}

export interface User {
  id: string;
  name: string;
  username: string;
  phone: string;
  hidePhone: boolean;
  phonePrivacy: PhonePrivacySetting;
  lastSeenPrivacy: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
  avatar: string;
  bio: string;
  about?: string;
  isOnline: boolean;
  lastSeenTime: string;
  isNearbyVisible?: boolean;
  locationPermission?: LocationPermissionState;
}

export interface NearbyUser {
  user: User;
  distanceMeters: number;
  distanceText: string;
  isWaved: boolean;
}

export interface NearbyGroup {
  id: string;
  name: string;
  distanceText: string;
  memberCount: number;
  description: string;
}

export type MessageType = 'text' | 'image' | 'voice' | 'file';
export type MessageStatus = 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  fullDate?: string;
  status: MessageStatus;
  type: MessageType;
  mediaUrl?: string;
  audioDuration?: number;
  fileName?: string;
  fileSize?: string;
  replyTo?: {
    id: string;
    senderName: string;
    text: string;
  };
  isStarred?: boolean;
}

export interface Chat {
  id: string;
  isGroup: boolean;
  name: string;
  avatar: string;
  participantIds: string[];
  unreadCount: number;
  isPinned: boolean;
  isArchived: boolean;
  isMuted: boolean;
  mutedUntil?: string;
  isBlocked: boolean;
  disappearingMessages: 'off' | '24h' | '7d' | '90d';
  lastMessage?: Message;
  draftMessage?: string;
}

export interface CallRecord {
  id: string;
  contactId: string;
  contactName: string;
  contactAvatar: string;
  type: 'audio' | 'video';
  direction: 'incoming' | 'outgoing' | 'missed';
  timestamp: string;
  duration?: string;
}

export interface StorySlide {
  id: string;
  mediaUrl: string;
  caption?: string;
  timestamp: string;
}

export interface UserStory {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  slides: StorySlide[];
  isViewed: boolean;
  updatedAt: string;
}