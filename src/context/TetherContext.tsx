import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Moment, 
  VaultMemory, 
  IdeaItem, 
  Couple, 
  VibeStatusType, 
  IdeaCategory,
  PrivacySettings, 
  ActiveTab, 
  ScreenState 
} from '../types/tether';
import { 
  USER_SANJAY, 
  USER_ALEX, 
  INITIAL_COUPLE, 
  INITIAL_MOMENTS, 
  INITIAL_VAULT, 
  INITIAL_IDEAS 
} from '../utils/demoData';
import { soundEngine } from '../utils/audioPlayer';
import { DbService } from '../services/dbService';

interface TetherContextType {
  currentUserId: string;
  user: User;
  partner: User;
  couple: Couple;
  moments: Moment[];
  vaultMemories: VaultMemory[];
  ideas: IdeaItem[];
  screenState: ScreenState;
  activeTab: ActiveTab;
  privacySettings: PrivacySettings;
  isDbConnected: boolean;
  
  // Modals & Navigation
  isTapAndTalkOpen: boolean;
  activePaywallReason: string | null;
  biometricTargetMoment: Moment | null;
  selectedVaultMemory: VaultMemory | null;
  isAddIdeaModalOpen: boolean;
  isSettingsSubScreen: string | null;
  isLockScreenActive: boolean;
  
  // Actions
  setScreenState: (s: ScreenState) => void;
  setActiveTab: (t: ActiveTab) => void;
  setIsTapAndTalkOpen: (open: boolean) => void;
  setIsAddIdeaModalOpen: (open: boolean) => void;
  setSelectedVaultMemory: (mem: VaultMemory | null) => void;
  setIsSettingsSubScreen: (sub: string | null) => void;
  setIsLockScreenActive: (active: boolean) => void;
  
  setVibe: (status: VibeStatusType) => void;
  sendMoment: (mediaType: 'photo' | 'video' | 'audio', mediaUrl: string, caption?: string, duration?: number, waveform?: number[]) => void;
  unlockMoment: (momentId: string) => void;
  promptUnlockMoment: (moment: Moment) => void;
  closeBiometricModal: () => void;
  saveToVault: (momentId: string, note?: string) => boolean;
  removeFromVault: (vaultId: string) => void;
  addIdea: (title: string, category: IdeaCategory, note?: string) => void;
  toggleIdeaCompleted: (ideaId: string) => void;
  deleteIdea: (ideaId: string) => void;
  
  switchPartnerPerspective: () => void;
  upgradeToPremium: (tier: 'premium_monthly' | 'premium_yearly') => void;
  downgradeToFree: () => void;
  triggerPaywall: (featureName: string) => void;
  closePaywall: () => void;
  updatePrivacySettings: (settings: Partial<PrivacySettings>) => void;
  setCalendarDnd: (enabled: boolean, reason?: string) => void;
  
  // Pairing / Profile flow
  updateUserProfile: (name: string, avatar: string) => void;
  pairWithCode: (code: string) => boolean;
  resetToWelcome: () => void;
}

const TetherContext = createContext<TetherContextType | undefined>(undefined);

