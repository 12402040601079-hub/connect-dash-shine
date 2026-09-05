// Web Audio API Synthesizer - 100% Free, Zero External Assets, Eye & Ear Comfort
class SoundService {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("microlink_sound_enabled");
      this.enabled = stored !== null ? stored === "true" : true;
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggleSound(): boolean {
    this.enabled = !this.enabled;
    if (typeof window !== "undefined") {
      localStorage.setItem("microlink_sound_enabled", String(this.enabled));
    }
    if (this.enabled) {
      this.playTap();
    }
    return this.enabled;
  }

  // Gentle, soft click / tap
  public playTap() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(480, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(240, this.ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.04);
    } catch {
      // Audio not permitted or unavailable
    }
  }

  // Soothing 2-tone chime for incoming bid / message
  public playChime() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const notes = [523.25, 659.25]; // C5, E5
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = this.ctx.currentTime + idx * 0.12;
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.12, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });
    } catch {
      // Audio not permitted
    }
  }

  // Triumphant chord for task accepted or completion
  public playSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const chord = [523.25, 659.25, 783.99, 1046.5]; // C major chord
      chord.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        const startTime = this.ctx.currentTime + idx * 0.06;
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.1, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch {
      // Audio not permitted
    }
  }
}

export const sound = new SoundService();
