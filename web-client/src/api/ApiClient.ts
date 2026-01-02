/**
 * API Client for communicating with the Backyard Monsters server
 * Converted from ActionScript URLLoaderApi.as
 */

import { 
  ServerInitResponse, 
  LoginResponse, 
  BaseLoadResponse, 
  SaveResponse 
} from '../types/game';

export class ApiClient {
  private serverUrl: string;
  private apiVersionSuffix: string;
  private token: string | null = null;

  constructor(serverUrl: string = '', apiVersionSuffix: string = 'v1.4.3-beta') {
    // If running from Vite dev server, use proxy (empty string for same-origin)
    this.serverUrl = serverUrl;
    this.apiVersionSuffix = apiVersionSuffix;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('bymr_token', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('bymr_token');
    }
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('bymr_token');
  }

  private async request<T>(
    endpoint: string, 
    method: string = 'GET', 
    data?: Record<string, unknown>,
    includeToken: boolean = true  // Default to including token for protected routes
  ): Promise<T> {
    const url = `${this.serverUrl}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // Add Authorization header if we have a token
    if (includeToken && this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    // Build form data
    const formData = new URLSearchParams();
    if (data) {
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, String(value));
      });
    }

    const options: RequestInit = {
      method,
      headers,
      body: method !== 'GET' ? formData.toString() : undefined,
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Initialize connection to server
   */
  async init(apiVersion: string = 'v1.4.3-beta'): Promise<ServerInitResponse> {
    return this.request<ServerInitResponse>('/init', 'POST', { apiVersion }, false);
  }

  /**
   * Check network connection
   */
  async checkConnection(): Promise<boolean> {
    try {
      await fetch(`${this.serverUrl}/connection`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get new map room data
   */
  async getNewMap(): Promise<{ newmap: boolean; mapheaderurl: string }> {
    return this.request(`/api/${this.apiVersionSuffix}/bm/getnewmap`, 'POST', {}, true);
  }

  /**
   * Login to the game
   */
  async login(email: string, password: string, version: number = 128): Promise<LoginResponse> {
    return this.request<LoginResponse>(
      `/api/${this.apiVersionSuffix}/player/getinfo`,
      'POST',
      {
        email,
        password,
        version,
      },
      false  // Don't include token for login
    );
  }

  /**
   * Register a new account
   */
  async register(username: string, email: string, password: string): Promise<{ error: number | string; token?: string }> {
    return this.request(
      `/api/${this.apiVersionSuffix}/player/register`,
      'POST',
      {
        username,
        email,
        password,
      },
      false  // Don't include token for registration
    );
  }

  /**
   * Load base data
   */
  async loadBase(
    baseId?: number,
    userId?: number,
    mode: string = 'build',
    _yardType: number = 0
  ): Promise<BaseLoadResponse> {
    return this.request<BaseLoadResponse>('/base/load', 'POST', {
      baseid: baseId || 0,
      userid: userId || 0,
      type: mode,  // Server expects 'type' to be the mode string (build, attack, etc.)
    });
  }

  /**
   * Save base data
   */
  async saveBase(
    baseId: number,
    buildingData: string,
    monsterData: string,
    resources: Record<string, number>,
    otherStats?: Record<string, unknown>
  ): Promise<SaveResponse> {
    return this.request<SaveResponse>('/base/save', 'POST', {
      token: this.token || '',
      baseid: baseId,
      buildingdata: buildingData,
      monsterdata: monsterData,
      r1: resources.r1,
      r2: resources.r2,
      r3: resources.r3,
      r4: resources.r4,
      credits: resources.credits || 0,
      otherstats: otherStats ? JSON.stringify(otherStats) : '{}',
    });
  }

  /**
   * Update saved state
   */
  async updateSaved(saveId: number): Promise<{ error?: number | string }> {
    return this.request('/base/updatesaved', 'POST', {
      token: this.token || '',
      saveid: saveId,
    });
  }

  /**
   * Get world map cells (v2)
   */
  async getMapArea(x: number, y: number, width: number, height: number): Promise<unknown> {
    return this.request('/worldmapv2/getarea', 'POST', {
      token: this.token || '',
      x,
      y,
      w: width,
      h: height,
    });
  }

  /**
   * Get world map cells (v3)
   */
  async getMapCells(cells: { x: number; y: number }[]): Promise<unknown> {
    return this.request('/worldmapv3/getcells', 'POST', {
      token: this.token || '',
      cells: JSON.stringify(cells),
    });
  }

  /**
   * Initialize world map (v3)
   */
  async initWorldMap(): Promise<unknown> {
    return this.request('/worldmapv3/initworldmap', 'POST', {
      token: this.token || '',
    });
  }

  /**
   * Set map version
   */
  async setMapVersion(version: number): Promise<{ error?: number | string }> {
    return this.request('/worldmapv3/setmapversion', 'POST', {
      token: this.token || '',
      version,
    });
  }

  /**
   * Get supported languages
   */
  async getSupportedLanguages(): Promise<string[]> {
    return this.request(`/api/${this.apiVersionSuffix}/supportedLangs`, 'GET');
  }

  /**
   * Load language file
   */
  async loadLanguage(language: string): Promise<Record<string, string>> {
    const response = await fetch(`${this.serverUrl}/gamestage/assets/languages/${language}.txt`);
    const text = await response.text();
    
    // Parse the language file (key=value format)
    const translations: Record<string, string> = {};
    text.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        translations[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return translations;
  }

  /**
   * Get yard planner templates
   */
  async getTemplates(): Promise<unknown> {
    return this.request(`/api/${this.apiVersionSuffix}/bm/yardplanner/gettemplates`, 'GET', {
      token: this.token || '',
    });
  }

  /**
   * Save yard planner template
   */
  async saveTemplate(name: string, data: string): Promise<{ error?: number | string }> {
    return this.request(`/api/${this.apiVersionSuffix}/bm/yardplanner/savetemplate`, 'POST', {
      token: this.token || '',
      name,
      data,
    });
  }
}

// Singleton instance
export const apiClient = new ApiClient();
