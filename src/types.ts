export type DeviceOS = 'apple' | 'android';
export type AppViewMode = 'frame' | 'responsive';
export type ActiveTab = 'chats' | 'nearby' | 'status' | 'calls' | 'settings' | 'emergency';

export type AppTheme =
  | 'cyber_neon'       // Deep obsidian + electric cyan/neon emerald
  | 'synthwave_pink'   // Deep violet + hot magenta pink neon
  | 'nordic_cobalt'    // Midnight navy + electric cobalt & ice
  | 'matrix_emerald'   // Deep charcoal + luminous neon lime/emerald
  | 'solar_amber'      // Deep volcanic onyx + radiant golden amber & neon orange
  | 'minimal_pearl';   // Sleek pearl light + modern graphite

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
  hopCount: number; // Mesh jump count e.g. 1 (direct peer) or 2 (relayed)
  signalStrength: number; // percentage
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
  username: string; // e.g. "ercan_y" without @ in data, displayed with @
  phone: string; // e.g. "+90 532 987 6543"
  hidePhone: boolean; // if true, others only see username
  phonePrivacy: PhonePrivacySetting;
  lastSeenPrivacy: 'everyone' | 'contacts' | 'nobody';
  readReceipts: boolean;
  avatar: string;
  bio: string;
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
  timestamp: string; // e.g. "14:32"
  fullDate?: string;
  status: MessageStatus;
  type: MessageType;
  mediaUrl?: string;
  audioDuration?: number; // in seconds
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
  mutedUntil?: string; // e.g. "8 saat" | "1 hafta" | "Her zaman"
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
