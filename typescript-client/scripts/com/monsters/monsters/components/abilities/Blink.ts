import Point from "openfl/geom/Point";

import { Component } from "../Component";

/**
 * Blink - teleportation ability that moves creature along waypoints.
 */
export class Blink extends Component {
    protected m_maxBlinkPoints: number;
    protected m_blinkDistance: number = 0;
    protected m_blinkPoints: number = 0;

    constructor(maxBlinkPoints: number = 10) {
        super();
        this.m_maxBlinkPoints = maxBlinkPoints;
    }

    private isWithinBlinkRange(): boolean {
        const waypoints: Array<Point> = this.owner._waypoints;
        const waypointCount: number = waypoints.length;
        const powerLevel: number = this.owner.powerUpLevel();
        if (this.owner._hasPath && waypointCount !== 0 && waypointCount < powerLevel * 5) {
            const diff: Point = this.owner._tmpPoint.subtract(waypoints[waypointCount - 1]);
            const distSqrd: number = diff.x * diff.x + diff.y * diff.y;
            let maxDist: number = powerLevel * 150;
            maxDist *= maxDist;
            if (distSqrd <= maxDist) {
                return true;
            }
        }
        return false;
    }

    public override tick(delta: number = 1): void {
        if (!this.owner._atTarget && this.isWithinBlinkRange()) {
            const waypoints: Array<Point> = this.owner._waypoints;
            const currentPos: Point = new Point(this.owner.x, this.owner.y);
            const hasPath: boolean = this.owner._hasPath;
            if (this.m_blinkPoints) {
                if (this.m_blinkPoints > 0 && hasPath) {
                    if (waypoints.length > 0) {
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
                } else {
                    this.stopBlink();
                }
            } else if (hasPath && waypoints.length > 0) {
                this.startBlink(currentPos.subtract(waypoints[waypoints.length - 1]).length / 10);
            }
        } else if (this.m_blinkPoints) {
            this.stopBlink();
        }
    }

    private startBlink(distance: number): void {
        this.m_blinkPoints = this.m_maxBlinkPoints;
        this.m_blinkDistance = distance;
        this.owner.graphic.alpha = 0.3;
        ++this.owner.targetableStatus;
        console.log("starting blink");
    }

    private stopBlink(): void {
        this.owner._atTarget = true;
        this.owner.graphic.alpha = 1;
        this.m_blinkPoints = 0;
        --this.owner.targetableStatus;
        console.log("stopping blink");
    }
}
