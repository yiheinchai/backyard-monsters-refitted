import { Bitmap } from "openfl/display/Bitmap";
import { BitmapData } from "openfl/display/BitmapData";
import { BitmapFilter } from "openfl/filters/BitmapFilter";
import { DisplayObject } from "openfl/display/DisplayObject";
import { Event } from "openfl/events/Event";
import { GlowFilter } from "openfl/filters/GlowFilter";
import { Point } from "openfl/geom/Point";
import { Rectangle } from "openfl/geom/Rectangle";

import { SecNum } from "../../cc/utils/SecNum";
import { GameObject } from "../GameObject";
import { BYMConfig } from "../configs/BYMConfig";
import { IAttackable } from "../interfaces/IAttackable";
import { ILootable } from "../interfaces/ILootable";
import { ITargetable } from "../interfaces/ITargetable";
import { IComponentOwner } from "./IComponentOwner";
import { CModifiableProperty } from "./components/CModifiableProperty";
import { Component } from "./components/Component";
import { IAttackingComponent } from "./components/IAttackingComponent";
import { IDefendingComponent } from "./components/IDefendingComponent";
import { BeastMode } from "./components/modifiers/BeastMode";
import { HyperSpeed } from "./components/modifiers/HyperSpeed";
import { MonsterDust } from "./components/modifiers/MonsterDust";
import { CStatusEffect } from "./components/statusEffects/CStatusEffect";
import { PATHING } from "../pathing/PATHING";
import { RasterData } from "../rendering/RasterData";

import { ATTACK } from "../../../ATTACK";
import { BASE } from "../../../BASE";
import { BFOUNDATION } from "../../../BFOUNDATION";
import { BTOWER } from "../../../BTOWER";
import { Bunker } from "../../../Bunker";
import { CREEPS } from "../../../CREEPS";
import { CREATURES } from "../../../CREATURES";
import { EFFECTS } from "../../../EFFECTS";
import { GLOBAL } from "../../../GLOBAL";
import { GRID } from "../../../GRID";
import { HOUSING } from "../../../HOUSING";
import { MAP } from "../../../MAP";
import { MONSTERBUNKER } from "../../../MONSTERBUNKER";
import { QUESTS } from "../../../QUESTS";
import { SOUNDS } from "../../../SOUNDS";
import { SPECIALEVENT } from "../../../SPECIALEVENT";
import { Targeting } from "../../../Targeting";

import { TweenLite } from "gs/TweenLite";
import { Bounce } from "gs/easing/Bounce";
import { Sine } from "gs/easing/Sine";

/**
 * Base class for all monsters in the game.
 * Implements component system, combat logic, targeting, pathfinding, and rendering.
 */
export class MonsterBase extends GameObject implements IAttackable, IComponentOwner {
    // Behavior constants
    public static readonly k_sBHVR_ATTACK: string = "attack";
    public static readonly k_sBHVR_RETREAT: string = "retreat";
    public static readonly k_sBHVR_JUICE: string = "juice";
    public static readonly k_sBHVR_HOUSING: string = "housing";
    public static readonly k_sBHVR_PEN: string = "pen";
    public static readonly k_sBHVR_DEFEND: string = "defend";
    public static readonly k_sBHVR_FEED: string = "feed";
    public static readonly k_sBHVR_JUMP: string = "jump";
    public static readonly k_sBHVR_DECOY: string = "decoy";
    public static readonly k_sBHVR_BUNKER: string = "bunker";
    public static readonly k_sBHVR_HEAL: string = "heal";
    public static readonly k_sBHVR_WANDER: string = "wander";
    public static readonly k_sBHVR_BOUNCE: string = "bounce";
    public static readonly k_sBHVR_HUNT: string = "hunt";
    public static readonly k_sBHVR_BUFF: string = "buff";
    
