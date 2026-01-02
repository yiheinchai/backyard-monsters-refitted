/**
 * Network API client for communicating with the game server
 * Ported from ActionScript URLLoaderApi.as
 */

import { CONFIG } from '../core/config';

export interface ApiResponse {
  error?: number | string;
  [key: string]: unknown;
}

export interface LoginResponse extends ApiResponse {
  userid: number;
  username: string;
  last_name?: string;
  pic_square?: string;
  timeplayed: number;
  email?: string;
  friendcount: number;
  sessioncount: number;
  addtime: number;
  mapversion: number;
  mailversion: number;
  soundversion: number;
  languageversion: number;
  app_id?: string;
  tpid?: string;
  currency_url?: string;
  bookmarks?: object;
  settings?: object;
  stats?: {
    inferno?: number;
  };
  version: number;
  token?: string;
  credits?: number;
}

export interface BaseLoadResponse extends ApiResponse {
  baseid: number;
  userid: number;
  type: number;
  createtime: number;
  savetime: number;
  saveuserid: number;
  basename?: string;
  baseseed: number;
  level: number;
  points: number;
  basevalue: number;
  buildingdata: object;
  buildingresources: object;
  buildinghealthdata?: object;
  resources: {
    r1: number;
    r2: number;
    r3: number;
    r4: number;
  };
  credits: number;
  protected?: number;
  attackerarray?: unknown[];
  monsters?: object;
  academy?: object;
  champion?: object;
  lockerdata?: object;
  buildinglootdata?: object;
  attackid?: number;
  wmid?: number;
  catapult?: number;
  flinger?: number;
  flags?: object;
  storedbuildings?: object;
  homebase?: number;
  iresources?: object;
  purchasedunused?: unknown[];
  krallen?: object;
  frontpage?: object;
  siegeweapons?: object;
  stats?: object;
  rewards?: object;
  buff?: object;
  upgradedbuildings?: object;
  storeitems?: unknown[];
}

export interface NewMapResponse extends ApiResponse {
  newmap: boolean;
  mapheaderurl?: string;
}

export class NetworkManager {
  private static instance: NetworkManager;
  private baseUrl: string;
  private apiUrl: string;
  private token: string | null = null;

  private constructor() {
    this.baseUrl = CONFIG.SERVER_URL;
    this.apiUrl = `${this.baseUrl}api/${CONFIG.API_VERSION}/`;
  }

  static getInstance(): NetworkManager {
    if (!NetworkManager.instance) {
      NetworkManager.instance = new NetworkManager();
    }
    return NetworkManager.instance;
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

  private buildFormData(params: Record<string, unknown>): FormData {
    const formData = new FormData();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    }
    // Add token if available
    const token = this.getToken();
    if (token && !params['token']) {
      formData.append('token', token);
    }
    return formData;
  }

