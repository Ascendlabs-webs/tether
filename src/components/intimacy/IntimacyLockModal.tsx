import React, { useState } from 'react';
import { useTether } from '../../context/TetherContext';
import { Fingerprint, Lock, ShieldCheck, CheckCircle2, X } from 'lucide-react';
import { soundEngine } from '../../utils/audioPlayer';

export const IntimacyLockModal: React.FC = () => {
  const { biometricTargetMoment, closeBiometricModal, unlockMoment, partner, user, setVibe } = useTether();
  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'success'>('idle');

  if (!biometricTargetMoment) return null;

  const handleSimulateBiometric = () => {
    if (scanState !== 'idle') return;
    setScanState('scanning');

    setTimeout(() => {
      soundEngine.playBiometricUnlock();
      setScanState('success');

      setTimeout(() => {
        unlockMoment(biometricTargetMoment.id);
        setScanState('idle');
      }, 700);
    }, 1100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-xs bg-[#1E1B19] text-[#FAF7F5] rounded-3xl p-6 shadow-2xl border border-white/10 flex flex-col items-center text-center">
        {/* Close */}
        <button
          onClick={closeBiometricModal}
          className="absolute top-4 right-4 min-h-[44px] min-w-[44px] flex items-center justify-center text-[#8C837C] hover:text-white transition-colors"
          aria-label="Dismiss privacy prompt"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Biometric Sensor Graphic */}
        <div className="relative mt-2 mb-6">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
            scanState === 'success' 
              ? 'bg-emerald-950/60 border-2 border-emerald-500' 
              : scanState === 'scanning' 
              ? 'bg-[#332A24] border-2 border-[#C86D51]' 
              : 'bg-[#2B231F] border border-white/15'
          }`}>
            {scanState === 'idle' && (
              <Fingerprint className="w-12 h-12 text-[#C86D51] opacity-90" />
            )}
            {scanState === 'scanning' && (
              <>
                <Fingerprint className="w-12 h-12 text-[#C86D51] animate-pulse" />
                <div className="absolute inset-0 rounded-full border-2 border-[#C86D51] animate-ping opacity-50" />
              </>
            )}
            {scanState === 'success' && (
              <CheckCircle2 className="w-12 h-12 text-emerald-400 animate-scale-up" />
            )}
          </div>
        </div>

        {/* Header and Subtitle */}
        <div className="flex items-center gap-1.5 text-xs text-[#C86D51] font-medium tracking-wide uppercase mb-1">
          <Lock className="w-3.5 h-3.5" />
          <span>Intimacy Protection</span>
        </div>

        <h3 className="font-serif text-2xl text-[#FAF7F5] mb-2 font-normal">
          This moment is private.
        </h3>

        <p className="text-xs text-[#9E938B] max-w-xs mb-6 leading-relaxed">
          {scanState === 'scanning' 
            ? 'Verifying biometric signature...' 
            : scanState === 'success' 
            ? 'Access verified' 
            : `Secured for your eyes only. Confirm with Face ID or Touch ID to view what ${partner.name} shared.`}
        </p>

        {/* Action Button */}
        {scanState === 'idle' && (
          <button
            onClick={handleSimulateBiometric}
            className="w-full py-3.5 px-4 rounded-2xl bg-[#C86D51] hover:bg-[#B75F44] active:scale-[0.98] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-transform"
          >
            <Fingerprint className="w-4 h-4" />
            <span>Unlock with Biometrics</span>
          </button>
        )}

        {scanState === 'scanning' && (
          <div className="py-3 px-4 text-xs font-mono text-[#D1CBC5]">
            Scanning sensor...
          </div>
        )}

        {scanState === 'success' && (
          <div className="py-3 px-4 text-xs font-medium text-emerald-400">
            Decrypted and ready
          </div>
        )}

        {/* Quick Vibe Change while Locked */}
        <div className="mt-5 pt-3.5 border-t border-white/10 w-full text-center">
          <span className="text-[10px] uppercase font-mono text-[#A89F97] tracking-wider block mb-2">
            Change your vibe without unlocking
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { type: 'overwhelmed' as const, label: 'Overwhelmed', dot: 'bg-rose-500' },
              { type: 'free_to_talk' as const, label: 'Free to Talk', dot: 'bg-emerald-500' },
              { type: 'thinking_of_you' as const, label: 'Thinking of You', dot: 'bg-amber-400' },
            ].map((opt) => {
              const active = user.currentVibe === opt.type;
              return (
                <button
                  key={opt.type}
                  type="button"
                  onClick={() => setVibe(opt.type)}
                  className={`py-1.5 px-1 rounded-xl text-[10px] font-medium border flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    active
                      ? 'bg-white/20 border-white/40 text-white shadow-xs'
                      : 'bg-white/5 border-white/10 text-[#A89F97] hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${opt.dot} ${active ? 'animate-pulse' : ''}`} />
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-1.5 text-[10px] text-[#736B65]">
          <ShieldCheck className="w-3 h-3 text-[#A89F97]" />
          <span>On-device biometric verification</span>
        </div>
      </div>
    </div>
  );
};
