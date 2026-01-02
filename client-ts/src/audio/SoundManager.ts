/**
 * SoundManager - Handles game audio
 * Ported from ActionScript SOUNDS.as
 */

import { Howl, Howler } from 'howler';
import { CONFIG } from '../core/config';

interface SoundConfig {
  src: string;
  volume?: number;
  loop?: boolean;
}

class SoundManager {
  private static instance: SoundManager;
  
  private sounds: Map<string, Howl> = new Map();
  private music: Howl | null = null;
  private currentMusic: string = '';
  
  private soundVolume: number = 1;
  private musicVolume: number = 0.5;
  private soundEnabled: boolean = true;
  private musicEnabled: boolean = true;
  
  private constructor() {
    // Load settings from localStorage
    this.loadSettings();
  }
  
  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }
  
  /**
   * Load settings from localStorage
   */
  private loadSettings(): void {
    const soundEnabled = localStorage.getItem('bymr_sound_enabled');
    const musicEnabled = localStorage.getItem('bymr_music_enabled');
    const soundVolume = localStorage.getItem('bymr_sound_volume');
    const musicVolume = localStorage.getItem('bymr_music_volume');
    
    if (soundEnabled !== null) this.soundEnabled = soundEnabled === 'true';
    if (musicEnabled !== null) this.musicEnabled = musicEnabled === 'true';
    if (soundVolume !== null) this.soundVolume = parseFloat(soundVolume);
    if (musicVolume !== null) this.musicVolume = parseFloat(musicVolume);
  }
  
  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    localStorage.setItem('bymr_sound_enabled', String(this.soundEnabled));
    localStorage.setItem('bymr_music_enabled', String(this.musicEnabled));
    localStorage.setItem('bymr_sound_volume', String(this.soundVolume));
    localStorage.setItem('bymr_music_volume', String(this.musicVolume));
  }
  
  /**
   * Load a sound effect
   */
  loadSound(name: string, config: SoundConfig): Promise<void> {
    return new Promise((resolve) => {
      const src = config.src.startsWith('http') 
        ? config.src 
        : `${CONFIG.CDN_URL}assets/sounds/${config.src}`;
      
      const sound = new Howl({
        src: [src],
        volume: config.volume ?? this.soundVolume,
        loop: config.loop ?? false,
        onload: () => {
          this.sounds.set(name, sound);
          resolve();
        },
        onloaderror: () => {
          console.warn(`Failed to load sound: ${name}`);
          resolve(); // Don't fail on sound load error
        },
      });
    });
  }
  
  /**
   * Load music track
   */
  loadMusic(name: string, src: string): Promise<void> {
    return new Promise((resolve) => {
      const fullSrc = src.startsWith('http') 
        ? src 
        : `${CONFIG.CDN_URL}assets/sounds/${src}`;
      
      const music = new Howl({
        src: [fullSrc],
        volume: this.musicVolume,
        loop: true,
        onload: () => {
          this.sounds.set(`music_${name}`, music);
          resolve();
        },
        onloaderror: () => {
          console.warn(`Failed to load music: ${name}`);
          resolve();
        },
      });
    });
  }
  
  /**
   * Preload common game sounds
   */
  async preloadCommonSounds(): Promise<void> {
    const soundsToLoad = [
      { name: 'click', src: 'click.mp3' },
      { name: 'build', src: 'build.mp3' },
      { name: 'upgrade', src: 'upgrade.mp3' },
      { name: 'collect', src: 'collect.mp3' },
      { name: 'error', src: 'error.mp3' },
      { name: 'attack', src: 'attack.mp3' },
    ];
    
    const musicToLoad = [
      { name: 'build', src: 'music_build.mp3' },
      { name: 'attack', src: 'music_attack.mp3' },
      { name: 'ibuild', src: 'music_ibuild.mp3' },
      { name: 'iattack', src: 'music_iattack.mp3' },
    ];
    
    // Load sounds (don't wait for all, some might fail)
    await Promise.allSettled(
      soundsToLoad.map(s => this.loadSound(s.name, { src: s.src }))
    );
    
    await Promise.allSettled(
      musicToLoad.map(m => this.loadMusic(m.name, m.src))
    );
  }
  
  /**
   * Play a sound effect
   */
  play(name: string, volume?: number): number | undefined {
    if (!this.soundEnabled) return undefined;
    
    const sound = this.sounds.get(name);
    if (!sound) {
      console.warn(`Sound not found: ${name}`);
      return undefined;
    }
    
    if (volume !== undefined) {
      sound.volume(volume * this.soundVolume);
    }
    
    return sound.play();
  }
  
  /**
   * Play a sprite from a sound
   */
  playSprite(name: string, sprite: string): number | undefined {
    if (!this.soundEnabled) return undefined;
    
    const sound = this.sounds.get(name);
    if (!sound) {
      console.warn(`Sound not found: ${name}`);
      return undefined;
    }
    
    return sound.play(sprite);
  }
  
  /**
   * Stop a sound
   */
  stop(name: string): void {
    const sound = this.sounds.get(name);
    if (sound) {
      sound.stop();
    }
  }
  
  /**
   * Play music track
   */
  playMusic(name: string): void {
    if (!this.musicEnabled) return;
    
    // Stop current music
    if (this.music) {
      this.music.stop();
    }
    
    // Get music track
    const music = this.sounds.get(`music_${name}`);
    if (!music) {
      console.warn(`Music not found: ${name}`);
      return;
    }
    
    this.music = music;
    this.currentMusic = name;
    music.volume(this.musicVolume);
    music.play();
  }
  
  /**
   * Stop current music
   */
  stopMusic(): void {
    if (this.music) {
      this.music.stop();
      this.music = null;
      this.currentMusic = '';
    }
  }
  
  /**
   * Pause music
   */
  pauseMusic(): void {
    if (this.music) {
      this.music.pause();
    }
  }
  
  /**
   * Resume music
   */
  resumeMusic(): void {
    if (this.music && this.musicEnabled) {
      this.music.play();
    }
  }
  
  /**
   * Set sound effects volume (0-1)
   */
  setSoundVolume(volume: number): void {
    this.soundVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }
  
  /**
   * Set music volume (0-1)
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      this.music.volume(this.musicVolume);
    }
    this.saveSettings();
  }
  
  /**
   * Toggle sound effects
   */
  toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    this.saveSettings();
    return this.soundEnabled;
  }
  
  /**
   * Toggle music
   */
  toggleMusic(): boolean {
    this.musicEnabled = !this.musicEnabled;
    
    if (this.musicEnabled && this.currentMusic) {
      this.resumeMusic();
    } else {
      this.pauseMusic();
    }
    
    this.saveSettings();
    return this.musicEnabled;
  }
  
  /**
   * Enable/disable sound effects
   */
  setSoundEnabled(enabled: boolean): void {
    this.soundEnabled = enabled;
    this.saveSettings();
  }
  
  /**
   * Enable/disable music
   */
  setMusicEnabled(enabled: boolean): void {
    this.musicEnabled = enabled;
    
    if (!enabled) {
      this.pauseMusic();
    } else if (this.currentMusic) {
      this.resumeMusic();
    }
    
    this.saveSettings();
  }
  
  /**
   * Get sound enabled state
   */
  isSoundEnabled(): boolean {
    return this.soundEnabled;
  }
  
  /**
   * Get music enabled state
   */
  isMusicEnabled(): boolean {
    return this.musicEnabled;
  }
  
  /**
   * Get sound volume
   */
  getSoundVolume(): number {
    return this.soundVolume;
  }
  
  /**
   * Get music volume
   */
  getMusicVolume(): number {
    return this.musicVolume;
  }
  
  /**
   * Mute all audio
   */
  muteAll(): void {
    Howler.mute(true);
  }
  
  /**
   * Unmute all audio
   */
  unmuteAll(): void {
    Howler.mute(false);
  }
  
  /**
   * Called each game tick
   */
  tick(): void {
    // Could implement sound queueing or other per-frame logic
  }
  
  /**
   * Clean up and release resources
   */
  destroy(): void {
    // Stop all sounds
    this.sounds.forEach(sound => sound.unload());
    this.sounds.clear();
    this.music = null;
  }
}

// Export singleton
export { SoundManager };
