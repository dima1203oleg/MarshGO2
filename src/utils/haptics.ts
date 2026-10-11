/**
 * MARSHGO iOS Haptics & Mechanical Ratchet (Звукова тріскачка та тактильне відчуття)
 * Synthesizes an authentic mechanical clockwork ratchet / iOS UIDatePicker roller wheel sound
 * and tactile haptic vibration feedback.
 */

let sharedAudioCtx: AudioContext | null = null;
let lastTickTime = 0;

// Auto-unlock audio context on first user interaction for Safari & Chrome
if (typeof window !== 'undefined') {
  const unlockAudio = () => {
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass && !sharedAudioCtx) {
        sharedAudioCtx = new AudioCtxClass();
      }
      if (sharedAudioCtx && sharedAudioCtx.state === 'suspended') {
        sharedAudioCtx.resume();
      }
    } catch (e) {}
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });
}

/**
 * Triggers an authentic mechanical ratchet tick (звукова тріскачка)
 * with tactile vibration (тактильне відчуття)
 * @param pitch 'date' | 'hour' | 'minute'
 * @param force If true, bypasses throttle
 */
export function triggerRatchetTick(
  pitch: 'hour' | 'minute' | 'date' = 'minute',
  force: boolean = false
) {
  const nowMs = performance.now();
  if (!force && nowMs - lastTickTime < 28) {
    return; // Rate limit to prevent sound distortion during rapid scrolling
  }
  lastTickTime = nowMs;

  // 1. Audio Ratchet Impulse (Механічна тріскачка через Web Audio API)
  try {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtxClass) {
      if (!sharedAudioCtx) {
        sharedAudioCtx = new AudioCtxClass();
      }
      if (sharedAudioCtx.state === 'suspended') {
        sharedAudioCtx.resume();
      }

      const ctx = sharedAudioCtx;
      const t = ctx.currentTime;

      // Transient click generator (mechanical tooth release)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Pitch variation based on column:
      // Date: solid deeper mechanical clack
      // Hour: medium gear tooth click
      // Minute: crisp mechanical ratchet tick
      const baseFreq = pitch === 'date' ? 1400 : pitch === 'hour' ? 1850 : 2300;
      const endFreq = pitch === 'date' ? 320 : pitch === 'hour' ? 420 : 540;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(endFreq, t + 0.009);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(pitch === 'date' ? 1200 : pitch === 'hour' ? 1650 : 2100, t);
      filter.Q.setValueAtTime(4.2, t);

      // Volume envelope: ultra-fast attack (0.5ms) and sharp mechanical decay (14ms)
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.28, t + 0.001);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.014);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(t);
      osc.stop(t + 0.016);

      // Subtle mechanical thud body component for realism
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(pitch === 'date' ? 180 : 220, t);
      subOsc.frequency.exponentialRampToValueAtTime(60, t + 0.012);

      subGain.gain.setValueAtTime(0.12, t);
      subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012);

      subOsc.connect(subGain);
      subGain.connect(ctx.destination);

      subOsc.start(t);
      subOsc.stop(t + 0.013);
    }
  } catch (err) {
    // Graceful fallback
  }

  // 2. Tactile Haptic Vibration (Тактильний відгук вібрації)
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      // 10ms crisp tactile impulse matching Apple Taptic Engine detent
      navigator.vibrate(pitch === 'date' ? 14 : 9);
    }
  } catch (err) {
    // Ignore if not supported on desktop
  }
}
