import React from 'react';
import { useTether } from '../../context/TetherContext';
import { Home, Sparkles, Lock, Lightbulb, User } from 'lucide-react';
import { ActiveTab } from '../../types/tether';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setIsSettingsSubScreen, privacySettings, moments } = useTether();

  const isStealth = privacySettings.stealthModeEnabled;

  // Count unviewed / locked moments
  const lockedCount = moments.filter(m => m.isLocked).length;

  const tabs: { id: ActiveTab; label: string; icon: React.ComponentType<{ className?: string }>; badge?: number }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'moments', label: 'Moments', icon: Sparkles, badge: lockedCount },
    { id: 'vault', label: 'Vault', icon: Lock },
    { id: 'ideas', label: 'Idea Jar', icon: Lightbulb },
    { id: 'settings', label: 'Settings', icon: User },
  ];

  if (isStealth) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#161514] border-t border-white/5 py-2 px-6 flex justify-around items-center">
        <button
          onClick={() => setActiveTab('home')}
          className="text-xs font-mono text-[#7D7670] hover:text-[#D1CBC5] transition-colors py-2"
        >
          [Dashboard]
        </button>
        <button
          onClick={() => {
            setActiveTab('settings');
            setIsSettingsSubScreen('stealth');
          }}
          className="text-xs font-mono text-[#7D7670] hover:text-[#D1CBC5] transition-colors py-2"
        >
          [Exit Stealth]
        </button>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F5]/95 backdrop-blur-md border-t border-[#E8E2DD] transition-all pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-5 items-center h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setIsSettingsSubScreen(null);
              }}
              className={`min-h-[48px] min-w-[44px] flex flex-col items-center justify-center relative transition-all duration-150 ${
                isActive ? 'text-[#2B2320]' : 'text-[#8C837C] hover:text-[#524943]'
              }`}
              aria-label={tab.label}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-105 stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C86D51]" />
                ) : null}
              </div>

              <span className={`text-[10px] tracking-tight mt-1 transition-all ${
                isActive ? 'font-semibold text-[#2B2320]' : 'font-normal text-[#8C837C]'
              }`}>
                {tab.label}
              </span>

              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#C86D51] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
