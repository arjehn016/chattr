// Web Audio API Search and Rescue Whistle Synthesizer for Disasters
let audioCtx: AudioContext | null = null;
let whistleOscillator: OscillatorNode | null = null;
let whistleGain: GainNode | null = null;
let whistleInterval: any = null;

export const startEmergencyWhistle = () => {
  stopEmergencyWhistle();

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const playBeep = () => {
      if (!audioCtx) return;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // Dual-tone rescue whistle simulation (around 2900Hz - 3200Hz)
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2950, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(3200, audioCtx.currentTime + 0.15);
      osc.frequency.exponentialRampToValueAtTime(2900, audioCtx.currentTime + 0.35);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 0.45);
    };

    // Play immediate pulse, then repeat every 700ms (SOS rhythm)
    playBeep();
    whistleInterval = setInterval(playBeep, 700);
  } catch (err) {
    console.error('Emergency whistle audio error:', err);
  }
};

export const stopEmergencyWhistle = () => {
  if (whistleInterval) {
    clearInterval(whistleInterval);
    whistleInterval = null;
  }
  if (whistleOscillator) {
    try {
      whistleOscillator.stop();
      whistleOscillator.disconnect();
    } catch (e) {}
    whistleOscillator = null;
  }
  if (whistleGain) {
    try {
      whistleGain.disconnect();
    } catch (e) {}
    whistleGain = null;
  }
  if (audioCtx) {
    try {
      audioCtx.close();
    } catch (e) {}
    audioCtx = null;
  }
};
