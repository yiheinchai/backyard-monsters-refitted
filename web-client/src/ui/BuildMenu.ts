/**
 * BuildMenu - Building selection popup
 * Allows players to select and place buildings
 */

import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { EventEmitter } from '../core/EventEmitter';
import { BUILDING_TYPES, BUILDING_NAMES, BUILDING_SIZES } from '../game/BuildingManager';

export interface BuildingOption {
  id: number;
  name: string;
  size: number;
  category: string;
}

// Building categories
const BUILDING_CATEGORIES = {
  resources: {
    name: 'Resources',
    buildings: [
      BUILDING_TYPES.TWIG_SNAPPER,
      BUILDING_TYPES.PEBBLE_SHINER,
      BUILDING_TYPES.SILO,
    ],
  },
  monsters: {
    name: 'Monsters',
    buildings: [
      BUILDING_TYPES.HATCHERY,
      BUILDING_TYPES.HOUSING,
      BUILDING_TYPES.MONSTER_LOCKER,
    ],
  },
  defense: {
    name: 'Defense',
    buildings: [
      BUILDING_TYPES.CANNON_TOWER,
      BUILDING_TYPES.SNIPER_TOWER,
      BUILDING_TYPES.LASER_TOWER,
      BUILDING_TYPES.TESLA_TOWER,
    ],
  },
  general: {
    name: 'General',
    buildings: [
      BUILDING_TYPES.TOWN_HALL,
      BUILDING_TYPES.MAP_ROOM,
      BUILDING_TYPES.FLINGER,
    ],
  },
  walls: {
    name: 'Walls',
    buildings: [
      BUILDING_TYPES.WALL_1,
      BUILDING_TYPES.WALL_2,
      BUILDING_TYPES.WALL_3,
    ],
  },
};

export class BuildMenu extends EventEmitter {
  private container: Container;
  private background: Graphics;
  private contentContainer: Container;
  private closeButton: Container | null = null;
  private categoryTabs: Container;
  private buildingGrid: Container;
  
  private visible: boolean = false;
  private currentCategory: string = 'resources';
  
  private width: number = 500;
  private height: number = 400;

  constructor() {
    super();
    this.container = new Container();
    this.background = new Graphics();
    this.contentContainer = new Container();
    this.categoryTabs = new Container();
    this.buildingGrid = new Container();
    
    this.container.visible = false;
    this.setupUI();
  }