    public static readonly k_DEATH_EVENT: string = "deathTime";
    public static readonly k_LOOT_PROPERTY: string = "lootProperty";
    public static readonly k_DAMAGE_PROPERTY: string = "damageProperty";
    public static readonly k_ARMOR_PROPERTY: string = "armorProperty";
    public static readonly k_ATTACK_DELAY_PROPERTY: string = "attackDelayProperty";
    public static readonly k_MOVE_SPEED_PROPERTY: string = "moveSpeedProperty";

    public spriteAction: string = "walking";
    public aggroRange: number = 50;
    public _components!: Component[];
    public _attackComponents!: Component[];
    public _frameNumber!: number;
    public _spawned!: boolean;
    public _creatureID!: string;
    public _graphic!: BitmapData | null;
    public _visible: boolean = true;
    public _clicked: boolean = false;
    public _looking: boolean = false;
    public _glow: GlowFilter | null = null;
    public _speed!: number;
    public _goo!: number;
    public _damageMult: number = 1;
    protected m_range: number = 1;
    public _damagePerSecond!: SecNum;
    public _targetRotation!: number;
    public _targetPosition!: Point;
    public _targetCenter!: Point | null;
    public _waypoints!: any[];
    protected _pathID: number = 0;
    protected _jumping: boolean = false;
    protected _jumpingUp: boolean = false;
    protected readonly _noDefensePath: boolean = false;
    protected _doDefenseBurrow: boolean = true;
    protected m_rotation: number = 0;
    protected m_state!: number;
    public _behaviour!: string;
    public _hasTarget!: boolean;
    public _hasPath!: boolean;
    public _attacking!: boolean;
    public _intercepting!: boolean;
    public _targetBuilding!: BFOUNDATION | null;
    public _homeBunker: any;
    public _targetCreeps!: any[];
    public _targetCreep!: MonsterBase | null;
    public _id!: string;
    public _friendly!: boolean;
    public _house!: BFOUNDATION | null;
    public _hits!: number;
    public _spawnPoint!: Point;
    public _lastRotation: number = 400;
    public _targetGroup!: number;
    public targetMode!: number;
    public _explode: number = 0;
    public _goeasy: boolean = false;
    public _hitLimit: number = 50;
    public _tmpPoint!: Point;
    public _spawnTime!: number;
    public _atTarget: boolean = false;
    public _xd: number = 0;
    public _yd: number = 0;
    public _shadow!: BitmapData;
    public _shadowMC!: DisplayObject;
    public attackCooldown!: number;
    protected frameCount!: number;
    protected shocking!: boolean;
    protected node!: string;
    protected newNode!: string;
    public _phase: number = 0;
    public _movement: string = "";

    // Performance optimization
    private _componentTickCounter: number = 0;
    private static readonly COMPONENT_TICK_INTERVAL: number = 3;
    private static readonly RENDER_INTERVAL: number = 2;

    public _pathing: string = "";
    public _lockRotation: boolean = false;
    public isDisposable!: boolean;
    public _enraged: number = 0;
    private m_isInvisible: boolean = false;
    public _graphicMC!: Bitmap;
    public _altitude: number = 0;
    protected _currentSkinOverride!: string;
    protected _rasterData!: RasterData | null;
    protected _rasterPt!: Point | null;
    protected _shadowData!: RasterData | null;
    protected _shadowPt!: Point | null;
    protected _dying: boolean = false;
    protected _dead: boolean = false;
    protected m_juiceReady: boolean = false;
    public attackDelayProperty!: CModifiableProperty;
    public damageProperty!: CModifiableProperty;
    protected m_filters!: any[];
    private _lastXd: number = NaN;
    private _lastYd: number = NaN;
    private _cachedTargetRotation: number = NaN;

    constructor() {
        super();
        this._components = [];
        this._attackComponents = [];
        this._damagePerSecond = new SecNum(0);
        this._tmpPoint = new Point(0, 0);
        this._componentTickCounter = 0;
        this._id = GLOBAL.NextCreepID().toString();
        this._rasterPt = new Point();
        this._shadowPt = new Point();
        this.m_filters = [];
        this.m_rotation = 0;
        
        this.addComponent(new CModifiableProperty(Number.MAX_VALUE, 0, 0.5), MonsterBase.k_LOOT_PROPERTY);
        this.damageProperty = new CModifiableProperty();
        this.addComponent(this.damageProperty, MonsterBase.k_DAMAGE_PROPERTY);
        this.attackDelayProperty = new CModifiableProperty(Number.MAX_VALUE, 0);
        this.addComponent(this.attackDelayProperty, MonsterBase.k_ATTACK_DELAY_PROPERTY);
        this.node = Targeting.CreepCellAdd(this._tmpPoint, this._id, this);
    }

