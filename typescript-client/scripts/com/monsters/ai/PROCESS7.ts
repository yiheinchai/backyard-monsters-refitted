import Point from "openfl/geom/Point";
import Rectangle from "openfl/geom/Rectangle";

import { InstanceManager } from "../managers/InstanceManager";
import { PATHING } from "../pathing/PATHING";
import { IPROCESS } from "./IPROCESS";
import { Solution } from "./Solution";

import { BASE } from "../../../BASE";
import { BFOUNDATION } from "../../../BFOUNDATION";
import { BRESOURCE } from "../../../BRESOURCE";
import { BUILDING6 } from "../../../BUILDING6";
import { BUILDING14 } from "../../../BUILDING14";
import { CREATURELOCKER } from "../../../CREATURELOCKER";
import { GLOBAL } from "../../../GLOBAL";
import { GRID } from "../../../GRID";
import { WMATTACK } from "../../../WMATTACK";

/**
 * PROCESS7 - AI attack strategy (Dreadnaut/Nerd tribe).
 * Balanced approach with looters and tanks based on damage assessment.
 */
export class PROCESS7 implements IPROCESS {
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
            if (b.damageTaken !== a.damageTaken) return b.damageTaken - a.damageTaken;
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
            const buildingClass = (building as any)._class;
            if (buildingClass === "special" || buildingClass === "tower" || 
                buildingClass === "trap" || buildingClass === "wall" || 
                buildingClass === "resource") {
                const multiplier = (buildingClass === "trap" || buildingClass === "wall") ? 0.15 : 1;
                volume += multiplier * WMATTACK._attackVolumeAmplifier;
            }
        }
        
        const intelligenceModifier = this._intelligence * 0.5 + 0.5;
        volume = Math.floor(volume * intelligenceModifier);
        
        let looterCount: number;
        let tankCount: number;
        
        if (solution.damageTaken > 0) {
            let ratio = solution.resourcesGained / (solution.damageTaken + solution.resourcesGained);
            if (ratio < 0.5) ratio = 0.5;
            looterCount = ratio * volume;
            tankCount = volume - looterCount;
        } else {
            looterCount = volume;
            tankCount = 0;
        }
        
        let levelRatio = BASE.BaseLevel().level / 40;
        if (levelRatio < 0) levelRatio = 0;
        if (levelRatio > 1) levelRatio = 1;
        
        const looterType = String(WMATTACK._looters[Math.floor((WMATTACK._looters.length - 2) * levelRatio) + 1]);
        const tankType = String(WMATTACK._tanks[Math.floor((WMATTACK._tanks.length - 1) * levelRatio)]);
        
        let travelTime = 0;
        const distances: { [key: string]: number } = {};
        const baseDistance = GLOBAL._mapWidth * 0.25;
        const minDistance = 100;
        const targetDistance = Point.distance(solution.entryPoint, new Point(solution.targetBuilding.x, solution.targetBuilding.y));
        const adjustedDistance = targetDistance < minDistance ? baseDistance + (minDistance - targetDistance) : baseDistance;
        
        if (tankCount >= 1) {
            if (travelTime === 0) {
                travelTime = adjustedDistance / CREATURELOCKER._creatures[tankType].props.speed[0];
            }
            distances[tankType] = travelTime * CREATURELOCKER._creatures[tankType].props.speed[0];
        }
        
        if (looterCount >= 1) {
            if (travelTime === 0) {
                travelTime = adjustedDistance / CREATURELOCKER._creatures[looterType].props.speed[0];
            }
            distances[looterType] = travelTime * CREATURELOCKER._creatures[looterType].props.speed[0];
        }
        
        if (tankType === "C12") {
            tankCount = Math.ceil(tankCount / 2);
        }
        
        if (looterType === "C14") {
            looterCount = Math.ceil(looterCount / 2.5);
        }
        
        attack[looterType] = Math.floor(looterCount);
        attack[tankType] = Math.floor(tankCount);
        
        const tanks: { [key: string]: number } = {};
        tanks[tankType] = Math.floor(tankCount);
        
        const looters: { [key: string]: number } = {};
        looters[looterType] = Math.floor(looterCount);
        
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
