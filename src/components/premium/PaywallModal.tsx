import React, { useState } from 'react';
import { useTether } from '../../context/TetherContext';
import { Check, X, Shield, Sparkles } from 'lucide-react';

export const PaywallModal: React.FC = () => {
  const { activePaywallReason, closePaywall, upgradeToPremium } = useTether();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  if (!activePaywallReason) return null;

  const handleUpgrade = () => {
    upgradeToPremium(selectedPlan === 'yearly' ? 'premium_yearly' : 'premium_monthly');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#1E1B19] text-[#FAF7F5] rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col">
        {/* Close Button */}
        <button
          onClick={closePaywall}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#8C837C] hover:text-white transition-colors"
          aria-label="Dismiss paywall"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mt-2 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#2C2420] border border-[#C86D51]/30 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6 text-[#C86D51]" />
          </div>

          <h3 className="font-serif text-2xl text-[#FAF7F5] mb-1 font-normal">
            Unlock richer moments
          </h3>
          <p className="text-xs text-[#9E938B] max-w-xs mx-auto">
            {activePaywallReason 
              ? `Elevate your intimate connection with ${activePaywallReason}.`
              : 'Send video and voice moments directly to your partner.'}
          </p>
        </div>

        {/* Plan Selector */}
        <div className="grid grid-cols-2 gap-2.5 mb-6">
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedPlan === 'yearly'
                ? 'bg-[#2E2521] border-[#C86D51] ring-1 ring-[#C86D51]/50'
                : 'bg-[#25201D] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#FAF7F5]">Annual</span>
              <span className="text-[10px] text-[#C86D51] font-medium">Billed yearly</span>
            </div>
            <p className="text-base font-bold text-white">$49.99</p>
            <p className="text-[10px] text-[#8C837C]">~$4.16 / month</p>
          </button>

          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`p-3.5 rounded-2xl border text-left transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-[#2E2521] border-[#C86D51] ring-1 ring-[#C86D51]/50'
                : 'bg-[#25201D] border-white/10 hover:border-white/20'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold text-[#FAF7F5]">Monthly</span>
            </div>
            <p className="text-base font-bold text-white">$5.99</p>
            <p className="text-[10px] text-[#8C837C]">Flexible month-to-month</p>
          </button>
        </div>

        {/* Feature bullets */}
        <div className="space-y-2 mb-6 text-xs text-[#D8CDC4]">
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#C86D51] shrink-0" />
            <span>Short video & audio voice snippets</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#C86D51] shrink-0" />
            <span>Private Vault memory box for permanent keeps</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#C86D51] shrink-0" />
            <span>Biometric Intimacy Lock & Stealth Mode</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-3.5 h-3.5 text-[#C86D51] shrink-0" />
            <span>Shared Idea Jar & Calendar-Aware DND</span>
          </div>
        </div>

        {/* CTAs */}
        <button
          onClick={handleUpgrade}
          className="w-full h-12 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] active:scale-[0.98] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-lg transition-transform mb-2"
        >
          <span>Unlock Tether Premium</span>
        </button>

        <button
          onClick={closePaywall}
          className="w-full py-2 text-xs text-[#8C837C] hover:text-[#D1CBC5] transition-colors text-center"
        >
          Maybe later
        </button>
      </div>
    </div>
  );
};
