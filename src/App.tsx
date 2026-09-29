/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TetherProvider, useTether } from './context/TetherContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeScreen } from './components/home/HomeScreen';
import { MomentsScreen } from './components/moments/MomentsScreen';
import { VaultScreen } from './components/vault/VaultScreen';
import { IdeaJarScreen } from './components/ideas/IdeaJarScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';
import { TapAndTalkModal } from './components/capture/TapAndTalkModal';
import { IntimacyLockModal } from './components/intimacy/IntimacyLockModal';
import { PaywallModal } from './components/premium/PaywallModal';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';
import { LockScreen } from './components/home/LockScreen';

const TetherAppInner: React.FC = () => {
  const { screenState, activeTab, privacySettings } = useTether();

  if (screenState !== 'app') {
    return <OnboardingFlow />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen />;
      case 'moments':
        return <MomentsScreen />;
      case 'vault':
        return <VaultScreen />;
      case 'ideas':
        return <IdeaJarScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeScreen />;
    }
  };

  const isStealth = privacySettings.stealthModeEnabled;

  return (
    <div className={`min-h-screen flex flex-col items-center justify-start ${
      isStealth ? 'bg-[#0F0E0D]' : 'bg-[#181615]'
    }`}>
      {/* Mobile Shell Frame */}
      <div className={`w-full max-w-md min-h-screen flex flex-col relative transition-colors duration-300 shadow-2xl ${
        isStealth ? 'bg-[#161514] text-[#E6E1DC]' : 'bg-[#FAF7F5] text-[#2B2320]'
      }`}>
        <Header />
        
        <main className="flex-1 w-full overflow-y-auto">
          {renderActiveScreen()}
        </main>

        <BottomNav />

        {/* Global Overlays & Modals */}
        <TapAndTalkModal />
        <IntimacyLockModal />
        <PaywallModal />
        <LockScreen />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <TetherProvider>
      <TetherAppInner />
    </TetherProvider>
  );
}
