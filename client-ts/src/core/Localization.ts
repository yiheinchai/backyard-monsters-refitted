/**
 * Localization/Keys Manager
 * Ported from ActionScript KEYS.as
 * Handles loading and retrieving localized strings
 */

import { network } from '../network/NetworkManager';
import { globalEvents } from '../utils/EventEmitter';
import { GAME_EVENTS } from '../core/config';

export interface LanguageInfo {
  code: string;
  name: string;
}

class LocalizationManager {
  private static instance: LocalizationManager;
  private strings: Map<string, string> = new Map();
  private currentLanguage: string = 'english';
  private supportedLanguages: LanguageInfo[] = [];
  private isLoaded: boolean = false;

  private constructor() {}

  static getInstance(): LocalizationManager {
    if (!LocalizationManager.instance) {
      LocalizationManager.instance = new LocalizationManager();
    }
    return LocalizationManager.instance;
  }

  /**
   * Get current language
   */
  getLanguage(): string {
    return this.currentLanguage;
  }

  /**
   * Check if language file is loaded
   */
  isLanguageLoaded(): boolean {
    return this.isLoaded;
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): LanguageInfo[] {
    return this.supportedLanguages;
  }

  /**
   * Load supported languages from server
   */
  async loadSupportedLanguages(): Promise<void> {
    try {
      const response = await network.getSupportedLanguages();
      if (response && !response.error && Array.isArray(response.languages)) {
        this.supportedLanguages = response.languages as LanguageInfo[];
      } else {
        // Default supported languages
        this.supportedLanguages = [
          { code: 'english', name: 'English' },
          { code: 'spanish', name: 'Español' },
          { code: 'french', name: 'Français' },
          { code: 'german', name: 'Deutsch' },
          { code: 'portuguese', name: 'Português' },
        ];
      }
      globalEvents.emit(GAME_EVENTS.LANGUAGES_LOADED, this.supportedLanguages);
    } catch (error) {
      console.warn('Failed to load supported languages, using defaults');
      this.supportedLanguages = [{ code: 'english', name: 'English' }];
    }
  }

  /**
   * Setup language from stored preference or default
   */
  async setup(language?: string): Promise<void> {
    // Try to get stored language preference
    if (!language) {
      language = localStorage.getItem('bymr_language') || 'english';
    }

    await this.loadLanguage(language);
  }

  /**
   * Load a language file
   */
  async loadLanguage(language: string): Promise<void> {
    this.currentLanguage = language;
    localStorage.setItem('bymr_language', language);

    try {
      const data = await network.loadLanguageFile(language);
      this.strings.clear();
      
      // Parse the language data
      for (const [key, value] of Object.entries(data)) {
        this.strings.set(key.toLowerCase(), value);
      }

      this.isLoaded = true;
      globalEvents.emit(GAME_EVENTS.LANGUAGE_LOADED, language);
    } catch (error) {
      console.error(`Failed to load language: ${language}`, error);
      
      // Try to fall back to English if not already trying
      if (language !== 'english') {
        console.log('Falling back to English...');
        await this.loadLanguage('english');
      } else {
        // Load default strings
        this.loadDefaultStrings();
        this.isLoaded = true;
        globalEvents.emit(GAME_EVENTS.LANGUAGE_LOADED, 'english');
      }
    }
  }

  /**
   * Load default English strings (fallback)
   */
  private loadDefaultStrings(): void {
    const defaults: Record<string, string> = {
      // Common UI
      'btn_ok': 'OK',
      'btn_cancel': 'Cancel',
      'btn_close': 'Close',
      'btn_yes': 'Yes',
      'btn_no': 'No',
      'btn_confirm': 'Confirm',
      'btn_back': 'Back',
      'btn_next': 'Next',
      'btn_save': 'Save',
      'btn_load': 'Load',
      'btn_help': 'Help',
      'btn_settings': 'Settings',
      
      // Loading/Waiting
      'wait_processing': 'Processing...',
      'wait_loading': 'Loading...',
      'wait_saving': 'Saving...',
      
      // Resources
      'r_twigs': 'Twigs',
      'r_pebbles': 'Pebbles',
      'r_putty': 'Putty',
      'r_goo': 'Goo',
      'r_shiny': 'Shiny',
      'r_time': 'Time',
      'r_bone': 'Bone',
      'r_coal': 'Coal',
      'r_sulfur': 'Sulfur',
      'r_magma': 'Magma',
      
      // Time
      'global_days': ' days',
      'global_day': ' day',
      'global_hours': ' hours',
      'global_hour': ' hour',
      'global_minutes': ' minutes',
      'global_minute': ' minute',
      'global_seconds': ' seconds',
      'global_second': ' second',
      'global_days_short': 'd',
      'global_hours_short': 'h',
      'global_minutes_short': 'm',
      'global_seconds_short': 's',
      
      // Buildings
      'building_townhall': 'Town Hall',
      'building_hatchery': 'Hatchery',
      'building_housing': 'Monster Housing',
      'building_silo': 'Silo',
      'building_harvester': 'Resource Gatherer',
      'building_flinger': 'Monster Flinger',
      'building_maproom': 'Map Room',
      'building_locker': 'Monster Locker',
      'building_academy': 'Monster Academy',
      'building_lab': 'Monster Lab',
      
      // Login
      'login_email': 'Email',
      'login_password': 'Password',
      'login_username': 'Username',
      'login_button': 'Login',
      'register_button': 'Register',
      
      // Errors
      'error_connection': 'Connection lost. Please check your internet.',
      'error_login': 'Login failed. Please check your credentials.',
      'error_generic': 'An error occurred. Please try again.',
      
      // Game messages
      'msg_updatedgame': 'The game has been updated. Please refresh.',
      'msg_welcome': 'Welcome to Backyard Monsters!',
    };

    for (const [key, value] of Object.entries(defaults)) {
      this.strings.set(key.toLowerCase(), value);
    }
  }

  /**
   * Get a localized string by key
   * Supports placeholder format: #key# or {key}
   */
  Get(key: string): string {
    // Remove # delimiters if present
    const cleanKey = key.replace(/^#|#$/g, '').toLowerCase();
    
    const value = this.strings.get(cleanKey);
    if (value !== undefined) {
      return value;
    }

    // Return the key itself if not found (useful for debugging)
    console.warn(`Missing localization key: ${key}`);
    return key;
  }

  /**
   * Get a localized string with variable substitution
   * Usage: GetWithVars('msg_level', { level: 5 }) => "You are level 5"
   */
  GetWithVars(key: string, vars: Record<string, string | number>): string {
    let text = this.Get(key);
    
    for (const [varName, value] of Object.entries(vars)) {
      // Replace {varName} or %varName%
      text = text.replace(new RegExp(`\\{${varName}\\}|%${varName}%`, 'gi'), String(value));
    }
    
    return text;
  }

  /**
   * Check if a key exists
   */
  has(key: string): boolean {
    const cleanKey = key.replace(/^#|#$/g, '').toLowerCase();
    return this.strings.has(cleanKey);
  }

  /**
   * Get all keys (for debugging)
   */
  getAllKeys(): string[] {
    return Array.from(this.strings.keys());
  }
}

// Export singleton instance
export const localization = LocalizationManager.getInstance();

// Convenience function
export function t(key: string, vars?: Record<string, string | number>): string {
  if (vars) {
    return localization.GetWithVars(key, vars);
  }
  return localization.Get(key);
}
