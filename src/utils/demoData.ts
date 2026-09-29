import { User, Moment, VaultMemory, IdeaItem, Couple } from '../types/tether';

export const USER_SANJAY: User = {
  id: 'user_sanjay',
  name: 'Sanjay',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
  email: 'sanjaysankar1314@gmail.com',
  isPremium: true,
  tier: 'premium_monthly',
  currentVibe: 'free_to_talk',
  vibeUpdatedAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  isInFocusMode: false,
};

export const USER_ALEX: User = {
  id: 'user_alex',
  name: 'Alex',
  avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
  email: 'alex.partner@tether.love',
  isPremium: true,
  tier: 'premium_monthly',
  currentVibe: 'thinking_of_you',
  vibeUpdatedAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
  isInFocusMode: false,
};

// Generates warm, aesthetic inline SVG data URIs for photos when needed
export const createAestheticImage = (type: 'coffee' | 'sunset' | 'park' | 'candle' | 'custom', text?: string) => {
  const configs: Record<string, { bg1: string; bg2: string; icon: string; title: string }> = {
    coffee: {
      bg1: '#3D281E',
      bg2: '#755446',
      icon: '☕',
      title: text || 'Morning roast with you',
    },
    sunset: {
      bg1: '#C86D51',
      bg2: '#5C3843',
      icon: '🌅',
      title: text || 'Sunset over the bay',
    },
    park: {
      bg1: '#2E473B',
      bg2: '#5F735B',
      icon: '🌿',
      title: text || 'Quiet afternoon walk',
    },
    candle: {
      bg1: '#2B2320',
      bg2: '#8E5A3C',
      icon: '🕯️',
      title: text || 'Dinner at home',
    },
    custom: {
      bg1: '#4A3B32',
      bg2: '#2B211E',
      icon: '✨',
      title: text || 'Special moment',
    },
  };

  const c = configs[type] || configs.custom;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="100%" height="100%">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${c.bg1}" />
        <stop offset="100%" stop-color="${c.bg2}" />
      </linearGradient>
      <filter id="noise" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.08 0" />
      </filter>
    </defs>
    <rect width="100%" height="100%" fill="url(#grad)" />
    <circle cx="300" cy="380" r="160" fill="#ffffff" opacity="0.08" />
    <circle cx="300" cy="380" r="120" fill="#ffffff" opacity="0.06" />
    <text x="300" y="380" font-size="72" text-anchor="middle" dominant-baseline="central">${c.icon}</text>
    <text x="300" y="490" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="22" font-weight="500" fill="#FDFBF9" text-anchor="middle" opacity="0.92">${c.title}</text>
    <text x="300" y="525" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="14" fill="#FDFBF9" text-anchor="middle" opacity="0.5">Tether · Captured with care</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const INITIAL_COUPLE: Couple = {
  id: 'couple_sanjay_alex',
  partnerA: USER_SANJAY,
  partnerB: USER_ALEX,
  pairingCode: 'TETHER-8F4K',
  createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 120).toISOString(),
  anniversaryDate: 'October 14',
};

const now = Date.now();
const hour = 1000 * 60 * 60;

export const INITIAL_MOMENTS: Moment[] = [
  {
    id: 'moment_alex_coffee',
    coupleId: 'couple_sanjay_alex',
    senderId: 'user_alex',
    senderName: 'Alex',
    senderAvatar: USER_ALEX.avatar,
    mediaType: 'photo',
    mediaUrl: createAestheticImage('coffee', 'Your favorite cup ☕'),
    caption: 'Thought of you with the first sip this morning.',
    createdAt: new Date(now - hour * 2).toISOString(),
    expiresAt: new Date(now + hour * 46).toISOString(),
    isSavedToVault: true,
    isLocked: true, // locked for intimacy check
  },
  {
    id: 'moment_sanjay_voice',
    coupleId: 'couple_sanjay_alex',
    senderId: 'user_sanjay',
    senderName: 'Sanjay',
    senderAvatar: USER_SANJAY.avatar,
    mediaType: 'audio',
    mediaUrl: 'sample_audio_voice',
    caption: 'Leaving the office now. Counting down the minutes until dinner.',
    durationSeconds: 11,
    audioWaveform: [25, 45, 70, 90, 60, 80, 100, 75, 40, 65, 85, 95, 60, 40, 20],
    createdAt: new Date(now - hour * 5).toISOString(),
    expiresAt: new Date(now + hour * 43).toISOString(),
    isSavedToVault: false,
    isLocked: false,
  },
  {
    id: 'moment_alex_sunset_video',
    coupleId: 'couple_sanjay_alex',
    senderId: 'user_alex',
    senderName: 'Alex',
    senderAvatar: USER_ALEX.avatar,
    mediaType: 'video',
    mediaUrl: createAestheticImage('sunset', 'The sky looks just like Saturday'),
    caption: 'Wish you were standing right here beside me.',
    durationSeconds: 14,
    createdAt: new Date(now - hour * 18).toISOString(),
    expiresAt: new Date(now + hour * 30).toISOString(),
    isSavedToVault: true,
    isLocked: false,
  },
  {
    id: 'moment_alex_park',
    coupleId: 'couple_sanjay_alex',
    senderId: 'user_alex',
    senderName: 'Alex',
    senderAvatar: USER_ALEX.avatar,
    mediaType: 'photo',
    mediaUrl: createAestheticImage('park', 'Our bench by the pond 🌿'),
    caption: 'Someone was playing soft acoustic guitar here.',
    durationSeconds: undefined,
    createdAt: new Date(now - hour * 34).toISOString(),
    expiresAt: new Date(now + hour * 14).toISOString(),
    isSavedToVault: false,
    isLocked: false,
  },
];

