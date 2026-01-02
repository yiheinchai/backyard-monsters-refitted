/**
 * PLEASEWAIT - Loading indicator for the Backyard Monsters client
 * This is the TypeScript equivalent of PLEASEWAIT.as
 */

/**
 * PLEASEWAIT class - shows/hides loading indicator
 */
export class PLEASEWAIT {
  private static container: HTMLDivElement | null = null;
  private static messageEl: HTMLParagraphElement | null = null;
  private static isVisible: boolean = false;

  /**
   * Create the loading UI if it doesn't exist
   */
  private static create(): void {
    if (PLEASEWAIT.container) return;

    PLEASEWAIT.container = document.createElement('div');
    PLEASEWAIT.container.id = 'please-wait';
    PLEASEWAIT.container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.7);
      display: none;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    `;

    const content = document.createElement('div');
    content.style.cssText = `
      text-align: center;
      color: white;
      font-family: Arial, sans-serif;
    `;

    // Spinner
    const spinner = document.createElement('div');
    spinner.style.cssText = `
      width: 50px;
      height: 50px;
      border: 4px solid #333;
      border-top: 4px solid #4CAF50;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    `;

    // Add spinner animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    PLEASEWAIT.messageEl = document.createElement('p');
    PLEASEWAIT.messageEl.style.cssText = `
      font-size: 16px;
      margin: 0;
    `;
    PLEASEWAIT.messageEl.textContent = 'Please wait...';

    content.appendChild(spinner);
    content.appendChild(PLEASEWAIT.messageEl);
    PLEASEWAIT.container.appendChild(content);
    document.body.appendChild(PLEASEWAIT.container);
  }

  /**
   * Show the loading indicator
   */
  static Show(message: string = 'Please wait...'): void {
    PLEASEWAIT.create();

    if (PLEASEWAIT.container && PLEASEWAIT.messageEl) {
      PLEASEWAIT.messageEl.textContent = message;
      PLEASEWAIT.container.style.display = 'flex';
      PLEASEWAIT.isVisible = true;
    }
  }

  /**
   * Hide the loading indicator
   */
  static Hide(): void {
    if (PLEASEWAIT.container) {
      PLEASEWAIT.container.style.display = 'none';
      PLEASEWAIT.isVisible = false;
    }
  }

  /**
   * Update the message
   */
  static SetMessage(message: string): void {
    if (PLEASEWAIT.messageEl) {
      PLEASEWAIT.messageEl.textContent = message;
    }
  }

  /**
   * Check if visible
   */
  static get visible(): boolean {
    return PLEASEWAIT.isVisible;
  }
}

export default PLEASEWAIT;