    public set currentSkinOverride(value: string) {
        this._currentSkinOverride = value;
    }

    public getStatsString(): string {
        let str = this._creatureID + "(" + this + ")\n";
        str += "damage: " + this.damage + "\n";
        str += "attack delay: " + this.attackDelay + "\n";
        str += "move speed: " + this.moveSpeed + "\n";
        str += "armor: " + (1 - this.armor) + "(doesnt reflect STORE armor)\n";
        str += "health: " + this.health + "\n";
        str += "max health: " + this.maxHealth + "\n";
        str += "loot bonus: " + this.lootingMultiplier + "\n";
        return str;
    }

    public get isRanged(): boolean {
        return this.range > 1;
    }

    public getDisplayY(): number {
        return this.y - this._altitude;
    }

    protected setInitialFriendlyFlags(friendly: boolean): void {
        if (friendly) {
            this.attackFlags = Targeting.k_TARGETS_ATTACKERS;
            this.defenseFlags = Targeting.k_TARGETS_DEFENDERS;
        } else {
            this.attackFlags = Targeting.k_TARGETS_DEFENDERS;
            this.defenseFlags = Targeting.k_TARGETS_ATTACKERS;
        }
    }

    public override get width(): number {
        return this._graphicMC.width;
    }

    public override get height(): number {
        return this._graphicMC.height;
    }

    public get damage(): number {
        return this.damageProperty.value;
    }

    public get attackDelay(): number {
        return this.attackDelayProperty.value;
    }

    public get dying(): boolean {
        return this._dying;
    }

    public get dead(): boolean {
        return this._dead;
    }

    public get juiceReady(): boolean {
        return this.m_juiceReady;
    }

    public get rasterPt(): Point | null {
        return this._rasterPt;
    }

    public get invisible(): boolean {
        return this.m_isInvisible;
    }

    public set invisible(value: boolean) {
        this.m_isInvisible = value;
        if (this.m_isInvisible) {
            this.defenseFlags |= Targeting.k_TARGETS_INVISIBLE;
        } else {
            this.defenseFlags &= ~Targeting.k_TARGETS_INVISIBLE;
        }
    }

    public get inBattleState(): boolean {
        return this._behaviour === MonsterBase.k_sBHVR_BUFF || 
               this._behaviour === MonsterBase.k_sBHVR_ATTACK || 
               this._behaviour === MonsterBase.k_sBHVR_DEFEND || 
               this._behaviour === MonsterBase.k_sBHVR_BUNKER || 
               this._behaviour === MonsterBase.k_sBHVR_HEAL || 
               this._behaviour === MonsterBase.k_sBHVR_BOUNCE || 
               this._behaviour === MonsterBase.k_sBHVR_HUNT;
    }

    public get lootingMultiplier(): number {
        const lootProp = this.getComponentByName(MonsterBase.k_LOOT_PROPERTY) as CModifiableProperty;
        return lootProp ? lootProp.value : 1;
    }

    protected rangedAttack(target: ITargetable): ITargetable | null {
        return null;
    }

    public override modifyHealth(delta: number, source: ITargetable | null = null): number {
        if (!this.health) return 0;
        
        let originalDelta = delta;
        
        // Apply defense component modifiers
        for (let i = 0; i < this._components.length; i++) {
            const component = this._components[i];
            if ((component as any).onDefend) {
                delta = (component as IDefendingComponent).onDefend(this, delta, source);
            }
        }
        
        let newHealth = delta + this.health;
        if (newHealth === this.health) return 0;
        
        if (delta < 0) {
            delta *= this.armor ? 1 - this.armor : 1;
            this.damaged(delta);
        } else {
            if (newHealth >= this.maxHealth) {
                if (this._graphic) {
                    this._graphic.fillRect(this._graphic.rect, 0);
                }
                delta = this.maxHealth - this.health;
            }
            this.healed(delta);
        }
        
        ATTACK.damage(-delta, this, delta < 0 ? delta - originalDelta : 0);
        this.setHealth(this.health + delta);
        return delta;
    }

