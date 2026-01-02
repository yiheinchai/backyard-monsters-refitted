/**
 * MonsterInfoPopup - Popup showing monster details
 * Ported from ActionScript POPUPCREATURE.as
 */

import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { CONFIG, MONSTER_TYPES } from '../../core/config';
import { game } from '../../core/Game';
import { Creature } from '../../game/creatures/Creature';
import { creatures } from '../../game/creatures/CreatureManager';

export class MonsterInfoPopup extends Container {
  private background!: Graphics;
  private titleText!: Text;
  private closeButton!: Container;
  private monsterList!: Container;
  
  private onClose: () => void;
  
  constructor(onClose: () => void) {
    super();
    this.onClose = onClose;
    
    this.createPopup();
    this.showMonsters();
  }
  
  /**
   * Create the popup UI
   */
  private createPopup(): void {
    const screenWidth = game.state.screenWidth || CONFIG.SCREEN_WIDTH;
    const screenHeight = game.state.screenHeight || CONFIG.SCREEN_HEIGHT;
    const popupWidth = 500;
    const popupHeight = 400;
    
    // Blocker background
    const blocker = new Graphics();
    blocker.rect(0, 0, screenWidth, screenHeight);
    blocker.fill({ color: 0x000000, alpha: 0.5 });
    blocker.eventMode = 'static';
    blocker.on('pointerdown', () => {});
    this.addChild(blocker);
    
    // Main popup background
    this.background = new Graphics();
    this.background.roundRect(0, 0, popupWidth, popupHeight, 15);
    this.background.fill(0x1a1a2e);
    this.background.stroke({ width: 3, color: 0x9370DB });
    this.background.position.set(
      (screenWidth - popupWidth) / 2,
      (screenHeight - popupHeight) / 2
    );
    this.addChild(this.background);
    
    const offsetX = (screenWidth - popupWidth) / 2;
    const offsetY = (screenHeight - popupHeight) / 2;
    
    // Title
    this.titleText = new Text({
      text: 'Monster Housing',
      style: new TextStyle({
        fontSize: 24,
        fill: 0x9370DB,
        fontWeight: 'bold',
      }),
    });
    this.titleText.anchor.set(0.5, 0);
    this.titleText.position.set(offsetX + popupWidth / 2, offsetY + 15);
    this.addChild(this.titleText);
    
    // Close button
    this.closeButton = this.createCloseButton();
    this.closeButton.position.set(offsetX + popupWidth - 40, offsetY + 10);
    this.addChild(this.closeButton);
    
    // Housing info
    const housingText = new Text({
      text: `Housing: ${creatures.getCurrentHousing()} / ${creatures.getHousingCapacity()}`,
      style: new TextStyle({
        fontSize: 14,
        fill: 0xAAAAAA,
      }),
    });
    housingText.position.set(offsetX + 20, offsetY + 55);
    this.addChild(housingText);
    
    // Monster list container
    this.monsterList = new Container();
    this.monsterList.position.set(offsetX + 20, offsetY + 85);
    this.addChild(this.monsterList);
  }
  
  /**
   * Create close button
   */
  private createCloseButton(): Container {
    const container = new Container();
    container.eventMode = 'static';
    container.cursor = 'pointer';
    
    const bg = new Graphics();
    bg.circle(0, 0, 15);
    bg.fill(0x333333);
    bg.stroke({ width: 2, color: 0x9370DB });
    container.addChild(bg);
    
    const x = new Text({
      text: '×',
      style: new TextStyle({
        fontSize: 24,
        fill: 0xFFFFFF,
        fontWeight: 'bold',
      }),
    });
    x.anchor.set(0.5, 0.5);
    x.position.set(0, -2);
    container.addChild(x);
    
    container.on('pointerdown', () => {
      this.onClose();
    });
    
    return container;
  }
  
  /**
   * Show all monsters in housing
   */
  private showMonsters(): void {
    this.monsterList.removeChildren();
    
    const monsterTypes = [
      { type: MONSTER_TYPES.POKEY, name: 'Pokey', color: 0x8B4513 },
      { type: MONSTER_TYPES.OCTO_OOZE, name: 'Octo-ooze', color: 0x00FF00 },
      { type: MONSTER_TYPES.BOLT, name: 'Bolt', color: 0xFFFF00 },
      { type: MONSTER_TYPES.FINK, name: 'Fink', color: 0xFF6B35 },
      { type: MONSTER_TYPES.EYE_RA, name: 'Eye-ra', color: 0xFF0000 },
      { type: MONSTER_TYPES.ICHI, name: 'Ichi', color: 0xADD8E6 },
      { type: MONSTER_TYPES.CRABATRON, name: 'Crabatron', color: 0xFF4500 },
      { type: MONSTER_TYPES.PROJECT_X, name: 'Project X', color: 0x800080 },
      { type: MONSTER_TYPES.BRAIN, name: 'Brain', color: 0xFF69B4 },
      { type: MONSTER_TYPES.TERATORN, name: 'Teratorn', color: 0x4169E1 },
      { type: MONSTER_TYPES.WORMZER, name: 'Wormzer', color: 0x8B0000 },
      { type: MONSTER_TYPES.D_A_V_E, name: 'D.A.V.E.', color: 0x696969 },
    ];
    
    let yPos = 0;
    for (const monster of monsterTypes) {
      const count = creatures.getMonsterCount(monster.type);
      
      // Only show if we have some or can make some
      if (count > 0 || creatures.isMonsterUnlocked(monster.type)) {
        const row = this.createMonsterRow(monster.name, monster.color, count);
        row.position.set(0, yPos);
        this.monsterList.addChild(row);
        yPos += 40;
      }
    }
    
    if (yPos === 0) {
      const noMonsters = new Text({
        text: 'No monsters in housing. Hatch some in the Hatchery!',
        style: new TextStyle({
          fontSize: 14,
          fill: 0x888888,
        }),
      });
      this.monsterList.addChild(noMonsters);
    }
  }
  
  /**
   * Create a monster row
   */
  private createMonsterRow(name: string, color: number, count: number): Container {
    const container = new Container();
    
    // Icon
    const icon = new Graphics();
    icon.circle(15, 15, 15);
    icon.fill(color);
    container.addChild(icon);
    
    // Name
    const nameText = new Text({
      text: name,
      style: new TextStyle({
        fontSize: 14,
        fill: 0xFFFFFF,
      }),
    });
    nameText.position.set(40, 5);
    container.addChild(nameText);
    
    // Count
    const countText = new Text({
      text: `x${count}`,
      style: new TextStyle({
        fontSize: 14,
        fill: count > 0 ? 0x00FF00 : 0x888888,
        fontWeight: 'bold',
      }),
    });
    countText.position.set(200, 5);
    container.addChild(countText);
    
    // Housing space
    const creature = new Creature(MONSTER_TYPES.POKEY); // Just for getting housing space
    const spaceText = new Text({
      text: `(${creature.getHousingSpace()} space)`,
      style: new TextStyle({
        fontSize: 12,
        fill: 0x888888,
      }),
    });
    spaceText.position.set(260, 7);
    container.addChild(spaceText);
    
    return container;
  }
  
  /**
   * Destroy popup
   */
  destroy(): void {
    super.destroy({ children: true });
  }
}
