/**
 * WorldMap - Handles the world map view
 * Ported from ActionScript WORLDMAP.as
 */

import { Container, Graphics, Text, TextStyle } from 'pixi.js';
import { game } from '../../core/Game';
import { globalEvents } from '../../utils/EventEmitter';
import { GAME_EVENTS, CONFIG } from '../../core/config';
import { network } from '../../network/NetworkManager';

export interface WorldMapCell {
  x: number;
  y: number;
  uid?: number;
  username?: string;
  level?: number;
  baseValue?: number;
  protected?: boolean;
  alliance?: string;
  terrainType: number;
}

export class WorldMap {
  private container: Container;
  private mapContainer: Container;
  private uiContainer: Container;
  private cellsContainer: Container;
  
  // Map data
  private cells: Map<string, WorldMapCell> = new Map();
  private playerCell: { x: number; y: number } = { x: 0, y: 0 };
  
  // View state
  private viewX: number = 0;
  private viewY: number = 0;
  private cellSize: number = 40;
  private visibleCells: number = 15;
  
  // Dragging
  private isDragging: boolean = false;
  private dragStartX: number = 0;
  private dragStartY: number = 0;
  
  // Selected cell
  private selectedCell: WorldMapCell | null = null;
  
  // UI elements
  private infoPanel!: Container;
  private closeButton!: Container;
  
  constructor(parentContainer: Container) {
    this.container = new Container();
    this.container.label = 'worldmap';
    this.container.visible = false;
    parentContainer.addChild(this.container);
    
    // Create layers
    this.mapContainer = new Container();
    this.cellsContainer = new Container();
    this.uiContainer = new Container();
    
    this.mapContainer.addChild(this.cellsContainer);
    this.container.addChild(this.mapContainer);
    this.container.addChild(this.uiContainer);
    
    this.setupUI();
    this.setupInteraction();
  }
  
  /**
   * Setup UI elements
   */
  private setupUI(): void {
    const screenWidth = game.state.screenWidth || CONFIG.SCREEN_WIDTH;
    const screenHeight = game.state.screenHeight || CONFIG.SCREEN_HEIGHT;
    
    // Background
    const bg = new Graphics();
    bg.rect(0, 0, screenWidth, screenHeight);
    bg.fill(0x1a1a2e);
    this.container.addChildAt(bg, 0);
    
    // Title
    const title = new Text({
      text: 'World Map',
      style: new TextStyle({
        fontSize: 28,
        fill: 0xff6b35,
        fontWeight: 'bold',
      }),
    });
    title.anchor.set(0.5, 0);
    title.position.set(screenWidth / 2, 20);
    this.uiContainer.addChild(title);
    
    // Close button
    this.closeButton = this.createCloseButton();
    this.closeButton.position.set(screenWidth - 60, 20);
    this.uiContainer.addChild(this.closeButton);
    
    // Info panel
    this.infoPanel = this.createInfoPanel();
    this.infoPanel.position.set(screenWidth - 220, 70);
    this.uiContainer.addChild(this.infoPanel);
    
    // Center map
    this.mapContainer.position.set(
      screenWidth / 2 - (this.visibleCells * this.cellSize) / 2,
      screenHeight / 2 - (this.visibleCells * this.cellSize) / 2 + 30
    );
  }
  
  /**
   * Create close button
   */
  private createCloseButton(): Container {
    const container = new Container();
    container.eventMode = 'static';
    container.cursor = 'pointer';
    
    const bg = new Graphics();
    bg.roundRect(0, 0, 40, 40, 8);
    bg.fill(0x333333);
    bg.stroke({ width: 2, color: 0xff6b35 });
    container.addChild(bg);
    
    const x = new Text({
      text: '×',
      style: new TextStyle({
        fontSize: 28,
        fill: 0xFFFFFF,
        fontWeight: 'bold',
      }),
    });
    x.anchor.set(0.5, 0.5);
    x.position.set(20, 18);
    container.addChild(x);
    
    container.on('pointerdown', () => {
      this.hide();
    });
    
    return container;
  }
  
  /**
   * Create info panel
   */
  private createInfoPanel(): Container {
    const container = new Container();
    
    const bg = new Graphics();
    bg.roundRect(0, 0, 200, 250, 10);
    bg.fill({ color: 0x2a2a3e, alpha: 0.9 });
    bg.stroke({ width: 1, color: 0x444455 });
    container.addChild(bg);
    
    const title = new Text({
      text: 'Cell Info',
      style: new TextStyle({
        fontSize: 16,
        fill: 0xff6b35,
        fontWeight: 'bold',
      }),
    });
    title.position.set(10, 10);
    container.addChild(title);
    
    // Placeholder info text
    const infoText = new Text({
      text: 'Click a cell to\nview information',
      style: new TextStyle({
        fontSize: 12,
        fill: 0xAAAAAA,
      }),
    });
    infoText.position.set(10, 40);
    infoText.label = 'infoText';
    container.addChild(infoText);
    
    // Attack button (hidden initially)
    const attackBtn = this.createButton('Attack', () => {
      if (this.selectedCell && this.selectedCell.uid) {
        this.attackCell(this.selectedCell);
      }
    });
    attackBtn.position.set(10, 200);
    attackBtn.visible = false;
    attackBtn.label = 'attackButton';
    container.addChild(attackBtn);
    
    return container;
  }
  