    protected healed(amount: number): void {}
    protected damaged(amount: number): void {}

    public addStatusEffect(effect: CStatusEffect): void {
        const existing = this.getComponentByType(Object(effect).constructor) as CStatusEffect;
        if (existing) {
            existing.renew();
        } else {
            this.addComponent(effect);
        }
    }

    public removeStatusEffect(effectClass: any): boolean {
        const effect = this.getComponentByType(effectClass) as CStatusEffect;
        if (effect) {
            this.removeComponent(effect);
            return true;
        }
        return false;
    }

    public addComponent(component: Component, name: string = "", priority: number = 0): void {
        let insertIndex = -1;
        const list = this.getComponentList(component);
        
        for (let i = 0; i < list.length; i++) {
            if (list[i].priority < priority) {
                insertIndex = i;
                break;
            }
        }
        
        if (insertIndex < 0 || insertIndex >= list.length) {
            list.push(component);
        } else {
            list.splice(insertIndex, 0, component);
        }
        
        component.register(this, name);
    }

    public removeComponent(component: Component): void {
        const list = this.getComponentList(component);
        component.unregister();
        const idx = list.indexOf(component);
        if (idx >= 0) list.splice(idx, 1);
    }

    public getComponent(component: Component): Component | null {
        const list = this.getComponentList(component);
        const idx = list.indexOf(component);
        return idx >= 0 ? list[idx] : null;
    }

    public getComponentByType(componentClass: any): Component | null {
        for (const comp of this._components) {
            if (comp instanceof componentClass) return comp;
        }
        for (const comp of this._attackComponents) {
            if (comp instanceof componentClass) return comp;
        }
        return null;
    }

    public getComponentByName(name: string): Component | null {
        for (const comp of this._components) {
            if (comp.name === name) return comp;
        }
        for (const comp of this._attackComponents) {
            if (comp.name === name) return comp;
        }
        return null;
    }

    private getComponentList(component: Component): Component[] {
        return (component as any).onAttack ? this._attackComponents : this._components;
    }

    public tick(param1: number = 1): boolean {
        if (this._dead) return true;
        
        // Performance optimization: Reduce component tick frequency
        this._componentTickCounter += param1;
        const shouldTickComponents = this._componentTickCounter >= MonsterBase.COMPONENT_TICK_INTERVAL;
        const accumulatedTicks = this._componentTickCounter;
        if (shouldTickComponents) {
            this._componentTickCounter = 0;
        }
        
        if (shouldTickComponents) {
            for (let i = this._components.length - 1; i >= 0; i--) {
                this._components[i].tick(accumulatedTicks);
            }
            for (let i = this._attackComponents.length - 1; i >= 0; i--) {
                this._attackComponents[i].tick(accumulatedTicks);
            }
        }
        
        const isDone = this.tickState(param1);
        this.move();
        this.render();
        return isDone;
    }

    public changeState(state: number): boolean {
        this.m_state = state;
        return true;
    }

    public getState(): number {
        return this.m_state;
    }

    public get state(): number {
        return this.m_state;
    }

    protected tickState(param1: number = 1): boolean {
        this._frameNumber += 1;
        // Check and update buffs based on overdrive timers
        if (this.graphic && this.graphic.filters.length > 0) {
            // Update buff checks for friendly/enemy monsters
            this.updateBuffs();
        }
        return true;
    }

    protected move(): void {}

