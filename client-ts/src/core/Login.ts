/**
 * LOGIN - Authentication system for the Backyard Monsters client
 * This is the TypeScript equivalent of LOGIN.as
 */

import { GLOBAL } from '@/core/Global';
import { KEYS } from '@/core/Keys';
import { API } from '@/network/API';
import { SecNum, Storage } from '@/utils';
import { LoginResponse, NewMapResponse } from '@/types';

/**
 * LOGIN class - handles user authentication and session management
 */
export class LOGIN {
  // Player data
  static _playerID: number = 0;
  static _playerName: string = '';
  static _playerLastName: string = '';
  static _playerPic: string = '';
  static _timePlayed: number = 0;
  static _playerLevel: number = 0;
  static _email: string = '';
  static _proxymail: string = '';
  static _settings: Record<string, unknown> = {};
  static _digits: number[] = [];
  static _sumdigit: number = 0;
  static _inferno: number = 0;

  // Auth token
  static token: string = '';

  /**
   * Start the login process
   */
  static async Login(): Promise<void> {
    // Check for existing token
    const storedToken = Storage.get<string>('bymr_token');
    
    if (storedToken) {
      LOGIN.token = storedToken;
      GLOBAL.WaitShow('Logging in...');
      
      // Wait for language file to load
      GLOBAL.eventDispatcher.addEventListener(KEYS.LANGUAGE_FILE_LOADED, LOGIN.onLanguageLoaded);
      GLOBAL.LanguageSetup();
    } else {
      // Show auth form
      LOGIN.showAuthForm();
    }
  }

  /**
   * Show the authentication form
   */
  private static showAuthForm(): void {
    const authContainer = document.getElementById('auth-container');
    const loadingScreen = document.getElementById('loading-screen');
    
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
    
    if (authContainer) {
      authContainer.classList.remove('hidden');
      LOGIN.setupAuthFormHandlers();
    }
  }

