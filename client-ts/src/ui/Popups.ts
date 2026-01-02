/**
 * POPUPS - Popup management system for the Backyard Monsters client
 * This is the TypeScript equivalent of POPUPS.as
 */

import { GLOBAL } from '@/core/Global';
import { KEYS } from '@/core/Keys';

export interface PopupButton {
  text: string;
  callback?: () => void;
  primary?: boolean;
}

export interface PopupOptions {
  title?: string;
  message: string;
  buttons?: PopupButton[];
  closable?: boolean;
  modal?: boolean;
  width?: number;
  className?: string;
}

/**
 * POPUPS class - manages game popups
 */
export class POPUPS {
  private static activePopups: HTMLDivElement[] = [];
  private static popupContainer: HTMLDivElement | null = null;

  /**
   * Initialize popup system
   */
  static Setup(): void {
    if (!POPUPS.popupContainer) {
      POPUPS.popupContainer = document.createElement('div');
      POPUPS.popupContainer.id = 'popup-container';
      POPUPS.popupContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 5000;
      `;
      document.body.appendChild(POPUPS.popupContainer);
    }
  }

  /**
   * Show a generic popup
   */
  static Show(options: PopupOptions): HTMLDivElement {
    POPUPS.Setup();

    const overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: ${options.modal !== false ? 'rgba(0, 0, 0, 0.7)' : 'transparent'};
      display: flex;
      justify-content: center;
      align-items: center;
      pointer-events: auto;
      z-index: ${5000 + POPUPS.activePopups.length};
    `;

    const popup = document.createElement('div');
    popup.className = `popup ${options.className || ''}`;
    popup.style.cssText = `
      background-color: #2a3642;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
      color: white;
      font-family: Arial, sans-serif;
      max-width: ${options.width || 400}px;
      width: 90%;
      overflow: hidden;
    `;

    // Title bar (if title provided)
    if (options.title) {
      const titleBar = document.createElement('div');
      titleBar.className = 'popup-title';
      titleBar.style.cssText = `
        background-color: #1D232A;
        padding: 15px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      `;

      const titleText = document.createElement('h3');
      titleText.textContent = options.title;
      titleText.style.cssText = `
        margin: 0;
        font-size: 18px;
        color: #4CAF50;
      `;
      titleBar.appendChild(titleText);

      // Close button
      if (options.closable !== false) {
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = `
          background: none;
          border: none;
          color: #888;
          font-size: 24px;
          cursor: pointer;
          padding: 0;
          line-height: 1;
        `;
        closeBtn.onclick = () => POPUPS.Close(overlay);
        titleBar.appendChild(closeBtn);
      }

      popup.appendChild(titleBar);
    }

    // Content
    const content = document.createElement('div');
    content.className = 'popup-content';
    content.style.cssText = `
      padding: 20px;
    `;
    content.innerHTML = options.message;
    popup.appendChild(content);

    // Buttons
    if (options.buttons && options.buttons.length > 0) {
      const buttonContainer = document.createElement('div');
      buttonContainer.className = 'popup-buttons';
      buttonContainer.style.cssText = `
        padding: 15px 20px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        background-color: #1D232A;
      `;

      for (const btn of options.buttons) {
        const button = document.createElement('button');
        button.textContent = btn.text;
        button.style.cssText = `
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
          ${btn.primary !== false 
            ? 'background-color: #4CAF50; color: white;' 
            : 'background-color: #555; color: white;'}
        `;
        button.onclick = () => {
          POPUPS.Close(overlay);
          if (btn.callback) btn.callback();
        };
        buttonContainer.appendChild(button);
      }

      popup.appendChild(buttonContainer);
    }

    overlay.appendChild(popup);
    POPUPS.popupContainer?.appendChild(overlay);
    POPUPS.activePopups.push(overlay);

    return overlay;
  }

  /**
   * Close a popup
   */
  static Close(popup: HTMLDivElement): void {
    const index = POPUPS.activePopups.indexOf(popup);
    if (index > -1) {
      POPUPS.activePopups.splice(index, 1);
    }
    popup.remove();
  }

  /**
   * Close all popups
   */
  static CloseAll(): void {
    for (const popup of POPUPS.activePopups) {
      popup.remove();
    }
    POPUPS.activePopups = [];
  }

  /**
   * Show error popup
   */
  static Error(message: string, title: string = 'Error'): HTMLDivElement {
    return POPUPS.Show({
      title,
      message: `<p style="text-align: center; color: #ff5252;">${message}</p>`,
      buttons: [{ text: 'OK', primary: true }]
    });
  }

  /**
   * Show confirmation popup
   */
  static Confirm(
    message: string,
    onConfirm?: () => void,
    onCancel?: () => void,
    title: string = 'Confirm'
  ): HTMLDivElement {
    return POPUPS.Show({
      title,
      message: `<p style="text-align: center;">${message}</p>`,
      buttons: [
        { text: 'Cancel', callback: onCancel, primary: false },
        { text: 'Confirm', callback: onConfirm, primary: true }
      ]
    });
  }

  /**
   * Show info popup
   */
  static Info(message: string, title: string = 'Info'): HTMLDivElement {
    return POPUPS.Show({
      title,
      message: `<p style="text-align: center;">${message}</p>`,
      buttons: [{ text: 'OK', primary: true }]
    });
  }

  /**
   * Show no connection popup
   */
  static NoConnection(): HTMLDivElement {
    return POPUPS.Show({
      title: KEYS.Get('popup_noconnection_title') || 'Connection Lost',
      message: `<p style="text-align: center;">${KEYS.Get('popup_noconnection_msg') || 'Unable to connect to the server. Please check your internet connection.'}</p>`,
      buttons: [
        { 
          text: KEYS.Get('btn_retry') || 'Retry', 
          callback: () => {
            GLOBAL.checkNetworkConnection();
          },
          primary: true 
        }
      ],
      closable: false
    });
  }

  /**
   * Show timeout popup
   */
  static Timeout(): HTMLDivElement {
    return POPUPS.Show({
      title: KEYS.Get('popup_timeout_title') || 'Session Timeout',
      message: `<p style="text-align: center;">${KEYS.Get('popup_timeout_msg') || 'Your session has timed out due to inactivity.'}</p>`,
      buttons: [
        { 
          text: KEYS.Get('btn_continue') || 'Continue', 
          callback: () => {
            GLOBAL.UpdateAFKTimer();
          },
          primary: true 
        }
      ]
    });
  }

  /**
   * Show AFK popup
   */
  static AFK(): HTMLDivElement {
    return POPUPS.Show({
      title: KEYS.Get('popup_afk_title') || 'Are you still there?',
      message: `<p style="text-align: center;">${KEYS.Get('popup_afk_msg') || 'You have been inactive for a while. Click below to continue playing.'}</p>`,
      buttons: [
        { 
          text: KEYS.Get('btn_imhere') || "I'm here!", 
          callback: () => {
            GLOBAL.UpdateAFKTimer();
          },
          primary: true 
        }
      ]
    });
  }

  /**
   * Show gift callback popup
   */
  static CallbackGift(data: string): void {
    try {
      JSON.parse(data); // Parse to validate
      POPUPS.Show({
        title: KEYS.Get('popup_gift_title') || 'Gift Received!',
        message: `<p style="text-align: center;">${KEYS.Get('popup_gift_msg') || 'You received a gift!'}</p>`,
        buttons: [{ text: 'OK', primary: true }]
      });
    } catch (e) {
      console.error('[POPUPS] Failed to parse gift data:', e);
    }
  }

  /**
   * Show shiny callback popup
   */
  static CallbackShiny(data: string): void {
    try {
      JSON.parse(data); // Parse to validate
      POPUPS.Show({
        title: KEYS.Get('popup_shiny_title') || 'Shiny Collected!',
        message: `<p style="text-align: center;">${KEYS.Get('popup_shiny_msg') || 'You collected shiny!'}</p>`,
        buttons: [{ text: 'OK', primary: true }]
      });
    } catch (e) {
      console.error('[POPUPS] Failed to parse shiny data:', e);
    }
  }

  /**
   * Get count of active popups
   */
  static get count(): number {
    return POPUPS.activePopups.length;
  }
}

export default POPUPS;