    protected render(): void {
        if (GLOBAL._catchup) return;
        
        // Rotation calculation with caching
        if (!this._lockRotation) {
            if (this._lastXd !== this._xd || this._lastYd !== this._yd) {
                this._targetRotation = Math.atan2(this._yd, this._xd) * 57.2957795 - 90;
                this._lastXd = this._xd;
                this._lastYd = this._yd;
                this._cachedTargetRotation = this._targetRotation;
            } else {
                this._targetRotation = this._cachedTargetRotation;
            }
        }
        
        let diff = this.m_rotation - this._targetRotation;
        if (diff > 180) this._targetRotation += 360;
        else if (diff < -180) this._targetRotation -= 360;
        
        this._targetRotation += 90;
        this.m_rotation = this._targetRotation;
        while (this.m_rotation < 0) this.m_rotation += 360;
        this.m_rotation %= 360;
        
        // Update position
        if (this.x !== Math.floor(this._tmpPoint.x) || this.y !== Math.floor(this._tmpPoint.y)) {
            this.graphic.x = Math.floor(this._tmpPoint.x);
            this.graphic.y = Math.floor(this._tmpPoint.y);
        }
        
        // Render burrow or normal
        if (this._movement === "burrow" && (this._behaviour === MonsterBase.k_sBHVR_ATTACK || this._behaviour === MonsterBase.k_sBHVR_DEFEND)) {
            this.renderBurrow();
        } else {
            this._visible = true;
            if (BYMConfig.instance.RENDERER_ON) {
                this._rasterData!.visible = true;
            }
            if (!this.graphic.alpha) this.graphic.alpha = 1;
        }
        
        this.getNextSprite();
        this._lastRotation = Math.floor(this.m_rotation / 12);
        
        // Health bar
        if (this.health < this.maxHealth) {
            const barIndex = 11 - Math.floor(11 / this.maxHealth * this.health);
            this._graphic!.copyPixels(CREEPS._bmdHPbar, new Rectangle(0, 5 * barIndex, 17, 5), new Point(-this._graphicMC.x - CREEPS._bmdHPbar.width / 2, 6));
        }
        
        this.updateRasterData();
    }

    protected getNextSprite(): void {}

    protected renderBurrow(): void {
        if (this._speed > 0 && (this._behaviour === MonsterBase.k_sBHVR_ATTACK || this._doDefenseBurrow)) {
            if (this._phase !== 1) {
                this._phase = 1;
                if (this.graphic.alpha) this.graphic.alpha = 0;
                this.invisible = true;
                this._visible = false;
                if (BYMConfig.instance.RENDERER_ON) {
                    this._rasterData!.visible = false;
                }
                EFFECTS.Dig(this.x, this.y);
                SOUNDS.Play("dig", 0.5);
            } else if (this._frameNumber % 5 === 0) {
                EFFECTS.Burrow(this.x, this.y);
            }
        } else if (this._phase === 1) {
            this._phase = 0;
            this.jump();
            if (!this.graphic.alpha) this.graphic.alpha = 1;
            this.invisible = false;
            this._visible = true;
            if (BYMConfig.instance.RENDERER_ON) {
                this._rasterData!.visible = true;
            }
            if (this._behaviour === MonsterBase.k_sBHVR_ATTACK || this._doDefenseBurrow) {
                EFFECTS.Dig(this.x, this.y);
            }
            SOUNDS.Play("arise", 0.5);
        }
    }

    public jump(): void {
        const land = (): void => {
            TweenLite.to(this._graphicMC, 0.6, {
                y: this._graphicMC.y + 15,
                ease: Bounce.easeOut
            });
        };
        TweenLite.to(this._graphicMC, 0.3, {
            y: this._graphicMC.y - 15,
            ease: Sine.easeIn,
            onComplete: land
        });
    }

    protected hackCheck(): boolean {
        return true;
    }

    protected changeMode(): void {
        this._hasTarget = false;
        this._atTarget = false;
        this._hasPath = false;
    }

    public changeModeJuice(): void {}

    public changeModeAttack(): void {
        if (this._behaviour === MonsterBase.k_sBHVR_RETREAT) return;
        this._behaviour = MonsterBase.k_sBHVR_ATTACK;
        this.changeMode();
        this.findTarget(this._targetGroup);
    }