  /**
   * Create a button
   */
  private createButton(text: string, onClick: () => void): Container {
    const container = new Container();
    container.eventMode = 'static';
    container.cursor = 'pointer';
    
    const bg = new Graphics();
    bg.roundRect(0, 0, 180, 40, 5);
    bg.fill(0xff6b35);
    container.addChild(bg);
    
    const label = new Text({
      text,
      style: new TextStyle({
        fontSize: 14,
        fill: 0xFFFFFF,
        fontWeight: 'bold',
      }),
    });
    label.anchor.set(0.5, 0.5);
    label.position.set(90, 20);
    container.addChild(label);
    
    container.on('pointerdown', onClick);
    
    return container;
  }
  
  /**
   * Setup interaction
   */
  private setupInteraction(): void {
    this.cellsContainer.eventMode = 'static';
    
    this.cellsContainer.on('pointerdown', (e) => {
      this.isDragging = true;
      this.dragStartX = e.global.x;
      this.dragStartY = e.global.y;
    });
    
    this.cellsContainer.on('pointerup', () => {
      this.isDragging = false;
    });
    
    this.cellsContainer.on('pointerupoutside', () => {
      this.isDragging = false;
    });
    
    this.cellsContainer.on('pointermove', (e) => {
      if (this.isDragging) {
        const dx = e.global.x - this.dragStartX;
        const dy = e.global.y - this.dragStartY;
        
        this.viewX -= dx / this.cellSize;
        this.viewY -= dy / this.cellSize;
        
        this.dragStartX = e.global.x;
        this.dragStartY = e.global.y;
        
        this.renderCells();
      }
    });
  }
  
  /**
   * Show the world map
   */
  async show(): Promise<void> {
    this.container.visible = true;
    
    // Load map data from server
    await this.loadMapData();
    
    // Center on player
    this.centerOnPlayer();
    
    // Render cells
    this.renderCells();
    
    globalEvents.emit(GAME_EVENTS.WORLDMAP_OPENED);
  }
  
  /**
   * Hide the world map
   */
  hide(): void {
    this.container.visible = false;
    globalEvents.emit(GAME_EVENTS.WORLDMAP_CLOSED);
  }
  
  /**
   * Check if world map is visible
   */
  isVisible(): boolean {
    return this.container.visible;
  }
  
  /**
   * Load map data from server
   */
  private async loadMapData(): Promise<void> {
    try {
      const response = await network.getWorldMap(
        Math.floor(this.viewX - this.visibleCells / 2),
        Math.floor(this.viewY - this.visibleCells / 2),
        this.visibleCells + 2,
        this.visibleCells + 2
      );
      
      if (response && response.cells) {
        this.cells.clear();
        for (const cell of response.cells) {
          const key = `${cell.x},${cell.y}`;
          this.cells.set(key, cell);
        }
        
        if (response.playerX !== undefined && response.playerY !== undefined) {
          this.playerCell = { x: response.playerX, y: response.playerY };
        }
      }
    } catch (error) {
      console.warn('Failed to load world map data:', error);
      // Generate placeholder data
      this.generatePlaceholderData();
    }
  }
  
  /**
   * Generate placeholder map data for testing
   */
  private generatePlaceholderData(): void {
    this.cells.clear();
    
    for (let x = -10; x <= 10; x++) {
      for (let y = -10; y <= 10; y++) {
        const cell: WorldMapCell = {
          x,
          y,
          terrainType: Math.random() > 0.7 ? 1 : 0, // 30% mountain
        };
        
        // Add some random players
        if (Math.random() > 0.9 && (x !== 0 || y !== 0)) {
          cell.uid = 1000 + Math.floor(Math.random() * 9000);
          cell.username = `Player${cell.uid}`;
          cell.level = Math.floor(Math.random() * 50) + 1;
          cell.baseValue = Math.floor(Math.random() * 1000000);
        }
        
        this.cells.set(`${x},${y}`, cell);
      }
    }
    
    // Set player position
    this.playerCell = { x: 0, y: 0 };
    const playerCellData: WorldMapCell = {
      x: 0,
      y: 0,
      uid: game.state.playerId,
      username: game.state.playerName || 'You',
      level: game.state.playerLevel,
      terrainType: 0,
    };
    this.cells.set('0,0', playerCellData);
  }
  
  /**
   * Center view on player
   */
  centerOnPlayer(): void {
    this.viewX = this.playerCell.x;
    this.viewY = this.playerCell.y;
  }
  