export const TetherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUserId, setCurrentUserId] = useState<string>('user_sanjay');
  const [users, setUsers] = useState<Record<string, User>>({
    user_sanjay: USER_SANJAY,
    user_alex: USER_ALEX,
  });
  const [couple, setCouple] = useState<Couple>(INITIAL_COUPLE);
  const [moments, setMoments] = useState<Moment[]>(INITIAL_MOMENTS);
  const [vaultMemories, setVaultMemories] = useState<VaultMemory[]>(INITIAL_VAULT);
  const [ideas, setIdeas] = useState<IdeaItem[]>(INITIAL_IDEAS);
  const [isDbConnected, setIsDbConnected] = useState<boolean>(true);

  const [screenState, setScreenState] = useState<ScreenState>('app');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [isSettingsSubScreen, setIsSettingsSubScreen] = useState<string | null>(null);

  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    biometricLockEnabled: true,
    stealthModeEnabled: false,
    calendarDndEnabled: false,
    hideMediaPreviews: true,
  });

  // Interactive overlays
  const [isTapAndTalkOpen, setIsTapAndTalkOpen] = useState(false);
  const [activePaywallReason, setActivePaywallReason] = useState<string | null>(null);
  const [biometricTargetMoment, setBiometricTargetMoment] = useState<Moment | null>(null);
  const [selectedVaultMemory, setSelectedVaultMemory] = useState<VaultMemory | null>(null);
  const [isAddIdeaModalOpen, setIsAddIdeaModalOpen] = useState(false);
  const [isLockScreenActive, setIsLockScreenActive] = useState(false);

  // Initialize and attach Firestore real-time listeners
  useEffect(() => {
    let unsubs: (() => void)[] = [];

    const initDb = async () => {
      try {
        await DbService.seedInitialDataIfEmpty(
          { user_sanjay: USER_SANJAY, user_alex: USER_ALEX },
          couple,
          INITIAL_MOMENTS,
          INITIAL_VAULT,
          INITIAL_IDEAS
        );
        setIsDbConnected(true);

        // Real-time subscriptions
        const unsubUsers = DbService.subscribeUsers((remoteUsers) => {
          setUsers(prev => ({ ...prev, ...remoteUsers }));
        });
        unsubs.push(unsubUsers);

        const unsubMoments = DbService.subscribeMoments(couple.id, (remoteMoments) => {
          if (remoteMoments.length > 0) {
            // Eagerly pre-cache latest photos so widget pictures update in 0ms
            remoteMoments.slice(0, 5).forEach(m => {
              if (m.mediaUrl && typeof Image !== 'undefined') {
                const img = new Image();
                img.src = m.mediaUrl;
              }
            });
            setMoments(remoteMoments);
          }
        });
        unsubs.push(unsubMoments);

        const unsubVault = DbService.subscribeVault(couple.id, (remoteVault) => {
          if (remoteVault.length > 0) {
            setVaultMemories(remoteVault);
          }
        });
        unsubs.push(unsubVault);

        const unsubIdeas = DbService.subscribeIdeas(couple.id, (remoteIdeas) => {
          if (remoteIdeas.length > 0) {
            setIdeas(remoteIdeas);
          }
        });
        unsubs.push(unsubIdeas);
      } catch (err) {
        console.warn('Firestore initial sync notice:', err);
      }
    };

    initDb();

    return () => {
      unsubs.forEach(u => u && u());
    };
  }, [couple.id]);

  const user = users[currentUserId] || USER_SANJAY;
  const partnerId = currentUserId === 'user_sanjay' ? 'user_alex' : 'user_sanjay';
  const partner = users[partnerId] || USER_ALEX;

  const setVibe = (status: VibeStatusType) => {
    const updatedUser = {
      ...user,
      currentVibe: status,
      vibeUpdatedAt: new Date().toISOString(),
    };
    setUsers(prev => ({ ...prev, [currentUserId]: updatedUser }));
    DbService.saveUser(updatedUser).catch(() => {});
  };

  const switchPartnerPerspective = () => {
    setCurrentUserId(prev => prev === 'user_sanjay' ? 'user_alex' : 'user_sanjay');
  };

  const triggerPaywall = (featureName: string) => {
    setActivePaywallReason(featureName);
  };

  const closePaywall = () => {
    setActivePaywallReason(null);
  };

  const upgradeToPremium = (tier: 'premium_monthly' | 'premium_yearly') => {
    const updatedUser = {
      ...user,
      isPremium: true,
      tier: tier,
    };
    setUsers(prev => ({ ...prev, [currentUserId]: updatedUser }));
    DbService.saveUser(updatedUser).catch(() => {});
    closePaywall();
  };

  const downgradeToFree = () => {
    const updatedUser = {
      ...user,
      isPremium: false,
      tier: 'free' as const,
    };
    setUsers(prev => ({ ...prev, [currentUserId]: updatedUser }));
    DbService.saveUser(updatedUser).catch(() => {});
  };

  const sendMoment = (
    mediaType: 'photo' | 'video' | 'audio',
    mediaUrl: string,
    caption?: string,
    duration?: number,
    waveform?: number[]
  ) => {
    const newMoment: Moment = {
      id: `moment_${Date.now()}`,
      coupleId: couple.id,
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      mediaType,
      mediaUrl,
      caption,
      durationSeconds: duration,
      audioWaveform: waveform,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      isSavedToVault: false,
      isLocked: true,
    };

    // Instant browser decode cache for widget rendering
    if (mediaUrl && typeof Image !== 'undefined') {
      const img = new Image();
      img.src = mediaUrl;
    }

    setMoments(prev => [newMoment, ...prev]);
    DbService.saveMoment(couple.id, newMoment).catch(() => {});
    soundEngine.playSentChime();
    setIsTapAndTalkOpen(false);
  };

  const promptUnlockMoment = (moment: Moment) => {
    if (!moment.isLocked) return;

    if (!user.isPremium) {
      unlockMoment(moment.id);
    } else {
      setBiometricTargetMoment(moment);
    }
  };

  const unlockMoment = (momentId: string) => {
    setMoments(prev => prev.map(m => m.id === momentId ? { ...m, isLocked: false } : m));
    DbService.updateMoment(couple.id, momentId, { isLocked: false }).catch(() => {});
    setBiometricTargetMoment(null);
  };

  const closeBiometricModal = () => {
    setBiometricTargetMoment(null);
  };

  const saveToVault = (momentId: string, note?: string): boolean => {
    if (!user.isPremium) {
      triggerPaywall('Private Vault');
      return false;
    }

    const targetMoment = moments.find(m => m.id === momentId);
    if (!targetMoment) return false;

    const existing = vaultMemories.find(v => v.momentId === momentId);
    if (existing) return true;

    const newVaultItem: VaultMemory = {
      id: `vault_${Date.now()}`,
      coupleId: couple.id,
      momentId: targetMoment.id,
      moment: { ...targetMoment, isSavedToVault: true, isLocked: false },
      savedAt: new Date().toISOString(),
      savedBy: user.id,
      note: note || targetMoment.caption,
    };

    setVaultMemories(prev => [newVaultItem, ...prev]);
    setMoments(prev => prev.map(m => m.id === momentId ? { ...m, isSavedToVault: true } : m));
    
    DbService.saveVaultMemory(couple.id, newVaultItem).catch(() => {});
    DbService.updateMoment(couple.id, momentId, { isSavedToVault: true }).catch(() => {});
    return true;
  };

  const removeFromVault = (vaultId: string) => {
    const item = vaultMemories.find(v => v.id === vaultId);
    setVaultMemories(prev => prev.filter(v => v.id !== vaultId));
    if (item) {
      setMoments(prev => prev.map(m => m.id === item.momentId ? { ...m, isSavedToVault: false } : m));
      DbService.updateMoment(couple.id, item.momentId, { isSavedToVault: false }).catch(() => {});
    }
    DbService.deleteVaultMemory(couple.id, vaultId).catch(() => {});
    if (selectedVaultMemory?.id === vaultId) {
      setSelectedVaultMemory(null);
    }
  };

  const addIdea = (title: string, category: IdeaCategory, note?: string) => {
    if (!user.isPremium) {
      triggerPaywall('Shared Idea Jar');
      return;
    }

    const newIdea: IdeaItem = {
      id: `idea_${Date.now()}`,
      coupleId: couple.id,
      title: title.trim(),
      note: note?.trim(),
      category,
      createdBy: user.id,
      createdByName: user.name,
      createdAt: new Date().toISOString(),
      isCompleted: false,
    };

    setIdeas(prev => [newIdea, ...prev]);
    DbService.saveIdea(couple.id, newIdea).catch(() => {});
    setIsAddIdeaModalOpen(false);
  };

  const toggleIdeaCompleted = (ideaId: string) => {
    const target = ideas.find(i => i.id === ideaId);
    if (!target) return;
    const updated = !target.isCompleted;
    setIdeas(prev => prev.map(i => i.id === ideaId ? { ...i, isCompleted: updated } : i));
    DbService.updateIdea(couple.id, ideaId, { isCompleted: updated }).catch(() => {});
  };

  const deleteIdea = (ideaId: string) => {
    setIdeas(prev => prev.filter(i => i.id !== ideaId));
    DbService.deleteIdea(couple.id, ideaId).catch(() => {});
  };

  const updatePrivacySettings = (settings: Partial<PrivacySettings>) => {
    setPrivacySettings(prev => ({ ...prev, ...settings }));
  };

  const setCalendarDnd = (enabled: boolean, reason?: string) => {
    if (!user.isPremium) {
      triggerPaywall('Calendar-Aware DND');
      return;
    }
    updatePrivacySettings({ calendarDndEnabled: enabled });
    const updatedUser = {
      ...user,
      isInFocusMode: enabled,
      focusModeReason: enabled ? (reason || 'Focus Mode') : undefined,
    };
    setUsers(prev => ({ ...prev, [currentUserId]: updatedUser }));
    DbService.saveUser(updatedUser).catch(() => {});
  };

  const updateUserProfile = (name: string, avatar: string) => {
    const updatedUser = {
      ...user,
      name: name || user.name,
      avatar: avatar || user.avatar,
    };
    setUsers(prev => ({ ...prev, [currentUserId]: updatedUser }));
    DbService.saveUser(updatedUser).catch(() => {});
  };

  const pairWithCode = (code: string): boolean => {
    if (code.toUpperCase().replace(/\s/g, '') === 'TETHER-8F4K' || code.length >= 6) {
      const updatedCouple = {
        ...couple,
        pairingCode: code.toUpperCase(),
      };
      setCouple(updatedCouple);
      DbService.saveCouple(updatedCouple).catch(() => {});
      setScreenState('app');
      return true;
    }
    return false;
  };

  const resetToWelcome = () => {
    setScreenState('welcome');
    setActiveTab('home');
    setIsSettingsSubScreen(null);
  };

  return (
    <TetherContext.Provider
      value={{
        currentUserId,
        user,
        partner,
        couple,
        moments,
        vaultMemories,
        ideas,
        screenState,
        activeTab,
        privacySettings,
        isDbConnected,
        isTapAndTalkOpen,
        activePaywallReason,
        biometricTargetMoment,
        selectedVaultMemory,
        isAddIdeaModalOpen,
        isSettingsSubScreen,
        isLockScreenActive,
        setScreenState,
        setActiveTab,
        setIsTapAndTalkOpen,
        setIsAddIdeaModalOpen,
        setSelectedVaultMemory,
        setIsSettingsSubScreen,
        setIsLockScreenActive,
        setVibe,
        sendMoment,
        unlockMoment,
        promptUnlockMoment,
        closeBiometricModal,
        saveToVault,
        removeFromVault,
        addIdea,
        toggleIdeaCompleted,
        deleteIdea,
        switchPartnerPerspective,
        upgradeToPremium,
        downgradeToFree,
        triggerPaywall,
        closePaywall,
        updatePrivacySettings,
        setCalendarDnd,
        updateUserProfile,
        pairWithCode,
        resetToWelcome,
      }}
    >
      {children}
    </TetherContext.Provider>
  );
};

export const useTether = () => {
  const context = useContext(TetherContext);
  if (!context) {
    throw new Error('useTether must be used within a TetherProvider');
  }
  return context;
};