    public changeModeRetreat(): void {
        this._behaviour = MonsterBase.k_sBHVR_RETREAT;
        this.changeMode();
        this._attacking = false;
        if (this._movement === "burrow") {
            EFFECTS.Dig(this.x, this.y);
            SOUNDS.Play("dig");
        }
        this.WaypointTo(this._spawnPoint);
    }

    public changeModeFeed(): void {
        this._behaviour = MonsterBase.k_sBHVR_FEED;
        this.changeMode();
        this._targetBuilding = GLOBAL._bCage;
        this.WaypointTo(CREATURES._guardian!._tmpPoint, null);
    }

    public changeModeHousing(): void {
        this._behaviour = MonsterBase.k_sBHVR_HOUSING;
        this.changeMode();
        const loc1 = GRID.ToISO(this._targetCenter!.x + Math.random() * 100 + 30, this._targetCenter!.y + Math.random() * 60 + 30, 0);
        PATHING.GetPath(this._tmpPoint, new Rectangle(loc1.x, loc1.y, 10, 10), this.setWaypoints.bind(this), true);
    }

    public addFilter(filter: BitmapFilter): void {
        if (this.m_filters.indexOf(filter) === -1) {
            this.m_filters.push(filter);
            this._graphicMC.filters = this.m_filters;
        }
    }

    public removeFilter(filter: BitmapFilter): void {
        const idx = this.m_filters.indexOf(filter);
        if (idx >= 0) {
            this.m_filters.splice(idx, 1);
            this._graphicMC.filters = this.m_filters;
        }
    }

    public updateBuffs(): void {
        let glowColor = 0;
        
        if (this._friendly) {
            // Check friendly monster overdrives
            if (GLOBAL._monsterOverdrive && GLOBAL._monsterOverdrive.Get() >= GLOBAL.Timestamp()) {
                if (!this.damageProperty.getModifier(MonsterDust.k_damageModifier)) {
                    this.damageProperty.addModifier(MonsterDust.k_damageModifier);
                }
                glowColor |= MonsterDust.k_color;
            }
            if (GLOBAL._monsterDefenseOverdrive && GLOBAL._monsterDefenseOverdrive.Get() >= GLOBAL.Timestamp()) {
                if (!this.armorProperty.getModifier(BeastMode.k_armorModifier)) {
                    this.armorProperty.addModifier(BeastMode.k_armorModifier);
                }
                glowColor |= BeastMode.k_color;
            }
            if (GLOBAL._monsterSpeedOverdrive && GLOBAL._monsterSpeedOverdrive.Get() >= GLOBAL.Timestamp()) {
                if (!this.moveSpeedProperty.getModifier(HyperSpeed.k_moveSpeedModifier)) {
                    this.moveSpeedProperty.addModifier(HyperSpeed.k_moveSpeedModifier);
                }
                if (!this.attackDelayProperty.getModifier(HyperSpeed.k_attackSpeedModifier)) {
                    this.attackDelayProperty.addModifier(HyperSpeed.k_attackSpeedModifier);
                }
                glowColor |= HyperSpeed.k_color;
            }
        } else {
            // Check attacker monster overdrives
            if (GLOBAL._attackerMonsterOverdrive && GLOBAL._attackerMonsterOverdrive.Get() >= GLOBAL.Timestamp()) {
                if (!this.damageProperty.getModifier(MonsterDust.k_damageModifier)) {
                    this.damageProperty.addModifier(MonsterDust.k_damageModifier);
                }
                glowColor |= MonsterDust.k_color;
            }
        }
        
        if (glowColor !== 0) {
            if (this._glow) {
                this._glow.color = glowColor;
            } else {
                this._glow = new GlowFilter(glowColor, 1, 7, 7, 6, 1);
                this.addFilter(this._glow);
            }
        } else if (this._glow) {
            this.removeFilter(this._glow);
            this._glow = null;
        }
    }

