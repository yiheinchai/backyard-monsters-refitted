import { ResourceBombs } from './com/monsters/effects/ResourceBombs';
import Event from 'openfl/events/Event';
import MouseEvent from 'openfl/events/MouseEvent';
import Point from 'openfl/geom/Point';
import Sprite from 'openfl/display/Sprite';
import { SIEGEWEAPONPOPUP } from './SIEGEWEAPONPOPUP';

// Lazy imports to break circular dependency chains
function getATTACK(): any { return require("./ATTACK").ATTACK; }
function getBASE(): any { return require("./BASE").BASE; }
function getBFOUNDATION(): any { return require("./BFOUNDATION").BFOUNDATION; }
function getBTOWER(): any { return require("./BTOWER").BTOWER; }
function getBUILDING22(): any { return require("./BUILDING22").BUILDING22; }
function getCREEPS(): any { return require("./CREEPS").CREEPS; }
function getMAP(): any { return require("./MAP").MAP; }
function getUI2(): any { return require("./UI2").UI2; }


/**
 * DROPZONE - Drop Zone Manager
 * Handles targeting zones for spawning creatures and siege weapons
 */
export class DROPZONE extends Sprite {
    public static readonly GROUND: number = 1;
    public static readonly BUILDINGS: number = 2;
    public static readonly MONSTERS: number = 3;
    public static readonly SIEGEWEAPON_GROUND: number = 4;
    public static readonly SIEGEWEAPON_BUILDINGS: number = 5;
    public static readonly SIEGEWEAPON_GROUND_SPECIAL: number = 6;
    public static readonly SIEGEWEAPON_GROUND_SPECIAL_RADIUS: number = 30;

    public _size: number;
    public _middle: Point;
    public _dropTarget: number = 1;
    private _targetedBuildings: BFOUNDATION[] = [];
    public ring1: any;

    constructor(size: number = 32, dropTarget: number = 1) {
        super();
        this._middle = new Point(0, 0);
        this._targetedBuildings = [];
        this._size = size;
        this._dropTarget = dropTarget;
        this.ring1 = {};
        // In original: ring1.addEventListener(MouseEvent.MOUSE_UP, this.Place);
        // ring1.addEventListener(MouseEvent.MOUSE_DOWN, getMAP().Click);
        // addEventListener(Event.ENTER_FRAME, this.Follow);
        this.Update(this._size, dropTarget);
    }

    public Update(size: number, dropTarget: number): void {
        this._size = size;
        this._dropTarget = dropTarget;
        if (this.ring1) {
            this.ring1.width = this._size * 1.2;
            this.ring1.height = this._size * 1.2 * 0.5;
        }
    }

    public Place(event: MouseEvent): void {
        if (!getMAP()._dragged && getATTACK()._countdown >= 0) {
            this.Drop();
        }
    }

    public Follow(event: Event | null = null): void {
        if (getMAP()._GROUND) {
            this.x = getMAP()._GROUND.mouseX;
            this.y = getMAP()._GROUND.mouseY;
            switch (this._dropTarget) {
                case DROPZONE.GROUND:
                    if (!getBASE().BuildingOverlap(new Point(this.x, this.y), this._size, true, true, true)) {
                        this.ring1.gotoAndStop(1);
                    } else {
                        this.ring1.gotoAndStop(2);
                    }
                    break;
                case DROPZONE.SIEGEWEAPON_GROUND:
                    if (!getBASE().BuildingOverlap(new Point(this.x, this.y), this._size, true, true, true)) {
                        this.ring1.gotoAndStop(1);
                    } else {
                        this.ring1.gotoAndStop(2);
                    }
                    this.UpdateTargetBuildings(this.x, this.y, this._size);
                    break;
                case DROPZONE.SIEGEWEAPON_GROUND_SPECIAL:
                    if (!getBASE().BuildingOverlap(new Point(this.x, this.y), DROPZONE.SIEGEWEAPON_GROUND_SPECIAL_RADIUS, true, true, true)) {
                        this.ring1.gotoAndStop(1);
                    } else {
                        this.ring1.gotoAndStop(2);
                    }
                    this.UpdateTargetBuildings(this.x, this.y, this._size);
                    break;
                case DROPZONE.BUILDINGS:
                case DROPZONE.SIEGEWEAPON_BUILDINGS:
                    if (getBASE().BuildingOverlap(new Point(this.x, this.y), this._size, true, true, true)) {
                        this.ring1.gotoAndStop(1);
                    } else {
                        this.ring1.gotoAndStop(2);
                    }
                    this.UpdateTargetBuildings(this.x, this.y, this._size);
                    break;
                case DROPZONE.MONSTERS:
                    if (getCREEPS().CreepOverlap(new Point(this.x, this.y), this._size)) {
                        this.ring1.gotoAndStop(1);
                    } else {
                        this.ring1.gotoAndStop(2);
                    }
                    break;
            }
        }
    }

