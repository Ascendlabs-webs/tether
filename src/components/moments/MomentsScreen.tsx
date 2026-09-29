import React, { useState } from 'react';
import { useTether } from '../../context/TetherContext';
import { Moment } from '../../types/tether';
import { 
  Lock, 
  Unlock, 
  Archive, 
  Play, 
  Pause, 
  Clock, 
  Camera, 
  Video, 
  Mic, 
  Sparkles,
  BookmarkCheck,
  Check
} from 'lucide-react';
import { soundEngine } from '../../utils/audioPlayer';

export const MomentsScreen: React.FC = () => {
  const { 
    moments, 
    user, 
    partner, 
    promptUnlockMoment, 
    saveToVault, 
    setIsTapAndTalkOpen 
  } = useTether();

  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [audioProgress, setAudioProgress] = useState<number>(0);
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);
  const stopAudioRef = React.useRef<(() => void) | null>(null);

  const getExpirationText = (expiresAt: string) => {
    const remainingMs = new Date(expiresAt).getTime() - Date.now();
    if (remainingMs <= 0) return 'Expired';
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    if (hours > 0) return `Expires in ${hours}h`;
    const mins = Math.max(1, Math.floor(remainingMs / (1000 * 60)));
    return `Expires in ${mins}m`;
  };

  const getRelativeTime = (createdAt: string) => {
    const diffMs = Date.now() - new Date(createdAt).getTime();
    const mins = Math.floor(diffMs / (1000 * 60));
    if (mins < 60) return `${Math.max(1, mins)}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const handleToggleAudio = (moment: Moment) => {
    if (playingAudioId === moment.id) {
      if (stopAudioRef.current) stopAudioRef.current();
      setPlayingAudioId(null);
      setAudioProgress(0);
    } else {
      if (stopAudioRef.current) stopAudioRef.current();
      setPlayingAudioId(moment.id);
      setAudioProgress(0);

      const duration = moment.durationSeconds || 10;
      stopAudioRef.current = soundEngine.playVoiceSimulation(
        duration,
        (pct) => setAudioProgress(pct),
        () => {
          setPlayingAudioId(null);
          setAudioProgress(0);
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] pb-24 text-[#2B2320]">
      {/* Sub-header */}
      <div className="sticky top-14 z-20 px-5 py-3 bg-[#FAF7F5]/90 backdrop-blur-md border-b border-[#E8E2DD] flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-normal text-[#2B2320]">
            Moments
          </h1>
          <p className="text-[11px] text-[#736A64]">
            Ephemeral stream · Moments disappear after 48 hours
          </p>
        </div>
        <button
          onClick={() => setIsTapAndTalkOpen(true)}
          className="px-3.5 py-1.5 rounded-full bg-[#C86D51] text-white text-xs font-medium flex items-center gap-1.5 shadow-xs hover:bg-[#B75F44] transition-colors"
        >
          <Sparkles className="w-3 h-3" />
          <span>New Moment</span>
        </button>
      </div>

      <div className="max-w-md mx-auto px-4 pt-5 space-y-6">
        {moments.length === 0 ? (
          <div className="text-center py-16 px-6">
            <div className="w-14 h-14 rounded-full bg-[#F2ECE7] flex items-center justify-center mx-auto mb-3 text-[#A89F97]">
              <Sparkles className="w-7 h-7 text-[#C86D51]" />
            </div>
            <h3 className="font-serif text-xl font-normal text-[#2B2320] mb-1">
              Quiet on the horizon
            </h3>
            <p className="text-xs text-[#736A64] max-w-xs mx-auto mb-5 leading-relaxed">
              No recent moments yet. Tap below to send {partner.name} a quick glimpse of what you are seeing or hearing.
            </p>
            <button
              onClick={() => setIsTapAndTalkOpen(true)}
              className="px-5 py-2.5 bg-[#C86D51] text-white rounded-xl text-xs font-medium shadow-xs"
            >
              Send a little moment
            </button>
          </div>
        ) : (
          moments.map((moment) => {
            const isMe = moment.senderId === user.id;
            const isLocked = moment.isLocked && !isMe;
            const isSaved = moment.isSavedToVault;

            return (
              <article 
                key={moment.id}
                className="bg-white rounded-3xl border border-[#ECE5DF] overflow-hidden shadow-xs transition-all hover:border-[#DDD3CB]"
              >
                {/* Moment Header */}
                <div className="p-4 flex items-center justify-between border-b border-[#F5EFEA]">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={moment.senderAvatar}
                      alt={moment.senderName}
                      className="w-8 h-8 rounded-full object-cover border border-[#E8E2DD]"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-[#2B2320]">
                          {isMe ? 'You' : moment.senderName}
                        </span>
                        <span className="text-[10px] text-[#A89F97]">·</span>
                        <span className="text-[10px] text-[#736A64]">
                          {getRelativeTime(moment.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-[#A89F97] mt-0.5">
                        <Clock className="w-2.5 h-2.5" />
                        <span>{getExpirationText(moment.expiresAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Save to Vault */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => saveToVault(moment.id)}
                      className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-colors ${
                        isSaved 
                          ? 'text-[#C86D51]' 
                          : 'text-[#8C837C] hover:text-[#2B2320] hover:bg-[#F6F1ED]'
                      }`}
                      title={isSaved ? 'Saved to Vault' : 'Save permanently to Vault'}
                      aria-label="Save to Vault"
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 fill-[#C86D51]/10" />
                      ) : (
                        <Archive className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Media Body */}
                <div className="relative bg-[#1A1816]">
                  {/* INTIMACY LOCKED STATE */}
                  {isLocked ? (
                    <div 
                      onClick={() => promptUnlockMoment(moment)}
                      className="relative aspect-4/3 w-full overflow-hidden flex flex-col items-center justify-center p-6 text-center cursor-pointer group"
                    >
                      {/* Blurred backdrop image */}
                      <img
                        src={moment.mediaUrl}
                        alt="Teaser"
                        className="absolute inset-0 w-full h-full object-cover filter blur-2xl opacity-40 scale-110"
                      />
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />

                      <div className="relative z-10 flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform text-white">
                          <Lock className="w-5 h-5 text-[#FAF7F5]" />
                        </div>
                        <h4 className="font-serif text-lg text-white mb-1">
                          A moment from {moment.senderName} ❤️
                        </h4>
                        <p className="text-[11px] text-white/70 max-w-xs mb-3">
                          Protected with Intimacy Lock. Tap to authenticate and reveal.
                        </p>
                        <span className="px-3 py-1 rounded-full bg-white/20 text-[10px] font-medium text-white backdrop-blur-xs">
                          Tap to Unlock
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* UNLOCKED MEDIA VIEW */
                    <div>
                      {/* PHOTO */}
                      {moment.mediaType === 'photo' && (
                        <div className="relative aspect-4/3 w-full bg-black">
                          <img
                            src={moment.mediaUrl}
                            alt="Moment"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {/* VIDEO */}
                      {moment.mediaType === 'video' && (
                        <div className="relative aspect-4/3 w-full bg-black flex items-center justify-center overflow-hidden">
                          <img
                            src={moment.mediaUrl}
                            alt="Video moment"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded-full bg-black/60 text-[10px] text-white font-mono">
                            {moment.durationSeconds || 14}s Video
                          </div>
                          <button
                            onClick={() => setActiveVideoId(activeVideoId === moment.id ? null : moment.id)}
                            className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/10 transition-colors"
                          >
                            <div className="w-12 h-12 rounded-full bg-white/90 text-[#2B2320] flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                              <Play className="w-5 h-5 ml-0.5 fill-[#2B2320]" />
                            </div>
                          </button>
                        </div>
                      )}

                      {/* AUDIO */}
                      {moment.mediaType === 'audio' && (
                        <div className="p-6 bg-[#2B2320] text-white flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-4">
                            <button
                              onClick={() => handleToggleAudio(moment)}
                              className="w-12 h-12 rounded-full bg-[#C86D51] hover:bg-[#B75F44] text-white flex items-center justify-center shadow-md active:scale-95 transition-transform shrink-0"
                            >
                              {playingAudioId === moment.id ? (
                                <Pause className="w-5 h-5 fill-white" />
                              ) : (
                                <Play className="w-5 h-5 ml-0.5 fill-white" />
                              )}
                            </button>

                            <div className="flex-1">
                              <div className="flex items-center justify-between text-xs text-[#D8CDC4] mb-1">
                                <span>Voice Snippet</span>
                                <span className="font-mono text-[10px]">
                                  {moment.durationSeconds || 11}s
                                </span>
                              </div>

                              {/* Tactile Waveform */}
                              <div className="flex items-center gap-1 h-8">
                                {(moment.audioWaveform || [30, 50, 75, 90, 60, 45, 80, 100, 60, 40, 20]).map((h, i, arr) => {
                                  const barPercent = (i + 1) / arr.length;
                                  const isFilled = playingAudioId === moment.id && audioProgress >= barPercent;
                                  return (
                                    <div
                                      key={i}
                                      style={{ height: `${h}%` }}
                                      className={`w-1.5 rounded-full transition-colors ${
                                        isFilled ? 'bg-[#FAF7F5]' : 'bg-[#C86D51]/70'
                                      }`}
                                    />
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Caption / Note */}
                {moment.caption && !isLocked && (
                  <div className="p-4 bg-white">
                    <p className="text-xs text-[#403833] leading-relaxed">
                      {moment.caption}
                    </p>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>
    </div>
  );
};
