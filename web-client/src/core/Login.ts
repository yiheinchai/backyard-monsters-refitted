/**
 * LOGIN - Authentication handling
 * Converted from ActionScript LOGIN.as
 */

import { GLOBAL } from '../core/Global';
import { apiClient } from '../api/ApiClient';
import { BaseMode, LoginResponse, PlayerData, YardType } from '../types/game';
import { SecNum } from '../utils/SecNum';
import { EventEmitter } from '../core/EventEmitter';

class LoginManager extends EventEmitter {
  // Player data
  _playerID: number = 0;
  _playerName: string = '';
  _playerLastName: string = '';
  _playerPic: string = '';
  _timePlayed: number = 0;
  _playerLevel: number = 0;
  _email: string = '';
  _proxymail: string = '';
  _settings: Record<string, unknown> = {};
  _digits: number[] = [];
  _sumdigit: number = 0;
  _inferno: number = 0;

  token: string = '';

  async login(): Promise<void> {
    // Check for stored token
    const storedToken = apiClient.getToken();
    
    if (storedToken) {
      // Try auto-login with stored token
      this.token = storedToken;
      this.emit('showLoading', 'Logging in...');
      
      try {
        const mapData = await apiClient.getNewMap();
        await this.onGetNewMap(mapData, [['token', storedToken]]);
      } catch (error) {
        console.error('Auto-login failed:', error);
        apiClient.clearToken();
        this.emit('showLoginForm');
      }
    } else {
      this.emit('showLoginForm');
    }
  }

  async loginWithCredentials(email: string, password: string): Promise<void> {
    this.emit('showLoading', 'Logging in...');

    try {
      const loginResponse = await apiClient.login(email, password, GLOBAL._version.Get());
      
      if (loginResponse.error && loginResponse.error !== 0) {
        this.emit('loginError', loginResponse.error);
        return;
      }

      // Store token
      if (loginResponse.token) {
        this.token = loginResponse.token;
        apiClient.setToken(loginResponse.token);
      }

      // Get map data and proceed
      const mapData = await apiClient.getNewMap();
      await this.onGetNewMap(mapData, [['token', this.token]]);
      
    } catch (error) {
      console.error('Login error:', error);
      this.emit('loginError', 'Failed to connect to server');
    }
  }

  async register(username: string, email: string, password: string): Promise<void> {
    this.emit('showLoading', 'Creating account...');

    try {
      const response = await apiClient.register(username, email, password);
      
      if (response.error && response.error !== 0) {
        this.emit('registerError', response.error);
        return;
      }

      // Now login with the new account
      await this.loginWithCredentials(username, password);
      
    } catch (error) {
      console.error('Registration error:', error);
      this.emit('registerError', 'Failed to create account');
    }
  }

  private async onGetNewMap(
    serverData: { newmap: boolean; mapheaderurl: string },
    authInfo: [string, string][]
  ): Promise<void> {
    const onMapRoom3 = serverData.newmap;
    const mapRoom3HeaderURL = serverData.mapheaderurl;

    // Store map room version info
    GLOBAL._mapVersion = onMapRoom3 ? 3 : 2;

    try {
      // Get player info
      const loginData = await this.fetchPlayerInfo(authInfo);
      this.process(loginData);
    } catch (error) {
      console.error('Failed to get player info:', error);
      this.emit('loginError', 'An error occurred during login');
    }
  }

  private async fetchPlayerInfo(authInfo: [string, string][]): Promise<LoginResponse> {
    const params: Record<string, string> = {
      version: GLOBAL._version.Get().toString(),
    };
    authInfo.forEach(([key, value]) => {
      params[key] = value;
    });

    // Direct fetch since we need custom params
    const formData = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      formData.append(key, value);
    });

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // Add token to Authorization header if we have one
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`/api/${GLOBAL.apiVersionSuffix}/player/getinfo`, {
      method: 'POST',
      headers,
      body: formData.toString(),
    });

    return response.json();
  }

  private process(serverData: LoginResponse): void {
    if (serverData.version !== GLOBAL._version.Get()) {
      this.handleVersionMismatch(serverData);
    } else {
      this.handleUserLogin(serverData);
    }
  }

  private handleVersionMismatch(serverData: LoginResponse): void {
    console.error('Version mismatch:', serverData.version, GLOBAL._version.Get());
    this.emit('loginError', 'Game client needs to be updated');
  }

  private handleUserLogin(serverData: LoginResponse): void {
    // Store the new token if provided (important for auto-login flow)
    if (serverData.token) {
      this.token = serverData.token;
      apiClient.setToken(serverData.token);
    }

    // Create player data
    const player: PlayerData = {
      id: serverData.userid,
      name: serverData.username,
      lastName: serverData.last_name,
      picture: serverData.pic_square,
      timePlayed: serverData.timeplayed,
      email: serverData.email,
      level: 0,
      isAttacking: false,
    };

    GLOBAL.player = player;

    // Store login data
    this._playerID = serverData.userid;
    this._playerName = serverData.username;
    this._playerLastName = serverData.last_name;
    this._playerPic = serverData.pic_square;
    this._timePlayed = serverData.timeplayed;
    this._email = serverData.email;

    if (serverData.stats?.inferno !== undefined) {
      this._inferno = serverData.stats.inferno;
    }

    // Global settings
    GLOBAL._friendCount = serverData.friendcount;
    GLOBAL._sessionCount = serverData.sessioncount;
    GLOBAL._addTime = serverData.addtime;
    GLOBAL._mapVersion = serverData.mapversion;
    GLOBAL._mailVersion = serverData.mailversion;
    GLOBAL._soundVersion = serverData.soundversion;
    GLOBAL._languageVersion = serverData.languageversion || 8;
    GLOBAL._appid = serverData.app_id;
    GLOBAL._tpid = serverData.tpid;
    GLOBAL._currencyURL = serverData.currency_url;

    if (serverData.settings) {
      this._settings = serverData.settings;
    }

    if (serverData.proxy_email) {
      this._proxymail = serverData.proxy_email;
    }

    // Calculate digits for various calculations
    this.calculateDigits(this._playerID);

    // Login complete, proceed to game
    this.done();
  }

  private calculateDigits(playerId: number): void {
    const idStr = playerId.toString();
    this._digits = [];
    
    for (let i = 0; i < idStr.length; i++) {
      this._digits.push(parseInt(idStr.charAt(i), 10));
    }

    this._sumdigit = 0;
    if (this._digits.length >= 3) {
      const sum = this._digits[this._digits.length - 1] +
                  this._digits[this._digits.length - 2] +
                  this._digits[this._digits.length - 3];
      const sumStr = sum.toString();
      this._sumdigit = parseInt(sumStr.substr(sumStr.length - 1, 1), 10);
    }
  }

  private done(): void {
    // Setup global state
    GLOBAL.setup();

    // Initialize resources
    for (let i = 1; i <= 4; i++) {
      GLOBAL._resources[`r${i}`] = new SecNum(0);
      GLOBAL._hpResources[`r${i}`] = 0;
    }

    // Emit login success
    this.emit('loginSuccess', {
      playerId: this._playerID,
      playerName: this._playerName,
    });
  }

  logout(): void {
    apiClient.clearToken();
    this.token = '';
    this._playerID = 0;
    this._playerName = '';
    GLOBAL.player = null;
    this.emit('logout');
  }
}

export const LOGIN = new LoginManager();
