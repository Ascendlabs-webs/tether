import React, { useState } from 'react';
import { useTether } from '../../context/TetherContext';
import { 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  ArrowRight, 
  Heart, 
  Check, 
  Copy, 
  User as UserIcon,
  EyeOff
} from 'lucide-react';

type Step = 'splash' | 'welcome' | 'intro1' | 'intro2' | 'intro3' | 'profile' | 'pairing';

export const OnboardingFlow: React.FC = () => {
  const { user, couple, updateUserProfile, pairWithCode, setScreenState } = useTether();

  const [step, setStep] = useState<Step>('welcome');
  const [name, setName] = useState(user.name);
  const [partnerInputCode, setPartnerInputCode] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [pairingSuccess, setPairingSuccess] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(couple.pairingCode).catch(() => {});
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerInputCode.trim()) return;
    const success = pairWithCode(partnerInputCode);
    if (success) {
      setPairingSuccess(true);
      setTimeout(() => {
        setScreenState('app');
      }, 1200);
    }
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      updateUserProfile(name.trim(), user.avatar);
    }
    setStep('pairing');
  };

  const handleCompletePairing = () => {
    setPairingSuccess(true);
    setTimeout(() => {
      setScreenState('app');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#1E1B19] text-[#FAF7F5] flex flex-col justify-between p-6 max-w-md mx-auto relative overflow-hidden">
      {/* Subtle ambient gradient */}
      <div className="absolute top-0 inset-x-0 h-64 bg-radial from-[#C86D51]/15 to-transparent pointer-events-none" />

      {/* STEP: WELCOME */}
      {step === 'welcome' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-16 h-16 rounded-full bg-[#2C2420] border border-[#C86D51]/30 flex items-center justify-center mb-6">
            <Sparkles className="w-8 h-8 text-[#C86D51]" />
          </div>

          <h1 className="font-serif text-4xl text-white mb-3 font-normal tracking-tight">
            Tether
          </h1>
          <p className="font-serif italic text-lg text-[#E3D7CE] mb-2">
            Connection without the anxiety.
          </p>
          <p className="font-serif italic text-lg text-[#C86D51] mb-8">
            Intimacy without the effort.
          </p>

          <p className="text-xs text-[#A89F97] max-w-xs leading-relaxed mb-10">
            A quiet connection layer between exactly two people. No inboxes, no public feeds, no read receipts.
          </p>

          <button
            onClick={() => setStep('intro1')}
            className="w-full h-12 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] active:scale-[0.98] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform"
          >
            <span>Begin</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP: INTRO 1 — INSTANT MOMENTS */}
      {step === 'intro1' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-16 h-16 rounded-full bg-[#2C2420] border border-white/10 flex items-center justify-center mb-6 text-[#C86D51]">
            <Sparkles className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A89F97] mb-2">
            Frictionless
          </span>
          <h2 className="font-serif text-3xl text-white mb-3">
            Share tiny moments instantly.
          </h2>
          <p className="text-xs text-[#A89F97] max-w-xs leading-relaxed mb-8">
            One tap to share a photo, sound snippet, or short video. Moments naturally fade away in 48 hours unless saved to your shared memory vault.
          </p>

          <div className="flex gap-1.5 mb-10">
            <span className="w-6 h-1 rounded-full bg-[#C86D51]" />
            <span className="w-1.5 h-1 rounded-full bg-white/20" />
            <span className="w-1.5 h-1 rounded-full bg-white/20" />
          </div>

          <button
            onClick={() => setStep('intro2')}
            className="w-full h-12 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP: INTRO 2 — INTIMACY LOCK */}
      {step === 'intro2' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-16 h-16 rounded-full bg-[#2C2420] border border-white/10 flex items-center justify-center mb-6 text-[#C86D51]">
            <Lock className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A89F97] mb-2">
            Private by Design
          </span>
          <h2 className="font-serif text-3xl text-white mb-3">
            Keep intimate moments private.
          </h2>
          <p className="text-xs text-[#A89F97] max-w-xs leading-relaxed mb-8">
            Incoming moments are never exposed on your lock screen. A blurred teaser greets you until verified with biometric Face ID or Touch ID.
          </p>

          <div className="flex gap-1.5 mb-10">
            <span className="w-1.5 h-1 rounded-full bg-white/20" />
            <span className="w-6 h-1 rounded-full bg-[#C86D51]" />
            <span className="w-1.5 h-1 rounded-full bg-white/20" />
          </div>

          <button
            onClick={() => setStep('intro3')}
            className="w-full h-12 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP: INTRO 3 — ZERO ANXIETY */}
      {step === 'intro3' && (
        <div className="flex-1 flex flex-col items-center justify-center text-center my-auto">
          <div className="w-16 h-16 rounded-full bg-[#2C2420] border border-white/10 flex items-center justify-center mb-6 text-[#C86D51]">
            <ShieldCheck className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-mono uppercase tracking-widest text-[#A89F97] mb-2">
            Lightweight
          </span>
          <h2 className="font-serif text-3xl text-white mb-3">
            No read receipts. No pressure.
          </h2>
          <p className="text-xs text-[#A89F97] max-w-xs leading-relaxed mb-8">
            Never wonder if you’ve been left on seen. No typing bubbles, no delivery anxiety, no public metrics. Just presence.
          </p>

          <div className="flex gap-1.5 mb-10">
            <span className="w-1.5 h-1 rounded-full bg-white/20" />
            <span className="w-1.5 h-1 rounded-full bg-white/20" />
            <span className="w-6 h-1 rounded-full bg-[#C86D51]" />
          </div>

          <button
            onClick={() => setStep('profile')}
            className="w-full h-12 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform"
          >
            <span>Create Profile</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* STEP: CREATE PROFILE */}
      {step === 'profile' && (
        <div className="flex-1 flex flex-col justify-center my-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 border-2 border-[#C86D51]/50 relative">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <h2 className="font-serif text-2xl text-white">Create your couple</h2>
            <p className="text-xs text-[#A89F97]">Your partner will see this name and avatar</p>
          </div>

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[#A89F97] mb-1 uppercase tracking-wider">
                Your First Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 rounded-xl bg-[#28221F] border border-white/10 text-sm text-white placeholder-[#8A7F77] focus:outline-none focus:border-[#C86D51]"
              />
            </div>

            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform mt-6"
            >
              <span>Continue to Pairing</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* STEP: PAIRING */}
      {step === 'pairing' && (
        <div className="flex-1 flex flex-col justify-center my-auto text-center">
          {pairingSuccess ? (
            <div className="animate-fade-in py-12">
              <div className="w-16 h-16 rounded-full bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center mx-auto mb-4 text-emerald-400">
                <Heart className="w-8 h-8 fill-emerald-400" />
              </div>
              <h2 className="font-serif text-3xl text-white mb-2">
                You’re connected ❤️
              </h2>
              <p className="text-xs text-[#A89F97]">Entering your private space...</p>
            </div>
          ) : (
            <div>
              <div className="w-14 h-14 rounded-full bg-[#2C2420] border border-[#C86D51]/30 flex items-center justify-center mx-auto mb-4 text-[#C86D51]">
                <Heart className="w-6 h-6 fill-[#C86D51]" />
              </div>

              <h2 className="font-serif text-2xl text-white mb-1">
                Pair with your partner
              </h2>
              <p className="text-xs text-[#A89F97] mb-6">
                Share this unique invite code with your partner or enter theirs.
              </p>

              {/* Your Invite Code Box */}
              <div className="p-4 rounded-2xl bg-[#25201D] border border-white/10 mb-6 text-center">
                <span className="text-[10px] uppercase font-mono text-[#8C837C] tracking-wider block mb-1">
                  Your Pairing Code
                </span>
                <p className="font-mono text-xl font-bold tracking-widest text-[#FAF7F5] mb-2">
                  {couple.pairingCode}
                </p>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 rounded-lg bg-[#332B26] hover:bg-[#3D332D] text-xs font-medium text-[#FAF7F5] inline-flex items-center gap-1.5 transition-colors"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Code Copied' : 'Invite your partner'}</span>
                </button>
              </div>

              {/* Enter partner code form */}
              <div className="mb-6">
                <p className="text-[11px] text-[#A89F97] mb-2">
                  Have a code from your partner?
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. TETHER-8F4K"
                    value={partnerInputCode}
                    onChange={(e) => setPartnerInputCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2.5 rounded-xl bg-[#28221F] border border-white/10 font-mono text-xs uppercase text-white placeholder-[#8A7F77] focus:outline-none focus:border-[#C86D51]"
                  />
                  <button
                    onClick={handleJoinWithCode}
                    className="px-4 py-2.5 rounded-xl bg-[#3D332D] hover:bg-[#4A3E37] text-white text-xs font-medium"
                  >
                    Join
                  </button>
                </div>
              </div>

              {/* Instant demo enter */}
              <button
                onClick={handleCompletePairing}
                className="w-full h-12 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform"
              >
                <span>Enter Tether (Connected with Alex)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Footer note */}
      <div className="text-center pt-4 border-t border-white/5">
        <p className="text-[10px] text-[#736A64]">
          Tether · A private connection layer for couples
        </p>
      </div>
    </div>
  );
};
