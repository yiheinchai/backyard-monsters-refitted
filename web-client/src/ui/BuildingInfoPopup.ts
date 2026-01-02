/**
 * BuildingInfoPopup - Shows details about a selected building
 */

import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { EventEmitter } from '../core/EventEmitter';
import { Building } from '../game/Building';
import { BUILDING_NAMES } from '../game/BuildingManager';

export class BuildingInfoPopup extends EventEmitter {
  private container: Container;
  private background: Graphics;
  private visible: boolean = false;
  private currentBuilding: Building | null = null;
  
  private width: number = 300;
  private height: number = 200;

  constructor() {
    super();
    this.container = new Container();
    this.background = new Graphics();
    this.container.visible = false;
    this.setupUI();
  }

  private setupUI(): void {
    // Background
    this.background.roundRect(0, 0, this.width, this.height, 10);
    this.background.fill({ color: 0x1a1a2e, alpha: 0.95 });
    this.background.stroke({ color: 0x4a90a4, width: 2 });
    this.container.addChild(this.background);

    // Close button
    const closeBtn = this.createCloseButton();
    closeBtn.x = this.width - 35;
    closeBtn.y = 10;
    this.container.addChild(closeBtn);
  }

  /**
   * Show popup for a building
   */
  show(building: Building): void {
    this.currentBuilding = building;
    this.visible = true;
    this.container.visible = true;
    
    // Clear previous content
    while (this.container.children.length > 2) {
      this.container.removeChildAt(2);
    }
    
    // Add building info
    this.renderBuildingInfo(building);
    
    // Center on screen
    this.centerOnScreen();
    
    this.emit('shown', building);
  }

  /**
   * Render building information
   */
  private renderBuildingInfo(building: Building): void {
    const titleStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 0xFFFFFF,
      fontWeight: 'bold',
    });

    const labelStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 12,
      fill: 0x8b8b9e,
    });

    const valueStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 14,
      fill: 0xFFFFFF,
    });

    // Building name
    const name = BUILDING_NAMES[building.type] || 'Unknown Building';
    const title = new Text({ text: name, style: titleStyle });
    title.x = 15;
    title.y = 15;
    this.container.addChild(title);

    // Level
    const levelLabel = new Text({ text: 'Level:', style: labelStyle });
    levelLabel.x = 15;
    levelLabel.y = 50;
    this.container.addChild(levelLabel);

    const levelValue = new Text({ text: `${building.level}`, style: valueStyle });
    levelValue.x = 80;
    levelValue.y = 48;
    this.container.addChild(levelValue);

    // Health
    const healthLabel = new Text({ text: 'Health:', style: labelStyle });
    healthLabel.x = 15;
    healthLabel.y = 75;
    this.container.addChild(healthLabel);

    const healthPercent = Math.round((building.health / building.maxHealth) * 100);
    const healthValue = new Text({ 
      text: `${building.health}/${building.maxHealth} (${healthPercent}%)`, 
      style: valueStyle 
    });
    healthValue.x = 80;
    healthValue.y = 73;
    this.container.addChild(healthValue);

    // Position
    const posLabel = new Text({ text: 'Position:', style: labelStyle });
    posLabel.x = 15;
    posLabel.y = 100;
    this.container.addChild(posLabel);

    const posValue = new Text({ text: `(${building.gridX}, ${building.gridY})`, style: valueStyle });
    posValue.x = 80;
    posValue.y = 98;
    this.container.addChild(posValue);

    // Action buttons
    const upgradeBtn = this.createButton('Upgrade', 15, 140, () => {
      this.emit('upgrade', building);
    });
    this.container.addChild(upgradeBtn);

    const moveBtn = this.createButton('Move', 110, 140, () => {
      this.emit('move', building);
    });
    this.container.addChild(moveBtn);

    const sellBtn = this.createButton('Sell', 205, 140, () => {
      this.emit('sell', building);
    }, 0x8B0000);
    this.container.addChild(sellBtn);
  }

  /**
   * Create a button
   */
  private createButton(
    label: string,
    x: number,
    y: number,
    onClick: () => void,
    bgColor: number = 0x2a4a6a
  ): Container {
    const button = new Container();
    button.x = x;
    button.y = y;

    const bg = new Graphics();
    bg.roundRect(0, 0, 80, 35, 5);
    bg.fill({ color: bgColor });
    bg.stroke({ color: 0x4a90a4, width: 1 });
    button.addChild(bg);

    const textStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 12,
      fill: 0xFFFFFF,
    });

    const text = new Text({ text: label, style: textStyle });
    text.anchor.set(0.5, 0.5);
    text.x = 40;
    text.y = 17;
    button.addChild(text);

    button.eventMode = 'static';
    button.cursor = 'pointer';

    button.on('pointerover', () => {
      bg.clear();
      bg.roundRect(0, 0, 80, 35, 5);
      bg.fill({ color: bgColor + 0x111111 });
      bg.stroke({ color: 0x6dd5ed, width: 2 });
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.roundRect(0, 0, 80, 35, 5);
      bg.fill({ color: bgColor });
      bg.stroke({ color: 0x4a90a4, width: 1 });
    });

    button.on('pointerdown', onClick);

    return button;
  }

  /**
   * Create close button
   */
  private createCloseButton(): Container {
    const button = new Container();

    const bg = new Graphics();
    bg.circle(12, 12, 12);
    bg.fill({ color: 0x8B0000 });
    button.addChild(bg);

    const textStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 16,
      fill: 0xFFFFFF,
      fontWeight: 'bold',
    });
    const text = new Text({ text: '✕', style: textStyle });
    text.anchor.set(0.5, 0.5);
    text.x = 12;
    text.y = 12;
    button.addChild(text);

    button.eventMode = 'static';
    button.cursor = 'pointer';

    button.on('pointerover', () => {
      bg.clear();
      bg.circle(12, 12, 12);
      bg.fill({ color: 0xCC0000 });
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.circle(12, 12, 12);
      bg.fill({ color: 0x8B0000 });
    });

    button.on('pointerdown', () => {
      this.hide();
    });

    return button;
  }

  /**
   * Hide the popup
   */
  hide(): void {
    this.visible = false;
    this.container.visible = false;
    this.currentBuilding = null;
    this.emit('hidden');
  }

  /**
   * Center on screen
   */
  centerOnScreen(): void {
    this.container.x = (window.innerWidth - this.width) / 2;
    this.container.y = (window.innerHeight - this.height) / 2;
  }

  /**
   * Get the container
   */
  getContainer(): Container {
    return this.container;
  }

  /**
   * Check if visible
   */
  isVisible(): boolean {
    return this.visible;
  }
}

// Singleton instance
export const buildingInfoPopup = new BuildingInfoPopup();
