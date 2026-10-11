import React, { useState, useEffect } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  ArrowUp,
  Volume2,
  VolumeX,
  X,
  Compass,
  AlertTriangle,
} from 'lucide-react';
import { NavigationStep, MOCK_NAVIGATION_STEPS } from '../services/gtfsRealtimeService';

interface ActiveNavigationOverlayProps {
  onStopNavigation: () => void;
  currentSpeed: number;
  currentStepIndex?: number;
}

export const ActiveNavigationOverlay: React.FC<ActiveNavigationOverlayProps> = ({
  onStopNavigation,
  currentSpeed,
  currentStepIndex = 1,
}) => {
  const [stepIndex, setStepIndex] = useState(currentStepIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceToast, setVoiceToast] = useState<string | null>(null);

  const step: NavigationStep = MOCK_NAVIGATION_STEPS[stepIndex] || MOCK_NAVIGATION_STEPS[0];

  const playChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  useEffect(() => {
    // Voice announcement & chime on navigation step change
    if (!isMuted) {
      playChime();
      setVoiceToast(`Голосова підказка: "${step.instruction}"`);
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(step.instruction);
          utterance.lang = 'uk-UA';
          utterance.rate = 1.05;
          window.speechSynthesis.speak(utterance);
        } catch (e) {
          // gracefully fallback
        }
      }
      const timer = setTimeout(() => setVoiceToast(null), 3500);
      return () => clearTimeout(timer);
    } else {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch (e) {}
      }
    }
  }, [stepIndex, isMuted, step.instruction]);

  const renderManeuverIcon = () => {
    switch (step.direction) {
      case 'slight_right':
      case 'right':
        return <ArrowUpRight className="w-8 h-8 text-white stroke-[2.8]" />;
      case 'straight':
      default:
        return <ArrowUp className="w-8 h-8 text-white stroke-[2.8]" />;
    }
  };

  return (
    <div className="absolute inset-x-3 top-3 z-[1150] pointer-events-auto flex flex-col gap-2 animate-in fade-in slide-in-from-top-4 duration-200">
      {/* Top Maneuver HUD Card */}
      <div className="bg-slate-950/95 backdrop-blur-md rounded-3xl p-3.5 shadow-2xl border border-slate-800 text-white flex items-center justify-between gap-3">
        {/* Maneuver Icon */}
        <div className="w-13 h-13 rounded-2xl bg-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/30">
          {renderManeuverIcon()}
        </div>

        {/* Turn Instruction */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs font-black text-blue-400">
            <span>{step.distanceMeters >= 1000 ? `${(step.distanceMeters / 1000).toFixed(1)} км` : `${step.distanceMeters} м`}</span>
            <span>•</span>
            <span className="truncate">{step.streetName}</span>
          </div>
          <h3 className="text-xs sm:text-sm font-extrabold text-white leading-snug mt-0.5 line-clamp-2">
            {step.instruction}
          </h3>
        </div>

        {/* Controls (Mute / Stop) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title={isMuted ? 'Увімкнути звук' : 'Вимкнути звук'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-blue-400" />}
          </button>
          <button
            onClick={onStopNavigation}
            className="p-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 transition-colors"
            title="Завершити навігацію"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Prompt Toast */}
      {voiceToast && (
        <div className="bg-blue-600 text-white text-[11px] font-bold py-1.5 px-3.5 rounded-full shadow-md flex items-center gap-1.5 mx-auto animate-in fade-in">
          <Volume2 className="w-3.5 h-3.5" />
          <span>{voiceToast}</span>
        </div>
      )}

      {/* Secondary HUD: Speedometer & Next Stop ETA Bar */}
      <div className="flex items-center justify-between gap-2 px-1">
        {/* Speedometer widget */}
        <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-white shadow-md">
          <div className="flex items-baseline gap-1">
            <span className="text-base sm:text-lg font-black font-mono text-emerald-400">
              {currentSpeed}
            </span>
            <span className="text-[10px] text-slate-400 uppercase font-bold">км/год</span>
          </div>
          {/* Speed limit pill */}
          <div className="w-6 h-6 rounded-full border-2 border-rose-500 bg-white text-slate-900 text-[10px] font-black flex items-center justify-center">
            90
          </div>
        </div>

        {/* Lane Guidance / Next Step Trigger */}
        <button
          onClick={() => setStepIndex((prev) => (prev + 1) % MOCK_NAVIGATION_STEPS.length)}
          className="bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-colors"
        >
          <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span>Наступний маневр →</span>
        </button>
      </div>
    </div>
  );
};
