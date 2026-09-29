export type MediaType = 'photo' | 'video' | 'audio';

export type VibeStatusType = 'overwhelmed' | 'free_to_talk' | 'thinking_of_you';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
  isPremium: boolean;
  tier: 'free' | 'premium_monthly' | 'premium_yearly';
  currentVibe: VibeStatusType;
  vibeUpdatedAt: string;
  isInFocusMode: boolean;
  focusModeReason?: string;
}

export interface Moment {
  id: string;
  coupleId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  mediaType: MediaType;
  mediaUrl: string;
  previewUrl?: string;
  caption?: string;
  durationSeconds?: number;
  audioWaveform?: number[];
  createdAt: string; // ISO string
  expiresAt: string; // ISO string (48 hours from creation)
  isSavedToVault: boolean;
  isLocked: boolean; // intimacy lock
}

export interface VaultMemory {
  id: string;
  coupleId: string;
  momentId: string;
  moment: Moment;
  savedAt: string;
  savedBy: string;
  note?: string;
}

export type IdeaCategory = 'date' | 'place' | 'watch' | 'cook' | 'activity' | 'future';

export interface IdeaItem {
  id: string;
  coupleId: string;
  title: string;
  note?: string;
  category: IdeaCategory;
  createdBy: string;
  createdByName: string;
  createdAt: string;
  isCompleted: boolean;
}

export interface Couple {
  id: string;
  partnerA: User;
  partnerB: User;
  pairingCode: string;
  createdAt: string;
  anniversaryDate?: string;
}

export interface PrivacySettings {
  biometricLockEnabled: boolean;
  stealthModeEnabled: boolean;
  calendarDndEnabled: boolean;
  hideMediaPreviews: boolean;
}

export type ActiveTab = 'home' | 'moments' | 'vault' | 'ideas' | 'settings';

export type ScreenState = 
  | 'splash'
  | 'welcome'
  | 'onboarding'
  | 'create_profile'
  | 'partner_pairing'
  | 'app';