  /**
   * Render visible cells
   */
  private renderCells(): void {
    this.cellsContainer.removeChildren();
    
    const startX = Math.floor(this.viewX - this.visibleCells / 2);
    const startY = Math.floor(this.viewY - this.visibleCells / 2);
    
    for (let x = 0; x < this.visibleCells; x++) {
      for (let y = 0; y < this.visibleCells; y++) {
        const cellX = startX + x;
        const cellY = startY + y;
        const key = `${cellX},${cellY}`;
        const cellData = this.cells.get(key);
        
        const cellGraphic = this.createCellGraphic(cellX, cellY, cellData);
        cellGraphic.position.set(x * this.cellSize, y * this.cellSize);
        this.cellsContainer.addChild(cellGraphic);
      }
    }
  }
  
  /**
   * Create a cell graphic
   */
  private createCellGraphic(x: number, y: number, cellData?: WorldMapCell): Container {
    const container = new Container();
    container.eventMode = 'static';
    container.cursor = 'pointer';
    
    const bg = new Graphics();
    
    // Determine color based on cell content
    let color = 0x2d5a27; // Default grass
    
    if (cellData) {
      if (cellData.terrainType === 1) {
        color = 0x5a5a5a; // Mountain
      }
      
      if (cellData.uid) {
        if (cellData.uid === game.state.playerId) {
          color = 0x4169E1; // Player's base - blue
        } else {
          color = 0xCD853F; // Other player - brown
        }
      }
    }
    
    bg.rect(1, 1, this.cellSize - 2, this.cellSize - 2);
    bg.fill(color);
    bg.stroke({ width: 1, color: 0x333333 });
    container.addChild(bg);
    
    // Add level indicator for player bases
    if (cellData?.uid && cellData.level) {
      const levelText = new Text({
        text: `${cellData.level}`,
        style: new TextStyle({
          fontSize: 10,
          fill: 0xFFFFFF,
          fontWeight: 'bold',
        }),
      });
      levelText.anchor.set(0.5, 0.5);
      levelText.position.set(this.cellSize / 2, this.cellSize / 2);
      container.addChild(levelText);
    }
    
    // Click handler
    container.on('pointerdown', (e) => {
      e.stopPropagation();
      this.selectCell(x, y, cellData);
    });
    
    return container;
  }
  
  /**
   * Select a cell
   */
  private selectCell(x: number, y: number, cellData?: WorldMapCell): void {
    this.selectedCell = cellData || { x, y, terrainType: 0 };
    this.updateInfoPanel();
  }
  
  /**
   * Update info panel with selected cell data
   */
  private updateInfoPanel(): void {
    const infoText = this.infoPanel.getChildByLabel('infoText') as Text;
    const attackBtn = this.infoPanel.getChildByLabel('attackButton') as Container;
    
    if (!this.selectedCell) {
      infoText.text = 'Click a cell to\nview information';
      attackBtn.visible = false;
      return;
    }
    
    let info = `Position: (${this.selectedCell.x}, ${this.selectedCell.y})\n`;
    
    if (this.selectedCell.uid) {
      info += `\nPlayer: ${this.selectedCell.username || 'Unknown'}\n`;
      info += `Level: ${this.selectedCell.level || '?'}\n`;
      info += `Base Value: ${this.formatNumber(this.selectedCell.baseValue || 0)}\n`;
      
      if (this.selectedCell.protected) {
        info += '\nStatus: Protected';
        attackBtn.visible = false;
      } else if (this.selectedCell.uid === game.state.playerId) {
        info += '\nThis is your base';
        attackBtn.visible = false;
      } else {
        attackBtn.visible = true;
      }
    } else {
      if (this.selectedCell.terrainType === 1) {
        info += '\nTerrain: Mountain';
      } else {
        info += '\nEmpty cell';
      }
      attackBtn.visible = false;
    }
    
    infoText.text = info;
  }
  
  /**
   * Format number with commas
   */
  private formatNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  /**
   * Attack a cell
   */
  private async attackCell(cell: WorldMapCell): Promise<void> {
    if (!cell.uid) return;
    
    console.log(`Initiating attack on ${cell.username} at (${cell.x}, ${cell.y})`);
    
    try {
      // Load enemy base
      const baseData = await network.loadBase(cell.uid, 0);
      
      if (baseData) {
        // Close world map
        this.hide();
        
        // Emit event to start attack
        globalEvents.emit(GAME_EVENTS.ATTACK_STARTED, {
          targetId: cell.uid,
          targetName: cell.username,
          baseData,
        });
      }
    } catch (error) {
      console.error('Failed to load enemy base:', error);
    }
  }
  
  /**
   * Resize handler
   */
  onResize(width: number, height: number): void {
    // Update background
    const bg = this.container.getChildAt(0) as Graphics;
    bg.clear();
    bg.rect(0, 0, width, height);
    bg.fill(0x1a1a2e);
    
    // Update positions
    const title = this.uiContainer.getChildAt(0) as Text;
    title.position.set(width / 2, 20);
    
    this.closeButton.position.set(width - 60, 20);
    this.infoPanel.position.set(width - 220, 70);
    
    this.mapContainer.position.set(
      width / 2 - (this.visibleCells * this.cellSize) / 2,
      height / 2 - (this.visibleCells * this.cellSize) / 2 + 30
    );
  }
  
  /**
   * Destroy the world map
   */
  destroy(): void {
    this.container.destroy({ children: true });
  }
}