  private async request<T extends ApiResponse>(
    url: string,
    params: Record<string, unknown> = {},
    method: 'GET' | 'POST' = 'POST'
  ): Promise<T> {
    try {
      const options: RequestInit = {
        method,
        credentials: 'include',
      };

      if (method === 'POST') {
        options.body = this.buildFormData(params);
      } else if (Object.keys(params).length > 0) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value));
          }
        }
        url += '?' + searchParams.toString();
      }

      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as T;
    } catch (error) {
      console.error('Network request failed:', error);
      throw error;
    }
  }

  // === Public API Methods ===

  /**
   * Initialize connection to server
   */
  async init(): Promise<ApiResponse> {
    return this.request(`${this.baseUrl}init`, {
      apiVersion: CONFIG.API_VERSION,
    });
  }

  /**
   * Check server connection
   */
  async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}connection`, {
        method: 'GET',
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Get new map info
   */
  async getNewMap(): Promise<NewMapResponse> {
    return this.request(`${this.apiUrl}bm/getnewmap`);
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    return this.request(`${this.apiUrl}player/getinfo`, {
      email,
      password,
      version: CONFIG.VERSION,
    });
  }

  /**
   * Register a new account
   */
  async register(username: string, email: string, password: string): Promise<LoginResponse> {
    return this.request(`${this.apiUrl}player/register`, {
      username,
      email,
      password,
    });
  }

  /**
   * Load base data
   */
  async loadBase(
    baseid?: number,
    userid?: number,
    type?: number
  ): Promise<BaseLoadResponse> {
    return this.request(`${this.baseUrl}base/load`, {
      baseid: baseid ?? 0,
      userid: userid ?? 0,
      type: type ?? 0,
      version: CONFIG.VERSION,
    });
  }

  /**
   * Save base data
   */
  async saveBase(data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request(`${this.baseUrl}base/save`, {
      ...data,
      version: CONFIG.VERSION,
    });
  }

  /**
   * Load Inferno base
   */
  async loadInfernoBase(
    baseid?: number,
    userid?: number,
    type?: number
  ): Promise<BaseLoadResponse> {
    return this.request(`${this.apiUrl}bm/base/load`, {
      baseid: baseid ?? 0,
      userid: userid ?? 0,
      type: type ?? 0,
      version: CONFIG.VERSION,
    });
  }

  /**
   * Save Inferno base
   */
  async saveInfernoBase(data: Record<string, unknown>): Promise<ApiResponse> {
    return this.request(`${this.apiUrl}bm/base/save`, {
      ...data,
      version: CONFIG.VERSION,
    });
  }

  /**
   * Get world map area (v2)
   */
  async getMapArea(x: number, y: number): Promise<ApiResponse> {
    return this.request(`${this.baseUrl}worldmapv2/getarea`, {
      x,
      y,
    });
  }

  /**
   * Get world map cells (v3)
   */
  async getMapCells(cells: number[]): Promise<ApiResponse> {
    return this.request(`${this.baseUrl}worldmapv3/getcells`, {
      cells: JSON.stringify(cells),
    });
  }

  /**
   * Get supported languages
   */
  async getSupportedLanguages(): Promise<ApiResponse> {
    return this.request(`${this.apiUrl}supportedLangs`, {}, 'GET');
  }

  /**
   * Load language file
   */
  async loadLanguageFile(language: string): Promise<Record<string, string>> {
    try {
      const response = await fetch(`${CONFIG.CDN_URL}gamestage/assets/language_${language}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load language file: ${language}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to load language file:', error);
      throw error;
    }
  }

  /**
   * Get yard planner templates
   */
  async getYardPlannerTemplates(): Promise<ApiResponse> {
    return this.request(`${this.apiUrl}bm/yardplanner/gettemplates`, {}, 'GET');
  }

  /**
   * Save yard planner template
   */
  async saveYardPlannerTemplate(templateData: object): Promise<ApiResponse> {
    return this.request(`${this.apiUrl}bm/yardplanner/savetemplate`, {
      template: JSON.stringify(templateData),
    });
  }

  /**
   * Get world map data
   */
  async getWorldMap(x: number, y: number, width: number, height: number): Promise<{
    cells: Array<{
      x: number;
      y: number;
      uid?: number;
      username?: string;
      level?: number;
      baseValue?: number;
      protected?: boolean;
      terrainType: number;
    }>;
    playerX?: number;
    playerY?: number;
  }> {
    try {
      const response = await this.request(`${this.baseUrl}worldmapv2/getarea`, {
        x,
        y,
        width,
        height,
      });
      return response as {
        cells: Array<{
          x: number;
          y: number;
          uid?: number;
          username?: string;
          level?: number;
          baseValue?: number;
          protected?: boolean;
          terrainType: number;
        }>;
        playerX?: number;
        playerY?: number;
      };
    } catch {
      // Return empty response on error
      return { cells: [] };
    }
  }
}

// Export singleton instance
export const network = NetworkManager.getInstance();
