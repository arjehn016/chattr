import { User, Chat, Message, CallRecord, UserStory } from './types';

// Örnek/Fake hesapları temizledik
export const INITIAL_USERS: User[] = [];

export const INITIAL_CHATS: Chat[] = [];

export const INITIAL_MESSAGES: Record<string, Message[]> = {};

export const INITIAL_CALLS: CallRecord[] = [];

export const INITIAL_STORIES: UserStory[] = [];

// Bileşenlerin hata vermemesi için gerekli dışa aktarmalar (export)
export const WALLPAPER_IMAGE = '';

export const INITIAL_NEARBY_GROUPS: any[] = [];