  /**
   * Setup auth form event handlers
   */
  private static setupAuthFormHandlers(): void {
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const showRegister = document.getElementById('show-register');
    const showLogin = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (showRegister) {
      showRegister.onclick = () => {
        loginForm?.classList.add('hidden');
        registerForm?.classList.remove('hidden');
      };
    }

    if (showLogin) {
      showLogin.onclick = () => {
        registerForm?.classList.add('hidden');
        loginForm?.classList.remove('hidden');
      };
    }

    if (loginBtn) {
      loginBtn.onclick = () => LOGIN.handleLogin();
    }

    if (registerBtn) {
      registerBtn.onclick = () => LOGIN.handleRegister();
    }

    // Enter key handlers
    document.getElementById('login-password')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') LOGIN.handleLogin();
    });

    document.getElementById('register-confirm')?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') LOGIN.handleRegister();
    });
  }

  /**
   * Handle login form submission
   */
  private static async handleLogin(): Promise<void> {
    const username = (document.getElementById('login-username') as HTMLInputElement)?.value;
    const password = (document.getElementById('login-password') as HTMLInputElement)?.value;
    const errorDiv = document.getElementById('login-error');

    if (!username || !password) {
      if (errorDiv) {
        errorDiv.textContent = 'Please enter username and password';
        errorDiv.classList.add('visible');
      }
      return;
    }

    try {
      const response = await API.load<LoginResponse>(
        `${GLOBAL._apiURL || '/api/' + GLOBAL.apiVersionSuffix + '/'}player/getinfo`,
        [
          ['username', username],
          ['password', password],
          ['version', GLOBAL._version.Get()]
        ]
      );

      if (response) {
        if (response.error && response.error !== 0) {
          if (errorDiv) {
            errorDiv.textContent = String(response.error);
            errorDiv.classList.add('visible');
          }
          return;
        }

        // Store token and process login
        if (response.token) {
          LOGIN.token = response.token;
          Storage.set('bymr_token', response.token);
          LOGIN.Process(response);
        }
      }
    } catch (error) {
      if (errorDiv) {
        errorDiv.textContent = 'Login failed. Please try again.';
        errorDiv.classList.add('visible');
      }
    }
  }

  /**
   * Handle register form submission
   */
  private static async handleRegister(): Promise<void> {
    const username = (document.getElementById('register-username') as HTMLInputElement)?.value;
    const email = (document.getElementById('register-email') as HTMLInputElement)?.value;
    const password = (document.getElementById('register-password') as HTMLInputElement)?.value;
    const confirm = (document.getElementById('register-confirm') as HTMLInputElement)?.value;
    const errorDiv = document.getElementById('register-error');

    if (!username || !email || !password || !confirm) {
      if (errorDiv) {
        errorDiv.textContent = 'Please fill in all fields';
        errorDiv.classList.add('visible');
      }
      return;
    }

    if (password !== confirm) {
      if (errorDiv) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.classList.add('visible');
      }
      return;
    }

    try {
      const response = await API.load<{ error: number | string; message?: string }>(
        `${GLOBAL._apiURL || '/api/' + GLOBAL.apiVersionSuffix + '/'}player/register`,
        [
          ['username', username],
          ['email', email],
          ['password', password]
        ]
      );

      if (response) {
        if (response.error && response.error !== 0) {
          if (errorDiv) {
            errorDiv.textContent = String(response.error);
            errorDiv.classList.add('visible');
          }
          return;
        }

        // Registration successful, show login form
        const registerForm = document.getElementById('register-form');
        const loginForm = document.getElementById('login-form');
        
        registerForm?.classList.add('hidden');
        loginForm?.classList.remove('hidden');
        
        // Pre-fill username
        const loginUsername = document.getElementById('login-username') as HTMLInputElement;
        if (loginUsername) {
          loginUsername.value = username;
        }
      }
    } catch (error) {
      if (errorDiv) {
        errorDiv.textContent = 'Registration failed. Please try again.';
        errorDiv.classList.add('visible');
      }
    }
  }

  /**
   * Handler for when language file is loaded
   */
  private static async onLanguageLoaded(): Promise<void> {
    GLOBAL.eventDispatcher.removeEventListener(KEYS.LANGUAGE_FILE_LOADED, LOGIN.onLanguageLoaded);

    // Get map info
    const response = await API.load<NewMapResponse>(
      `${GLOBAL._apiURL || '/api/' + GLOBAL.apiVersionSuffix + '/'}bm/getnewmap`,
      null
    );

    if (response) {
      LOGIN.OnGetNewMap(response);
    }
  }

  /**
   * Handle new map response
   */
  static OnGetNewMap(serverData: NewMapResponse): void {
    LOGIN._Login(serverData.newmap, serverData.mapheaderurl);
  }

  /**
   * Main login flow
   */
  private static async _Login(_newMap: boolean, _mapHeaderUrl: string): Promise<void> {
    // TODO: Initialize MapRoomManager with map data
    // MapRoomManager.instance.init(newMap, mapHeaderUrl);

    const response = await API.load<LoginResponse>(
      `${GLOBAL._apiURL || '/api/' + GLOBAL.apiVersionSuffix + '/'}player/getinfo`,
      [
        ['token', LOGIN.token],
        ['version', GLOBAL._version.Get()]
      ]
    );

    if (response) {
      if (response.error && response.error !== 0) {
        GLOBAL.Message(String(response.error));
        return;
      }

      if (response.token) {
        LOGIN.token = response.token;
        Storage.set('bymr_token', response.token);
      }
      
      LOGIN.Process(response);
    }
  }

  /**
   * Process login response
   */
  static Process(serverData: LoginResponse): void {
    if (serverData.version && serverData.version !== GLOBAL._version.Get()) {
      LOGIN.handleVersionMismatch(serverData);
    } else {
      LOGIN.handleUserLogin(serverData);
    }
  }

  /**
   * Handle successful user login
   */
  private static handleUserLogin(serverData: LoginResponse): void {
    // Hide auth form
    const authContainer = document.getElementById('auth-container');
    if (authContainer) {
      authContainer.classList.add('hidden');
    }

    // Populate player data
    if (serverData) {
      LOGIN._playerID = serverData.userid || 0;
      LOGIN._playerName = serverData.username || '';
      LOGIN._playerLastName = serverData.last_name || '';
      LOGIN._playerPic = serverData.pic_square || '';
      LOGIN._timePlayed = serverData.timeplayed || 0;
      LOGIN._email = serverData.email || '';

      if (serverData.stats?.inferno !== undefined) {
        LOGIN._inferno = serverData.stats.inferno;
      }

      GLOBAL._friendCount = serverData.friendcount || 0;
      GLOBAL._sessionCount = serverData.sessioncount || 0;
      GLOBAL._addTime = serverData.addtime || 0;
      GLOBAL._mapVersion = serverData.mapversion || 0;
      GLOBAL._mailVersion = serverData.mailversion || 0;
      GLOBAL._soundVersion = serverData.soundversion || 0;
      GLOBAL._languageVersion = serverData.languageversion || 0;
      GLOBAL._appid = serverData.app_id || '';
      GLOBAL._tpid = serverData.tpid || '';
      GLOBAL._currencyURL = serverData.currency_url || '';

      if (serverData.settings) {
        LOGIN._settings = serverData.settings as Record<string, unknown>;
      }

      if (serverData.proxy_email) {
        LOGIN._proxymail = serverData.proxy_email;
      }

      if (!serverData.languageversion) {
        GLOBAL._languageVersion = 8;
      }

      // Calculate digits
      LOGIN.Digits(LOGIN._playerID);

      // Continue to game
      LOGIN.Done();
    }
  }

  /**
   * Handle version mismatch
   */
  private static handleVersionMismatch(_serverData: LoginResponse): void {
    GLOBAL.errorMessage(
      KEYS.Get('msg_updatedgame') || 'Game has been updated. Please refresh.',
      GLOBAL.ERROR_ORANGE_BOX_ONLY
    );
  }

  /**
   * Calculate digit sum for player ID
   */
  static Digits(playerId: number): void {
    const idString = playerId.toString();
    LOGIN._digits = [];
    
    for (let i = 0; i < idString.length; i++) {
      LOGIN._digits.push(parseInt(idString.charAt(i), 10));
    }

    LOGIN._sumdigit = 0;
    if (LOGIN._digits.length >= 3) {
      const sum = LOGIN._digits[LOGIN._digits.length - 1] +
                  LOGIN._digits[LOGIN._digits.length - 2] +
                  LOGIN._digits[LOGIN._digits.length - 3];
      const sumStr = sum.toString();
      LOGIN._sumdigit = parseInt(sumStr.substr(sumStr.length - 1, 1), 10);
    }
  }

  /**
   * Complete login and start game
   */
  static Done(): void {
    GLOBAL.Setup();
    
    // Initialize resources
    for (let i = 1; i < 5; i++) {
      GLOBAL._resources['r' + i] = new SecNum(0);
      GLOBAL._hpResources['r' + i] = 0;
    }

    // Load base
    import('@/game/Base').then(({ BASE }) => {
      BASE.Load();
    });
  }

  /**
   * Logout and clear session
   */
  static Logout(): void {
    LOGIN.token = '';
    LOGIN._playerID = 0;
    LOGIN._playerName = '';
    
    Storage.remove('bymr_token');
    Storage.remove('bymr_language');
    
    // Reload page
    window.location.reload();
  }

  /**
   * Get salt for hash verification (from ActionScript)
   */
  static getSalt(): string {
    return LOGIN.decodeSalt('84V37530976X4W7175W9Z02U3483Y6VW');
  }

  /**
   * Decode salt (from ActionScript)
   */
  static decodeSalt(encoded: string): string {
    let result = '';
    const mapping: Record<string, string> = {
      'a': 'Z', 'b': 'Y', 'c': 'X', 'd': 'W', 'e': 'V', 'f': 'U', 'g': 'T',
      'h': 'S', 'i': 'R', 'j': 'Q', 'k': 'P', 'l': 'O', 'm': 'N', 'n': 'M',
      'o': 'L', 'p': 'K', 'q': 'J', 'r': 'I', 's': 'H', 't': 'G', 'u': 'F',
      'v': 'E', 'w': 'D', 'x': 'C', 'y': 'B', 'z': 'A',
      'A': 'z', 'B': 'y', 'C': 'x', 'D': 'w', 'E': 'v', 'F': 'u', 'G': 't',
      'H': 's', 'I': 'r', 'J': 'q', 'K': 'p', 'L': 'o', 'M': 'n', 'N': 'm',
      'O': 'l', 'P': 'k', 'Q': 'j', 'R': 'i', 'S': 'h', 'T': 'g', 'U': 'f',
      'V': 'e', 'W': 'd', 'X': 'c', 'Y': 'b', 'Z': 'a',
      '0': '9', '1': '8', '2': '7', '3': '6', '4': '5',
      '5': '4', '6': '3', '7': '2', '8': '1', '9': '0'
    };

    for (let i = 0; i < encoded.length; i++) {
      const char = encoded.charAt(i);
      result += mapping[char] || char;
    }

    return result;
  }

  /**
   * Get num for hash verification
   */
  static getNum(num: number): number {
    return num * (num % 11);
  }
}

export default LOGIN;
