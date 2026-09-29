import React, { useState } from 'react';
import { useTether } from '../../context/TetherContext';
import { VibeStatusType } from '../../types/tether';
import { Sparkles, Heart, Coffee, Smile, Check, Shield } from 'lucide-react';
import { soundEngine } from '../../utils/audioPlayer';

interface VibeOption {
  type: VibeStatusType;
  label: string;
  subtext: string;
  affirmation: string;
  dotColor: string;
  dotRingColor: string;
  activeBg: string;
  activeBorder: string;
  activeText: string;
  activeGlow: string;
  icon: React.ReactNode;
}

export const VibeCheckComponent: React.FC = () => {
  const { user, partner, setVibe } = useTether();
  const [lastToggled, setLastToggled] = useState<VibeStatusType | null>(null);
  const [showAffirmation, setShowAffirmation] = useState(false);

  const vibeOptions: VibeOption[] = [
    {
      type: 'overwhelmed',
      label: 'Overwhelmed',
      subtext: 'Need quiet time',
      affirmation: `Space respected · ${partner.name} notified gently`,
      dotColor: 'bg-rose-500',
      dotRingColor: 'bg-rose-400/30',
      activeBg: 'bg-gradient-to-b from-rose-50/95 to-rose-50/70',
      activeBorder: 'border-rose-300 ring-2 ring-rose-200/80',
      activeText: 'text-rose-950',
      activeGlow: 'shadow-[0_8px_24px_-6px_rgba(244,63,94,0.18)]',
      icon: <Coffee className="w-3.5 h-3.5 text-rose-500" />,
    },
    {
      type: 'free_to_talk',
      label: 'Free to Talk',
      subtext: 'Ready for you',
      affirmation: `Available & present for ${partner.name}`,
      dotColor: 'bg-emerald-500',
      dotRingColor: 'bg-emerald-400/30',
      activeBg: 'bg-gradient-to-b from-emerald-50/95 to-emerald-50/70',
      activeBorder: 'border-emerald-300 ring-2 ring-emerald-200/80',
      activeText: 'text-emerald-950',
      activeGlow: 'shadow-[0_8px_24px_-6px_rgba(16,185,129,0.18)]',
      icon: <Smile className="w-3.5 h-3.5 text-emerald-600" />,
    },
    {
      type: 'thinking_of_you',
      label: 'Thinking of You',
      subtext: 'Always on mind',
      affirmation: `Warm thought whispered to ${partner.name}`,
      dotColor: 'bg-amber-400',
      dotRingColor: 'bg-amber-400/30',
      activeBg: 'bg-gradient-to-b from-amber-50/95 to-amber-50/70',
      activeBorder: 'border-amber-300 ring-2 ring-amber-200/80',
      activeText: 'text-amber-950',
      activeGlow: 'shadow-[0_8px_24px_-6px_rgba(245,158,11,0.18)]',
      icon: <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />,
    },
  ];

  const handleSelectVibe = (type: VibeStatusType) => {
    // Deliberate, calm transition
    setVibe(type);
    setLastToggled(type);
    setShowAffirmation(true);
    soundEngine.playSentChime();

    // Auto-dismiss the calm affirmation after a gentle breath
    setTimeout(() => {
      setShowAffirmation(false);
    }, 3200);
  };

  const currentOption = vibeOptions.find(o => o.type === user.currentVibe) || vibeOptions[1];

  // Dynamic subtle container tint based on current emotional status
  const containerTint = {
    overwhelmed: 'bg-gradient-to-b from-rose-50/25 via-white/90 to-white/95 border-rose-100/70',
    free_to_talk: 'bg-gradient-to-b from-emerald-50/25 via-white/90 to-white/95 border-emerald-100/70',
    thinking_of_you: 'bg-gradient-to-b from-amber-50/25 via-white/90 to-white/95 border-amber-100/70',
  }[user.currentVibe] || 'bg-white/85 border-[#ECE5DF]';

  return (
    <div 
      className={`rounded-2xl p-4 border shadow-xs transition-colors duration-700 ease-out backdrop-blur-xs relative overflow-hidden ${containerTint}`}
    >
      {/* Subtle deliberate ambient glow behind active item */}
      <div 
        className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-all duration-1000 ease-out opacity-40"
        style={{
          backgroundColor: 
            user.currentVibe === 'overwhelmed' ? '#fda4af' :
            user.currentVibe === 'free_to_talk' ? '#6ee7b7' : '#fcd34d'
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between mb-3 relative z-10">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#C86D51] transition-transform duration-500 ease-out" />
          <h3 className="text-xs font-semibold tracking-wider uppercase text-[#7D736C]">
            Emotional Availability
          </h3>
        </div>
        <span className="text-[11px] text-[#A39992] flex items-center gap-1">
          <Shield className="w-3 h-3 text-[#A39992]" />
          Zero pressure
        </span>
      </div>

      {/* 3 Vibe Toggles with deliberate smooth easing */}
      <div className="grid grid-cols-3 gap-2.5 relative z-10">
        {vibeOptions.map((opt) => {
          const isSelected = user.currentVibe === opt.type;
          const isJustToggled = lastToggled === opt.type;

          return (
            <button
              key={opt.type}
              type="button"
              onClick={() => handleSelectVibe(opt.type)}
              aria-pressed={isSelected}
              className={`relative flex flex-col items-center justify-center p-3 rounded-xl border text-center cursor-pointer min-h-[76px] transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
                isSelected
                  ? `${opt.activeBg} ${opt.activeBorder} ${opt.activeGlow} scale-[1.03] z-10`
                  : 'bg-[#FBF9F7]/90 border-[#ECE5DF] hover:bg-[#F4EFEA] hover:border-[#DDD3CB] opacity-80 hover:opacity-100'
              }`}
            >
              {/* Calm breathing aura for the active choice */}
              {isSelected && (
                <div 
                  className={`absolute -inset-0.5 rounded-xl ${opt.dotRingColor} animate-calm-breathe pointer-events-none -z-10`} 
                />
              )}

              {/* Status Header with Meditative Dot */}
              <div className="flex items-center gap-1.5 mb-1.5 transition-transform duration-300 ease-out">
                <div className="relative flex items-center justify-center">
                  {/* Expanding calm ripple ring when selected */}
                  {isSelected && (
                    <span 
                      className={`absolute w-3.5 h-3.5 rounded-full ${opt.dotColor} animate-calm-breathe opacity-40`} 
                    />
                  )}
                  <span 
                    className={`w-2 h-2 rounded-full ${opt.dotColor} transition-transform duration-500 ease-out ${
                      isSelected ? 'scale-110 shadow-xs' : 'opacity-70'
                    }`} 
                  />
                </div>
                
                <span 
                  className={`text-[12px] font-semibold tracking-tight transition-colors duration-500 ease-out ${
                    isSelected ? opt.activeText : 'text-[#4A4039]'
                  }`}
                >
                  {opt.label}
                </span>
              </div>

              {/* Subtext description with calm fade */}
              <span 
                className={`text-[10px] leading-tight line-clamp-1 transition-colors duration-500 ease-out ${
                  isSelected ? 'text-[#5C5047] font-medium' : 'text-[#8C837C]'
                }`}
              >
                {opt.subtext}
              </span>
            </button>
          );
        })}
      </div>

      {/* Calm Affirmation Pill (appears smoothly upon status change) */}
      <div 
        className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden relative z-10 ${
          showAffirmation 
            ? 'max-h-12 opacity-100 mt-2.5' 
            : 'max-h-0 opacity-0 mt-0 pointer-events-none'
        }`}
      >
        <div className="p-2 rounded-xl bg-white/90 border border-[#E8DDD4] shadow-xs flex items-center justify-center gap-1.5 text-xs text-[#403833]">
          <Check className="w-3.5 h-3.5 text-[#C86D51] shrink-0 animate-scale-in" />
          <span className="text-[11px] font-medium text-[#4A4039]">
            {currentOption.affirmation}
          </span>
        </div>
      </div>

      {/* Partner Context Indicator */}
      <div className="mt-3 pt-3 border-t border-[#F2ECE7]/80 flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center gap-1.5 text-[#7D736C]">
          <span className="text-[11px] font-medium text-[#403833]">{partner.name}’s status:</span>
          {partner.isInFocusMode ? (
            <span className="text-[#A6634B] font-medium text-[11px] bg-[#F9ECE7] px-2.5 py-0.5 rounded-full border border-[#F0DDD4] transition-all duration-500">
              In focus mode
            </span>
          ) : (
            <span className="text-[#362E29] font-medium capitalize text-[11px] bg-[#F4EFEA] px-2.5 py-0.5 rounded-full border border-[#ECE5DF] transition-all duration-500">
              {partner.currentVibe.replace(/_/g, ' ')}
            </span>
          )}
        </div>
        <span className="text-[10px] text-[#A39992] transition-colors duration-500">
          Synced live
        </span>
      </div>
    </div>
  );
};

export default VibeCheckComponent;