  /**
   * Setup the build menu UI
   */
  private setupUI(): void {
    // Dark semi-transparent background
    this.background.rect(0, 0, this.width, this.height);
    this.background.fill({ color: 0x1a1a2e, alpha: 0.95 });
    this.background.stroke({ color: 0x4a90a4, width: 3 });
    this.container.addChild(this.background);

    // Title
    const titleStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: 0xFFFFFF,
      fontWeight: 'bold',
    });
    const title = new Text({ text: '🏗️ Build Menu', style: titleStyle });
    title.x = 20;
    title.y = 15;
    this.container.addChild(title);

    // Close button
    this.closeButton = this.createCloseButton();
    this.closeButton.x = this.width - 40;
    this.closeButton.y = 10;
    this.container.addChild(this.closeButton);

    // Category tabs
    this.categoryTabs.y = 55;
    this.createCategoryTabs();
    this.container.addChild(this.categoryTabs);

    // Building grid container
    this.buildingGrid.x = 10;
    this.buildingGrid.y = 100;
    this.container.addChild(this.buildingGrid);

    // Content container
    this.container.addChild(this.contentContainer);

    // Show initial category
    this.showCategory(this.currentCategory);
  }

  /**
   * Create category tabs
   */
  private createCategoryTabs(): void {
    let tabX = 10;
    const tabWidth = 90;
    const tabHeight = 30;

    Object.entries(BUILDING_CATEGORIES).forEach(([key, category]) => {
      const tab = new Container();
      tab.x = tabX;

      const bg = new Graphics();
      bg.roundRect(0, 0, tabWidth, tabHeight, 3);
      
      if (key === this.currentCategory) {
        bg.fill({ color: 0x4a90a4 });
      } else {
        bg.fill({ color: 0x2a4a6a });
      }
      tab.addChild(bg);

      const textStyle = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 11,
        fill: 0xFFFFFF,
      });
      const text = new Text({ text: category.name, style: textStyle });
      text.anchor.set(0.5, 0.5);
      text.x = tabWidth / 2;
      text.y = tabHeight / 2;
      tab.addChild(text);

      tab.eventMode = 'static';
      tab.cursor = 'pointer';
      tab.on('pointerdown', () => {
        this.showCategory(key);
      });

      this.categoryTabs.addChild(tab);
      tabX += tabWidth + 5;
    });
  }

  /**
   * Show buildings for a category
   */
  private showCategory(categoryKey: string): void {
    this.currentCategory = categoryKey;
    this.buildingGrid.removeChildren();

    const category = BUILDING_CATEGORIES[categoryKey as keyof typeof BUILDING_CATEGORIES];
    if (!category) return;

    // Update tab colors
    this.categoryTabs.children.forEach((tab, index) => {
      const keys = Object.keys(BUILDING_CATEGORIES);
      const bg = tab.children[0] as Graphics;
      bg.clear();
      bg.roundRect(0, 0, 90, 30, 3);
      if (keys[index] === categoryKey) {
        bg.fill({ color: 0x4a90a4 });
      } else {
        bg.fill({ color: 0x2a4a6a });
      }
    });

    // Create building cards
    let x = 0;
    let y = 0;
    const cardWidth = 110;
    const cardHeight = 90;
    const cardsPerRow = 4;

    category.buildings.forEach((buildingId, index) => {
      const card = this.createBuildingCard(buildingId);
      card.x = x;
      card.y = y;
      this.buildingGrid.addChild(card);

      x += cardWidth + 10;
      if ((index + 1) % cardsPerRow === 0) {
        x = 0;
        y += cardHeight + 10;
      }
    });
  }

  /**
   * Create a building card
   */
  private createBuildingCard(buildingId: number): Container {
    const card = new Container();
    const cardWidth = 110;
    const cardHeight = 90;

    // Background
    const bg = new Graphics();
    bg.roundRect(0, 0, cardWidth, cardHeight, 5);
    bg.fill({ color: 0x2a3a4a });
    bg.stroke({ color: 0x4a6a8a, width: 1 });
    card.addChild(bg);

    // Building icon (colored rectangle representing the building)
    const iconSize = 40;
    const icon = new Graphics();
    icon.rect((cardWidth - iconSize) / 2, 10, iconSize, iconSize);
    icon.fill({ color: this.getBuildingColor(buildingId) });
    card.addChild(icon);

    // Building name
    const nameStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 10,
      fill: 0xFFFFFF,
      wordWrap: true,
      wordWrapWidth: cardWidth - 10,
      align: 'center',
    });
    const name = new Text({ 
      text: BUILDING_NAMES[buildingId] || 'Unknown', 
      style: nameStyle 
    });
    name.anchor.set(0.5, 0);
    name.x = cardWidth / 2;
    name.y = 55;
    card.addChild(name);

    // Size indicator
    const sizeStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 9,
      fill: 0x8b8b9e,
    });
    const size = BUILDING_SIZES[buildingId] || 2;
    const sizeText = new Text({ text: `${size}x${size}`, style: sizeStyle });
    sizeText.anchor.set(0.5, 0);
    sizeText.x = cardWidth / 2;
    sizeText.y = 75;
    card.addChild(sizeText);

    // Make interactive
    card.eventMode = 'static';
    card.cursor = 'pointer';

    card.on('pointerover', () => {
      bg.clear();
      bg.roundRect(0, 0, cardWidth, cardHeight, 5);
      bg.fill({ color: 0x3a5a7a });
      bg.stroke({ color: 0x6dd5ed, width: 2 });
    });

    card.on('pointerout', () => {
      bg.clear();
      bg.roundRect(0, 0, cardWidth, cardHeight, 5);
      bg.fill({ color: 0x2a3a4a });
      bg.stroke({ color: 0x4a6a8a, width: 1 });
    });

    card.on('pointerdown', () => {
      this.emit('buildingSelected', {
        id: buildingId,
        name: BUILDING_NAMES[buildingId],
        size: BUILDING_SIZES[buildingId] || 2,
      });
      this.hide();
    });

    return card;
  }

  /**
   * Get building color based on type
   */
  private getBuildingColor(buildingId: number): number {
    const colors: Record<number, number> = {
      [BUILDING_TYPES.TOWN_HALL]: 0x8B4513,
      [BUILDING_TYPES.HATCHERY]: 0x4169E1,
      [BUILDING_TYPES.TWIG_SNAPPER]: 0x228B22,
      [BUILDING_TYPES.PEBBLE_SHINER]: 0x708090,
      [BUILDING_TYPES.FLINGER]: 0xB8860B,
      [BUILDING_TYPES.SILO]: 0x6B8E23,
      [BUILDING_TYPES.MAP_ROOM]: 0x4682B4,
      [BUILDING_TYPES.CANNON_TOWER]: 0x8B0000,
      [BUILDING_TYPES.SNIPER_TOWER]: 0x8B0000,
      [BUILDING_TYPES.LASER_TOWER]: 0x9932CC,
      [BUILDING_TYPES.TESLA_TOWER]: 0xFFD700,
      [BUILDING_TYPES.HOUSING]: 0xCD853F,
      [BUILDING_TYPES.MONSTER_LOCKER]: 0x483D8B,
      [BUILDING_TYPES.WALL_1]: 0x696969,
      [BUILDING_TYPES.WALL_2]: 0x808080,
      [BUILDING_TYPES.WALL_3]: 0xA9A9A9,
    };
    return colors[buildingId] || 0x888888;
  }

  /**
   * Create close button
   */
  private createCloseButton(): Container {
    const button = new Container();

    const bg = new Graphics();
    bg.circle(15, 15, 15);
    bg.fill({ color: 0x8B0000 });
    button.addChild(bg);

    const textStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 18,
      fill: 0xFFFFFF,
      fontWeight: 'bold',
    });
    const text = new Text({ text: '✕', style: textStyle });
    text.anchor.set(0.5, 0.5);
    text.x = 15;
    text.y = 15;
    button.addChild(text);

    button.eventMode = 'static';
    button.cursor = 'pointer';

    button.on('pointerover', () => {
      bg.clear();
      bg.circle(15, 15, 15);
      bg.fill({ color: 0xCC0000 });
    });

    button.on('pointerout', () => {
      bg.clear();
      bg.circle(15, 15, 15);
      bg.fill({ color: 0x8B0000 });
    });

    button.on('pointerdown', () => {
      this.hide();
    });

    return button;
  }

  /**
   * Show the menu
   */
  show(): void {
    this.visible = true;
    this.container.visible = true;
    this.centerOnScreen();
    this.emit('shown');
  }

  /**
   * Hide the menu
   */
  hide(): void {
    this.visible = false;
    this.container.visible = false;
    this.emit('hidden');
  }

  /**
   * Toggle visibility
   */
  toggle(): void {
    if (this.visible) {
      this.hide();
    } else {
      this.show();
    }
  }

  /**
   * Center the menu on screen
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
export const buildMenu = new BuildMenu();
