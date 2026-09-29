import React, { useState, useRef, useEffect } from 'react';
import { useTether } from '../../context/TetherContext';
import { Camera, Video, Mic, X, Send, Sparkles, Lock, RefreshCw, Square } from 'lucide-react';
import { createAestheticImage } from '../../utils/demoData';

type CaptureMode = 'select' | 'photo' | 'video' | 'audio' | 'preview' | 'sending';

export const TapAndTalkModal: React.FC = () => {
  const { 
    isTapAndTalkOpen, 
    setIsTapAndTalkOpen, 
    user, 
    partner, 
    sendMoment, 
    triggerPaywall 
  } = useTether();

  const [mode, setMode] = useState<CaptureMode>('select');
  const [selectedType, setSelectedType] = useState<'photo' | 'video' | 'audio'>('photo');
  const [previewMediaUrl, setPreviewMediaUrl] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Reset when opened
  useEffect(() => {
    if (isTapAndTalkOpen) {
      setMode('select');
      setSelectedType('photo');
      setPreviewMediaUrl('');
      setCaption('');
      setIsRecording(false);
      setRecordingSeconds(0);
      setWaveformBars([]);
      setCameraError(null);
    } else {
      cleanupStreams();
    }
  }, [isTapAndTalkOpen]);

  const cleanupStreams = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
  };

  const handleSelectType = (type: 'photo' | 'video' | 'audio') => {
    if (type !== 'photo' && !user.isPremium) {
      triggerPaywall('Video & Voice Moments');
      return;
    }

    setSelectedType(type);
    if (type === 'photo') {
      startCamera();
      setMode('photo');
    } else if (type === 'video') {
      startCamera();
      setMode('video');
    } else if (type === 'audio') {
      setMode('audio');
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 960 } },
          audio: selectedType === 'video'
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
      } else {
        setCameraError('Camera stream not supported in this frame. Falling back to quick capture.');
      }
    } catch {
      setCameraError('Camera access declined. You can take a quick creative photo or upload.');
    }
  };

  const takePhotoSnapshot = () => {
    if (videoRef.current && streamRef.current) {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = videoRef.current.videoWidth || 640;
        canvas.height = videoRef.current.videoHeight || 800;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setPreviewMediaUrl(dataUrl);
          cleanupStreams();
          setMode('preview');
          return;
        }
      } catch {
        // canvas fallback
      }
    }

    // High fidelity fallback moment
    const fallbackImage = createAestheticImage('coffee', `Warm moment from ${user.name}`);
    setPreviewMediaUrl(fallbackImage);
    cleanupStreams();
    setMode('preview');
  };

  // Video recording simulation / capture (max 15s)
  const startVideoRecording = () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => {
        if (prev >= 15) {
          stopVideoRecording();
          return 15;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopVideoRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    cleanupStreams();
    const fallbackVideo = createAestheticImage('sunset', `15s sunset from ${user.name}`);
    setPreviewMediaUrl(fallbackVideo);
    setMode('preview');
  };

  // Audio recording
  const startAudioRecording = async () => {
    setIsRecording(true);
    setRecordingSeconds(0);
    setWaveformBars([]);

    timerRef.current = setInterval(() => {
      setRecordingSeconds(prev => {
        if (prev >= 15) {
          stopAudioRecording();
          return 15;
        }
        return prev + 1;
      });
      // Generate dynamic waveform bars
      setWaveformBars(prev => [...prev, Math.floor(Math.random() * 60) + 30].slice(-16));
    }, 1000);

    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        mediaRecorder.start();
      }
    } catch {
      // Audio capture simulated gracefully
    }
  };

  const stopAudioRecording = () => {
    setIsRecording(false);
    if (timerRef.current) clearInterval(timerRef.current);
    cleanupStreams();
    setPreviewMediaUrl('recorded_audio_note');
    setMode('preview');
  };

  const handleSend = () => {
    const finalMediaUrl = previewMediaUrl || createAestheticImage('custom', `Moment for ${partner.name}`);
    
    // Fast pre-warm image cache
    if (finalMediaUrl && typeof Image !== 'undefined') {
      const preloadImg = new Image();
      preloadImg.src = finalMediaUrl;
    }

    // Instant dispatch for faster widget updates
    sendMoment(
      selectedType,
      finalMediaUrl,
      caption.trim() || undefined,
      recordingSeconds > 0 ? recordingSeconds : (selectedType === 'audio' ? 8 : undefined),
      waveformBars.length > 0 ? waveformBars : [40, 60, 80, 100, 70, 50, 65, 85, 90, 60, 40]
    );
  };

  if (!isTapAndTalkOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-[#1E1B19] text-[#FAF7F5] rounded-3xl overflow-hidden shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
        {/* Header bar */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 z-10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C86D51]" />
            <h3 className="text-xs uppercase tracking-wider text-[#A89F97] font-semibold">
              {mode === 'sending' ? 'Sending Moment' : `Send to ${partner.name}`}
            </h3>
          </div>
          <button
            onClick={() => {
              cleanupStreams();
              setIsTapAndTalkOpen(false);
            }}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center -mr-2 text-[#A89F97] hover:text-white transition-colors"
            aria-label="Close capture modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MODE: SELECT MEDIA TYPE */}
        {mode === 'select' && (
          <div className="p-6 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-[#2C2723] flex items-center justify-center mb-4 text-[#D8CDC4] border border-white/5">
              <Sparkles className="w-8 h-8 text-[#C86D51]" />
            </div>

            <h2 className="font-serif text-2xl text-[#FAF7F5] mb-2 font-normal">
              Send a little moment
            </h2>
            <p className="text-xs text-[#9E938B] max-w-xs mb-8">
              No pressure. No typing. Just an intimate glimpse of your world for {partner.name}.
            </p>

            {/* Tap & Talk Choices */}
            <div className="w-full space-y-2.5">
              <button
                onClick={() => handleSelectType('photo')}
                className="w-full p-4 rounded-2xl bg-[#2A2421] hover:bg-[#342D29] border border-white/10 flex items-center justify-between transition-colors min-h-[56px] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3B322D] flex items-center justify-center text-[#FAF7F5]">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#FAF7F5]">Photo Moment</p>
                    <p className="text-[11px] text-[#9E938B]">A quiet glimpse of your day</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#C86D51] group-hover:translate-x-0.5 transition-transform">
                  Tap →
                </span>
              </button>

              <button
                onClick={() => handleSelectType('video')}
                className="w-full p-4 rounded-2xl bg-[#2A2421] hover:bg-[#342D29] border border-white/10 flex items-center justify-between transition-colors min-h-[56px] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3B322D] flex items-center justify-center text-[#FAF7F5]">
                    <Video className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-[#FAF7F5]">Short Video</p>
                      {!user.isPremium && (
                        <span className="flex items-center gap-0.5 text-[9px] text-amber-300/90 font-medium">
                          <Lock className="w-2.5 h-2.5" /> Premium
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#9E938B]">Up to 15 seconds</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#C86D51] group-hover:translate-x-0.5 transition-transform">
                  Tap →
                </span>
              </button>

              <button
                onClick={() => handleSelectType('audio')}
                className="w-full p-4 rounded-2xl bg-[#2A2421] hover:bg-[#342D29] border border-white/10 flex items-center justify-between transition-colors min-h-[56px] group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#3B322D] flex items-center justify-center text-[#FAF7F5]">
                    <Mic className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-[#FAF7F5]">Voice Note</p>
                      {!user.isPremium && (
                        <span className="flex items-center gap-0.5 text-[9px] text-amber-300/90 font-medium">
                          <Lock className="w-2.5 h-2.5" /> Premium
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#9E938B]">Intimate audio snippet</p>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#C86D51] group-hover:translate-x-0.5 transition-transform">
                  Tap →
                </span>
              </button>
            </div>
          </div>
        )}

        {/* MODE: PHOTO CAPTURE */}
        {mode === 'photo' && (
          <div className="flex-1 flex flex-col items-center p-4">
            <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden bg-black flex items-center justify-center mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#29221E]/95">
                  <Camera className="w-10 h-10 text-[#C86D51] mb-2" />
                  <p className="text-xs text-[#FAF7F5] mb-1 font-medium">{cameraError}</p>
                  <p className="text-[11px] text-[#A89F97] mb-4">You can still take an instant stylized photo moment.</p>
                  <button
                    onClick={takePhotoSnapshot}
                    className="px-4 py-2 bg-[#C86D51] text-white rounded-xl text-xs font-medium"
                  >
                    Take Photo Snapshot
                  </button>
                </div>
              )}
            </div>

            {/* Shutter Button */}
            {!cameraError && (
              <div className="flex items-center justify-center py-2">
                <button
                  onClick={takePhotoSnapshot}
                  className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center bg-white hover:scale-95 active:scale-90 transition-transform shadow-lg cursor-pointer"
                  aria-label="Capture photo"
                >
                  <div className="w-12 h-12 rounded-full bg-[#FAF7F5] border border-black/10" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* MODE: VIDEO CAPTURE */}
        {mode === 'video' && (
          <div className="flex-1 flex flex-col items-center p-4">
            <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden bg-black flex items-center justify-center mb-4">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />

              {/* Countdown / duration badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] font-mono text-white flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/40'}`} />
                <span>{recordingSeconds}s / 15s</span>
              </div>

              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-[#29221E]/95">
                  <Video className="w-10 h-10 text-[#C86D51] mb-2" />
                  <p className="text-xs text-[#FAF7F5] mb-4">{cameraError}</p>
                  <button
                    onClick={() => {
                      setPreviewMediaUrl(createAestheticImage('sunset', `Sunset video for ${partner.name}`));
                      setMode('preview');
                    }}
                    className="px-4 py-2 bg-[#C86D51] text-white rounded-xl text-xs font-medium"
                  >
                    Capture Sunset Video
                  </button>
                </div>
              )}
            </div>

            {/* Record / Stop Button */}
            {!cameraError && (
              <div className="flex items-center justify-center py-2">
                {!isRecording ? (
                  <button
                    onClick={startVideoRecording}
                    className="w-16 h-16 rounded-full border-4 border-red-500/40 flex items-center justify-center bg-red-600 hover:scale-95 active:scale-90 transition-transform shadow-lg cursor-pointer"
                    aria-label="Start recording video"
                  >
                    <div className="w-8 h-8 rounded-full bg-white" />
                  </button>
                ) : (
                  <button
                    onClick={stopVideoRecording}
                    className="w-16 h-16 rounded-full border-4 border-red-500/40 flex items-center justify-center bg-red-600 hover:scale-95 active:scale-90 transition-transform shadow-lg cursor-pointer animate-pulse"
                    aria-label="Stop recording video"
                  >
                    <Square className="w-6 h-6 text-white fill-white" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* MODE: AUDIO CAPTURE */}
        {mode === 'audio' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-[#2C2420] border border-[#C86D51]/30 flex items-center justify-center mb-6 relative">
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-2 border-[#C86D51] animate-ping opacity-60" />
              )}
              <Mic className={`w-8 h-8 ${isRecording ? 'text-red-500 animate-pulse' : 'text-[#C86D51]'}`} />
            </div>

            <p className="text-sm font-medium text-[#FAF7F5] mb-1">
              {isRecording ? 'Listening...' : 'Tap below to speak'}
            </p>
            <p className="text-xs text-[#9E938B] mb-6">
              {isRecording ? `${recordingSeconds}s · Max 15 seconds` : 'A warm voice snippet for your partner'}
            </p>

            {/* Live waveform representation */}
            {isRecording && (
              <div className="flex items-center gap-1.5 h-12 mb-6">
                {waveformBars.map((height, i) => (
                  <span
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-1.5 bg-[#C86D51] rounded-full transition-all duration-150"
                  />
                ))}
              </div>
            )}

            {/* Mic Record Button */}
            {!isRecording ? (
              <button
                onClick={startAudioRecording}
                className="w-16 h-16 rounded-full bg-[#C86D51] text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                aria-label="Start audio recording"
              >
                <Mic className="w-7 h-7" />
              </button>
            ) : (
              <button
                onClick={stopAudioRecording}
                className="w-16 h-16 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform"
                aria-label="Stop audio recording"
              >
                <Square className="w-6 h-6 fill-white" />
              </button>
            )}
          </div>
        )}

        {/* MODE: PREVIEW */}
        {mode === 'preview' && (
          <div className="flex-1 flex flex-col p-4">
            <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden bg-black mb-3 border border-white/10 flex items-center justify-center">
              {selectedType === 'audio' ? (
                <div className="flex flex-col items-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-[#2E2521] flex items-center justify-center mb-3">
                    <Mic className="w-8 h-8 text-[#C86D51]" />
                  </div>
                  <p className="text-sm font-medium text-[#FAF7F5]">Voice snippet ready</p>
                  <p className="text-xs text-[#9E938B] mt-1">{recordingSeconds || 8} seconds recorded</p>
                </div>
              ) : (
                <img
                  src={previewMediaUrl}
                  alt="Moment preview"
                  className="w-full h-full object-cover"
                />
              )}

              {/* Retake button */}
              <button
                onClick={() => setMode('select')}
                className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-xs text-[11px] text-white/80 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Retake</span>
              </button>
            </div>

            {/* Optional gentle caption */}
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a quiet note (optional)..."
              maxLength={80}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#292320] border border-white/10 text-xs text-white placeholder-[#8A7F77] focus:outline-none focus:border-[#C86D51] mb-3"
            />

            {/* Send Button */}
            <button
              onClick={handleSend}
              className="w-full h-12 rounded-xl bg-[#C86D51] hover:bg-[#B75F44] active:scale-[0.98] text-white text-sm font-medium flex items-center justify-center gap-2 shadow-lg transition-transform"
            >
              <Send className="w-4 h-4" />
              <span>Send to {partner.name}</span>
            </button>
          </div>
        )}

        {/* MODE: SENDING STATE */}
        {mode === 'sending' && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full border-2 border-[#C86D51] border-t-transparent animate-spin mb-4" />
            <p className="font-serif text-xl text-[#FAF7F5] mb-1">Delivering moment...</p>
            <p className="text-xs text-[#9E938B]">Safely landing in {partner.name}’s Tether</p>
          </div>
        )}
      </div>
    </div>
  );
};
