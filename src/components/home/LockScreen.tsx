import React, { useState, useEffect } from 'react';
import { useTether } from '../../context/TetherContext';
import { VibeStatusType } from '../../types/tether';
import { 
  Lock, 
  Unlock, 
  Sparkles, 
  Flashlight, 
  Camera, 
  Heart, 
  Coffee, 
  Smile, 
  ChevronUp, 
  Check, 
  Bell,
  Moon
} from 'lucide-react';
import { soundEngine } from '../../utils/audioPlayer';

export const LockScreen: React.FC = () => {
  const { 
    user, 
    partner, 
    moments, 
    setVibe, 
    isLockScreenActive, 
    setIsLockScreenActive 
  } = useTether();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [unlocking, setUnlocking] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Keep clock live
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!isLockScreenActive) return null;

  const timeString = currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: false });
  const dateString = currentTime.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  // Latest moment from partner
  const latestMoment = moments.find(m => m.senderId === partner.id);
  // Latest photo/moment for picture widget
  const latestPhotoMoment = moments.find(m => m.mediaType === 'photo' || m.mediaType === 'video') || moments[0];

  // Eagerly pre-cache latest photo
  useEffect(() => {
    if (latestPhotoMoment?.mediaUrl && typeof Image !== 'undefined') {
      const img = new Image();
      img.src = latestPhotoMoment.mediaUrl;
    }
  }, [latestPhotoMoment?.mediaUrl]);

  const vibeOptions: { 
    type: VibeStatusType; 
    label: string; 
    dotColor: string; 
    activeBorder: string; 
    activeBg: string; 
    activeText: string;
    icon: React.ReactNode;
  }[] = [
    {
      type: 'overwhelmed',
      label: 'Overwhelmed',
      dotColor: 'bg-rose-500',
      activeBorder: 'border-rose-400 ring-2 ring-rose-300/40',
      activeBg: 'bg-rose-950/40 text-rose-200',
      activeText: 'text-rose-200',
      icon: <Coffee className="w-3.5 h-3.5 text-rose-400" />,
    },
    {
      type: 'free_to_talk',
      label: 'Free to Talk',
      dotColor: 'bg-emerald-500',
      activeBorder: 'border-emerald-400 ring-2 ring-emerald-300/40',
      activeBg: 'bg-emerald-950/40 text-emerald-200',
      activeText: 'text-emerald-200',
      icon: <Smile className="w-3.5 h-3.5 text-emerald-400" />,
    },
    {
      type: 'thinking_of_you',
      label: 'Thinking of You',
      dotColor: 'bg-amber-400',
      activeBorder: 'border-amber-400 ring-2 ring-amber-300/40',
      activeBg: 'bg-amber-950/40 text-amber-200',
      activeText: 'text-amber-200',
      icon: <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />,
    },
  ];

  const handleVibeChangeOnLockScreen = (status: VibeStatusType, label: string) => {
    setVibe(status);
    soundEngine.playSentChime();
    setFeedbackMessage(`Vibe set to "${label}" · Synced with ${partner.name}`);
    setTimeout(() => {
      setFeedbackMessage(null);
    }, 2800);
  };

  const handleUnlock = () => {
    if (unlocking) return;
    setUnlocking(true);
    soundEngine.playBiometricUnlock();
    setTimeout(() => {
      setIsLockScreenActive(false);
      setUnlocking(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black animate-fade-in select-none">
      {/* Phone Lock Screen Frame */}
      <div className="relative w-full max-w-md h-full min-h-screen bg-gradient-to-b from-[#181412] via-[#201A18] to-[#120F0E] text-white flex flex-col justify-between p-6 overflow-hidden">
        
        {/* Ambient Warm Atmosphere */}
        <div className="absolute top-0 inset-x-0 h-64 bg-radial from-[#C86D51]/15 to-transparent pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-48 bg-radial from-black/40 to-transparent pointer-events-none" />

        {/* Top Status & Padlock */}
        <div className="pt-2 flex flex-col items-center z-10">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs text-white/80 mb-3 border border-white/10">
            {unlocking ? (
              <Unlock className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
            ) : (
              <Lock className="w-3.5 h-3.5 text-[#E6DDD6]" />
            )}
            <span className="text-[11px] font-medium tracking-wide">
              {unlocking ? 'Unlocked' : 'Tether Lock Screen'}
            </span>
          </div>

          <span className="text-sm font-medium tracking-wide text-[#DDD2CA] capitalize">
            {dateString}
          </span>
          <h1 className="text-7xl font-extralight tracking-tight font-sans my-1 text-white">
            {timeString}
          </h1>
        </div>

        {/* Center Live Activity / Lock Screen Widget */}
        <div className="my-auto space-y-4 z-10 w-full">
          
          {/* INTERACTIVE VIBE STATUS WIDGET */}
          <div className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-4.5 shadow-2xl transition-all">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-[#C86D51]/40 border border-[#C86D51]/50 flex items-center justify-center text-white">
                  <Sparkles className="w-3 h-3 text-[#F5C4B5]" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-white tracking-wide">
                    Tether · Quick Vibe
                  </h3>
                  <p className="text-[10px] text-[#C2B7AE]">
                    Change status without unlocking
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Live Widget
              </span>
            </div>

            {/* Partner's current state glance */}
            <div className="mb-3 px-3 py-2 rounded-xl bg-black/25 border border-white/5 flex items-center justify-between">
              <span className="text-xs text-[#DDD2CA] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C86D51]" />
                <span>{partner.name} is:</span>
                <span className="font-semibold text-white capitalize">
                  {partner.isInFocusMode ? 'In focus mode' : partner.currentVibe.replace(/_/g, ' ')}
                </span>
              </span>
              {partner.isInFocusMode && (
                <span className="text-[10px] text-[#C86D51] flex items-center gap-1">
                  <Moon className="w-2.5 h-2.5" /> DND
                </span>
              )}
            </div>

            {/* 3 Interactive Vibe Buttons on Lock Screen */}
            <div className="grid grid-cols-3 gap-2">
              {vibeOptions.map((opt) => {
                const isSelected = user.currentVibe === opt.type;
                return (
                  <button
                    key={opt.type}
                    type="button"
                    onClick={() => handleVibeChangeOnLockScreen(opt.type, opt.label)}
                    aria-pressed={isSelected}
                    className={`relative flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer select-none ${
                      isSelected
                        ? `${opt.activeBg} ${opt.activeBorder} shadow-lg scale-[1.03] z-10`
                        : 'bg-black/20 border-white/10 hover:bg-white/10 text-[#DDD2CA] opacity-80 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 mb-1 transition-transform duration-300">
                      <div className="relative flex items-center justify-center">
                        {isSelected && (
                          <span className={`absolute w-3 h-3 rounded-full ${opt.dotColor} animate-calm-breathe opacity-50`} />
                        )}
                        <span className={`w-2 h-2 rounded-full ${opt.dotColor} transition-transform duration-500 ${isSelected ? 'scale-110' : ''}`} />
                      </div>
                      <span className={`text-[11px] font-semibold transition-colors duration-500 ${isSelected ? opt.activeText : 'text-[#DDD2CA]'}`}>
                        {opt.label}
                      </span>
                    </div>
                    <span className="text-[9px] text-[#A89F97] line-clamp-1 transition-colors duration-500">
                      {isSelected ? 'Active' : 'Tap to set'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Instant feedback notification */}
            {feedbackMessage && (
              <div className="mt-3 p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
                <Check className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
                <span className="text-[11px]">{feedbackMessage}</span>
              </div>
            )}
          </div>

          {/* LIVE PICTURE WIDGET (Locket style - updates instantly) */}
          {latestPhotoMoment && (
            <div 
              onClick={handleUnlock}
              className="rounded-3xl bg-white/10 backdrop-blur-xl border border-white/15 p-3.5 shadow-2xl transition-all cursor-pointer hover:bg-white/15 group"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-[#DDD2CA]">
                    Live Photo Widget
                  </span>
                </div>
                <span className="text-[9px] font-mono text-white/60">
                  {latestPhotoMoment.senderName}’s latest
                </span>
              </div>

              {/* Fast Synchronous Cached Picture Display */}
              <div className="relative aspect-16/10 w-full rounded-2xl overflow-hidden bg-black/40 border border-white/10 shadow-inner">
                <img
                  key={latestPhotoMoment.mediaUrl}
                  src={latestPhotoMoment.mediaUrl}
                  alt="Partner's latest photo"
                  loading="eager"
                  decoding="sync"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Gradient vignette & caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-3">
                  <p className="text-xs font-medium text-white line-clamp-1 drop-shadow-sm">
                    {latestPhotoMoment.caption || `New photo from ${latestPhotoMoment.senderName}`}
                  </p>
                  <span className="text-[9px] text-[#DDD2CA] opacity-80 mt-0.5">
                    Tap to open full moment
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Incoming Moment Notification if available */}
          {latestMoment && (
            <div 
              onClick={handleUnlock}
              className="rounded-2xl bg-white/10 backdrop-blur-xl border border-white/10 p-3.5 shadow-lg flex items-center gap-3 cursor-pointer hover:bg-white/15 transition-all"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 shrink-0">
                <img src={partner.avatar} alt={partner.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white truncate">
                    {partner.name}
                  </span>
                  <span className="text-[10px] text-[#A89F97]">Just now</span>
                </div>
                <p className="text-xs text-[#DDD2CA] truncate">
                  {latestMoment.caption || `Sent a private ${latestMoment.mediaType} moment ❤️`}
                </p>
              </div>
              <Bell className="w-4 h-4 text-[#C86D51] shrink-0" />
            </div>
          )}
        </div>

        {/* Bottom Actions: Flashlight, Camera & Unlock */}
        <div className="pb-4 flex flex-col items-center z-10 w-full space-y-4">
          
          {/* Unlock action prompt */}
          <button
            onClick={handleUnlock}
            className="flex flex-col items-center gap-1 text-[#DDD2CA] hover:text-white transition-colors cursor-pointer group"
          >
            <ChevronUp className="w-4 h-4 animate-bounce group-hover:scale-110 transition-transform" />
            <span className="text-xs tracking-wider uppercase font-medium">
              Swipe up or tap to unlock
            </span>
          </button>

          {/* Quick lockscreen utility buttons */}
          <div className="flex items-center justify-between w-full px-4">
            <button
              onClick={() => setFlashlightOn(!flashlightOn)}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                flashlightOn ? 'bg-white text-black' : 'bg-white/15 text-white backdrop-blur-md border border-white/10'
              }`}
              aria-label="Toggle Flashlight"
            >
              <Flashlight className="w-5 h-5" />
            </button>

            <button
              onClick={handleUnlock}
              className="w-12 h-12 rounded-full bg-white/15 text-white backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white/25 transition-all"
              aria-label="Open Camera"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          {/* Home indicator bar */}
          <div 
            onClick={handleUnlock}
            className="w-32 h-1 rounded-full bg-white/40 cursor-pointer hover:bg-white/70 transition-colors" 
          />
        </div>
      </div>
    </div>
  );
};

export default LockScreen;
