/**
 * Web Audio API synthesizer for tactile sounds:
 * - Voice note playback simulation (ambient harmonic tone)
 * - Biometric unlock chime
 * - Moment sent confirmation chime
 */

class SoundEngine {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  // Soft romantic chime when a moment is sent
  playSentChime() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.18); // A5

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  // Gentle low-frequency haptic tick for biometric unlock
  playBiometricUnlock() {
    const ctx = this.getContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.setValueAtTime(659.25, now + 0.08); // E5
    osc.frequency.setValueAtTime(783.99, now + 0.16); // G5

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // Voice note sound generator when playing simulated audio
  playVoiceSimulation(durationSec: number = 10, onProgress?: (percent: number) => void, onComplete?: () => void): () => void {
    const ctx = this.getContext();
    if (!ctx) {
      if (onComplete) onComplete();
      return () => {};
    }

    const startTime = ctx.currentTime;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(220, startTime); // A3 warm formant

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(330, startTime); // E4

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(600, startTime);

    gain.gain.setValueAtTime(0.08, startTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(startTime);
    osc2.start(startTime);

    let isStopped = false;
    const interval = setInterval(() => {
      if (!ctx || isStopped) return;
      const elapsed = ctx.currentTime - startTime;
      const pct = Math.min(1, elapsed / durationSec);
      if (onProgress) onProgress(pct);

      if (elapsed >= durationSec) {
        stop();
        if (onComplete) onComplete();
      }
    }, 100);

    const stop = () => {
      if (isStopped) return;
      isStopped = true;
      clearInterval(interval);
      try {
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.05);
        osc1.stop(ctx.currentTime + 0.06);
        osc2.stop(ctx.currentTime + 0.06);
      } catch {
        // already stopped
      }
    };

    return stop;
  }
}

export const soundEngine = new SoundEngine();
