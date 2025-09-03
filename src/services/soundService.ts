class SoundService {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;
  private volume: number = 0.7;

  constructor() {
    // Initialize sounds
    this.initializeSounds();
  }

  private initializeSounds() {
    // These would be actual sound files in a real implementation
    // For now, we'll use placeholder URLs or create simple sounds with Web Audio API
    
    this.sounds = {
      correct: new Audio('/sounds/correct.mp3'),
      wrong: new Audio('/sounds/wrong.mp3'),
      click: new Audio('/sounds/click.mp3'),
      gameOver: new Audio('/sounds/game-over.mp3'),
      countdown: new Audio('/sounds/countdown.mp3'),
    };

    // Set volume for all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });

    // If sound files don't exist, create simple beep sounds
    this.createFallbackSounds();
  }

  private createFallbackSounds() {
    // Create simple beep sounds using Web Audio API as fallback
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Simple beep function
    const createBeep = (frequency: number, duration: number) => {
      return () => {
        if (!this.enabled) return;
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration / 1000);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
      };
    };

    // Override play methods with beeps
    this.playCorrect = createBeep(523.25, 200); // C5 note
    this.playWrong = createBeep(220, 300); // A3 note
    this.playClick = createBeep(800, 50); // High beep
    this.playGameOver = createBeep(110, 500); // Low A2 note
    this.playCountdown = createBeep(440, 100); // A4 note
  }

  playSound(soundName: string) {
    if (!this.enabled) return;

    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(error => {
        console.warn(`Failed to play sound ${soundName}:`, error);
      });
    }
  }

  // Individual sound methods
  playCorrect() {
    this.playSound('correct');
  }

  playWrong() {
    this.playSound('wrong');
  }

  playClick() {
    this.playSound('click');
  }

  playGameOver() {
    this.playSound('gameOver');
  }

  playCountdown() {
    this.playSound('countdown');
  }

  // Settings
  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  setVolume(volume: number) {
    this.volume = Math.max(0, Math.min(1, volume));
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.volume;
    });
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  getVolume(): number {
    return this.volume;
  }
}

// Export singleton instance
export const soundService = new SoundService();