    public Clear(): void {
        while (this._targetedBuildings.length) {
            this._targetedBuildings.pop()!.disableHighlight();
        }
    }

    public Destroy(): void {
        this.Clear();
        // removeEventListener(Event.ENTER_FRAME, this.Follow);
    }

    public get isOverTarget(): boolean {
        return this._targetedBuildings.length > 0;
    }

    public UpdateTargetBuildings(x: number, y: number, size: number): void {
        this.Clear();
        getBASE().GetBuildingOverlap(x, y, size, this._targetedBuildings);
        switch (this._dropTarget) {
            case DROPZONE.SIEGEWEAPON_BUILDINGS:
                for (let i = this._targetedBuildings.length - 1; i >= 0; i--) {
                    if (!(this._targetedBuildings[i] instanceof getBTOWER())) {
                        this._targetedBuildings.splice(i, 1);
                    }
                }
                break;
            case DROPZONE.SIEGEWEAPON_GROUND_SPECIAL:
                for (let i = this._targetedBuildings.length - 1; i >= 0; i--) {
                    if (!(this._targetedBuildings[i] instanceof getBUILDING22())) {
                        this._targetedBuildings.splice(i, 1);
                    }
                }
                break;
        }
        for (let i = 0; i < this._targetedBuildings.length; i++) {
            this._targetedBuildings[i].highlight(0x333399);
        }
    }

    public Drop(): void {
        let siegePopup: SIEGEWEAPONPOPUP;
        switch (this._dropTarget) {
            case DROPZONE.GROUND:
                if (!getBASE().BuildingOverlap(new Point(this.x, this.y), this._size, true, true, true)) {
                    getATTACK().Spawn(new Point(this.x, this.y), this._size / 2);
                }
                break;
            case DROPZONE.BUILDINGS:
                if (getBASE().BuildingOverlap(new Point(this.x, this.y), this._size, true, true, true)) {
                    ResourceBombs.BombDrop();
                }
                break;
            case DROPZONE.MONSTERS:
                if (getCREEPS().CreepOverlap(new Point(this.x, this.y), this._size)) {
                    ResourceBombs.BombDrop();
                }
                break;
            case DROPZONE.SIEGEWEAPON_GROUND:
                if (getBASE().BuildingOverlap(new Point(this.x, this.y), this._size, true, true, true)) {
                    break;
                }
                siegePopup = getUI2()._top._siegeweapon;
                if (siegePopup && siegePopup._state === 1) {
                    siegePopup.Fire(this.x, this.y);
                }
                break;
            case DROPZONE.SIEGEWEAPON_BUILDINGS:
                if (!getBASE().BuildingOverlap(new Point(this.x, this.y), this._size, true, true, true)) {
                    break;
                }
                siegePopup = getUI2()._top._siegeweapon;
                if (siegePopup && siegePopup._state === 1) {
                    siegePopup.Fire(this.x, this.y);
                }
                break;
            case DROPZONE.SIEGEWEAPON_GROUND_SPECIAL:
                if (getBASE().BuildingOverlap(new Point(this.x, this.y), DROPZONE.SIEGEWEAPON_GROUND_SPECIAL_RADIUS, true, true, true)) {
                    break;
                }
                siegePopup = getUI2()._top._siegeweapon;
                if (siegePopup && siegePopup._state === 1) {
                    siegePopup.Fire(this.x, this.y);
                }
                break;
        }
    }
}
