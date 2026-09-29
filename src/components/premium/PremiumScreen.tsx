import React, { useState } from 'react';
import { useTether } from '../../context/TetherContext';
import { 
  Video, 
  Mic, 
  Lock, 
  Archive, 
  Lightbulb, 
  EyeOff, 
  Calendar, 
  Check, 
  Sparkles,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export const PremiumScreen: React.FC = () => {
  const { user, upgradeToPremium, downgradeToFree, setIsSettingsSubScreen } = useTether();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const features = [
    {
      icon: Video,
      title: 'Video Moments',
      desc: 'Send short, intimate 15-second video glimpses without compression artifacts.',
    },
    {
      icon: Mic,
      title: 'Voice Moments',
      desc: 'Whisper a quick thought or soundbite with tactile audio playback waveforms.',
    },
    {
      icon: Lock,
      title: 'Biometric Intimacy Lock',
      desc: 'Guard intimate media behind your device’s Face ID or Touch ID.',
    },
    {
      icon: Archive,
      title: 'Private Vault',
      desc: 'Preserve cherished moments indefinitely instead of letting them expire in 48 hours.',
    },
    {
      icon: Lightbulb,
      title: 'Shared Idea Jar',
      desc: 'A joint repository for spontaneous dates, cozy recipes, and future trips.',
    },
    {
      icon: EyeOff,
      title: 'Stealth Mode',
      desc: 'Disguise your relationship dashboard as a discreet utility in public settings.',
    },
    {
      icon: Calendar,
      title: 'Calendar-Aware DND',
      desc: 'Gracefully mute alerts and inform your partner when you are in meetings or focus blocks.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-[#2B2320]">
      {/* Top Header */}
      <div className="sticky top-0 z-20 px-4 py-3 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#E8E2DD] flex items-center justify-between">
        <button
          onClick={() => setIsSettingsSubScreen(null)}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center -ml-2 text-[#736A64] hover:text-[#2B2320]"
          aria-label="Back to settings"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xs uppercase font-semibold tracking-wider text-[#736A64]">
          Subscription
        </h2>
        <div className="w-10" />
      </div>

      <div className="max-w-md mx-auto px-5 pt-6">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#F3ECE6] border border-[#E5DAD2] flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-7 h-7 text-[#C86D51]" />
          </div>
          <h1 className="font-serif text-3xl font-normal text-[#2B2320] mb-2">
            Tether Premium
          </h1>
          <p className="text-xs text-[#736A64] max-w-xs mx-auto">
            More ways to stay close. More privacy.
          </p>
        </div>

        {/* Current status banner */}
        <div className="p-4 rounded-2xl bg-white border border-[#E8E2DD] shadow-xs mb-8 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#A89F97]">
              Current Tier
            </span>
            <p className="text-sm font-semibold text-[#2B2320] capitalize">
              {user.isPremium ? (user.tier === 'premium_yearly' ? 'Premium (Annual)' : 'Premium (Monthly)') : 'Free Tier'}
            </p>
          </div>
          {user.isPremium ? (
            <button
              onClick={downgradeToFree}
              className="text-xs text-[#C86D51] hover:underline"
            >
              Downgrade to Free
            </button>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-[#EFE9E4] text-[10px] font-medium text-[#736A64]">
              Basic Features
            </span>
          )}
        </div>

        {/* Pricing selector */}
        <div className="bg-[#EFE9E4] p-1 rounded-2xl grid grid-cols-2 gap-1 mb-6">
          <button
            onClick={() => setBillingCycle('yearly')}
            className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
              billingCycle === 'yearly'
                ? 'bg-white text-[#2B2320] shadow-xs'
                : 'text-[#736A64] hover:text-[#2B2320]'
            }`}
          >
            Annual ($49.99/yr)
          </button>
          <button
            onClick={() => setBillingCycle('monthly')}
            className={`py-2.5 rounded-xl text-xs font-medium transition-all ${
              billingCycle === 'monthly'
                ? 'bg-white text-[#2B2320] shadow-xs'
                : 'text-[#736A64] hover:text-[#2B2320]'
            }`}
          >
            Monthly ($5.99/mo)
          </button>
        </div>

        {/* Subscribe / Manage CTA */}
        <div className="mb-8">
          <button
            onClick={() => upgradeToPremium(billingCycle === 'yearly' ? 'premium_yearly' : 'premium_monthly')}
            className="w-full h-12 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] active:scale-[0.98] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-sm transition-transform"
          >
            <span>{user.isPremium ? 'Active Subscription' : 'Unlock Tether Premium'}</span>
          </button>
          <p className="text-[11px] text-[#A89F97] text-center mt-2">
            Cancel anytime in Apple App Store or Google Play settings.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="space-y-3 mb-10">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#736A64] mb-3">
            Included in Premium
          </h3>

          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-[#E8E2DD] shadow-xs flex items-start gap-3.5"
              >
                <div className="w-9 h-9 rounded-xl bg-[#F6F1ED] flex items-center justify-center text-[#C86D51] shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-[#2B2320] mb-0.5">
                    {feat.title}
                  </h4>
                  <p className="text-[11px] text-[#736A64] leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* No Read Receipts Promise */}
        <div className="p-4 rounded-2xl bg-[#F6F1ED] border border-[#E5DAD2] text-center mb-6">
          <ShieldCheck className="w-5 h-5 text-[#C86D51] mx-auto mb-2" />
          <h4 className="text-xs font-semibold text-[#2B2320] mb-1">
            Always Zero Anxiety
          </h4>
          <p className="text-[11px] text-[#736A64] leading-relaxed">
            Tether never shows read receipts, typing indicators, or timestamps of when moments are opened on any tier.
          </p>
        </div>
      </div>
    </div>
  );
};
