/**
 * QUESTS - Quest/Mission system for the Backyard Monsters client
 * This is the TypeScript equivalent of QUESTS.as
 */

import { GLOBAL } from '@/core/Global';
// import { KEYS } from '@/core/Keys';
import { SecNum } from '@/utils';

export interface Quest {
  id: number;
  type: string;
  title: string;
  description: string;
  target: number;
  progress: SecNum;
  completed: boolean;
  claimed: boolean;
  rewards: QuestReward[];
}

export interface QuestReward {
  type: 'resource' | 'shiny' | 'item' | 'xp';
  id?: string;
  amount: number;
}

// Quest definitions
export const QUEST_DEFS: Record<number, Omit<Quest, 'progress' | 'completed' | 'claimed'>> = {
  1: {
    id: 1,
    type: 'build',
    title: 'First Steps',
    description: 'Build your first building',
    target: 1,
    rewards: [{ type: 'resource', id: 'r1', amount: 100 }]
  },
  2: {
    id: 2,
    type: 'hatch',
    title: 'Monster Breeder',
    description: 'Hatch 10 monsters',
    target: 10,
    rewards: [{ type: 'resource', id: 'r4', amount: 500 }]
  },
  3: {
    id: 3,
    type: 'upgrade',
    title: 'Upgrader',
    description: 'Upgrade 5 buildings',
    target: 5,
    rewards: [{ type: 'shiny', amount: 5 }]
  },
  4: {
    id: 4,
    type: 'attack',
    title: 'First Blood',
    description: 'Attack another player',
    target: 1,
    rewards: [{ type: 'resource', id: 'r2', amount: 200 }]
  },
  5: {
    id: 5,
    type: 'destroy',
    title: 'Destroyer',
    description: 'Destroy 10 buildings in attacks',
    target: 10,
    rewards: [{ type: 'shiny', amount: 10 }]
  }
};

/**
 * QUESTS class - manages quests/missions
 */
export class QUESTS {
  // Active quests
  private static activeQuests: Map<number, Quest> = new Map();
  
  // Completed quest IDs
  private static completedQuests: Set<number> = new Set();

  /**
   * Initialize quests system
   */
  static Setup(): void {
    QUESTS.activeQuests.clear();
    QUESTS.completedQuests.clear();
  }

  /**
   * Load quests from server data
   */
  static Load(data: { active?: Array<{ id: number; progress: number }>; completed?: number[] }): void {
    QUESTS.activeQuests.clear();
    QUESTS.completedQuests.clear();

    // Load completed quests
    if (data.completed) {
      data.completed.forEach(id => QUESTS.completedQuests.add(id));
    }

    // Load active quests
    if (data.active) {
      for (const questData of data.active) {
        const def = QUEST_DEFS[questData.id];
        if (def) {
          const quest: Quest = {
            ...def,
            progress: new SecNum(questData.progress),
            completed: questData.progress >= def.target,
            claimed: false
          };
          QUESTS.activeQuests.set(quest.id, quest);
        }
      }
    }

    // If no active quests, assign first available
    if (QUESTS.activeQuests.size === 0) {
      QUESTS.assignNextQuest();
    }
  }

  /**
   * Assign next available quest
   */
  private static assignNextQuest(): void {
    for (const id in QUEST_DEFS) {
      const questId = parseInt(id, 10);
      if (!QUESTS.completedQuests.has(questId) && !QUESTS.activeQuests.has(questId)) {
        const def = QUEST_DEFS[questId];
        const quest: Quest = {
          ...def,
          progress: new SecNum(0),
          completed: false,
          claimed: false
        };
        QUESTS.activeQuests.set(questId, quest);
        return;
      }
    }
  }

  /**
   * Update quest progress
   */
  static UpdateProgress(type: string, amount: number = 1): void {
    QUESTS.activeQuests.forEach(quest => {
      if (quest.type === type && !quest.completed) {
        quest.progress.Add(amount);
        
        if (quest.progress.Get() >= quest.target) {
          quest.completed = true;
          QUESTS.onQuestComplete(quest);
        }
      }
    });
  }

  /**
   * Called when quest is complete
   */
  private static onQuestComplete(quest: Quest): void {
    console.log('[QUESTS] Quest completed:', quest.title);
    
    // Show notification
    import('@/ui/Popups').then(({ POPUPS }) => {
      POPUPS.Info(
        `Quest Complete: ${quest.title}! Click to claim your rewards.`,
        'Quest Complete!'
      );
    });
  }

  /**
   * Claim quest rewards
   */
  static ClaimRewards(questId: number): boolean {
    const quest = QUESTS.activeQuests.get(questId);
    if (!quest || !quest.completed || quest.claimed) {
      return false;
    }

    // Apply rewards
    for (const reward of quest.rewards) {
      switch (reward.type) {
        case 'resource':
          if (reward.id && GLOBAL._resources[reward.id]) {
            GLOBAL._resources[reward.id].Add(reward.amount);
          }
          break;
        case 'shiny':
          GLOBAL._credits.Add(reward.amount);
          break;
        // Add other reward types as needed
      }
    }

    quest.claimed = true;
    QUESTS.completedQuests.add(questId);
    QUESTS.activeQuests.delete(questId);
    
    // Assign next quest
    QUESTS.assignNextQuest();
    
    return true;
  }

  /**
   * Get active quests
   */
  static GetActive(): Quest[] {
    return Array.from(QUESTS.activeQuests.values());
  }

  /**
   * Get completed quest count
   */
  static GetCompletedCount(): number {
    return QUESTS.completedQuests.size;
  }

  /**
   * Check if has unclaimed rewards
   */
  static HasUnclaimedRewards(): boolean {
    return Array.from(QUESTS.activeQuests.values()).some(q => q.completed && !q.claimed);
  }

  /**
   * Serialize to save data
   */
  static toSaveData(): { active: Array<{ id: number; progress: number }>; completed: number[] } {
    return {
      active: Array.from(QUESTS.activeQuests.values()).map(q => ({
        id: q.id,
        progress: q.progress.Get()
      })),
      completed: Array.from(QUESTS.completedQuests)
    };
  }
}

export default QUESTS;
