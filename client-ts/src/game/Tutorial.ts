/**
 * TUTORIAL - Tutorial system for the Backyard Monsters client
 * This is the TypeScript equivalent of TUTORIAL.as
 */

// import { GLOBAL } from '@/core/Global';
import { KEYS } from '@/core/Keys';
import { Storage } from '@/utils';

interface TutorialStep {
  id: number;
  title: string;
  message: string;
  target?: string;
  action?: string;
  condition?: () => boolean;
}

/**
 * TUTORIAL class - manages the in-game tutorial
 */
export class TUTORIAL {
  // Tutorial state
  static _stage: number = 0;
  static _endstage: number = 1000;
  
  // Current step
  private static currentStep: TutorialStep | null = null;
  
  // Tutorial steps
  private static steps: TutorialStep[] = [];
  
  // UI element
  private static tutorialElement: HTMLDivElement | null = null;
  
  // Completed flag
  private static _completed: boolean = false;

  /**
   * Initialize tutorial system
   */
  static Setup(): void {
    const savedStage = Storage.get<number>('bymr_tutorial_stage');
    if (savedStage !== null) {
      TUTORIAL._stage = savedStage;
    }
    
    TUTORIAL._completed = TUTORIAL._stage >= TUTORIAL._endstage;
    TUTORIAL.initializeSteps();
  }

  /**
   * Initialize tutorial steps
   */
  private static initializeSteps(): void {
    TUTORIAL.steps = [
      {
        id: 1,
        title: KEYS.Get('tutorial_welcome_title') || 'Welcome!',
        message: KEYS.Get('tutorial_welcome_msg') || 'Welcome to Backyard Monsters! Let\'s get started.',
        action: 'click_anywhere'
      },
      {
        id: 10,
        title: KEYS.Get('tutorial_townhall_title') || 'Town Hall',
        message: KEYS.Get('tutorial_townhall_msg') || 'This is your Town Hall. It\'s the most important building in your base!',
        target: 'townhall'
      },
      {
        id: 20,
        title: KEYS.Get('tutorial_resources_title') || 'Resources',
        message: KEYS.Get('tutorial_resources_msg') || 'You need resources to build and upgrade. Collect them from harvesters!',
        target: 'resources'
      },
      {
        id: 50,
        title: KEYS.Get('tutorial_build_title') || 'Building',
        message: KEYS.Get('tutorial_build_msg') || 'Click the build button to construct new buildings.',
        action: 'open_build_menu'
      },
      {
        id: 100,
        title: KEYS.Get('tutorial_hatchery_title') || 'Hatchery',
        message: KEYS.Get('tutorial_hatchery_msg') || 'Build a Hatchery to start breeding monsters!',
        action: 'build_hatchery'
      },
      {
        id: 200,
        title: KEYS.Get('tutorial_complete_title') || 'Tutorial Complete!',
        message: KEYS.Get('tutorial_complete_msg') || 'You\'ve completed the basics. Good luck defending your yard!',
        action: 'complete'
      }
    ];
  }

  /**
   * Start the tutorial
   */
  static Start(): void {
    if (TUTORIAL._completed) return;
    
    TUTORIAL._stage = 0;
    TUTORIAL.showCurrentStep();
  }

  /**
   * Show current tutorial step
   */
  private static showCurrentStep(): void {
    const step = TUTORIAL.steps.find(s => s.id === TUTORIAL._stage);
    if (!step) {
      // Find next available step
      const nextStep = TUTORIAL.steps.find(s => s.id > TUTORIAL._stage);
      if (nextStep) {
        TUTORIAL._stage = nextStep.id;
        TUTORIAL.showCurrentStep();
      }
      return;
    }

    TUTORIAL.currentStep = step;
    TUTORIAL.showTutorialUI(step);
  }

  /**
   * Show tutorial UI
   */
  private static showTutorialUI(step: TutorialStep): void {
    // Remove existing
    if (TUTORIAL.tutorialElement) {
      TUTORIAL.tutorialElement.remove();
    }

    TUTORIAL.tutorialElement = document.createElement('div');
    TUTORIAL.tutorialElement.id = 'tutorial-overlay';
    TUTORIAL.tutorialElement.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: #2a3642;
      border: 2px solid #4CAF50;
      border-radius: 10px;
      padding: 20px;
      color: white;
      font-family: Arial, sans-serif;
      max-width: 400px;
      z-index: 10000;
      box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    `;

    TUTORIAL.tutorialElement.innerHTML = `
      <h3 style="margin: 0 0 10px; color: #4CAF50;">${step.title}</h3>
      <p style="margin: 0 0 15px;">${step.message}</p>
      <button id="tutorial-next" style="
        padding: 10px 20px;
        background-color: #4CAF50;
        border: none;
        border-radius: 5px;
        color: white;
        cursor: pointer;
        font-size: 14px;
      ">Continue</button>
      <button id="tutorial-skip" style="
        padding: 10px 20px;
        background-color: transparent;
        border: none;
        color: #888;
        cursor: pointer;
        font-size: 12px;
        margin-left: 10px;
      ">Skip Tutorial</button>
    `;

    document.body.appendChild(TUTORIAL.tutorialElement);

    // Event handlers
    document.getElementById('tutorial-next')?.addEventListener('click', () => {
      TUTORIAL.nextStep();
    });

    document.getElementById('tutorial-skip')?.addEventListener('click', () => {
      TUTORIAL.skip();
    });
  }

  /**
   * Go to next step
   */
  static nextStep(): void {
    const currentIndex = TUTORIAL.steps.findIndex(s => s.id === TUTORIAL._stage);
    if (currentIndex >= 0 && currentIndex < TUTORIAL.steps.length - 1) {
      TUTORIAL._stage = TUTORIAL.steps[currentIndex + 1].id;
      Storage.set('bymr_tutorial_stage', TUTORIAL._stage);
      TUTORIAL.showCurrentStep();
    } else {
      TUTORIAL.complete();
    }
  }

  /**
   * Complete the tutorial
   */
  static complete(): void {
    TUTORIAL._stage = TUTORIAL._endstage;
    TUTORIAL._completed = true;
    Storage.set('bymr_tutorial_stage', TUTORIAL._stage);
    
    if (TUTORIAL.tutorialElement) {
      TUTORIAL.tutorialElement.remove();
      TUTORIAL.tutorialElement = null;
    }
  }

  /**
   * Skip the tutorial
   */
  static skip(): void {
    TUTORIAL.complete();
  }

  /**
   * Tick function
   */
  static Tick(): void {
    // Check conditions for current step
    if (TUTORIAL.currentStep?.condition && TUTORIAL.currentStep.condition()) {
      TUTORIAL.nextStep();
    }
  }

  /**
   * Resize handler
   */
  static Resize(): void {
    // Reposition tutorial element if needed
  }

  /**
   * Check if tutorial is finished
   */
  static get hasFinished(): boolean {
    return TUTORIAL._completed;
  }

  /**
   * Get current stage
   */
  static get stage(): number {
    return TUTORIAL._stage;
  }

  /**
   * Set tutorial stage (for debugging)
   */
  static setStage(stage: number): void {
    TUTORIAL._stage = stage;
    Storage.set('bymr_tutorial_stage', stage);
    TUTORIAL._completed = stage >= TUTORIAL._endstage;
    
    if (!TUTORIAL._completed) {
      TUTORIAL.showCurrentStep();
    }
  }
}

export default TUTORIAL;
