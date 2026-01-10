import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

import { InstanceManager } from "../managers/InstanceManager";
import { PATHING } from "../pathing/PATHING";
import { IPROCESS } from "./IPROCESS";
import { Solution } from "./Solution";

import { BASE } from "../../../BASE";
import { BFOUNDATION } from "../../../BFOUNDATION";
import { BRESOURCE } from "../../../BRESOURCE";
import { BTOWER } from "../../../BTOWER";
import { BTRAP } from "../../../BTRAP";
import { BUILDING6 } from "../../../BUILDING6";
import { BUILDING14 } from "../../../BUILDING14";
import { BWALL } from "../../../BWALL";
import { CREATURELOCKER } from "../../../CREATURELOCKER";
import { GLOBAL } from "../../../GLOBAL";
import { GRID } from "../../../GRID";
import { WMATTACK } from "../../../WMATTACK";

/**
 * PROCESS4 - AI attack strategy using swarm tactics (Kozu tribe).
 * Targets resource buildings with large numbers of fodder creatures.
 */
export class PROCESS4 implements IPROCESS {
    public _solutions: Solution[] = [];
    private solsProcessed: number = 0;
    public _inProgress: boolean = false;
    public _intelligence: number = 1;
    private processStepResolution: number = 3;

    constructor() {}

    public Trigger(intelligence: number = 1): void {
        this._intelligence = intelligence;
        this._inProgress = true;
        this._solutions = [];
        const mapWidth = GLOBAL._mapWidth;
        const mapHeight = GLOBAL._mapHeight;
        
        for (let i = 0; i < WMATTACK._attackResolution; i++) {
            this._solutions.push(new Solution(360 / WMATTACK._attackResolution * i, mapWidth, mapHeight));
        }
        
        this.solsProcessed = 0;
        this.Process(this._solutions[0], this.onProcess.bind(this));
    }

    public Process(solution: Solution, callback: Function): void {
        const buildings: { building: BFOUNDATION; distance: number }[] = [];
        const allBuildings = InstanceManager.getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        
        for (const building of allBuildings) {
            if (building.health > 0 && !(building as any)._looted && 
                (building instanceof BRESOURCE || building instanceof BUILDING6 || building instanceof BUILDING14)) {
                const pos = GRID.FromISO(building.x, building.y);
                const distance = Point.distance(solution.entryPoint, pos);
                buildings.push({
                    building: building,
                    distance: distance
                });
            }
        }
        
        if (buildings.length > 0) {
            buildings.sort((a, b) => a.distance - b.distance);
            solution.targetBuilding = buildings[0].building;
            solution.wayPoints = PATHING.GetPath(
                GRID.ToISO(solution.entryPoint.x, solution.entryPoint.y, 0),
                new Rectangle(
                    solution.targetBuilding.x,
                    solution.targetBuilding.y,
                    solution.targetBuilding._footprint[0].width,
                    solution.targetBuilding._footprint[0].height
                ),
                callback
            );
        }
    }

    public onProcess(wayPoints: any[], targetBuilding: BFOUNDATION | null = null, value: number = 0, flag: boolean = false, secondaryBuilding: BFOUNDATION | null = null): void {
        this._solutions[this.solsProcessed].wayPoints = wayPoints;
        this._solutions[this.solsProcessed].distanceToTarget = wayPoints.length;
        this.solsProcessed++;
        
        if (this.solsProcessed < WMATTACK._attackResolution) {
            this.Process(this._solutions[this.solsProcessed], this.onProcess.bind(this));
        } else {
            this.beginProcessB();
        }
    }

    public beginProcessB(): void {
        const sortedSolutions: Solution[] = [];
        
        for (const solution of this._solutions) {
            this.ProcessB(solution);
            sortedSolutions.push(solution);
        }
        
        sortedSolutions.sort((a, b) => {
            if (b.damageTaken !== a.damageTaken) {
                return b.damageTaken - a.damageTaken;
            }
            return b.distanceToTarget - a.distanceToTarget;
        });
        
        const chosenIndex = Math.floor((sortedSolutions.length - 1) * this._intelligence);
        this.ProcessC(sortedSolutions[chosenIndex]);
        this._inProgress = false;
        WMATTACK.Queue(sortedSolutions[chosenIndex]);
    }

    public ProcessB(solution: Solution): void {
        for (let i = 0; i < solution.wayPoints.length; i += this.processStepResolution) {
            solution.damageTaken += WMATTACK._damageBias * this.processStepResolution * WMATTACK.dpsAtPoint(solution, solution.wayPoints[i]);
        }
    }

    public ProcessC(solution: Solution): void {
        const attack: { [key: string]: number } = {};
        
        for (let i = 0; i < WMATTACK._monsterKeys.length; i++) {
            attack[WMATTACK._monsterKeys[i]] = 0;
        }
        
        const allBuildings = InstanceManager.getInstancesByClass(BFOUNDATION) as BFOUNDATION[];
        let volume = 0;
        
        for (const building of allBuildings) {
            if ((building as any)._class === "special" || 
                building instanceof BTOWER || 
                building instanceof BTRAP || 
                building instanceof BWALL || 
                building instanceof BRESOURCE) {
                const multiplier = (building instanceof BTRAP || building instanceof BWALL) ? 0.2 : 1.4;
                volume += multiplier * WMATTACK._attackVolumeAmplifier;
            }
        }
        
        const intelligenceModifier = this._intelligence * 0.5 + 0.5;
        volume = Math.floor(volume * intelligenceModifier);
        const attackVolume = volume;
        
        let levelRatio = BASE.BaseLevel().level / 40;
        if (levelRatio < 0) levelRatio = 0;
        if (levelRatio > 1) levelRatio = 1;
        
        const fodderIndex = Math.floor((WMATTACK._fodder.length - 1) * levelRatio);
        const fodderLow = fodderIndex === 0 ? fodderIndex : fodderIndex - 1;
        const fodderHigh = fodderIndex === WMATTACK._fodder.length - 1 ? fodderIndex : fodderIndex + 1;
        
        const fodder1 = String(WMATTACK._fodder[fodderLow]);
        const fodder2 = String(WMATTACK._fodder[fodderIndex]);
        const fodder3 = String(WMATTACK._fodder[fodderHigh]);
        
        let travelTime = 0;
        const distances: { [key: string]: number } = {};
        const baseDistance = GLOBAL._mapWidth * 0.25;
        const minDistance = 100;
        const targetDistance = Point.distance(solution.entryPoint, new Point(solution.targetBuilding.x, solution.targetBuilding.y));
        const adjustedDistance = targetDistance < minDistance ? baseDistance + (minDistance - targetDistance) : baseDistance;
        
        if (travelTime === 0) {
            travelTime = adjustedDistance / CREATURELOCKER._creatures[fodder1].props.speed[0];
        }
        
        distances[fodder1] = travelTime * CREATURELOCKER._creatures[fodder1].props.speed[0];
        distances[fodder2] = travelTime * CREATURELOCKER._creatures[fodder2].props.speed[0];
        distances[fodder3] = travelTime * CREATURELOCKER._creatures[fodder3].props.speed[0];
        
        attack[fodder1] += Math.floor(0.33 * attackVolume);
        attack[fodder2] += Math.floor(0.33 * attackVolume);
        attack[fodder3] += Math.floor(0.33 * attackVolume);
        
        // Remove zero counts
        for (const key in attack) {
            if (attack[key] === 0) {
                delete attack[key];
            }
        }
        
        solution.attack = attack;
        solution.distances = distances;
    }
}