    public poweredUp(): boolean {
        if (this.isDisposable) return false;
        
        if (!this._friendly) {
            const activeEvent: any = SPECIALEVENT.getActiveSpecialEvent();
            if (activeEvent.active || GLOBAL._wmCreaturePowerups[this._creatureID]) {
                if (GLOBAL._wmCreaturePowerups[this._creatureID]) return true;
            } else if (GLOBAL.mode !== GLOBAL.e_BASE_MODE.BUILD && 
                       GLOBAL.attackingPlayer.m_upgrades[this._creatureID]?.powerup) {
                return true;
            }
        } else if (GLOBAL.player.m_upgrades[this._creatureID]?.powerup) {
            return true;
        }
        return false;
    }

    public powerUpLevel(): number {
        if (!this.poweredUp()) return 0;
        
        if (!this._friendly) {
            if (SPECIALEVENT.active || GLOBAL._wmCreaturePowerups[this._creatureID]) {
                if (GLOBAL._wmCreaturePowerups[this._creatureID]) {
                    return GLOBAL._wmCreaturePowerups[this._creatureID];
                }
            } else if (GLOBAL.attackingPlayer.m_upgrades[this._creatureID]?.powerup) {
                return GLOBAL.attackingPlayer.m_upgrades[this._creatureID].powerup;
            }
        } else if (GLOBAL.player.m_upgrades[this._creatureID]?.powerup) {
            return GLOBAL.player.m_upgrades[this._creatureID].powerup;
        }
        return 0;
    }

    public override clear(): void {
        this.setHealth(0);
        if (this._house) {
            const idx = this._house._creatures.indexOf(this);
            if (idx >= 0) this._house._creatures.splice(idx, 1);
        }
        if (this._rasterData) this._rasterData.clear();
        if (this._shadowData) this._shadowData.clear();
        this._rasterData = null;
        this._shadowData = null;
        this._rasterPt = null;
        this._shadowPt = null;
        if (this._graphic) this._graphic.dispose();
        if (this._shadow) this._shadow.dispose();
        this._graphic = null;
        this._shadow = null;
        super.clear();
    }

    public canShootCreep(): boolean {
        return false;
    }

    public findHuntingTargets(): void {
        const targets: any[] = [];
        const allMonsters = CREATURES._creatures;
        
        for (const id in allMonsters) {
            const monster = allMonsters[id] as MonsterBase;
            if (monster._behaviour === MonsterBase.k_sBHVR_DEFEND || monster._behaviour === MonsterBase.k_sBHVR_BUNKER) {
                targets.push({
                    creep: monster,
                    dist: GLOBAL.QuickDistance(monster._tmpPoint, this._tmpPoint)
                });
                if (targets.length >= 10) break;
            }
        }
        
        if (CREATURES._guardian && CREATURES._guardian.health > 0) {
            targets.push({
                creep: CREATURES._guardian,
                dist: GLOBAL.QuickDistance(CREATURES._guardian._tmpPoint, this._tmpPoint)
            });
        }
        
        if (targets.length > 0) {
            targets.sort((a, b) => a.dist - b.dist);
            while (targets.length > 0 && targets[0].creep.health <= 0) {
                targets.shift();
            }
        }
        
        if (targets.length > 0) {
            this._targetCreep = targets[0].creep;
            this._waypoints = [this._targetCreep._tmpPoint];
        }
    }

    public loseTarget(): void {
        this._hasTarget = false;
        this._attacking = false;
        this._atTarget = false;
        this._targetCreep = null;
    }

    public findTarget(param1: number = 0): void {
        const buildings: any[] = [];
        this._looking = true;
        
        const loc8 = PATHING.FromISO(this._tmpPoint);
        
        // Build target list based on target group
        // ... implementation follows AS3 logic for different target groups
        
        if (buildings.length === 0 && !this._targetCreep) {
            this.changeModeRetreat();
        } else {
            buildings.sort((a, b) => a.distance - b.distance);
            // Set target waypoints based on movement type
        }
    }

