/**
 * KEYS - Language and localization system for the Backyard Monsters client
 * This is the TypeScript equivalent of KEYS.as
 */

import { GLOBAL } from '@/core/Global';
import { API } from '@/network/API';

export interface LanguageData {
  [key: string]: string;
}

export interface SupportedLanguage {
  id: string;
  name: string;
  code: string;
}

/**
 * KEYS class - manages language strings and localization
 */
export class KEYS {
  // Event constants
  static readonly LANGUAGE_FILE_LOADED = 'languageFileLoaded';
  static readonly SUPPORTED_LANGS_LOADED = 'supportedLangsLoaded';

  // Storage URL for language files
  static _storageURL: string = '';

  // Current language
  private static _currentLanguage: string = 'english';
  
  // Language data store
  private static _languageData: LanguageData = {};
  
  // Supported languages
  private static _supportedLanguages: SupportedLanguage[] = [];
  
  // Loading state
  private static _loading: boolean = false;
  private static _loaded: boolean = false;

  /**
   * Setup the language system with a specific language
   */
  static async Setup(language: string = 'english'): Promise<void> {
    KEYS._currentLanguage = language;
    await KEYS.LoadLanguageFile(language);
  }

  /**
   * Load the language file for a specific language
   */
  static async LoadLanguageFile(language: string): Promise<void> {
    if (KEYS._loading) return;
    
    KEYS._loading = true;
    
    try {
      // Construct the URL for the language file
      const url = KEYS._storageURL 
        ? `${KEYS._storageURL}text_${language}.txt`
        : `/assets/text_${language}.txt`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to load language file: ${response.statusText}`);
      }

      const text = await response.text();
      KEYS.ParseLanguageFile(text);
      
      KEYS._loaded = true;
      KEYS._loading = false;
      GLOBAL.textContentLoaded = true;
      
      // Dispatch event
      GLOBAL.eventDispatcher.dispatchEvent({ type: KEYS.LANGUAGE_FILE_LOADED });
    } catch (error) {
      console.error('[KEYS] Failed to load language file:', error);
      KEYS._loading = false;
      
      // Try loading default English if other language failed
      if (language !== 'english') {
        console.log('[KEYS] Falling back to English');
        await KEYS.LoadLanguageFile('english');
      }
    }
  }

  /**
   * Parse the language file content
   * Format is typically key=value pairs or a specific format
   */
  static ParseLanguageFile(content: string): void {
    KEYS._languageData = {};
    
    // Try to parse as JSON first
    try {
      const data = JSON.parse(content);
      if (typeof data === 'object') {
        KEYS._languageData = data;
        return;
      }
    } catch {
      // Not JSON, try other formats
    }

    // Parse as key=value pairs
    const lines = content.split('\n');
    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine || trimmedLine.startsWith('//') || trimmedLine.startsWith('#')) {
        continue; // Skip empty lines and comments
      }

      const equalIndex = trimmedLine.indexOf('=');
      if (equalIndex > 0) {
        const key = trimmedLine.substring(0, equalIndex).trim();
        const value = trimmedLine.substring(equalIndex + 1).trim();
        KEYS._languageData[key] = value;
      }
    }
  }

  /**
   * Get a localized string by key
   */
  static Get(key: string, defaultValue?: string): string {
    if (!key) return defaultValue || '';

    // Remove # markers if present (from ActionScript format)
    const cleanKey = key.replace(/#/g, '');
    
    // Look up the key
    if (KEYS._languageData[cleanKey]) {
      return KEYS._languageData[cleanKey];
    }
    
    // Try lowercase
    if (KEYS._languageData[cleanKey.toLowerCase()]) {
      return KEYS._languageData[cleanKey.toLowerCase()];
    }

    // Return the key itself or default value if not found
    return defaultValue || cleanKey;
  }

  /**
   * Get a localized string with variable substitution
   * Variables are in format {0}, {1}, etc.
   */
  static GetWithVars(key: string, ...vars: (string | number)[]): string {
    let text = KEYS.Get(key);
    
    for (let i = 0; i < vars.length; i++) {
      text = text.replace(new RegExp(`\\{${i}\\}`, 'g'), String(vars[i]));
    }
    
    return text;
  }

  /**
   * Check if a key exists
   */
  static Has(key: string): boolean {
    const cleanKey = key.replace(/#/g, '');
    return cleanKey in KEYS._languageData || cleanKey.toLowerCase() in KEYS._languageData;
  }

  /**
   * Set a language string (for runtime additions)
   */
  static Set(key: string, value: string): void {
    KEYS._languageData[key] = value;
  }

  /**
   * Get supported languages from server
   */
  static async GetSupportedLanguages(): Promise<void> {
    try {
      const url = GLOBAL._apiURL 
        ? `${GLOBAL._apiURL}supportedLangs`
        : `/api/${GLOBAL.apiVersionSuffix}/supportedLangs`;

      const response = await API.get<{ languages?: SupportedLanguage[] }>(url);
      
      if (response && response.languages) {
        KEYS._supportedLanguages = response.languages;
        GLOBAL.supportedLangsLoaded = true;
        GLOBAL.eventDispatcher.dispatchEvent({ type: KEYS.SUPPORTED_LANGS_LOADED });
      }
    } catch (error) {
      console.error('[KEYS] Failed to load supported languages:', error);
      
      // Set default languages
      KEYS._supportedLanguages = [
        { id: 'en', name: 'English', code: 'english' },
        { id: 'es', name: 'Spanish', code: 'spanish' },
        { id: 'fr', name: 'French', code: 'french' },
        { id: 'de', name: 'German', code: 'german' }
      ];
      GLOBAL.supportedLangsLoaded = true;
    }
  }

  /**
   * Get list of supported languages
   */
  static get supportedLanguages(): SupportedLanguage[] {
    return KEYS._supportedLanguages;
  }

  /**
   * Get current language
   */
  static get currentLanguage(): string {
    return KEYS._currentLanguage;
  }

  /**
   * Set current language and reload language file
   */
  static async setLanguage(language: string): Promise<void> {
    if (language !== KEYS._currentLanguage) {
      KEYS._currentLanguage = language;
      localStorage.setItem('bymr_language', language);
      await KEYS.LoadLanguageFile(language);
    }
  }

  /**
   * Check if language system is loaded
   */
  static get isLoaded(): boolean {
    return KEYS._loaded;
  }

  /**
   * Get all language data (for debugging)
   */
  static get allStrings(): LanguageData {
    return { ...KEYS._languageData };
  }
}

export default KEYS;
