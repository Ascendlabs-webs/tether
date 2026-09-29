import React from 'react';
import { useTether } from '../../context/TetherContext';
import { VibeCheckComponent } from './VibeCheckComponent';
import { 
  Sparkles, 
  Lock, 
  Play, 
  Clock, 
  Camera, 
  Mic, 
  Video, 
  ChevronRight, 
  Heart,
  Moon
} from 'lucide-react';

export const HomeScreen: React.FC = () => {
  const { 
    user, 
    partner, 
    moments, 
    setIsTapAndTalkOpen, 
    setActiveTab, 
    promptUnlockMoment 
  } = useTether();

  // Find latest moment from partner
  const latestPartnerMoment = moments.find(m => m.senderId === partner.id);
  // Recent 2 moments for feed preview
  const recentMoments = moments.slice(0, 2);

  const getExpirationText = (expiresAt: string) => {
    const diff = new Date(expiresAt).getTime() - Date.now();
    if (diff <= 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours > 0) return `Expires in ${hours}h`;
    const mins = Math.max(1, Math.floor(diff / (1000 * 60)));
    return `Expires in ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-[#2B2320]">
      <div className="max-w-md mx-auto px-4 pt-4 space-y-6">
        
        {/* PARTNER CALENDAR / FOCUS BANNER IF ACTIVE */}
        {partner.isInFocusMode && (
          <div className="p-3.5 rounded-2xl bg-[#F6EFEA] border border-[#E8DDD4] flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#EBDDD2] flex items-center justify-center text-[#A6634B]">
                <Moon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#2B2320]">
                  {partner.name} is in focus mode ❤️
                </p>
                <p className="text-[10px] text-[#736A64]">
                  {partner.focusModeReason || 'Focused on a scheduled block'} · Notifications gently muted
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 1. HERO TAP & TALK INTERACTION */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#2B2320] via-[#241E1C] to-[#1C1816] text-[#FAF7F5] p-6 shadow-md border border-white/5 text-center flex flex-col items-center">
          {/* Subtle background glow */}
          <div className="absolute top-0 inset-x-0 h-32 bg-radial from-[#C86D51]/15 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            <span className="text-[11px] font-medium uppercase tracking-widest text-[#B5A9A0] mb-1">
              Send a little moment
            </span>

            <h2 className="font-serif text-2xl font-normal text-white mb-6">
              Send something to {partner.name} ❤️
            </h2>

            {/* Central Tap & Talk Button */}
            <div className="relative mb-6">
              {/* Pulsing rings */}
              <div className="absolute -inset-3 rounded-full bg-[#C86D51]/20 animate-ping opacity-30" />
              <div className="absolute -inset-1 rounded-full bg-[#C86D51]/30 blur-xs" />

              <button
                onClick={() => setIsTapAndTalkOpen(true)}
                className="relative w-24 h-24 rounded-full bg-gradient-to-br from-[#D97D61] to-[#B3583E] text-white flex flex-col items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 group cursor-pointer"
                aria-label={`Send moment to ${partner.name}`}
              >
                <Sparkles className="w-9 h-9 mb-1 text-white group-hover:rotate-12 transition-transform duration-300" />
                <span className="text-[10px] font-semibold tracking-wider uppercase">
                  Tap & Talk
                </span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-[#A89F97]">
              <span className="flex items-center gap-1">
                <Camera className="w-3 h-3 text-[#C86D51]" /> Photo
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Video className="w-3 h-3 text-[#C86D51]" /> Video
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Mic className="w-3 h-3 text-[#C86D51]" /> Voice
              </span>
            </div>
          </div>
        </section>

        {/* 2. VIBE CHECK */}
        <section>
          <VibeCheckComponent />
        </section>

        {/* 3. LATEST INCOMING PARTNER MOMENT */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-[#7D736C]">
              Latest from {partner.name}
            </h3>
            {latestPartnerMoment && (
              <span className="text-[11px] text-[#A89F97] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {getExpirationText(latestPartnerMoment.expiresAt)}
              </span>
            )}
          </div>

          {!latestPartnerMoment ? (
            <div className="p-6 rounded-2xl bg-white border border-[#ECE5DF] text-center shadow-xs">
              <p className="text-xs text-[#736A64]">
                Nothing incoming right now. You’re all caught up.
              </p>
            </div>
          ) : (
            <div className="relative rounded-3xl overflow-hidden bg-white border border-[#ECE5DF] shadow-xs hover:border-[#DDD3CB] transition-all">
              {/* If locked, display blurred teaser */}
              {latestPartnerMoment.isLocked ? (
                <div 
                  onClick={() => promptUnlockMoment(latestPartnerMoment)}
                  className="relative aspect-16/9 w-full flex flex-col items-center justify-center p-6 text-center cursor-pointer group bg-[#1F1B18]"
                >
                  <img
                    src={latestPartnerMoment.mediaUrl}
                    alt="Teaser"
                    className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-40 scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

                  <div className="relative z-10 flex flex-col items-center">
                    <div className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-2 text-white group-hover:scale-105 transition-transform">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-serif text-lg text-white mb-0.5">
                      {partner.name} sent you a moment ❤️
                    </h4>
                    <p className="text-[11px] text-white/70 mb-2">
                      Protected with Intimacy Lock
                    </p>
                    <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-medium text-white backdrop-blur-xs">
                      Tap to reveal
                    </span>
                  </div>
                </div>
              ) : (
                /* Unlocked representation */
                <div 
                  onClick={() => setActiveTab('moments')}
                  className="cursor-pointer"
                >
                  <div className="relative aspect-16/9 w-full bg-[#1F1B18] overflow-hidden">
                    {latestPartnerMoment.mediaType === 'audio' ? (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-[#2C2420] text-white">
                        <div className="w-10 h-10 rounded-full bg-[#C86D51] flex items-center justify-center mb-2">
                          <Play className="w-5 h-5 ml-0.5 fill-white" />
                        </div>
                        <p className="text-xs font-medium">Voice snippet from {partner.name}</p>
                      </div>
                    ) : (
                      <img
                        src={latestPartnerMoment.mediaUrl}
                        alt="Partner moment"
                        loading="eager"
                        decoding="sync"
                        className="w-full h-full object-cover"
                      />
                    )}
                    <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-[10px] text-white uppercase tracking-wider font-mono">
                      {latestPartnerMoment.mediaType}
                    </span>
                  </div>

                  <div className="p-4 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-[#2B2320]">
                        {latestPartnerMoment.caption || `A warm ${latestPartnerMoment.mediaType} from ${partner.name}`}
                      </p>
                      <p className="text-[10px] text-[#8C837C] mt-0.5">
                        Shared recently · Tap to view in Moments stream
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#A89F97]" />
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 4. FEED PREVIEW */}
        <section>
          <div className="flex items-center justify-between mb-2.5 px-1">
            <h3 className="text-xs font-semibold tracking-wider uppercase text-[#7D736C]">
              Recent Moments
            </h3>
            <button
              onClick={() => setActiveTab('moments')}
              className="text-xs text-[#C86D51] hover:underline flex items-center gap-0.5"
            >
              <span>See stream</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-2.5">
            {recentMoments.map((m) => (
              <div
                key={m.id}
                onClick={() => setActiveTab('moments')}
                className="p-3 rounded-2xl bg-white border border-[#ECE5DF] shadow-xs flex items-center justify-between cursor-pointer hover:border-[#DDD3CB] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={m.senderAvatar}
                    alt={m.senderName}
                    className="w-8 h-8 rounded-full object-cover border border-[#E8E2DD]"
                  />
                  <div>
                    <p className="text-xs font-medium text-[#2B2320]">
                      {m.senderId === user.id ? 'You shared a ' : `${m.senderName} shared a `}
                      <span className="font-semibold">{m.mediaType}</span>
                    </p>
                    <p className="text-[10px] text-[#8C837C]">
                      {getExpirationText(m.expiresAt)}
                    </p>
                  </div>
                </div>
                {m.isLocked && m.senderId !== user.id ? (
                  <Lock className="w-3.5 h-3.5 text-[#C86D51]" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-[#A89F97]" />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