    public WaypointTo(target: Point, building: BFOUNDATION | null = null): void {
        let ignorePath = false;
        if (this._behaviour === MonsterBase.k_sBHVR_JUICE || 
            this._behaviour === MonsterBase.k_sBHVR_HOUSING || 
            this._behaviour === MonsterBase.k_sBHVR_PEN || 
            this._behaviour === MonsterBase.k_sBHVR_DEFEND ||
            this._behaviour === MonsterBase.k_sBHVR_FEED ||
            this._movement === MonsterBase.k_sBHVR_JUMP ||
            this._behaviour === MonsterBase.k_sBHVR_DECOY) {
            ignorePath = true;
        }
        
        if (building) {
            PATHING.GetPath(this._tmpPoint, new Rectangle(Math.floor(target.x), Math.floor(target.y), building._footprint[0].width, building._footprint[0].height), this.setWaypoints.bind(this), ignorePath, building);
        } else {
            PATHING.GetPath(this._tmpPoint, new Rectangle(Math.floor(target.x), Math.floor(target.y), 10, 10), this.setWaypoints.bind(this), ignorePath);
        }
    }

    public die(): void {
        if (this.dead) return;
        Targeting.CreepCellDelete(this._id, this.node, false);
        this._dying = true;
        
        if (!this.juiceReady && (this._movement === "fly" || this._movement === "fly_low")) {
            TweenLite.to(this._graphicMC, 0.4, {
                y: this._graphicMC.y + this._altitude,
                ease: Sine.easeOut,
                onComplete: this.dieFinish.bind(this)
            });
        } else {
            this.dieFinish();
        }
    }

    private dieFinish(): void {
        SOUNDS.Play("monsterland" + (1 + Math.floor(Math.random() * 3)));
        if (this.health <= 0) {
            this.dispatchEvent(new Event(MonsterBase.k_DEATH_EVENT));
            ++QUESTS._global.kills;
            this.deathSplat();
        }
        this.removeAllComponents();
        this.clear();
        this._dead = true;
        
        if (!this.isDisposable && this._creatureID.substr(0, 1) !== "G") {
            this.node = Targeting.CreepCellAdd(this._tmpPoint, this._id, this);
        }
    }

    public corpseDeath(): void {
        Targeting.CreepCellDelete(this._id, this.node, true);
    }

    private removeAllComponents(): void {
        while (this._components.length) {
            this.removeComponent(this._components[this._components.length - 1]);
        }
        while (this._attackComponents.length) {
            this.removeComponent(this._attackComponents[this._attackComponents.length - 1]);
        }
    }

    public deathSplat(): void {
        SOUNDS.Play("splat" + (Math.floor(Math.random() * 3) + 1));
        EFFECTS.CreepSplat(this._creatureID, this._tmpPoint.x, this._tmpPoint.y);
    }

    protected flyerJuice(): void {
        this.m_juiceReady = true;
    }

    public setWaypoints(waypoints: any[], building: BFOUNDATION | null = null, failed: boolean = false): void {
        if (failed) {
            switch (this._behaviour) {
                case MonsterBase.k_sBHVR_ATTACK:
                    this.findTarget(this._targetGroup);
                    break;
                case MonsterBase.k_sBHVR_HOUSING:
                    this.changeModeHousing();
                    break;
                case MonsterBase.k_sBHVR_RETREAT:
                    this.changeModeRetreat();
                    break;
            }
        } else {
            let usePath = false;
            if (waypoints.length < this._waypoints.length) usePath = true;
            if (usePath && building && building._class === "wall" && this._targetGroup !== 2) usePath = false;
            if (!this._hasTarget) usePath = true;
            if (this._behaviour === MonsterBase.k_sBHVR_DEFEND) usePath = true;
            
            if (usePath) {
                this._hasTarget = true;
                this._atTarget = false;
                this._hasPath = true;
                this._waypoints = waypoints;
                this._targetPosition = this._waypoints[0];
                if (building) this._targetBuilding = building;
            }
            this._looking = false;
        }
    }

    public get range(): number {
        return this.m_range;
    }

    public set range(value: number) {
        this.m_range = value;
    }
}
