import React, { useState } from 'react';
import { useTether } from '../../context/TetherContext';
import { 
  Shield, 
  Lock, 
  EyeOff, 
  Calendar, 
  Sparkles, 
  Heart, 
  User, 
  Copy, 
  Check, 
  RefreshCw, 
  ArrowLeft, 
  ChevronRight,
  HelpCircle,
  LogOut,
  Moon,
  Download,
  Smartphone
} from 'lucide-react';
import { PremiumScreen } from '../premium/PremiumScreen';
import { PWAInstallModal } from '../common/PWAInstallModal';

export const SettingsScreen: React.FC = () => {
  const { 
    user, 
    partner, 
    couple, 
    privacySettings, 
    updatePrivacySettings, 
    setCalendarDnd, 
    isSettingsSubScreen, 
    setIsSettingsSubScreen, 
    switchPartnerPerspective, 
    resetToWelcome, 
    triggerPaywall,
    updateUserProfile,
    pairWithCode,
    setIsLockScreenActive
  } = useTether();

  const [copiedCode, setCopiedCode] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [profileName, setProfileName] = useState(user.name);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [dndReason, setDndReason] = useState(user.focusModeReason || 'Deep Work');
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [joinCodeStatus, setJoinCodeStatus] = useState<string | null>(null);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(couple.pairingCode).catch(() => {});
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleJoinCodeFromSettings = () => {
    if (!partnerCodeInput.trim()) return;
    const success = pairWithCode(partnerCodeInput.trim());
    if (success) {
      setJoinCodeStatus('Connected to partner code!');
      setPartnerCodeInput('');
      setTimeout(() => setJoinCodeStatus(null), 3000);
    } else {
      setJoinCodeStatus('Invalid pairing code. Try e.g. TETHER-8F4K');
      setTimeout(() => setJoinCodeStatus(null), 3000);
    }
  };

  // SUB-SCREEN: PREMIUM
  if (isSettingsSubScreen === 'premium') {
    return <PremiumScreen />;
  }

  // SUB-SCREEN: STEALTH MODE
  if (isSettingsSubScreen === 'stealth') {
    return (
      <div className="min-h-screen bg-[#FAF7F5] pb-24 text-[#2B2320]">
        <div className="sticky top-0 z-20 px-4 py-3 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#E8E2DD] flex items-center justify-between">
          <button
            onClick={() => setIsSettingsSubScreen(null)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-[#736A64] hover:text-[#2B2320]"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xs uppercase font-semibold tracking-wider text-[#736A64]">
            Stealth Mode
          </h2>
          <div className="w-10" />
        </div>

        <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#F3ECE6] flex items-center justify-center mx-auto mb-3 text-[#C86D51]">
              <EyeOff className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#2B2320] mb-2">
              Discreet Presence
            </h3>
            <p className="text-xs text-[#736A64] leading-relaxed max-w-xs mx-auto">
              When Stealth Mode is enabled, Tether shifts into a calm generic utility interface with minimal cues. Perfect for transit or busy workspaces.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E2DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-[#2B2320]">
                  Enable Stealth Mode
                </h4>
                <p className="text-[11px] text-[#736A64]">
                  Replaces brand lockup with discreet sync status
                </p>
              </div>
              <button
                onClick={() => {
                  if (!user.isPremium) {
                    triggerPaywall('Stealth Mode');
                    return;
                  }
                  updatePrivacySettings({ stealthModeEnabled: !privacySettings.stealthModeEnabled });
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  privacySettings.stealthModeEnabled ? 'bg-[#C86D51]' : 'bg-[#E5DAD2]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  privacySettings.stealthModeEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F1ED] border border-[#E8E2DD]">
            <h4 className="text-xs font-semibold text-[#2B2320] mb-1">
              Discreet Widget Preview
            </h4>
            <div className="p-3 bg-[#1C1A19] rounded-xl text-white font-mono text-xs flex items-center justify-between">
              <span className="text-[#8C837C]">System Widget:</span>
              <span className="text-emerald-400">● Synced</span>
            </div>
            <p className="text-[10px] text-[#8C837C] mt-2">
              *Full OS-level app icon replacement is platform-dependent on native iOS/Android builds.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // SUB-SCREEN: CALENDAR-AWARE DND
  if (isSettingsSubScreen === 'calendar') {
    return (
      <div className="min-h-screen bg-[#FAF7F5] pb-24 text-[#2B2320]">
        <div className="sticky top-0 z-20 px-4 py-3 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#E8E2DD] flex items-center justify-between">
          <button
            onClick={() => setIsSettingsSubScreen(null)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-[#736A64] hover:text-[#2B2320]"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xs uppercase font-semibold tracking-wider text-[#736A64]">
            Calendar-Aware DND
          </h2>
          <div className="w-10" />
        </div>

        <div className="max-w-md mx-auto px-5 pt-6 space-y-6">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#F3ECE6] flex items-center justify-center mx-auto mb-3 text-[#C86D51]">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="font-serif text-2xl font-normal text-[#2B2320] mb-2">
              Anxiety-Free Silence
            </h3>
            <p className="text-xs text-[#736A64] leading-relaxed max-w-xs mx-auto">
              Prevent delayed-response anxiety. Tether detects your focus blocks and gently assures {partner.name} that you’re simply focused, without exposing private event details.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8E2DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-[#2B2320]">
                  Activate Focus Mode
                </h4>
                <p className="text-[11px] text-[#736A64]">
                  Partner sees: “{user.name} is in focus mode ❤️”
                </p>
              </div>
              <button
                onClick={() => {
                  if (!user.isPremium) {
                    triggerPaywall('Calendar-Aware DND');
                    return;
                  }
                  setCalendarDnd(!user.isInFocusMode, dndReason);
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  user.isInFocusMode ? 'bg-[#C86D51]' : 'bg-[#E5DAD2]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  user.isInFocusMode ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            {user.isInFocusMode && (
              <div className="pt-3 border-t border-[#F5EFEA]">
                <label className="block text-[11px] text-[#736A64] mb-1 font-medium">
                  Focus Context
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['Meeting', 'Deep Work', 'Class Block'].map((reason) => (
                    <button
                      key={reason}
                      onClick={() => {
                        setDndReason(reason);
                        setCalendarDnd(true, reason);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        dndReason === reason
                          ? 'bg-[#2B2320] text-white border-[#2B2320]'
                          : 'bg-[#F9F6F3] text-[#736A64] border-[#E8E2DD]'
                      }`}
                    >
                      {reason}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // SUB-SCREEN: PRIVACY SETTINGS
  if (isSettingsSubScreen === 'privacy') {
    return (
      <div className="min-h-screen bg-[#FAF7F5] pb-24 text-[#2B2320]">
        <div className="sticky top-0 z-20 px-4 py-3 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#E8E2DD] flex items-center justify-between">
          <button
            onClick={() => setIsSettingsSubScreen(null)}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-[#736A64] hover:text-[#2B2320]"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xs uppercase font-semibold tracking-wider text-[#736A64]">
            Privacy & Biometrics
          </h2>
          <div className="w-10" />
        </div>

        <div className="max-w-md mx-auto px-5 pt-6 space-y-4">
          <div className="p-4 rounded-2xl bg-white border border-[#E8E2DD] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-[#2B2320]">
                  Biometric Intimacy Lock
                </h4>
                <p className="text-[11px] text-[#736A64]">
                  Require Face ID or Touch ID to view media
                </p>
              </div>
              <button
                onClick={() => {
                  if (!user.isPremium) {
                    triggerPaywall('Biometric Intimacy Lock');
                    return;
                  }
                  updatePrivacySettings({ biometricLockEnabled: !privacySettings.biometricLockEnabled });
                }}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  privacySettings.biometricLockEnabled ? 'bg-[#C86D51]' : 'bg-[#E5DAD2]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  privacySettings.biometricLockEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#F5EFEA]">
              <div>
                <h4 className="text-xs font-semibold text-[#2B2320]">
                  Blurred Media Previews
                </h4>
                <p className="text-[11px] text-[#736A64]">
                  Always obscure incoming moments until tapped
                </p>
              </div>
              <button
                onClick={() => updatePrivacySettings({ hideMediaPreviews: !privacySettings.hideMediaPreviews })}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  privacySettings.hideMediaPreviews ? 'bg-[#C86D51]' : 'bg-[#E5DAD2]'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  privacySettings.hideMediaPreviews ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="pt-3 border-t border-[#F5EFEA]">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="text-xs font-semibold text-[#2B2320]">
                    Lock Screen & Live Widget
                  </h4>
                  <p className="text-[11px] text-[#736A64]">
                    Toggle vibe status directly from your phone's lock screen
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsLockScreenActive(true)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#2B2320] hover:bg-[#3D332D] text-white text-xs font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Simulate Lock Screen Mode</span>
              </button>
            </div>
          </div>

          {/* Zero Read Receipts Manifesto */}
          <div className="p-4 rounded-2xl bg-[#F6F1ED] border border-[#E5DAD2]">
            <h4 className="text-xs font-semibold text-[#2B2320] mb-1">
              Zero Read Receipts Guarantee
            </h4>
            <p className="text-[11px] text-[#736A64] leading-relaxed">
              Tether is engineered with permanent privacy invariants. There are no seen badges, delivered ticks, or online surveillance indicators anywhere in the app.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // MAIN SETTINGS SCREEN
  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-[#2B2320]">
      {/* Top bar */}
      <div className="sticky top-14 z-20 px-5 py-3 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#E8E2DD]">
        <h1 className="font-serif text-2xl font-normal text-[#2B2320]">
          Settings & Profile
        </h1>
        <p className="text-[11px] text-[#736A64]">
          Preferences, privacy, and connection management
        </p>
      </div>

      <div className="max-w-md mx-auto px-4 pt-5 space-y-5">
        {/* Couple Connection Card */}
        <div className="p-4 rounded-3xl bg-white border border-[#ECE5DF] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A89F97]">
              Paired Couple
            </span>
            <span className="text-[10px] text-[#C86D51] font-medium bg-[#FBF0EB] px-2 py-0.5 rounded-full">
              Connected ❤️
            </span>
          </div>

          <div className="flex items-center justify-around py-2">
            <div className="flex flex-col items-center text-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs mb-1.5"
              />
              <span className="text-xs font-semibold text-[#2B2320]">{user.name}</span>
              <span className="text-[10px] text-[#8C837C]">You</span>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-xs text-[#C86D51] font-serif italic mb-1">in love</span>
              <div className="w-12 h-0.5 bg-[#E8E2DD]" />
            </div>

            <div className="flex flex-col items-center text-center">
              <img
                src={partner.avatar}
                alt={partner.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-xs mb-1.5"
              />
              <span className="text-xs font-semibold text-[#2B2320]">{partner.name}</span>
              <span className="text-[10px] text-[#8C837C]">Partner</span>
            </div>
          </div>

          {/* Pairing Code Share */}
          <div className="mt-4 pt-3 border-t border-[#F5EFEA] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#A89F97]">Your Pairing Code</span>
                <p className="text-xs font-mono font-bold text-[#2B2320]">{couple.pairingCode}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-[#F5EFEA] hover:bg-[#EAE2DA] text-xs font-medium text-[#403833] flex items-center gap-1 transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </div>

            {/* Inline Join Code Form */}
            <div className="pt-2 border-t border-[#FAF7F5]">
              <span className="text-[10px] text-[#736A64] block mb-1">
                Connecting with a partner's code?
              </span>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  placeholder="Enter e.g. TETHER-8F4K"
                  value={partnerCodeInput}
                  onChange={(e) => setPartnerCodeInput(e.target.value.toUpperCase())}
                  className="flex-1 px-3 py-1.5 text-xs font-mono rounded-lg bg-[#FAF7F5] border border-[#E8E2DD] uppercase text-[#2B2320] placeholder-[#A89F97] focus:outline-none focus:border-[#C86D51]"
                />
                <button
                  onClick={handleJoinCodeFromSettings}
                  className="px-3 py-1.5 bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-medium rounded-lg transition-colors"
                >
                  Join
                </button>
              </div>
              {joinCodeStatus && (
                <p className="text-[10px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                  <Check className="w-3 h-3" /> {joinCodeStatus}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div 
          onClick={() => setIsSettingsSubScreen('premium')}
          className="p-4 rounded-3xl bg-gradient-to-br from-[#2D2622] to-[#1E1917] text-white shadow-xs cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#C86D51]" />
              <span className="text-xs font-semibold uppercase tracking-wider text-[#D8CDC4]">
                Tether Tier
              </span>
            </div>
            <span className="text-xs text-[#C86D51] flex items-center">
              Manage <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </span>
          </div>
          <h3 className="font-serif text-lg text-white mb-0.5">
            {user.isPremium ? 'Tether Premium Member' : 'Free Connection Tier'}
          </h3>
          <p className="text-xs text-[#9E938B]">
            {user.isPremium 
              ? 'Voice, Video, Private Vault, Stealth Mode & Biometrics enabled.' 
              : 'Upgrade to unlock Video, Voice, Private Vault & Stealth Mode.'}
          </p>
        </div>

        {/* Sub-menu Navigation Links */}
        <div className="bg-white rounded-3xl border border-[#ECE5DF] overflow-hidden shadow-xs divide-y divide-[#F5EFEA]">
          <button
            onClick={() => setIsSettingsSubScreen('stealth')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#FAF7F5] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F6F1ED] flex items-center justify-center text-[#C86D51]">
                <EyeOff className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2B2320]">Stealth Mode</p>
                <p className="text-[10px] text-[#736A64]">
                  {privacySettings.stealthModeEnabled ? 'Active (Discreet)' : 'Standard presentation'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A89F97]" />
          </button>

          <button
            onClick={() => setIsSettingsSubScreen('calendar')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#FAF7F5] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F6F1ED] flex items-center justify-center text-[#C86D51]">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2B2320]">Calendar-Aware DND</p>
                <p className="text-[10px] text-[#736A64]">
                  {user.isInFocusMode ? `In Focus (${user.focusModeReason})` : 'Off'}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A89F97]" />
          </button>

          <button
            onClick={() => setIsSettingsSubScreen('privacy')}
            className="w-full p-4 flex items-center justify-between hover:bg-[#FAF7F5] transition-colors text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F6F1ED] flex items-center justify-center text-[#C86D51]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2B2320]">Privacy & Biometrics</p>
                <p className="text-[10px] text-[#736A64]">Intimacy lock, on-device encryption</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A89F97]" />
          </button>

          {/* Download APK / Install App on Phone */}
          <button
            onClick={() => setIsInstallModalOpen(true)}
            className="w-full p-4 flex items-center justify-between hover:bg-[#FAF7F5] transition-colors text-left bg-gradient-to-r from-[#FAF6F3] to-white"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#C86D51]/15 flex items-center justify-center text-[#C86D51]">
                <Download className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-semibold text-[#2B2320]">Install App / Download APK</p>
                  <span className="text-[9px] bg-[#C86D51] text-white px-1.5 py-0.5 rounded-full font-medium">Android</span>
                </div>
                <p className="text-[10px] text-[#736A64]">Direct WebAPK installation, QR code & CLI</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#A89F97]" />
          </button>
        </div>

        {/* Demo Switcher & Re-onboarding */}
        <div className="bg-white rounded-3xl border border-[#ECE5DF] p-4 shadow-xs space-y-3">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A89F97]">
            Demo & Evaluation Controls
          </span>

          <button
            onClick={switchPartnerPerspective}
            className="w-full py-2.5 px-3 rounded-xl bg-[#F6F1ED] hover:bg-[#EFE9E4] text-xs font-medium text-[#2B2320] flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-[#C86D51]" />
              <span>Switch Perspective to {partner.name}</span>
            </div>
            <span className="text-[10px] text-[#736A64]">Currently {user.name}</span>
          </button>

          <button
            onClick={resetToWelcome}
            className="w-full py-2.5 px-3 rounded-xl border border-[#ECE5DF] hover:bg-[#FAF7F5] text-xs font-medium text-[#736A64] flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Replay Onboarding & Pairing Flow</span>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#A89F97]" />
          </button>
        </div>

        {/* Database Status Card */}
        <div className="p-4 rounded-3xl bg-[#F5EFEA] border border-[#E5DAD2] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#736A64]">
              Cloud Database
            </span>
            <span className="flex items-center gap-1.5 text-[10px] font-medium text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Firestore Live</span>
            </span>
          </div>
          <p className="text-xs text-[#2B2320] font-medium mb-1">
            Real-time synchronization active
          </p>
          <p className="text-[11px] text-[#736A64] leading-relaxed">
            Moments, Vibe signals, Idea Jar items, and Private Vault entries synchronize immediately between partners across devices.
          </p>
        </div>
      </div>

      <PWAInstallModal
        isOpen={isInstallModalOpen}
        onClose={() => setIsInstallModalOpen(false)}
      />
    </div>
  );
};
