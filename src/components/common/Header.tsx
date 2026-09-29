import React from 'react';
import { useTether } from '../../context/TetherContext';
import { Settings, ShieldCheck, Moon, RefreshCw, Lock } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

export const Header: React.FC = () => {
  const { 
    user, 
    partner, 
    privacySettings, 
    switchPartnerPerspective, 
    setActiveTab, 
    activeTab,
    setIsSettingsSubScreen,
    setIsLockScreenActive
  } = useTether();

  const isStealth = privacySettings.stealthModeEnabled;

  const getVibeInfo = (vibe: string) => {
    switch (vibe) {
      case 'overwhelmed':
        return { dot: 'bg-rose-500', label: 'Overwhelmed', ring: 'ring-rose-200' };
      case 'free_to_talk':
        return { dot: 'bg-emerald-500', label: 'Free to talk', ring: 'ring-emerald-200' };
      case 'thinking_of_you':
      default:
        return { dot: 'bg-amber-400', label: 'Thinking of you', ring: 'ring-amber-200' };
    }
  };

  const partnerVibe = getVibeInfo(partner.currentVibe);

  if (isStealth) {
    return (
      <header className="sticky top-0 z-30 flex items-center justify-between px-4 py-3 bg-[#161514]/90 backdrop-blur-md border-b border-white/5 text-[#E6E1DC]">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500/80" />
          <span className="text-xs font-mono uppercase tracking-widest text-[#9E9791]">
            Synced
          </span>
        </div>
        <button
          onClick={() => {
            setActiveTab('settings');
            setIsSettingsSubScreen('stealth');
          }}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#9E9791] hover:text-white transition-colors"
          title="Exit Stealth Mode"
          aria-label="Stealth mode settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-30 px-4 pt-3 pb-2.5 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#E8E2DD] transition-all">
      <div className="flex items-center justify-between">
        {/* Tether Brand Zone: Clean, understated */}
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => {
              setActiveTab('home');
              setIsSettingsSubScreen(null);
            }}
            className="flex items-center gap-1.5 text-left group"
          >
            <span className="font-serif text-2xl tracking-tight text-[#2B2320] font-normal group-hover:opacity-80 transition-opacity">
              Tether
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C86D51] mb-1 opacity-80" />
          </button>

          {/* Quick Perspective Switcher for demo & evaluation */}
          <button
            onClick={switchPartnerPerspective}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EFE9E4] hover:bg-[#E5DCD6] text-[11px] font-medium text-[#736A64] transition-colors border border-[#DDD3CB]"
            title="Switch partner perspective to test both sides of the couple experience"
          >
            <RefreshCw className="w-2.5 h-2.5" />
            <span>As {user.name}</span>
          </button>
        </div>

        {/* Partner Connection Status & Profile Link */}
        <div className="flex items-center gap-2.5">
          {/* Partner Status Pill */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/80 border border-[#E8E2DD] shadow-xs cursor-pointer hover:bg-white transition-colors"
          >
            <div className="relative">
              <img 
                src={partner.avatar} 
                alt={partner.name}
                className="w-5 h-5 rounded-full object-cover"
                onError={(e) => {
                  // Fallback avatar container
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full ${partnerVibe.dot} ring-1 ring-white`} />
            </div>
            
            <div className="text-left">
              <p className="text-[11px] font-medium text-[#38312C] leading-none">
                {partner.name}
              </p>
              {partner.isInFocusMode ? (
                <p className="text-[9px] text-[#A6634B] flex items-center gap-0.5 leading-none mt-0.5">
                  <Moon className="w-2 h-2 inline" /> In focus
                </p>
              ) : (
                <p className="text-[9px] text-[#8C837C] leading-none mt-0.5 truncate max-w-[70px]">
                  {partnerVibe.label}
                </p>
              )}
            </div>
          </div>

          {/* Lock Screen Trigger */}
          <button
            onClick={() => setIsLockScreenActive(true)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#6E645E] hover:text-[#2B2320] hover:bg-[#EFE9E4] transition-colors"
            title="Lock screen mode (test changing vibes from lockscreen)"
            aria-label="Lock screen mode"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* PWA / APK Install Button */}
          <PWAInstallButton />

          {/* Settings Trigger */}
          <button
            onClick={() => {
              setActiveTab('settings');
              setIsSettingsSubScreen(null);
            }}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full text-[#6E645E] hover:text-[#2B2320] hover:bg-[#EFE9E4] transition-colors ${
              activeTab === 'settings' ? 'text-[#2B2320] bg-[#EFE9E4]' : ''
            }`}
            aria-label="Settings and privacy"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
