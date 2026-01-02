/**
 * SOUNDS - Audio system for the Backyard Monsters client
 * This is the TypeScript equivalent of SOUNDS.as
 */

import { GLOBAL } from '@/core/Global';
import { Storage } from '@/utils';

interface SoundConfig {
  volume: number;
  loop: boolean;
  url?: string;
}

interface AudioInstance {
  audio: HTMLAudioElement;
  config: SoundConfig;
  playing: boolean;
}

/**
 * SOUNDS class - manages all game audio
 */
export class SOUNDS {
  // Audio instances
  private static sounds: Map<string, AudioInstance> = new Map();
  private static music: Map<string, AudioInstance> = new Map();

  // Volume settings
  private static _soundVolume: number = 1.0;
  private static _musicVolume: number = 0.5;

  // Mute states
  private static _soundMuted: boolean = false;
  private static _musicMuted: boolean = false;

  // Current music
  private static _currentMusic: string | null = null;

  // Sound URL base
  private static _soundPath: string = '';

  /**
   * Initialize the sound system
   */
  static Setup(): void {
    SOUNDS._soundPath = GLOBAL._soundPathURL || '/assets/sounds/';
    
    // Load saved settings
    SOUNDS._soundMuted = Storage.get<boolean>('bymr_sound_muted') || false;
    SOUNDS._musicMuted = Storage.get<boolean>('bymr_music_muted') || false;
    SOUNDS._soundVolume = Storage.get<number>('bymr_sound_volume') ?? 1.0;
    SOUNDS._musicVolume = Storage.get<number>('bymr_music_volume') ?? 0.5;
  }

  /**
   * Play a sound effect
   */
  static Play(soundId: string, volume: number = 1.0, loop: boolean = false): void {
    if (SOUNDS._soundMuted) return;

    try {
      const url = SOUNDS.getSoundUrl(soundId);
      
      // Check if sound is already loaded
      let instance = SOUNDS.sounds.get(soundId);
      
      if (!instance) {
        const audio = new Audio(url);
        instance = {
          audio,
          config: { volume, loop, url },
          playing: false
        };
        SOUNDS.sounds.set(soundId, instance);
      }

      // Configure and play
      instance.audio.volume = volume * SOUNDS._soundVolume;
      instance.audio.loop = loop;
      instance.audio.currentTime = 0;
      instance.playing = true;

      instance.audio.play().catch(e => {
        console.warn('[SOUNDS] Failed to play sound:', soundId, e);
      });

      instance.audio.onended = () => {
        if (instance) instance.playing = false;
      };
    } catch (e) {
      console.warn('[SOUNDS] Error playing sound:', soundId, e);
    }
  }

  /**
   * Stop a sound effect
   */
  static Stop(soundId: string): void {
    const instance = SOUNDS.sounds.get(soundId);
    if (instance && instance.playing) {
      instance.audio.pause();
      instance.audio.currentTime = 0;
      instance.playing = false;
    }
  }

  /**
   * Play background music
   */
  static PlayMusic(musicId: string, volume: number = 0.5): void {
    if (SOUNDS._musicMuted) return;

    // Stop current music
    if (SOUNDS._currentMusic && SOUNDS._currentMusic !== musicId) {
      SOUNDS.StopMusic();
    }

    try {
      const url = SOUNDS.getMusicUrl(musicId);
      
      let instance = SOUNDS.music.get(musicId);
      
      if (!instance) {
        const audio = new Audio(url);
        instance = {
          audio,
          config: { volume, loop: true, url },
          playing: false
        };
        SOUNDS.music.set(musicId, instance);
      }

      instance.audio.volume = volume * SOUNDS._musicVolume;
      instance.audio.loop = true;
      instance.playing = true;
      SOUNDS._currentMusic = musicId;

      instance.audio.play().catch(e => {
        console.warn('[SOUNDS] Failed to play music:', musicId, e);
      });
    } catch (e) {
      console.warn('[SOUNDS] Error playing music:', musicId, e);
    }
  }

  /**
   * Stop background music
   */
  static StopMusic(): void {
    if (SOUNDS._currentMusic) {
      const instance = SOUNDS.music.get(SOUNDS._currentMusic);
      if (instance) {
        instance.audio.pause();
        instance.audio.currentTime = 0;
        instance.playing = false;
      }
      SOUNDS._currentMusic = null;
    }
  }

  /**
   * Tick function for audio updates
   */
  static Tick(): void {
    // Perform any per-frame audio updates
  }

  /**
   * Set sound volume
   */
  static SetSoundVolume(volume: number): void {
    SOUNDS._soundVolume = Math.max(0, Math.min(1, volume));
    Storage.set('bymr_sound_volume', SOUNDS._soundVolume);
    
    // Update all playing sounds
    SOUNDS.sounds.forEach(instance => {
      if (instance.playing) {
        instance.audio.volume = instance.config.volume * SOUNDS._soundVolume;
      }
    });
  }

  /**
   * Set music volume
   */
  static SetMusicVolume(volume: number): void {
    SOUNDS._musicVolume = Math.max(0, Math.min(1, volume));
    Storage.set('bymr_music_volume', SOUNDS._musicVolume);
    
    // Update current music
    if (SOUNDS._currentMusic) {
      const instance = SOUNDS.music.get(SOUNDS._currentMusic);
      if (instance) {
        instance.audio.volume = instance.config.volume * SOUNDS._musicVolume;
      }
    }
  }

  /**
   * Toggle sound mute
   */
  static ToggleSound(): void {
    SOUNDS._soundMuted = !SOUNDS._soundMuted;
    Storage.set('bymr_sound_muted', SOUNDS._soundMuted);
    
    if (SOUNDS._soundMuted) {
      // Stop all playing sounds
      SOUNDS.sounds.forEach(instance => {
        if (instance.playing) {
          instance.audio.pause();
        }
      });
    }
  }

  /**
   * Toggle music mute
   */
  static ToggleMusic(): void {
    SOUNDS._musicMuted = !SOUNDS._musicMuted;
    Storage.set('bymr_music_muted', SOUNDS._musicMuted);
    
    if (SOUNDS._musicMuted) {
      SOUNDS.StopMusic();
    } else if (SOUNDS._currentMusic) {
      SOUNDS.PlayMusic(SOUNDS._currentMusic);
    }
  }

  /**
   * Get sound URL
   */
  private static getSoundUrl(soundId: string): string {
    return `${SOUNDS._soundPath}${soundId}.mp3`;
  }

  /**
   * Get music URL
   */
  private static getMusicUrl(musicId: string): string {
    return `${SOUNDS._soundPath}${musicId}.mp3`;
  }

  /**
   * Check if sound is muted
   */
  static get soundMuted(): boolean {
    return SOUNDS._soundMuted;
  }

  /**
   * Check if music is muted
   */
  static get musicMuted(): boolean {
    return SOUNDS._musicMuted;
  }

  /**
   * Get sound volume
   */
  static get soundVolume(): number {
    return SOUNDS._soundVolume;
  }

  /**
   * Get music volume
   */
  static get musicVolume(): number {
    return SOUNDS._musicVolume;
  }

  /**
   * Preload sounds
   */
  static Preload(soundIds: string[]): void {
    for (const id of soundIds) {
      const url = SOUNDS.getSoundUrl(id);
      const audio = new Audio();
      audio.preload = 'auto';
      audio.src = url;
      
      SOUNDS.sounds.set(id, {
        audio,
        config: { volume: 1.0, loop: false, url },
        playing: false
      });
    }
  }
}

export default SOUNDS;
