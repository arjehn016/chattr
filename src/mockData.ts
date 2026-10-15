import { User, Chat, Message, CallRecord, UserStory } from './types';

// Sahte/dümenden botlar tamamen kaldırıldı. 
// Listeler başlangıçta boş başlar, gerçek kullanıcılar ve gruplar katıldıkça dolar.
export const INITIAL_USERS: User[] = [];

export const INITIAL_CHATS: Chat[] = [];

export const INITIAL_MESSAGES: Record<string, Message[]> = {};

export const INITIAL_CALLS: CallRecord[] = [];

export const INITIAL_STORIES: UserStory[] = [];