export const INITIAL_VAULT: VaultMemory[] = [
  {
    id: 'vault_mem_1',
    coupleId: 'couple_sanjay_alex',
    momentId: 'moment_alex_coffee',
    moment: INITIAL_MOMENTS[0],
    savedAt: new Date(now - hour * 1).toISOString(),
    savedBy: 'user_sanjay',
    note: 'First quiet Tuesday morning together in autumn.',
  },
  {
    id: 'vault_mem_2',
    coupleId: 'couple_sanjay_alex',
    momentId: 'moment_alex_sunset_video',
    moment: INITIAL_MOMENTS[2],
    savedAt: new Date(now - hour * 12).toISOString(),
    savedBy: 'user_sanjay',
    note: 'The sky on our 6-month celebration weekend.',
  },
  {
    id: 'vault_mem_3',
    coupleId: 'couple_sanjay_alex',
    momentId: 'vault_special_anniv',
    moment: {
      id: 'vault_special_anniv',
      coupleId: 'couple_sanjay_alex',
      senderId: 'user_alex',
      senderName: 'Alex',
      senderAvatar: USER_ALEX.avatar,
      mediaType: 'photo',
      mediaUrl: createAestheticImage('candle', 'First candlelit dinner'),
      caption: 'The night we burned the sourdough and laughed for hours.',
      createdAt: new Date(now - hour * 24 * 40).toISOString(),
      expiresAt: new Date(now - hour * 24 * 38).toISOString(),
      isSavedToVault: true,
      isLocked: false,
    },
    savedAt: new Date(now - hour * 24 * 39).toISOString(),
    savedBy: 'user_alex',
    note: 'Best burnt bread ever.',
  }
];

export const INITIAL_IDEAS: IdeaItem[] = [
  {
    id: 'idea_1',
    coupleId: 'couple_sanjay_alex',
    title: 'Handmade gnocchi with browned butter sage',
    note: 'Grab the potato ricer from mom this weekend.',
    category: 'cook',
    createdBy: 'user_alex',
    createdByName: 'Alex',
    createdAt: new Date(now - hour * 48).toISOString(),
    isCompleted: false,
  },
  {
    id: 'idea_2',
    coupleId: 'couple_sanjay_alex',
    title: 'Saturday morning vinyl hunt & espresso',
    note: 'Check out the vintage record shop in the alleyway.',
    category: 'date',
    createdBy: 'user_sanjay',
    createdByName: 'Sanjay',
    createdAt: new Date(now - hour * 24).toISOString(),
    isCompleted: false,
  },
  {
    id: 'idea_3',
    coupleId: 'couple_sanjay_alex',
    title: 'Sunset picnic at the botanical garden overlook',
    note: 'Bring the heavy fleece blanket and hot tea thermos.',
    category: 'place',
    createdBy: 'user_alex',
    createdByName: 'Alex',
    createdAt: new Date(now - hour * 72).toISOString(),
    isCompleted: true,
  },
  {
    id: 'idea_4',
    coupleId: 'couple_sanjay_alex',
    title: 'Rewatch Studio Ghibli films in chronological order',
    note: 'Starting with Nausicaä & warm matcha.',
    category: 'watch',
    createdBy: 'user_sanjay',
    createdByName: 'Sanjay',
    createdAt: new Date(now - hour * 12).toISOString(),
    isCompleted: false,
  },
  {
    id: 'idea_5',
    coupleId: 'couple_sanjay_alex',
    title: 'Weekend cabin in the coastal pines',
    note: 'Turn off phones for 48 hours straight.',
    category: 'future',
    createdBy: 'user_alex',
    createdByName: 'Alex',
    createdAt: new Date(now - hour * 96).toISOString(),
    isCompleted: false,
  },
];
