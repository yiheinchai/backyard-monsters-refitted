/**
 * BuildingStorePopup - Popup for purchasing/placing new buildings
 * Ported from ActionScript POPUPBUILD.as
 */

import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { CONFIG, BuildingGroup, BUILDING_TYPES } from '../../core/config';
import { game } from '../../core/Game';
import { BUILDING_DEFINITIONS, getBuildingsByGroup } from '../../game/buildings/BuildingProperties';

export class BuildingStorePopup extends Container {
  private background!: Graphics;
  private titleText!: Text;
  private closeButton!: Container;
  private categoryTabs!: Container;
  private buildingGrid!: Container;
  
  private currentCategory: BuildingGroup = BuildingGroup.RESOURCES;
  private onClose: () => void;
  private onSelectBuilding: (buildingType: number) => void;
  
  constructor(
    onClose: () => void,
    onSelectBuilding: (buildingType: number) => void
  ) {
    super();
    this.onClose = onClose;
    this.onSelectBuilding = onSelectBuilding;
    
    this.createPopup();
    this.showCategory(BuildingGroup.RESOURCES);
  }
  
  /**
   * Create the popup UI
   */
  private createPopup(): void {
    const screenWidth = game.state.screenWidth || CONFIG.SCREEN_WIDTH;
    const screenHeight = game.state.screenHeight || CONFIG.SCREEN_HEIGHT;
    const popupWidth = 600;
    const popupHeight = 450;
    
    // Blocker background
    const blocker = new Graphics();
    blocker.rect(0, 0, screenWidth, screenHeight);
    blocker.fill({ color: 0x000000, alpha: 0.5 });
    blocker.eventMode = 'static';
    blocker.on('pointerdown', () => {}); // Block clicks
    this.addChild(blocker);
    
    // Main popup background
    this.background = new Graphics();
    this.background.roundRect(0, 0, popupWidth, popupHeight, 15);
    this.background.fill(0x1a1a2e);
    this.background.stroke({ width: 3, color: 0xff6b35 });
    this.background.position.set(
      (screenWidth - popupWidth) / 2,
      (screenHeight - popupHeight) / 2
    );
    this.addChild(this.background);
    
    const offsetX = (screenWidth - popupWidth) / 2;
    const offsetY = (screenHeight - popupHeight) / 2;
    
    // Title
    this.titleText = new Text({
      text: 'Build Menu',
      style: new TextStyle({
        fontSize: 24,
        fill: 0xff6b35,
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
    
    // Category tabs
    this.categoryTabs = new Container();
    this.categoryTabs.position.set(offsetX + 20, offsetY + 55);
    this.createCategoryTabs();
    this.addChild(this.categoryTabs);
    
    // Building grid container
    this.buildingGrid = new Container();
    this.buildingGrid.position.set(offsetX + 20, offsetY + 100);
    this.addChild(this.buildingGrid);
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
    bg.stroke({ width: 2, color: 0xff6b35 });
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
    
    container.on('pointerover', () => {
      bg.tint = 0xff6b35;
    });
    
    container.on('pointerout', () => {
      bg.tint = 0xFFFFFF;
    });
    
    return container;
  }
  
  /**
   * Create category tabs
   */
  private createCategoryTabs(): void {
    const categories = [
      { group: BuildingGroup.RESOURCES, name: 'Resources' },
      { group: BuildingGroup.HOUSING, name: 'Housing' },
      { group: BuildingGroup.DEFENSE, name: 'Defense' },
      { group: BuildingGroup.SPECIAL, name: 'Special' },
      { group: BuildingGroup.WALLS, name: 'Walls' },
    ];
    
    let xPos = 0;
    for (const cat of categories) {
      const tab = this.createTab(cat.name, cat.group);
      tab.position.set(xPos, 0);
      this.categoryTabs.addChild(tab);
      xPos += 110;
    }
  }
  
  /**
   * Create a category tab
   */
  private createTab(name: string, group: BuildingGroup): Container {
    const container = new Container();
    container.eventMode = 'static';
    container.cursor = 'pointer';
    container.label = `tab_${group}`;
    
    const bg = new Graphics();
    bg.roundRect(0, 0, 100, 30, 5);
    bg.fill(this.currentCategory === group ? 0xff6b35 : 0x333333);
    container.addChild(bg);
    
    const text = new Text({
      text: name,
      style: new TextStyle({
        fontSize: 12,
        fill: 0xFFFFFF,
      }),
    });
    text.anchor.set(0.5, 0.5);
    text.position.set(50, 15);
    container.addChild(text);
    
    container.on('pointerdown', () => {
      this.showCategory(group);
    });
    
    return container;
  }
  
  /**
   * Show buildings for a category
   */
  private showCategory(group: BuildingGroup): void {
    this.currentCategory = group;
    
    // Update tab appearances
    for (const tab of this.categoryTabs.children) {
      const tabContainer = tab as Container;
      const bg = tabContainer.getChildAt(0) as Graphics;
      const tabGroup = parseInt(tabContainer.label?.replace('tab_', '') || '0');
      
      bg.clear();
      bg.roundRect(0, 0, 100, 30, 5);
      bg.fill(tabGroup === group ? 0xff6b35 : 0x333333);
    }
    
    // Clear grid
    this.buildingGrid.removeChildren();
    
    // Get buildings for this category
    const buildings = getBuildingsByGroup(group);
    
    // Create building cards
    let xPos = 0;
    let yPos = 0;
    const cardWidth = 130;
    const cardHeight = 140;
    const cols = 4;
    
    buildings.forEach((building, index) => {
      const card = this.createBuildingCard(building);
      card.position.set(xPos, yPos);
      this.buildingGrid.addChild(card);
      
      xPos += cardWidth + 10;
      if ((index + 1) % cols === 0) {
        xPos = 0;
        yPos += cardHeight + 10;
      }
    });
  }
  
  /**
   * Create a building card
   */
  private createBuildingCard(building: typeof BUILDING_DEFINITIONS[number]): Container {
    const container = new Container();
    container.eventMode = 'static';
    container.cursor = 'pointer';
    
    const cardWidth = 130;
    const cardHeight = 140;
    
    // Background
    const bg = new Graphics();
    bg.roundRect(0, 0, cardWidth, cardHeight, 8);
    bg.fill(0x2a2a3e);
    bg.stroke({ width: 1, color: 0x444455 });
    container.addChild(bg);
    
    // Building icon/placeholder
    const icon = new Graphics();
    const iconColor = this.getBuildingIconColor(building.id);
    icon.roundRect(15, 10, 100, 60, 5);
    icon.fill(iconColor);
    container.addChild(icon);
    
    // Building name
    const name = new Text({
      text: building.name,
      style: new TextStyle({
        fontSize: 11,
        fill: 0xFFFFFF,
        wordWrap: true,
        wordWrapWidth: cardWidth - 10,
      }),
    });
    name.position.set(5, 75);
    container.addChild(name);
    
    // Cost display
    const cost = building.levels[0].cost;
    const costText = new Text({
      text: `${cost.r1 + cost.r2 + cost.r3} resources`,
      style: new TextStyle({
        fontSize: 10,
        fill: 0xAAAAAA,
      }),
    });
    costText.position.set(5, 105);
    container.addChild(costText);
    
    // Max count
    const maxText = new Text({
      text: `Max: ${building.maxCount}`,
      style: new TextStyle({
        fontSize: 10,
        fill: 0x888888,
      }),
    });
    maxText.position.set(5, 120);
    container.addChild(maxText);
    
    // Click handler
    container.on('pointerdown', () => {
      this.onSelectBuilding(building.id);
    });
    
    // Hover effect
    container.on('pointerover', () => {
      bg.tint = 0xCCCCFF;
    });
    
    container.on('pointerout', () => {
      bg.tint = 0xFFFFFF;
    });
    
    return container;
  }
  
  /**
   * Get icon color for building type
   */
  private getBuildingIconColor(buildingType: number): number {
    switch (buildingType) {
      case BUILDING_TYPES.TOWN_HALL:
        return 0xCD853F;
      case BUILDING_TYPES.HATCHERY:
        return 0x9370DB;
      case BUILDING_TYPES.HOUSING:
        return 0x32CD32;
      case BUILDING_TYPES.SILO:
        return 0xFFD700;
      case BUILDING_TYPES.SNIPER_TOWER:
      case BUILDING_TYPES.CANNON_TOWER:
        return 0xDC143C;
      case BUILDING_TYPES.WALL:
        return 0x696969;
      case BUILDING_TYPES.MAP_ROOM:
        return 0x4169E1;
      default:
        return 0x808080;
    }
  }
  
  /**
   * Destroy popup
   */
  destroy(): void {
    super.destroy({ children: true });
  }
}
