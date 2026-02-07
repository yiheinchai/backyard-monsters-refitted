import Point from "openfl/geom/Point";

import { IAttackable } from "../../../interfaces/IAttackable";
import { ITargetable } from "../../../interfaces/ITargetable";
import { Component } from "../Component";
import { IAttackingComponent } from "../IAttackingComponent";

// Lazy imports to break circular dependency chains
function getTargeting(): any { return require("../../../../../Targeting").Targeting; }
function getBFOUNDATION(): any { return require("../../../../../BFOUNDATION").BFOUNDATION; }



/**
 * Blink on attack - teleports to a new target after attacking a certain number of times.
 */
export class BlinkOnAttack extends Component implements IAttackingComponent {
    protected m_attacksToBlink: number;
    protected m_maxBlinkDistance: number;
    protected m_maxBlinkPoints: number;
    protected m_attacks: number = 0;
    protected m_blinkTarget: ITargetable | null = null;
    protected m_blinkDistance: number = 0;
    protected m_blinkPoints: number = 0;

    constructor(attacksToBlink: number = 3, maxBlinkDistance: number = 200, maxBlinkPoints: number = 10) {
        super();
        this.m_maxBlinkPoints = maxBlinkPoints;
        this.m_attacksToBlink = attacksToBlink;
        this.m_maxBlinkDistance = maxBlinkDistance;
    }

    public override tick(delta: number = 1): void {
        if (this.isBlinking()) {
            this.tickBlink();
        }
    }

    private tickBlink(): void {
        const waypoints: Array<Point> = this.owner._waypoints;
        const currentPos: Point = new Point(this.owner.x, this.owner.y);
        const hasPath: boolean = this.owner._hasPath;
        if (this.m_blinkPoints) {
            if (hasPath && Boolean(waypoints.length)) {
                const lastIdx: number = waypoints.length - 1;
                const dist: number = currentPos.subtract(waypoints[waypoints.length - 1]).length;
                this.owner._tmpPoint = Point.interpolate(currentPos, waypoints[lastIdx], 1 - this.m_blinkDistance / dist);
                --this.m_blinkPoints;
                if (this.m_blinkPoints <= 0) {
                    this.stopBlink();
                    this.owner._waypoints = [];
                }
            } else {
                this.stopBlink();
            }
        } else if (hasPath && waypoints.length > 0) {
            this.startBlink({ dist: currentPos.subtract(waypoints[waypoints.length - 1]).length / 10, creep: null });
        }
    }

    private startBlink(data: Record<string, any>): void {
        this.m_blinkDistance = data.dist;
        this.m_blinkTarget = data.creep;
        this.owner.WaypointTo(new Point(this.m_blinkTarget!.x, this.m_blinkTarget!.y), this.m_blinkTarget instanceof getBFOUNDATION() ? this.m_blinkTarget as BFOUNDATION : null);
        this.m_blinkPoints = this.m_maxBlinkPoints;
        this.owner.graphic.alpha = 0.3;
        ++this.owner.targetableStatus;
        this.m_attacks = 0;
    }

    private stopBlink(): void {
        this.owner._atTarget = true;
        this.owner.graphic.alpha = 1;
        this.m_blinkPoints = 0;
        this.m_blinkDistance = 0;
        this.m_blinkTarget = null;
        --this.owner.targetableStatus;
    }

    public onAttack(target: IAttackable, damage: number, source: ITargetable | null = null): number {
        ++this.m_attacks;
        if (this.m_attacks >= this.m_attacksToBlink) {
            this.attemptBlink();
        }
        return damage;
    }

    private attemptBlink(): void {
        if (!this.isBlinking()) {
            const newTarget: Record<string, any> | null = this.getNewBlinkTarget();
            if (newTarget) {
                this.startBlink(newTarget);
            }
        }
    }

    private getNewBlinkTarget(): Record<string, any> | null {
        const buildings: Array<any> = getTargeting().getBuildingsInRange(this.m_maxBlinkDistance, new Point(this.owner.x, this.owner.y));
        for (let i = 0; i < buildings.length; i++) {
            if (buildings[i].creep === this.owner._targetBuilding) {
                buildings.splice(i, 1);
                break;
            }
        }
        if (buildings.length > 0) {
            const randomIdx: number = Math.floor(Math.random() * (buildings.length - 1));
            return buildings[randomIdx];
        }
        return null;
    }

    public isBlinking(): boolean {
        return this.m_blinkPoints !== 0;
    }
}
